import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { adminHash } from "@/lib/prank";
export async function POST(req: Request) {
  const pw = process.env.ADMIN_PASSWORD;
  if (!pw) return NextResponse.json({ off: true }, { status: 503 });
  const body = await req.json().catch(() => ({}));
  if (String(body.password || "") !== pw) {
    return NextResponse.json({ error: "wrong. embarrassing." }, { status: 401 });
  }
  cookies().set("prank_admin", adminHash(), { httpOnly: true, path: "/", maxAge: 60 * 60 * 24, sameSite: "lax" });
  return NextResponse.json({ ok: true });
}
