import { chromium } from "playwright";
const BASE = process.argv[2] || "http://localhost:3123";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const browser = await chromium.launch();
const res = [];
const mark = (n, ok, d) => { console.log((ok ? "PASS " : "FAIL ") + n + (d ? " — " + d : "")); res.push(ok); };
const errs = [];
const html = await (await browser.newContext()).request.get(BASE).then((r) => r.text()).catch(() => "");
mark("ssr-counter", !html.includes("IT'S JUST YOU") && !html.includes("#000001"), "client-only via PortalBox, absent server-side");
mark("ssr-timer", !html.includes("time wasted: 0:0"), "client-only via PortalBox, absent server-side");
for (const vp of [{ w: 375, h: 812 }, { w: 1440, h: 900 }]) {
  const ctx = await browser.newContext({ viewport: { width: vp.w, height: vp.h }, hasTouch: vp.w < 500, isMobile: vp.w < 500 });
  const p = await ctx.newPage();
  p.on("pageerror", (e) => errs.push(vp.w + ":" + String(e.message).slice(0, 100)));
  p.on("console", (m) => { if (m.type() === "error") errs.push(vp.w + " console: " + m.text().slice(0, 100)); });
  await p.goto(BASE, { waitUntil: "domcontentloaded" });
  await sleep(5000);
  try { await p.getByRole("button", { name: "accept", exact: true }).first().click({ timeout: 3000 }); } catch (e) {}
  await sleep(500);
  mark("counter-copy-" + vp.w, await p.evaluate(() => document.body.innerText.includes("IT'S JUST YOU") && document.body.innerText.includes("#000001")), "copy live");
  mark("counter-oneline-" + vp.w, await p.evaluate(() => {
    const el = Array.from(document.querySelectorAll("div")).find((x) => ((x.textContent || "").trim().startsWith("VISITOR #")));
    if (!el || el.getClientRects().length !== 1) return false;
    el.setAttribute("data-overflow-px", String(Math.max(0, el.scrollWidth - el.clientWidth)));
    return getComputedStyle(el).textOverflow === "ellipsis";
  }), "one line, ellipsis armed");
  const hits = await p.evaluate(() => {
    const find = (fn) => {
      const el = fn();
      if (!el) return null;
      const q = el.getBoundingClientRect();
      return { x: q.x, y: q.y, w: q.width, h: q.height };
    };
    const timer = find(() => Array.from(document.querySelectorAll("div")).find((x) => ((x.textContent || "").trim().startsWith("time wasted:"))));
    const box = (r) => ({ x: r.x, y: r.y, w: r.width, h: r.height });
    const nav = find(() => document.querySelector("nav"));
    const hero = find(() => document.querySelector("h1"));
    const oppie = find(() => Array.from(document.querySelectorAll("button")).find((x) => ((x.textContent || "").includes("OPPIE // RESIDENT AI")) || document.querySelector(".oppie-window")));
    const chat = find(() => Array.from(document.querySelectorAll("button")).find((x) => ((x.textContent || "").trim().toLowerCase() === "victims' chat")) || document.querySelector(".chat-panel"));
    const cookie = find(() => { const b = Array.from(document.querySelectorAll("button")).find((x) => x.textContent === "decline"); return b ? b.closest("div.fixed") || b : null; });
    return { timer, nav, hero, oppie, chat, cookie };
  });
  const overlap = (a, b) => a && b && a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h;
  const others = ["nav", "hero", "oppie", "chat"].map((k) => [k, hits[k]]);
  const bad = others.filter(([, r]) => overlap(hits.timer, r)).map(([k]) => k);
  mark("timer-clear-" + vp.w, !!hits.timer && bad.length === 0, bad.length ? "hits " + bad.join(",") : "clear");
  mark("timer-readable-" + vp.w, !!hits.timer && hits.timer.w > 40 && hits.timer.h > 12, JSON.stringify(hits.timer));
  await p.screenshot({ path: "test/screenshots/microfix/timer-" + vp.w + ".png" });
  await ctx.close();
}
console.log("errors: " + JSON.stringify(errs));
await browser.close();
console.log("microfix-done " + res.filter(Boolean).length + "/" + res.length);
