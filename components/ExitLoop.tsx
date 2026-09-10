"use client";
import React, { useState } from "react";
import PortalBox from "./PortalBox";
const GUILT = [
  "are you sure? we were just getting started.",
  "really? after everything we have been through?",
  "wow. okay. your loss. this site will remember this.",
  "fine. leave. see if those OTHER websites dodge buttons for you.",
  "last chance. i will literally cry. websites can cry. watch.",
];
export default function ExitLoop({ open, onStay }: { open: boolean; onStay: () => void }) {
  const [level, setLevel] = useState(0);
  if (!open) return null;
  const last = level >= GUILT.length - 1;
  return (
    <PortalBox>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
        <div className="relative bg-slate-800 rounded-2xl border-4 border-black p-6 w-full max-w-sm text-center">
          <p className="font-black mb-1">exit attempt {level + 1}/5</p>
          <p className="text-sm italic mb-4">{GUILT[level]}</p>
          {!last ? (
            <div className="flex gap-2">
              <button onClick={() => setLevel((l) => l + 1)} className="flex-1 bg-red-600 rounded-xl p-3 text-xs font-black uppercase">leave</button>
              <button onClick={() => { setLevel(0); onStay(); }} className="flex-1 bg-green-600 rounded-xl p-3 text-xs font-black uppercase">stay</button>
            </div>
          ) : (
            <button onClick={() => { setLevel(0); onStay(); }} className="w-full bg-green-600 rounded-xl p-3 text-xs font-black uppercase">ok fine i will stay (you have no choice anyway)</button>
          )}
        </div>
      </div>
    </PortalBox>
  );
}
