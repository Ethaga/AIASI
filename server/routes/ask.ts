import { RequestHandler } from "express";

function generateReply(q: string) {
  const text = String(q).trim();
  const lower = text.toLowerCase();

  // Simple rule-based conversational replies to avoid echoing
  if (/^\s*(hi|hello|halo|hey)\b/.test(lower)) {
    return "Halo! Ada yang bisa saya bantu hari ini?";
  }

  if (lower.includes("how are you") || lower.includes("apa kabar")) {
    return "Saya baik, terima kasih! Bagaimana dengan Anda?";
  }

  if (text.endsWith("?")) {
    return `Pertanyaan bagus — singkatnya: ${text.replace(/\?+$/g, "")}. Jika mau jawaban lebih panjang, minta detail.`;
  }

  // If the user asks to 'follow' or 'echo', explain difference
  if (lower.includes("echo") || lower.includes("ikuti") || lower.includes("mengikuti")) {
    return "Sepertinya Anda ingin agen hanya mengulangi pesan. Saya bisa memberikan jawaban yang bermakna — coba tanya sesuatu atau tambahkan '?' untuk pertanyaan.";
  }

  // Default: provide a helpful paraphrase + follow-up question
  return `Saya menerima: "${text}". Bisa jelaskan maksud Anda lebih rinci atau tanyakan sesuatu spesifik?`;
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
