import { chromium } from "playwright-core";
import { mkdirSync } from "node:fs";

const url = "http://127.0.0.1:5173/";
mkdirSync("shots", { recursive: true });
const browser = await chromium.launch({ channel: "msedge" });
const errors = [];

async function open(opts) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, ...opts });
  const page = await ctx.newPage();
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));
  await page.addInitScript((theme) => {
    localStorage.setItem("ayaan-theme", theme);
    sessionStorage.setItem("ayaan-visited", "1");
  }, opts.theme ?? "dark");
  await page.goto(url, { waitUntil: "networkidle" });
  await page.waitForTimeout(2200);
  return page;
}

// ---- manifesto (scroll to mid)
const page = await open({});
await page.evaluate(() => {
  const el = document.querySelector("section:nth-of-type(6)");
  const target = document.getElementById("work");
  window.scrollTo(0, target.getBoundingClientRect().top + window.scrollY - 700);
});
await page.waitForTimeout(1600);
await page.screenshot({ path: "shots/v-manifesto.png" });

// ---- footer
await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
await page.waitForTimeout(1600);
await page.screenshot({ path: "shots/v-footer.png" });

// ---- modal with pointer parked away
await page.evaluate(() => {
  const el = document.getElementById("work");
  window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - 70);
});
await page.waitForTimeout(1000);
await page.mouse.move(20, 400);
await page.waitForTimeout(400);
await page.locator("#work button[aria-label^='Open Nocturne']").first().click();
await page.waitForTimeout(1000);
await page.screenshot({ path: "shots/v-modal.png" });
await page.keyboard.press("Escape");
await page.waitForTimeout(400);

// ---- light mode sections
await page.getByRole("button", { name: /Switch to light theme/ }).click();
await page.waitForTimeout(1200);
await page.screenshot({ path: "shots/v-light-desktop.png" });
await page.evaluate(() => {
  const el = document.getElementById("work");
  window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - 70);
});
await page.waitForTimeout(1200);
await page.screenshot({ path: "shots/v-light-work.png" });
await page.evaluate(() => {
  const el = document.getElementById("craft");
  window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - 70);
});
await page.waitForTimeout(1200);
await page.screenshot({ path: "shots/v-light-craft.png" });

// ---- wide hero
const wide = await open({ viewport: { width: 1920, height: 1080 } });
await wide.screenshot({ path: "shots/v-wide-hero.png" });

// ---- mobile sections
const mob = await open({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
for (const id of ["work", "craft", "contact"]) {
  await mob.evaluate((sid) => {
    const el = document.getElementById(sid);
    window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - 60);
  }, id);
  await mob.waitForTimeout(1600);
  await mob.screenshot({ path: `shots/v-mobile-${id}.png` });
}
await mob.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
await mob.waitForTimeout(1600);
await mob.screenshot({ path: "shots/v-mobile-footer.png" });

// ---- tablet check
const tab = await open({ viewport: { width: 768, height: 1024 } });
await tab.screenshot({ path: "shots/v-tablet-hero.png" });

console.log(JSON.stringify({ errors }, null, 2));
await browser.close();
