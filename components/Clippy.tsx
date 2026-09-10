"use client";
import React, { useState } from "react";
import PortalBox from "./PortalBox";
export default function Clippy({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [dodged, setDodged] = useState(0);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [fixed, setFixed] = useState(false);
  if (!open) return null;
  const dodgeDismiss = () => {
    if (dodged >= 2) { onClose(); return; }
    setFixed(true);
    setPos({ x: Math.random() * (window.innerWidth - 200), y: Math.random() * (window.innerHeight - 200) });
    setDodged((d) => d + 1);
  };
  return (
    <PortalBox>
      <div className="fixed bottom-6 left-6 z-[120] bg-yellow-100 text-black rounded-2xl border-4 border-black p-4 max-w-[16rem] shadow-xl" style={fixed ? { position: "fixed", left: pos.x, top: pos.y, bottom: "auto" } : {}}>
        <p className="font-black text-sm">it looks like you are trying to leave. would you like help failing?</p>
        <p className="text-xs italic mt-1">- clippy, probably</p>
        <button onMouseEnter={dodgeDismiss} onTouchStart={dodgeDismiss} onClick={onClose} className="mt-2 bg-black text-white text-xs font-bold px-3 py-1 rounded">dismiss</button>
      </div>
    </PortalBox>
  );
}
