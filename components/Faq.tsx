"use client";
import React, { useState, useEffect, useRef } from "react";
const ITEMS = [
  { q: "what is this website?", a: "great question. next question." },
  { q: "why does nothing work?", a: "everything works. you are just using it wrong. allegedly." },
  { q: "how do i leave?", a: "you don't. but thanks for asking. cute." },
  { q: "is my data safe?", a: "what data? we don't want it. keep it." },
  { q: "who made this?", a: "no one will admit to it." },
];
export default function Faq({ notify }: { notify: (msg: string) => void }) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  const toggle = (i: number) => {
    if (timer.current) clearTimeout(timer.current);
    if (openIdx === i) { setOpenIdx(null); return; }
    setOpenIdx(i);
    timer.current = setTimeout(() => {
      setOpenIdx(null);
      notify("too slow.");
    }, 2000);
  };
  return (
    <div className="space-y-2">
      {ITEMS.map((it, i) => (
        <div key={it.q} className="bg-slate-900 rounded-xl overflow-hidden">
          <button onClick={() => toggle(i)} className="w-full text-left p-4 font-bold text-sm">{it.q}</button>
          {openIdx === i && <p className="px-4 pb-4 text-sm italic text-slate-400">{it.a}</p>}
        </div>
      ))}
    </div>
  );
}
