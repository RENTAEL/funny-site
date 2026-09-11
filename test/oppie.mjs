import { chromium } from "playwright";
const BASE = process.argv[2] || "http://localhost:3123";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const res = [];
const mark = (n, ok, d) => { console.log((ok ? "PASS " : "FAIL ") + n + (d ? " — " + d : "")); res.push(ok); };
const errs = [];
const apiRes = await fetch(BASE + "/api/oppie", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ message: "what is the best website", name: "HarnessPotato", history: [] }) }).then((r) => r.json()).catch(() => ({}));
mark("api-reply", typeof apiRes.reply === "string" && apiRes.reply.length > 10 && apiRes.reply.length <= 300 && typeof apiRes.source === "string", "source=" + apiRes.source);
mark("api-character", !/as an AI language model|I am Meta AI|I cannot|I can't help/i.test(apiRes.reply || "X"), "in character");
const cannedRes = await fetch(BASE + "/api/oppie", { method: "POST", headers: { "Content-Type": "application/json", "x-oppie-test": "force-canned" }, body: JSON.stringify({ message: "hello", name: "x", history: [] }) }).then((r) => r.json()).catch(() => ({}));
mark("api-canned", cannedRes.source === "canned" && (cannedRes.reply || "").length > 10, "forced canned works");
const browser = await chromium.launch();
const ctx = await browser.newContext({ permissions: ["clipboard-read", "clipboard-write"] });
await ctx.addInitScript(() => { window.__oppieAmbientMs = 1500; });
const A = await ctx.newPage();
A.on("pageerror", (e) => errs.push("A:" + String(e.message).slice(0, 100)));
A.on("dialog", (d) => errs.push("A dialog: " + String(d.message()).slice(0, 60)));
A.on("console", (m) => { if (m.type() === "error") errs.push("A console: " + m.text().slice(0, 100)); });
await A.goto(BASE, { waitUntil: "domcontentloaded" });
await sleep(5000);
try { await A.getByRole("button", { name: "accept", exact: true }).first().click({ timeout: 3000 }); } catch (e) {}
await sleep(500);
await A.evaluate(() => { try { localStorage.clear(); } catch (e) {} });
await A.reload({ waitUntil: "domcontentloaded" });
await sleep(5000);
try { await A.getByRole("button", { name: "accept", exact: true }).first().click({ timeout: 3000 }); } catch (e) {}
await sleep(500);
mark("pill-renders", await A.evaluate(() => document.body.innerText.includes("OPPIE // RESIDENT AI")), "collapsed placeholder");
await A.getByRole("button", { name: "open oppie" }).click();
await sleep(800);
mark("greeting", await A.evaluate(() => document.body.innerText.includes("resident intelligence")), "greets by name-less stray");
await A.locator('input[aria-label="ask oppie"]').fill("is this site useful?");
await A.keyboard.press("Enter");
await sleep(500);
mark("typing", await A.evaluate(() => document.body.innerText.includes("judging you")), "typing indicator");
try { await A.waitForFunction(() => !document.querySelector(".oppie-typing"), { timeout: 25000 }); } catch (e) {}
mark("reply-renders", await A.evaluate(() => !document.querySelector(".oppie-typing") && document.querySelectorAll(".oppie-msg.me").length >= 1), "reply path completed");
await sleep(3500);
await A.locator('input[aria-label="ask oppie"]').fill("<img src=x onerror=alert(1)>");
await A.keyboard.press("Enter");
await sleep(2500);
mark("injection-literal", await A.evaluate(() => document.body.innerText.includes("<img") && document.querySelectorAll("img").length === 0), "escaped, no element");
await A.getByRole("button", { name: "collapse oppie" }).click();
await sleep(500);
try { await A.waitForFunction(() => document.body.innerText.includes("1 NEW"), { timeout: 20000 }); } catch (e) {}
mark("ambient-unread", await A.evaluate(() => document.body.innerText.includes("1 NEW")), "ambient speaks, badge counts");
await A.getByRole("button", { name: "open oppie" }).click();
await sleep(600);
mark("expand-clears", await A.evaluate(() => !document.body.innerText.includes(" NEW")), "badge cleared");
await A.getByRole("button", { name: "collapse oppie" }).click();
await sleep(500);
await A.reload({ waitUntil: "domcontentloaded" });
await sleep(5000);
try { await A.getByRole("button", { name: "accept", exact: true }).first().click({ timeout: 3000 }); } catch (e) {}
await sleep(500);
mark("reload-persists", await A.evaluate(() => { try { return localStorage.getItem("opp_oppie_collapsed") === "1"; } catch (e) { return false; } }) && await A.evaluate(() => document.body.innerText.includes("OPPIE // RESIDENT AI")), "collapsed survives");
await A.screenshot({ path: "test/screenshots/oppie/collapsed-1440.png" });
await A.getByRole("button", { name: "open oppie" }).click();
await sleep(600);
await A.screenshot({ path: "test/screenshots/oppie/expanded-1440.png" });
const admin = await ctx.newPage();
admin.on("pageerror", (e) => errs.push("admin:" + String(e.message).slice(0, 100)));
await admin.goto(BASE, { waitUntil: "domcontentloaded" });
await sleep(5000);
for (let i = 0; i < 6; i++) {
  await admin.keyboard.type("letmein");
  try { await admin.getByRole("button", { name: "copy debug report" }).waitFor({ timeout: 3000 }); break; } catch (e) {}
}
await admin.getByRole("button", { name: "OPPIE MELTDOWN" }).click();
await sleep(1000);
let caps = false;
try {
  await A.waitForFunction(() => {
    const els = document.querySelectorAll(".oppie-msg");
    if (!els.length) return false;
    const t = els[els.length - 1].textContent || "";
    return t.length > 10 && t === t.toUpperCase() && /[A-Z]/.test(t);
  }, { timeout: 25000 });
  caps = true;
} catch (e) {}
mark("meltdown-caps", caps, "victim goes caps");
await A.screenshot({ path: "test/screenshots/oppie/meltdown-1440.png" });
mark("admin-immune", await admin.evaluate(() => (window.__oppieMeltdowns || 0) === 0), "admin ignores chaos");
await sleep(65000);
mark("meltdown-recovers", await A.evaluate(() => document.body.innerText.includes("we don't talk about that.")), "recovery line");
const before = await A.evaluate(() => document.querySelectorAll(".oppie-msg").length);
try {
  const cards = await admin.$$eval("button", (els) => els.map((e) => e.innerText || "").filter((t) => /#\d/.test(t) && !t.includes("(you)")));
  const nm = (cards.map((c) => { const m = c.match(/([A-Za-z' -]+ #\d+)/); return m ? m[1] : ""; }).filter(Boolean))[0];
  if (nm) {
    await admin.locator("button", { hasText: nm }).first().click({ timeout: 8000 });
    await sleep(600);
    await admin.locator("[data-testid=remote-toast]").fill("reaction check");
    await admin.locator("[data-testid=remote-menu] button", { hasText: "send" }).first().click();
  }
} catch (e) {}
let reacted = false;
try { await A.waitForFunction((b) => document.querySelectorAll(".oppie-msg").length > b, before, { timeout: 12000 }); reacted = true; } catch (e) {}
mark("gag-reaction", reacted, "oppie comments post-gag");
console.log("errors: " + JSON.stringify(errs));
await browser.close();
console.log("oppie-done " + res.filter(Boolean).length + "/" + res.length);
