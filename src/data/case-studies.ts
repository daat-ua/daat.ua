// Case studies (DAA-230): the content lives in Sanity ("Case Studies", `caseStudy`); this maps the keys of its
// lists to Ukrainian. `satisfies` fails the build if the Studio gains an option that has no name here.

import type { SanityImageSource } from "@sanity/image-url";
import { urlFor } from "../sanity/image";
import type { CaseStudy } from "../sanity/sanity.types";
import type { Enabler } from "./enablers";

interface LogoFields {
  anonymised: boolean | null;
  clientLogo: {
    alt: string | null;
    asset: {
      url: string | null;
      extension: string | null;
      metadata: { dimensions: { width: number | null; height: number | null } | null } | null;
    } | null;
  } | null;
}

/** A named client's logo (never for an anonymised case): an SVG as uploaded, anything else scaled to `height`
 * (the CSS height; twice that for sharp screens). Null without a logo. */
export function clientLogo(c: LogoFields, height: number) {
  const logo = c.anonymised === false ? c.clientLogo : null;
  if (!logo?.asset) return null;
  const { asset } = logo;
  const svg = asset.extension === "svg" && Boolean(asset.url);
  return {
    /** an SVG: a vector on a transparent ground, which can be recoloured */
    svg,
    src:
      svg && asset.url
        ? asset.url
        : urlFor(logo as SanityImageSource)
            .height(height * 2)
            .fit("max")
            .url(),
    alt: logo.alt ?? "",
    width: asset.metadata?.dimensions?.width ?? undefined,
    height: asset.metadata?.dimensions?.height ?? undefined,
  };
}

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
