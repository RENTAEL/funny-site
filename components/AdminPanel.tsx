"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import PortalBox from "./PortalBox";
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
type Visitor = { id: string; name: string; joinedAt: number; lastActive: number };
type SpyMsg = { from: string; text: string; at: number; k: string };
type SupportMsg = { id: string; name: string; text: string; at: number; k: string };
let inboxK = 1;
const GAGS = ["spin", "invert", "gravity", "drunk", "bsod", "update", "virus", "confetti", "boom", "airhorn", "comic", "crt", "mirror", "cursor", "flood", "flee", "quake", "lights"];
function rel(ts: number, now: number) {
  const s = Math.max(0, Math.floor((now - ts) / 1000));
  if (s < 5) return "just now";
  if (s < 60) return s + "s ago";
  return Math.floor(s / 60) + "m ago";
}
function Section(props: { id: string; title: string; shut: Record<string, boolean>; onFlip: (id: string) => void; children: React.ReactNode }) {
  const open = !props.shut[props.id];
  return (
    <div className="border-b border-slate-800">
      <button onClick={() => props.onFlip(props.id)} className="w-full flex justify-between items-center p-3 font-black text-sm uppercase tracking-wider">
        <span>{props.title}</span>
        <span className="text-slate-500">{open ? "-" : "+"}</span>
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
  const [visitors, setVisitors] = useState<Record<string, Visitor>>({});
  const [visitorsRef, setVisitorsRef] = useState<Record<string, Visitor>>({});
  const vref = useRef<Record<string, Visitor>>({});
  const [feed, setFeed] = useState<SpyMsg[]>([]);
  const [inbox, setInbox] = useState<SupportMsg[]>([]);
  const [replyText, setReplyText] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [fled, setFled] = useState<Record<string, { name: string; at: number }>>({});
  const [flashId, setFlashId] = useState<string | null>(null);
  const [folded, setFolded] = useState(false);
  const [shut, setShut] = useState<Record<string, boolean>>({});
  const [remoteToast, setRemoteToast] = useState("");
  const [remoteSpeak, setRemoteSpeak] = useState("");
  const [tick, setTick] = useState(0);
  const countsRef = useRef<Record<string, number>>({});
  const orderSend = useRef<((to: string, gag: string, arg: string) => void) | null>(null);
  useEffect(() => {
    const t = setInterval(() => setTick((n) => n + 1), 5000);
    return () => clearInterval(t);
  }, []);
  useEffect(() => {
    if (!p.open) return;
    let dead = false;
    const timers: ReturnType<typeof setInterval>[] = [];
    fetch("/api/config")
      .then((r) => r.json())
      .then(async (cfg) => {
        if (dead || cfg.off || !cfg.supaUrl || !cfg.supaKey) return;
        const { supa } = await import("@/utils/supabase/client");
        if (dead) return;
        const sb = supa();
        if (!sb) return;
        setSupaOn(true);
        const vis = sb.channel("visitors");
        vis
          .on("presence", { event: "sync" }, () => {
            const state = vis.presenceState() as Record<string, Visitor[]>;
            const next: Record<string, Visitor> = {};
            Object.keys(state).forEach((k) => {
              const v = state[k][0];
              if (v && v.id) next[v.id] = v;
            });
            const prev = vref.current;
            Object.keys(next).forEach((id) => {
              if (!prev[id]) {
                setFlashId(id);
                setTimeout(() => setFlashId((f) => (f === id ? null : f)), 2000);
              }
            });
            Object.keys(prev).forEach((id) => {
              if (!next[id]) {
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
          })
          .subscribe();
        const spy = sb.channel("spy");
        spy
          .on("broadcast", { event: "spy" }, (m: { payload: SpyMsg }) => {
            const d = m.payload;
            if (!d || !d.from) return;
            setFeed((prev) => [...prev.slice(-29), { from: d.from, text: d.text, at: d.at, k: "a" + (inboxK++) }]);
          })
          .subscribe();
        const support = sb.channel("support");
        support
          .on("broadcast", { event: "support-msg" }, (m: { payload: SupportMsg }) => {
            const d = m.payload;
            if (!d || !d.id) return;
            setInbox((prev) => [...prev.slice(-49), { id: d.id, name: d.name, text: d.text, at: d.at, k: "a" + (inboxK++) }]);
          })
          .subscribe();
        const orders = sb.channel("orders");
        orderSend.current = (to: string, gag: string, arg: string) => {
          try {
            orders.send({ type: "broadcast", event: "command", payload: { to, gag, arg } });
          } catch { /* radio silence */ }
        };
        orders.subscribe();
        const alive = () => { if (orderSend.current) orderSend.current("all", "@alive", ""); };
        alive();
        timers.push(setInterval(alive, 15000));
        timers.push(setInterval(() => {
          setVisitors((prev) => {
            const now = Date.now();
            const next: Record<string, Visitor> = {};
            Object.keys(prev).forEach((id) => {
              if (now - prev[id].lastActive < 30000) next[id] = prev[id];
            });
            return next;
          });
        }, 5000));
      })
      .catch(() => {});
    return () => {
      dead = true;
      timers.forEach((t) => clearInterval(t));
    };
  }, [p.open]);
  const sendOrder = (to: string, gag: string, arg: string) => {
    if (orderSend.current) orderSend.current(to, gag, arg);
    if (to === "all") {
      Object.keys(vref.current).forEach((id) => { countsRef.current[id] = (countsRef.current[id] || 0) + 1; });
    } else if (vref.current[to]) {
      countsRef.current[to] = (countsRef.current[to] || 0) + 1;
    }
    setTick((n) => n + 1);
  };
  const remoteGag = (id: string, g: string) => sendOrder(id, g, "");
  const flip = (id: string) => setShut((s) => ({ ...s, [id]: !s[id] }));
  if (!p.open) return null;
  const now = Date.now();
  const list = Object.keys(visitors).map((id) => visitors[id]);
  const fledList = Object.keys(fled).map((id) => ({ id, name: fled[id].name }));
  const fireMenu = (id: string) => (
    <div className="mt-2 bg-black rounded-xl p-2">
      <div className="grid grid-cols-3 gap-1 mb-2">
        {GAGS.map((g) => (
          <button key={g} onClick={() => remoteGag(id, g)} className="bg-slate-800 rounded-lg p-2 text-[11px] font-black uppercase">{g}</button>
        ))}
      </div>
      <div className="flex gap-1 mb-1">
        <input value={remoteToast} onChange={(e) => setRemoteToast(e.target.value)} placeholder="toast them..." className="flex-1 min-w-0 bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs" />
        <button onClick={() => { if (remoteToast.trim() === "") return; sendOrder(id, "toast", remoteToast); setRemoteToast(""); }} className="bg-lime-400 text-black font-black text-[11px] uppercase rounded-lg px-3">send</button>
      </div>
      <div className="flex gap-1">
        <input value={remoteSpeak} onChange={(e) => setRemoteSpeak(e.target.value)} placeholder="robot says..." className="flex-1 min-w-0 bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs" />
        <button onClick={() => { if (remoteSpeak.trim() === "") return; sendOrder(id, "speak", remoteSpeak); setRemoteSpeak(""); }} className="bg-lime-400 text-black font-black text-[11px] uppercase rounded-lg px-3">speak</button>
      </div>
    </div>
  );
  if (folded) {
    return (
      <PortalBox>
        <button onClick={() => setFolded(false)} className="fixed right-0 top-1/2 -translate-y-1/2 z-[200] bg-red-600 text-white font-black px-2 py-4 rounded-l-xl">◀</button>
      </PortalBox>
    );
  }
  void tick;
  void visitorsRef;
  return (
    <PortalBox>
      <div className="fixed z-[200] font-mono left-0 right-0 bottom-0 h-[60vh] rounded-t-2xl md:left-auto md:right-0 md:top-0 md:bottom-0 md:h-full md:w-[380px] md:rounded-none bg-slate-950 text-slate-100 border-t-2 md:border-t-0 md:border-l-2 border-red-500 flex flex-col">
        <div className="flex items-center justify-between p-3 border-b border-slate-800 shrink-0" onClick={() => setFolded(true)}>
          <span className="font-black text-sm tracking-widest">opposite control</span>
          <span className="flex gap-2">
            <button onClick={(e) => { e.stopPropagation(); setFolded(true); }} className="font-black px-2">—</button>
            <button onClick={(e) => { e.stopPropagation(); p.onClose(); }} className="font-black px-2">X</button>
          </span>
        </div>
        <div className="flex-1 overflow-y-auto">
          <Section id="surv" title="surveillance" shut={shut} onFlip={flip}>
            {!supaOn && <p className="text-xs italic text-slate-500 bg-slate-900 rounded-xl p-3">mission control: offline (no supabase keys)</p>}
            {supaOn && (
              <div>
                <p className="flex items-center gap-2 font-black mb-1">
                  {list.length > 0 ? (<><span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /><span>{list.length} victims online</span></>) : (<span className="text-slate-500">nobody. sad.</span>)}
                </p>
                <button onClick={() => setExpanded(expanded === "all" ? null : "all")} className="w-full bg-red-900 rounded-xl p-2 text-xs font-black uppercase mb-2">fire at everyone {expanded === "all" ? "-" : "+"}</button>
                {expanded === "all" && fireMenu("all")}
                <div className="space-y-2 mt-2">
                  {list.map((v) => {
                    const idleS = Math.floor((now - v.lastActive) / 1000);
                    const idle = idleS > 60;
                    const fresh = flashId === v.id;
                    return (
                      <motion.div key={v.id} initial={fresh ? { x: 60, opacity: 0, backgroundColor: "#365314" } : false} animate={{ x: 0, opacity: 1, backgroundColor: "rgba(0,0,0,0)" }} transition={{ duration: 0.4 }}>
                        <button onClick={() => setExpanded(expanded === v.id ? null : v.id)} className={`w-full text-left bg-slate-900 rounded-xl p-3 ${idle ? "opacity-60" : ""}`}>
                          <span className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse shrink-0" />
                            <span className="font-bold text-base">{v.name}</span>
                          </span>
                          <span className="block text-[11px] text-slate-400 mt-1">joined {rel(v.joinedAt, now)} • suffered {countsRef.current[v.id] || 0} gags • {idle ? "idle " + rel(v.lastActive, now) : "active " + rel(v.lastActive, now)}</span>
                        </button>
                        {expanded === v.id && fireMenu(v.id)}
                      </motion.div>
                    );
                  })}
                  {fledList.map((f) => (
                    <div key={f.id} className="bg-slate-900 rounded-xl p-3 opacity-40">
                      <span className="font-bold text-base">{f.name}</span>
                      <span className="block text-[11px] text-slate-500">fled</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <p className="text-xs font-bold uppercase text-slate-400 mt-4 mb-2">spy feed</p>
            <div className="space-y-1 max-h-40 overflow-y-auto bg-black rounded-xl p-2">
              {feed.length === 0 && <p className="text-slate-500 text-xs italic">no gossip yet.</p>}
              {feed.slice(-8).reverse().map((m) => (
                <p key={m.k} className="text-[11px]"><span className="text-slate-500">{new Date(m.at).toLocaleTimeString()} </span><span className="font-bold text-lime-400">{m.from}: </span>{m.text}</p>
              ))}
            </div>
            <p className="text-xs font-bold uppercase text-slate-400 mt-4 mb-2">support screams</p>
            <div className="space-y-1 max-h-32 overflow-y-auto mb-2">
              {inbox.length === 0 && <p className="text-slate-500 text-xs italic">no victims asking for help yet.</p>}
              {inbox.map((m) => (
                <div key={m.k} className="text-xs bg-slate-900 rounded-lg p-2">
                  <span className="font-bold text-lime-400">{m.name}: </span>{m.text}
                  <button onClick={() => setExpanded(m.id)} className="ml-2 underline text-slate-400">target</button>
                </div>
              ))}
            </div>
          </Section>
          <Section id="chaos" title="chaos triggers" shut={shut} onFlip={flip}>
            <div className="grid grid-cols-2 gap-2">
              {GAGS.map((g) => (
                <button key={g} onClick={() => p.onGag(g)} className="bg-slate-800 rounded-xl p-3 text-xs font-black uppercase">{g}</button>
              ))}
            </div>
          </Section>
          <Section id="pup" title="puppeteer" shut={shut} onFlip={flip}>
            <div className="flex gap-2 mb-2">
              <input value={ghostText} onChange={(e) => setGhostText(e.target.value)} placeholder="ghost types..." className="flex-1 min-w-0 bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm" />
              <button onClick={() => { if (ghostText.trim() === "") return; p.onTypeText(ghostText); setGhostText(""); }} className="bg-purple-600 font-black text-xs uppercase rounded-xl px-4">type</button>
            </div>
            <button onClick={p.onScrollPrison} className="w-full bg-indigo-600 rounded-xl p-3 text-xs font-black uppercase mb-2">scroll prison (10s)</button>
            <div className="flex gap-2 mb-2">
              <input value={toastText} onChange={(e) => setToastText(e.target.value)} placeholder="custom toast" className="flex-1 min-w-0 bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm" />
              <button onClick={() => { if (toastText.trim() === "") return; p.notify(toastText); setToastText(""); }} className="bg-lime-400 text-black font-black text-xs uppercase rounded-xl px-4">send</button>
            </div>
            <div className="flex gap-2">
              <input value={speakText} onChange={(e) => setSpeakText(e.target.value)} placeholder="robot says..." className="flex-1 min-w-0 bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm" />
              <button onClick={() => { if (speakText.trim() === "") return; p.speak(speakText); setSpeakText(""); }} className="bg-lime-400 text-black font-black text-xs uppercase rounded-xl px-4">speak</button>
            </div>
          </Section>
          <Section id="god" title="god toggles" shut={shut} onFlip={flip}>
            <div className="space-y-2 text-sm font-bold">
              <button onClick={p.onToggleFrozen} className="w-full bg-slate-900 rounded-xl p-3 flex justify-between"><span>hold still</span><span className={p.frozen ? "text-green-400" : "text-slate-500"}>{p.frozen ? "ON" : "OFF"}</span></button>
              <button onClick={p.onToggleSilenced} className="w-full bg-slate-900 rounded-xl p-3 flex justify-between"><span>silence</span><span className={p.silenced ? "text-green-400" : "text-slate-500"}>{p.silenced ? "ON" : "OFF"}</span></button>
              <button onClick={p.onSkipTerms} className="w-full bg-slate-900 rounded-xl p-3 flex justify-between"><span>skip the terms</span><span className="text-slate-500">go</span></button>
              <button onClick={p.onTogglePacifist} className="w-full bg-slate-900 rounded-xl p-3 flex justify-between"><span>pacifist mode</span><span className={p.pacifist ? "text-green-400" : "text-slate-500"}>{p.pacifist ? "ON" : "OFF"}</span></button>
            </div>
          </Section>
        </div>
        <div className="p-3 border-t border-slate-800 shrink-0">
          <button onClick={p.onChaos} className="w-full bg-red-600 rounded-2xl p-4 font-black text-xl uppercase">CHAOS</button>
        </div>
      </div>
    </PortalBox>
  );
}
