"use client";
import React, { useState } from "react";
import confetti from "canvas-confetti";
export default function DodgeBuy({ label, notify }: { label: string; notify: (msg: string) => void }) {
  const [fixed, setFixed] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [tn, setTn] = useState(0);
  const dodge = () => {
    setFixed(true);
    setPos({ x: Math.random() * (window.innerWidth - 140), y: Math.random() * (window.innerHeight - 60) });
  };
  return (
    <button
      onMouseEnter={dodge}
      onTouchStart={() => { if (tn < 3) { dodge(); setTn(tn + 1); } }}
      onClick={() => {
        confetti({ particleCount: 40, spread: 60 });
        notify("sold out. forever.");
      }}
      className="bg-lime-400 text-black px-6 py-3 rounded-xl font-black uppercase text-sm"
      style={fixed ? { position: "fixed", left: pos.x, top: pos.y, zIndex: 60 } : {}}
    >
      {label}
    </button>
  );
}
