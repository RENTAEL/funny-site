import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { prank } from "@/lib/prank";
export async function POST(req: Request) {
  const p = prank();
  if (!p) return NextResponse.json({ off: true });
  const body = await req.json().catch(() => ({}));
  const kind = String(body.kind || "");
  const h = headers();
  const country = h.get("x-vercel-ip-country") || "unknown";
  if (kind === "join" || kind === "beat") {
    await p.trigger("presence", "visitor", {
      id: String(body.id || ""),
      name: String(body.name || "mystery guest"),
      browser: String(body.browser || "?"),
      os: String(body.os || "?"),
      secs: Number(body.secs || 0),
      country,
      at: Date.now(),
    });
  } else if (kind === "chat") {
    await p.trigger("presence", "support-msg", {
      id: String(body.id || ""),
      name: String(body.name || "mystery guest"),
      text: String(body.text || "").slice(0, 500),
      at: Date.now(),
    });
  } else if (kind === "admin-alive") {
    await p.trigger("broadcast", "admin-alive", { at: Date.now() });
  }
  return NextResponse.json({ ok: true });
}
