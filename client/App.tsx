import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

import TerminalHeader from "@/components/TerminalHeader";
import { useEffect } from "react";
import { connectWallet, sendMessage, pingAgent } from "@/lib/agentTerminal";

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppShell />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

function AppShell() {
  useEffect(() => {
    (window as any).connectWallet = connectWallet;
    (window as any).sendMessage = sendMessage;
    (window as any).pingAgent = pingAgent;

    // attempt to ping agent once on load
    pingAgent().catch(() => {});
  }, []);

  return (
    <div className="min-h-screen flex flex-col font-mono bg-cyber">
      <TerminalHeader />
      <Routes>
        <Route path="/" element={<Index />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <footer className="mt-auto w-full py-3">
        <div
          id="statusBar"
          className="text-center text-[0.9rem] text-[#39ff14] drop-shadow-[0_0_5px_#39ff14]"
        >
          🔗 Connected to Agentverse
        </div>
      </footer>
    </div>
  );
}

export default App;
