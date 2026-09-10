"use client";
import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
type Visitor = { id: string; name: string; browser: string; os: string; country: string; secs: number; at: number };
type SupportMsg = { id: string; name: string; text: string; at: number };
const GAGS = ["confetti", "boom", "gravity", "bsod", "spin", "invert", "drunk", "update"];
function fmt(s: number) {
  return Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0");
}
function PortalBox(props: { children: React.ReactNode }) {
  const [m, setM] = useState(false);
  useEffect(() => { setM(true); }, []);
  if (!m) return null;
  return createPortal(props.children, document.body);
}
export default function Admin() {
  const [gate, setGate] = useState("loading");
  const [pw, setPw] = useState("");
  const [loginMsg, setLoginMsg] = useState("");
  const [visitors, setVisitors] = useState<Record<string, Visitor>>({});
  const [target, setTarget] = useState("all");
  const [toastText, setToastText] = useState("");
  const [speakText, setSpeakText] = useState("");
  const [chat, setChat] = useState<SupportMsg[]>([]);
  const [reply, setReply] = useState("");
  const [pusherOn, setPusherOn] = useState(false);
  useEffect(() => {
    fetch("/api/admin/me")
      .then((r) => r.json())
      .then((d) => {
        if (d.setup === false) setGate("setup");
        else if (d.ok) setGate("in");
        else setGate("login");
      })
      .catch(() => setGate("login"));
  }, []);
  useEffect(() => {
    if (gate !== "in") return;
    let dead = false;
    const timers: ReturnType<typeof setInterval>[] = [];
    type PusherLike = { disconnect: () => void; subscribe: (n: string) => { bind: (e: string, c: (d: never) => void) => unknown } };
    let pusher: PusherLike | null = null;
    fetch("/api/config")
      .then((r) => r.json())
      .then(async (cfg) => {
        if (dead || cfg.off || !cfg.key || !cfg.cluster) return;
        const Pusher = (await import("pusher-js")).default;
        if (dead) return;
        pusher = new Pusher(cfg.key, { cluster: cfg.cluster });
        setPusherOn(true);
        const ch = pusher.subscribe("presence");
        ch.bind("visitor", (v: Visitor) => {
          if (!v || !v.id) return;
          setVisitors((prev) => {
            const next: Record<string, Visitor> = { ...prev };
            next[v.id] = v;
            return next;
          });
        });
        ch.bind("support-msg", (m: SupportMsg) => {
          if (!m || !m.id) return;
          setChat((prev) => [...prev.slice(-49), m]);
        });
        timers.push(setInterval(() => {
          setVisitors((prev) => {
            const now = Date.now();
            const next: Record<string, Visitor> = {};
            Object.keys(prev).forEach((id) => {
              if (now - prev[id].at < 25000) next[id] = prev[id];
            });
            return next;
          });
        }, 5000));
        const beat = () => {
          fetch("/api/signal", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ kind: "admin-alive" }) }).catch(() => {});
        };
        beat();
        timers.push(setInterval(beat, 10000));
      })
      .catch(() => {});
    return () => {
      dead = true;
      timers.forEach((t) => clearInterval(t));
      if (pusher) pusher.disconnect();
    };
  }, [gate]);
  const fire = (cmd: string, arg: string) => {
    fetch("/api/command", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ target, cmd, arg }) }).catch(() => {});
  };
  const chaos = () => {
    const pool = [...GAGS].sort(() => Math.random() - 0.5).slice(0, 3);
    pool.forEach((g, i) => setTimeout(() => fire(g, ""), i * 700));
  };
  const login = () => {
    setLoginMsg("");
    fetch("/api/admin/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password: pw }) })
      .then((r) => r.json())
      .then((d) => {
        if (d.ok) setGate("in");
        else setLoginMsg(d.error || "wrong. embarrassing.");
      })
      .catch(() => setLoginMsg("nope. try again."));
  };
  if (gate === "loading") {
    return <div className="min-h-screen bg-slate-950 text-lime-400 font-mono p-6">waking up mission control...</div>;
  }
  if (gate === "setup") {
    return <div className="min-h-screen bg-slate-950 text-lime-400 font-mono p-6">mission control offline. check your env vars, genius.</div>;
  }
  if (gate === "login") {
    return (
      <PortalBox>
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
          <div className="relative bg-slate-900 border-2 border-lime-400 rounded-2xl p-6 w-full max-w-sm">
            <h1 className="text-lime-400 font-black text-2xl mb-1">mission control</h1>
            <p className="text-slate-400 text-xs italic mb-4">the only functional form here. cherish it.</p>
            <input type="password" value={pw} onChange={(e) => setPw(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") login(); }} placeholder="password" className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white text-sm outline-none mb-3" />
            <button onClick={login} className="w-full bg-lime-400 text-black font-black uppercase text-sm rounded-lg p-3">enter</button>
            {loginMsg !== "" && <p className="text-red-400 text-xs italic mt-2">{loginMsg}</p>}
          </div>
        </div>
      </PortalBox>
    );
  }
  const list = Object.keys(visitors).map((id) => visitors[id]);
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 max-w-3xl mx-auto">
      <p className="text-lime-400 font-black text-3xl mb-1">victims online: {list.length}</p>
      <p className="text-slate-500 text-xs italic mb-6">{pusherOn ? "live feed. prank responsibly." : "connecting to the void..."}</p>
      <div className="space-y-2 mb-4">
        {list.length === 0 && <p className="text-slate-500 text-sm italic">nobody here. suspiciously quiet.</p>}
        {list.map((v) => (
          <div key={v.id} className="flex items-center gap-2 bg-slate-900 rounded-xl p-3 text-sm">
            <span className="w-2 h-2 rounded-full bg-green-500 shrink-0" />
            <span className="font-bold">{v.name}</span>
            <span className="text-slate-400 text-xs">{v.country} and {v.browser} on {v.os}</span>
            <span className="ml-auto font-mono text-xs text-lime-400">{fmt(v.secs)}</span>
          </div>
        ))}
      </div>
      <select value={target} onChange={(e) => setTarget(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm mb-4">
        <option value="all">EVERYONE</option>
        {list.map((v) => <option key={v.id} value={v.id}>{v.name}</option>)}
      </select>
      <div className="grid grid-cols-4 gap-2 mb-4">
        {GAGS.map((g) => <button key={g} onClick={() => fire(g, "")} className="bg-slate-800 rounded-xl p-3 text-xs font-black uppercase">{g}</button>)}
      </div>
      <div className="flex gap-2 mb-2">
        <input value={toastText} onChange={(e) => setToastText(e.target.value)} placeholder="custom toast" className="flex-1 min-w-0 bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm" />
        <button onClick={() => { fire("toast", toastText); setToastText(""); }} className="bg-lime-400 text-black font-black text-xs uppercase rounded-xl px-4">send</button>
      </div>
      <div className="flex gap-2 mb-6">
        <input value={speakText} onChange={(e) => setSpeakText(e.target.value)} placeholder="robot voice says..." className="flex-1 min-w-0 bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm" />
        <button onClick={() => { fire("speak", speakText); setSpeakText(""); }} className="bg-lime-400 text-black font-black text-xs uppercase rounded-xl px-4">speak</button>
      </div>
      <div className="bg-slate-900 rounded-2xl p-4 mb-6">
        <p className="font-black text-sm uppercase mb-1">support inbox</p>
        <p className="text-slate-500 text-xs italic mb-3">you are support. act natural.</p>
        <div className="space-y-2 max-h-48 overflow-y-auto mb-3">
          {chat.length === 0 && <p className="text-slate-500 text-xs italic">no victims asking for help yet.</p>}
          {chat.map((m, i) => (
            <div key={i} className="text-xs bg-slate-950 rounded-lg p-2">
              <span className="font-bold text-lime-400">{m.name}: </span>{m.text}
              <button onClick={() => setTarget(m.id)} className="ml-2 underline text-slate-400">target</button>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input value={reply} onChange={(e) => setReply(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { fire("chat", reply); setReply(""); } }} placeholder="reply as support..." className="flex-1 min-w-0 bg-slate-950 border border-slate-700 rounded-xl p-3 text-sm" />
          <button onClick={() => { fire("chat", reply); setReply(""); }} className="bg-green-600 font-black text-xs uppercase rounded-xl px-4">reply</button>
        </div>
      </div>
      <button onClick={chaos} className="w-full bg-red-600 rounded-2xl p-5 font-black text-2xl uppercase mb-8">CHAOS</button>
    </div>
  );
}

