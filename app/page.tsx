"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const TITLES = ["you're doing it wrong", "why are you still here", "stop that", "L + ratio", "imagine clicking this"];
const SASSY_MESSAGES = ["no you don't do it there, genius 💀", "bold of you to assume that would work", "bro really thought 💀", "absolutely not", "try harder"];
const TOASTS = ["you've been here 30 seconds and already lost", "the button is lying to you. or am i?", "achievement unlocked: confusion", "ngl that was embarrassing", "still trying? cute."];

export default function OppositeExe() {
  // Global State
  const [isRainbow, setIsRainbow] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const [isComicSans, setIsComicSans] = useState(false);
  const [isInverted, setIsInverted] = useState(false);
  const [isSpun, setIsSpun] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // Username Trap State
  const [username, setUsername] = useState('');
  const [usernameMsg, setUsernameMsg] = useState('');
  const [usernameAttempts, setUsernameAttempts] = useState(0);
  const [usernamePos, setUsernamePos] = useState({ x: 0, y: 0 });
  const usernameRef = useRef<HTMLInputElement>(null);

  // Runaway Button State
  const [btnPos, setBtnPos] = useState({ x: 0, y: 0 });
  const [btnFixed, setBtnFixed] = useState(false);

  // Loading Bar State
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [loadMsg, setLoadMsg] = useState('loading useful content...');

  // Backwards Field State
  const [backwardsVal, setBackwardsVal] = useState('');

  // Cursor Trail
  const [trail, setTrail] = useState<{ id: number; x: number; y: number }[]>([]);

  // Audio Context
  const audioCtx = useRef<AudioContext | null>(null);

  useEffect(() => {
    // Title Rotation
    const titleInterval = setInterval(() => {
      document.title = TITLES[Math.floor(Math.random() * TITLES.length)];
    }, 3000);

    // Sassy Toasts
    const toastInterval = setInterval(() => {
      const msg = TOASTS[Math.floor(Math.random() * TOASTS.length)];
      setToast(msg);
      setTimeout(() => setToast(null), 4000);
    }, 15000);

    // Emoji Trail
    const handleMouseMove = (e: MouseEvent) => {
      setTrail(prev => {
        const newTrail = [...prev, { id: Date.now(), x: e.clientX, y: e.clientY }];
        return newTrail.slice(-15);
      });
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Reverse Scroll
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      window.scrollBy({
        top: -e.deltaY,
        behavior: 'auto'
      });
    };
    window.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      clearInterval(titleInterval);
      clearInterval(toastInterval);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('wheel', handleWheel);
    };
  }, []);

  // Cursor Trail Cleanup
  useEffect(() => {
    const timer = setInterval(() => {
      setTrail(prev => prev.slice(1));
    }, 100);
    return () => clearInterval(timer);
  }, []);

  const playAirhorn = () => {
    if (!audioCtx.current) audioCtx.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    const ctx = audioCtx.current;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(440, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(480, ctx.currentTime + 0.1);

    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.5);
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setUsernameAttempts(prev => prev + 1);
    setUsernameMsg(SASSY_MESSAGES[Math.floor(Math.random() * SASSY_MESSAGES.length)]);
    setUsername(''); // Clear it immediately

    if (usernameAttempts >= 3) {
      setUsernamePos({
        x: Math.random() * 100 - 50,
        y: Math.random() * 100 - 50,
      });
    }
  };

  const handleRunawayBtnHover = (e: React.MouseEvent) => {
    setBtnFixed(true);
    setBtnPos({
      x: Math.random() * (window.innerWidth - 100),
      y: Math.random() * (window.innerHeight - 100),
    });
  };

  const handleRunawayClick = () => {
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 }
    });
    alert("wow. you did it. nobody is proud of you.");
  };

  const startLoading = async () => {
    setLoading(true);
    setProgress(0);
    setLoadMsg('loading useful content...');

    for (let i = 0; i <= 99; i++) {
      setProgress(i);
      await new Promise(r => setTimeout(r, 20));
    }

    setLoadMsg('almost there...');
    await new Promise(r => setTimeout(r, 1000));

    setLoadMsg('oops. anyway.');
    setProgress(0);
    await new Promise(r => setTimeout(r, 1000));
    setLoading(false);
  };

  const handleRedButton = () => {
    if (!isSpun) {
      setIsSpun(true);
      setIsInverted(true);
      playAirhorn();
    } else {
      setIsSpun(false);
      setIsInverted(false);
      setIsComicSans(true);
    }
  };

  return (
    <div
      className={cn(
        "min-h-screen transition-all duration-500 overflow-x-hidden",
        isRainbow ? "bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500 animate-pulse" : "bg-slate-900",
        isInverted ? "invert" : "",
        isComicSans ? "font-['Comic_Sans_MS',_cursive]" : "font-sans"
      )}
      style={{
        fontSize: `${fontSize}px`,
        transform: isSpun ? "rotate(360deg)" : "rotate(0deg)",
        transition: "transform 1s ease-in-out"
      }}
    >
      {/* Emoji Trail */}
      {trail.map(t => (
        <div
          key={t.id}
          className="fixed pointer-events-none text-2xl z-[9999]"
          style={{ left: t.x, top: t.y }}
        >
          💀
        </div>
      ))}

      {/* Sassy Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-8 right-8 bg-white text-black p-4 rounded-2xl shadow-2xl z-[100] font-bold italic border-4 border-black"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="p-4 md:p-12 max-w-5xl mx-auto text-slate-100">

        <header className="text-center mb-20">
          <motion.h1
            animate={{ x: [-2, 2, -2], opacity: [1, 0.8, 1] }}
            transition={{ repeat: Infinity, duration: 0.1 }}
            className="text-6xl md:text-9xl font-black uppercase mb-4 italic tracking-tighter"
          >
            OPPOSITE.EXE
          </motion.h1>
          <div className="text-xl font-bold bg-yellow-400 text-black py-1">
            welcome to the worst experience of your life • please leave immediately • we know where you live • L + ratio
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

          {/* Username Trap */}
          <section className="bg-slate-800 p-8 rounded-3xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <h2 className="text-2xl font-black mb-6 uppercase italic">sign up</h2>
            <div className="space-y-4">
              <div className="relative">
                <input
                  ref={usernameRef}
                  type="text"
                  value={username}
                  onChange={handleUsernameChange}
                  placeholder="username"
                  className={cn(
                    "w-full bg-slate-100 text-black p-4 rounded-lg font-bold outline-none transition-all",
                    usernameAttempts >= 3 && "absolute"
                  )}
                  style={usernameAttempts >= 3 ? {
                    left: usernamePos.x,
                    top: usernamePos.y
                  } : {}}
                />
                <p className="mt-2 text-sm text-red-400 font-bold italic">{usernameMsg}</p>
              </div>
              <button
                onMouseEnter={handleRunawayBtnHover}
                onClick={handleRunawayClick}
                className={cn(
                  "bg-blue-600 text-white px-8 py-4 rounded-lg font-black uppercase transition-all",
                  btnFixed ? "fixed z-50" : ""
                )}
                style={btnFixed ? { left: btnPos.x, top: btnPos.y } : {}}
              >
                Submit
              </button>
            </div>
          </section>

          {/* Opposite Controls */}
          <section className="bg-slate-800 p-8 rounded-3xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] space-y-8">
            <h2 className="text-2xl font-black mb-6 uppercase italic">controls</h2>

            <div className="flex items-center justify-between p-4 bg-slate-900 rounded-xl">
              <span className="font-bold">dark mode</span>
              <button
                onClick={() => setIsRainbow(!isRainbow)}
                className="w-12 h-6 bg-slate-700 rounded-full relative transition-colors"
              >
                <div className={cn(
                  "absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-all",
                  isRainbow ? "left-7 bg-yellow-400" : ""
                )} />
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-900 rounded-xl">
              <span className="font-bold">mute</span>
              <button
                onClick={playAirhorn}
                className="bg-red-600 px-4 py-1 rounded font-bold hover:bg-red-500 transition-colors"
              >
                OFF
              </button>
            </div>

            <div className="space-y-2">
              <span className="font-bold text-sm uppercase">Volume</span>
              <input
                type="range"
                className="w-full accent-pink-500"
                onChange={(e) => setFontSize(parseInt(e.target.value))}
                min="8" max="100"
              />
            </div>
          </section>

          {/* Backwards Field */}
          <section className="bg-slate-800 p-8 rounded-3xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <h2 className="text-2xl font-black mb-6 uppercase italic">backwards thinking</h2>
            <input
              type="text"
              value={backwardsVal}
              onChange={(e) => setBackwardsVal(e.target.value.split('').reverse().join(''))}
              placeholder="type something..."
              className="w-full bg-slate-100 text-black p-4 rounded-lg font-bold outline-none"
            />
            <p className="mt-2 text-xs text-slate-400 italic">your thoughts are literally backwards</p>
          </section>

          {/* Fake Loader */}
          <section className="bg-slate-800 p-8 rounded-3xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <h2 className="text-2xl font-black mb-6 uppercase italic">optimization</h2>
            <div className="bg-slate-900 p-6 rounded-xl text-center space-y-4">
              <p className="text-sm font-bold italic">{loadMsg}</p>
              <div className="w-full h-6 bg-slate-700 rounded-full overflow-hidden border-2 border-black">
                <motion.div
                  className="h-full bg-green-500"
                  animate={{ width: `${progress}%` }}
                />
              </div>
              {!loading && (
                <button
                  onClick={startLoading}
                  className="bg-green-600 text-white px-4 py-2 rounded font-bold uppercase text-xs"
                >
                  Start Optimization
                </button>
              )}
            </div>
          </section>

          {/* The Red Button */}
          <section className="col-span-1 md:col-span-2 flex flex-col items-center justify-center p-12 bg-red-900/20 rounded-3xl border-4 border-red-600 border-dashed">
            <h2 className="text-3xl font-black mb-8 uppercase italic text-red-500 animate-pulse">DO NOT PRESS</h2>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleRedButton}
              className="w-48 h-48 bg-red-600 rounded-full border-8 border-red-800 shadow-[0_20px_0_0_rgba(153,27,27,1)] active:shadow-none active:translate-y-4 transition-all flex items-center justify-center group"
            >
              <span className="text-white font-black text-2xl group-hover:scale-110 transition-transform">PRESS ME</span>
            </motion.button>
            <p className="mt-12 text-xs text-red-400 italic font-mono">serious warning: pressing this might cause extreme confusion</p>
          </section>

        </div>
      </div>
    </div>
  );
}

