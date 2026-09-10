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
const isOpen = () => admin.evaluate(() => document.body.innerText.includes("you have no power here"));
for (let i = 0; i < 3; i++) {
  await admin.keyboard.type("letmein");
  await sleep(2500);
  if (await isOpen()) break;
}
console.log("ADMIN PANEL OPEN: " + (await isOpen()));
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
await browser.close();
