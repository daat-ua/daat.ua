// Navigation copy: table of contents, global menu and footer.
// TODO content: the menu, directions, cookie settings, site map and social profiles are placeholders.

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

/** A main menu entry: a plain link, or a group that unfolds its sub-items */
export type MenuItem = Link | { label: string; items: Link[] };

const placeholder = (...labels: string[]): Link[] => labels.map((label) => ({ label, href: "#" }));

export const menu: MenuItem[] = [
  {
    label: "Що ми робимо",
    items: placeholder("Діагностика ATLAS", "Дорожня карта зростання", "Супровід упровадження"),
  },
  { label: "Галузі", items: placeholder("Аутсорс і аутстаф", "Продуктові компанії", "Інвестори та покупці") },
  { label: "Про нас", items: placeholder("Команда", "Підхід і методологія", "Контакти") },
  { label: "Кар’єра", href: "#" },
  { label: "Кейси", href: "#testimonials-and-case-studies" },
  { label: "Медіа", items: placeholder("Знахідки аудитів", "Статті", "Події") },
  { label: "Актуальне", items: placeholder("AI у delivery", "Fixed-price без збитків", "Підготовка до інвестора") },
];

export const directions: Link[] = placeholder("Daat ATLAS", "Daat Delivery", "Daat Engineering", "Daat Advisory");

export const legalLinks: Link[] = [
  { label: "Політика конфіденційності", href: "/uk-UA/privacy-policy" },
  { label: "Умови використання", href: "/uk-UA/terms-of-use" },
  ...placeholder("Налаштування cookie", "Карта сайту"),
];

export type SocialNetwork = "LinkedIn" | "Facebook" | "Instagram" | "YouTube";
export const social: { network: SocialNetwork; href: string }[] = [
  { network: "LinkedIn", href: "#" },
  { network: "Facebook", href: "#" },
  { network: "Instagram", href: "#" },
  { network: "YouTube", href: "#" },
];
