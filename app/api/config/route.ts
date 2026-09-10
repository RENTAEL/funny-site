import { NextResponse } from "next/server";
export async function GET() {
  const key = process.env.NEXT_PUBLIC_PUSHER_KEY;
  const cluster = process.env.PUSHER_CLUSTER;
  if (!key || !cluster) return NextResponse.json({ off: true });
  return NextResponse.json({ key, cluster });
}
