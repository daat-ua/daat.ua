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
      const data = JSON.parse(s.textContent ?? "");
      const nodes: { "@type"?: string | string[] }[] = data["@graph"] ?? [data];
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

function checks(head: Head): Check[] {
  const list: Check[] = [];
  const add = (level: Level, label: string, detail: string) => list.push({ level, label, detail });
  const length = (label: string, text: string, max: number) =>
    !text
      ? add("error", label, "missing")
      : add(text.length > max ? "warn" : "ok", label, `${text.length} / ${max} characters`);

  length("Title", head.title, 60);
  length("Description", head.description, 160);

  const here = location.origin + location.pathname.replace(/\.html$/, "");
  if (!head.canonical) add("warn", "Canonical", "none (right only on the 404 page)");
  else {
    const path = new URL(head.canonical).pathname;
    const same = path === location.pathname.replace(/\.html$/, "");
    add(same ? "ok" : "warn", "Canonical", same ? head.canonical : `${head.canonical}, not this page (${here})`);
  }

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
  return `${head.slice(0, head.lastIndexOf(" ") > max / 2 ? head.lastIndexOf(" ") : undefined).trimEnd()}…`;
};

/** "daat.ua › uk-UA › atlas › findings", as a search result writes the address */
const crumbs = (url: string) => {
  const u = new URL(url || location.href);
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

function sharePreviews(head: Head) {
  const host = escape(new URL(head.og.url || head.canonical || location.href).host);
  const image = head.og.image
    ? `<img src="${escape(head.og.image)}" alt="${escape(head.og["image:alt"] ?? "")}" data-share>`
    : `<div class="noimage">no og:image</div>`;
  const title = head.og.title || head.title;
  const text = head.og.description || head.description;
  return `
    <p class="label">Facebook, LinkedIn</p>
    <section class="card card--fb">${image}<div><small>${host.toUpperCase()}</small><b>${escape(cut(title, 88))}</b><span>${escape(cut(text, 110))}</span></div></section>
    <p class="label">X (${escape(head.twitterCard || "no card")})</p>
    <section class="card card--x">${image}<small>${host}</small><b>${escape(cut(title, 70))}</b></section>
    <p class="label">Telegram</p>
    <section class="card card--tg"><small>${escape(head.og.site_name || "Daat")}</small><b>${escape(title)}</b><span>${escape(cut(text, 200))}</span>${image}</section>
    <p class="note" data-image-note></p>`;
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

const STYLE = `
  :host { all: initial; }
  * { box-sizing: border-box; }
  .tabs { display: flex; gap: 4px; margin-bottom: 16px; }
  .tabs button { font: inherit; font-size: 13px; padding: 6px 12px; border-radius: 6px; border: 1px solid #343841;
    background: transparent; color: inherit; cursor: pointer; }
  .tabs button[aria-selected="true"] { background: #fff; color: #13151a; border-color: #fff; }
  .tabs .count { margin-left: 6px; color: #f5b14c; }
  h2 { margin: 0 0 12px; font-size: 18px; color: #fff; }
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

export default defineToolbarApp({
  init(canvas, app) {
    const win = document.createElement("astro-dev-toolbar-window");
    win.style.maxHeight = "min(80vh, 760px)";
    win.style.overflowY = "auto";
    const style = document.createElement("style");
    style.textContent = STYLE;
    const body = document.createElement("div");
    win.append(style, body);
    canvas.append(win);

    let tab: "search" | "share" | "checks" = "search";

    const render = () => {
      const head = readHead();
      const list = checks(head);
      const problems = list.filter((c) => c.level !== "ok").length;
      app.toggleNotification({
        state: problems > 0,
        level: list.some((c) => c.level === "error") ? "error" : "warning",
      });
      const tabButton = (id: typeof tab, label: string, count = 0) =>
        `<button role="tab" data-tab="${id}" aria-selected="${tab === id}">${label}${count ? `<span class="count">${count}</span>` : ""}</button>`;
      body.innerHTML = `
        <div class="tabs" role="tablist">${tabButton("search", "Search")}${tabButton("share", "Share")}${tabButton("checks", "Checks", problems)}</div>
        ${tab === "search" ? searchPreview(head) : tab === "share" ? sharePreviews(head) : checkList(list)}`;
      body.querySelectorAll<HTMLButtonElement>("[data-tab]").forEach((b) =>
        b.addEventListener("click", () => {
          tab = b.dataset.tab as typeof tab;
          render();
        }),
      );
      checkShareImage(body, head);
    };

    render();
    app.onToggled(({ state }) => state && render());
    // the site swaps pages without a reload (page transitions): read the new page's head
    document.addEventListener("astro:page-load", () => render());
  },
});

/** the share image's real size, and a fallback to this dev server when the canonical host (daat.ua) isn't reachable */
function checkShareImage(root: HTMLElement, head: Head) {
  const note = root.querySelector<HTMLElement>("[data-image-note]");
  const images = [...root.querySelectorAll<HTMLImageElement>("img[data-share]")];
  if (!note || !images.length) return;
  const first = images[0];
  const report = () => {
    const { naturalWidth: w, naturalHeight: h } = first;
    const tagged = head.og["image:width"] && head.og["image:height"];
    const declared = `${head.og["image:width"]} × ${head.og["image:height"]}`;
    const problems = [
      !/^https?:\/\//.test(head.og.image) && "og:image isn't an absolute URL",
      !tagged && "no og:image:width / og:image:height (networks lay the card out late)",
      tagged && w && `${w} × ${h}` !== declared && `the tags say ${declared}`,
      w &&
        Math.abs(w / h - 1200 / 630) > 0.02 &&
        `ratio ${(w / h).toFixed(2)}, not 1.91 (1200 × 630), so networks crop it`,
      w && w < 1200 && "narrower than 1200 px, so it may look soft on large cards",
    ].filter(Boolean);
    note.textContent = `The image is ${w} × ${h}. ${problems.length ? `${problems.join("; ")}.` : "1200 × 630, as the networks want."}`;
  };
  const fallBack = () => {
    const local = new URL(new URL(head.og.image).pathname, location.origin).href;
    if (first.src === local) {
      note.textContent = `The image doesn't load: ${head.og.image}`;
      return;
    }
    images.forEach((img) => (img.src = local));
    note.textContent = `${new URL(head.og.image).host} isn't reachable from here; showing ${local}`;
  };
  first.addEventListener("load", report, { once: true });
  first.addEventListener("error", fallBack);
  if (first.complete && first.naturalWidth) report();
}
