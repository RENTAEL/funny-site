"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import PortalBox from "../components/PortalBox";
import Modal from "../components/Modal";
import DodgeBuy from "../components/DodgeBuy";
import AdminPanel from "../components/AdminPanel";
// twMerge-import-replaced from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}


const TITLES = ["you're doing it wrong", "why are you still here", "stop that", "L + ratio", "imagine clicking this"];
const BETRAYAL_TITLES = ["wow. just left me?", "fine. go.", "you'll be back"];
const SASSY_MESSAGES = ["no you don't do it there, genius \u{1F480}", "bold of you to assume that would work", "bro really thought \u{1F480}", "absolutely not", "try harder"];
const TOASTS = ["you've been here 30 seconds and already lost", "the button is lying to you. or am i?", "achievement unlocked: confusion", "ngl that was embarrassing", "still trying? cute."];
const CAPTCHA_MSGS = ["hmm. suspicious.", "a human would click faster", "one more time. slower."];
const THREATS = ["skill_issue.exe", "touching_grass.dll (missing)", "browser_history_sus.zip"];
const CHAT_REPLIES = ["have you tried not having this problem?", "our team is currently laughing at your message", "please hold..."];
const TESTIMONIALS = [
  { text: "i lost 4 minutes of my life. 5 stars.", author: "definitely a real person" },
  { text: "this website dodged my cursor. i'm in love.", author: "xX_shadow_Xx" },
  { text: "why does this exist", author: "my therapist" },
];
const BOOT_LINES = ["loading chaos... \u2713", "downloading more RAM... \u2713", "judging you... \u2713", "welcome."];
const HYDRA_MSGS = ["we use cookies. you can't stop us.", "how dare you", "rude but ok", "wow. again?", "the cookies are multiplying", "this is your fault", "fine. have another one", "ok that's 8. we're done here."];
const BASE_CLAUSES = [
  "by reading this you owe me a sandwich",
  "clause 12: the website is always right. especially when wrong",
  "clause 108: you agree to agree",
  "clause 256: your cursor may be detained for questioning",
  "clause 512: all complaints go to /dev/null",
  "clause 1024: you are now the website",
  "clause 2048: scrolling constitutes legally binding dance moves",
  "clause 4096: this clause intentionally left blank-ish",
  "clause 7: we skipped 1-6. mind your business",
  "clause 9000: it's over 9000. that's the clause",
  "final clause: there is no final clause",
];
const EMOJI_POOL = ["\u{1F921}", "\u{1F436}", "\u{1F34C}", "\u{1F680}", "\u{1F47B}", "\u{1F34D}", "\u{1F525}", "\u{1F480}", "\u{1F984}", "\u{1F412}"];
const KONAMI = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];

type ChatMsg = { me: boolean; text: string };
// CHANGE THIS PHRASE TO WHATEVER YOU WANT THE SECRET ADMIN PHRASE TO BE
const SECRET_PHRASE = "letmein";

export default function OppositeExe() {
  const [isRainbow, setIsRainbow] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const [isComicSans, setIsComicSans] = useState(false);
  const [isInverted, setIsInverted] = useState(false);
  const [isSpun, setIsSpun] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [achieve, setAchieve] = useState<string | null>(null);
  const [username, setUsername] = useState('');
  const [usernameMsg, setUsernameMsg] = useState('');
  const [usernameAttempts, setUsernameAttempts] = useState(0);
  const [usernamePos, setUsernamePos] = useState({ x: 0, y: 0 });
  const usernameRef = useRef<HTMLInputElement>(null);
  const [btnPos, setBtnPos] = useState({ x: 0, y: 0 });
  const [btnFixed, setBtnFixed] = useState(false);
  const [btnTouch, setBtnTouch] = useState(0);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [loadMsg, setLoadMsg] = useState('loading useful content...');
  const [backwardsVal, setBackwardsVal] = useState('');
  const [trail, setTrail] = useState<{ id: number; x: number; y: number }[]>([]);
  const trailId = useRef(0);
  const [captchaClicks, setCaptchaClicks] = useState(0);
  const [captchaChecked, setCaptchaChecked] = useState(false);
  const [captchaMsg, setCaptchaMsg] = useState('');
  const [scanning, setScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanDone, setScanDone] = useState(false);
  const [fixMsg, setFixMsg] = useState('');
  const [pw, setPw] = useState('');
  const [pwMsg, setPwMsg] = useState('');
  const [bsod, setBsod] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMsgs, setChatMsgs] = useState<ChatMsg[]>([{ me: false, text: "hi welcome to 24/7 support. what's broken (besides everything)?" }]);
  const [chatInput, setChatInput] = useState('');
  const [chatDead, setChatDead] = useState(false);
  const [honestMsg, setHonestMsg] = useState('');
  const [seconds, setSeconds] = useState(0);
  const [gravity, setGravity] = useState(false);
  const [crt, setCrt] = useState(false);
  const [booted, setBooted] = useState(false);
  const [bootLines, setBootLines] = useState(0);
  const [skipFixed, setSkipFixed] = useState(false);
  const [skipPos, setSkipPos] = useState({ x: 0, y: 0 });
  const [skipTouch, setSkipTouch] = useState(0);
  const [banners, setBanners] = useState<number[]>([]);
  const bannerId = useRef(1);
  const [termsOpen, setTermsOpen] = useState(false);
  const [termsExtra, setTermsExtra] = useState(0);
  const [termsAccept, setTermsAccept] = useState(false);
  const [precision, setPrecision] = useState(false);
  const [fakeCursor, setFakeCursor] = useState({ x: -100, y: -100 });
  const [updateOpen, setUpdateOpen] = useState(false);
  const [updateProgress, setUpdateProgress] = useState(0);
  const [delStage, setDelStage] = useState(0);
  const [yesDodges, setYesDodges] = useState(0);
  const [yesFixed, setYesFixed] = useState(false);
  const [yesPos, setYesPos] = useState({ x: 0, y: 0 });
  const [imgGrid, setImgGrid] = useState<string[]>([]);
  const [imgFails, setImgFails] = useState(0);
  const [imgPassed, setImgPassed] = useState(false);
  const [imgMsg, setImgMsg] = useState('');
  const [matrix, setMatrix] = useState(false);
  const [godMode, setGodMode] = useState(false);
  const [sillyName, setSillyName] = useState("mystery guest");
  const [logoClicks, setLogoClicks] = useState(0);
  const [adminOpen, setAdminOpen] = useState(false);
  const [frozen, setFrozen] = useState(false);
  const [silenced, setSilenced] = useState(false);
  const phraseBuf = useRef("");
  const logoTimes = useRef<number[]>([]);
  const deniedArmed = useRef(true);
  const silencedRef = useRef(false);
  const audioCtx = useRef<AudioContext | null>(null);
  const lastActive = useRef<number>(Date.now());
  const clickCount = useRef<number>(0);
  const scrolled = useRef<boolean>(false);
  const milestones = useRef<Set<number>>(new Set());
  const achieveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mouseRef = useRef({ x: -100, y: -100 });
  const driftRef = useRef({ x: 0, y: 0, at: 0 });
  const konamiIdx = useRef(0);
  const godBusy = useRef(false);
  const matrixRef = useRef<HTMLCanvasElement>(null);
  const sidRef = useRef("");
  const nameRef = useRef("mystery guest");
  const liveAdmin = useRef(false);
  const lastAdminRef = useRef(0);
  const joinedAt = useRef(Date.now());

  const showAchieve = (text: string) => {
    setAchieve(text);
    vineBoom();
    if (achieveTimer.current) clearTimeout(achieveTimer.current);
    achieveTimer.current = setTimeout(() => setAchieve(null), 4000);
  };

  const getAudio = () => {
    if (!audioCtx.current) audioCtx.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    return audioCtx.current;
  };

  const vineBoom = () => {
    try {
      const ctx = getAudio();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(160, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(38, ctx.currentTime + 0.45);
      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.5);
    } catch {
      // silence is also funny
    }
  };

  useEffect(() => {
    const titleInterval = setInterval(() => {
      if (document.hidden) return;
      document.title = TITLES[Math.floor(Math.random() * TITLES.length)];
    }, 3000);
    const toastInterval = setInterval(() => {
      if (silencedRef.current) return;
      const msg = TOASTS[Math.floor(Math.random() * TOASTS.length)];
      setToast(msg);
      setTimeout(() => setToast(null), 4000);
    }, 15000);
    const handleMouseMove = (e: MouseEvent) => {
      lastActive.current = Date.now();
      mouseRef.current = { x: e.clientX, y: e.clientY };
      setTrail(prev => {
        const newTrail = [...prev, { id: (trailId.current += 1), x: e.clientX, y: e.clientY }];
        return newTrail.slice(-15);
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const t = e.target as HTMLElement;
      if (t && t.closest && t.closest("[data-modal-scroll]")) return;
      window.scrollBy({ top: -e.deltaY, behavior: 'auto' });
    };
    window.addEventListener('wheel', handleWheel, { passive: false });
    const handleVis = () => {
      if (document.hidden) {
        document.title = BETRAYAL_TITLES[Math.floor(Math.random() * BETRAYAL_TITLES.length)];
      } else {
        setToast("oh NOW you come back");
        setTimeout(() => setToast(null), 4000);
      }
    };
    document.addEventListener('visibilitychange', handleVis);
    const idleInterval = setInterval(() => {
      if (!silencedRef.current && Date.now() - lastActive.current > 10000) {
        lastActive.current = Date.now();
        setToast("hello?? did you fall asleep? honestly fair.");
        setTimeout(() => setToast(null), 4000);
      }
    }, 1000);
    const handleCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      if (e.clipboardData) e.clipboardData.setData('text/plain', 'you thought \u{1F480}');
      setToast("stealing my content? bold.");
      setTimeout(() => setToast(null), 4000);
    };
    window.addEventListener('copy', handleCopy);
    const timeInterval = setInterval(() => {
      setSeconds(prev => {
        const next = prev + 1;
        const marks: Record<number, string> = {
          60: "a whole minute. of your life. gone.",
          180: "you could've learned a skill by now",
          300: "seek help. or don't. i'm a website, not your mom",
        };
        if (marks[next] && !milestones.current.has(next)) {
          milestones.current.add(next);
          setToast(marks[next]);
          setTimeout(() => setToast(null), 4000);
        }
        return next;
      });
    }, 1000);
    const handleClick = () => {
      if (Math.random() < 0.15) vineBoom();
      clickCount.current += 1;
      if (clickCount.current === 10) showAchieve("achievement: why");
    };
    window.addEventListener('click', handleClick);
    const handleScroll = () => {
      if (!scrolled.current) {
        scrolled.current = true;
        showAchieve("achievement: smooth criminal");
      }
    };
    window.addEventListener('scroll', handleScroll);
    const handleKey = (e: KeyboardEvent) => {
      lastActive.current = Date.now();
      if (e.key === 'Escape') showAchieve("there is no escape");
    };
    window.addEventListener('keydown', handleKey);
    return () => {
      clearInterval(titleInterval);
      clearInterval(toastInterval);
      clearInterval(idleInterval);
      clearInterval(timeInterval);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('copy', handleCopy);
      window.removeEventListener('click', handleClick);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('keydown', handleKey);
      document.removeEventListener('visibilitychange', handleVis);
      if (achieveTimer.current) clearTimeout(achieveTimer.current);
    };
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTrail(prev => prev.slice(1));
    }, 100);
    return () => clearInterval(timer);
  }, []);
  useEffect(() => {
    try {
      if (sessionStorage.getItem("opp_booted")) { setBooted(true); return; }
    } catch {
      // private mode: suffer the boot
    }
    if (booted) return;
    if (bootLines >= BOOT_LINES.length) {
      completeBoot();
      return;
    }
    const t = setTimeout(() => setBootLines(b => b + 1), 650);
    return () => clearTimeout(t);
  }, [bootLines, booted]);

  const completeBoot = () => {
    try { sessionStorage.setItem("opp_booted", "1"); } catch {
      // ok
    }
    setBooted(true);
  };

  const dodgeSkip = () => {
    if (frozen) return;
    setSkipFixed(true);
    setSkipPos({
      x: Math.random() * (window.innerWidth - 80),
      y: Math.random() * (window.innerHeight - 40),
    });
  };

  useEffect(() => {
    const t = setTimeout(() => setBanners(b => (b.length === 0 ? [0] : b)), 2500);
    return () => clearTimeout(t);
  }, []);

  const declineCookie = () => {
    setBanners(prev => {
      if (prev.length >= 8) {
        setToast("ok that's 8. we're done here.");
        setTimeout(() => setToast(null), 4000);
        return prev;
      }
      const next = [...prev];
      while (next.length < 8 && next.length < prev.length + 2) {
        next.push(bannerId.current++);
      }
      return next;
    });
  };

  const acceptCookies = () => {
    setBanners([]);
    setToast("coward.");
    setTimeout(() => setToast(null), 4000);
  };

  useEffect(() => {
    if (!termsOpen) return;
    setTermsAccept(false);
    setTermsExtra(0);
    const t = setTimeout(() => setTermsAccept(true), 20000);
    return () => clearTimeout(t);
  }, [termsOpen]);

  const handleTermsScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    if (el.scrollTop + el.clientHeight > el.scrollHeight - 120) {
      setTermsExtra(prev => prev + 20);
    }
  };

  useEffect(() => {
    if (!precision) return;
    let raf = 0;
    const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const loop = () => {
      raf = requestAnimationFrame(loop);
      const now = Date.now();
      if (now - driftRef.current.at > 3500) {
        driftRef.current = { x: (Math.random() - 0.5) * 220, y: (Math.random() - 0.5) * 220, at: now };
      }
      const tx = mouseRef.current.x + Math.sin(now / 280) * 14 + driftRef.current.x;
      const ty = mouseRef.current.y + Math.cos(now / 340) * 14 + driftRef.current.y;
      pos.x += (tx - pos.x) * 0.12;
      pos.y += (ty - pos.y) * 0.12;
      setFakeCursor({ x: pos.x, y: pos.y });
    };
    loop();
    return () => cancelAnimationFrame(raf);
  }, [precision]);

  useEffect(() => {
    if (!matrix) return;
    const canvas = matrixRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const chars = "\u30A2\u30A4\u30A6\u30A8\u30AA\u30AB\u30AD\u30AF\u30B1\u30B30123456789".split("");
    const fs = 14;
    const cols = Math.floor(canvas.width / fs);
    const drops: number[] = Array.from({ length: cols }, () => Math.random() * -50);
    let frame = 0;
    let raf = 0;
    const draw = () => {
      raf = requestAnimationFrame(draw);
      if (++frame % 3 !== 0) return;
      ctx.fillStyle = "rgba(0,0,0,0.08)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#0f0";
      ctx.font = `${fs}px monospace`;
      drops.forEach((y, i) => {
        const ch = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(ch, i * fs, y * fs);
        if (y * fs > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      });
    };
    draw();
    return () => cancelAnimationFrame(raf);
  }, [matrix]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      if (k === KONAMI[konamiIdx.current]) {
        konamiIdx.current += 1;
        if (konamiIdx.current === KONAMI.length) {
          konamiIdx.current = 0;
          if (!godBusy.current) {
            godBusy.current = true;
            setGodMode(true);
            setGravity(true);
            setIsRainbow(true);
            setIsSpun(true);
            vineBoom();
            confetti({ particleCount: 200, spread: 120 });
            setToast("GOD MODE");
            setTimeout(() => vineBoom(), 600);
            setTimeout(() => {
              setGodMode(false);
              setGravity(false);
              setIsRainbow(false);
              setIsSpun(false);
              setToast("ok. that's enough.");
              setTimeout(() => setToast(null), 4000);
              godBusy.current = false;
            }, 5000);
          }
        }
      } else {
        konamiIdx.current = 0;
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    setImgGrid(freshGrid());
  }, []);

  const freshGrid = () => Array.from({ length: 9 }, () => EMOJI_POOL[Math.floor(Math.random() * EMOJI_POOL.length)]);

  useEffect(() => {
    console.log("%c      .-oo-.\n     / .--. \\\n    | (o)(o) |\n     \\  --  /\n      |    |", "color:#0f0;font-family:monospace;font-size:12px;");
    console.log("%cwhat are you doing in here.", "font-size:22px;color:#0f0;font-weight:bold;");
    console.log("%cthis area is for developers only. based on your browsing, that ain't you.", "color:#0f0;");
    console.log("%cclose this. go back. touch the funny buttons like a normal person.", "color:#0f0;");
    console.log("%cSTOP!", "font-size:52px;font-weight:bold;color:red;");
    console.log("%cdo not paste anything here. if someone told you to paste something here, they are scamming you. also, we both know you don't know what this panel does.", "font-size:14px;color:#fff;");
    const w = window as unknown as Record<string, unknown>;
    w.help = () => "no.";
    w.fix = () => "unfixable. we've tried.";
    w.hack = () => {
      console.log("hacking...");
      console.log("done. you now have nothing. same as before.");
      return "done. you now have nothing. same as before.";
    };
    w.secret = () => {
      console.log("psst. try the konami code on the page. up up down down left right left right b a");
      return "shhh.";
    };
    const ambient = [
      "still here? in the CONSOLE? buddy.",
      "the source code is just 3am decisions all the way down",
      "warning: 0 bugs found. this is the bug.",
      "last commit message: fix everything. it did not fix everything.",
    ];
    const amb = setInterval(() => {
      console.log("%c" + ambient[Math.floor(Math.random() * ambient.length)], "color:#888;font-style:italic;");
    }, 30000);
    return () => clearInterval(amb);
  }, []);

  useEffect(() => {
    let seen = false;
    const t = setInterval(() => {
      if (seen) return;
      if (window.outerWidth - window.innerWidth > 160 || window.outerHeight - window.innerHeight > 160) {
        seen = true;
        setToast("we see you in there \u{1F440}");
        setTimeout(() => setToast(null), 4000);
        console.log("%cconsole opened. bold move for someone who can't beat the submit button.", "color:#f0f;font-size:14px;");
      }
    }, 2000);
    const onPaste = () => {
      console.log("%cyou pasted something because a website can't stop you. this is how hackers in movies feel. you're welcome.", "color:#ff0;");
    };
    window.addEventListener("paste", onPaste);
    return () => {
      clearInterval(t);
      window.removeEventListener("paste", onPaste);
    };
  }, []);

  const runRemoteGag = (cmd: string, arg: string) => {
    if (cmd === "confetti") {
      confetti({ particleCount: 150, spread: 100, origin: { y: 0.6 } });
    } else if (cmd === "boom") {
      vineBoom();
    } else if (cmd === "gravity") {
      setGravity(true);
      setToast("admin says: gravity. whoops.");
      setTimeout(() => setToast(null), 3000);
    } else if (cmd === "bsod") {
      handleVbucks();
    } else if (cmd === "spin") {
      setIsSpun(true);
      setIsInverted(true);
      setTimeout(() => { setIsSpun(false); setIsInverted(false); }, 4000);
    } else if (cmd === "invert") {
      setIsInverted(true);
      setTimeout(() => setIsInverted(false), 5000);
    } else if (cmd === "drunk") {
      setPrecision(true);
      setTimeout(() => setPrecision(false), 15000);
    } else if (cmd === "update") {
      startUpdate();
    } else if (cmd === "toast") {
      setToast(arg || "admin says hi. rude of them.");
      setTimeout(() => setToast(null), 5000);
    } else if (cmd === "speak") {
      try {
        const u = new SpeechSynthesisUtterance(arg || "hello. you have been pranked.");
        u.rate = 0.9;
        u.pitch = 0.4;
        window.speechSynthesis.speak(u);
      } catch {
        // mute the robot uprising
      }
    } else if (cmd === "chat") {
      setChatOpen(true);
      setChatMsgs((prev) => [...prev, { me: false, text: arg }]);
    }
  };

  useEffect(() => {
    let dead = false;
    const timers: ReturnType<typeof setInterval>[] = [];
    type PusherLike = { disconnect: () => void; subscribe: (n: string) => { bind: (e: string, c: (d: never) => void) => unknown } };
    let pusher: PusherLike | null = null;
    (async () => {
      const cfg = await fetch("/api/config").then((r) => r.json()).catch(() => ({ off: true }));
      if (dead || cfg.off) return;
      const Pusher = (await import("pusher-js")).default;
      if (dead) return;
      const N = ["suspicious potato", "certified lurker", "button misser", "professional scroller", "definitely human", "lost tourist", "chronic clicker", "vibe checker"];
      const nm = N[Math.floor(Math.random() * N.length)] + " #" + (1 + Math.floor(Math.random() * 9));
      const sid = Math.random().toString(36).slice(2) + Date.now().toString(36);
      setSillyName(nm);
      sidRef.current = sid;
      nameRef.current = nm;
      const ua = navigator.userAgent;
      const browser = ua.indexOf("Edg") >= 0 ? "edge" : ua.indexOf("Chrome") >= 0 ? "chrome" : ua.indexOf("Firefox") >= 0 ? "firefox" : ua.indexOf("Safari") >= 0 ? "safari" : "mystery browser";
      const os = ua.indexOf("Windows") >= 0 ? "windows" : ua.indexOf("Mac") >= 0 ? "mac" : ua.indexOf("Android") >= 0 ? "android" : ua.indexOf("Linux") >= 0 ? "linux" : "unknown";
      pusher = new Pusher(cfg.key, { cluster: cfg.cluster });
      const say = (kind: string, extra: Record<string, string>) => {
        fetch("/api/signal", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ kind, id: sid, name: nm, browser, os, secs: String(Math.floor((Date.now() - joinedAt.current) / 1000)), ...extra }),
        }).catch(() => {});
      };
      say("join", {});
      timers.push(setInterval(() => say("beat", {}), 10000));
      const me = pusher.subscribe("user-" + sid);
      me.bind("command", (d: { cmd: string; arg: string }) => {
        if (d && d.cmd) runRemoteGag(d.cmd, d.arg || "");
      });
      const all = pusher.subscribe("broadcast");
      all.bind("command", (d: { cmd: string; arg: string }) => {
        if (d && d.cmd) runRemoteGag(d.cmd, d.arg || "");
      });
      all.bind("admin-alive", () => {
        liveAdmin.current = true;
        lastAdminRef.current = Date.now();
      });
      timers.push(setInterval(() => {
        if (liveAdmin.current && Date.now() - lastAdminRef.current > 25000) liveAdmin.current = false;
      }, 5000));
    })();
    return () => {
      dead = true;
      timers.forEach((t) => clearInterval(t));
      if (pusher) pusher.disconnect();
    };
  }, []);

  useEffect(() => {
    const onType = (e: KeyboardEvent) => {
      if (e.key.length !== 1) return;
      phraseBuf.current = (phraseBuf.current + e.key.toLowerCase()).slice(-30);
      if (phraseBuf.current.endsWith(SECRET_PHRASE)) {
        phraseBuf.current = "";
        tryUnlock();
      }
    };
    window.addEventListener("keydown", onType);
    return () => window.removeEventListener("keydown", onType);
  }, []);

  useEffect(() => {
    if (!adminOpen) return;
    const closer = (e: KeyboardEvent) => { if (e.key === "Escape") setAdminOpen(false); };
    window.addEventListener("keydown", closer);
    return () => window.removeEventListener("keydown", closer);
  }, [adminOpen]);

  useEffect(() => {
    const unlock = () => {
      try {
        const ctx = getAudio();
        if (ctx.state === "suspended") void ctx.resume();
      } catch {
        // stay silent
      }
    };
    window.addEventListener("pointerdown", unlock);
    window.addEventListener("keydown", unlock);
    return () => {
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
    };
  }, []);

  const anyOverlay = termsOpen || bsod || updateOpen || !booted || banners.length > 0;
  useEffect(() => {
    if (!anyOverlay) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [anyOverlay]);
  const playAirhorn = () => {
    const ctx = getAudio();
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

  const playXpError = () => {
    const ctx = getAudio();
    [[660, 0, 0.15], [440, 0.16, 0.3]].forEach(([freq, delay, dur]) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + delay);
      gain.gain.setValueAtTime(0.08, ctx.currentTime + delay);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + delay + dur);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + delay);
      osc.stop(ctx.currentTime + delay + dur);
    });
  };

  const dodgeUsername = () => {
    if (usernameAttempts < 2 || frozen) return;
    setUsernamePos({ x: Math.random() * 100 - 50, y: Math.random() * 100 - 50 });
  };
  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.error("Error 404: typing ability not found");
    const attemptN = usernameAttempts + 1;
    setUsernameAttempts(attemptN);
    setUsernameMsg(SASSY_MESSAGES[Math.floor(Math.random() * SASSY_MESSAGES.length)]);
    setUsername('');
    vineBoom();
    if (attemptN >= 3) {
      setUsernamePos({ x: Math.random() * 100 - 50, y: Math.random() * 100 - 50 });
    }
  };

  const dodgeRandom = () => ({
    x: Math.random() * (window.innerWidth - 120),
    y: Math.random() * (window.innerHeight - 80),
  });

  const tauntNear = (cx: number, cy: number) => {
    if (frozen) return;
    const ang = Math.random() * Math.PI * 2;
    const dist = 100 + Math.random() * 60;
    setBtnFixed(true);
    console.warn("button escaped. user skill issue detected.");
    setBtnPos({
      x: Math.min(Math.max(cx + Math.cos(ang) * dist, 8), window.innerWidth - 120),
      y: Math.min(Math.max(cy + Math.sin(ang) * dist, 8), window.innerHeight - 80),
    });
  };
  const handleRunawayBtnHover = (e?: React.MouseEvent) => {
    tauntNear(e ? e.clientX : mouseRef.current.x, e ? e.clientY : mouseRef.current.y);
  };
  const handleRunawayTouch = (e: React.TouchEvent) => {
    if (btnTouch >= 3) return;
    setBtnTouch(b => b + 1);
    const t = e.touches[0];
    if (t) tauntNear(t.clientX, t.clientY);
  };

  const handleRunawayClick = () => {
    confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 } });
    try {
      const skull = confetti.shapeFromText({ text: '\u{1F480}' });
      const clown = confetti.shapeFromText({ text: '\u{1F921}' });
      const fire = confetti.shapeFromText({ text: '\u{1F525}' });
      confetti({ particleCount: 80, spread: 100, shapes: [skull, clown, fire], scalar: 2, origin: { y: 0.6 } });
    } catch {
      // plain confetti already fired above, good enough
    }
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
      console.error("FATAL: user was explicitly told not to press that");
      setIsInverted(true);
      playAirhorn();
    } else {
      setIsSpun(false);
      setIsInverted(false);
      setIsComicSans(true);
    }
  };

  const handleCaptcha = () => {
    if (captchaChecked) return;
    if (captchaClicks < 3) {
      setCaptchaChecked(true);
      setCaptchaMsg(CAPTCHA_MSGS[captchaClicks]);
      setCaptchaClicks(c => c + 1);
      setTimeout(() => setCaptchaChecked(false), 450);
    } else {
      setCaptchaChecked(true);
      setCaptchaMsg("fine. you're human. allegedly.");
    }
  };

  const startVirusScan = async () => {
    setScanning(true);
    setScanDone(false);
    setFixMsg('');
    setScanProgress(0);
    for (let i = 0; i <= 100; i += 2) {
      setScanProgress(i);
      await new Promise(r => setTimeout(r, 40));
    }
    setScanning(false);
    setScanDone(true);
    console.log("%cscan complete. 3 threats found.", "color:red;font-weight:bold;");
    console.log("    at checkFiles (antivirus.js:42)");
    console.log("    at blameUser (antivirus.js:69)");
    console.log("    at touchGrass (never.js:0)");
  };

  const handleFixNow = () => {
    playXpError();
    setFixMsg("unfixable. good luck.");
  };

  const handlePwChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setPw(val);
    if (val.length === 0) setPwMsg('');
    else if (val.length < 4) setPwMsg("weak. like your life choices");
    else if (val.length < 8) setPwMsg("a hacker wouldn't even want this");
    else setPwMsg("my grandma types stronger passwords");
  };

  const handleVbucks = () => {
    setBsod(true);
    setTimeout(() => {
      setBsod(false);
      setToast("jk lol. your face though \u{1F480}");
      setTimeout(() => setToast(null), 4000);
    }, 3000);
  };

  const sendChat = () => {
    const text = chatInput.trim();
    if (!text || chatDead) return;
    if (liveAdmin.current) {
      setChatMsgs((prev) => [...prev, { me: true, text }]);
      fetch("/api/signal", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ kind: "chat", id: sidRef.current, name: nameRef.current, text }) }).catch(() => {});
      setChatInput("");
      return;
    }
    const userCount = chatMsgs.filter(m => m.me).length;
    setChatMsgs(prev => [...prev, { me: true, text }]);
    setChatInput('');
    setTimeout(() => {
      if (userCount < 2) {
        setChatMsgs(prev => [...prev, { me: false, text: CHAT_REPLIES[userCount] }]);
      } else if (userCount === 2) {
        setChatMsgs(prev => [...prev, { me: false, text: CHAT_REPLIES[2] }]);
      } else {
        setChatMsgs(prev => [...prev, { me: false, text: "this chat has been disconnected. emotionally." }]);
        setChatDead(true);
      }
    }, 800);
  };

  const downloadRam = () => {
    const blob = new Blob(['lol no'], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'MORE_RAM.txt';
    a.click();
    URL.revokeObjectURL(url);
    setToast("ram acquired. definitely real.");
    setTimeout(() => setToast(null), 4000);
  };

  const handleHonest = () => {
    setHonestMsg("finally. an honest button. the only one on this site. cherish it.");
  };

  const startUpdate = async () => {
    setUpdateOpen(true);
    setUpdateProgress(0);
    const t0 = Date.now();
    let p = 0;
    while (Date.now() - t0 < 8000) {
      p += Math.random() < 0.25 ? -Math.floor(Math.random() * 8) : Math.floor(Math.random() * 6) + 1;
      p = Math.max(0, Math.min(99, p));
      setUpdateProgress(p);
      await new Promise(r => setTimeout(r, 200));
    }
    setUpdateOpen(false);
    setToast("update failed. nothing was updated. as always.");
    setTimeout(() => setToast(null), 4000);
  };

  const dodgeYes = () => {
    if (frozen || yesDodges >= 3) return;
    setYesFixed(true);
    setYesPos(dodgeRandom());
    setYesDodges(d => d + 1);
  };

  const catchYes = () => {
    confetti({ particleCount: 30, spread: 50 });
    setDelStage(2);
  };

  const handleImgPick = () => {
    if (imgPassed) return;
    const fails = imgFails + 1;
    setImgFails(fails);
    setImgGrid(freshGrid());
    if (fails >= 3) {
      setImgPassed(true);
      setImgMsg("fine. you're human. barely.");
    } else {
      setImgMsg("incorrect. the clown was in your heart all along.");
    }
  };

  const shareSite = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
    } catch {
      // clipboard said no
    }
    setToast("sent to 0 people. copied though. do the rest yourself.");
    setTimeout(() => setToast(null), 4000);
  };

  const notifyToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };
  const deadLink = () => {
    setToast("nope.");
    setTimeout(() => setToast(null), 2500);
  };

  const doJudgment = () => {
    if (Math.random() < 0.2) {
      setToast("wow. abusing power. classic admin.");
      setTimeout(() => setToast(null), 3000);
    }
  };
  const tryUnlock = () => {
    if (adminOpen) return;
    if (deniedArmed.current && Math.random() < 0.3) {
      deniedArmed.current = false;
      vineBoom();
      setToast("access denied. nice try.");
      setTimeout(() => setToast(null), 3000);
      return;
    }
    deniedArmed.current = false;
    vineBoom();
    setToast("admin detected. this is legally binding.");
    setTimeout(() => {
      setAdminOpen(true);
      setToast("fine. you're in. don't touch anything.");
      setTimeout(() => setToast(null), 4000);
    }, 1200);
  };
  const logoTap = () => {
    const now = Date.now();
    logoTimes.current = [...logoTimes.current.filter((t) => now - t < 3000), now];
    setLogoClicks(c => c + 1);
    if (logoTimes.current.length >= 5) {
      logoTimes.current = [];
      tryUnlock();
    }
  };
  const adminFire = (fn: () => void) => () => { fn(); doJudgment(); };
  const chaosLocal = () => {
    const pool = ["spin", "invert", "gravity", "drunk", "bsod", "update", "confetti", "boom", "comic", "crt"];
    const picks = [...pool].sort(() => Math.random() - 0.5).slice(0, 3);
    picks.forEach((g, i) => setTimeout(() => fireLocalGag(g), i * 700));
    doJudgment();
  };
  const fireLocalGag = (g: string) => {
    if (g === "spin") handleRedButton();
    else if (g === "invert") setIsInverted(v => !v);
    else if (g === "gravity") setGravity(v => !v);
    else if (g === "drunk") { setPrecision(true); setTimeout(() => setPrecision(false), 8000); }
    else if (g === "bsod") handleVbucks();
    else if (g === "update") startUpdate();
    else if (g === "confetti") confetti({ particleCount: 120, spread: 90 });
    else if (g === "boom") vineBoom();
    else if (g === "comic") setIsComicSans(v => !v);
    else if (g === "crt") setCrt(v => !v);
  };

  const onGag = (g: string) => { fireLocalGag(g); doJudgment(); };
  const sayLoud = (msg: string) => { if (msg.trim() === "") return; try { const u = new SpeechSynthesisUtterance(msg); u.rate = 0.9; u.pitch = 0.4; window.speechSynthesis.speak(u); } catch { /* robot is shy */ } doJudgment(); };
  const notifyJudged = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 4000); doJudgment(); };
  const gravStyle = (i: number): React.CSSProperties => gravity
    ? { transform: `translateY(${30 + i * 28}px) rotate(${(i % 2 === 0 ? 1 : -1) * (5 + i * 2)}deg)` }
    : {};

  const clock = `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
  const seedClauses = Array.from({ length: 40 }, (_, i) => "clause " + (5000 + i * 7) + ": " + ["still reading? impressive. pointless, but impressive.", "this one just says stuff. like this.", "you could stop scrolling. you will not.", "we admire your commitment to nothing.", "nope, still not the bottom."][i % 5]);
  const extraClauses = Array.from({ length: termsExtra }, (_, i) => `clause ${5000 + i}: yeah we just keep writing these. keep scrolling.`);
  const comic = isComicSans ? "font-['Comic_Sans_MS',_cursive]" : "";



  return (
    <div
      className={cn(
        "min-h-screen transition-all duration-500 overflow-x-hidden",
        isRainbow ? "bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500 animate-pulse" : "bg-slate-900",
        isInverted ? "invert" : "",
        isComicSans ? "font-['Comic_Sans_MS',_cursive]" : "font-sans",
        precision ? "cursor-none" : ""
      )}
      style={{
        fontSize: `${fontSize}px`,
        ...(isSpun ? { transform: "rotate(360deg)" } : {}),
        transition: "transform 1s ease-in-out"
      }}
    >
      {matrix && <canvas ref={matrixRef} className="fixed inset-0 z-0 pointer-events-none opacity-70" />}

      {!booted && (
        <PortalBox>
          <div className="fixed inset-0 z-[150] bg-black text-green-400 font-mono p-6 text-sm">
            <div className="max-w-md mx-auto mt-20 space-y-2 min-h-[10rem]">
              {BOOT_LINES.slice(0, bootLines).map((l, i) => <p key={i}>&gt; {l}</p>)}
              <span className="inline-block w-2 h-4 bg-green-400 animate-pulse" />
            </div>
            <button
              onMouseEnter={dodgeSkip}
              onTouchStart={() => { if (skipTouch < 3) { dodgeSkip(); setSkipTouch(skipTouch + 1); } }}
              onClick={completeBoot}
              className={skipFixed ? "fixed z-[151] text-xs underline" : "absolute bottom-6 right-6 text-xs underline"}
              style={skipFixed ? { left: skipPos.x, top: skipPos.y } : {}}
            >
              skip
            </button>
          </div>
        </PortalBox>
      )}

      <PortalBox>
        <>
          {trail.map(t => (
            <div key={t.id} className="fixed pointer-events-none text-2xl z-[49]" style={{ left: t.x, top: t.y }}>
              {"\u{1F480}"}
            </div>
          ))}
        </>
      </PortalBox>

      {precision && (
        <PortalBox>
          <div className="fixed z-[49] pointer-events-none" style={{ left: fakeCursor.x - 12, top: fakeCursor.y - 12 }}>
            <div className="w-6 h-6 rounded-full border-2 border-lime-400" />
            <div className="w-1 h-1 bg-lime-400 rounded-full mx-auto mt-1" />
          </div>
        </PortalBox>
      )}

      {crt && (
        <PortalBox>
          <div className="fixed inset-0 pointer-events-none z-[140] crt-scanlines crt-wobble opacity-60" />
        </PortalBox>
      )}

      {bsod && (
        <PortalBox>
          <div className="fixed inset-0 z-[150] bg-[#0000AA] text-white font-mono p-8 md:p-16">
            <p className="text-6xl md:text-8xl mb-8">:(</p>
            <p className="max-w-2xl">your pc ran into a problem and needs to restart. we&apos;re just kidding. or are we. error code: LMAO_404. 0% complete (it will never complete).</p>
          </div>
        </PortalBox>
      )}

      {updateOpen && (
        <PortalBox>
          <div className="fixed inset-0 z-[150] bg-blue-950 text-white flex flex-col items-center justify-center font-mono p-6 text-center">
            <p className="text-xl mb-4">installing update 3 of 47...</p>
            <div className="w-64 max-w-[80vw] h-4 bg-blue-900 rounded overflow-hidden">
              <div className="h-full bg-cyan-400 transition-all" style={{ width: `${updateProgress}%` }} />
            </div>
            <p className="mt-2 text-sm">{updateProgress}%</p>
            <p className="mt-6 text-xs opacity-70">do not turn off your device. or do. we&apos;re a website.</p>
          </div>
        </PortalBox>
      )}

      {termsOpen && (
        <Modal comic={comic}>
          <div className="bg-slate-800 rounded-2xl border-4 border-black flex flex-col max-h-[90vh]">
            <h3 className="p-4 font-black uppercase italic">terms & conditions (abridged: not really)</h3>
            <div onScroll={handleTermsScroll} data-modal-scroll className="overflow-y-auto p-4 space-y-2 text-sm flex-1">
              {BASE_CLAUSES.map((c, i) => <p key={i}>• {c}</p>)}
              {seedClauses.map((c, i) => <p key={i + 100}>• {c}</p>)}{extraClauses.map((c, i) => <p key={i + 1000}>• {c}</p>)}
            </div>
            <div className="p-4">
              <button
                disabled={!termsAccept}
                onClick={() => {
                  setTermsOpen(false);
                  setToast("congrats. you agreed to nothing.");
                  setTimeout(() => setToast(null), 3000);
                }}
                className={cn("w-full px-4 py-3 rounded-xl font-black uppercase text-sm", termsAccept ? "bg-green-600" : "bg-zinc-700 opacity-50")}
              >
                {termsAccept ? "ok you clearly didn't read it. same." : "accept (keep scrolling)"}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {banners.length > 0 && (
        <PortalBox>
          <div className="fixed bottom-4 left-4 z-[100] space-y-2 w-[90vw] max-w-xs">
            {banners.slice(-3).map((id) => (
              <div key={id} className="bg-amber-100 text-black p-3 rounded-xl border-2 border-black text-xs shadow-lg">
                <p className="font-bold mb-2">{HYDRA_MSGS[Math.min(id, HYDRA_MSGS.length - 1)]}</p>
                <div className="flex gap-2">
                  <button onClick={acceptCookies} className="bg-black text-white px-3 py-1 rounded font-bold">accept</button>
                  <button onClick={declineCookie} className="border border-black px-3 py-1 rounded font-bold">decline</button>
                </div>
              </div>
            ))}
          </div>
        </PortalBox>
      )}

      <PortalBox>
        <div className="fixed top-2 left-2 z-[50] font-mono text-xs bg-black/70 text-green-400 px-2 py-1 rounded">
          time wasted: {clock}
        </div>
      </PortalBox>
      <PortalBox>
        <div className="fixed top-2 right-2 z-[50] font-mono text-xs bg-black text-yellow-400 px-2 py-1 rounded border border-yellow-400 max-w-[45vw] text-right">
          visitor #000001 — it&apos;s just you. it&apos;s always been just you.
        </div>
      </PortalBox>

      <PortalBox>
        <div className="fixed top-16 right-4 z-[50] w-[90vw] max-w-xs">
          <AnimatePresence>
            {toast && (
              <motion.div
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 100, opacity: 0 }}
                className="bg-white text-black p-4 rounded-2xl shadow-2xl font-bold italic border-4 border-black"
              >
                {toast}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </PortalBox>

      <PortalBox>
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-[50] w-[90vw] max-w-sm">
          <AnimatePresence>
            {achieve && (
              <motion.div
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -100, opacity: 0 }}
                className="bg-zinc-900 text-white px-4 py-3 rounded-xl shadow-2xl border-b-8 border-green-500"
              >
                <p className="text-[10px] uppercase tracking-widest text-green-400 font-bold">achievement unlocked</p>
                <p className="font-bold italic">{achieve.replace("achievement: ", "")}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </PortalBox>

      <PortalBox>
        <div className="fixed bottom-4 right-4 z-[50] w-64 md:w-72 max-w-[70vw]">
          {!chatOpen ? (
            <button
              onClick={() => setChatOpen(true)}
              className="ml-auto block bg-green-600 text-white text-xs font-black uppercase px-4 py-2 rounded-full shadow-lg"
            >
              24/7 support
            </button>
          ) : (
            <div className={`bg-slate-800 rounded-2xl border-4 border-black shadow-xl overflow-hidden ${comic}`}>
              <div className="bg-green-700 px-3 py-2 flex justify-between items-center">
                <span className="text-xs font-black uppercase">definitely real support</span>
                <button onClick={() => setChatOpen(false)} className="text-xs font-bold px-2">_</button>
              </div>
              <div data-modal-scroll className="h-48 overflow-y-auto p-2 space-y-2 text-xs">
                {chatMsgs.map((m, i) => (
                  <div key={i} className={cn("p-2 rounded-lg max-w-[90%]", m.me ? "ml-auto bg-blue-600" : "bg-slate-700")}>
                    {m.text}
                  </div>
                ))}
              </div>
              <div className="p-2 flex gap-1">
                <input
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendChat()}
                  disabled={chatDead}
                  placeholder={chatDead ? "gone. forever." : "ask anything..."}
                  className="flex-1 bg-slate-900 text-xs p-2 rounded outline-none min-w-0"
                />
                <button onClick={sendChat} disabled={chatDead} className="bg-green-600 text-xs font-bold px-2 rounded">send</button>
              </div>
            </div>
          )}
        </div>
      </PortalBox>

      <div className="relative z-10 p-4 md:p-12 max-w-5xl mx-auto text-slate-100 pt-12">

        <header className="mb-16">
          <nav className="flex items-center justify-between mb-10">
            <button onClick={logoTap} className="font-display font-bold text-xl tracking-tight">opposite™</button>
            <div className="flex gap-4 text-sm font-bold">
              <button onClick={deadLink}>features</button>
              <button onClick={deadLink}>pricing</button>
              <button onClick={() => setChatOpen(true)}>contact</button>
            </div>
          </nav>
          <div className="text-center rounded-3xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 p-8 md:p-16 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <p className="text-xs font-bold uppercase tracking-[0.3em] mb-4 opacity-80">{"\u2728"} now with 47% more opposite {"\u2728"}</p>
            <h1 className="font-display text-4xl md:text-7xl font-bold tracking-tight mb-4">productivity, perfected.</h1>
            <p className="text-sm md:text-lg opacity-90 mb-8">the app that does the opposite of what you want. enterprise ready.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => {
                  setToast("just kidding. there's nothing to start.");
                  setTimeout(() => setToast(null), 3000);
                }}
                className="bg-white text-black px-6 py-3 rounded-xl font-black uppercase text-sm"
              >
                start free
              </button>
              <button onClick={() => setChatOpen(true)} className="border-2 border-white px-6 py-3 rounded-xl font-bold text-sm">
                talk to sales
              </button>
            </div>
          </div>
          <p className="text-center text-xs text-slate-500 mt-4 italic">as seen on: nobody. nowhere.</p>
          <div className="mt-6 text-xl font-bold bg-yellow-400 text-black py-1 overflow-hidden whitespace-nowrap rounded-xl border-4 border-black">
            <div className="inline-block animate-marquee-scroll">
              welcome to the worst experience of your life • please leave immediately • we know where you live • L + ratio •&nbsp;
              welcome to the worst experience of your life • please leave immediately • we know where you live • L + ratio •&nbsp;
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

          <section style={gravStyle(0)} className="bg-slate-800 p-8 rounded-3xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all duration-700">
            <h2 className="text-2xl font-black mb-6 uppercase italic">sign up</h2>
            <div className="space-y-4">
              <div className="relative">
                <input
                  ref={usernameRef}
                  type="text"
                  value={username}
                  onMouseEnter={dodgeUsername}
                  onChange={handleUsernameChange}
                  placeholder="username"
                  className={cn(
                    "w-full bg-slate-100 text-black p-4 rounded-lg font-bold outline-none transition-all",
                    usernameAttempts >= 3 && "absolute"
                  )}
                  style={usernameAttempts >= 3 ? { left: usernamePos.x, top: usernamePos.y } : {}}
                />
                <p className="mt-2 text-sm text-red-400 font-bold italic">{usernameMsg}</p>
              </div>
              <button
                onMouseEnter={handleRunawayBtnHover}
                onTouchStart={handleRunawayTouch}
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

          <section style={gravStyle(1)} className="bg-slate-800 p-8 rounded-3xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] space-y-8 transition-all duration-700">
            <h2 className="text-2xl font-black mb-6 uppercase italic">controls</h2>
            <div className="flex items-center justify-between p-4 bg-slate-900 rounded-xl">
              <span className="font-bold">dark mode</span>
              <button onClick={() => setIsRainbow(!isRainbow)} className="w-12 h-6 bg-slate-700 rounded-full relative transition-colors">
                <div className={cn("absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-all", isRainbow ? "left-7 bg-yellow-400" : "")} />
              </button>
            </div>
            <div className="flex items-center justify-between p-4 bg-slate-900 rounded-xl">
              <span className="font-bold">mute</span>
              <button onClick={playAirhorn} className="bg-red-600 px-4 py-1 rounded font-bold hover:bg-red-500 transition-colors">OFF</button>
            </div>
            <div className="space-y-2">
              <span className="font-bold text-sm uppercase">Volume</span>
              <input type="range" className="w-full accent-pink-500" onChange={(e) => setFontSize(parseInt(e.target.value))} min="8" max="100" />
            </div>
          </section>

          <section style={gravStyle(2)} className="bg-slate-800 p-8 rounded-3xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all duration-700">
            <h2 className="text-2xl font-black mb-6 uppercase italic">backwards thinking</h2>
            <input
              type="text"
              value={backwardsVal.split('').reverse().join('')}
              onChange={(e) => setBackwardsVal(e.target.value)}
              placeholder="type something..."
              className="w-full bg-slate-100 text-black p-4 rounded-lg font-bold outline-none"
            />
            <p className="mt-2 text-xs text-slate-400 italic">your thoughts are literally backwards</p>
          </section>

          <section style={gravStyle(3)} className="bg-slate-800 p-8 rounded-3xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all duration-700">
            <h2 className="text-2xl font-black mb-6 uppercase italic">optimization</h2>
            <div className="bg-slate-900 p-6 rounded-xl text-center space-y-4">
              <p className="text-sm font-bold italic">{loadMsg}</p>
              <div className="w-full h-6 bg-slate-700 rounded-full overflow-hidden border-2 border-black">
                <motion.div className="h-full bg-green-500" animate={{ width: `${progress}%` }} />
              </div>
              {!loading && (
                <button onClick={startLoading} className="bg-green-600 text-white px-4 py-2 rounded font-bold uppercase text-xs">
                  Start Optimization
                </button>
              )}
            </div>
          </section>
          <section style={gravStyle(4)} className="bg-slate-800 p-8 rounded-3xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all duration-700">
            <h2 className="text-2xl font-black mb-6 uppercase italic">verify you&apos;re human</h2>
            <button onClick={handleCaptcha} className="flex items-center gap-3 bg-slate-100 text-black p-4 rounded-lg font-bold w-full">
              <span className={cn("w-6 h-6 border-4 border-black rounded flex items-center justify-center bg-white", captchaChecked && "bg-green-500")}>
                {captchaChecked ? "\u2713" : ""}
              </span>
              i&apos;m not a robot
            </button>
            <p className="mt-2 text-sm text-red-400 font-bold italic">{captchaMsg}</p>
          </section>

          <section style={gravStyle(5)} className="bg-slate-800 p-8 rounded-3xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all duration-700">
            <h2 className="text-2xl font-black mb-6 uppercase italic">free antivirus</h2>
            <div className="bg-slate-900 p-6 rounded-xl text-center space-y-4">
              {!scanDone ? (
                <>
                  <div className="w-full h-6 bg-slate-700 rounded-full overflow-hidden border-2 border-black">
                    <motion.div className="h-full bg-red-500" animate={{ width: `${scanProgress}%` }} />
                  </div>
                  {!scanning && (
                    <button onClick={startVirusScan} className="bg-red-600 text-white px-4 py-2 rounded font-bold uppercase text-xs">
                      scan my device
                    </button>
                  )}
                  {scanning && <p className="text-xs font-bold italic">scanning... {scanProgress}% (finding problems)</p>}
                </>
              ) : (
                <>
                  <p className="text-sm font-bold">3 threats found:</p>
                  <ul className="text-xs font-mono text-red-400 space-y-1">
                    {THREATS.map(t => <li key={t}>{t}</li>)}
                  </ul>
                  <button onClick={handleFixNow} className="bg-red-600 text-white px-4 py-2 rounded font-bold uppercase text-xs">
                    fix now
                  </button>
                  {fixMsg && <p className="text-xs font-bold italic text-yellow-400">{fixMsg}</p>}
                </>
              )}
            </div>
          </section>

          <section style={gravStyle(6)} className="bg-slate-800 p-8 rounded-3xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all duration-700">
            <h2 className="text-2xl font-black mb-6 uppercase italic">super secure password</h2>
            <input
              type="password"
              value={pw}
              onChange={handlePwChange}
              placeholder="hunter2"
              className="w-full bg-slate-100 text-black p-4 rounded-lg font-bold outline-none"
            />
            <div className="w-full h-3 bg-slate-700 rounded-full overflow-hidden mt-3">
              <div className="h-full bg-gradient-to-r from-red-500 to-yellow-500 transition-all" style={{ width: `${Math.min(pw.length * 12, 100)}%` }} />
            </div>
            <p className="mt-2 text-sm text-red-400 font-bold italic">{pwMsg}</p>
          </section>

          <section style={gravStyle(7)} className="bg-slate-800 p-8 rounded-3xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all duration-700 text-center">
            <h2 className="text-2xl font-black mb-6 uppercase italic">totally legit offer</h2>
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={handleVbucks}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-xl font-black uppercase animate-pulse"
            >
              {"\u{1F381}"} free vbucks {"\u{1F381}"}
            </motion.button>
            <p className="mt-3 text-xs text-slate-400 italic">no scam. trust.</p>
          </section>

          <section style={gravStyle(8)} className="bg-slate-800 p-8 rounded-3xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all duration-700 space-y-6">
            <h2 className="text-2xl font-black uppercase italic">downloads</h2>
            <button onClick={downloadRam} className="w-full bg-cyan-600 text-white px-4 py-3 rounded-lg font-black uppercase text-sm">
              download more ram (16gb, free)
            </button>
            <div>
              <button onClick={handleHonest} className="w-full bg-zinc-600 text-white px-4 py-3 rounded-lg font-bold text-sm">
                this button does nothing
              </button>
              {honestMsg && <p className="mt-2 text-xs text-green-400 font-bold italic">{honestMsg}</p>}
            </div>
          </section>

          <section style={gravStyle(9)} className="bg-slate-800 p-8 rounded-3xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all duration-700 space-y-4">
            <h2 className="text-2xl font-black uppercase italic">display nonsense</h2>
            <div className="flex items-center justify-between p-4 bg-slate-900 rounded-xl">
              <span className="font-bold">gravity</span>
              <button onClick={() => { setGravity(g => !g); setToast(gravity ? "gravity restored. coward." : "whoops."); setTimeout(() => setToast(null), 3000); }} className="bg-purple-600 px-4 py-1 rounded font-bold">
                {gravity ? "ON" : "OFF"}
              </button>
            </div>
            <div className="flex items-center justify-between p-4 bg-slate-900 rounded-xl">
              <span className="font-bold">hd graphics</span>
              <button onClick={() => setCrt(c => !c)} className="bg-amber-600 px-4 py-1 rounded font-bold">
                {crt ? "ON" : "OFF"}
              </button>
            </div>
            <div className="flex items-center justify-between p-4 bg-slate-900 rounded-xl">
              <span className="font-bold">precision mode</span>
              <button onClick={() => setPrecision(p => !p)} className="bg-lime-600 px-4 py-1 rounded font-bold">
                {precision ? "ON" : "OFF"}
              </button>
            </div>
            <div className="flex items-center justify-between p-4 bg-slate-900 rounded-xl">
              <span className="font-bold">matrix (wake up.)</span>
              <button onClick={() => setMatrix(m => !m)} className="bg-green-700 px-4 py-1 rounded font-bold">
                {matrix ? "ON" : "OFF"}
              </button>
            </div>
          </section>

          <section style={gravStyle(10)} className="bg-slate-800 p-8 rounded-3xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all duration-700">
            <h2 className="text-2xl font-black mb-4 uppercase italic">prove it again</h2>
            <p className="text-sm mb-3 font-bold">select all squares with a clown</p>
            <div className="grid grid-cols-3 gap-2">
              {imgGrid.map((e, i) => (
                <button key={i} onClick={handleImgPick} disabled={imgPassed} className="bg-slate-100 text-3xl p-3 rounded-lg">
                  {e}
                </button>
              ))}
            </div>
            <p className="mt-2 text-sm text-red-400 font-bold italic">{imgMsg}</p>
          </section>

          <section style={gravStyle(11)} className="bg-slate-800 p-8 rounded-3xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all duration-700 space-y-3">
            <h2 className="text-2xl font-black uppercase italic">account stuff</h2>
            <button onClick={startUpdate} className="w-full bg-indigo-600 text-white px-4 py-3 rounded-lg font-black uppercase text-sm">
              check for updates
            </button>
            <button onClick={() => setTermsOpen(true)} className="w-full bg-zinc-700 text-white px-4 py-3 rounded-lg font-bold text-sm">
              read our terms (don&apos;t)
            </button>
            <button onClick={shareSite} className="w-full bg-pink-600 text-white px-4 py-3 rounded-lg font-black uppercase text-sm">
              share this site
            </button>
            {delStage === 0 && (
              <button onClick={() => setDelStage(1)} className="w-full bg-zinc-700 text-white px-4 py-3 rounded-lg font-bold text-sm">
                delete my account
              </button>
            )}
            {delStage === 1 && (
              <div className="bg-slate-900 p-4 rounded-xl text-center">
                <p className="font-black mb-3">are you sure?</p>
                <div className="flex items-center justify-center gap-4">
                  <button
                    onClick={() => {
                      setToast("correct choice.");
                      setTimeout(() => setToast(null), 3000);
                      setDelStage(0);
                    }}
                    className="bg-green-600 text-2xl font-black px-8 py-4 rounded-xl uppercase"
                  >
                    NO
                  </button>
                  <button
                    onMouseEnter={dodgeYes}
                    onTouchStart={dodgeYes}
                    onClick={catchYes}
                    className="text-[10px] underline opacity-60"
                    style={yesFixed ? { position: "fixed", left: yesPos.x, top: yesPos.y, zIndex: 60 } : {}}
                  >
                    yes
                  </button>
                </div>
                {yesDodges > 0 && yesDodges < 3 && <p className="text-xs italic mt-2">too slow.</p>}
              </div>
            )}
            {delStage === 2 && (
              <p className="text-sm font-bold italic text-green-400">account deleted. there was no account. there never was.</p>
            )}
          </section>

          <section className="col-span-1 md:col-span-2 bg-slate-800 p-8 rounded-3xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
            <h2 className="text-2xl font-black mb-6 uppercase italic text-center">real reviews from real humans</h2>
            <div className="overflow-hidden whitespace-nowrap">
              <div className="inline-flex gap-8 animate-marquee-scroll">
                {[...TESTIMONIALS, ...TESTIMONIALS].map((t, i) => (
                  <div key={i} className="bg-slate-900 p-4 rounded-xl min-w-[16rem] whitespace-normal">
                    <p className="text-sm italic">&quot;{t.text}&quot;</p>
                    <p className="text-xs text-yellow-400 font-bold mt-2">— {t.author}</p>
                    <p className="text-yellow-400 text-xs">{"\u2605".repeat(5)}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="col-span-1 md:col-span-2 bg-slate-800 p-8 rounded-3xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <h2 className="font-display text-2xl font-bold mb-6 uppercase text-center">pricing (everyone pays nothing)</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-slate-900 p-6 rounded-2xl text-center space-y-3">
                <p className="font-black uppercase">free</p>
                <p className="font-display text-4xl font-bold">$0</p>
                <p className="text-xs italic text-slate-400">nothing. exactly what it says.</p>
                <DodgeBuy label="buy free" notify={notifyToast} />
              </div>
              <div className="bg-slate-900 p-6 rounded-2xl text-center space-y-3 border-2 border-lime-400">
                <p className="font-black uppercase text-lime-400">pro {"\u2728"}</p>
                <p className="font-display text-4xl font-bold">$0/mo</p>
                <p className="text-xs italic text-slate-400">nothing, but shinier.</p>
                <DodgeBuy label="buy pro" notify={notifyToast} />
              </div>
              <div className="bg-slate-900 p-6 rounded-2xl text-center space-y-3">
                <p className="font-black uppercase">enterprise</p>
                <p className="font-display text-4xl font-bold">call us</p>
                <p className="text-xs italic text-slate-400">we won&apos;t answer.</p>
                <DodgeBuy label="call us" notify={notifyToast} />
              </div>
            </div>
          </section>

          <AdminPanel
            open={adminOpen}
            onClose={() => setAdminOpen(false)}
            comic={comic}
            frozen={frozen}
            silenced={silenced}
            onToggleFrozen={() => { setFrozen(ff => !ff); doJudgment(); }}
            onToggleSilenced={() => { const v = !silenced; setSilenced(v); silencedRef.current = v; doJudgment(); }}
            onSkipTerms={() => { setTermsAccept(true); doJudgment(); }}
            onGag={onGag}
            onChaos={chaosLocal}
            notify={notifyJudged}
            speak={sayLoud}
          />
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
            {godMode && <p className="mt-4 font-black text-yellow-400 animate-pulse">GOD MODE ENGAGED</p>}
          </section>

        </div>
      </div>
    </div>
  );
}

