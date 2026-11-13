// Case studies (DAA-230): the content lives in Sanity ("Case Studies", `caseStudy`); this maps the keys of its
// lists to Ukrainian. `satisfies` fails the build if the Studio gains an option that has no name here.

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
