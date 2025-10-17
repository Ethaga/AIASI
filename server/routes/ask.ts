import { RequestHandler } from "express";

export const handleAsk: RequestHandler = (req, res) => {
  const q = (req.body && req.body.q) || req.query.q;
  if (!q) {
    return res.status(400).json({ error: "Missing 'q' in request" });
  }

  // Fast echo response to keep agent latency low
  const reply = `Echo: ${String(q)}`;
  res.status(200).json({ reply });
};
