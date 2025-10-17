#!/usr/bin/env python3
"""
Register a chat agent with Agentverse using uagents-core.
Requirements: Python 3.10+, create a virtualenv, pip install uagents-core
Set environment variables AGENTVERSE_KEY and AGENT_SEED_PHRASE before running.
"""
import os
from uagents_core.utils.registration import (
    register_chat_agent,
    RegistrationRequestCredentials,
)

def main():
    key = os.environ.get("AGENTVERSE_KEY")
    seed = os.environ.get("AGENT_SEED_PHRASE")
    print("AGENTVERSE_KEY present:", bool(key))
    print("AGENT_SEED_PHRASE present:", bool(seed))
    if not key or not seed:
        print("Missing AGENTVERSE_KEY or AGENT_SEED_PHRASE. Aborting.")
        return

    try:
        register_chat_agent(
            "AI ASI",
            "https://aiasiterminal.netlify.app/",
            active=True,
            credentials=RegistrationRequestCredentials(
                agentverse_api_key=key,
                agent_seed_phrase=seed,
            ),
        )
        print("Registration call completed (check Agentverse dashboard for agent status).")
    except Exception as e:
        print("Registration error:", type(e), e)

if __name__ == "__main__":
    main()
