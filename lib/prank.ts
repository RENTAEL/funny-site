import Pusher from "pusher";
import { createHash } from "crypto";
let client: Pusher | null = null;
export function prank() {
  if (client) return client;
  const appId = process.env.PUSHER_APP_ID;
  const key = process.env.NEXT_PUBLIC_PUSHER_KEY;
  const secret = process.env.PUSHER_SECRET;
  const cluster = process.env.PUSHER_CLUSTER;
  if (!appId || !key || !secret || !cluster) return null;
  client = new Pusher({ appId, key, secret, cluster, useTLS: true });
  return client;
}
export function adminHash() {
  const pw = process.env.ADMIN_PASSWORD || "";
  return createHash("sha256").update("prank:" + pw).digest("hex");
}
export function authed(req: Request) {
  const pw = process.env.ADMIN_PASSWORD;
  if (!pw) return false;
  const cookie = req.headers.get("cookie") || "";
  const want = "prank_admin=" + adminHash();
  return cookie.split(";").some((p) => p.trim() === want);
}
