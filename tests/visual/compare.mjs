// Visual check: screenshots each section of the ATLAS page in a reference and in the Astro build (dist/),
// at several widths, and compares them pixel by pixel. Two references:
// - --base-ref=<ref> (CI, on pull requests): the site as built at that ref (the PR's base branch), so only
//   what the change itself does to the page shows up. The ref is checked out into a temporary git worktree,
//   installed and built there.
// - otherwise the original single-file page, read from git history (--legacy-ref, default: the last commit
//   that had it), for checking the port against the original design.
//
//   npm run build && npm run test:visual
//   npm run build && npm run test:visual -- --base-ref=origin/main
//   npm run test:visual -- --widths=1440 --sections=hero,faq
//   npm run test:visual -- --legacy-ref=<commit>
//
// A section missing on either side fails the run (--allow-missing skips it instead, for partial ports).
// Diff images go to tests/visual/output/.
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
  // "audit-findings" is added only against a build (--base-ref): against the original page its cards differ,
  // since they now come from Sanity
  faq: "#faq",
  footer: "footer.footer",
};

const args = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const [k, ...v] = a.replace(/^--/, "").split("="); // a value may hold "=" (a branch name can)
    return [k, v.length ? v.join("=") : true];
  }),
);
const widths = (args.widths ?? "1440,1280,1024,500").split(",").map(Number);
// against another build of the site, the findings carousel compares too (both read the same Sanity content)
if (args["base-ref"]) SECTIONS["audit-findings"] = "#audit-findings";
const only = args.sections ? args.sections.split(",") : Object.keys(SECTIONS);
const threshold = Number(args.threshold ?? 0.005); // share of differing pixels allowed per section
const compareImages = Boolean(args.images);
const legacyRef = args["legacy-ref"] ?? LEGACY_REF;
const baseRef = typeof args["base-ref"] === "string" ? args["base-ref"] : null;
const refName = baseRef ? "base" : "legacy";
const allowMissing = Boolean(args["allow-missing"]);
const HOST = "127.0.0.1"; // servers listen on loopback only

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
    if (!extname(path)) path += ".html"; // pages are built as /uk-UA/atlas.html
    const file = join(dir, path);
    if (!file.startsWith(dir) || !existsSync(file)) {
      res.writeHead(404).end();
      return;
    }
    res.writeHead(200, { "Content-Type": TYPES[extname(file)] ?? "application/octet-stream" });
    res.end(await readFile(file));
  });
  return new Promise((done) => server.listen(0, HOST, () => done(server)));
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
      // the cookie notice floats over whatever section is on screen
      ".cookie-consent{display:none!important}" +
      (compareImages ? "" : "img{visibility:hidden!important}"),
  });
  await page.waitForTimeout(300);
}

async function shoot(page, url, width, selector) {
  await page.setViewportSize({ width, height: 900 });
  const response = await page.goto(url, { waitUntil: "networkidle" });
  if (!response?.ok()) throw new Error(`${url} answered ${response?.status() ?? "nothing"}`);
  await settle(page);
  const el = page.locator(selector).first();
  if ((await el.count()) === 0) return null;
  await el.scrollIntoViewIfNeeded();
  // scrolling starts lazy loads (the canvas clips fetch their frames in view): let them land
  await page.waitForLoadState("networkidle");
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
  // a 1px size difference is screenshot rounding at fractional positions, not a layout change
  const sizeMatch = Math.abs(a.width - b.width) <= 1 && Math.abs(a.height - b.height) <= 1;
  return { ratio: pixels / (width * height), diff, sizeMatch };
}

if (!existsSync(join(ROOT, "dist/uk-UA/atlas.html"))) {
  console.error("No build found: run `npm run build` first.");
  process.exit(1);
}

await rm(OUT, { recursive: true, force: true });
await mkdir(OUT, { recursive: true });
// the reference: the site built at --base-ref, or the legacy page extracted from git
const refDir = await mkdtemp(join(tmpdir(), `daat-${refName}-`));
const rows = [];
let failed = 0;
let legacy, build, browser, refPath;
try {
  if (baseRef) {
    console.log(`Building ${baseRef} for reference…`);
    const run = (cmd, argv) => execFileSync(cmd, argv, { cwd: refDir, stdio: ["ignore", "ignore", "inherit"] });
    execFileSync("git", ["worktree", "add", "--detach", "--force", refDir, baseRef], { cwd: ROOT, stdio: "ignore" });
    run("npm", ["ci", "--no-audit", "--no-fund"]);
    run("npx", ["astro", "build"]);
    legacy = await serve(join(refDir, "dist"));
    refPath = "/uk-UA/atlas";
  } else {
    const archive = execFileSync("git", ["archive", legacyRef, "index.html", "assets", "fonts", "public/frames"], {
      cwd: ROOT,
      maxBuffer: 1 << 30,
    });
    execFileSync("tar", ["-x", "-C", refDir], { input: archive });
    legacy = await serve(refDir);
    refPath = "/index.html";
  }
  build = await serve(join(ROOT, "dist"));
  browser = await chromium.launch({ channel: "chrome" });
  const context = await browser.newContext({ deviceScaleFactor: 1, reducedMotion: "reduce" });
  const page = await context.newPage();

  for (const width of widths) {
    for (const name of only) {
      const selector = SECTIONS[name];
      // a reference without the page (a base branch before it existed) counts as the section missing there
      const before = await shoot(page, `http://${HOST}:${legacy.address().port}${refPath}`, width, selector).catch(
        () => null,
      );
      const after = await shoot(page, `http://${HOST}:${build.address().port}/uk-UA/atlas`, width, selector);
      if (!before || !after) {
        if (!allowMissing) failed++;
        rows.push({ width, section: name, result: !before ? `missing in ${refName}` : "missing in build" });
        continue;
      }
      const { ratio, diff, sizeMatch } = compare(before, after);
      const ok = ratio <= threshold && sizeMatch;
      if (!ok) {
        failed++;
        const base = join(OUT, `${name}-${width}`);
        await writeFile(`${base}-${refName}.png`, PNG.sync.write(before));
        await writeFile(`${base}-astro.png`, PNG.sync.write(after));
        await writeFile(`${base}-diff.png`, PNG.sync.write(diff));
      }
      rows.push({
        width,
        section: name,
        result: ok ? "ok" : "DIFF",
        "diff %": (ratio * 100).toFixed(2),
        size:
          before.width === after.width && before.height === after.height
            ? "same"
            : `${before.width}×${before.height} → ${after.width}×${after.height}`,
      });
    }
  }
} finally {
  await browser?.close();
  legacy?.close();
  build?.close();
  if (baseRef) {
    try {
      execFileSync("git", ["worktree", "remove", "--force", refDir], { cwd: ROOT, stdio: "ignore" });
    } catch {}
  }
  await rm(refDir, { recursive: true, force: true });
}

console.table(rows);
if (failed) {
  console.error(`${failed} section(s) differ or are missing; see tests/visual/output/`);
  process.exit(1);
}
