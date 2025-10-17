from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from uagents import Bureau
from agent import cypher_agent, ChatMessage

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

bureau = Bureau()
bureau.add(cypher_agent)

@app.get("/ask")
async def ask_agent(q: str = Query(...)):
    msg = ChatMessage(sender="frontend_user", message=q)
    result = await bureau.sync_request(cypher_agent.address, msg, ChatMessage)
    if result:
        return {"reply": result.message}
    else:
        return {"reply": "Cypherpunk node is offline or unreachable."}

if __name__ == "__main__":
    bureau.run()
