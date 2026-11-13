// Case studies (DAA-230): the content lives in Sanity ("Case Studies", `caseStudy`); this maps the keys of its
// lists to Ukrainian (`satisfies` fails the build if the Studio gains an option that has no name here), and
// holds the index page's placeholder content.

import type { ImageMetadata } from "astro";
import case1 from "../assets/images/cases/case-1.webp";
import case2Full from "../assets/images/cases/case-2-full.jpg";
import case3 from "../assets/images/cases/case-3.webp";
import case4 from "../assets/images/cases/case-4.webp";
import type { CaseStudy } from "../sanity/sanity.types";
import type { Enabler } from "./enablers";

export const industryNames = {
  "it-services": "IT-сервіси / аутсорс",
  product: "Продукт",
  outstaffing: "Аутстаф",
  other: "Інше",
} as const satisfies Record<CaseStudy["industry"], string>;

/** how an anonymous testimonial is signed: "CEO, IT-сервісна компанія" */
export const industryCompany = {
  "it-services": "IT-сервісна компанія",
  product: "продуктова компанія",
  outstaffing: "аутстаф-компанія",
  other: "IT-компанія",
} as const satisfies Record<CaseStudy["industry"], string>;

export const commissionedByNames = {
  "founder-ceo": "Засновник-CEO",
  ceo: "CEO",
  cto: "CTO",
  coo: "COO",
  investor: "Інвестор",
} as const satisfies Record<NonNullable<CaseStudy["commissionedBy"]>, string>;

/** the maturity profile's fields (Sanity field names can't hold hyphens) → the enablers' keys */
export const maturityFields = {
  strategy_portfolio: "strategy-portfolio",
  structure_governance: "structure-governance",
  delivery_operating_system: "delivery-operating-system",
  engineering_delivery_culture: "engineering-delivery-culture",
  leadership_decision_making: "leadership-decision-making",
  people_capacity: "people-capacity",
  capabilities_competency: "capabilities-competency",
} as const satisfies Record<string, Enabler>;

// ---------- The index page (/uk-UA/atlas/case-studies) ----------
// TODO DAA-229: placeholder content until the index reads the published cases from Sanity (the featured one,
// then the rest, newest first). Titles are the ATLAS page's example cases; square brackets mark what a real
// case fills in.

export interface CaseTeaser {
  image: ImageMetadata;
  /** e.g. "IT-сервіси · ~50 людей" */
  tag: string;
  /** who commissioned the diagnosis */
  role: string;
  title: string;
  lead: string;
  /** the case's page, relative to /uk-UA/atlas/case-studies/ */
  slug: string;
  /** the main figure and what it measures; the featured case shows it */
  figure?: { value: string; label: string };
}

export const featuredCaseSample: CaseTeaser = {
  image: case2Full, // full size: it fills a tall half of the featured panel
  tag: "IT-сервіси · ~50 людей",
  role: "Засновник-CEO",
  title: "Звідки береться стеля зростання, коли все тримається на засновнику",
  lead: "Діагностика ATLAS за 5 тижнів знайшла одне ключове обмеження — і клієнт почав його усувати ще до фінального звіту.",
  slug: "growth-ceiling-founder",
  figure: { value: "2,5 → 3,4", label: "цільовий індекс зрілості за 18 місяців" },
};

export const caseListSample: CaseTeaser[] = [
  {
    image: case1,
    tag: "Аутсорс · 120 людей",
    role: "CEO",
    title: "Fixed-price без збитків: як аутсорс-компанія вбудувала Discovery у кожну угоду",
    lead: "[1 речення про результат]",
    slug: "fixed-price-discovery",
  },
  {
    image: case3,
    tag: "Продукт · 60 людей",
    role: "CTO",
    title: "CTO, який знову став CTO: як продуктова команда вийшла з режиму пожеж",
    lead: "[1 речення про результат]",
    slug: "cto-out-of-firefighting",
  },
  {
    image: case4,
    tag: "Аутсорс · 250 людей",
    role: "Інвестор",
    title: "Засновник більше не вузьке місце: як компанія підготувала управління до інвестора",
    lead: "[1 речення про результат]",
    slug: "founder-no-longer-bottleneck",
  },
  {
    image: case1,
    tag: "Аутстаф · 80 людей",
    role: "Засновник-CEO",
    title: "Один клієнт — один ризик: як компанія диверсифікувала виручку за рік",
    lead: "[1 речення про результат]",
    slug: "one-client-one-risk",
  },
];
