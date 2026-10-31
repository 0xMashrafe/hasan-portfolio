import { chromium } from "playwright-core";
const browser = await chromium.launch({ channel: "msedge" });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
const page = await ctx.newPage();
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
await page.addInitScript(() => sessionStorage.setItem("ayaan-visited", "1"));
await page.goto("http://127.0.0.1:4173/", { waitUntil: "networkidle" });
await page.waitForTimeout(1200);
await page.screenshot({ path: "shots/r-hero.png" });
const info = await page.evaluate(() => ({
  h1: getComputedStyle(document.querySelector("h1")).opacity,
  h1Text: document.querySelector("h1").innerText.replace(/\n/g, " "),
  lenis: typeof window.__lenis,
  bodyHeight: document.body.scrollHeight,
}));
await page.evaluate(() => { const el = document.getElementById("work"); window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - 70); });
await page.waitForTimeout(800);
await page.screenshot({ path: "shots/r-work.png" });
console.log(JSON.stringify({ info, errors }, null, 2));
await browser.close();
