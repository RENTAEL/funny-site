import { chromium } from "playwright";
const BASE = process.argv[2] || "http://localhost:3123";
const STREAMIUM = "https://streamium-cosmic.vercel.app";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const browser = await chromium.launch();
const ctx = await browser.newContext({ permissions: ["clipboard-read", "clipboard-write"] });
const admin = await ctx.newPage();
const V1 = await ctx.newPage();
const V2 = await ctx.newPage();
const res = [];
const mark = (n, ok, d) => { console.log((ok ? "PASS " : "FAIL ") + n + (d ? " — " + d : "")); res.push(ok); };
const errs = [];
for (const [tag, pg] of [["admin", admin], ["V1", V1], ["V2", V2]]) {
  pg.on("pageerror", (e) => errs.push(tag + ":" + String(e.message).slice(0, 100)));
  pg.on("console", (m) => { if (m.type() === "error") errs.push(tag + " console: " + m.text().slice(0, 100)); });
}
const dismissCookies = async (pg) => { try { await pg.getByRole("button", { name: "accept", exact: true }).first().click({ timeout: 3000 }); } catch (e) {} };
await V1.goto(BASE, { waitUntil: "domcontentloaded" });
await V2.goto(BASE, { waitUntil: "domcontentloaded" });
await admin.goto(BASE, { waitUntil: "domcontentloaded" });
await sleep(6000);
await dismissCookies(V1); await dismissCookies(V2); await dismissCookies(admin);
for (let i = 0; i < 6; i++) {
  await admin.keyboard.type("letmein");
  try { await admin.getByRole("button", { name: "copy debug report" }).waitFor({ timeout: 3000 }); break; } catch (e) {}
}
try { await admin.waitForFunction(() => document.body.innerText.includes("realtime: connected"), { timeout: 20000 }); mark("presence", true, "connected"); } catch (e) { mark("presence", false, "not connected"); }
const adminClean = async () => admin.evaluate(() => !document.querySelector(".invert") && !document.body.innerText.includes("LMAO_404") && !document.querySelector('[data-testid="adbreak-overlay"]') && window.location.href.includes("localhost"));
const gbtn = (name) => admin.locator('[data-testid="global-menu"] button', { hasText: name }).first();
const gclick = async (name) => { try { await gbtn(name).click({ timeout: 8000 }); return true; } catch (e) { return false; } };
try { await admin.waitForFunction(() => Array.from(document.querySelectorAll("button")).filter((e) => /#\d/.test(e.innerText || "") && !(e.innerText || "").includes("(you)")).length >= 2, { timeout: 30000 }); } catch (e) {}
for (const pg of [V1, V2]) { try { await pg.waitForFunction(() => window.__chaosReady === true, { timeout: 30000 }); } catch (e) {} }
mark("channels-warm", await V1.evaluate(() => window.__chaosReady === true).catch(() => false) && await V2.evaluate(() => window.__chaosReady === true).catch(() => false), "chaos subscribed");
const toastBoth = async (text) => {
  await admin.locator('[data-testid="global-toast"]').fill(text);
  await admin.locator('[data-testid="global-menu"] button', { hasText: "send" }).first().click();
  await sleep(1200);
  return await V1.evaluate((t) => document.body.innerText.includes(t), text) && await V2.evaluate((t) => document.body.innerText.includes(t), text);
};
let toastOk = await toastBoth("global-toast-PROBE");
if (!toastOk) { await sleep(3000); toastOk = await toastBoth("global-toast-PROBE"); }
if (!toastOk) { await sleep(5000); toastOk = await toastBoth("global-toast-PROBE"); }
mark("global-toast-both", toastOk, "lands both");
mark("admin-clean-toast", await adminClean(), "immune");
const a0 = await V1.evaluate(() => window.__chaosApplied || 0);
const last = await V1.evaluate(() => window.__chaosLast);
await V1.evaluate((p) => window.__chaosRefire(p), last);
await sleep(1200);
mark("dedupe-eats-double", (await V1.evaluate(() => window.__chaosApplied || 0)) === a0, "same id ignored");
await gbtn("invert").click();
await sleep(1500);
mark("global-invert-both", await V1.evaluate(() => !!document.querySelector(".invert")) && await V2.evaluate(() => !!document.querySelector(".invert")), "both inverted");
mark("admin-clean-invert", await adminClean(), "immune");
await sleep(10000);
await gbtn("bsod").click();
await sleep(1500);
mark("global-bsod-both", await V1.evaluate(() => document.body.innerText.includes("LMAO_404")) && await V2.evaluate(() => document.body.innerText.includes("LMAO_404")), "both bsod");
const bsodHref = await V1.evaluate(() => { const a = Array.from(document.querySelectorAll("a")).find((x) => (x.textContent || "").includes("streamium-cosmic")); return a ? a.href + "|" + (a.getAttribute("rel") || "") + "|" + (a.getAttribute("target") || "") : ""; });
mark("bsod-escape", bsodHref === STREAMIUM + "/|noopener|_blank" || bsodHref === STREAMIUM + "|noopener|_blank", bsodHref);
mark("admin-clean-bsod", await adminClean(), "immune");
await V1.mouse.click(700, 400); await V2.mouse.click(700, 400); await sleep(600);
const fleeSeen = { v1: false, v2: false };
for (let r = 0; r < 2 && !(fleeSeen.v1 && fleeSeen.v2); r++) {
  await gbtn("cursor").click();
  for (let w = 0; w < 10 && !(fleeSeen.v1 && fleeSeen.v2); w++) {
    await sleep(600);
    if (!fleeSeen.v1) fleeSeen.v1 = await V1.evaluate(() => document.body.innerText.includes("every button is scared"));
    if (!fleeSeen.v2) fleeSeen.v2 = await V2.evaluate(() => document.body.innerText.includes("every button is scared"));
  }
}
mark("global-cursor-both", fleeSeen.v1 && fleeSeen.v2, "both fleeing");
mark("admin-clean-cursor", await adminClean(), "immune");
await gbtn("adbreak").click();
await sleep(1500);
mark("adbreak-both", await V1.evaluate(() => !!document.querySelector('[data-testid="adbreak-overlay"]')) && await V2.evaluate(() => !!document.querySelector('[data-testid="adbreak-overlay"]')), "overlay both");
const adHref = await V1.evaluate(() => { const a = document.querySelector('[data-testid="adbreak-overlay"] a'); return a ? a.href + "|" + (a.getAttribute("rel") || "") : ""; });
mark("adbreak-link", adHref === STREAMIUM + "/|noopener" || adHref === STREAMIUM + "|noopener", adHref);
mark("adbreak-skip-locked", await V1.evaluate(() => !Array.from(document.querySelectorAll('[data-testid="adbreak-overlay"] button')).some((b) => ((b.textContent || "").includes("skip")))), "skip locked <3s");
await V1.screenshot({ path: "test/screenshots/global/adbreak-overlay.png" });
await sleep(2500);
await V1.locator('[data-testid="adbreak-overlay"] button').click();
await sleep(600);
mark("adbreak-skip", await V1.evaluate(() => !document.querySelector('[data-testid="adbreak-overlay"]')) && await V2.evaluate(() => !!document.querySelector('[data-testid="adbreak-overlay"]')), "V1 skipped, V2 persists");
await sleep(4000);
mark("adbreak-auto", await V2.evaluate(() => !document.querySelector('[data-testid="adbreak-overlay"]')), "V2 auto-dismissed");
mark("admin-clean-adbreak", await adminClean(), "immune");
await admin.screenshot({ path: "test/screenshots/global/arsenal-split.png" });
mark("gexile-click", await gclick("GLOBAL EXILE"), "button live");
const away = async (pg) => {
  for (let w = 0; w < 15; w++) {
    await sleep(1000);
    try { if (!(await pg.evaluate(() => window.location.href.includes("localhost")))) return true; } catch (e) {}
  }
  return false;
};
mark("gexile-both", await away(V1) && await away(V2), "everyone gets streamed");
mark("admin-clean-exile", await adminClean(), "immune");
await V1.goto(BASE, { waitUntil: "domcontentloaded" });
await V2.goto(BASE, { waitUntil: "domcontentloaded" });
await sleep(6000);
await dismissCookies(V1); await dismissCookies(V2);
const v1vid = await V1.evaluate(() => { try { return sessionStorage.getItem("opp_vid") || ""; } catch (e) { return ""; } });
const v1ref = v1vid.slice(0, 6);
mark("v1-identity", v1ref.length === 6, "ref=" + v1ref);
await V1.evaluate(() => {
  const x = Array.from(document.querySelectorAll("button")).find((q) => ((q.textContent || "").trim().toLowerCase() === "victims' chat"));
  if (x) x.click();
});
await sleep(800);
await V1.evaluate(() => {
  const x = Array.from(document.querySelectorAll("button")).find((q) => ((q.textContent || "").trim() === "OPPIE // RESIDENT AI"));
  if (x) x.click();
});
await sleep(800);
let nm = "";
for (let r = 0; r < 4 && !nm; r++) {
  try {
    if (!(await admin.evaluate(() => !!document.querySelector('[data-testid="remote-menu"]')))) {
      await admin.locator("button", { hasText: v1ref }).first().click({ timeout: 8000 });
      await sleep(800);
    }
    if (await admin.evaluate(() => !!document.querySelector('[data-testid="remote-menu"]'))) nm = v1ref;
    else await sleep(2000);
  } catch (e) { await sleep(2000); }
}
mark("lock-v1", nm !== "", "ref=" + nm);
await sleep(600);
const v2clean = async () => V2.evaluate(() => !document.querySelector(".invert") && !document.body.innerText.includes("LMAO_404") && window.location.href.includes("localhost"));
let tToastOk = false;
for (let r = 0; r < 3 && !tToastOk; r++) {
  await admin.locator("[data-testid=remote-toast]").fill("targeted-probe-1");
  await admin.locator("[data-testid=remote-menu] button", { hasText: "send" }).first().click();
  await sleep(1200);
  tToastOk = await V1.evaluate(() => document.body.innerText.includes("targeted-probe-1"));
}
mark("targeted-toast-v1", tToastOk && await V2.evaluate(() => !document.body.innerText.includes("targeted-probe-1")), "V1 only");
await admin.locator("[data-testid=remote-menu] button", { hasText: "invert" }).first().click();
await sleep(1500);
mark("targeted-invert", await V1.evaluate(() => !!document.querySelector(".invert")) && await v2clean(), "V1 only, V2 clean");
await admin.locator("[data-testid=remote-menu] button", { hasText: "bsod" }).first().click();
await sleep(1500);
mark("targeted-bsod", await V1.evaluate(() => document.body.innerText.includes("LMAO_404")) && await v2clean(), "V1 only, V2 clean");
await V1.mouse.click(700, 400); await sleep(400);
let tcurOk = false;
for (let r = 0; r < 3 && !tcurOk; r++) {
  await admin.locator("[data-testid=remote-menu] button", { hasText: "cursor" }).first().click();
  await sleep(1500);
  tcurOk = await V1.evaluate(() => document.body.innerText.includes("every button is scared"));
}
mark("targeted-cursor", tcurOk && await v2clean(), "V1 only, V2 clean");
await admin.locator("[data-testid=remote-menu] button", { hasText: "exile" }).first().click();
let exiled = false;
for (let w = 0; w < 12 && !exiled; w++) {
  await sleep(1000);
  try { exiled = (await V1.evaluate(() => window.location.href)).includes("/roast"); } catch (e) {}
}
mark("targeted-exile", exiled && await v2clean(), "V1 exiled, V2 clean");
await V1.goto(BASE, { waitUntil: "domcontentloaded" }); await sleep(5000);
await dismissCookies(V1);
await admin.waitForFunction(() => (document.body.innerText.match(/delivered ✓/g) || []).length >= 4, { timeout: 20000 }).catch(() => {});
mark("targeted-acks", await admin.evaluate(() => (document.body.innerText.match(/delivered ✓/g) || []).length >= 4), "acks received");
await admin.screenshot({ path: "test/screenshots/global/usefulness-admin.png" });
for (const pg of [V1, V2]) {
  await pg.evaluate(() => {
    const x = Array.from(document.querySelectorAll("button")).find((q) => ((q.textContent || "").trim().toLowerCase() === "victims' chat"));
    if (x) x.click();
  });
  await sleep(800);
}
await V1.locator('input[placeholder="ask anything..."]').fill("/streamium");
await sleep(500);
await V1.keyboard.press("Enter");
await sleep(3000);
mark("streamium-both", await V1.evaluate(() => document.body.innerText.includes("OPPOSITE BOT")) && await V2.evaluate(() => document.body.innerText.includes("OPPOSITE BOT")), "bot in both feeds");
mark("streamium-link", await V1.evaluate((s) => { const a = Array.from(document.querySelectorAll("a")).find((x) => (x.textContent || "").includes("streamium-cosmic")); return !!a && (a.href === s + "/" || a.href === s); }, STREAMIUM), "clickable href");
await V1.locator('input[placeholder="ask anything..."]').fill("/streamium");
await sleep(500);
await V1.keyboard.press("Enter");
await sleep(2000);
mark("streamium-ratelimit", await V1.evaluate(() => (document.body.innerText.match(/OPPOSITE BOT/g) || []).length <= 2), "second blocked in 30s");
let shotOk = false;
for (let r = 0; r < 3 && !shotOk; r++) {
  await admin.locator('[data-testid="global-toast"]').fill("escape-shot");
  await admin.locator('[data-testid="global-menu"] button', { hasText: "send" }).first().click();
  try { await V1.waitForFunction(() => document.body.innerText.includes("escape-shot"), { timeout: 4000 }); } catch (e) {}
  await sleep(700);
  shotOk = await V1.evaluate(() => document.body.innerText.includes("escape-shot"));
  if (shotOk) {
    const diag = await V1.evaluate(() => ({ invert: !!document.querySelector(".invert"), toast: (document.body.innerText.match(/escape-shot/) || []).length }));
    console.log("escape-diag: " + JSON.stringify(diag));
    await V1.screenshot({ path: "test/screenshots/global/escape-toast.png" });
    mark("toast-escape-link", await V1.evaluate((s) => { const a = Array.from(document.querySelectorAll("a")).find((x) => (x.textContent || "").includes("escape to something")); return !!a && (a.href === s + "/" || a.href === s) && a.getAttribute("rel") === "noopener" && a.getAttribute("target") === "_blank"; }, STREAMIUM), "href+rel+target");
  }
}
mark("toast-escape-shot", shotOk, "toast visible in shot");
if (!shotOk) mark("toast-escape-link", false, "no toast to inspect");
const copyRep = async () => {
  try {
    await admin.getByRole("button", { name: "copy usefulness report" }).click();
    await sleep(800);
    return JSON.parse(await admin.evaluate(() => navigator.clipboard.readText().catch(() => "")));
  } catch (e) { return {}; }
};
const gf = async () => { const r = await copyRep(); return typeof r.globalFired === "number" ? r.globalFired : -1; };
const gf0 = await gf();
await gbtn("invert").click(); await sleep(500);
const gf1 = await gf();
await gbtn("cursor").click(); await sleep(500);
const gf2 = await gf();
await admin.locator('[data-testid="global-toast"]').fill("count-check");
await admin.locator('[data-testid="global-menu"] button', { hasText: "send" }).first().click();
await sleep(1500);
const rep = await copyRep();
const gf3 = typeof rep.globalFired === "number" ? rep.globalFired : -1;
mark("report-counts", gf0 >= 0 && gf1 === gf0 + 1 && gf2 === gf1 + 1 && gf3 === gf2 + 1, gf0 + "→" + gf1 + "→" + gf2 + "→" + gf3);
mark("report-parses", typeof rep.globalFired === "number", "clipboard json");
mark("report-truth", gf3 - gf0 === 3, "delta=" + (gf3 - gf0));
mark("report-oppie", rep.oppie_messages_served !== undefined && rep.oppie_meltdowns_triggered !== undefined, "oppie keys present");
await V1.evaluate(() => {
  const x = Array.from(document.querySelectorAll("button")).find((q) => ((q.textContent || "").trim().toLowerCase() === "victims' chat"));
  if (x) x.click();
});
await sleep(600);
await V1.screenshot({ path: "test/screenshots/global/escape-toast.png" });
const ob = await V1.evaluate(() => document.querySelectorAll(".oppie-msg").length);
await gbtn("invert").click();
let reacted = false;
try { await V1.waitForFunction((b) => document.querySelectorAll(".oppie-msg").length > b, ob, { timeout: 10000 }); reacted = true; } catch (e) {}
mark("oppie-global-reaction", reacted, "that was me...");
await V2.screenshot({ path: "test/screenshots/global/usefulness-report.png", fullPage: true });
console.log("errors: " + JSON.stringify(errs));
await browser.close();
console.log("global-done " + res.filter(Boolean).length + "/" + res.length);
