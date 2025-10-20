![tag:innovationlab](https://img.shields.io/badge/innovationlab-3D8BD3)
![tag:hackathon](https://img.shields.io/badge/hackathon-5F43F1)

🌍 Overview

AIASI is an autonomous AI agent built for the ASI Agents Track hackathon by the Artificial Superintelligence Alliance (ASI Alliance).
It uses the Fetch.ai uAgents framework to communicate, make decisions, and interact with users through the ASI:One interface and Agentverse.

🧠 Features

Built with Python 3.10+

Uses Fetch.ai’s uAgents framework

Implements chat protocol for agent-to-agent and ASI:One communication

Automatically publishes its manifest to Agentverse

Compatible with ASI:One chat interface (https://asi1.ai/chat)

Ready for integration with MeTTa Knowledge Graphs

🏗️ Tech Stack

Python 3.10+

uAgents (from Fetch.ai)

uagents-core

EVM-based architecture (replacing Solana) for on-chain compatibility

⚙️ Installation & Setup


1. Clone this repository
git clone https://github.com/Ethaga/AIASI.git
cd AIASI

2. Create a virtual environment
python3 -m venv venv
source venv/bin/activate   # macOS/Linux
venv\Scripts\activate      # Windows

3. Install dependencies
pip install -r requirements.txt

4. Run the agent
python main.py


You should see logs like:

Agent started...
Published manifest to Agentverse
Listening for chat messages...

🔍 Verification on Agentverse

Once the agent is running, it will publish its manifest to Agentverse
.
You can search for your agent by its address or name (displayed in the terminal).

Example:

Agent name: AIASI
Agent address: agent1q2w3e4r5t6y7u8i9o0p

💬 Interaction via ASI:One

Once your agent is visible on Agentverse, you can communicate with it through ASI:One:
👉 https://asi1.ai/chat

Example response:

User: Hello!
AIASI: Hello from AIASI — your autonomous AI assistant.

📦 File Structure
AIASI/
├── main.py              # Core agent logic
├── requirements.txt     # Dependencies
├── README.md            # Project documentation

🧩 Extend with MeTTa (optional)

You can integrate structured reasoning with the MeTTa language
.
Example: connect your agent to a MeTTa-based knowledge graph for adaptive decision-making.

🧾 Requirements.txt
uagents>=0.9.0
uagents-core>=0.3.0

🚀 Future Plans

Integrate MeTTa for reasoning

Connect EVM smart contracts for on-chain automation

Expand multi-agent collaboration within ASI ecosystem

🏁 Submission

This project is submitted to the ASI Agents Track Hackathon via Superteam Earn
.










