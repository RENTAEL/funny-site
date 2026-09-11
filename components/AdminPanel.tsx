"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import PortalBox from "./PortalBox";
import { getSharedChannel } from "@/utils/supabase/channels";
type Props = {
  open: boolean;
  onClose: () => void;
  comic: string;
  frozen: boolean;
  silenced: boolean;
  pacifist: boolean;
  onToggleFrozen: () => void;
  onToggleSilenced: () => void;
  onTogglePacifist: () => void;
  onSkipTerms: () => void;
  onGag: (g: string) => void;
  onChaos: () => void;
  notify: (msg: string) => void;
  speak: (msg: string) => void;
  onTypeText: (msg: string) => void;
  onScrollPrison: () => void;
};
type Visitor = { id: string; name: string; joinedAt: number; lastActive: number; custom?: boolean };
type SharedVis = { presenceState: () => Record<string, Visitor[]> };
type SpyMsg = { from: string; text: string; at: number; k: string };
type SupportMsg = { id: string; name: string; text: string; at: number; k: string };
let inboxK = 1;
const GAGS = ["spin", "invert", "gravity", "drunk", "bsod", "update", "virus", "confetti", "boom", "airhorn", "comic", "crt", "mirror", "cursor", "flood", "flee", "quake", "lights", "tabpanic", "slownet", "popups", "rain", "clippy", "autopilot", "shake", "judgment", "audience", "magnet", "butter", "exile", "cursor", "ad", "hold", "battery", "regret"];
function rel(ts: number, now: number) {
  const s = Math.max(0, Math.floor((now - ts) / 1000));
  if (s < 5) return "just now";
  if (s < 60) return s + "s ago";
  return Math.floor(s / 60) + "m ago";
}
function Section(props: { id: string; title: string; shut: Record<string, boolean>; onFlip: (id: string) => void; children: React.ReactNode }) {
  const open = !props.shut[props.id];
  return (
    <div className="border-b border-[var(--border-subtle)]">
      <button onClick={() => props.onFlip(props.id)} className="w-full flex justify-between items-center p-3 font-black text-sm uppercase tracking-wider">
        <span>{props.title}</span>
        <span className="text-[var(--text-3)]">{open ? "-" : "+"}</span>
      </button>
      {open && <div className="px-3 pb-4">{props.children}</div>}
    </div>
  );
}
export default function AdminPanel(p: Props) {
  const [ghostText, setGhostText] = useState("");
  const [toastText, setToastText] = useState("");
  const [speakText, setSpeakText] = useState("");
  const [supaOn, setSupaOn] = useState(false);
  const [rts, setRts] = useState({ st: "connecting", reason: "" });
  const [myId, setMyId] = useState("");
  const sbRef = useRef<{ removeAllChannels: () => void } | null>(null);
  const [visitors, setVisitors] = useState<Record<string, Visitor>>({});
  const [visitorsRef, setVisitorsRef] = useState<Record<string, Visitor>>({});
  const vref = useRef<Record<string, Visitor>>({});
  const seenAt = useRef<Record<string, number>>({});
  const [feed, setFeed] = useState<SpyMsg[]>([]);
  const [inbox, setInbox] = useState<SupportMsg[]>([]);
  const [replyText, setReplyText] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [fireLog, setFireLog] = useState<Array<{ nonce: string; text: string; at: number; ok: boolean }>>([]);
  const [fled, setFled] = useState<Record<string, { name: string; at: number }>>({});
  const [flashId, setFlashId] = useState<string | null>(null);
  const [folded, setFolded] = useState(false);
  const [shut, setShut] = useState<Record<string, boolean>>({});
  const [remoteToast, setRemoteToast] = useState("");
  const [remoteSpeak, setRemoteSpeak] = useState("");
  const [tick, setTick] = useState(0);
  const countsRef = useRef<Record<string, number>>({});
  const orderSend = useRef<((to: string, gag: string, arg: string, nonce: string) => void) | null>(null);
  const chaosSend = useRef<((payload: { id: string; gag: string; ts: number; adminId: string }) => void) | null>(null);
  const stagesRef = useRef<string[]>([]);
  const stage = (s: string) => { stagesRef.current.push(new Date().toLocaleTimeString() + " " + s); };
  const [showReport, setShowReport] = useState(false);
  useEffect(() => {
    const t = setInterval(() => setTick((n) => n + 1), 5000);
    return () => clearInterval(t);
  }, []);
  useEffect(() => {
    try { setMyId(sessionStorage.getItem("opp_vid") || ""); } catch { /* no pocket */ }
    if (!p.open) return;
    stage("panel opened");
    let dead = false;
    const timers: ReturnType<typeof setInterval>[] = [];
    stage("awaiting: config fetch");
    fetch("/api/config")
      .then((r) => r.json())
      .then(async (cfg) => {
        stage("resolved: config fetch");
        if (dead) return;
        if (cfg.off || !cfg.supaUrl || !cfg.supaKey) {
          stage("config: env vars missing");
          setRts({ st: "offline", reason: "env vars missing" });
          return;
        }
        let supaFn: (() => unknown) | null = null;
        try {
          supaFn = (await import("@/utils/supabase/client")).supa;
        } catch (e) {
          console.log("[supabase] client import failed", e);
          setRts({ st: "offline", reason: "client init failed" });
          return;
        }
        if (dead) return;
        const sb = supaFn() as { removeAllChannels: () => void; channel: (n: string, opts?: object) => { subscribe: (cb?: (s: string) => void) => void; presenceState: () => Record<string, Array<{ id: string; name: string }>>; track: (o: object) => void; send: (m: object) => void; on: (t: string, f: object, cb: (m: { payload: never }) => void) => { subscribe: (cb?: (s: string) => void) => void } }; };
        if (!sb) {
          console.log("[supabase] client is null (browser env missing?)");
          stage("client is null");
          setRts({ st: "offline", reason: "env vars missing" });
          return;
        }
        sbRef.current = sb;
        stage("client created");
        timers.push(setTimeout(() => { setRts((r) => { if (r.st === "connected") return r; console.log("[supabase] watchdog: " + JSON.stringify(stagesRef.current)); return { st: "offline", reason: "subscribe timed out" }; }); }, 10000));
        setRts({ st: "connecting", reason: "" });
        setSupaOn(true);
        try {
        stage("using shared visitors channel");
        const pollPresence = () => {
          const shared = getSharedChannel<SharedVis>("visitors");
          if (!shared) return;
          let state: Record<string, Visitor[]>;
          try {
            state = shared.presenceState();
          } catch (e) {
            console.log("[supabase] shared presenceState read failed", e);
            return;
          }
          console.log("[supabase] admin presence sync");
          stage("sync received");
          setRts({ st: "connected", reason: "" });
          const next: Record<string, Visitor> = {};
          Object.keys(state).forEach((k) => {
            const v = state[k][0];
            if (v && v.id) next[v.id] = v;
          });
          Object.keys(next).forEach((id) => {
            const old = vref.current[id];
            if (old && old.name !== next[id].name) {
              setFeed((prevf) => [...prevf.slice(-29), { from: "mission control", text: old.name + " is now " + next[id].name, at: Date.now(), k: "a" + (inboxK++) }]);
            }
          });
          const prev = vref.current;
          Object.keys(next).forEach((id) => {
            if (!prev[id]) {
              seenAt.current[id] = Date.now();
              console.log("[supabase] admin presence join:", next[id].name);
              setFlashId(id);
              setTimeout(() => setFlashId((f) => (f === id ? null : f)), 2000);
            }
          });
          Object.keys(prev).forEach((id) => {
            if (!next[id] && Date.now() - (seenAt.current[id] || 0) > 20000) {
              console.log("[supabase] admin presence leave:", prev[id].name);
              setFled((f) => ({ ...f, [id]: { name: prev[id].name, at: Date.now() } }));
              setTimeout(() => {
                setFled((f) => {
                  const n: Record<string, { name: string; at: number }> = { ...f };
                  delete n[id];
                  return n;
                });
              }, 3000);
            }
          });
          vref.current = next;
          setVisitorsRef(next);
          setVisitors(next);
        };
        pollPresence();
        timers.push(setInterval(() => { if (!dead) pollPresence(); }, 2500));
        console.log('[stage] creating channel', { name: 'spy' });
        stage("creating channel spy");
        const spy = sb.channel("spy", { config: { private: false } });
        spy
          .on("broadcast", { event: "spy" }, (m: { payload: SpyMsg }) => {
            const d = m.payload;
            if (!d || !d.from) return;
            setFeed((prev) => [...prev.slice(-29), { from: d.from, text: d.text, at: d.at, k: "a" + (inboxK++) }]);
          })
          .subscribe();
        console.log('[stage] creating channel', { name: 'support' });
        stage("creating channel support");
        const support = sb.channel("support", { config: { private: false } });
        support
          .on("broadcast", { event: "support-msg" }, (m: { payload: SupportMsg }) => {
            const d = m.payload;
            if (!d || !d.id) return;
            setInbox((prev) => [...prev.slice(-49), { id: d.id, name: d.name, text: d.text, at: d.at, k: "a" + (inboxK++) }]);
          })
          .subscribe();
        console.log('[stage] creating channel', { name: 'orders' });
        stage("creating channel orders");
        const orders = sb.channel("orders", { config: { private: false } });
        orderSend.current = (to: string, gag: string, arg: string, nonce: string) => {
          try {
            orders.send({ type: "broadcast", event: "command", payload: { target: to, gag: gag, msg: arg, nonce: nonce } });
          } catch { /* radio silence */ }
        };
        orders
          .on("broadcast", { event: "ack" }, (m: { payload: { nonce: string } }) => {
            const d = m.payload;
            if (!d || !d.nonce) return;
            setFireLog((prev) => prev.map((fl) => (fl.nonce === d.nonce ? { ...fl, ok: true } : fl)));
          })
          .subscribe();
        const chaos = sb.channel("chaos", { config: { private: false } });
        chaosSend.current = (payload) => {
          try { chaos.send({ type: "broadcast", event: "meltdown", payload }); } catch { /* quiet */
          }
        };
        chaos.subscribe();
        console.log('[stage] handlers registered: broadcast spy, broadcast support-msg, broadcast command');
        stage("handlers registered: spy, support, orders");
        console.log('[stage] channel created');
        stage("channel created");
        } catch (err) {
          const e = err as Error;
          console.error('[stage] SETUP THREW:', e.message, e.stack);
          stage("SETUP THREW: " + e.message);
          setRts({ st: "offline", reason: "setup threw" });
        }
        const alive = () => { if (orderSend.current) orderSend.current("all", "@alive", "", ""); };
        alive();
        timers.push(setInterval(alive, 15000));
        timers.push(setInterval(() => {
          setVisitors((prev) => {
            const now = Date.now();
            const next: Record<string, Visitor> = {};
            Object.keys(prev).forEach((id) => {
              if (now - prev[id].lastActive < 30000) next[id] = prev[id];
            });
            const dropped = Object.keys(prev).length - Object.keys(next).length;
            if (dropped > 0) {
              console.log("[supabase] sweep pruned stale visitors:", dropped);
              stage("sweep pruned: " + dropped);
            }
            return next;
          });
        }, 5000));
      })
      .catch((err: unknown) => { const e = err as Error; console.error("[supabase] chain failed:", e.message, e.stack); stage("chain failed: " + e.message); setRts({ st: "offline", reason: "chain failed" }); });
    return () => {
      dead = true;
      timers.forEach((t) => clearInterval(t));
      orderSend.current = null;
      chaosSend.current = null;
      if (sbRef.current) { try { sbRef.current.removeAllChannels(); } catch { /* already gone */ } }
    };
  }, [p.open]);
  const sendOrder = (to: string, gag: string, arg: string) => {
    const nonce = "n" + Date.now().toString(36) + Math.floor(Math.random() * 1e6).toString(36);
    if (orderSend.current) orderSend.current(to, gag, arg, nonce);
    const nm = to === "all" ? "EVERYONE" : (vref.current[to] ? vref.current[to].name : to);
    setFireLog((prev) => [...prev.slice(-19), { nonce: nonce, text: "fired " + gag + " at " + nm, at: Date.now(), ok: false }]);
    setTimeout(() => { setFireLog((prev) => prev.map((fl) => (fl.nonce === nonce && !fl.ok ? { ...fl, text: fl.text + " -- no confirmation, target may have fled" } : fl))); }, 8000);
    if (to === "all") {
      Object.keys(vref.current).forEach((id) => { countsRef.current[id] = (countsRef.current[id] || 0) + 1; });
    } else if (vref.current[to]) {
      countsRef.current[to] = (countsRef.current[to] || 0) + 1;
    }
    setTick((n) => n + 1);
  };
  const remoteGag = (id: string, g: string) => sendOrder(id, g, "");
  const fireMeltdown = () => {
    const payload = { id: "m" + Date.now().toString(36) + Math.floor(Math.random() * 1e6).toString(36), gag: "oppie-meltdown", ts: Date.now(), adminId: myId };
    if (chaosSend.current) chaosSend.current(payload);
    setFireLog((prev) => [...prev.slice(-19), { nonce: payload.id, text: "→ broadcast oppie-meltdown", at: Date.now(), ok: true }]);
    setTick((n) => n + 1);
  };
  const buildReport = () => {
    const lines = [
      "opposite.exe debug report",
      "time: " + new Date().toISOString(),
      "realtime: " + rts.st + (rts.reason !== "" ? " (" + rts.reason + ")" : ""),
      "visitors seen: " + Object.keys(visitors).length,
      "stages:",
      ...stagesRef.current,
    ];
    return lines.join("\\n");
  };
  const copyReport = async () => {
    const rep = buildReport();
    console.log(rep);
    try {
      await navigator.clipboard.writeText(rep);
      p.notify("report copied");
    } catch {
      setShowReport(true);
    }
  };
  const flip = (id: string) => setShut((s) => ({ ...s, [id]: !s[id] }));
  if (!p.open) return null;
  const now = Date.now();
  const list = Object.keys(visitors).map((id) => visitors[id]);
  const fledList = Object.keys(fled).map((id) => ({ id, name: fled[id].name }));
  const fireMenu = (id: string) => {
    const nm = id === "all" ? "EVERYONE" : (vref.current[id] ? vref.current[id].name : id);
    return (
    <div data-testid="remote-menu" className="target-locked mt-2 bg-black rounded-xl p-2">
      <p className="text-[11px] font-bold text-[var(--danger)] mb-2">◉ TARGET LOCKED: {nm}</p>
      <div className="grid grid-cols-3 gap-1 mb-2">
        {GAGS.map((g) => (
          <button key={g} onClick={() => remoteGag(id, g)} className="bg-[var(--bg-2)] border border-[var(--border-strong)] rounded-[6px] p-2 min-h-[44px] mono-label arsenal-btn">{g}</button>
        ))}
      </div>
      <div className="flex gap-1 mb-1">
        <input data-testid="remote-toast" value={remoteToast} onChange={(e) => setRemoteToast(e.target.value)} placeholder="toast them..." className="flex-1 min-w-0 bg-[var(--bg-2)] border border-[var(--border-subtle)] rounded-[6px] p-2 text-base" />
        <button onClick={() => { if (remoteToast.trim() === "") return; sendOrder(id, "toast", remoteToast); setRemoteToast(""); }} className="bg-[var(--accent)] text-[#0A0A0B] font-bold mono-label rounded-[6px] px-3">send</button>
      </div>
      <div className="flex gap-1">
        <input data-testid="remote-speak" value={remoteSpeak} onChange={(e) => setRemoteSpeak(e.target.value)} placeholder="robot says..." className="flex-1 min-w-0 bg-[var(--bg-2)] border border-[var(--border-subtle)] rounded-[6px] p-2 text-base" />
        <button onClick={() => { if (remoteSpeak.trim() === "") return; sendOrder(id, "speak", remoteSpeak); setRemoteSpeak(""); }} className="bg-[var(--accent)] text-[#0A0A0B] font-bold mono-label rounded-[6px] px-3">speak</button>
      </div>
    </div>
    );
  };
  if (folded) {
    return (
      <PortalBox>
        <button onClick={() => setFolded(false)} aria-label="unfold panel" className="fixed right-0 top-1/2 -translate-y-1/2 z-[200] bg-[var(--danger)] text-[#0A0A0B] font-black px-3 py-5 rounded-l-xl">◀</button>
      </PortalBox>
    );
  }
  void tick;
  void visitorsRef;
  return (
    <PortalBox>
      <div data-panel data-admin-zone onWheel={(e) => e.stopPropagation()} onTouchMove={(e) => e.stopPropagation()} className="fixed z-[200] font-mono touch-manipulation left-0 right-0 bottom-0 h-[60vh] supports-[height:100dvh]:h-[60dvh] rounded-t-2xl md:left-auto md:right-0 md:top-0 md:bottom-0 md:h-full md:w-[380px] md:rounded-none bg-[var(--bg-0)] term-scan text-[var(--text-1)] border-t-2 md:border-t-0 md:border-l-2 border-[var(--danger)] flex flex-col">
        <div className="flex items-center justify-between h-9 px-3 border-b border-[var(--border-subtle)] bg-[var(--bg-1)] shrink-0" onClick={() => setFolded(true)}>
          <span className="mono-label text-[var(--text-2)] whitespace-nowrap">mission control</span>
          <span className="flex items-center gap-2 shrink-0">
            {rts.st === "connected" ? (<><span className="w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse" /><span className="mono-label text-[var(--text-2)]">realtime: connected</span></>) : rts.st === "connecting" ? (<><span className="w-2 h-2 rounded-full bg-[var(--text-3)] animate-pulse" /><span className="mono-label text-[var(--text-2)]">realtime: connecting...</span></>) : (<><span className="w-2 h-2 rounded-full bg-[var(--danger)]" /><span className="mono-label text-[var(--text-2)]">realtime: offline{rts.reason !== "" ? ": " + rts.reason : ""}</span></>)}
            <button onClick={(e) => { e.stopPropagation(); setFolded(true); }} aria-label="fold panel" className="font-black px-2">—</button>
            <button onClick={(e) => { e.stopPropagation(); p.onClose(); }} aria-label="close panel" className="font-black px-2">X</button>
          </span>
        </div>
        <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain">
          <Section id="surv" title="surveillance" shut={shut} onFlip={flip}>
            <p className="flex items-center gap-2 text-xs font-black mb-2">
              {rts.st === "connected" ? (<><span className="w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse" /><span>realtime: connected</span></>) : rts.st === "connecting" ? (<><span className="w-2 h-2 rounded-full bg-[var(--text-3)] animate-pulse" /><span>realtime: connecting...</span></>) : (<><span className="w-2 h-2 rounded-full bg-red-500" /><span>realtime: offline{rts.reason !== "" ? ": " + rts.reason : ""}</span></>)}
            </p>
            <button onClick={copyReport} className="term-copy w-full bg-[var(--bg-2)] rounded-[6px] p-2 mono-label text-center mb-2">copy debug report</button>
            {showReport && (<div className="term-chrome mb-2"><div className="term-bar"><i /><i /><i /><span className="term-title">debug-report.log</span></div><pre className="text-[11px] bg-black text-[var(--text-2)] p-2 overflow-x-auto whitespace-pre-wrap font-terminal" style={{ userSelect: "all" }}>{buildReport().split("\\n").map((l, i) => (
              <span key={i} className={/threw|failed|error|offline|missing|timed out/i.test(l) ? "stage-bad" : /resolved|received|registered|created|connected|ok|delivered/i.test(l) ? "stage-ok" : undefined}>{l}{"\n"}</span>
            ))}</pre></div>)}
            {!supaOn && <p className="t-small italic text-[var(--text-3)] bg-[var(--bg-1)] border border-[var(--border-subtle)] rounded-[10px] p-3">mission control: offline (no supabase keys)</p>}
            {supaOn && (
              <div>
                <p className="flex items-center gap-2 font-black mb-1">
                  {list.length > 0 ? (<><span className="w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse" /><span>{list.length} victims online</span></>) : (<span className="text-[var(--text-3)]">nobody. sad.</span>)}
                </p>
                {rts.st === "connected" && list.length <= 1 && (<p className="text-xs italic text-[var(--text-3)] mt-1">only you. lonely.</p>)}
                <button onClick={() => setExpanded(expanded === "all" ? null : "all")} className="w-full bg-[var(--bg-2)] border border-[var(--danger)] text-[var(--danger)] rounded-[6px] p-2 mono-label mb-2 text-center">fire at everyone {expanded === "all" ? "-" : "+"}</button>
                {expanded === "all" && fireMenu("all")}
                <div onClick={(e) => { if (e.target === e.currentTarget) setExpanded(null); }} className="space-y-2 mt-2 max-h-64 overflow-y-auto overscroll-contain">
                  {list.map((v) => {
                    const idleS = Math.floor((now - v.lastActive) / 1000);
                    const idle = idleS > 60;
                    const fresh = flashId === v.id;
                    return (
                      <motion.div key={v.id} initial={fresh ? { x: 60, opacity: 0, backgroundColor: "#365314" } : false} animate={{ x: 0, opacity: 1, backgroundColor: "rgba(0,0,0,0)" }} transition={{ duration: 0.4 }}>
                        <button onClick={() => setExpanded(expanded === v.id ? null : v.id)} className={`vic-card w-full text-left ${idle ? "opacity-60" : ""}`}>
                          <span className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse shrink-0" />
                            <span className={v.custom ? "font-bold text-base vic-custom" : "font-bold text-base italic opacity-70"}>{v.name}{v.id === myId ? " (you)" : ""}{!v.custom && <span className="ml-2 text-[10px] not-italic border border-[var(--border-strong)] text-[var(--text-3)] px-1 rounded-[3px]">NPC ENERGY</span>}</span>
                          </span>
                          <span className="block mt-1 space-y-0.5">
                            <span className="block text-[11px]"><span className="lbl">status </span><span className="text-[11px] text-[var(--text-1)]">{idle ? "idle " + rel(v.lastActive, now) : "active " + rel(v.lastActive, now)}</span> <span className="text-[var(--text-3)]">ref {v.id.slice(0, 6)}</span></span>
                            <span className="block text-[11px]"><span className="lbl">joined </span><span className="text-[var(--text-2)]">{rel(v.joinedAt, now)}</span> <span className="lbl">gags </span><span className="text-[var(--text-2)]">{countsRef.current[v.id] || 0}</span></span>
                          </span>
                        </button>
                        {expanded === v.id && fireMenu(v.id)}
                      </motion.div>
                    );
                  })}
                  {fledList.map((f) => (
                    <div key={f.id} className="bg-[var(--bg-1)] border border-[var(--border-subtle)] rounded-[10px] p-3 opacity-40">
                      <span className="font-bold text-base">{f.name}</span>
                      <span className="block text-[11px] text-[var(--text-3)]">fled</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <p className="text-xs font-bold uppercase text-[var(--text-2)] mt-4 mb-2">fire log</p>
            <div className="space-y-1 max-h-24 overflow-y-auto overscroll-contain bg-black rounded-xl p-2 mb-2 term-feed">
              {fireLog.length === 0 && <p className="text-[var(--text-3)] text-[11px] italic">no shots fired yet.</p>}
              {fireLog.slice(-8).reverse().map((fl) => (
                <p key={fl.nonce} className="text-[11px]"><span className="text-[var(--text-3)]">{new Date(fl.at).toLocaleTimeString()} </span>{fl.text} <span className={fl.ok ? "text-green-400 font-bold" : "text-[var(--text-3)]"}>{fl.ok ? "delivered ✓" : "..."}</span></p>
              ))}
            </div>
            <p className="text-xs font-bold uppercase text-[var(--text-2)] mt-4 mb-2">spy feed</p>
            <div className="space-y-1 max-h-40 overflow-y-auto overscroll-contain bg-black rounded-xl p-2 term-feed">
              {feed.length === 0 && <p className="text-[var(--text-3)] text-xs italic">no gossip yet.</p>}
              {feed.slice(-8).reverse().map((m) => (
                <p key={m.k} className="text-[11px] feed-in"><span className="text-[var(--text-3)]">{new Date(m.at).toLocaleTimeString()} </span><span className="font-bold text-[var(--accent)]">{m.from}: </span>{m.text}</p>
              ))}
            </div>
            <p className="text-xs font-bold uppercase text-[var(--text-2)] mt-4 mb-2">support screams</p>
            <div className="space-y-1 max-h-32 overflow-y-auto overscroll-contain mb-2">
              {inbox.length === 0 && <p className="text-[var(--text-3)] text-xs italic">no victims asking for help yet.</p>}
              {inbox.map((m) => (
                  <div key={m.k} className="text-xs bg-[var(--bg-1)] border border-[var(--border-subtle)] rounded-[10px] p-2">
                  <span className="font-bold text-[var(--accent)]">{m.name}: </span>{m.text}
                  <button onClick={() => setExpanded(m.id)} className="ml-2 underline text-[var(--text-2)]">target</button>
                </div>
              ))}
            </div>
          </Section>
          <Section id="chaos" title="chaos triggers" shut={shut} onFlip={flip}>
            <div className="grid grid-cols-2 gap-2">
              {GAGS.map((g) => (
                <button key={g} onClick={() => p.onGag(g)} className="bg-[var(--bg-2)] border border-[var(--border-strong)] rounded-[6px] p-3 mono-label arsenal-btn">{g}</button>
              ))}
            </div>
            <button onClick={fireMeltdown} className="w-full mt-2 bg-[var(--bg-2)] border border-[var(--accent)] text-[var(--accent)] rounded-[6px] p-3 mono-label arsenal-btn">[◍] OPPIE MELTDOWN</button>
          </Section>
          <Section id="pup" title="puppeteer" shut={shut} onFlip={flip}>
            <div className="flex gap-2 mb-2">
              <input value={ghostText} onChange={(e) => setGhostText(e.target.value)} placeholder="ghost types..." className="flex-1 min-w-0 bg-[var(--bg-2)] border border-[var(--border-subtle)] rounded-[6px] p-3 text-base" />
              <button onClick={() => { if (ghostText.trim() === "") return; p.onTypeText(ghostText); setGhostText(""); }} className="bg-[var(--bg-2)] border border-[var(--border-strong)] font-bold mono-label rounded-[6px] px-4">type</button>
            </div>
            <button onClick={p.onScrollPrison} className="w-full bg-[var(--bg-2)] border border-[var(--border-strong)] rounded-[6px] p-3 mono-label mb-2 text-center">scroll prison (10s)</button>
            <div className="flex gap-2 mb-2">
              <input value={toastText} onChange={(e) => setToastText(e.target.value)} placeholder="custom toast" className="flex-1 min-w-0 bg-[var(--bg-2)] border border-[var(--border-subtle)] rounded-[6px] p-3 text-base" />
              <button onClick={() => { if (toastText.trim() === "") return; p.notify(toastText); setToastText(""); }} className="bg-[var(--accent)] text-[#0A0A0B] font-bold mono-label rounded-[6px] px-4">send</button>
            </div>
            <div className="flex gap-2">
              <input value={speakText} onChange={(e) => setSpeakText(e.target.value)} placeholder="robot says..." className="flex-1 min-w-0 bg-[var(--bg-2)] border border-[var(--border-subtle)] rounded-[6px] p-3 text-base" />
              <button onClick={() => { if (speakText.trim() === "") return; p.speak(speakText); setSpeakText(""); }} className="bg-[var(--accent)] text-[#0A0A0B] font-bold mono-label rounded-[6px] px-4">speak</button>
            </div>
          </Section>
          <Section id="god" title="god toggles" shut={shut} onFlip={flip}>
            <div className="space-y-2 text-sm font-bold">
              <button onClick={p.onToggleFrozen} className="w-full bg-[var(--bg-1)] border border-[var(--border-subtle)] rounded-[10px] p-3 flex justify-between"><span>hold still</span><span className={p.frozen ? "text-[var(--accent)]" : "text-[var(--text-3)]"}>{p.frozen ? "ON" : "OFF"}</span></button>
              <button onClick={p.onToggleSilenced} className="w-full bg-[var(--bg-1)] border border-[var(--border-subtle)] rounded-[10px] p-3 flex justify-between"><span>silence</span><span className={p.silenced ? "text-[var(--accent)]" : "text-[var(--text-3)]"}>{p.silenced ? "ON" : "OFF"}</span></button>
              <button onClick={p.onSkipTerms} className="w-full bg-[var(--bg-1)] border border-[var(--border-subtle)] rounded-[10px] p-3 flex justify-between"><span>skip the terms</span><span className="text-[var(--text-3)]">go</span></button>
              <button onClick={p.onTogglePacifist} className="w-full bg-[var(--bg-1)] border border-[var(--border-subtle)] rounded-[10px] p-3 flex justify-between"><span>pacifist mode</span><span className={p.pacifist ? "text-[var(--accent)]" : "text-[var(--text-3)]"}>{p.pacifist ? "ON" : "OFF"}</span></button>
            </div>
          </Section>
        </div>
        <div className="p-3 border-t border-[var(--border-subtle)] shrink-0">
          <button onClick={p.onChaos} className="w-full bg-[var(--danger)] text-[#0A0A0B] rounded-[6px] p-4 font-bold text-xl uppercase">CHAOS</button>
        </div>
      </div>
    </PortalBox>
  );
}
