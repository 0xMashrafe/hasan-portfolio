import { chromium } from "playwright-core";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const axeSource = readFileSync(require.resolve("axe-core/axe.min.js"), "utf8");

const browser = await chromium.launch({ channel: "msedge" });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
await page.addInitScript((theme) => {
  sessionStorage.setItem("ayaan-visited", "1");
  localStorage.setItem("ayaan-theme", theme);
}, process.env.THEME ?? "dark");
await page.goto("http://127.0.0.1:5173/", { waitUntil: "networkidle" });
await page.waitForTimeout(2200);
await page.addScriptTag({ content: axeSource });
const results = await page.evaluate(async () => {
  const r = await window.axe.run(document, { runOnly: { type: "tag", values: ["wcag2a", "wcag2aa"] } });
  return r.violations.map((v) => ({
    id: v.id,
    impact: v.impact,
    help: v.help,
    nodes: v.nodes.slice(0, 4).map((n) => ({ target: n.target, summary: n.failureSummary?.slice(0, 200) })),
  }));
});
console.log(JSON.stringify(results, null, 2));
await browser.close();
