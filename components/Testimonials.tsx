"use client";
import React, { useState, useEffect } from "react";
const REVIEWS = [
  { text: "changed my life", author: "definitely a real person" },
  { text: "it knows where i live", author: "xX_shadow_Xx" },
  { text: "5 stars. please let me go", author: "my therapist" },
  { text: "i came for the jokes. i stayed because the exit is fake", author: "loyal_user_99" },
  { text: "my cursor has ptsd now", author: "clicky mcclickface" },
];
export default function Testimonials({ notify }: { notify: (msg: string) => void }) {
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % REVIEWS.length), 3500);
    return () => clearInterval(t);
  }, [paused]);
  const r = REVIEWS[idx];
  return (
    <div
      onMouseEnter={() => { setPaused(true); notify("oh NOW you want to read them"); }}
      onMouseLeave={() => setPaused(false)}
      className="bg-slate-900 p-6 rounded-2xl text-center min-h-[12rem] flex flex-col justify-center"
    >
      <p className="text-yellow-400 text-xs">{"*".repeat(5)}</p>
      <p className="text-lg italic mt-2">"{r.text}"</p>
      <p className="text-xs text-yellow-400 font-bold mt-2">- {r.author}</p>
      <p className="text-[11px] text-slate-500 mt-3">{idx + 1} / {REVIEWS.length}</p>
    </div>
  );
}
