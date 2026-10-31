import { chromium } from "playwright-core";
import { mkdirSync } from "node:fs";
mkdirSync("shots", { recursive: true });
const url = "http://127.0.0.1:4173/";
const browser = await chromium.launch({ channel: "msedge" });
const errors = [];

const open = async (vw, vh, theme = "dark", mobile = false) => {
  const ctx = await browser.newContext({ viewport: { width: vw, height: vh }, isMobile: mobile, hasTouch: mobile });
  const page = await ctx.newPage();
  page.on("pageerror", (e) => errors.push(`${vw}: ${e.message}`));
  page.on("console", (m) => m.type() === "error" && errors.push(`${vw}: ${m.text()}`));
  await page.addInitScript((t) => { sessionStorage.setItem("ayaan-visited", "1"); if (!sessionStorage.getItem("keep-theme")) localStorage.setItem("ayaan-theme", t); }, theme);
  await page.goto(url, { waitUntil: "networkidle" });
  await page.waitForTimeout(2000);
  return page;
};

// theme persistence
const p = await open(1440, 900);
await p.getByRole("button", { name: /Switch to light theme/ }).click();
await p.waitForTimeout(600);
await p.evaluate(() => sessionStorage.setItem("keep-theme", "1"));
await p.reload({ waitUntil: "networkidle" });
await p.waitForTimeout(1800);
const persisted = await p.evaluate(() => document.documentElement.dataset.theme);
await p.getByRole("button", { name: /Switch to dark theme/ }).click();
await p.waitForTimeout(600);

// mobile work + craft
const m = await open(390, 844, "dark", true);
for (const id of ["work", "craft", "path"]) {
  await m.evaluate((sid) => { const el = document.getElementById(sid); window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - 60); }, id);
  await m.waitForTimeout(1400);
  await m.screenshot({ path: `shots/f-mobile-${id}.png` });
}

// 1024 hero
const t = await open(1024, 768);
const geo = await t.evaluate(() => {
  const h = document.getElementById("home");
  return { heroHeight: Math.round(h.getBoundingClientRect().height), vh: innerHeight, overflow: document.documentElement.scrollWidth > innerWidth };
});
await t.screenshot({ path: "shots/f-1024.png" });

// desktop sections
const d = await open(1440, 900);
for (const id of ["about", "work", "craft", "path", "contact"]) {
  await d.evaluate((sid) => { const el = document.getElementById(sid); window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - 70); }, id);
  await d.waitForTimeout(1100);
  await d.screenshot({ path: `shots/f-${id}.png` });
}
await d.evaluate(() => window.scrollTo(0, 0));
await d.waitForTimeout(800);
await d.screenshot({ path: "shots/f-home.png" });

console.log(JSON.stringify({ persisted, geo, errors }, null, 2));
await browser.close();
