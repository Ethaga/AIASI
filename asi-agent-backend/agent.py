from uagents import Agent, Context, Model
from datetime import datetime

class ChatMessage(Model):
    sender: str
    message: str

cypher_agent = Agent(
    name="cypherpunk_agent",
    seed="freedom_through_code",
    port=8001,
    endpoint=["http://localhost:8001/submit"]
)

@cypher_agent.on_message(model=ChatMessage)
async def handle_chat(ctx: Context, msg: ChatMessage):
    ctx.logger.info(f"Message from {msg.sender}: {msg.message}")
    timestamp = datetime.utcnow().isoformat()

    reply_text = f"[{timestamp}] Cypherpunk node online.\\nMessage received: '{msg.message}'.\\nAutonomy is resistance."

    await ctx.send(msg.sender, ChatMessage(sender=cypher_agent.address, message=reply_text))

if __name__ == "__main__":
    cypher_agent.run()
