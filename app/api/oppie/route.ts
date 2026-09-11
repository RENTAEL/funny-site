import { NextResponse } from "next/server";
import { SYSTEM_PROMPT, STREAMIUM_PLUG, CANNED_BANK, NPC_ROASTS, pick, cap } from "@/lib/oppie";

type HistItem = { who?: string; text?: string };
const hits = new Map<string, { n: number; t: number }>();

function limited(ip: string): boolean {
  const now = Date.now();
  const e = hits.get(ip);
  if (!e || now - e.t > 3600000) { hits.set(ip, { n: 1, t: now }); return false; }
  e.n++;
  return e.n > 60;
}

async function withTimeout<T>(p: Promise<T>, ms: number): Promise<T> {
  let to: ReturnType<typeof setTimeout> | null = null;
  try {
    return await Promise.race([p, new Promise<T>((_, rej) => { to = setTimeout(() => rej(new Error("slow")), ms); })]);
  } finally { if (to) clearTimeout(to); }
}

async function tryGroq(key: string, messages: Array<{ role: string; content: string }>): Promise<string> {
  const r = await withTimeout(fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": "Bearer " + key },
    body: JSON.stringify({ model: "llama-3.1-8b-instant", messages, max_tokens: 150, temperature: 0.9 }),
  }), 8000);
  if (!r.ok) throw new Error("groq " + r.status);
  const j = await r.json() as { choices?: Array<{ message?: { content?: string } }> };
  const t = String(j?.choices?.[0]?.message?.content || "").trim();
  if (!t) throw new Error("groq empty");
  return t;
}

async function tryPollinations(prompt: string): Promise<string> {
  const r = await withTimeout(fetch("https://text.pollinations.ai/" + encodeURIComponent(prompt), { headers: { Accept: "text/plain" } }), 8000);
  if (!r.ok) throw new Error("pollinations " + r.status);
  const t = String(await r.text()).trim();
  if (!t) throw new Error("pollinations empty");
  return t;
}

export async function POST(req: Request) {
  let body: { message?: string; name?: string; history?: HistItem[] } = {};
  try { body = await req.json() as typeof body; } catch { body = {}; }
  const message = cap(String(body.message || ""), 500).trim();
  const name = cap(String(body.name || ""), 24);
  const history = Array.isArray(body.history) ? body.history.slice(-6).map((h) => ({ who: h.who === "you" ? "you" : "oppie", text: cap(String(h.text || ""), 300) })) : [];
  const forced = req.headers.get("x-oppie-test") === "force-canned";
  const finish = (reply: string, source: string, fallback: boolean) => {
    let out = cap(reply.trim(), 300);
    if (!out) out = pick(CANNED_BANK);
    if (!forced && Math.random() < 0.1 && out.indexOf("streamium") < 0) out = cap(out + STREAMIUM_PLUG, 300);
    if (/ #\d$/.test(name) && Math.random() < 0.3) out = cap(pick(NPC_ROASTS) + out, 300);
    return NextResponse.json({ reply: out, source, fallback });
  };
  if (!message) return finish(pick(CANNED_BANK), "canned", false);
  if (forced) return finish(pick(CANNED_BANK), "canned", false);
  const ip = (req.headers.get("x-forwarded-for") || "").split(",")[0].trim() || "anon";
  if (limited(ip)) return finish(pick(CANNED_BANK), "canned", false);
  const histLines = history.map((h) => (h.who === "you" ? name || "visitor" : "OPPIE") + ": " + h.text).join("\n");
  const groqKey = process.env.GROQ_API_KEY || "";
  if (groqKey) {
    try {
      const msgs: Array<{ role: string; content: string }> = [{ role: "system", content: SYSTEM_PROMPT }];
      if (histLines) msgs.push({ role: "user", content: "so far:\n" + histLines });
      msgs.push({ role: "user", content: (name ? name + " asks: " : "") + message });
      return finish(await tryGroq(groqKey, msgs), "groq", false);
    } catch { /* fall through */ }
  }
  try {
    const prompt = SYSTEM_PROMPT + "\n\n" + (histLines ? "so far:\n" + histLines + "\n\n" : "") + (name ? name + " asks: " : "") + message + "\n\nOPPIE:";
    return finish(await tryPollinations(prompt), "pollinations", false);
  } catch { /* fall through */ }
  return finish(pick(CANNED_BANK), "canned", true);
}
