// Navigation copy: table of contents, global menu and footer.
// TODO content: cookie settings are a placeholder.

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
  { label: "План змін", href: "#roadmap" },
  { label: "Відгуки й кейси", href: "#testimonials-and-case-studies" },
  { label: "Як працює ATLAS", href: "#methodology" },
  { label: "Знахідки аудитів", href: "#audit-findings" },
  { label: "Часті питання", href: "#faq" },
];

/** A main menu entry: a plain link, or a group that unfolds its sub-items (`open`: unfolded at first) */
export type MenuItem = Link | { label: string; items: Link[]; open?: boolean };

const placeholder = (...labels: string[]): Link[] => labels.map((label) => ({ label, href: "#" }));

/** the menu's own wording for an ATLAS section, where it differs from the page's table of contents */
const MENU_LABELS: Record<string, string> = {
  "#testimonials-and-case-studies": "Відгуки наших клієнтів",
};

export const menu: MenuItem[] = [
  // the ATLAS page's sections, as in its table of contents but the last two (the findings have their own entry,
  // the FAQ is left to the page); full URLs, so they work from every page
  {
    label: "Діагностика ATLAS",
    items: toc.slice(0, -2).map(({ label, href }) => ({
      label: MENU_LABELS[href] ?? label,
      href: `/uk-UA/atlas${href}`,
    })),
    open: true,
  },
  { label: "Знахідки аудитів", href: page("atlas/findings") },
  { label: "Кейси", href: "/uk-UA/atlas/case-studies" },
  { label: "Про нас", href: "/uk-UA/about" },
];

/** the contact page: the header's link beside the menu button, and the site map */
export const contact: Link = { label: "Зв’язатися з нами", href: page("atlas/contact-us") };

/** "Наші проєкти": Daat's projects beside the consulting */
export const projects: Link[] = [
  { label: "Все про менеджмент делівері", href: page("delivery-management") },
  { label: '<span class="brand">Daat</span> talks', href: page("daat-talks") },
];

export const legalLinks: Link[] = [
  { label: "Політика конфіденційності", href: page("privacy-policy") },
  { label: "Умови використання", href: page("terms-of-use") },
  ...placeholder("Налаштування cookie"),
  { label: "Карта сайту", href: page("sitemap") },
];

export type SocialNetwork = "LinkedIn" | "Facebook" | "Instagram" | "YouTube";
export const social: { network: SocialNetwork; href: string }[] = [
  { network: "LinkedIn", href: "https://www.linkedin.com/company/daat-ua" },
  { network: "YouTube", href: "https://www.youtube.com/@daat_ua" },
  { network: "Facebook", href: "https://facebook.com/daat.consulting" },
  { network: "Instagram", href: "https://www.instagram.com/daat.ua" },
];
