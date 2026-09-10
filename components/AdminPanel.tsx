"use client";
import React, { useState, useEffect, useRef } from "react";
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
type SpyMsg = { from: string; text: string; at: number };
const GAGS = ["spin", "invert", "gravity", "drunk", "bsod", "update", "virus", "confetti", "boom", "airhorn", "comic", "crt", "mirror", "cursor", "flood", "flee", "quake", "lights"];
export default function AdminPanel(p: Props) {
  const [ghostText, setGhostText] = useState("");
  const [toastText, setToastText] = useState("");
  const [speakText, setSpeakText] = useState("");
  const [supaOn, setSupaOn] = useState(false);
  const [visitors, setVisitors] = useState<Record<string, Visitor>>({});
  const [feed, setFeed] = useState<SpyMsg[]>([]);
  const [target, setTarget] = useState("me");
  const [remoteToast, setRemoteToast] = useState("");
  const [remoteSpeak, setRemoteSpeak] = useState("");
  const orderSend = useRef<((to: string, gag: string, arg: string) => void) | null>(null);
  useEffect(() => {
    if (!p.open) return;
    let dead = false;
    const timers: ReturnType<typeof setInterval>[] = [];
    fetch("/api/config")
      .then((r) => r.json())
      .then(async (cfg) => {
        if (dead || cfg.off || !cfg.supaUrl || !cfg.supaKey) return;
        const { createClient } = await import("@supabase/supabase-js");
        if (dead) return;
        const sb = createClient(cfg.supaUrl, cfg.supaKey);
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
            setVisitors(next);
          })
          .subscribe();
        const spy = sb.channel("spy");
        spy
          .on("broadcast", { event: "spy" }, (m: { payload: SpyMsg }) => {
            const d = m.payload;
            if (!d || !d.from) return;
            setFeed((prev) => [...prev.slice(-29), { from: d.from, text: d.text, at: d.at }]);
          })
          .subscribe();
        const orders = sb.channel("orders");
        orderSend.current = (to: string, gag: string, arg: string) => {
          try {
            orders.send({ type: "broadcast", event: "command", payload: { to, gag, arg } });
          } catch { /* radio silence */ }
        };
        orders.subscribe();
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
  };
  const remoteGag = (g: string) => {
    if (target === "me") p.onGag(g);
    else sendOrder(target, g, "");
  };
  if (!p.open) return null;
  const list = Object.keys(visitors).map((id) => visitors[id]);
  return (
    <PortalBox>
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={p.onClose} />
        <div className="relative bg-slate-950 border-2 border-red-500 rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto p-5">
          <div className="flex items-center justify-between mb-1">
            <h2 className="font-black text-lg">admin panel. you have no power here.</h2>
            <button onClick={p.onClose} className="font-black px-3 py-1 text-xl">X</button>
          </div>
          <p className="text-xs italic text-slate-500 mb-4">every button works. unfortunately.</p>
          <p className="text-xs font-bold uppercase text-slate-400 mb-2">trigger chaos (this screen)</p>
          <div className="grid grid-cols-3 gap-2 mb-4">
            {GAGS.map((g) => (
              <button key={g} onClick={() => p.onGag(g)} className="bg-slate-800 rounded-xl p-2 text-xs font-black uppercase">{g}</button>
            ))}
          </div>
          <p className="text-xs font-bold uppercase text-slate-400 mb-2">puppeteer</p>
          <div className="flex gap-2 mb-2">
            <input value={ghostText} onChange={(e) => setGhostText(e.target.value)} placeholder="ghost types..." className="flex-1 min-w-0 bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm" />
            <button onClick={() => { if (ghostText.trim() === "") return; p.onTypeText(ghostText); setGhostText(""); }} className="bg-purple-600 font-black text-xs uppercase rounded-xl px-4">type</button>
          </div>
          <div className="flex gap-2 mb-2">
            <button onClick={p.onScrollPrison} className="w-full bg-indigo-600 rounded-xl p-3 text-xs font-black uppercase">scroll prison (10s)</button>
          </div>
          <div className="flex gap-2 mb-2">
            <input value={toastText} onChange={(e) => setToastText(e.target.value)} placeholder="custom toast" className="flex-1 min-w-0 bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm" />
            <button onClick={() => { if (toastText.trim() === "") return; p.notify(toastText); setToastText(""); }} className="bg-lime-400 text-black font-black text-xs uppercase rounded-xl px-4">send</button>
          </div>
          <div className="flex gap-2 mb-4">
            <input value={speakText} onChange={(e) => setSpeakText(e.target.value)} placeholder="robot says..." className="flex-1 min-w-0 bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm" />
            <button onClick={() => { if (speakText.trim() === "") return; p.speak(speakText); setSpeakText(""); }} className="bg-lime-400 text-black font-black text-xs uppercase rounded-xl px-4">speak</button>
          </div>
          <p className="text-xs font-bold uppercase text-slate-400 mb-2">god mode toggles</p>
          <div className="space-y-2 mb-4 text-sm font-bold">
            <button onClick={p.onToggleFrozen} className="w-full bg-slate-900 rounded-xl p-3 flex justify-between"><span>hold still (freeze dodging)</span><span>{p.frozen ? "ON" : "OFF"}</span></button>
            <button onClick={p.onToggleSilenced} className="w-full bg-slate-900 rounded-xl p-3 flex justify-between"><span>silence (stop toasts + roasts)</span><span>{p.silenced ? "ON" : "OFF"}</span></button>
            <button onClick={p.onSkipTerms} className="w-full bg-slate-900 rounded-xl p-3 flex justify-between"><span>skip the terms (enable accept)</span><span>go</span></button>
            <button onClick={p.onTogglePacifist} className="w-full bg-slate-900 rounded-xl p-3 flex justify-between"><span>pacifist mode (disable gags)</span><span>{p.pacifist ? "ON" : "OFF"}</span></button>
          </div>
          <button onClick={p.onChaos} className="w-full bg-red-600 rounded-2xl p-4 font-black text-xl uppercase mb-6">CHAOS</button>
          <p className="text-xs font-bold uppercase text-lime-400 mb-2">mission control</p>
          {!supaOn && <p className="text-xs italic text-slate-500 bg-slate-900 rounded-xl p-3">mission control: offline (no supabase keys)</p>}
          {supaOn && (
            <div>
              <p className="text-lime-400 font-black mb-2">victims online: {list.length}</p>
              <div className="space-y-2 mb-3 max-h-32 overflow-y-auto">
                {list.length === 0 && <p className="text-slate-500 text-xs italic">nobody here. suspiciously quiet.</p>}
                {list.map((v) => (
                  <div key={v.id} className="text-xs bg-slate-900 rounded-lg p-2">
                    <span className="font-bold">{v.name}</span>
                    <span className="text-slate-500"> joined {new Date(v.joinedAt).toLocaleTimeString()}</span>
                  </div>
                ))}
              </div>
              <select value={target} onChange={(e) => setTarget(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm mb-3">
                <option value="me">THIS SCREEN</option>
                <option value="all">EVERYONE</option>
                {list.map((v) => <option key={v.id} value={v.id}>{v.name}</option>)}
              </select>
              <div className="grid grid-cols-3 gap-2 mb-3">
                {GAGS.map((g) => (
                  <button key={g} onClick={() => remoteGag(g)} className="bg-slate-800 rounded-xl p-2 text-xs font-black uppercase">{g}</button>
                ))}
              </div>
              <div className="flex gap-2 mb-2">
                <input value={remoteToast} onChange={(e) => setRemoteToast(e.target.value)} placeholder="remote toast" className="flex-1 min-w-0 bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm" />
                <button onClick={() => { if (remoteToast.trim() === "") return; if (target === "me") p.notify(remoteToast); else sendOrder(target, "toast", remoteToast); setRemoteToast(""); }} className="bg-lime-400 text-black font-black text-xs uppercase rounded-xl px-4">send</button>
              </div>
              <div className="flex gap-2 mb-3">
                <input value={remoteSpeak} onChange={(e) => setRemoteSpeak(e.target.value)} placeholder="remote robot says..." className="flex-1 min-w-0 bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm" />
                <button onClick={() => { if (remoteSpeak.trim() === "") return; if (target === "me") p.speak(remoteSpeak); else sendOrder(target, "speak", remoteSpeak); setRemoteSpeak(""); }} className="bg-lime-400 text-black font-black text-xs uppercase rounded-xl px-4">speak</button>
              </div>
              <p className="text-xs font-bold uppercase text-slate-400 mb-2">spy feed</p>
              <div className="space-y-1 max-h-32 overflow-y-auto bg-slate-900 rounded-xl p-2">
                {feed.length === 0 && <p className="text-slate-500 text-xs italic">no gossip yet.</p>}
                {feed.map((m, i) => (
                  <p key={i} className="text-xs"><span className="font-bold text-lime-400">{m.from}: </span>{m.text}</p>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </PortalBox>
  );
}
