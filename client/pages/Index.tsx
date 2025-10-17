import { useEffect } from "react";

export default function Index() {
  useEffect(() => {
    (window as any).connectWallet = (window as any).connectWallet || undefined;
    (window as any).sendMessage = (window as any).sendMessage || undefined;
  }, []);

  return (
    <main className="min-h-[calc(100vh-92px-48px)] px-4">
      <section className="max-w-3xl mx-auto mt-10 md:mt-14">
        <div
          id="chatBox"
          className="chat-box rounded-xl backdrop-blur bg-cyan-300/5 border border-cyan-400/30 shadow-[0_0_30px_-5px_rgba(0,255,255,0.25)]"
        ></div>

        <div className="mt-4 flex items-center gap-3">
          <input
            id="userInput"
            type="text"
            placeholder="Type your message to the ASI agent..."
            onKeyDown={(e) => {
              if (e.key === "Enter") (window as any).sendMessage?.();
            }}
            className="w-full md:w-3/4 px-4 py-3 rounded-lg outline-none font-mono text-cyan-200 placeholder:text-cyan-500/70 bg-black/80 border border-cyan-400/60 focus:border-cyan-300 focus:ring-2 focus:ring-cyan-400/50"
          />
          <button
            onClick={() => (window as any).sendMessage?.()}
            className="neon-button px-4 py-3 rounded-lg text-sm md:text-base font-bold bg-[linear-gradient(90deg,#5F43F1,#00FFFF)] text-slate-900"
          >
            Send
          </button>
        </div>
      </section>
    </main>
  );
}
