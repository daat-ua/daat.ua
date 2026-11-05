// Visual parity: screenshots each section of the legacy single-file page and of the Astro build (dist/),
// at several widths, and compares them pixel by pixel. The legacy page no longer lives in the tree; it's
// read from git history (--legacy-ref, default: the last commit that had it), so the check stays usable
// for regressions against the original design.
//
//   npm run build && npm run test:visual
//   npm run test:visual -- --widths=1440 --sections=hero,faq
//   npm run test:visual -- --legacy-ref=<commit>
//
// Sections not yet ported (missing from the build) are skipped. Diff images go to tests/visual/output/.
// Images are hidden by default (their boxes still count): Astro resizes and re-encodes them, which shifts
// pixels without changing the design. Pass --images to compare them too.
// Uses the locally installed Google Chrome (playwright-core, no browser download).

import { execFileSync } from "node:child_process";
import { createServer } from "node:http";
import { mkdtemp, readFile, mkdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { existsSync } from "node:fs";
import { extname, join, resolve } from "node:path";
import { chromium } from "playwright-core";
import pixelmatch from "pixelmatch";
import { PNG } from "pngjs";

const ROOT = resolve(import.meta.dirname, "../..");
const OUT = join(ROOT, "tests/visual/output");
// The last commit with the legacy page (index.html, assets/, fonts/, public/frames/)
const LEGACY_REF = "74e078c";

// Each section is found by the same selector on both pages
const SECTIONS = {
  header: "header.topbar",
  hero: "section.hero",
  "why-now": "#why-now",
  scrub: ".scrub",
  "for-whom": "#for-whom",
  deliverables: "#deliverables",
  report: "#report",
  roadmap: "#roadmap",
  testimonials: "#testimonials-and-case-studies",
  methodology: "#methodology",
  "audit-findings": "#audit-findings",
  faq: "#faq",
  footer: "footer.footer",
};

const args = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const [k, v] = a.replace(/^--/, "").split("=");
    return [k, v ?? true];
  }),
);
const widths = (args.widths ?? "1440,1280,1024,500").split(",").map(Number);
const only = args.sections ? args.sections.split(",") : Object.keys(SECTIONS);
const threshold = Number(args.threshold ?? 0.005); // share of differing pixels allowed per section
const compareImages = Boolean(args.images);
const legacyRef = args["legacy-ref"] ?? LEGACY_REF;

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css",
  ".js": "text/javascript",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".jpg": "image/jpeg",
  ".png": "image/png",
  ".avif": "image/avif",
  ".woff2": "font/woff2",
  ".json": "application/json",
};

/** Minimal static server: legacy page from the repo root, the build from dist/ */
function serve(dir) {
  const server = createServer(async (req, res) => {
    let path = decodeURIComponent(new URL(req.url, "http://x").pathname);
    if (path.endsWith("/")) path += "index.html";
    const file = join(dir, path);
    if (!file.startsWith(dir) || !existsSync(file)) {
      res.writeHead(404).end();
      return;
    }
    res.writeHead(200, { "Content-Type": TYPES[extname(file)] ?? "application/octet-stream" });
    res.end(await readFile(file));
  });
  return new Promise((done) => server.listen(0, () => done(server)));
}

/** Freeze the page: no motion, everything loaded, one-time animations finished */
async function settle(page) {
  await page.evaluate(async () => {
    for (const img of document.images) img.loading = "eager";
    await Promise.all([...document.images].map((img) => img.decode().catch(() => {})));
    await document.fonts.ready;
  });
  await page.addStyleTag({
    content:
      "*,*::before,*::after{transition:none!important;animation:none!important;caret-color:transparent!important}" +
      (compareImages ? "" : "img{visibility:hidden!important}"),
  });
  await page.waitForTimeout(300);
}

async function shoot(page, url, width, selector) {
  await page.setViewportSize({ width, height: 900 });
  await page.goto(url, { waitUntil: "networkidle" });
  await settle(page);
  const el = page.locator(selector).first();
  if ((await el.count()) === 0) return null;
  await el.scrollIntoViewIfNeeded();
  await page.waitForTimeout(150);
  return PNG.sync.read(await el.screenshot({ animations: "disabled" }));
}

function compare(a, b) {
  const width = Math.max(a.width, b.width);
  const height = Math.max(a.height, b.height);
  const pad = (img) => {
    if (img.width === width && img.height === height) return img;
    const out = new PNG({ width, height });
    PNG.bitblt(img, out, 0, 0, img.width, img.height, 0, 0);
    return out;
  };
  const diff = new PNG({ width, height });
  const pixels = pixelmatch(pad(a).data, pad(b).data, diff.data, width, height, { threshold: 0.1 });
  return { ratio: pixels / (width * height), diff, sizeMatch: a.width === b.width && a.height === b.height };
}

if (!existsSync(join(ROOT, "dist/index.html"))) {
  console.error("No build found: run `npm run build` first.");
  process.exit(1);
}

await rm(OUT, { recursive: true, force: true });
await mkdir(OUT, { recursive: true });
// extract the legacy page from git into a temporary folder
const legacyDir = await mkdtemp(join(tmpdir(), "daat-legacy-"));
const archive = execFileSync("git", ["archive", legacyRef, "index.html", "assets", "fonts", "public/frames"], {
  cwd: ROOT,
  maxBuffer: 1 << 30,
});
execFileSync("tar", ["-x", "-C", legacyDir], { input: archive });
const legacy = await serve(legacyDir);
const build = await serve(join(ROOT, "dist"));
const browser = await chromium.launch({ channel: "chrome" });
const context = await browser.newContext({ deviceScaleFactor: 1, reducedMotion: "reduce" });
const page = await context.newPage();

const rows = [];
let failed = 0;
for (const width of widths) {
  for (const name of only) {
    const selector = SECTIONS[name];
    const before = await shoot(page, `http://localhost:${legacy.address().port}/index.html`, width, selector);
    const after = await shoot(page, `http://localhost:${build.address().port}/`, width, selector);
    if (!before) {
      rows.push({ width, section: name, result: "missing in legacy" });
      continue;
    }
    if (!after) {
      rows.push({ width, section: name, result: "not ported" });
      continue;
    }
    const { ratio, diff, sizeMatch } = compare(before, after);
    const ok = ratio <= threshold && sizeMatch;
    if (!ok) {
      failed++;
      const base = join(OUT, `${name}-${width}`);
      await writeFile(`${base}-legacy.png`, PNG.sync.write(before));
      await writeFile(`${base}-astro.png`, PNG.sync.write(after));
      await writeFile(`${base}-diff.png`, PNG.sync.write(diff));
    }
    rows.push({
      width,
      section: name,
      result: ok ? "ok" : "DIFF",
      "diff %": (ratio * 100).toFixed(2),
      size: sizeMatch ? "same" : `${before.width}×${before.height} → ${after.width}×${after.height}`,
    });
  }
}

await browser.close();
legacy.close();
build.close();
await rm(legacyDir, { recursive: true, force: true });
console.table(rows);
if (failed) {
  console.error(`${failed} section(s) differ; see tests/visual/output/`);
  process.exit(1);
}
