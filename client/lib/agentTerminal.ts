export async function connectWallet() {
  if ((window as any).ethereum) {
    try {
      const accounts = await (window as any).ethereum.request({ method: "eth_requestAccounts" });
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

export async function sendMessage() {
  const inputEl = document.getElementById("userInput") as HTMLInputElement | null;
  const chatBox = document.getElementById("chatBox");
  const input = inputEl?.value.trim() ?? "";
  if (!input) return;
  if (chatBox) chatBox.innerHTML += `</p><p>You: ${input}</p><p>`;

  try {
    const res = await fetch(`https://your-codespace-url/ask?q=${encodeURIComponent(input)}`);
    const data = await res.json();
    if (chatBox) chatBox.innerHTML += `</p><p>Agent: ${data.reply}</p><p>`;
  } catch (e) {
    if (chatBox) chatBox.innerHTML += `</p><p>Agent: Sorry, the agent endpoint is unreachable.</p><p>`;
  }

  if (inputEl) inputEl.value = "";
  if (chatBox) (chatBox as HTMLElement).scrollTop = (chatBox as HTMLElement).scrollHeight;
}
