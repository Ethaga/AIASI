import { RequestHandler } from "express";

const AGENT_ENDPOINT =
  process.env.AGENT_ENDPOINT || process.env.AGENT_BACKEND_URL || "";

async function forwardToAgentBackend(q: string): Promise<string | null> {
  if (!AGENT_ENDPOINT) return null;
  try {
    const resp = await fetch(AGENT_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ q }),
    });
    const contentType = (resp.headers.get("content-type") || "").toLowerCase();
    if (contentType.includes("application/json")) {
      const data: any = await resp.json().catch(() => null);
      const reply = data && (data.reply ?? data.message);
      return typeof reply === "string" ? reply : null;
    }
    const txt = await resp.text();
    try {
      const data = JSON.parse(txt);
      const reply = data && (data.reply ?? data.message);
      return typeof reply === "string" ? reply : txt;
    } catch {
      return txt;
    }
  } catch {
    return null;
  }
}

function safeEvalMath(expr: string): string | null {
  const cleaned = expr.replace(/\s+/g, "");
  if (!/^[0-9+\-*/().]+$/.test(cleaned)) return null;
  try {
    // eslint-disable-next-line no-new-func
    const val = Function(`return (${cleaned})`)();
    if (typeof val === "number" && Number.isFinite(val)) return String(val);
    return null;
  } catch {
    return null;
  }
}

function extractLocation(text: string): string | null {
  const m = text.match(/in\s+([A-Za-z\s,()'-]+)/i);
  if (m && m[1]) return m[1].trim();
  return null;
}

function generateReply(q: string) {
  const text = String(q).trim();
  const lower = text.toLowerCase();

  // Greetings
  if (
    /^\s*(hi|hello|hey|good morning|good afternoon|good evening)\b/.test(lower)
  ) {
    return "Hello! How can I assist you today?";
  }

  // How are you
  if (lower.includes("how are you") || lower.includes("how's it going")) {
    return "I'm doing well, thank you! How can I help you today?";
  }

  // Weather requests
  if (lower.includes("weather")) {
    const loc = extractLocation(text) || "your area";
    // Simulated quick weather reply (no external API)
    const temp = 18 + (text.length % 10);
    const cond =
      temp > 22 ? "sunny" : temp < 16 ? "chilly and cloudy" : "partly cloudy";
    return `I don't have live weather data, but for ${loc} it's likely ${cond} around ${temp}°C. For real-time data I can integrate a weather API like OpenWeatherMap if you want.`;
  }

  // Time requests
  if (lower.includes("time")) {
    const loc = extractLocation(text);
    const now = new Date();
    if (loc) {
      return `I don't have exact timezone mapping here, but the current UTC time is ${now.toUTCString()}. If you provide a city I can try to compute a local time.`;
    }
    return `The current server time is ${now.toString()} (local) or ${now.toUTCString()} (UTC).`;
  }

  // Math calculations
  if (
    lower.startsWith("calculate") ||
    lower.startsWith("what is") ||
    /[0-9]+\s*[-+/*]\s*[0-9]+/.test(lower)
  ) {
    // Try to extract expression
    const exprMatch = text.match(
      /(?:calculate|what is|what's)?\s*:?\s*([0-9+\-*/().\s]+)/i,
    );
    if (exprMatch && exprMatch[1]) {
      const result = safeEvalMath(exprMatch[1]);
      if (result !== null) return `The result is ${result}.`;
    }
  }

  // Definitions
  if (
    lower.startsWith("define ") ||
    (lower.startsWith("what is ") && lower.includes("meaning"))
  ) {
    const termMatch = text.match(/define\s+(.+)|what is\s+(.+)/i);
    const term = termMatch ? termMatch[1] || termMatch[2] : null;
    if (term)
      return `Definition of ${term.trim()}: (short explanation) — I'm a lightweight local agent; connect a dictionary API for detailed definitions.`;
  }

  // If question mark, try to answer more directly
  if (text.endsWith("?")) {
    return `Here's a direct answer based on common knowledge: ${text.replace(/\?+$/g, "")}. If you want more detail, ask me to expand.`;
  }

  // Default: paraphrase and offer follow-up
  return `I received: "${text}". Could you clarify or ask a specific question? For example: "What's the weather in Jakarta?" or "Calculate 12 / 3".`;
}

export const handleAsk: RequestHandler = async (req, res) => {
  const q = (req.body && req.body.q) || req.query.q;
  if (!q) {
    return res.status(400).json({ error: "Missing 'q' in request" });
  }

  const forwarded = await forwardToAgentBackend(String(q));
  if (forwarded) {
    return res.status(200).json({ reply: forwarded, message: forwarded });
  }

  const reply = generateReply(String(q));
  return res.status(200).json({ reply, message: reply });
};
