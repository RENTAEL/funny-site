import { chromium } from "playwright";
const BASE = process.argv[2] || "http://localhost:3123";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const browser = await chromium.launch();
for (const vp of [{ w: 1440, h: 900, tag: "desktop" }, { w: 390, h: 844, tag: "mobile" }]) {
  const ctx = await browser.newContext({ viewport: { width: vp.w, height: vp.h } });
  const pg = await ctx.newPage();
  const errs = [];
  pg.on("pageerror", (e) => errs.push(String(e.message).slice(0, 120)));
  await pg.goto(BASE, { waitUntil: "domcontentloaded" });
  await sleep(6000);
  await pg.screenshot({ path: "test/screenshots/main-" + vp.tag + ".png" });
  for (let i = 0; i < 6; i++) {
    await pg.keyboard.type("letmein");
    await sleep(1500);
    const open = await pg.evaluate(() => document.body.innerText.includes("you have no power here"));
    if (open) break;
  }
  await sleep(2000);
  await pg.screenshot({ path: "test/screenshots/admin-" + vp.tag + ".png" });
  console.log(vp.tag + ": pageerrors=" + errs.length + (errs.length > 0 ? " FIRST:" + errs[0] : ""));
  await ctx.close();
}
await browser.close();
console.log("screenshots-done");
