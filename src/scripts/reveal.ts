// Scroll reveals (DAA-243): content arrives as it scrolls into view, once, then stays still. A page opts in by
// importing this script (the ATLAS page, the findings catalogue, the case studies index, delivery management,
// Daat Talks);
// the rules below find what each page has.
// Five patterns: section titles in two beats (the Light words rise, the Medium ones land 140ms later), text and
// cards rising, charts and videos unmasking, the roadmap's impact bars growing to their values, the FAQ fading.
// The hero, the scrubbed clip, the roadmap's horizon animation and the methodology rail keep their own motion.
//
// Nothing is hidden unless this runs: elements wait in .reveal-pending only once it has measured them, and only
// below 85% of the window. Already on screen, above a deep link's target, scrolled past too fast to be seen or
// left when the page reaches its end: shown at once. Reduced motion and automation (the visual check) skip it.
// While revealing, an element carries .is-revealing (the transition); then the classes come off, so its own
// transitions (hover, the video teasers' open and close) are untouched. Styles: src/styles/patterns.css.

type Pattern = "beat" | "rise" | "media" | "bar" | "fade";
/** what reveals: a pattern for each element the selector finds, or for each item of a group, `step` ms apart */
const RULES: { selector: string; pattern: Pattern; items?: string; step?: number }[] = [
  // the titles, in two beats
  { selector: "main section .section-title", pattern: "beat" },
  // intros and lone blocks
  {
    selector:
      ".why__intro, .for-whom__intro, .report__intro, .example, .impact__title, .impact__caption, .cases__title, .method__aside, .report__files, .report__cta, .reasons__cta",
    pattern: "rise",
  },
  // cards and lists, in reading order
  {
    selector: ".problems, .reasons, .audience-tabs, .report-toc, .horizons, .situations",
    items: ":scope > *",
    pattern: "rise",
  },
  { selector: ".findings__track", items: ":scope > *", pattern: "rise" },
  // pictures
  { selector: ".why-daat__photo, .vt", pattern: "media" },
  { selector: ".report__charts", items: ":scope > *", pattern: "media", step: 120 },
  // the impact table's bars, row after row
  { selector: ".impact__scroll", items: ".impact__fill", pattern: "bar", step: 40 },
  // the questions
  { selector: ".faq__list", items: ":scope > *", pattern: "fade", step: 60 },
  // the case studies index: «Усі кейси», each case's photo and its text line by line, the rule between cases
  { selector: ".cases-all__title", pattern: "beat" },
  { selector: ".cases-featured__media, .cases-row__media", pattern: "media" },
  { selector: ".cases-featured__text, .cases-row__text", items: ":scope > *", pattern: "rise" },
  { selector: ".cases-divider", pattern: "bar" },
  // delivery management: the latest episode's cover and its text, «Усі випуски», then each episode as it comes in
  // (one by one, not as a group: the list is long)
  { selector: ".dm-latest__media", pattern: "media" },
  { selector: ".dm-latest", items: ":scope > :not(.dm-latest__media)", pattern: "rise" },
  { selector: ".dm-list__title", pattern: "beat" },
  { selector: ".dm-list > li", pattern: "rise" },
  // Daat Talks: each episode's cover and its text, its articles one by one, the rule between episodes, the pages
  { selector: ".talks-episode__cover", pattern: "media" },
  { selector: ".talks-episode__main", items: ":scope > :not(.talks-episode__cover)", pattern: "rise" },
  { selector: ".talks-label, .talks-pages", pattern: "rise" },
  { selector: ".talks-episode__articles li", pattern: "rise" },
  { selector: ".talks-divider", pattern: "bar" },
];
const STEP = 70;
/** after the sixth item a group stops adding delay, so a long list never keeps anyone waiting */
const MAX_STAGGER = 5;
/** the longest reveal (media) plus its largest delay, with room: then the classes come off */
const CLEANUP_MS = 1800;

const root = document.documentElement;
const skip =
  matchMedia("(prefers-reduced-motion: reduce)").matches || navigator.webdriver || !("IntersectionObserver" in window);

if (!skip) {
  root.classList.add("has-reveal");
  /** what's watched: a lone element, or a group whose items start together and stagger by their delays */
  const watched = new Map<Element, HTMLElement[]>();
  const line = () => innerHeight * 0.85;

  for (const rule of RULES) {
    for (const el of document.querySelectorAll<HTMLElement>(rule.selector)) {
      if (watched.has(el) || el.closest(".hero, .scrub, .finding-hero")) continue;
      const items = rule.items ? [...el.querySelectorAll<HTMLElement>(rule.items)] : [el];
      if (!items.length) continue;
      // already on screen or above it: no reveal, it's simply there
      if (el.getBoundingClientRect().top < line()) continue;
      items.forEach((item, i) => {
        item.dataset.reveal = rule.pattern;
        item.classList.add("reveal-pending");
        if (rule.items) item.style.setProperty("--reveal-delay", `${Math.min(i, MAX_STAGGER) * (rule.step ?? STEP)}ms`);
      });
      watched.set(el, items);
    }
  }

  function show(target: Element) {
    const items = watched.get(target);
    if (!items) return;
    watched.delete(target);
    io.unobserve(target);
    for (const item of items) {
      item.classList.add("is-revealing");
      item.classList.remove("reveal-pending");
    }
    setTimeout(() => {
      for (const item of items) {
        item.classList.remove("is-revealing");
        delete item.dataset.reveal;
        item.style.removeProperty("--reveal-delay");
      }
    }, CLEANUP_MS);
    if (!watched.size) removeEventListener("scroll", onScroll);
  }

  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        // in view, or above it (scrolled past too fast, or a deep link landed below it): show
        const above = !e.isIntersecting && e.boundingClientRect.bottom < (e.rootBounds?.top ?? 0);
        if (e.isIntersecting || above) show(e.target);
      }
    },
    { rootMargin: "0px 0px -15% 0px" },
  );
  watched.forEach((_, el) => io.observe(el));

  // the page's end: whatever is left can never rise past the 85% line, so it shows
  function onScroll() {
    if (innerHeight + scrollY >= document.documentElement.scrollHeight - 4) [...watched.keys()].forEach(show);
  }
  addEventListener("scroll", onScroll, { passive: true });

  // a reader tabbing into hidden content meets it at once
  document.addEventListener("focusin", (e) => {
    const target = [...watched.keys()].find((el) => el.contains(e.target as Node));
    if (target) show(target);
  });
}

export {}; // a module: its names stay its own
