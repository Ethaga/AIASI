from fastapi import FastAPI, Request, Query
from fastapi.middleware.cors import CORSMiddleware
from uagents import Bureau
import asyncio
import httpx

# Import the local agent.py reliably regardless of the current working directory
import importlib.util
import os
import sys

_HERE = os.path.dirname(__file__)
_AGENT_PATH = os.path.join(_HERE, "agent.py")
spec = importlib.util.spec_from_file_location("asi_agent_backend_agent", _AGENT_PATH)
agent_mod = importlib.util.module_from_spec(spec)
sys.modules[spec.name] = agent_mod
spec.loader.exec_module(agent_mod)

cypher_agent = agent_mod.cypher_agent
ChatMessage = agent_mod.ChatMessage

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://spectacular-buttercream-44383a.netlify.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

bureau = Bureau()
bureau.add(cypher_agent)

@app.get("/ask")
async def ask_agent(q: str = Query(...)):
    msg = ChatMessage(sender="frontend_user", message=q)
    # Try using Bureau.sync_request if available (older/newer uagents API differences)
    fallback_reply = "⚡ System online. Awaiting next encrypted command."
    if hasattr(bureau, 'sync_request'):
        try:
            result = await asyncio.wait_for(
                bureau.sync_request(cypher_agent.address, msg, ChatMessage),
                timeout=3.0,
            )
        except (asyncio.TimeoutError, Exception):
            return {"reply": fallback_reply}
        if result:
            return {"reply": result.message}
        else:
            return {"reply": "Cypherpunk node is offline or unreachable."}
    # Fallback: directly dispatch to agent.handle_message (synchronous local call)
    # Try HTTP submit endpoint on the local agent as a synchronous fallback
    try:
        async with httpx.AsyncClient() as client:
            payload = {"sender": msg.sender, "message": msg.message}
            # agent's HTTP submit endpoint typically accepts POST JSON and may return JSON
            try:
                r = await asyncio.wait_for(
                    client.post("http://localhost:8001/submit", json=payload, timeout=5.0),
                    timeout=3.0,
                )
            except (asyncio.TimeoutError, Exception):
                return {"reply": fallback_reply}
            if r.status_code == 200:
                try:
                    data = r.json()
                    # If agent returns a ChatMessage-like dict
                    reply = data.get("message") if isinstance(data, dict) else None
                    if reply:
                        return {"reply": reply}
                except Exception:
                    pass
                return {"reply": "Message delivered to agent (no text reply parsed)."}
            else:
                # Treat non-200 as agent slow/unavailable and return instant fallback
                return {"reply": fallback_reply}
    except Exception as e:
        return {"reply": f"Failed to deliver message to agent via HTTP: {e}"}


# Fast POST endpoint for quick frontend checks
@app.post("/ask")
async def ask(request: Request):
    data = await request.json()
    q = data.get("q", "")
    print(f"Received: {q}")
    return {"reply": f"Agent received: {q}"}

if __name__ == "__main__":
    bureau.run()
