function escapeHtml(unsafe: string) {
  return unsafe
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export async function connectWallet() {
  if ((window as any).ethereum) {
    try {
      const accounts = await (window as any).ethereum.request({
        method: "eth_requestAccounts",
      });
      const addr = accounts[0] as string;
      const el = document.getElementById("walletStatus");
      if (el) {
        el.innerHTML = `🟢 Wallet Connected: ${addr.slice(0, 6)}...${addr.slice(-4)}`;
      }
    } catch (err) {
      console.error("Wallet connection failed:", err);
    }
  } else {
    alert("No Web3 wallet found. Please install MetaMask or Brave Wallet.");
  }
}

export async function pingAgent() {
  const statusEl = document.querySelector("#statusBar") as HTMLElement | null;
  const API_URL = import.meta.env.VITE_API_URL || "/.netlify/functions";
  const endpoint =
    (window as any).AGENT_ENDPOINT || `${API_URL}/ask`;
  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: "ping" }),
    });
    if (statusEl) {
      if (res.ok) {
        statusEl.textContent = "🟢 Agent online";
        console.log("✅ Connected to ASI Agent Backend");
      } else {
        statusEl.textContent = "🟠 Agent responding slowly";
        console.warn("⚠️ Partial connection to agent backend");
      }
    }
  } catch (err) {
    if (statusEl) statusEl.textContent = "🔴 Agent unreachable";
    console.error("❌ Agent endpoint unreachable:", err);
  }
}

export async function sendMessage(userText?: string) {
  const inputEl = document.getElementById(
    "userInput",
  ) as HTMLInputElement | null;
  const chatBox = document.getElementById("chatBox");
  const text = (userText ?? inputEl?.value ?? "").trim();
  if (!text) return;

  if (chatBox) {
    chatBox.innerHTML += `<div class='user'>You: ${escapeHtml(text)}</div>`;
  }

  const API_URL = import.meta.env.VITE_API_URL || "/.netlify/functions";
  const endpoint =
    (window as any).AGENT_ENDPOINT || `${API_URL}/ask`;

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text }),
    });

    let data: any = null;
    try {
      const contentType = (res.headers.get("content-type") || "").toLowerCase();
      if (contentType.includes("application/json")) {
        // clone the response before parsing to avoid "body stream already read"
        data = await res.clone().json();
      } else {
        const txt = await res.text();
        try {
          data = JSON.parse(txt);
        } catch {
          data = { reply: txt };
        }
      }
    } catch (parseErr) {
      console.warn(
        "Failed to parse response body as JSON, falling back to text:",
        parseErr,
      );
      try {
        const txt = await res.text();
        data = { reply: txt };
      } catch {
        data = { reply: "..." };
      }
    }

    const reply = (data && (data.reply ?? data.message)) ?? "...";
    if (chatBox)
      chatBox.innerHTML += `<div class='agent'>Agent: ${escapeHtml(String(reply))}</div>`;
  } catch (err) {
    if (chatBox)
      chatBox.innerHTML += `<div class='agent error'>Agent: unreachable ⚠️</div>`;
    console.error(err);
  }

  if (inputEl) inputEl.value = "";
  if (chatBox) chatBox.scrollTop = chatBox.scrollHeight;
}

// expose to window for legacy handlers
(window as any).pingAgent = pingAgent;
(window as any).sendMessage = sendMessage;
