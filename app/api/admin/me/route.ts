import { NextResponse } from "next/server";
import { authed } from "@/lib/prank";
export async function GET(req: Request) {
  if (!process.env.ADMIN_PASSWORD) return NextResponse.json({ setup: false });
  return NextResponse.json({ ok: authed(req) });
}
