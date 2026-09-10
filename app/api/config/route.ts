import { NextResponse } from "next/server";
export async function GET() {
  const out: Record<string, string> = {};
  if (process.env.NEXT_PUBLIC_PUSHER_KEY && process.env.PUSHER_CLUSTER) {
    out.key = process.env.NEXT_PUBLIC_PUSHER_KEY;
    out.cluster = process.env.PUSHER_CLUSTER;
  }
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    out.supaUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    out.supaKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  }
  if (!out.key && !out.supaUrl) return NextResponse.json({ off: true });
  return NextResponse.json(out);
}
