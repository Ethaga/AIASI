from uagents import Agent, Context, Model
from datetime import datetime
import os
import re
from typing import List

# Optional MeTTa integration (SingularityNET / Hyperon)
try:
    from hyperon import MeTTa, E, S, V  # type: ignore
    METTA_AVAILABLE = True
except Exception:
    MeTTa = None  # type: ignore
    E = S = V = None  # type: ignore
    METTA_AVAILABLE = False

# Initialize MeTTa interpreter if available
_METTA = None
if METTA_AVAILABLE:
    _METTA = MeTTa()
    kb = os.environ.get("AGENT_METTA_KB", "").strip()
    if kb:
        # Load provided KB at startup
        try:
            _METTA.run(kb)
        except Exception:
            pass

class ChatMessage(Model):
    sender: str
    message: str

cypher_agent = Agent(
    name="cypherpunk_agent",
    seed="freedom_through_code",
    port=8001,
    endpoint=["http://localhost:8001/submit"],
)


def _run_metta(code: str) -> List[str]:
    if not (METTA_AVAILABLE and _METTA):
        return [
            "MeTTa engine not available. Install 'hyperon' Python package to enable knowledge graph queries.",
        ]
    try:
        result = _METTA.run(code)
        return [str(item) for item in result]
    except Exception as e:
        return [f"MeTTa error: {type(e).__name__}: {e}"]


def _query_metta(pattern: str) -> List[str]:
    if not (METTA_AVAILABLE and _METTA):
        return [
            "MeTTa engine not available. Install 'hyperon' Python package to enable knowledge graph queries.",
        ]
    try:
        # Support either raw pattern or quoted atom-like pattern
        pat = pattern.strip()
        atom = _METTA.parse_single(pat)
        results = _METTA.space().query(atom)
        # results is a list of bindings like { $x <- Pam }
        if not results:
            return ["No matches."]
        return [str(b) for b in results]
    except Exception as e:
        return [f"Query error: {type(e).__name__}: {e}"]


def _extract_metta_block(text: str) -> str | None:
    # Support ```metta ... ``` fenced blocks
    m = re.search(r"```metta\n([\s\S]*?)```", text, flags=re.IGNORECASE)
    if m:
        return m.group(1).strip()
    return None


@cypher_agent.on_message(model=ChatMessage)
async def handle_chat(ctx: Context, msg: ChatMessage):
    ctx.logger.info(f"Message from {msg.sender}: {msg.message}")
    timestamp = datetime.utcnow().isoformat()
    text = msg.message.strip()
    low = text.lower()

    reply_text: str

    # MeTTa fenced block
    code_block = _extract_metta_block(text)
    if code_block:
        lines = _run_metta(code_block)
        reply_text = "\n".join([f"[MeTTa] {line}" for line in lines])
    # Prefix forms: metta: <program>
    elif low.startswith("metta:") or low.startswith("metta "):
        code = text.split(":", 1)[1].strip() if ":" in text else text.split(" ", 1)[1].strip()
        lines = _run_metta(code)
        reply_text = "\n".join([f"[MeTTa] {line}" for line in lines])
    # Query pattern: query: (<pattern>)
    elif low.startswith("query:") or low.startswith("query "):
        pat = text.split(":", 1)[1].strip() if ":" in text else text.split(" ", 1)[1].strip()
        lines = _query_metta(pat)
        reply_text = "\n".join([f"[Query] {line}" for line in lines])
    else:
        reply_text = (
            f"[{timestamp}] Cypherpunk node online.\n"
            f"Message received: '{msg.message}'.\n"
            f"Autonomy is resistance."
        )

    await ctx.send(
        msg.sender,
        ChatMessage(sender=cypher_agent.address, message=reply_text),
    )


if __name__ == "__main__":
    cypher_agent.run()
