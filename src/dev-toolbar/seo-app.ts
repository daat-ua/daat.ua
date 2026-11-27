import { defineToolbarApp } from "astro/toolbar";

// "SEO" in the dev toolbar (DAA-220): how the page being viewed shows in a search result and as a shared link, and
// what it tells search engines, read from its rendered <head> each time the app opens. Dev only
// (src/integrations/seo-toolbar.ts); nothing of it reaches the build. The limits are the ones the pages work to:
// a title within ~60 characters, a description within ~160, a 1200 × 630 share image.

interface Head {
  title: string;
  description: string;
  canonical: string;
  robots: string;
  og: Record<string, string>;
  twitterCard: string;
  jsonLd: { types: string[]; error?: string }[];
  h1: number;
  skips: string[];
}

type Level = "ok" | "warn" | "error";
interface Check {
  level: Level;
  label: string;
  detail: string;
}

const meta = (selector: string) => document.head.querySelector<HTMLMetaElement>(selector)?.content.trim() ?? "";

function readHead(): Head {
  const og: Record<string, string> = {};
  document.head.querySelectorAll<HTMLMetaElement>('meta[property^="og:"]').forEach((m) => {
    og[m.getAttribute("property")!.slice(3)] = m.content.trim();
  });
  const jsonLd = [...document.querySelectorAll<HTMLScriptElement>('script[type="application/ld+json"]')].map((s) => {
    try {
      // a block is one node, a top-level array of nodes, or a {"@graph": [...]} container (or an array of those)
      type Node = { "@type"?: string | string[]; "@graph"?: Node[] };
      const data = JSON.parse(s.textContent ?? "") as Node | Node[];
      const nodes = (Array.isArray(data) ? data : [data]).flatMap((n) => n["@graph"] ?? [n]);
      return { types: nodes.flatMap((n) => n["@type"] ?? "?") };
    } catch (e) {
      return { types: [], error: (e as Error).message };
    }
  });
  // heading levels in page order: a jump of more than one (h2 → h4) is a skip
  const skips: string[] = [];
  let previous = 0;
  document.querySelectorAll("main h1, main h2, main h3, main h4, main h5, main h6").forEach((h) => {
    const level = Number(h.tagName[1]);
    if (level > previous + 1) skips.push(`h${previous} → h${level} «${h.textContent?.trim().slice(0, 50)}»`);
    previous = level;
  });
  return {
    title: document.title.trim(),
    description: meta('meta[name="description"]'),
    canonical: document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.href ?? "",
    robots: meta('meta[name="robots"]'),
    og,
    twitterCard: meta('meta[name="twitter:card"]'),
    jsonLd,
    h1: document.querySelectorAll("h1").length,
    skips,
  };
}

/** a URL the page gives, resolved against the page; null when it doesn't parse */
const resolve = (value: string) => {
  try {
    return value ? new URL(value, location.href) : null;
  } catch {
    return null;
  }
};
const isAbsolute = (value: string) => /^https?:\/\//i.test(value);

/** the share image as loaded: from its own URL, or from this dev server when that host (daat.ua before the domain
 * moves) isn't reachable */
interface ShareImageState {
  status: "none" | "loading" | "loaded" | "failed";
  src?: string;
  local?: boolean;
  width?: number;
  height?: number;
}

const load = (src: string) =>
  new Promise<HTMLImageElement>((done, fail) => {
    const img = new Image();
    img.onload = () => done(img);
    img.onerror = () => fail(new Error(src));
    img.src = src;
  });

async function loadShareImage(head: Head): Promise<ShareImageState> {
  const url = resolve(head.og.image ?? "");
  if (!url) return { status: head.og.image ? "failed" : "none", src: head.og.image };
  const loaded = (img: HTMLImageElement, local: boolean): ShareImageState => ({
    status: "loaded",
    src: img.src,
    local,
    width: img.naturalWidth,
    height: img.naturalHeight,
  });
  try {
    return loaded(await load(url.href), false);
  } catch {
    // already this server: nothing else to try
    if (url.origin === location.origin) return { status: "failed", src: url.href };
    const local = new URL(url.pathname + url.search, location.origin).href;
    try {
      return loaded(await load(local), true);
    } catch {
      return { status: "failed", src: url.href };
    }
  }
}

function imageCheck(head: Head, image: ShareImageState): Check | undefined {
  if (image.status === "none") return undefined; // the Open Graph check names the missing og:image
  const from = image.local ? ` (loaded from this dev server: ${resolve(head.og.image)?.host} isn't reachable)` : "";
  if (image.status === "loading") return { level: "ok", label: "Share image", detail: "loading…" };
  if (image.status === "failed") return { level: "error", label: "Share image", detail: `doesn't load: ${image.src}` };
  const { width: w = 0, height: h = 0 } = image;
  const tagged = head.og["image:width"] && head.og["image:height"];
  const declared = `${head.og["image:width"]} × ${head.og["image:height"]}`;
  const problems = [
    !isAbsolute(head.og.image) && "og:image isn't an absolute URL",
    !tagged && "no og:image:width / og:image:height (networks lay the card out late)",
    tagged && `${w} × ${h}` !== declared && `the tags say ${declared}`,
    Math.abs(w / h - 1200 / 630) > 0.02 && `ratio ${(w / h).toFixed(2)}, not 1.91 (1200 × 630), so networks crop it`,
    w < 1200 && "narrower than 1200 px, so it may look soft on large cards",
  ].filter(Boolean);
  return problems.length
    ? { level: "warn", label: "Share image", detail: `${w} × ${h}: ${problems.join("; ")}${from}` }
    : { level: "ok", label: "Share image", detail: `${w} × ${h}${from}` };
}

function checks(head: Head, image: ShareImageState): Check[] {
  const list: Check[] = [];
  const add = (level: Level, label: string, detail: string) => list.push({ level, label, detail });
  const length = (label: string, text: string, max: number) =>
    !text
      ? add("error", label, "missing")
      : add(text.length > max ? "warn" : "ok", label, `${text.length} / ${max} characters`);

  length("Title", head.title, 60);
  length("Description", head.description, 160);

  const here = location.pathname.replace(/\.html$/, "");
  const canonical = resolve(head.canonical);
  if (!head.canonical) add("warn", "Canonical", "none (right only on the 404 page)");
  else if (!canonical) add("error", "Canonical", `doesn't parse: ${head.canonical}`);
  else if (canonical.pathname !== here) add("warn", "Canonical", `${canonical.href}, not this page (${here})`);
  else add("ok", "Canonical", canonical.href);

  add(
    head.robots.includes("noindex") ? "warn" : "ok",
    "Robots",
    head.robots.includes("noindex") ? `${head.robots}: kept out of search results and the sitemap` : "indexable",
  );

  const required = ["type", "title", "description", "url", "image", "image:width", "image:height", "image:alt"];
  const missing = required.filter((k) => !head.og[k]);
  add(
    missing.length ? "warn" : "ok",
    "Open Graph",
    missing.length ? `missing og:${missing.join(", og:")}` : "complete",
  );
  if (head.og.url && !isAbsolute(head.og.url))
    add("warn", "og:url", `${head.og.url} isn't an absolute URL: networks can't follow it`);
  const share = imageCheck(head, image);
  if (share) list.push(share);
  add(head.twitterCard ? "ok" : "warn", "X card", head.twitterCard || "missing twitter:card");

  if (!head.jsonLd.length) add("warn", "Structured data", "no JSON-LD");
  head.jsonLd.forEach((block, i) =>
    block.error
      ? add("error", `JSON-LD ${i + 1}`, `doesn't parse: ${block.error}`)
      : add("ok", `JSON-LD ${i + 1}`, block.types.join(", ")),
  );

  add(head.h1 === 1 ? "ok" : "warn", "h1", `${head.h1} on the page`);
  add(
    head.skips.length ? "warn" : "ok",
    "Heading order",
    head.skips.length ? head.skips.join("; ") : "no skipped levels",
  );
  return list;
}

const escape = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** text cut where a result or a card would cut it, on a word boundary */
const cut = (s: string, max: number) => {
  if (s.length <= max) return s;
  const head = s.slice(0, max - 1);
  const space = head.lastIndexOf(" ");
  return `${(space > 0 ? head.slice(0, space) : head).trimEnd()}…`;
};

/** "daat.ua › uk-UA › atlas › findings", as a search result writes the address */
const crumbs = (url: string) => {
  const u = resolve(url) ?? new URL(location.href);
  return [u.host, ...u.pathname.split("/").filter(Boolean)].map(escape).join(" › ");
};

function searchPreview(head: Head) {
  return `
    <section class="serp" aria-label="Search result">
      <div class="serp__site">
        <span class="serp__icon">D</span>
        <span><b>Daat</b><br><small>${crumbs(head.canonical)}</small></span>
      </div>
      <p class="serp__title">${escape(cut(head.title, 60)) || "<em>no title</em>"}</p>
      <p class="serp__text">${escape(cut(head.description, 160)) || "<em>no description</em>"}</p>
    </section>
    <p class="note">About as Google shows it: it cuts titles near 600 px (~60 characters) and descriptions near 160.</p>`;
}

function sharePreviews(head: Head, image: ShareImageState) {
  const host = escape((resolve(head.og.url) ?? resolve(head.canonical) ?? new URL(location.href)).host);
  const src = image.status === "loaded" ? image.src! : resolve(head.og.image)?.href;
  const picture =
    head.og.image && src && image.status !== "failed"
      ? `<img src="${escape(src)}" alt="${escape(head.og["image:alt"] ?? "")}">`
      : `<div class="noimage">${head.og.image ? "og:image doesn't load" : "no og:image"}</div>`;
  const title = head.og.title || head.title;
  const text = head.og.description || head.description;
  const note = imageCheck(head, image);
  return `
    <p class="label">Facebook, LinkedIn</p>
    <section class="card card--fb">${picture}<div><small>${host.toUpperCase()}</small><b>${escape(cut(title, 88))}</b><span>${escape(cut(text, 110))}</span></div></section>
    <p class="label">X (${escape(head.twitterCard || "no card")})</p>
    <section class="card card--x">${picture}<small>${host}</small><b>${escape(cut(title, 70))}</b></section>
    <p class="label">Telegram</p>
    <section class="card card--tg"><small>${escape(head.og.site_name || "Daat")}</small><b>${escape(title)}</b><span>${escape(cut(text, 200))}</span>${picture}</section>
    ${note ? `<p class="note">Image: ${escape(note.detail)}</p>` : ""}`;
}

function checkList(list: Check[]) {
  const mark = { ok: "✓", warn: "!", error: "✕" };
  return `<ul class="checks">${list
    .map(
      (c) =>
        `<li class="${c.level}"><i>${mark[c.level]}</i><b>${escape(c.label)}</b><span>${escape(c.detail)}</span></li>`,
    )
    .join("")}</ul>`;
}

// Astro's toolbar window is fixed-size UI, and the cards copy each network's own sizes, so plain px here (not the
// site's --px scale or type tokens)
const STYLE = `
  :host { all: initial; }
  * { box-sizing: border-box; }
  .tabs { display: flex; gap: 4px; margin-bottom: 16px; }
  .tabs button { font: inherit; font-size: 13px; padding: 6px 12px; border-radius: 6px; border: 1px solid #343841;
    background: transparent; color: inherit; cursor: pointer; }
  .tabs button[aria-selected="true"] { background: #fff; color: #13151a; border-color: #fff; }
  .tabs button:focus-visible, [role="tabpanel"]:focus-visible { outline: 2px solid #f5b14c; outline-offset: 2px; }
  .tabs .count { margin-left: 6px; color: #f5b14c; }
  .tabs .count:empty { display: none; }
  .note, .label { margin: 12px 0 6px; font-size: 12px; color: #8a8f98; }
  .label { margin-top: 16px; text-transform: uppercase; letter-spacing: .06em; }
  .serp { background: #fff; color: #202124; border-radius: 10px; padding: 16px 18px; font-family: Arial, sans-serif; }
  .serp__site { display: flex; gap: 10px; align-items: center; font-size: 14px; line-height: 1.3; }
  .serp__site small { color: #4d5156; font-size: 12px; }
  .serp__icon { display: grid; place-items: center; width: 26px; height: 26px; border-radius: 50%; background: #f1f3f4;
    font-weight: 700; color: #1c2632; }
  .serp__title { margin: 8px 0 4px; color: #1a0dab; font-size: 20px; line-height: 1.3; }
  .serp__text { margin: 0; color: #4d5156; font-size: 14px; line-height: 1.58; }
  .card { background: #fff; color: #1c1e21; overflow: hidden; font-family: system-ui, sans-serif; }
  .card img, .noimage { display: block; width: 100%; aspect-ratio: 1.91 / 1; object-fit: cover; background: #e4e6eb; }
  .noimage { display: grid; place-items: center; color: #b3261e; font-size: 13px; }
  .card--fb { border: 1px solid #dadde1; }
  .card--fb div { display: grid; gap: 2px; padding: 10px 12px; background: #f0f2f5; font-size: 14px; }
  .card--fb small { color: #606770; font-size: 12px; }
  .card--fb span { color: #606770; }
  .card--x { position: relative; border: 1px solid #cfd9de; border-radius: 16px; }
  .card--x small { position: absolute; left: 12px; bottom: 36px; padding: 2px 6px; border-radius: 4px;
    background: rgba(0,0,0,.77); color: #fff; font-size: 12px; }
  .card--x b { display: block; padding: 8px 12px; font-size: 14px; font-weight: 400; }
  .card--tg { display: grid; gap: 4px; max-width: 420px; padding: 8px 10px 10px 14px; border-left: 3px solid #3390ec;
    border-radius: 6px; background: #eef6fd; font-size: 14px; }
  .card--tg small { color: #3390ec; font-weight: 600; }
  .card--tg img { border-radius: 6px; margin-top: 6px; }
  .checks { display: grid; gap: 6px; margin: 0; padding: 0; list-style: none; font-size: 13px; }
  .checks li { display: grid; grid-template-columns: 20px 110px 1fr; gap: 8px; align-items: baseline; }
  .checks i { font-style: normal; font-weight: 700; text-align: center; }
  .checks b { color: #fff; font-weight: 600; }
  .checks span { overflow-wrap: anywhere; }
  .ok i { color: #4ade80; } .warn i { color: #f5b14c; } .error i { color: #f87171; }
  em { color: #b3261e; }
`;

const TABS = [
  { id: "search", label: "Search" },
  { id: "share", label: "Share" },
  { id: "checks", label: "Checks" },
] as const;
type Tab = (typeof TABS)[number]["id"];

export default defineToolbarApp({
  init(canvas, app) {
    const win = document.createElement("astro-dev-toolbar-window");
    win.style.maxHeight = "min(80vh, 760px)";
    win.style.overflowY = "auto";
    const style = document.createElement("style");
    style.textContent = STYLE;

    // the tabs stay in place while the panel's content changes, so focus stays on the tab (ARIA tabs pattern:
    // arrow keys, Home and End move between tabs, only the selected one is in the tab order)
    const tablist = document.createElement("div");
    tablist.className = "tabs";
    tablist.setAttribute("role", "tablist");
    tablist.setAttribute("aria-label", "SEO");
    const panel = document.createElement("div");
    panel.id = "seo-panel";
    panel.setAttribute("role", "tabpanel");
    panel.tabIndex = 0;
    const buttons = TABS.map(({ id, label }) => {
      const b = document.createElement("button");
      b.id = `seo-tab-${id}`;
      b.dataset.tab = id;
      b.setAttribute("role", "tab");
      b.setAttribute("aria-controls", panel.id);
      b.innerHTML = `${label}<span class="count"></span>`;
      return b;
    });
    tablist.append(...buttons);
    win.append(style, tablist, panel);
    canvas.append(win);

    let tab: Tab = "search";
    let head = readHead();
    let image: ShareImageState = { status: "none" };
    let imageKey = "";

    const update = () => {
      const list = checks(head, image);
      const problems = list.filter((c) => c.level !== "ok").length;
      app.toggleNotification({
        state: problems > 0,
        level: list.some((c) => c.level === "error") ? "error" : "warning",
      });
      buttons.forEach((b) => {
        const selected = b.dataset.tab === tab;
        b.setAttribute("aria-selected", String(selected));
        b.tabIndex = selected ? 0 : -1;
        if (b.dataset.tab === "checks") b.querySelector(".count")!.textContent = problems ? String(problems) : "";
      });
      panel.setAttribute("aria-labelledby", `seo-tab-${tab}`);
      panel.innerHTML =
        tab === "search" ? searchPreview(head) : tab === "share" ? sharePreviews(head, image) : checkList(list);
    };

    /** read the page again; the share image is loaded once per page and image URL, then folded into the checks */
    const refresh = () => {
      head = readHead();
      const key = `${location.pathname}\n${head.og.image ?? ""}`;
      if (key !== imageKey) {
        imageKey = key;
        image = head.og.image ? { status: "loading" } : { status: "none" };
        if (head.og.image)
          loadShareImage(head).then((result) => {
            if (imageKey !== key) return; // the page or its image changed meanwhile
            image = result;
            update();
          });
      }
      update();
    };

    const select = (next: Tab, focus = false) => {
      tab = next;
      update();
      if (focus) buttons.find((b) => b.dataset.tab === next)!.focus();
    };
    buttons.forEach((b) => b.addEventListener("click", () => select(b.dataset.tab as Tab)));
    tablist.addEventListener("keydown", (e) => {
      const i = TABS.findIndex((t) => t.id === tab);
      const to = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: TABS.length - 1 }[e.key];
      if (to === undefined) return;
      e.preventDefault();
      select(TABS[(to + TABS.length) % TABS.length].id, true);
    });

    refresh();
    app.onToggled(({ state }) => state && refresh());
    // the site swaps pages without a reload (page transitions): read the new page's head
    document.addEventListener("astro:page-load", refresh);
  },
});
