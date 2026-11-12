// Navigation copy: table of contents, global menu and footer.
// TODO content: the about, case studies and Daat talks pages don't exist yet; cookie settings and social
// profiles are placeholders.

import { getRelativeLocaleUrl } from "astro:i18n";

/** A page's URL, the locale keeping its casing ("uk-UA", not "uk-ua") */
const page = (path: string) => getRelativeLocaleUrl("uk-UA", path, { normalizeLocale: false });

export interface Link {
  label: string;
  href: string;
}

/** Floating table of contents: one entry per section beside it, in page order */
export const toc: Link[] = [
  { label: "Чому зараз?", href: "#why-now" },
  { label: "Для кого Atlas?", href: "#for-whom" },
  { label: "Що ви отримаєте", href: "#deliverables" },
  { label: "Що всередині звіту", href: "#report" },
  { label: "Дорожня карта", href: "#roadmap" },
  { label: "Відгуки й кейси", href: "#testimonials-and-case-studies" },
  { label: "Як працює ATLAS", href: "#methodology" },
  { label: "Знахідки аудитів", href: "#audit-findings" },
  { label: "Часті питання", href: "#faq" },
];

/** A main menu entry: a plain link, or a group that unfolds its sub-items (`open`: unfolded at first) */
export type MenuItem = Link | { label: string; items: Link[]; open?: boolean };

const placeholder = (...labels: string[]): Link[] => labels.map((label) => ({ label, href: "#" }));

export const menu: MenuItem[] = [
  // the ATLAS page's sections, as in its table of contents; full URLs, so they work from every page
  {
    label: "Діагностика ATLAS",
    items: toc.map(({ label, href }) => ({ label, href: `/uk-UA/atlas${href}` })),
    open: true,
  },
  { label: "Про нас", href: "/uk-UA/about" },
  { label: "Кейси", href: "/uk-UA/case-studies" },
];

/** "Наші проєкти": Daat's projects beside the consulting */
export const projects: Link[] = [{ label: "Daat talks", href: "/uk-UA/daat-talks" }];

export const legalLinks: Link[] = [
  { label: "Політика конфіденційності", href: page("privacy-policy") },
  { label: "Умови використання", href: page("terms-of-use") },
  ...placeholder("Налаштування cookie"),
  { label: "Карта сайту", href: page("sitemap") },
];

export type SocialNetwork = "LinkedIn" | "Facebook" | "Instagram" | "YouTube";
export const social: { network: SocialNetwork; href: string }[] = [
  { network: "LinkedIn", href: "#" },
  { network: "Facebook", href: "#" },
  { network: "Instagram", href: "#" },
  { network: "YouTube", href: "#" },
];
