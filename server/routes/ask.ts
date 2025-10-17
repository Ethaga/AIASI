import { RequestHandler } from "express";

function generateReply(q: string) {
  const text = String(q).trim();
  const lower = text.toLowerCase();

  // Simple rule-based conversational replies in English
  if (/^\s*(hi|hello|hey)\b/.test(lower)) {
    return "Hello! How can I help you today?";
  }

  if (lower.includes("how are you") || lower.includes("how's it going")) {
    return "I'm doing well, thanks! How about you?";
  }

  if (text.endsWith("?")) {
    return `Good question — briefly: ${text.replace(/\?+$/g, "")}. If you'd like a longer answer, ask for more details.`;
  }

  // If the user asks to 'follow' or 'echo', explain difference
  if (lower.includes("echo") || lower.includes("follow") || lower.includes("repeat")) {
    return "It seems you want the agent to just repeat messages. I can provide meaningful responses — try asking a question or adding a '?' for inquiries.";
  }

  // Default: provide a helpful paraphrase + follow-up question
  return `I received: "${text}". Could you clarify what you mean or ask something more specific?`;
}

export const handleAsk: RequestHandler = (req, res) => {
  const q = (req.body && req.body.q) || req.query.q;
  if (!q) {
    return res.status(400).json({ error: "Missing 'q' in request" });
  }

  const reply = generateReply(String(q));
  // Return both reply and message for client compatibility
  res.status(200).json({ reply, message: reply });
};
