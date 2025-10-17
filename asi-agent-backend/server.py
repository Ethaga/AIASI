from fastapi import FastAPI, Request, Query
from fastapi.middleware.cors import CORSMiddleware
from uagents import Bureau
from agent import cypher_agent, ChatMessage
import uuid
import httpx

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
    if hasattr(bureau, 'sync_request'):
        result = await bureau.sync_request(cypher_agent.address, msg, ChatMessage)
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
            r = await client.post("http://localhost:8001/submit", json=payload, timeout=5.0)
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
                return {"reply": f"Agent HTTP submit returned status {r.status_code}."}
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
