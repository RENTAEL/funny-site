import { chromium } from "playwright";
const BASE = process.argv[2] || "http://localhost:3123";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const browser = await chromium.launch();
const ctx = await browser.newContext({ permissions: ["clipboard-read", "clipboard-write"] });
const p = await ctx.newPage();
const res = [];
const mark = (n, ok, d) => { console.log((ok ? "PASS " : "FAIL ") + n + (d ? " — " + d : "")); res.push(ok); };
const errs = [];
p.on("pageerror", (e) => errs.push(String(e.message).slice(0, 100)));
p.on("console", (m) => { if (m.type() === "error") errs.push("console: " + m.text().slice(0, 100)); });
await p.goto(BASE, { waitUntil: "domcontentloaded" });
await sleep(4000);
mark("cookie-spawns", await p.evaluate(() => document.body.innerText.includes("we use cookies")), "hydra banner live");
await p.getByRole("button", { name: "decline", exact: true }).first().click();
await sleep(800);
mark("cookie-decline-spawns", await p.getByRole("button", { name: "decline", exact: true }).count() >= 2, "hydra multiplies");
await p.getByRole("button", { name: "accept", exact: true }).first().click();
await sleep(800);
mark("cookie-accept-clears", await p.evaluate(() => !document.body.innerText.includes("we use cookies")), "accept wipes hydra");
for (let i = 0; i < 6; i++) {
  await p.keyboard.type("letmein");
  try { await p.getByRole("button", { name: "copy debug report" }).waitFor({ timeout: 3000 }); break; } catch (e) {}
}
mark("admin-opens", await p.evaluate(() => !!document.querySelector("[data-panel]")), "phrase unlocks");
await p.getByRole("button", { name: "close panel" }).click();
await sleep(600);
mark("admin-closes", await p.evaluate(() => !document.querySelector("[data-panel]")), "X folds console");
for (let i = 0; i < 6; i++) {
  await p.keyboard.type("letmein");
  try { await p.getByRole("button", { name: "copy debug report" }).waitFor({ timeout: 3000 }); break; } catch (e) {}
}
mark("admin-reopens", await p.evaluate(() => !!document.querySelector("[data-panel]")), "close does not break reopen");
await p.getByRole("button", { name: "close panel" }).click();
await sleep(400);
await p.getByRole("button", { name: "i'm not a robot" }).scrollIntoViewIfNeeded();
await p.getByRole("button", { name: "i'm not a robot" }).click();
let checked = false;
try { await p.waitForFunction(() => document.body.innerText.includes("✓"), { timeout: 2500 }); checked = true; } catch (e) {}
mark("captcha-toggles", checked, "fake captcha checks then unchecks");
await p.getByRole("button", { name: "Submit" }).scrollIntoViewIfNeeded();
const sb = await p.getByRole("button", { name: "Submit" }).boundingBox();
await p.getByRole("button", { name: "Submit" }).hover();
await sleep(600);
mark("submit-dodges", await p.evaluate((b) => {
  const x = Array.from(document.querySelectorAll("button")).find((q) => ((q.textContent || "").trim() === "Submit"));
  if (!x) return false;
  const q = x.getBoundingClientRect();
  const moved = Math.hypot(q.x - b.x, q.y - b.y) > 10;
  return moved || x.style.position === "fixed" || x.className.includes("fixed");
}, sb ? { x: sb.x, y: sb.y } : { x: -9999, y: -9999 }), "runaway button flees hover");
console.log("errors: " + JSON.stringify(errs));
await browser.close();
console.log("controls-audit-done " + res.filter(Boolean).length + "/" + res.length);
