import { chromium } from "playwright-core";
import { mkdirSync } from "node:fs";

const url = "http://127.0.0.1:5173/";
mkdirSync("shots", { recursive: true });
const browser = await chromium.launch({ channel: "msedge" });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
const errors = [];
page.on("console", (m) => {
  if (m.type() === "error") errors.push(m.text());
});
page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));
await page.addInitScript(() => {
  localStorage.setItem("ayaan-theme", "dark");
  sessionStorage.setItem("ayaan-visited", "1");
});
await page.goto(url, { waitUntil: "networkidle" });
await page.waitForTimeout(2200);

const out = {};

// ---- work hover + modal
await page.evaluate(() => {
  const el = document.getElementById("work");
  window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - 70);
});
await page.waitForTimeout(1200);
const firstRow = page.locator("#work button[aria-label^='Open Helio']").first();
await firstRow.hover();
await page.waitForTimeout(700);
await page.screenshot({ path: "shots/x-work-hover.png" });
out.previewVisible = await page.locator("text=DESIGN SYSTEM").first().isVisible();

await firstRow.click();
await page.waitForTimeout(800);
await page.screenshot({ path: "shots/x-work-modal.png" });
out.modalOpen = await page.getByRole("dialog").isVisible();
out.scrollLocked = await page.evaluate(() => document.documentElement.style.overflow);
await page.keyboard.press("Escape");
await page.waitForTimeout(500);
out.modalClosed = (await page.getByRole("dialog").count()) === 0;

// ---- filter
await page.getByRole("button", { name: "Fintech", exact: true }).click();
await page.waitForTimeout(700);
out.filteredRows = await page.locator("#work button[aria-label^='Open ']").count();
await page.screenshot({ path: "shots/x-work-filter.png" });
await page.getByRole("button", { name: "All", exact: true }).click();
await page.waitForTimeout(500);

// ---- command palette
await page.keyboard.press("Control+k");
await page.waitForTimeout(500);
await page.screenshot({ path: "shots/x-palette.png" });
await page.keyboard.type("work");
await page.waitForTimeout(400);
await page.screenshot({ path: "shots/x-palette-search.png" });
out.paletteOpen = await page.getByRole("dialog", { name: "Command palette" }).isVisible();
await page.keyboard.press("Enter");
await page.waitForTimeout(1000);
out.paletteClosed = (await page.getByRole("dialog", { name: "Command palette" }).count()) === 0;

// ---- contact copy toast
await page.evaluate(() => {
  const el = document.getElementById("contact");
  window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - 70);
});
await page.waitForTimeout(1200);
await page.getByRole("button", { name: "Copy", exact: true }).click();
await page.waitForTimeout(500);
await page.screenshot({ path: "shots/x-toast.png" });
out.toast = await page.getByRole("status").isVisible();

// ---- mobile menu
const m = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
const mp = await m.newPage();
mp.on("pageerror", (e) => errors.push(`mobile pageerror: ${e.message}`));
await mp.addInitScript(() => {
  localStorage.setItem("ayaan-theme", "dark");
  sessionStorage.setItem("ayaan-visited", "1");
});
await mp.goto(url, { waitUntil: "networkidle" });
await mp.waitForTimeout(2000);
await mp.getByRole("button", { name: "Open menu" }).click();
await mp.waitForTimeout(900);
await mp.screenshot({ path: "shots/x-mobile-menu.png" });
await mp.getByRole("link", { name: 'Work 03' }).click();
await mp.waitForTimeout(1400);
out.mobileScrolled = await mp.evaluate(() => window.scrollY > 300);
await mp.screenshot({ path: "shots/x-mobile-work.png" });
await mp.evaluate(() => {
  const el = document.getElementById("contact");
  window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - 20);
});
await mp.waitForTimeout(1000);
await mp.screenshot({ path: "shots/x-mobile-contact.png" });

// ---- tablet hero geometry
const t = await browser.newContext({ viewport: { width: 1280, height: 800 } });
const tp = await t.newPage();
await tp.addInitScript(() => sessionStorage.setItem("ayaan-visited", "1"));
await tp.goto(url, { waitUntil: "networkidle" });
await tp.waitForTimeout(2000);
out.tabletHero = await tp.evaluate(() => {
  const hero = document.getElementById("home");
  return {
    height: Math.round(hero.getBoundingClientRect().height),
    viewport: window.innerHeight,
    scrollW: document.documentElement.scrollWidth,
    w: window.innerWidth,
  };
});
await tp.screenshot({ path: "shots/x-tablet-hero.png" });

console.log(JSON.stringify({ out, errors }, null, 2));
await browser.close();
