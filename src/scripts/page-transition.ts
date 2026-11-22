// Page transitions (DAA-243): moving to another part of the site plays the ripple, columns in three navies that
// spread from the click, cover the page and leave the same way, the Daat «D» held in the middle; moving within a
// part (index → item → article) plays the soft step: the header stays, an orange line runs along the top of the
// window and the content fades out and back in, rising when going deeper and dropping when going back up.
//
// The site loads each page in full, so a transition is two halves. Here, on a click: the first half plays, the
// kind is noted in sessionStorage and the page navigates. On the next page, an inline script in <head> (Base.astro)
// reads the note before the first paint, so the page starts covered (or its content hidden), and `arrive()` plays
// the second half. No note (a first visit, a typed URL, another site, Back/Forward) means no animation. Readers
// who ask for less motion get a plain fade. Markup and styles: src/components/PageTransition.astro.

const KEY = "daat:page-transition";
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");

/** the site's parts: one URL pattern each, the most specific first; a page in none is a service page */
const SECTIONS: [string, RegExp][] = [
  ["findings", /^\/uk-UA\/atlas\/findings(\/|$)/],
  ["cases", /^\/uk-UA\/atlas\/case-studies(\/|$)/],
  ["contact", /^\/uk-UA\/atlas\/contact-us$/],
  ["atlas", /^\/uk-UA\/atlas$/],
  ["delivery", /^\/uk-UA\/delivery-management(\/|$)/],
  ["talks", /^\/uk-UA\/(daat-talks|article)(\/|$)/],
  ["about", /^\/uk-UA\/about$/],
];

/** "/uk-UA/atlas.html", "/uk-UA/atlas/" → "/uk-UA/atlas" */
const clean = (path: string) => path.replace(/\.html$/, "").replace(/(.)\/$/, "$1");
const sectionOf = (path: string) => SECTIONS.find(([, re]) => re.test(path))?.[0];

/** how deep a page sits in its part: an index 0 (Daat Talks' later pages too), an item 1, a Daat Talks article 2 */
function depthOf(path: string) {
  if (path.startsWith("/uk-UA/article/")) return 2;
  const rest = path
    .split("/")
    .filter(Boolean)
    .slice(path.startsWith("/uk-UA/atlas/") ? 3 : 2);
  return rest.length === 0 || /^\d+$/.test(rest[0]) ? 0 : 1;
}

type Kind = "ripple" | "soft" | "fade";
type Dir = "up" | "down" | "level";
interface Note {
  kind: Kind;
  dir: Dir;
  /** where the click was, 0–1 across the screen: the ripple spreads from there and returns there */
  origin: number;
  at: number;
}

function transitionFor(from: string, to: string): Omit<Note, "origin" | "at"> {
  const a = sectionOf(from);
  const b = sectionOf(to);
  if (reducedMotion.matches) return { kind: "fade", dir: "level" };
  if (a && b && a !== b) return { kind: "ripple", dir: "level" };
  const d = depthOf(to) - depthOf(from);
  return { kind: "soft", dir: d > 0 ? "up" : d < 0 ? "down" : "level" };
}

// ---------- the pieces on the page ----------
const root = document.documentElement;
const layer = document.querySelector<HTMLElement>(".pt");
const phone = matchMedia("(width < 64rem)");
/** the columns in use: the phone set below 64rem, the desktop set above */
const strips = () => [
  ...(layer?.querySelectorAll<HTMLElement>(
    phone.matches ? ".pt__strips--phone .pt__strip" : ".pt__strips--desk .pt__strip",
  ) ?? []),
];
const mark = () => layer?.querySelector<HTMLElement>(".pt__mark");
const line = () => layer?.querySelector<HTMLElement>(".pt__line");
const main = () => document.querySelector<HTMLElement>("main");

const EASE_IN_OUT = "cubic-bezier(0.65, 0, 0.35, 1)";
const EASE_OUT = "cubic-bezier(0.16, 1, 0.3, 1)";
const COVER = 340;
const REVEAL = 560;
const STEP = 40;
const SHIFT = { up: 14, down: -14, level: 0 };

const finished = (animations: Animation[]) => Promise.all(animations.map((a) => a.finished)).then(() => {});
const originIndex = (origin: number, n: number) => Math.min(n - 1, Math.max(0, Math.floor(origin * n)));

// ---------- leaving: the first half ----------
async function leave(note: Omit<Note, "at">) {
  const page = main();
  layer?.classList.add("is-active");
  if (note.kind === "fade") {
    await page?.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 75, fill: "forwards" }).finished;
    return;
  }
  if (note.kind === "soft") {
    line()?.animate(
      [
        { transform: "scaleX(0)", opacity: 1 },
        { transform: "scaleX(0.85)", opacity: 1 },
      ],
      {
        duration: 320,
        easing: "cubic-bezier(0.25, 1, 0.5, 1)",
        fill: "forwards",
      },
    );
    await page?.animate(
      [
        { opacity: 1, transform: "none" },
        { opacity: 0, transform: `translateY(${-SHIFT[note.dir] / 2}px)` },
      ],
      { duration: 180, easing: "cubic-bezier(0.5, 0, 0.75, 0)", fill: "forwards" },
    ).finished;
    return;
  }
  layer?.classList.add("is-covering");
  const list = strips();
  const from = originIndex(note.origin, list.length);
  const last = Math.max(from, list.length - 1 - from) * STEP + COVER;
  mark()?.animate(
    [
      { opacity: 0, transform: "scale(0.4)" },
      { opacity: 1, transform: "none" },
    ],
    {
      duration: 180,
      delay: Math.max(0, last - 180),
      easing: "ease-out",
      fill: "forwards",
    },
  );
  await finished(
    list.map((s, i) =>
      s.animate([{ transform: "translateY(-101%)" }, { transform: "none" }], {
        duration: COVER,
        delay: Math.abs(i - from) * STEP,
        easing: EASE_IN_OUT,
        fill: "forwards",
      }),
    ),
  );
}

// ---------- arriving: the second half ----------
async function arrive(note: Note) {
  const page = main();
  if (note.kind === "fade") {
    await page?.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 75 }).finished;
    return;
  }
  if (note.kind === "soft") {
    line()?.animate(
      [
        { transform: "scaleX(0.85)", opacity: 1 },
        { transform: "scaleX(1)", opacity: 0 },
      ],
      {
        duration: 320,
        easing: "ease-out",
      },
    );
    await page?.animate(
      [
        { opacity: 0, transform: `translateY(${SHIFT[note.dir]}px)` },
        { opacity: 1, transform: "none" },
      ],
      {
        duration: 360,
        easing: EASE_OUT,
      },
    ).finished;
    return;
  }
  const list = strips();
  const from = originIndex(note.origin, list.length);
  await mark()?.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 140, fill: "forwards" }).finished;
  page?.animate(
    [
      { opacity: 0.4, transform: "translateY(14px)" },
      { opacity: 1, transform: "none" },
    ],
    {
      duration: REVEAL + (list.length - 1) * STEP * 0.6,
      delay: 120,
      easing: EASE_OUT,
      fill: "backwards",
    },
  );
  await finished(
    list.map((s, i) =>
      s.animate([{ transform: "none" }, { transform: "translateY(-101%)" }], {
        duration: REVEAL,
        delay: Math.abs(i - from) * STEP,
        easing: EASE_OUT,
        fill: "forwards",
      }),
    ),
  );
}

/** back to rest: nothing covered, nothing hidden, no animation left holding a frame */
function reset() {
  delete root.dataset.pt;
  layer?.classList.remove("is-active", "is-covering");
  for (const el of [main(), mark(), line(), ...strips()]) el?.getAnimations().forEach((a) => a.cancel());
}

// ---------- which clicks get a transition ----------
function target(e: MouseEvent) {
  if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return null;
  const a = (e.target as Element | null)?.closest?.("a");
  if (!a || !a.href || a.hasAttribute("download") || a.getAttribute("aria-disabled") === "true") return null;
  if (a.target && a.target !== "_self") return null;
  const url = new URL(a.href, location.href);
  if (url.origin !== location.origin || !url.pathname.startsWith("/uk-UA")) return null;
  if (/\.[a-z0-9]+$/i.test(url.pathname) && !url.pathname.endsWith(".html")) return null; // a file
  const from = clean(location.pathname);
  const to = clean(url.pathname);
  if (to === from && url.search === location.search) return null; // the same page: an anchor or a reload
  return { url, from, to };
}

let leaving = false;
document.addEventListener("click", (e) => {
  const t = target(e);
  if (!t || leaving) return;
  e.preventDefault();
  leaving = true;
  // the menu is a modal dialog in the top layer, above anything else: close it so the transition shows
  document.querySelector<HTMLDialogElement>("dialog[open]")?.close();
  const note = { ...transitionFor(t.from, t.to), origin: e.clientX / innerWidth || 0.5 };
  const go = () => {
    try {
      sessionStorage.setItem(KEY, JSON.stringify({ ...note, at: Date.now() } satisfies Note));
    } catch {
      // storage refused (a private window): the next page simply shows without its half
    }
    location.assign(t.url);
  };
  // whatever happens to the animation, the reader gets where they clicked
  const fallback = setTimeout(go, 900);
  leave(note).then(() => {
    clearTimeout(fallback);
    go();
  }, go);
});

// a page restored by Back/Forward comes back as it was left, not covered
addEventListener("pageshow", (e) => {
  if (!e.persisted) return;
  leaving = false;
  reset();
});

// the second half, when this page was reached through a transition (the inline script in <head> found the note)
const note = (window as Window & { __pageTransition?: Note }).__pageTransition;
if (note && root.dataset.pt) {
  arrive(note).finally(() => {
    reset();
    (window as Window & { __pageTransitionDone?: boolean }).__pageTransitionDone = true;
  });
} else {
  reset();
}
