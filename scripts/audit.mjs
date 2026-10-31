import { chromium } from "playwright-core";

const url = process.env.URL ?? "http://127.0.0.1:5173/";
const browser = await chromium.launch({ channel: "msedge" });
const context = await browser.newContext({ viewport: { width: Number(process.env.W||1440), height: Number(process.env.H||900) } });
const page = await context.newPage();
await page.addInitScript(() => {
  localStorage.setItem("ayaan-theme", "dark");
  sessionStorage.setItem("ayaan-visited", "1");
});
await page.goto(url, { waitUntil: "networkidle" });
await page.waitForTimeout(2400);

const report = await page.evaluate(() => {
  const hero = document.getElementById("home");
  const out = { viewport: window.innerHeight, hero: null, boxes: [], overflowX: [] };
  if (hero) {
    out.hero = {
      top: hero.offsetTop,
      height: hero.getBoundingClientRect().height,
      scrollBottom: hero.offsetTop + hero.getBoundingClientRect().height,
    };
    out.boxes = [...hero.querySelectorAll("h1, .container-x > div, section > .container-x")]
      .slice(0, 20)
      .map((el) => {
        const r = el.getBoundingClientRect();
        return {
          tag: el.tagName,
          cls: (el.className || "").toString().slice(0, 60),
          top: Math.round(r.top),
          bottom: Math.round(r.bottom),
          h: Math.round(r.height),
        };
      });
  }
  document.querySelectorAll("*").forEach((el) => {
    const r = el.getBoundingClientRect();
    if (r.width > 0 && (r.right > window.innerWidth + 1 || r.left < -1)) {
      const cls = (el.className || "").toString().slice(0, 50);
      out.overflowX.push({ tag: el.tagName, cls, left: Math.round(r.left), right: Math.round(r.right) });
    }
  });
  out.overflowX = out.overflowX.slice(0, 12);
  return out;
});

console.log(JSON.stringify(report, null, 2));
await browser.close();
