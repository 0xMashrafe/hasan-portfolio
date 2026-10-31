import { chromium } from "playwright-core";
import { mkdirSync } from "node:fs";

const url = process.env.URL ?? "http://127.0.0.1:5173/";
const outDir = process.env.OUT ?? "shots";
const theme = process.env.THEME ?? "dark";
const width = Number(process.env.W ?? 1440);
const height = Number(process.env.H ?? 900);
mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch({ channel: "msedge" });
const context = await browser.newContext({
  viewport: { width, height },
  deviceScaleFactor: 1,
  reducedMotion: "no-preference",
});
const page = await context.newPage();
const errors = [];
page.on("console", (m) => {
  if (m.type() === "error" || m.type() === "warning") errors.push(`[${m.type()}] ${m.text()}`);
});
page.on("pageerror", (e) => errors.push(`[pageerror] ${e.message}`));

await page.addInitScript((t) => {
  localStorage.setItem("ayaan-theme", t);
  sessionStorage.setItem("ayaan-visited", "1");
}, theme);

await page.goto(url, { waitUntil: "networkidle" });
await page.waitForTimeout(2600);

const tag = process.env.TAG ?? "home";
await page.screenshot({ path: `${outDir}/${tag}.png` });

// Section captures
const sections = ["about", "work", "craft", "path", "contact"];
for (const id of sections) {
  await page.evaluate((sid) => {
    const el = document.getElementById(sid);
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 70, behavior: "instant" });
  }, id);
  await page.waitForTimeout(1200);
  await page.screenshot({ path: `${outDir}/${tag}-${id}.png` });
}

// full page
await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(800);
await page.screenshot({ path: `${outDir}/${tag}-full.png`, fullPage: true });

const metrics = await page.evaluate(() => ({
  scrollHeight: document.documentElement.scrollHeight,
  innerWidth: window.innerWidth,
  hOverflow: document.documentElement.scrollWidth > window.innerWidth
    ? document.documentElement.scrollWidth
    : 0,
}));

console.log(JSON.stringify({ errors, metrics }, null, 2));
await browser.close();
