# ASI Agent Backend (Cypherpunk Edition)

This backend powers the **ASI Agent Terminal** built in Builder.io.  
It uses Fetch.ai's uAgents framework and exposes a `/ask` endpoint for chat relay.

### Run locally
```bash
pip install -r requirements.txt
python agent.py
uvicorn server:app --host 0.0.0.0 --port 8000
Your public endpoint (for Builder.io) will look like:
https://<your-username>-8000.app.github.dev/ask

Connect to Builder.io
In your Builder project, set:

javascript
Salin kode
window.AGENT_ENDPOINT = "https://<your-username>-8000.app.github.dev/ask";
Then the neon terminal UI will connect directly to this backend.
