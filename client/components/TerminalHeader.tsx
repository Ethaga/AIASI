import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function TerminalHeader() {
  return (
    <header className={cn(
      "w-full sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-background/60",
      "border-b border-cyan-500/20 shadow-[0_0_30px_-5px_rgba(0,255,255,0.25)]"
    )}>
      <div className="mx-auto max-w-7xl px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative h-9 w-9">
            <span className="absolute inset-0 rounded-full bg-gradient-to-br from-[#5F43F1] via-[#00FFFF] to-[#39FF14] animate-spin-slower shadow-[0_0_20px_4px_rgba(0,255,255,0.3)]" />
            <span className="absolute inset-[3px] rounded-full bg-black/90 border border-cyan-400/50" />
            <svg
              viewBox="0 0 24 24"
              className="absolute inset-0 m-auto h-5 w-5 text-cyan-400 drop-shadow-[0_0_10px_rgba(0,255,255,0.8)]"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M12 3l2.5 4.33L19.5 9 17 13.33 17.5 19 12 17l-5.5 2 1-5.67L4.5 9l5-1.67L12 3z" />
            </svg>
          </div>
          <h1 className="text-xl md:text-2xl font-extrabold tracking-wider text-cyan-300 neon-text">
            ASI Agent Terminal
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <div id="walletStatus" className="hidden md:block text-cyan-300 text-sm drop-shadow-[0_0_8px_rgba(0,255,255,0.6)]"></div>
          <Button
            onClick={() => (window as any).connectWallet?.()}
            className={cn(
              "neon-button text-black font-bold",
              "bg-[linear-gradient(90deg,#5F43F1,#00FFFF)] text-slate-900"
            )}
          >
            Connect Wallet
          </Button>
        </div>
      </div>
    </header>
  );
}
