// Phone checks on the built site (DAA-246), in Chrome with phone emulation (touch, mobile viewport):
// - no page is wider than the phone: a wider layout makes mobile browsers zoom out or pan sideways
// - on the ATLAS page, nothing is drawn over the sticky section bar at any scroll position
// - on the ATLAS page, the primary call to action is on the first screen of a 390 × 844 phone
//
//   npm run build && npm run test:mobile
//   npm run test:mobile -- --widths=390 --pages=uk-UA/atlas
//
// Uses the locally installed Google Chrome (playwright-core, no browser download), like tests/visual.

import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, resolve, sep } from "node:path";
import { globSync } from "node:fs";
import { chromium } from "playwright-core";

const DIST = resolve(import.meta.dirname, "../../dist");
const args = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const [k, ...v] = a.replace(/^--/, "").split("=");
    return [k, v.join("=") || true];
  }),
);
const widths = (args.widths ?? "320,360,390,430").split(",").map(Number);
// every built page but the redirect stubs (a meta refresh and nothing else)
const pages = args.pages
  ? String(args.pages).split(",")
  : globSync("**/*.html", { cwd: DIST })
      .map((f) => f.replace(/\.html$/, ""))
      .filter((p) => p !== "index" && p !== "uk-UA" && p !== "sitemap" && p !== "delivery-management");

// dist/ served the way Caddy serves it: /path from /path.html
const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript",
  ".css": "text/css",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".woff2": "font/woff2",
  ".mp4": "video/mp4",
  ".m3u8": "application/vnd.apple.mpegurl",
  ".ts": "video/mp2t",
  ".json": "application/json",
  ".xml": "application/xml",
};
const server = createServer(async (req, res) => {
  let path;
  try {
    path = decodeURIComponent(new URL(req.url, "http://x").pathname);
  } catch {
    return res.writeHead(400).end();
  }
  // only files inside dist/: a decoded "../" mustn't reach the rest of the disk
  const inside = (file) => file === DIST || file.startsWith(DIST + sep);
  const candidates = [join(DIST, path), join(DIST, `${path}.html`), join(DIST, path, "index.html")].filter(inside);
  for (const file of candidates) {
    try {
      if ((await stat(file)).isFile()) {
        res.writeHead(200, { "content-type": types[extname(file)] ?? "application/octet-stream" });
        return res.end(await readFile(file));
      }
    } catch {}
  }
  res.writeHead(404).end();
});
// loopback only: nothing else on the network reaches the test server
await new Promise((done) => server.listen(0, "127.0.0.1", done));
const origin = `http://127.0.0.1:${server.address().port}`;

const browser = await chromium.launch({ channel: "chrome" });
const failures = [];
const fail = (msg) => {
  failures.push(msg);
  console.log(`  ✕ ${msg}`);
};

for (const width of widths) {
  const ctx = await browser.newContext({ viewport: { width, height: 844 }, isMobile: true, hasTouch: true });
  const page = await ctx.newPage();
  for (const p of pages) {
    await page.goto(`${origin}/${p}`, { waitUntil: "load" });
    // the layout viewport widens to fit what overflows: compare it with the screen
    const { layout, widest } = await page.evaluate(() => {
      const vw = document.documentElement.clientWidth;
      let widest = "";
      for (const el of document.querySelectorAll("body *")) {
        const r = el.getBoundingClientRect();
        if (r.width && r.right > vw + 1 && !widest) widest = `${el.tagName.toLowerCase()}.${el.className}`.slice(0, 80);
      }
      return { layout: window.innerWidth, widest };
    });
    if (layout > width) fail(`${p} at ${width}px: the page is ${layout}px wide (first overflowing: ${widest})`);
  }
  await ctx.close();
}

if (!args.pages || String(args.pages).includes("uk-UA/atlas")) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const page = await ctx.newPage();
  await page.goto(`${origin}/uk-UA/atlas`, { waitUntil: "load" });
  // the primary call to action is on the first screen
  const cta = await page.evaluate(() => {
    const a = document.querySelector(".hero a.btn, .hero .btn");
    return a ? Math.round(a.getBoundingClientRect().bottom) : null;
  });
  if (cta === null || cta > 844)
    fail(`uk-UA/atlas at 390 × 844: the hero's call to action ends at ${cta}px, below the first screen`);
  // nothing over the sticky section bar, all the way down
  const covered = await page.evaluate(async () => {
    const bar = document.querySelector(".why__toc");
    const found = [];
    for (let y = 0; y < document.documentElement.scrollHeight; y += 300) {
      scrollTo({ top: y, behavior: "instant" }); // the page scrolls smoothly: measure where it is, not mid-way
      await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
      const b = bar.getBoundingClientRect();
      if (b.top !== 0) continue; // not stuck yet, or released at the end
      for (const x of [40, 200, 350]) {
        const top = document.elementFromPoint(x, b.top + b.height / 2);
        if (top && !bar.contains(top) && !top.closest("#cookie-consent"))
          found.push(`${y}px: ${top.tagName.toLowerCase()}.${top.className}`.slice(0, 90));
      }
    }
    return [...new Set(found)].slice(0, 5);
  });
  for (const c of covered) fail(`uk-UA/atlas at 390px: drawn over the section bar at ${c}`);
  await ctx.close();
}

await browser.close();
server.close();
console.log(
  failures.length
    ? `\n${failures.length} problem(s)`
    : `\nPhone checks passed: ${pages.length} pages at ${widths.join(", ")}px`,
);
process.exit(failures.length ? 1 : 0);
