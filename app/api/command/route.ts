import { NextResponse } from "next/server";
import { prank, authed } from "@/lib/prank";
export async function POST(req: Request) {
  if (!authed(req)) return NextResponse.json({ error: "nope." }, { status: 401 });
  const p = prank();
  if (!p) return NextResponse.json({ off: true });
  const body = await req.json().catch(() => ({}));
  const target = String(body.target || "all");
  const cmd = String(body.cmd || "");
  const arg = String(body.arg || "").slice(0, 500);
  if (!cmd) return NextResponse.json({ error: "empty." }, { status: 400 });
  const channel = target === "all" ? "broadcast" : "user-" + target.replace(/[^a-z0-9]/gi, "");
  await p.trigger(channel, "command", { cmd, arg });
  return NextResponse.json({ ok: true });
}
