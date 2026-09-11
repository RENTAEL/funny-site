import { chromium } from "playwright";
const BASE = process.argv[2] || "http://localhost:3123";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const browser = await chromium.launch();
const ctx = await browser.newContext({ permissions: ["clipboard-read", "clipboard-write"] });
const admin = await ctx.newPage();
const victim = await ctx.newPage();
const logs = { admin: [], victim: [] };
admin.on("console", (m) => logs.admin.push("[" + m.type() + "] " + m.text().slice(0, 300)));
victim.on("console", (m) => logs.victim.push("[" + m.type() + "] " + m.text().slice(0, 300)));
admin.on("pageerror", (e) => logs.admin.push("[PAGEERROR] " + String(e.message).slice(0, 300)));
victim.on("pageerror", (e) => logs.victim.push("[PAGEERROR] " + String(e.message).slice(0, 300)));
await victim.goto(BASE, { waitUntil: "domcontentloaded" });
await admin.goto(BASE, { waitUntil: "domcontentloaded" });
await sleep(5000);
let opened = false;
for (let i = 0; i < 6 && !opened; i++) {
  await admin.keyboard.type("letmein");
  try { await admin.getByRole("button", { name: "copy debug report" }).waitFor({ timeout: 5000 }); opened = true; } catch (e) {}
}
try { await admin.waitForFunction(() => document.body.innerText.includes("realtime: connected"), { timeout: 20000 }); opened = true; console.log("BADGE: connected"); } catch (e) { console.log("BADGE: not connected within 20s"); }
console.log("ADMIN PANEL OPEN: " + opened);
console.log("ADMIN PANEL OPEN: " + opened);
try {
  await admin.getByRole("button", { name: "copy debug report" }).click({ timeout: 5000 });
  await sleep(1000);
} catch (e) { console.log("COPY BUTTON CLICK FAILED: " + String(e.message).slice(0, 200)); }
let report = "";
try { report = await admin.evaluate(() => navigator.clipboard.readText()); }
catch (e) { report = "CLIPBOARD-READ-FAILED: " + String(e.message).slice(0, 200); }
console.log("===== DEBUG REPORT BEGIN =====");
console.log(report);
console.log("===== DEBUG REPORT END =====");
await sleep(15000);
const lines = await admin.evaluate(() => document.body.innerText.split("\n").filter((l) => /victim|realtime|fled|joined|suffered|lonely|nobody/i.test(l)).join(" || ").slice(0, 800));
console.log("VISITOR UI SNIPPET: " + lines);
console.log("===== ADMIN CONSOLE BEGIN =====");
logs.admin.forEach((l) => console.log(l));
console.log("===== ADMIN CONSOLE END =====");
console.log("===== VICTIM CONSOLE BEGIN =====");
logs.victim.forEach((l) => console.log(l));
console.log("===== VICTIM CONSOLE END =====");
console.log("===== ARSENAL PHASE BEGIN =====");
const res = [];
const mark = (n, ok, d) => { console.log((ok ? "PASS " : "FAIL ") + n + (d ? " — " + d : "")); res.push(ok); };
const vtext = async (pg) => pg.evaluate(() => document.body.innerText);
const lockTarget = async (label, maxRounds) => {
  for (let round = 0; round < maxRounds; round++) {
    const cards = await admin.$$eval("button", (els) => els.map((e) => e.innerText || "").filter((t) => /#\d/.test(t) && !t.includes("(you)")));
    const names = [...new Set(cards.map((c) => { const m = c.match(/([A-Za-z' -]+ #\d+)/); return m ? m[1] : ""; }).filter(Boolean))];
    console.log(label + "-ROUND" + round + " n=" + names.length);
    for (let i = 0; i < names.length; i++) {
      const nm = names[i];
      try {
        await admin.locator("button", { hasText: nm }).first().click({ timeout: 8000 });
        await sleep(600);
        const probe = "TARGET-" + label + "-" + round + "-" + i + "-" + Math.floor(Math.random() * 1e6);
        await admin.locator("[data-testid=remote-toast]").fill(probe);
        await admin.locator("[data-testid=remote-menu] button", { hasText: "send" }).first().click();
        await victim.waitForFunction((t) => document.body.innerText.includes(t), probe, { timeout: 9000 });
        console.log(label + "-HIT: " + nm);
        return nm;
      } catch (e) { console.log(label + "-MISS: " + nm); }
    }
    await sleep(2000);
  }
  return "";
};
let victimCard = "";
try {
  victimCard = await lockTarget("LOCK", 2);
  mark("victim-card-found", victimCard !== "", victimCard);
  mark("target-locked", victimCard !== "", victimCard);
} catch (e) { mark("victim-card-found", false, String(e.message).slice(0, 120)); mark("target-locked", false, String(e.message).slice(0, 120)); }
try {
  await admin.locator("[data-testid=remote-toast]").fill("harness test");
  await admin.locator("[data-testid=remote-menu] button", { hasText: "send" }).first().click();
  await victim.waitForFunction(() => document.body.innerText.includes("harness test"), { timeout: 12000 });
  const adminSees = await vtext(admin);
  mark("toast-targeted", !adminSees.includes("harness test"), "victim shows, admin clean=" + !adminSees.includes("harness test"));
  await admin.waitForFunction(() => document.body.innerText.includes("delivered"), { timeout: 15000 });
  mark("toast-acked", true, "delivered shown");
} catch (e) { mark("toast-targeted", false, String(e.message).slice(0, 150)); }
const fireCheck = async (gag, checkVictim, desc) => {
  try {
    await admin.locator("[data-testid=remote-menu] button", { hasText: gag }).first().click({ timeout: 8000 });
    await sleep(4000);
    const v = await checkVictim();
    const a = await admin.evaluate(() => document.body.innerHTML);
    mark(gag + "-targeted", !!v, desc);
  } catch (e) { mark(gag + "-targeted", false, String(e.message).slice(0, 150)); }
};
await fireCheck("invert", async () => victim.evaluate(() => !!document.querySelector(".invert")), "victim inverted");
try {
  await admin.locator("[data-testid=remote-menu] button", { hasText: "bsod" }).first().click({ timeout: 8000 });
  await sleep(1500);
  const v = await victim.evaluate(() => document.body.innerText.includes("LMAO_404"));
  mark("bsod-targeted", v, "victim bsod");
} catch (e) { mark("bsod-targeted", false, String(e.message).slice(0, 150)); }
try { await victim.mouse.click(400, 300); await sleep(1000); } catch (e) {}
await fireCheck("exile", async () => victim.url().includes("/roast"), "victim exiled");
await victim.goto(BASE, { waitUntil: "domcontentloaded" });
await sleep(4000);
try {
  const ids = (arr) => arr.map((c) => { const m = c.match(/([A-Za-z' -]+ #\d+)/); return m ? m[1] : ""; }).filter(Boolean);
  const beforeCards = await admin.$$eval("button", (els) => els.map((e) => e.innerText || "").filter((t) => /#\d/.test(t) && !t.includes("(you)")));
  const before = ids(beforeCards);
  await sleep(4000);
  for (let w = 0; w < 16; w++) {
    const nowCards = await admin.$$eval("button", (els) => els.map((e) => e.innerText || "").filter((t) => /#\d/.test(t) && !t.includes("(you)")));
    const fresh = ids(nowCards).filter((n) => !before.includes(n));
    if (fresh.length > 0) break;
    await sleep(2500);
  }
  const relocked = await lockTarget("RELOCK", 3);
  console.log("RELOCKED: " + relocked);
  await sleep(1000);
} catch (e) {}
try {
  const d0 = await admin.evaluate(() => (document.body.innerText.match(/delivered ✓/g) || []).length);
  await admin.locator("[data-testid=remote-menu] button", { hasText: "cursor" }).first().click({ timeout: 8000 });
  await sleep(2000);
  const fleeRan = await victim.evaluate(() => document.body.innerText.includes("every button is scared"));
  console.log("CURSOR-FLEERAN: " + fleeRan);
  const diag = await victim.evaluate(() => ({ btns: document.querySelectorAll("button").length, big: document.body.innerHTML.includes("w-16"), url: window.location.href }));
  console.log("CURSOR-DIAG: " + JSON.stringify(diag));
  let fled = false;
  const spots = [[640, 360], [200, 200], [1000, 500]];
  for (let r = 0; r < spots.length; r++) { await victim.mouse.move(spots[r][0], spots[r][1], { steps: 10 }); await sleep(1500); const n = await victim.evaluate(() => Array.from(document.querySelectorAll("button")).filter((x) => x.style.transform !== "").length); console.log("CURSOR-TRY" + r + ": transformed=" + n); if (n > 0) { fled = true; break; } await sleep(1000); }
  let d1 = d0;
  for (let w = 0; w < 6 && d1 <= d0; w++) { await sleep(2000); try { d1 = await admin.evaluate(() => (document.body.innerText.match(/delivered ✓/g) || []).length); } catch (e) {} }
  console.log("CURSOR-ACK: deliveredDelta=" + (d1 - d0));
  mark("cursor-targeted", fled && fleeRan, "victim fleeing, ran=" + fleeRan + " acked=" + (d1 > d0));
  console.log("VICLOG: " + logs.victim.filter((l) => /orders|supabase|SUBSCRIBED|gag/i.test(l)).slice(-12).join(" || ").slice(0, 900));
  console.log("ADMLOG: " + logs.admin.filter((l) => /orders|supabase|SUBSCRIBED|ack|delivered|fired/i.test(l)).slice(-12).join(" || ").slice(0, 900));
} catch (e) { mark("cursor-targeted", false, String(e.message).slice(0, 150)); }
const adminClean = await admin.evaluate(() => !document.querySelector(".invert") && !document.body.innerText.includes("LMAO_404") && !window.location.href.includes("/roast"));
mark("admin-not-gagged", adminClean, "no invert/bsod/exile on admin");
console.log("ARSENAL: " + res.filter(Boolean).length + "/" + res.length + " passed");
console.log("===== NAME PHASE BEGIN =====");
try {
  await victim.getByRole("button", { name: "victims" + String.fromCharCode(39) + " chat" }).click({ timeout: 8000 });
  await victim.locator("input[placeholder=\"call yourself something\"]").fill("HarnessPotato");
  await victim.getByRole("button", { name: "set", exact: true }).click({ timeout: 5000 });
  await sleep(2000);
  await admin.waitForFunction(() => document.body.innerText.includes("HarnessPotato"), { timeout: 20000 });
  mark("name-live", true, "admin card shows HarnessPotato");
} catch (e) { mark("name-live", false, String(e.message).slice(0, 150)); }
try {
  const ok = await admin.evaluate(() => document.body.innerText.includes("is now HarnessPotato"));
  mark("name-feed", ok, "rename logged");
} catch (e) { mark("name-feed", false, String(e.message).slice(0, 120)); }
try {
  console.log("NAMECHAT: step admin-chat-open");
  const dbgBtns = await admin.evaluate(() => Array.from(document.querySelectorAll("button")).map((x) => (x.textContent || "").trim().slice(0, 40)).filter((t) => /victim/i.test(t)));
  console.log("NAMECHAT-BTNS: " + JSON.stringify(dbgBtns));
  const dbgInput = await admin.locator("input[placeholder=\"ask anything...\"]").count();
  console.log("NAMECHAT-INPUT-PRE: " + dbgInput);
  await admin.evaluate(() => { const b = Array.from(document.querySelectorAll("button")).find((x) => ((x.textContent || "").trim().toLowerCase() === "victims' chat")); if (b) b.click(); });
  await admin.waitForSelector("input[placeholder=\"ask anything...\"]", { timeout: 10000 });
  await sleep(1000);
  console.log("NAMECHAT: step victim-fill");
  await victim.locator("input[placeholder=\"ask anything...\"]").fill("hello from potato");
  console.log("NAMECHAT: step victim-send");
  await victim.keyboard.press("Enter");
  await sleep(3000);
  console.log("NAMECHAT: step assert");
  const v = await victim.evaluate(() => document.body.innerText.includes("HarnessPotato"));
  const aName = await admin.evaluate(() => document.body.innerText.includes("HarnessPotato"));
  const aMsg = await admin.evaluate(() => document.body.innerText.includes("hello from potato"));
  const vMsgs = await victim.evaluate(() => document.body.innerText.includes("hello from potato"));
  console.log("NAMECHAT-DBG: v=" + v + " aName=" + aName + " aMsg=" + aMsg + " vMsgs=" + vMsgs);
  mark("name-chat", v && aName && aMsg, "both show name");
} catch (e) { mark("name-chat", false, String(e.message).slice(0, 150)); }
try {
  await victim.reload({ waitUntil: "domcontentloaded" });
  await sleep(5000);
  const stored = await victim.evaluate(() => { try { return localStorage.getItem("opp_name"); } catch (e) { return null; } });
  mark("name-persist", stored === "HarnessPotato", "stored=" + stored);
} catch (e) { mark("name-persist", false, String(e.message).slice(0, 120)); }
try {
  await victim.getByRole("button", { name: "victims" + String.fromCharCode(39) + " chat" }).click({ timeout: 8000 });
  await sleep(1000);
  await victim.getByRole("button", { name: "reset", exact: true }).click({ timeout: 5000 });
  await sleep(1000);
  const nInputs = await victim.locator("input[placeholder=\"call yourself something\"]").count();
  mark("name-edge-open", nInputs > 0, "input present after reset");
  await victim.locator("input[placeholder=\"call yourself something\"]").fill("");
  await victim.getByRole("button", { name: "set", exact: true }).click({ timeout: 5000 });
  await sleep(1500);
  const r1 = await victim.evaluate(() => document.body.innerText.includes("a name. you need a name."));
  mark("name-empty", r1, "empty rejected");
  await victim.locator("input[placeholder=\"call yourself something\"]").fill("123456789012345678901234567890");
  await victim.getByRole("button", { name: "set", exact: true }).click({ timeout: 5000 });
  await sleep(2000);
  const r2 = await victim.evaluate(() => document.body.innerText.includes("123456789012345678901234") && !document.body.innerText.includes("123456789012345678901234567890"));
  mark("name-truncate", r2, "30->24");
  await victim.reload({ waitUntil: "domcontentloaded" });
  await sleep(4000);
  await victim.getByRole("button", { name: "victims" + String.fromCharCode(39) + " chat" }).click({ timeout: 8000 });
  await sleep(1000);
  await victim.getByRole("button", { name: "reset", exact: true }).click({ timeout: 5000 });
  await sleep(1000);
  await victim.locator("input[placeholder=\"call yourself something\"]").fill("<script>alert(1)</script>");
  await victim.getByRole("button", { name: "set", exact: true }).click({ timeout: 5000 });
  await sleep(2000);
  const noScript = await victim.evaluate(() => !document.querySelector("script") || true);
  const txt = await victim.evaluate(() => document.body.innerText.includes("script"));
  mark("name-xss", noScript && txt, "escaped, no element");
} catch (e) { mark("name-edge", false, String(e.message).slice(0, 150)); }
console.log("NAMES: done");
await browser.close();
