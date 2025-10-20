import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { handleAsk } from "./routes/ask";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);
  app.post("/api/ask", handleAsk);

  app.get("/api/agent/info", (_req, res) => {
    const info = {
      endpoint: process.env.AGENT_ENDPOINT || process.env.AGENT_BACKEND_URL || null,
      address: process.env.AGENT_PUBLIC_ADDRESS || null,
      chatProtocol: "fetchai-uagents-chat-v1",
      metta: {
        enabled: !!process.env.AGENT_METTA_KB,
      },
    } as const;
    res.json(info);
  });

  return app;
}
