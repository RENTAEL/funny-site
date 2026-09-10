"use client";
import React, { useState, useEffect, useRef } from "react";
export default function Reveal({ children }: { children: React.ReactNode }) {
  const [seen, setSeen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") { setSeen(true); return; }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) { setSeen(true); io.disconnect(); }
        });
      },
      { threshold: 0.12 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return <div ref={ref} className={seen ? "reveal in" : "reveal"}>{children}</div>;
}
