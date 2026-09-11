import { chromium } from "playwright";
const BASE = process.argv[2] || "http://localhost:3123";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const browser = await chromium.launch();
const res = [];
const mark = (n, ok, d) => { console.log((ok ? "PASS " : "FAIL ") + n + (d ? " — " + d : "")); res.push(ok); };
for (const vp of [{ w: 1440, h: 900 }, { w: 390, h: 844 }]) {
  const ctx = await browser.newContext({ viewport: { width: vp.w, height: vp.h }, hasTouch: true, isMobile: vp.w < 500 });
  const p = await ctx.newPage();
  const errs = [];
  p.on("pageerror", (e) => errs.push(String(e.message).slice(0, 100)));
  await p.goto(BASE, { waitUntil: "domcontentloaded" });
  await sleep(5000);
  try { await p.getByRole("button", { name: "accept", exact: true }).first().click({ timeout: 3000 }); } catch (e) {}
  await sleep(500);
  await p.evaluate(() => {
    const x = Array.from(document.querySelectorAll("button")).find((q) => ((q.textContent || "").trim().toLowerCase() === "victims' chat"));
    if (x) x.click();
  });
  await p.waitForSelector('input[placeholder="ask anything..."]', { timeout: 10000 });
  const geom = await p.evaluate((vw) => {
    const out = {};
    for (const label of ["collapse chat", "minimize chat"]) {
      const x = Array.from(document.querySelectorAll("button")).find((q) => q.getAttribute("aria-label") === label);
      if (!x) { out[label] = "missing"; continue; }
      const q = x.getBoundingClientRect();
      const el = document.elementFromPoint(q.x + q.width / 2, q.y + q.height / 2);
      out[label] = Math.round(q.width) + "x" + Math.round(q.height) + " rightEdge=" + Math.round(q.x + q.width) + "/" + vw + " top=" + (el === x);
    }
    return out;
  }, vp.w);
  console.log(vp.w + "px geometry: " + JSON.stringify(geom));
  mark("toggles-visible-" + vp.w, Object.values(geom).every((g) => typeof g === "string" && g.includes("top=true") && !g.includes("missing")), JSON.stringify(geom));
  await p.getByRole("button", { name: "collapse chat" }).click();
  await sleep(700);
  mark("toggle-collapses-" + vp.w, await p.evaluate(() => !!document.querySelector(".chat-fold.folded")), "folds");
  await p.getByRole("button", { name: "collapse chat" }).click();
  await sleep(700);
  mark("toggle-expands-" + vp.w, await p.evaluate(() => !document.querySelector(".chat-fold.folded")), "unfolds");
  await p.getByRole("button", { name: "minimize chat" }).click();
  await sleep(700);
  mark("minimize-pill-" + vp.w, await p.evaluate(() => Array.from(document.querySelectorAll("button")).some((q) => ((q.textContent || "").trim().toLowerCase() === "victims' chat"))), "pill back");
  mark("no-errors-" + vp.w, errs.length === 0, JSON.stringify(errs));
  await ctx.close();
}
await browser.close();
console.log("chat-toggle-done " + res.filter(Boolean).length + "/" + res.length);
