"use client";
import React, { useState } from "react";
import PortalBox from "./PortalBox";
type Props = {
  open: boolean;
  onClose: () => void;
  comic: string;
  frozen: boolean;
  silenced: boolean;
  onToggleFrozen: () => void;
  onToggleSilenced: () => void;
  onSkipTerms: () => void;
  onGag: (g: string) => void;
  onChaos: () => void;
  notify: (msg: string) => void;
  speak: (msg: string) => void;
};
const GAGS = ["spin", "invert", "gravity", "drunk", "bsod", "update", "confetti", "boom", "comic", "crt"];
export default function AdminPanel(p: Props) {
  const [toastText, setToastText] = useState("");
  const [speakText, setSpeakText] = useState("");
  if (!p.open) return null;
  return (
    <PortalBox>
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={p.onClose} />
        <div className="relative bg-slate-950 border-2 border-red-500 rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto p-5">
          <div className={`flex items-center justify-between mb-1 ${p.comic}`}>
            <h2 className="font-black text-lg">admin panel. you have no power here.</h2>
            <button onClick={p.onClose} className="font-black px-3 py-1 text-xl">X</button>
          </div>
          <p className="text-xs italic text-slate-500 mb-4">every button works. unfortunately.</p>
          <p className="text-xs font-bold uppercase text-slate-400 mb-2">trigger chaos</p>
          <div className="grid grid-cols-2 gap-2 mb-4">
            {GAGS.map((g) => (
              <button key={g} onClick={() => p.onGag(g)} className="bg-slate-800 rounded-xl p-3 text-xs font-black uppercase">{g}</button>
            ))}
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
          </div>
          <button onClick={p.onChaos} className="w-full bg-red-600 rounded-2xl p-4 font-black text-xl uppercase">CHAOS</button>
        </div>
      </div>
    </PortalBox>
  );
}
