"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import PortalBox from "../components/PortalBox";
import Modal from "../components/Modal";
import DodgeBuy from "../components/DodgeBuy";
import Clippy from "../components/Clippy";
import ExitLoop from "../components/ExitLoop";
import Faq from "../components/Faq";
import Testimonials from "../components/Testimonials";
import Reveal from "../components/Reveal";
import AdminPanel from "../components/AdminPanel";
import { setSharedChannel } from "@/utils/supabase/channels";
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
const HERO_SUBS = ["the app that does the opposite of what you want. enterprise ready.", "now with 12% fewer features. somehow worse.", "still enterprise. still ready. still opposite."];
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

type ChatMsg = { me: boolean; text: string; k: string; name?: string; at?: number };
type RoomMsg = { id: string; name: string; text: string; at: number };
const ROAST_NAMES = ["anxious potato", "suspicious raccoon", "nervous pickle", "certified lurker", "button misser", "professional scroller", "lost tourist", "chronic clicker", "vibe checker", "confused goblin"];
const makeName = () => ROAST_NAMES[Math.floor(Math.random() * ROAST_NAMES.length)] + " #" + (1 + Math.floor(Math.random() * 9));
const cleanName = (raw: string) => raw.replace(/[\u0000-\u001F\u007F<>]/g, "").trim().slice(0, 24);
let chatK = 1;
const kid = () => "k" + (chatK++);
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
  const [virusMsg, setVirusMsg] = useState("warming up the scanner...");
  const [fixMsg, setFixMsg] = useState('');
  const [pw, setPw] = useState('');
  const [pwMsg, setPwMsg] = useState('');
  const [bsod, setBsod] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [unread, setUnread] = useState(0);
  const collapsedRef = useRef(false);
  useEffect(() => {
    try {
      if (localStorage.getItem("opp_chat_collapsed") === "1") {
        setCollapsed(true);
        collapsedRef.current = true;
      }
    } catch { /* private mode: chat stays open */ }
  }, []);
  const setCollapsedPersist = (v: boolean) => {
    setCollapsed(v);
    collapsedRef.current = v;
    if (!v) setUnread(0);
    try { localStorage.setItem("opp_chat_collapsed", v ? "1" : "0"); } catch { /* no pocket */ }
  };
  const [chatMsgs, setChatMsgs] = useState<ChatMsg[]>([{ me: false, text: "hi welcome to group therapy. no refunds. what's broken (besides everything)?", k: "k0" }]);
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
  const [mirrored, setMirrored] = useState(false);
  const [bigCursor, setBigCursor] = useState(false);
  const [quake, setQuake] = useState(false);
  const [lightsOut, setLightsOut] = useState(false);
  const [pacifist, setPacifist] = useState(false);
  const [indepCursor, setIndepCursor] = useState(false);
  const [cursor2, setCursor2] = useState({ x: -100, y: -100 });
  const [gremlin, setGremlin] = useState(false);
  const [tabPanic, setTabPanic] = useState(false);
  const tabPanicRef = useRef(false);
  const [slowNet, setSlowNet] = useState(false);
  const [popups, setPopups] = useState<number[]>([]);
  const popupN = useRef(0);
  const popupSpawned = useRef(0);
  const [emojiRain, setEmojiRain] = useState(false);
  const [rainDrops, setRainDrops] = useState<number[]>([]);
  const [clippyOpen, setClippyOpen] = useState(false);
  const [autopilot, setAutopilot] = useState(false);
  const [autoPos, setAutoPos] = useState({ x: -100, y: -100 });
  const [shakespeare, setShakespeare] = useState(false);
  const [judgment, setJudgment] = useState(false);
  const [judgmentText, setJudgmentText] = useState("");
  const [audience, setAudience] = useState(false);
  const [magnet, setMagnet] = useState(false);
  const [butter, setButter] = useState(false);
  const butterAt = useRef(0);
  const [adShow, setAdShow] = useState(false);
  const [adSecs, setAdSecs] = useState(5);
  const adTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const [holdPct, setHoldPct] = useState(0);
  const holdingRef = useRef(false);
  const holdTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const [battery, setBattery] = useState(false);
  const batteryRef = useRef(false);
  const batteryTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [regretOpen, setRegretOpen] = useState(false);
  const [regretPicked, setRegretPicked] = useState<number[]>([]);
  const [exitOpen, setExitOpen] = useState(false);
  const [legalMsg, setLegalMsg] = useState<string | null>(null);
  const [nlEmail, setNlEmail] = useState("");
  const [unsubN, setUnsubN] = useState(0);
  const [unsubFixed, setUnsubFixed] = useState(false);
  const [unsubPos, setUnsubPos] = useState({ x: 0, y: 0 });
  const [heroSub, setHeroSub] = useState("the app that does the opposite of what you want. enterprise ready.");
  const [heroUsers, setHeroUsers] = useState(3482901);
  const pacifistRef = useRef(false);
  const prisonRef = useRef(false);
  const gagCountRef = useRef(0);
  const codeNameRef = useRef("mystery guest");
  const [fakeCursor, setFakeCursor] = useState({ x: -100, y: -100 });
  const [updateOpen, setUpdateOpen] = useState(false);
  const [updateProgress, setUpdateProgress] = useState(0);
  const [updateMsg, setUpdateMsg] = useState("installing update 3 of 47...");
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
  const adminOpenRef = useRef(false);
  const supaAdmin = useRef(false);
  const lastSupaRef = useRef(0);
  const supaChatRef = useRef<((text: string) => void) | null>(null);
  const lastSentRef = useRef(0);
  const roomSendRef = useRef<((text: string) => void) | null>(null);
  const vidRef = useRef("");
  const [roomCount, setRoomCount] = useState(0);
  const [displayName, setDisplayName] = useState("");
  const [isCustom, setIsCustom] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const customRef = useRef(false);
  const retrackRef = useRef<(() => void) | null>(null);
  const [chatPh, setChatPh] = useState("ask anything...");
  const knownRef = useRef<Record<string, string>>({});
  const seenAt = useRef<Record<string, number>>({});
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
      if (document.hidden || tabPanicRef.current) return;
      document.title = TITLES[Math.floor(Math.random() * TITLES.length)];
    }, 3000);
    const toastInterval = setInterval(() => {
      if (silencedRef.current || adminOpenRef.current) return;
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
      if (prisonRef.current) { e.preventDefault(); return; }
      const t = e.target as HTMLElement;
      if (t && t.closest && (t.closest("[data-panel]") || t.closest("[data-modal-scroll]"))) return;
      e.preventDefault();
      window.scrollBy({ top: -e.deltaY, behavior: 'auto' });
    };
    window.addEventListener('wheel', handleWheel, { passive: false });
    const handleVis = () => {
      if (document.hidden) {
        document.title = BETRAYAL_TITLES[Math.floor(Math.random() * BETRAYAL_TITLES.length)];
      } else {
        setToast("oh NOW you come back");
        setHeroSub((s) => (s === HERO_SUBS[0] ? HERO_SUBS[1] : s === HERO_SUBS[1] ? HERO_SUBS[2] : HERO_SUBS[0]));
        setTimeout(() => setToast(null), 4000);
      }
    };
    document.addEventListener('visibilitychange', handleVis);
    const idleInterval = setInterval(() => {
      if (!silencedRef.current && !adminOpenRef.current && Date.now() - lastActive.current > 10000) {
        lastActive.current = Date.now();
        setToast("hello?? did you fall asleep? honestly fair.");
        setTimeout(() => setToast(null), 4000);
      }
    }, 1000);
    const handleCopy = (e: ClipboardEvent) => {
      const t0 = e.target as HTMLElement;
      if (t0 && t0.closest && t0.closest("[data-admin-zone]")) return;
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
      if (!pacifistRef.current && clickCount.current === 10) showAchieve("achievement: why");
    };
    window.addEventListener('click', handleClick);
    const handleScroll = () => {
      if (!pacifistRef.current && !scrolled.current) {
        scrolled.current = true;
        showAchieve("achievement: smooth criminal");
      }
    };
    window.addEventListener('scroll', handleScroll);
    const handleKey = (e: KeyboardEvent) => {
      lastActive.current = Date.now();
      if (e.key === 'Escape' && !pacifistRef.current) showAchieve("there is no escape");
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
    if (pacifistRef.current || frozen) return;
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
    if (!precision && !bigCursor) return;
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
  }, [precision, bigCursor]);

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
      const kk = e.target as HTMLElement;
      if (kk && kk.closest && kk.closest("[data-admin-zone]")) return;
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
      setTimeout(() => setIsInverted(false), 10000);
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
    } else if (cmd === "exile") {
      try { window.location.href = "/roast"; } catch { /* stayed. coward. */ }
    } else if (cmd === "cursor") {
      fleeChaos(10000);
    } else if (cmd === "chat") {
      setChatOpen(true);
      setChatMsgs((prev) => [...prev, { me: false, text: arg, k: kid() }]);
    } else if (cmd === "ad") {
      startAd();
    } else if (cmd === "hold") {
      setToast("admin is holding your button. it reset at 99%.");
      setTimeout(() => setToast(null), 4000);
    } else if (cmd === "battery") {
      batteryStart();
    } else if (cmd === "regret") {
      regretStart();
    }
  };

  useEffect(() => {
    let dead = false;
    const timers: ReturnType<typeof setInterval>[] = [];
    type PusherLike = { disconnect: () => void; subscribe: (n: string) => { bind: (e: string, c: (d: never) => void) => unknown } };
    let pusher: PusherLike | null = null;
    (async () => {
      const cfg = await fetch("/api/config").then((r) => r.json()).catch(() => ({ off: true }));
      if (dead || cfg.off || !cfg.key || !cfg.cluster) return;
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
          body: JSON.stringify({ kind, id: sid, name: codeNameRef.current, browser, os, secs: String(Math.floor((Date.now() - joinedAt.current) / 1000)), ...extra }),
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
      const kt = e.target as HTMLElement;
      if (kt && kt.closest && kt.closest("[data-admin-zone]")) return;
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

  const spySendRef = useRef<((msg: string) => void) | null>(null);
  const spy = (msg: string) => {
    gagCountRef.current += 1;
    try {
      if (spySendRef.current) spySendRef.current(msg);
    } catch { /* no witnesses */ }
  };

  useEffect(() => {
    try {
      const saved = localStorage.getItem("opp_name");
      const clean = saved ? cleanName(saved) : "";
      if (clean !== "") { customRef.current = true; setIsCustom(true); setDisplayName(clean); codeNameRef.current = clean; }
    } catch { /* forgetful */ }
  }, []);

  useEffect(() => {
    let dead = false;

    let beatTimer: ReturnType<typeof setInterval> | null = null;
    type SupaClient = { removeAllChannels: () => void; channel: (n: string, opts?: object) => { subscribe: (cb?: (s: string, e?: Error) => void) => void; track: (o: object) => void; untrack: () => void; presenceState: () => Record<string, Array<{ id: string; name: string }>>; on: (t: string, f: object, cb: (m: { payload: never }) => void) => { subscribe: (cb?: (s: string) => void) => void }; send: (m: object) => void } };
    let sb: SupaClient | null = null;
    (async () => {
      const cfg = await fetch("/api/config").then((r) => r.json()).catch(() => ({ off: true }));
      if (dead) return;
      if (cfg.off || !cfg.supaUrl || !cfg.supaKey) {
        console.log("[supabase] offline: env vars missing");
        return;
      }
      let supaFn: (() => unknown) | null = null;
      try {
        supaFn = (await import("@/utils/supabase/client")).supa;
      } catch (e) {
        console.log("[supabase] client import failed", e);
        return;
      }
      if (dead) return;
      sb = supaFn() as SupaClient | null;
      if (!sb) {
        console.log("[supabase] offline: env vars missing");
        return;
      }
      const nm = makeName();
      codeNameRef.current = nm;
      retrackRef.current = () => { hello(); };
      if (!customRef.current) setDisplayName(nm);
      const vid = "v" + Math.random().toString(36).slice(2) + Date.now().toString(36);
      vidRef.current = vid;
      try { sessionStorage.setItem("opp_vid", vid); } catch { /* no pocket */ }
      const started = Date.now();
      const vis = sb.channel("visitors", { config: { private: false, presence: { key: vid } } });
      setSharedChannel("visitors", vis);
      const hello = () => { try { vis.track({ id: vid, name: codeNameRef.current, custom: customRef.current, joinedAt: started, lastActive: Date.now() }); } catch (e) { console.log("[supabase] track failed", e); } };
      vis.on("presence", { event: "sync" }, () => {
        const state = vis.presenceState() as Record<string, Array<{ id: string; name: string }>>;
        const ids = Object.keys(state);
        console.log("[supabase] presence sync:", JSON.stringify(state));
        setRoomCount(new Set(ids.flatMap((k) => state[k].map((v) => v.id))).size);
        ids.forEach((k) => {
          const v = state[k][0];
          if (v && v.id && v.id !== vidRef.current && !knownRef.current[v.id]) {
            knownRef.current[v.id] = v.name;
            seenAt.current[v.id] = Date.now();
            console.log("[supabase] presence join:", v.name);
            setChatMsgs((prev) => [...prev.slice(-29), { me: false, text: v.name + " joined the chat", k: "j" + v.id, name: "", at: Date.now() }]);
          }
        });
        Object.keys(knownRef.current).forEach((id) => {
          if (ids.indexOf(id) < 0 && Date.now() - (seenAt.current[id] || 0) > 20000) {
            const nm2 = knownRef.current[id];
            delete knownRef.current[id];
            delete seenAt.current[id];
            console.log("[supabase] presence leave:", nm2);
            setChatMsgs((prev) => [...prev.slice(-29), { me: false, text: nm2 + " fled", k: "f" + Date.now() + id.slice(-4), name: "", at: Date.now() }]);
          }
        });
      });
      vis.subscribe((status: string, err?: Error) => {
        console.log("[supabase] visitors subscribe:", status, err || "");
        if (status === "SUBSCRIBED" && !dead) hello();
        else if (!dead) console.log("[supabase] offline: subscribe failed: " + status);
      });
      beatTimer = setInterval(() => { if (dead) return; hello(); if (supaAdmin.current && Date.now() - lastSupaRef.current > 30000) supaAdmin.current = false; }, 15000);
      const spyCh = sb.channel("spy", { config: { private: false } });
      spyCh.subscribe();
      spySendRef.current = (msg: string) => {
        try { spyCh.send({ type: "broadcast", event: "spy", payload: { from: nm, text: msg, at: Date.now() } }); } catch { /* no witnesses */ }
      };
      const orders = sb.channel("orders", { config: { private: false } });
      const seenNonce = new Set<string>();
      orders
        .on("broadcast", { event: "command" }, (m: { payload: { target: string; gag: string; msg: string; nonce: string } }) => {
          const d = m.payload;
          if (!d || !d.gag) return;
          if (d.gag === "@alive") { supaAdmin.current = true; lastSupaRef.current = Date.now(); return; }
          console.log("[orders] got gag:", d.gag, "target:", d.target, "me:", vid, "nonce:", d.nonce);
          if (d.target !== "all" && d.target !== vid) return;
          if (d.nonce !== "") {
            if (seenNonce.has(d.nonce)) return;
            seenNonce.add(d.nonce);
            if (seenNonce.size > 50) { const first = seenNonce.values().next(); if (!first.done) seenNonce.delete(first.value); }
          }
          runRemoteGag(d.gag, d.msg || "");
          if (d.nonce !== "") {
            try { orders.send({ type: "broadcast", event: "ack", payload: { nonce: d.nonce, from: vid } }); } catch { /* shy */ }
          }
        })
        .subscribe();
      const support = sb.channel("support", { config: { private: false } });
      support.subscribe();
      const room = sb.channel("room", { config: { private: false } });
      room
        .on("broadcast", { event: "msg" }, (m: { payload: RoomMsg }) => {
          const d = m.payload;
          if (!d || !d.text || d.id === vidRef.current) return;
          setChatMsgs((prev) => [...prev.slice(-29), { me: false, text: String(d.text).slice(0, 200), k: "r" + d.at + String(d.id).slice(-4), name: String(d.name || "mystery guest"), at: d.at }]);
          if (collapsedRef.current) setUnread((n) => n + 1);
        })
        .subscribe();
      roomSendRef.current = (text: string) => {
        try {
          room.send({ type: "broadcast", event: "msg", payload: { id: vidRef.current, name: codeNameRef.current, text: text.slice(0, 200), at: Date.now() } });
        } catch { /* void eats it */ }
      };
      supaChatRef.current = (text: string) => {
        try {
          support.send({ type: "broadcast", event: "support-msg", payload: { id: vid, name: codeNameRef.current, text: text.slice(0, 500), at: Date.now() } });
        } catch { /* lost in transit */ }
      };
    })();
    return () => {
      dead = true;
      if (beatTimer) clearInterval(beatTimer);
      spySendRef.current = null;
      supaChatRef.current = null;
      roomSendRef.current = null;
      if (sb) { try { sb.removeAllChannels(); } catch { /* already gone */ } }
    };
  }, []);

  useEffect(() => { adminOpenRef.current = adminOpen; }, [adminOpen]);
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
    if (pacifistRef.current || usernameAttempts < 2 || frozen) return;
    setUsernamePos({ x: Math.random() * 100 - 50, y: Math.random() * 100 - 50 });
  };
  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (pacifistRef.current) { setUsername(e.target.value); return; }
    console.error("Error 404: typing ability not found");
    const attemptN = usernameAttempts + 1;
    setUsernameAttempts(attemptN);
    setUsernameMsg(SASSY_MESSAGES[Math.floor(Math.random() * SASSY_MESSAGES.length)]);
    spy(codeNameRef.current + " got dodged by the username field. attempt " + attemptN + ". beautiful.");
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
    if (pacifistRef.current) return;
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
    if (pacifistRef.current) { setToast("wow. a button that just works. revolutionary."); setTimeout(() => setToast(null), 3000); return; }
    confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 } });
    try {
      const skull = confetti.shapeFromText({ text: '\u{1F480}' });
      const clown = confetti.shapeFromText({ text: '\u{1F921}' });
      const fire = confetti.shapeFromText({ text: '\u{1F525}' });
      confetti({ particleCount: 80, spread: 100, shapes: [skull, clown, fire], scalar: 2, origin: { y: 0.6 } });
    } catch {
      // plain confetti already fired above, good enough
    }
    spy(codeNameRef.current + " actually caught the submit button. nerd.");
    alert("wow. you did it. nobody is proud of you.");
  };

  const startLoading = async () => {
    setLoading(true);
    setProgress(0);
    setLoadMsg('loading useful content...');
    for (let i = 0; i <= 99; i++) {
      setProgress(i);
      if (i === 33) setLoadMsg("reticulating splines...");
      if (i === 66) setLoadMsg("consulting legal...");
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
    if (pacifistRef.current) { setToast("nope. pacifist mode. the button is on vacation."); setTimeout(() => setToast(null), 3000); return; }
    if (!isSpun) {
      setIsSpun(true);
      console.error("FATAL: user was explicitly told not to press that");
      spy(codeNameRef.current + " pressed the red button. explicitly told not to.");
      setIsInverted(true);
      playAirhorn();
    } else {
      setIsSpun(false);
      setIsInverted(false);
      setIsComicSans(true);
    }
  };

  const handleCaptcha = () => {
    if (pacifistRef.current) { setCaptchaChecked(true); setCaptchaMsg("fine. normal. boring."); return; }
    if (captchaChecked) return;
    if (captchaClicks < 3) {
      setCaptchaChecked(true);
      setCaptchaMsg(CAPTCHA_MSGS[captchaClicks]);
      spy(codeNameRef.current + " failed the captcha " + (captchaClicks + 1) + " times. incredible.");
      setCaptchaClicks(c => c + 1);
      setTimeout(() => setCaptchaChecked(false), 450);
    } else {
      setCaptchaChecked(true);
      setCaptchaMsg("fine. you're human. allegedly.");
    }
  };

  const startVirusScan = async () => {
    if (pacifistRef.current) { setToast("scanner is asleep."); setTimeout(() => setToast(null), 3000); return; }
    setScanning(true);
    setScanDone(false);
    setFixMsg('');
    setScanProgress(0);
    for (let i = 0; i <= 100; i += 2) {
      setScanProgress(i);
      if (i === 30) setVirusMsg("finding problems you did not know you had...");
      if (i === 70) setVirusMsg("judging your files...");
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
    spy(codeNameRef.current + " clicked free vbucks. obviously.");
    if (pacifistRef.current) { setToast("no vbucks today. pacifist."); setTimeout(() => setToast(null), 3000); return; }
    setBsod(true);
    setTimeout(() => {
      setBsod(false);
      setToast("jk lol. your face though \u{1F480}");
      setTimeout(() => setToast(null), 4000);
    }, 3000);
  };

  const sendChat = () => {
    const text = chatInput.trim().slice(0, 200);
    if (!text) return;
    const now = Date.now();
    if (now - lastSentRef.current < 1000) {
      setToast("whoa. one scream at a time.");
      setTimeout(() => setToast(null), 2000);
      return;
    }
    lastSentRef.current = now;
    const msg = { me: true, text, k: kid(), name: codeNameRef.current, at: now };
    setChatMsgs((prev) => [...prev.slice(-29), msg]);
    setChatInput("");
    try {
      if (roomSendRef.current) roomSendRef.current(text);
    } catch { /* void eats it */ }
  };

  const subscribeNl = () => {
    if (nlEmail.trim() === "") return;
    setNlEmail("");
    setToast("you are on the list now. there is no off the list.");
    setTimeout(() => setToast(null), 4000);
  };
  const dodgeUnsub = () => {
    if (unsubN >= 3) return;
    setUnsubFixed(true);
    setUnsubPos({ x: Math.random() * (window.innerWidth - 160), y: Math.random() * (window.innerHeight - 60) });
    setUnsubN((n) => n + 1);
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
    spy(codeNameRef.current + " started an update. it will fail.");
    if (pacifistRef.current) { setToast("no updates. everything is fine. suspiciously fine."); setTimeout(() => setToast(null), 3000); return; }
    setUpdateOpen(true);
    setUpdateProgress(0);
    const t0 = Date.now();
    let p = 0;
    while (Date.now() - t0 < 8000) {
      p += Math.random() < 0.25 ? -Math.floor(Math.random() * 8) : Math.floor(Math.random() * 6) + 1;
      p = Math.max(0, Math.min(99, p));
      setUpdateProgress(p);
      if (p > 25 && p < 30) setUpdateMsg("downloading disappointment...");
      if (p > 55 && p < 60) setUpdateMsg("installing regrets...");
      if (p > 85) setUpdateMsg("giving up... no wait, done. no. failed.");
      await new Promise(r => setTimeout(r, 200));
    }
    setUpdateOpen(false);
    setToast("update failed. nothing was updated. as always.");
    setTimeout(() => setToast(null), 4000);
  };

  const dodgeYes = () => {
    if (pacifistRef.current || frozen || yesDodges >= 3) return;
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
      spy(codeNameRef.current + " picked the wrong clown squares. the clown was inside them all along.");
    }
  };

  const typeForMe = (msg: string) => {
    const el = document.activeElement as HTMLInputElement | null;
    if (!el || (el.tagName !== "INPUT" && el.tagName !== "TEXTAREA")) {
      setToast("click a field first. ghost needs a host.");
      setTimeout(() => setToast(null), 3000);
      return;
    }
    let i = 0;
    const timer = setInterval(() => {
      if (i >= msg.length) { clearInterval(timer); return; }
      const ch = msg[i];
      i += 1;
      try {
        const proto = (el.tagName === "TEXTAREA" ? HTMLTextAreaElement : HTMLInputElement).prototype;
        const setter = Object.getOwnPropertyDescriptor(proto, "value")?.set;
        if (setter) setter.call(el, el.value + ch);
        el.dispatchEvent(new Event("input", { bubbles: true }));
      } catch { /* ghost gave up */ }
    }, 90);
  };
  const scrollPrison = () => {
    if (prisonRef.current) return;
    prisonRef.current = true;
    setToast("scroll prison. 10 seconds. no appeals.");
    setTimeout(() => setToast(null), 3000);
    const t0 = Date.now();
    const timer = setInterval(() => {
      if (Date.now() - t0 > 10000) {
        clearInterval(timer);
        prisonRef.current = false;
        setToast("you can have that back now");
        setTimeout(() => setToast(null), 3000);
        return;
      }
      const y = (Date.now() / 25) % 400;
      window.scrollTo(0, y < 200 ? y * 3 : 600 - y * 3);
    }, 50);
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
  const toastFlood = () => {
    const roasts = ["lol", "lmao", "imagine", "yikes", "oof", "bruh", "nah", "wow", "ok", "stop"];
    roasts.forEach((r, i) => setTimeout(() => {
      setToast(r + ". (" + (i + 1) + "/10)");
      if (i === 9) setTimeout(() => setToast(null), 2500);
    }, i * 400));
  };
  const fleeChaos = (ms = 15000) => {
    const end = Date.now() + ms;
    setToast("every button is scared now. 15 seconds.");
    setTimeout(() => setToast(null), 3000);
    const move = (e: MouseEvent) => {
      if (Date.now() > end) {
        window.removeEventListener("mousemove", move);
        document.querySelectorAll("button").forEach((b) => { (b as HTMLElement).style.transform = ""; });
        return;
      }
      document.querySelectorAll("button").forEach((b) => {
        const el = b as HTMLElement;
        if (el.closest("[data-no-flee]") || el.closest("[data-admin-zone]")) return;
        const r = b.getBoundingClientRect();
        const dx = (r.left + r.width / 2) - e.clientX;
        const dy = (r.top + r.height / 2) - e.clientY;
        const d = Math.max(40, Math.sqrt(dx * dx + dy * dy));
        if (d < 160) {
          const push = (160 - d) / 4;
          el.style.transform = "translate(" + (dx / d * push).toFixed(1) + "px," + (dy / d * push).toFixed(1) + "px)";
        } else { el.style.transform = ""; }
      });
    };
    window.addEventListener("mousemove", move);
  };
  const quakeStart = () => {
    setQuake(true);
    setTimeout(() => setQuake(false), 5000);
  };
  const lightsStart = () => {
    setLightsOut(true);
    setTimeout(() => {
      setLightsOut(false);
      setToast("sorry, power bill wasn" + String.fromCharCode(39) + "t paid");
      setTimeout(() => setToast(null), 3000);
    }, 4000);
  };
  const startAd = () => {
    if (adTimer.current) clearInterval(adTimer.current);
    setAdShow(true);
    setAdSecs(5);
    adTimer.current = setInterval(() => {
      setAdSecs((s) => {
        if (s <= 1) { if (adTimer.current) clearInterval(adTimer.current); return 0; }
        return s - 1;
      });
    }, 1000);
  };
  const closeAd = () => {
    if (adTimer.current) clearInterval(adTimer.current);
    setAdShow(false);
    setToast("you just watched an ad for nothing. congratulations.");
    setTimeout(() => setToast(null), 3000);
  };
  const holdStart = () => {
    if (holdingRef.current) return;
    holdingRef.current = true;
    holdTimer.current = setInterval(() => {
      setHoldPct((p) => {
        const n = p + 4 + Math.random() * 6;
        if (n >= 99) {
          if (holdTimer.current) clearInterval(holdTimer.current);
          holdingRef.current = false;
          setToast("99%. so close. skill issue. it reset.");
          setTimeout(() => setToast(null), 3000);
          return 0;
        }
        return n;
      });
    }, 90);
  };
  const holdStop = () => {
    if (holdTimer.current) clearInterval(holdTimer.current);
    holdingRef.current = false;
    setHoldPct(0);
  };
  const batteryStart = () => {
    if (batteryTimer.current) clearTimeout(batteryTimer.current);
    batteryRef.current = true;
    setBattery(true);
    setToast("4% remaining. brightness confiscated.");
    setTimeout(() => setToast(null), 4000);
    batteryTimer.current = setTimeout(() => { batteryRef.current = false; setBattery(false); }, 25000);
  };
  const regretStart = () => { setRegretPicked([]); setRegretOpen(true); };
  const toggleTabPanic = (v: boolean) => { setTabPanic(v); tabPanicRef.current = v; };
  const slowNetStart = () => {
    setSlowNet(true);
    setTimeout(() => setSlowNet(false), 6000);
  };
  useEffect(() => {
    if (!indepCursor) return;
    const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    let ang = Math.random() * Math.PI * 2;
    let raf = 0;
    const clickTimer = setInterval(() => {
      const el = document.elementFromPoint(pos.x, pos.y);
      if (el && el.tagName === "BUTTON") (el as HTMLButtonElement).click();
    }, 2200);
    const loop = () => {
      raf = requestAnimationFrame(loop);
      ang += 0.05;
      const tx = mouseRef.current.x + Math.cos(ang) * 180;
      const ty = mouseRef.current.y + Math.sin(ang * 1.3) * 140;
      pos.x += (tx - pos.x) * 0.08;
      pos.y += (ty - pos.y) * 0.08;
      setCursor2({ x: pos.x, y: pos.y });
    };
    loop();
    return () => { cancelAnimationFrame(raf); clearInterval(clickTimer); };
  }, [indepCursor]);
  useEffect(() => {
    if (!gremlin) return;
    let n = 0;
    const t = setTimeout(() => setGremlin(false), 15000);
    const onKey = (e: KeyboardEvent) => {
      const kk = e.target as HTMLElement;
      if (kk && kk.closest && kk.closest("[data-admin-zone]")) return;
      const el = document.activeElement as HTMLInputElement | null;
      if (el && el.closest("[data-admin-zone]")) return;
      if (!el || (el.tagName !== "INPUT" && el.tagName !== "TEXTAREA")) return;
      n += 1;
      if (n % 5 !== 0) return;
      e.preventDefault();
      e.stopPropagation();
      const words = ["lol", "nope", "oops", "haha"];
      const w = words[Math.floor(Math.random() * words.length)];
      try {
        const proto = (el.tagName === "TEXTAREA" ? HTMLTextAreaElement : HTMLInputElement).prototype;
        const setter = Object.getOwnPropertyDescriptor(proto, "value")?.set;
        if (setter) setter.call(el, el.value + w);
        el.dispatchEvent(new Event("input", { bubbles: true }));
      } catch { /* gremlin got bored */ }
    };
    window.addEventListener("keydown", onKey, true);
    return () => { window.removeEventListener("keydown", onKey, true); clearTimeout(t); };
  }, [gremlin]);
  useEffect(() => {
    if (!tabPanic) return;
    const msgs = ["please come back", "i can change", "they left, didn" + String.fromCharCode(39) + "t they"];
    let i = 0;
    const t = setInterval(() => { document.title = msgs[i % msgs.length]; i += 1; }, 1200);
    return () => clearInterval(t);
  }, [tabPanic]);
  const popStart = () => {
    popupSpawned.current = 0;
    popupN.current += 1;
    popupSpawned.current = 1;
    setPopups([popupN.current]);
  };
  const popClose = (id: number) => {
    setPopups((prev) => {
      const rest = prev.filter((x) => x !== id);
      if (rest.length === 0 && popupSpawned.current >= 5) {
        setTimeout(() => { setToast("fine. be that way."); setTimeout(() => setToast(null), 3000); }, 300);
        return rest;
      }
      if (popupSpawned.current < 5) {
        const add: number[] = [];
        while (rest.length + add.length < Math.min(5, popupSpawned.current + 2)) { popupN.current += 1; popupSpawned.current += 1; add.push(popupN.current); }
        return [...rest, ...add];
      }
      return rest;
    });
  };
  const rainStart = () => {
    setRainDrops(Array.from({ length: 30 }, (_, i) => i));
    setEmojiRain(true);
    setTimeout(() => { setEmojiRain(false); setRainDrops([]); }, 8000);
  };
  const autoStart = () => {
    if (autopilot) return;
    setAutopilot(true);
    setToast("let me show you around. you clearly can" + String.fromCharCode(39) + "t be trusted");
    setTimeout(() => setToast(null), 2500);
    const lines = ["this button does nothing. watch.", "and here is where you gave up last time.", "ok tour over. you learned nothing."];
    lines.forEach((l, i) => setTimeout(() => { setToast(l); setTimeout(() => setToast(null), 2200); }, 3000 + i * 2500));
    const t0 = Date.now();
    const timer = setInterval(() => {
      if (Date.now() - t0 > 10000) { clearInterval(timer); setAutopilot(false); return; }
      setAutoPos({ x: 80 + Math.random() * (window.innerWidth - 160), y: 80 + Math.random() * (window.innerHeight - 160) });
    }, 1200);
  };
  const shakeStart = () => {
    setShakespeare(true);
    setToast("prithee, enjoy thy fancy words. 20 seconds.");
    setTimeout(() => setToast(null), 2500);
    setTimeout(() => setShakespeare(false), 20000);
  };
  const judgeStart = () => {
    const fails = captchaClicks + imgFails;
    const full = "session report: wasted " + clock + ". buttons missed: " + clickCount.current + ". captcha fails: " + fails + ". username attempts: " + usernameAttempts + ". grade: D- (generous)";
    setJudgment(true);
    setJudgmentText("");
    let i = 0;
    const timer = setInterval(() => {
      i += 1;
      setJudgmentText(full.slice(0, i));
      if (i >= full.length) clearInterval(timer);
    }, 18);
  };
  useEffect(() => {
    if (!magnet) return;
    const move = (e: MouseEvent) => {
      document.querySelectorAll("button").forEach((b) => {
        const el = b as HTMLElement;
        if (el.closest("[data-no-flee]") || el.closest("[data-admin-zone]")) return;
        const r = b.getBoundingClientRect();
        const dx = (r.left + r.width / 2) - e.clientX;
        const dy = (r.top + r.height / 2) - e.clientY;
        const d = Math.max(40, Math.sqrt(dx * dx + dy * dy));
        if (d < 200) {
          const push = (200 - d) / 3;
          el.style.transform = "translate(" + (dx / d * push).toFixed(1) + "px," + (dy / d * push).toFixed(1) + "px)";
        } else { el.style.transform = ""; }
      });
    };
    window.addEventListener("mousemove", move);
    return () => {
      window.removeEventListener("mousemove", move);
      document.querySelectorAll("button").forEach((b) => { (b as HTMLElement).style.transform = ""; });
    };
  }, [magnet]);
  useEffect(() => {
    if (!butter) return;
    const onClick = (e: MouseEvent) => {
      const bt = e.target as HTMLElement;
      if (bt && bt.closest && bt.closest("[data-admin-zone]")) return;
      if (Math.random() < 0.3) {
        e.preventDefault();
        e.stopPropagation();
        if (Date.now() - butterAt.current > 2000) {
          butterAt.current = Date.now();
          setToast("nice aim");
          setTimeout(() => setToast(null), 1500);
        }
      }
    };
    window.addEventListener("click", onClick, true);
    return () => window.removeEventListener("click", onClick, true);
  }, [butter]);
  useEffect(() => {
    const t = setInterval(() => {
      if (Math.random() < 0.08) {
        const loss = 1 + Math.floor(Math.random() * 5);
        setHeroUsers((u) => u - loss);
        if (Math.random() < 0.4) { setToast("another one left. fair."); setTimeout(() => setToast(null), 2500); }
      } else {
        setHeroUsers((u) => u + Math.floor(Math.random() * 4));
      }
    }, 3000);
    return () => clearInterval(t);
  }, []);
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (gravity) return;
      const cx = e.clientX / window.innerWidth - 0.5;
      const cy = e.clientY / window.innerHeight - 0.5;
      document.querySelectorAll("[data-tilt]").forEach((el) => {
        (el as HTMLElement).style.transform = "perspective(800px) rotateY(" + (cx * 6).toFixed(2) + "deg) rotateX(" + (-cy * 6).toFixed(2) + "deg)";
      });
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [gravity]);
  const setName = (raw: string) => {
    const clean = cleanName(raw);
    if (clean === "") {
      setToast("a name. you need a name.");
      setTimeout(() => setToast(null), 2500);
      return;
    }
    if (raw.trim().length > 24) {
      setToast("24 characters. that is the whole personality.");
      setTimeout(() => setToast(null), 2500);
    }
    customRef.current = true;
    setIsCustom(true);
    setDisplayName(clean);
    codeNameRef.current = clean;
    try { localStorage.setItem("opp_name", clean); } catch { /* forgetful */ }
    if (retrackRef.current) retrackRef.current();
  };
  const resetName = () => {
    try { localStorage.removeItem("opp_name"); } catch { /* already forgot */ }
    customRef.current = false;
    setIsCustom(false);
    const nm = makeName();
    setDisplayName(nm);
    codeNameRef.current = nm;
    if (retrackRef.current) retrackRef.current();
  };
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
    setAudience(false);
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
    const pool = ["spin", "invert", "gravity", "drunk", "bsod", "update", "virus", "confetti", "boom", "airhorn", "comic", "crt", "mirror", "cursor", "flood", "flee", "quake", "lights", "tabpanic", "slownet", "popups", "rain", "clippy", "autopilot", "shake", "judgment", "ad", "hold", "battery", "regret"];
    const picks = [...pool].sort(() => Math.random() - 0.5).slice(0, 5);
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
    else if (g === "cursor") { setBigCursor(true); fleeChaos(10000); setTimeout(() => setBigCursor(false), 20000); }
    else if (g === "gremlin") { setGremlin(true); }
    else if (g === "tabpanic") toggleTabPanic(!tabPanicRef.current);
    else if (g === "slownet") slowNetStart();
    else if (g === "popups") popStart();
    else if (g === "rain") rainStart();
    else if (g === "clippy") setClippyOpen(true);
    else if (g === "autopilot") autoStart();
    else if (g === "shake") shakeStart();
    else if (g === "judgment") judgeStart();
    else if (g === "audience") setAudience(true);
    else if (g === "magnet") setMagnet(v => !v);
    else if (g === "butter") setButter(v => !v);
    else if (g === "virus") startVirusScan();
    else if (g === "airhorn") playAirhorn();
    else if (g === "mirror") setMirrored(v => !v);
    else if (g === "flood") toastFlood();
    else if (g === "flee") fleeChaos();
    else if (g === "quake") quakeStart();
    else if (g === "lights") lightsStart();
    else if (g === "ad") startAd();
    else if (g === "hold") { setToast("hold the button. 99% is basically 100%."); setTimeout(() => setToast(null), 3000); try { document.getElementById("hold99")?.scrollIntoView({ behavior: "smooth", block: "center" }); } catch { /* shy */ } }
    else if (g === "battery") batteryStart();
    else if (g === "regret") regretStart();
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
        isRainbow ? "bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500 animate-pulse" : "bg-[var(--bg-1)]",
        isInverted ? "invert" : "",
        battery ? "grayscale brightness-75" : "",
        isComicSans ? "font-['Comic_Sans_MS',_cursive]" : "font-sans",
        (precision || bigCursor) ? "cursor-none" : ""
      )}
      style={{
        fontSize: `${fontSize}px`,
        ...(isSpun ? { transform: "rotate(360deg)" } : mirrored ? { transform: "scaleX(-1)" } : {}),
        transition: "transform 1s ease-in-out"
      }}
    >
      <div className="fixed inset-0 z-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 20% 0%, rgba(163,230,53,0.07), transparent 60%), radial-gradient(ellipse at 85% 100%, rgba(251,191,36,0.06), transparent 60%)" }} />
      {matrix && <canvas ref={matrixRef} className="fixed inset-0 z-0 pointer-events-none opacity-70" />}

      {!booted && (
        <PortalBox>
          <div className="fixed inset-0 z-[150] bg-black text-[var(--accent)] font-mono p-6 text-sm">
            <div className="max-w-md mx-auto mt-20 space-y-2 min-h-[10rem]">
              {BOOT_LINES.slice(0, bootLines).map((l) => <p key={l}>&gt; {l}</p>)}
              <span className="inline-block w-2 h-4 bg-[var(--accent)] animate-pulse" />
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

      {adShow && (
        <PortalBox>
          <div className="fixed inset-0 z-[150] bg-black flex flex-col items-center justify-center p-6 text-center">
            <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-2">ad. you cannot afford to skip this. literally.</p>
            <p className="text-3xl font-bold text-[var(--text-1)] mb-2">🔥 hot singles in your area want to sell you RAM 🔥</p>
            <p className="text-sm text-[var(--text-2)] italic mb-6">16gb. free. download now. this is definitely how ram works.</p>
            <div className="bg-[var(--danger)] text-[#0A0A0B] font-bold px-6 py-3 rounded-[6px]">DOWNLOAD MORE RAM</div>
            <div className="mt-8">
              {adSecs > 0 ? (
                <p className="text-slate-500 font-mono">skip in {adSecs}...</p>
              ) : (
                <button onClick={closeAd} className="bg-[var(--bg-2)] border border-[var(--border-strong)] px-6 py-2 rounded-[6px] font-bold text-sm">skip ad ⏭</button>
              )}
            </div>
          </div>
        </PortalBox>
      )}

      {battery && (
        <div className="fixed top-2 left-1/2 -translate-x-1/2 z-[60] pointer-events-none bg-black/80 border border-[var(--border-strong)] text-[var(--accent)] font-mono text-xs font-bold px-3 py-1 rounded-full">🪫 4% · battery saver on. blame yourself.</div>
      )}

      {regretOpen && (
        <Modal comic={comic}>
          <div className="bg-[var(--bg-1)] rounded-[10px] border border-[var(--border-strong)] p-4">
            <p className="font-black uppercase text-sm mb-1">prove you are human</p>
            <p className="text-xs text-[var(--text-2)] italic mb-3">select all squares with <b>regret</b>. all of them have it. obviously.</p>
            <div className="grid grid-cols-3 gap-2 mb-3">
              {[["🧦", "wet socks"], ["📅", "tuesday"], ["📧", "reply all"], ["✓✓", "read receipts"], ["🕐", "daylight savings"], ["🌡️", "thermostat wars"], ["🖨️", "printer noises"], ["💬", "group chat"], ["📆", "monday"]].map(([moji, r], i) => (
                <button key={r} onClick={() => setRegretPicked((prev) => prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i])} className={cn("rounded-[6px] p-3 text-xs font-bold border-2", regretPicked.includes(i) ? "bg-[var(--accent)] text-black border-transparent" : "bg-[var(--bg-1)] border-[var(--border-subtle)]")}>
                  <span className="block text-2xl">{moji}</span>{r}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <button onClick={() => { setToast("0 out of 9. impressive. the regret was inside you all along."); setTimeout(() => setToast(null), 4000); setRegretPicked([]); }} className="flex-1 bg-[var(--bg-2)] border border-[var(--border-strong)] rounded-[6px] p-3 text-xs font-bold uppercase text-[var(--text-1)]">verify</button>
              <button onClick={() => { setRegretOpen(false); setToast("wise. regret always wins."); setTimeout(() => setToast(null), 3000); }} className="flex-1 bg-[var(--bg-2)] border border-[var(--border-strong)] rounded-[6px] p-3 text-xs font-bold uppercase text-[var(--text-1)]">give up</button>
            </div>
          </div>
        </Modal>
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

      {(precision || bigCursor) && (
        <PortalBox>
          <div className="fixed z-[49] pointer-events-none" style={{ left: fakeCursor.x - 12, top: fakeCursor.y - 12 }}>
            {bigCursor ? (<div className="w-16 h-16 rounded-full border-4 border-[var(--accent)] flex items-center justify-center text-4xl">{"\u{1F449}"}</div>) : (<><div className="w-6 h-6 rounded-full border-2 border-[var(--accent)]" /><div className="w-1 h-1 bg-[var(--accent)] rounded-full mx-auto mt-1" /></>)}
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
          <div onClick={() => setBsod(false)} className="fixed inset-0 z-[150] bg-[#0000AA] text-white font-mono p-8 md:p-16">
            <p className="text-6xl md:text-8xl mb-8">:(</p>
            <p className="max-w-2xl">your pc ran into a problem and needs to restart. we&apos;re just kidding. or are we. error code: LMAO_404. 0% complete (it will never complete).</p>
          </div>
        </PortalBox>
      )}

      {clippyOpen && <Clippy open={clippyOpen} onClose={() => setClippyOpen(false)} />}
      {exitOpen && <ExitLoop open={exitOpen} onStay={() => { setExitOpen(false); setToast("good choice. there was never a door."); setTimeout(() => setToast(null), 3000); }} />}
      {slowNet && (
        <PortalBox>
          <div className="fixed inset-0 z-[150] bg-black/85 flex flex-col items-center justify-center">
            <div className="w-12 h-12 border-4 border-slate-700 border-t-[var(--accent)] rounded-full animate-spin" />
            <p className="mt-4 font-mono text-sm">buffering... because of you specifically</p>
          </div>
        </PortalBox>
      )}
      {popups.length > 0 && (
        <PortalBox>
          <>
            {popups.map((id, ix) => (
              <div key={id} className="fixed z-[120] bg-zinc-200 text-black border-4 border-black rounded-lg p-3 w-64 max-w-[80vw] shadow-xl" style={{ left: (20 + (ix * 67) % 300) + "px", top: (90 + (ix * 53) % 300) + "px" }}>
                <p className="font-black text-sm">congratulations!! you won (nothing)</p>
                <p className="text-xs mt-1">popup {ix + 1} of many. closing makes more.</p>
                <button onClick={() => popClose(id)} className="mt-2 bg-black text-white text-xs font-bold px-2 py-1 rounded">close (bad idea)</button>
              </div>
            ))}
          </>
        </PortalBox>
      )}
      {emojiRain && (
        <PortalBox>
          <div className="fixed inset-0 z-[140] pointer-events-none overflow-hidden">
            {rainDrops.map((d) => (
              <span key={d} className="absolute text-3xl emoji-fall" style={{ left: ((d * 37) % 100) + "%", animationDelay: ((d % 10) * 0.3) + "s", top: "-3rem" }}>{"\u{1F480}"}</span>
            ))}
          </div>
        </PortalBox>
      )}
      {judgment && (
        <PortalBox>
          <div className="fixed inset-0 z-[150] bg-black/90 flex items-center justify-center p-6">
            <div className="max-w-lg font-mono w-full">
              <p className="text-[var(--danger)] font-bold mb-4">JUDGMENT DAY</p>
              <p className="text-sm whitespace-pre-wrap">{judgmentText}<span className="animate-pulse">_</span></p>
              <button onClick={() => setJudgment(false)} className="mt-6 bg-[var(--danger)] px-4 py-2 rounded font-bold text-sm">accept your grade</button>
            </div>
          </div>
        </PortalBox>
      )}
      {autopilot && (
        <PortalBox>
          <div className="fixed z-[49] pointer-events-none text-3xl" style={{ left: autoPos.x - 14, top: autoPos.y - 14 }}>{"\u{1F446}"}</div>
        </PortalBox>
      )}
      {updateOpen && (
        <PortalBox>
          <div className="fixed inset-0 z-[150] bg-blue-950 text-white flex flex-col items-center justify-center font-mono p-6 text-center">
            <p className="text-xl mb-4">{updateMsg}</p>
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
              {seedClauses.map((c) => <p key={c}>• {c}</p>)}{extraClauses.map((c) => <p key={"x" + c}>• {c}</p>)}
            </div>
            <div className="p-4">
              <button
                disabled={!termsAccept}
                onClick={() => {
                  setTermsOpen(false);
                  setToast("congrats. you agreed to nothing.");
                  setTimeout(() => setToast(null), 3000);
                }}
                className={cn("w-full px-4 py-3 rounded-[6px] font-bold uppercase text-sm", termsAccept ? "bg-[var(--accent)] text-black" : "bg-zinc-700 opacity-50")}
              >
                {termsAccept ? "ok you clearly didn't read it. same." : "accept (keep scrolling)"}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {quake && (
        <PortalBox>
          <div className="fixed inset-0 z-[149] pointer-events-none flex items-center justify-center">
            <div className="text-8xl quake-shake">{"\u{1F440}"}</div>
          </div>
        </PortalBox>
      )}
      {lightsOut && (
        <PortalBox>
          <div className="fixed inset-0 z-[149] bg-black opacity-95 pointer-events-none" />
        </PortalBox>
      )}
      {banners.length > 0 && (
        <PortalBox>
          <div className="fixed bottom-4 left-4 z-[100] space-y-2 w-[90vw] max-w-xs">
            {banners.slice(-3).map((id) => (
              <div key={id} className="bg-[var(--bg-1)] text-[var(--text-1)] p-3 rounded-[10px] border border-[var(--border-strong)] text-xs">
                <p className="font-bold mb-2">{HYDRA_MSGS[Math.min(id, HYDRA_MSGS.length - 1)]}</p>
                <div className="flex gap-2">
                  <button onClick={acceptCookies} className="bg-[var(--accent)] text-[#0A0A0B] px-3 py-1 rounded-[6px] font-bold">accept</button>
                  <button onClick={declineCookie} className="border border-[var(--border-strong)] px-3 py-1 rounded-[6px] font-bold">decline</button>
                </div>
              </div>
            ))}
          </div>
        </PortalBox>
      )}

      <PortalBox>
        <div className="fixed top-2 left-2 z-[50] font-mono text-xs bg-black/70 text-[var(--accent)] px-2 py-1 rounded">
          time wasted: {clock}
        </div>
      </PortalBox>
      <PortalBox>
        <div className="fixed top-2 right-2 z-[50] font-mono text-[10px] bg-black text-[var(--text-2)] px-2 py-1 rounded border border-[var(--border-strong)] max-w-[38vw] md:max-w-[45vw] md:text-xs text-right">
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
                 className="bg-[var(--bg-1)] text-[var(--text-1)] px-4 py-3 rounded-[10px] border border-[var(--border-strong)] font-bold italic"
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
                 className="bg-zinc-900 text-white px-4 py-3 rounded-[10px] shadow-2xl border-b-2 border-[var(--accent)]"
              >
                <p className="text-[10px] uppercase tracking-widest text-[var(--accent)] font-bold">achievement unlocked</p>
                <p className="font-bold italic">{achieve.replace("achievement: ", "")}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </PortalBox>

      <PortalBox>
        {!audience && (<div className={`fixed bottom-4 right-4 ${adminOpen ? "z-[210]" : "z-[50]"} w-64 md:w-72 max-w-[70vw] touch-manipulation`}>
          {!chatOpen ? (
            <button
              onClick={() => setChatOpen(true)}
              className="ml-auto bg-[var(--accent)] text-[#0A0A0B] text-xs font-bold uppercase px-5 py-2 rounded-[6px] min-h-[44px] inline-flex items-center"
            >
              victims' chat
            </button>
          ) : (
            <div className={`chat-panel overflow-hidden ${comic}`}>
              <div className="chat-bar">
                <span className="chat-dot" /><span className="chat-dot" /><span className="chat-dot" />
                <span className="chat-title">TRANSMISSIONS</span>
              {displayName !== "" && (
                <div className="px-2 py-1 flex gap-1 items-center bg-[var(--bg-0)] border border-[var(--border-subtle)] rounded-[6px] text-xs min-w-0 shrink-0">
                  {isCustom ? (
                    <><span className="truncate">you are <b>{displayName}</b></span><button onClick={resetName} className="underline shrink-0">reset</button></>
                  ) : (
                    <><input value={nameInput} onChange={(e) => setNameInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { setName(nameInput); setNameInput(""); } }} placeholder="call yourself something" maxLength={30} className="w-24 bg-transparent text-xs p-1 outline-none" /><button onClick={() => { setName(nameInput); setNameInput(""); }} className="font-bold shrink-0">set</button></>
                  )}
                </div>
              )}
                {collapsed && unread > 0 && <span className="unread-badge">{unread} NEW</span>}
                <button onClick={() => setCollapsedPersist(!collapsed)} aria-label="collapse chat" className="collapse-btn shrink-0">{collapsed ? "[+]" : "[—]"}</button>
                <button onClick={() => setChatOpen(false)} aria-label="minimize chat" className="text-base font-black px-4 py-2 min-w-[44px] min-h-[44px] shrink-0 leading-none">_</button>
              </div>
              <div className={`chat-fold${collapsed ? " folded" : ""}`}><div className="chat-fold-inner">
              <div data-modal-scroll className="h-48 overflow-y-auto p-2 space-y-2 text-xs">
                {chatMsgs.map((m) => (
                  <motion.div key={m.k} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={cn("p-2 rounded-lg max-w-[90%]", m.me ? "chat-bubble-me" : "chat-bubble-them")}>
                    {!m.me && m.name !== "" && <p className={cn("chat-name", (m.name === displayName || !/ #\d$/.test(m.name || "")) ? "chat-name-pop" : "chat-name-dim")}>{m.name}</p>}
                    <p>{m.text}</p>
                    {m.at ? <p className="text-[10px] opacity-60 text-right text-[var(--text-3)]">{new Date(m.at).toLocaleTimeString()}</p> : null}
                  </motion.div>
                ))}
              </div>
              <div className="p-2 flex gap-1">
                <input
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendChat()}
                  placeholder={chatPh}
                  maxLength={200}
                  className="chat-input flex-1 min-w-0"
                />
                <button
                  onMouseEnter={() => { if (Math.random() < 0.1) { setChatPh("scream into the void"); setTimeout(() => setChatPh("ask anything..."), 3000); } }}
                  onClick={sendChat}
                  className="btn-send"
                >send</button>
              </div>
              </div>
              </div>
            </div>
          )}
        </div>
      )}
      </PortalBox>

      <div className="relative z-10 p-4 md:p-12 max-w-7xl mx-auto pt-12">

        <header className="pt-40 pb-24">
          <nav className="fixed top-0 left-0 right-0 h-14 z-[60] flex items-center justify-between px-4 md:px-8 border-b border-[var(--border-subtle)]" style={{ background: "rgba(10,10,11,0.9)", backdropFilter: "blur(12px)" }}>
            <button onClick={logoTap} className="font-terminal font-bold text-xs tracking-wider whitespace-nowrap">OPPOSITE.EXE<span className="blink text-[var(--accent)]">▮</span></button>
            <p className="mono-label text-[var(--text-2)] whitespace-nowrap"><span className="text-[var(--accent)] animate-pulse">●</span> {roomCount} ONLINE</p>
          </nav>
          <div data-tilt className="text-left">
            <p className="mono-label text-[var(--accent)] mb-6">{"//"} THE WORLD&apos;S LEAST USEFUL PLATFORM</p>
            <h1 className="t-display mb-6">Enterprise-grade <span className="text-[var(--accent)]">futility</span>, at scale.</h1>
            <p className="t-body mb-10 max-w-[52ch]">{heroSub}</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-start">
              <button
                onClick={() => {
                  setToast("just kidding. there's nothing to start.");
                  setTimeout(() => setToast(null), 3000);
                }}
                title="why would you do that" className="cta-primary"
              >
                start free
              </button>
              <button onClick={() => setChatOpen(true)} className="cta-secondary">
                talk to sales
              </button>
            </div>
          </div>
          <div className="mt-10 flex flex-wrap gap-8 md:gap-12">
            <div><p className="stats-num">{heroUsers.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p><p className="mono-label text-[var(--text-3)] mt-1">users (mostly countdown)</p></div>
            <div><p className="stats-num">3,482,901</p><p className="mono-label text-[var(--text-3)] mt-1">buttons clicked</p></div>
            <div><p className="stats-num">0</p><p className="mono-label text-[var(--text-3)] mt-1">purposes served</p></div>
          </div>
          <div className="ticker mt-10">
            <div className="inline-block animate-marquee-scroll">
              3,482,901 buttons clicked // 0 purposes served // 47-day vibes incident ongoing //&nbsp;
              3,482,901 buttons clicked // 0 purposes served // 47-day vibes incident ongoing //&nbsp;
            </div>
          </div>
        </header>

        <div className="feature-grid grid grid-cols-1 md:grid-cols-3 gap-6">

          <section style={gravStyle(0)} className="card p-8 transition-all duration-700">
            <h2 className="t-h2 mb-6">sign up</h2>
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
                <p className="mt-2 text-sm text-[var(--danger)] font-bold italic">{usernameMsg}</p>
              </div>
              <button
                onMouseEnter={handleRunawayBtnHover}
                onTouchStart={handleRunawayTouch}
                onClick={handleRunawayClick}
                className={cn(
                  "bg-[var(--accent)] text-[#0A0A0B] px-8 py-4 rounded-[6px] font-bold uppercase transition-all",
                  btnFixed ? "fixed z-50" : ""
                )}
                style={btnFixed ? { left: btnPos.x, top: btnPos.y } : {}}
              >
                Submit
              </button>
            </div>
          </section>

          <section style={gravStyle(1)} className="card p-8 space-y-8 transition-all duration-700">
            <h2 className="t-h2 mb-6">controls</h2>
            <div className="flex items-center justify-between p-4 bg-[var(--bg-1)] border border-[var(--border-subtle)] rounded-[10px]">
              <span className="font-bold">dark mode</span>
              <button onClick={() => setIsRainbow(!isRainbow)} className="w-12 h-6 bg-slate-700 rounded-full relative transition-colors">
                <div className={cn("absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-all", isRainbow ? "left-7 bg-yellow-400" : "")} />
              </button>
            </div>
            <div className="flex items-center justify-between p-4 bg-[var(--bg-1)] border border-[var(--border-subtle)] rounded-[10px]">
              <span className="font-bold">mute</span>
              <button onClick={playAirhorn} className="bg-[var(--danger)] text-[#0A0A0B] px-4 py-1 rounded-[6px] font-bold">OFF</button>
            </div>
            <div className="space-y-2">
              <span className="font-bold text-sm uppercase">Volume</span>
              <input type="range" className="w-full accent-[var(--accent)]" onChange={(e) => setFontSize(parseInt(e.target.value))} min="8" max="100" />
            </div>
          </section>

          <section style={gravStyle(2)} className="card p-8 transition-all duration-700">
            <h2 className="t-h2 mb-6">backwards thinking</h2>
            <input
              type="text"
              value={backwardsVal.split('').reverse().join('')}
              onChange={(e) => setBackwardsVal(e.target.value)}
              placeholder="type something..."
              className="w-full bg-slate-100 text-black p-4 rounded-lg font-bold outline-none"
            />
            <p className="mt-2 text-xs text-[var(--text-2)] italic">your thoughts are literally backwards</p>
          </section>

          <section style={gravStyle(3)} className="card p-8 transition-all duration-700">
            <h2 className="t-h2 mb-6">optimization</h2>
            <div className="bg-[var(--bg-1)] border border-[var(--border-subtle)] rounded-[10px] p-6 text-center space-y-4">
              <p className="text-sm font-bold italic">{loadMsg}</p>
              <div className="w-full h-6 bg-slate-700 rounded-full overflow-hidden border-2 border-black">
                <motion.div className="h-full bg-[var(--accent)]" animate={{ width: `${progress}%` }} />
              </div>
              {!loading && (
                <button onClick={startLoading} className="bg-[var(--accent)] text-[#0A0A0B] px-4 py-2 rounded-[6px] font-bold uppercase text-xs">
                  Start Optimization
                </button>
              )}
            </div>
          </section>
          <section style={gravStyle(4)} className="card p-8 transition-all duration-700">
            <h2 className="t-h2 mb-6">verify you&apos;re human</h2>
            <button onClick={handleCaptcha} className="flex items-center gap-3 bg-slate-100 text-black p-4 rounded-lg font-bold w-full">
              <span className={cn("w-6 h-6 border-4 border-black rounded flex items-center justify-center bg-white", captchaChecked && "bg-[var(--accent)]")}>
                {captchaChecked ? "\u2713" : ""}
              </span>
              i&apos;m not a robot
            </button>
            <p className="mt-2 text-sm text-[var(--danger)] font-bold italic">{captchaMsg}</p>
          </section>

          <section style={gravStyle(5)} className="card p-8 transition-all duration-700">
            <h2 className="t-h2 mb-6">free antivirus</h2>
            <div className="bg-[var(--bg-1)] border border-[var(--border-subtle)] rounded-[10px] p-6 text-center space-y-4">
              {!scanDone ? (
                <>
                  <div className="w-full h-6 bg-slate-700 rounded-full overflow-hidden border-2 border-black">
                    <motion.div className="h-full bg-[var(--danger)]" animate={{ width: `${scanProgress}%` }} />
                  </div>
                  {!scanning && (
                    <button onClick={startVirusScan} className="bg-[var(--danger)] text-[#0A0A0B] px-4 py-2 rounded-[6px] font-bold uppercase text-xs">
                      scan my device
                    </button>
                  )}
                  {scanning && <p className="text-xs font-bold italic">{virusMsg} {scanProgress}%</p>}
                </>
              ) : (
                <>
                  <p className="text-sm font-bold">3 threats found:</p>
                  <ul className="text-xs font-mono text-[var(--danger)] space-y-1">
                    {THREATS.map(t => <li key={t}>{t}</li>)}
                  </ul>
                  <button onClick={handleFixNow} className="bg-[var(--danger)] text-[#0A0A0B] px-4 py-2 rounded-[6px] font-bold uppercase text-xs">
                    fix now
                  </button>
                  {fixMsg && <p className="text-xs font-bold italic text-[var(--text-2)]">{fixMsg}</p>}
                </>
              )}
            </div>
          </section>

          <section style={gravStyle(6)} className="card p-8 transition-all duration-700">
            <h2 className="t-h2 mb-6">super secure password</h2>
            <input
              type="password"
              value={pw}
              onChange={handlePwChange}
              placeholder="hunter2"
              className="w-full bg-slate-100 text-black p-4 rounded-lg font-bold outline-none"
            />
            <div className="w-full h-3 bg-slate-700 rounded-full overflow-hidden mt-3">
              <div className="h-full bg-[var(--accent)] transition-all" style={{ width: `${Math.min(pw.length * 12, 100)}%` }} />
            </div>
            <p className="mt-2 text-sm text-[var(--danger)] font-bold italic">{pwMsg}</p>
          </section>

          <section style={gravStyle(7)} className="card p-8 transition-all duration-700">
            <h2 className="t-h2 mb-6">totally legit offer</h2>
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={handleVbucks}
              className="bg-[var(--bg-2)] border border-[var(--border-strong)] text-[var(--text-1)] px-8 py-4 rounded-[6px] font-bold uppercase animate-pulse"
            >
              {"\u{1F381}"} free vbucks {"\u{1F381}"}
            </motion.button>
            <p className="mt-3 text-xs text-[var(--text-2)] italic">no scam. trust.</p>
          </section>

          <section style={gravStyle(8)} className="card p-8 transition-all duration-700 space-y-6">
            <h2 className="text-2xl font-black uppercase italic">downloads</h2>
            <button onClick={downloadRam} className="w-full bg-[var(--accent)] text-[#0A0A0B] px-4 py-3 rounded-[6px] font-bold uppercase text-sm">
              download more ram (16gb, free)
            </button>
            <div>
              <button onClick={handleHonest} className="w-full bg-[var(--bg-2)] border border-[var(--border-strong)] text-[var(--text-1)] px-4 py-3 rounded-[6px] font-bold text-sm">
                this button does nothing
              </button>
              {honestMsg && <p className="mt-2 text-xs text-[var(--accent)] font-bold italic">{honestMsg}</p>}
            </div>
          </section>

          <section style={gravStyle(9)} className="card p-8 transition-all duration-700 space-y-4">
            <h2 className="text-2xl font-black uppercase italic">display nonsense</h2>
            <div className="flex items-center justify-between p-4 bg-[var(--bg-1)] border border-[var(--border-subtle)] rounded-[10px]">
              <span className="font-bold">gravity</span>
              <button onClick={() => { setGravity(g => !g); setToast(gravity ? "gravity restored. coward." : "whoops."); setTimeout(() => setToast(null), 3000); }} className="bg-[var(--bg-2)] border border-[var(--border-strong)] px-4 py-1 rounded-[6px] font-bold">
                {gravity ? "ON" : "OFF"}
              </button>
            </div>
            <div className="flex items-center justify-between p-4 bg-[var(--bg-1)] border border-[var(--border-subtle)] rounded-[10px]">
              <span className="font-bold">hd graphics</span>
              <button onClick={() => setCrt(c => !c)} className="bg-[var(--bg-2)] border border-[var(--border-strong)] px-4 py-1 rounded-[6px] font-bold">
                {crt ? "ON" : "OFF"}
              </button>
            </div>
            <div className="flex items-center justify-between p-4 bg-[var(--bg-1)] border border-[var(--border-subtle)] rounded-[10px]">
              <span className="font-bold">precision mode</span>
              <button onClick={() => setPrecision(p => !p)} className="bg-[var(--bg-2)] border border-[var(--border-strong)] px-4 py-1 rounded-[6px] font-bold">
                {precision ? "ON" : "OFF"}
              </button>
            </div>
            <div className="flex items-center justify-between p-4 bg-[var(--bg-1)] border border-[var(--border-subtle)] rounded-[10px]">
              <span className="font-bold">matrix (wake up.)</span>
              <button onClick={() => setMatrix(m => !m)} className="bg-[var(--bg-2)] border border-[var(--border-strong)] px-4 py-1 rounded-[6px] font-bold">
                {matrix ? "ON" : "OFF"}
              </button>
            </div>
          </section>

          <section style={gravStyle(10)} className="card p-8 transition-all duration-700">
            <h2 className="text-2xl font-black mb-4 uppercase italic">prove it again</h2>
            <p className="text-sm mb-3 font-bold">select all squares with a clown</p>
            <div className="grid grid-cols-3 gap-2">
              {imgGrid.map((e, i) => (
                <button key={e + "-" + i} onClick={handleImgPick} disabled={imgPassed} className="bg-slate-100 text-3xl p-3 rounded-lg">
                  {e}
                </button>
              ))}
            </div>
            <p className="mt-2 text-sm text-[var(--danger)] font-bold italic">{imgMsg}</p>
          </section>

          <section style={gravStyle(11)} className="card p-8 transition-all duration-700 space-y-3">
            <h2 className="text-2xl font-black uppercase italic">account stuff</h2>
            <button onClick={startUpdate} className="w-full bg-[var(--accent)] text-[#0A0A0B] px-4 py-3 rounded-[6px] font-bold uppercase text-sm">
              check for updates
            </button>
            <button onClick={() => { setTermsOpen(true); spy(codeNameRef.current + " opened the terms. bold strategy."); }} className="w-full bg-[var(--bg-2)] border border-[var(--border-strong)] text-[var(--text-1)] px-4 py-3 rounded-[6px] font-bold text-sm">
              read our terms (don&apos;t)
            </button>
            <button onClick={shareSite} className="w-full bg-[var(--bg-2)] border border-[var(--border-strong)] text-[var(--text-1)] px-4 py-3 rounded-[6px] font-bold uppercase text-sm">
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
                    className="bg-[var(--accent)] text-[#0A0A0B] text-2xl font-bold px-8 py-4 rounded-[6px] uppercase"
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
              <p className="text-sm font-bold italic text-[var(--accent)]">account deleted. there was no account. there never was.</p>
            )}
          </section>

          <section className="col-span-1 md:col-span-3">
            <Reveal>
            <h2 className="t-h2 mb-6">real reviews from real humans</h2>
            <Testimonials notify={notifyToast} />
            </Reveal>
          </section>

          <section className="col-span-1 md:col-span-3 card p-8">
            <h2 className="t-h2 mb-6">system status (trust us)</h2>
            <div className="space-y-2 text-sm font-bold">
              <div className="flex justify-between bg-[var(--bg-1)] border border-[var(--border-subtle)] rounded-[10px] p-3"><span>website</span><span className="text-[var(--accent)]">operational-ish</span></div>
              <div className="flex justify-between bg-[var(--bg-1)] border border-[var(--border-subtle)] rounded-[10px] p-3"><span>buttons</span><span className="text-[var(--accent)]">operational*</span></div>
              <div className="flex justify-between bg-[var(--bg-1)] border border-[var(--border-subtle)] rounded-[10px] p-3"><span>support chat</span><span className="text-[var(--accent)]">operational (there is none)</span></div>
              <div className="flex justify-between bg-[var(--bg-1)] border border-[var(--border-subtle)] rounded-[10px] p-3"><span>vibes</span><span className="text-[var(--text-2)]">degraded</span></div>
              <p className="text-xs italic text-[var(--text-3)]">* buttons work. just not for you. incident #47 open for 47 days: the vibes remain degraded. we have stopped asking.</p>
            </div>
          </section>
          <section className="card p-8 transition-all duration-700">
            <h2 className="t-h2 mb-6">frequently avoided questions</h2>
            <Faq notify={notifyToast} />
          </section>
          <section className="col-span-1 md:col-span-3">
            <Reveal>
            <h2 className="t-h2 mb-6">pricing (everyone pays nothing)</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="tier p-6 space-y-3">
                <p className="mono-label text-[var(--text-2)]">free</p>
                <p className="font-display text-4xl font-bold">$0</p>
                <p className="t-small italic">nothing. exactly what it says.</p>
                <ul className="t-mono space-y-1">
                  <li><span className="text-[var(--accent)]">✓</span> unlimited nothing</li>
                  <li><span className="text-[var(--accent)]">✓</span> zero support</li>
                  <li><span className="text-[var(--text-3)]">✗</span> features</li>
                </ul>
                <DodgeBuy label="buy free" notify={notifyToast} />
              </div>
              <div className="tier tier-featured p-6 space-y-3">
                <div className="tier-tag">most useless</div><p className="mono-label text-[var(--accent)]">pro {"\u2728"}</p>
                <p className="font-display text-4xl font-bold">$0/mo</p>
                <p className="t-small italic">nothing, but shinier.</p>
                <ul className="t-mono space-y-1">
                  <li><span className="text-[var(--accent)]">✓</span> everything in free</li>
                  <li><span className="text-[var(--accent)]">✓</span> shinier nothing</li>
                  <li><span className="text-[var(--text-3)]">✗</span> usefulness</li>
                </ul>
                <DodgeBuy label="buy pro" notify={notifyToast} />
              </div>
              <div className="tier p-6 space-y-3">
                <p className="mono-label text-[var(--text-2)]">enterprise</p>
                <p className="font-display text-4xl font-bold">call us</p>
                <p className="t-small italic">we won&apos;t answer.</p>
                <ul className="t-mono space-y-1">
                  <li><span className="text-[var(--accent)]">✓</span> a sales call</li>
                  <li><span className="text-[var(--text-3)]">✗</span> answers</li>
                  <li><span className="text-[var(--text-3)]">✗</span> refunds</li>
                </ul>
                <DodgeBuy label="call us" notify={notifyToast} />
              </div>
            </div>
            </Reveal>
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
            pacifist={pacifist}
            onTogglePacifist={() => { const v = !pacifist; setPacifist(v); pacifistRef.current = v; doJudgment(); }}
            onTypeText={(msg) => { typeForMe(msg); doJudgment(); }}
            onScrollPrison={() => { scrollPrison(); doJudgment(); }}
            onGag={onGag}
            onChaos={chaosLocal}
            notify={notifyJudged}
            speak={sayLoud}
          />
          <section className="col-span-1 md:col-span-3 pt-4">
            <Reveal>
            <h2 className="t-h2">never miss a disaster</h2>
            <div className="flex flex-col sm:flex-row gap-2">
              <input value={nlEmail} onChange={(e) => setNlEmail(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") subscribeNl(); }} placeholder="your@email.com (mistake)" className="flex-1 bg-slate-100 text-black p-3 rounded-lg font-bold outline-none min-w-0" />
              <button onClick={subscribeNl} className="bg-[var(--accent)] text-[#0A0A0B] px-6 py-3 rounded-[6px] font-bold uppercase text-sm">subscribe</button>
            </div>
            <div className="text-center">
              <button onMouseEnter={dodgeUnsub} onTouchStart={dodgeUnsub} onClick={() => { setToast("unsubscribe failed. there is no off the list."); setTimeout(() => setToast(null), 3000); }} className="text-xs underline opacity-60" style={unsubFixed ? { position: "fixed", left: unsubPos.x, top: unsubPos.y, zIndex: 60 } : {}}>unsubscribe</button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-6 border-t border-[var(--border-subtle)]">
              <div>
                <p className="mono-label text-[var(--text-3)] mb-3">product</p>
                <div className="flex flex-col gap-2 items-start">
                  <button onClick={deadLink} className="mono-label text-[var(--text-2)]">features</button>
                  <button onClick={deadLink} className="mono-label text-[var(--text-2)]">pricing</button>
                  <button onClick={() => setExitOpen(true)} className="mono-label text-[var(--text-2)]">exit (no)</button>
                </div>
              </div>
              <div>
                <p className="mono-label text-[var(--text-3)] mb-3">legal</p>
                <div className="flex flex-col gap-2 items-start">
                  <button onClick={() => setLegalMsg("you actually clicked this. wow.")} className="mono-label text-[var(--text-2)]">privacy</button>
                  <button onClick={() => setLegalMsg("you actually clicked this. wow.")} className="mono-label text-[var(--text-2)]">terms</button>
                  <button onClick={() => setLegalMsg("you actually clicked this. wow.")} className="mono-label text-[var(--text-2)]">cookies</button>
                </div>
              </div>
              <div>
                <p className="mono-label text-[var(--text-3)] mb-3">socials</p>
                <div className="flex flex-col gap-2 items-start">
                  <button onClick={deadLink} className="mono-label text-[var(--text-2)]">x</button>
                  <button onClick={deadLink} className="mono-label text-[var(--text-2)]">instagram</button>
                  <button onClick={deadLink} className="mono-label text-[var(--text-2)]">facebook</button>
                </div>
              </div>
              <div>
                <p className="mono-label text-[var(--text-3)] mb-3">contact</p>
                <div className="flex flex-col gap-2 items-start">
                  <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" target="_blank" rel="noreferrer" className="mono-label text-[var(--text-2)]">contact (definitely safe)</a>
                </div>
              </div>
            </div>
            <div className="overflow-hidden mt-10">
              <p className="giant-mark">OPPOSITE</p>
            </div>
            <p className="t-mono text-[var(--text-3)] mt-4">© 2026 OPPOSITE INDUSTRIES — VENTURE-BACKED, VISION-FREE</p>
            </Reveal>
          </section>
          {legalMsg && (
            <Modal comic={comic}>
                <div className="bg-[var(--bg-1)] rounded-[10px] border border-[var(--border-strong)] p-6 text-center">
                <p className="font-bold italic">{legalMsg}</p>
                <button onClick={() => setLegalMsg(null)} className="mt-4 bg-slate-600 px-4 py-2 rounded font-bold text-sm">close (rude)</button>
              </div>
            </Modal>
          )}
          <section className="col-span-1 md:col-span-2 flex flex-col items-center justify-center p-12 bg-red-900/20 rounded-3xl border-4 border-red-600 border-dashed">
            <h2 className="text-3xl font-black mb-8 uppercase italic text-red-500 animate-pulse">DO NOT PRESS</h2>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              data-no-flee
              onClick={handleRedButton}
              className="w-48 h-48 bg-[var(--danger)] rounded-full border-8 border-red-800 shadow-[0_20px_0_0_rgba(153,27,27,1)] active:shadow-none active:translate-y-4 transition-all flex items-center justify-center group"
            >
              <span className="text-white font-black text-2xl group-hover:scale-110 transition-transform">PRESS ME</span>
            </motion.button>
            <p className="mt-12 text-xs text-[var(--danger)] italic font-mono">serious warning: pressing this might cause extreme confusion</p>
            {godMode && <p className="mt-4 font-bold text-[var(--accent)] animate-pulse">GOD MODE ENGAGED</p>}
          </section>
          <section className="col-span-1 flex flex-col items-center justify-center p-8 bg-slate-800 rounded-3xl border-4 border-black space-y-4">
            <h2 className="t-h2">almost free money</h2>
            <p className="text-xs text-[var(--text-2)] italic">hold to confirm. definitely works.</p>
            <div className="w-full bg-slate-900 rounded-full h-6 overflow-hidden border-2 border-black">
              <div className="h-full bg-[var(--accent)] transition-all" style={{ width: Math.min(100, holdPct) + "%" }} />
            </div>
            <p className="font-mono font-bold text-[var(--accent)]">{Math.floor(Math.min(99, holdPct))}%</p>
            <button id="hold99" onPointerDown={holdStart} onPointerUp={holdStop} onPointerLeave={holdStop} onContextMenu={(e) => e.preventDefault()} className="bg-[var(--accent)] text-[#0A0A0B] px-8 py-4 rounded-[6px] font-bold uppercase select-none touch-none">hold to confirm</button>
          </section>

        </div>
      </div>
    </div>
  );
}

