// Case studies (DAA-230): the content lives in Sanity ("Case Studies", `caseStudy`); this maps the keys of its
// lists to Ukrainian. `satisfies` fails the build if the Studio gains an option that has no name here.

import type { SanityImageSource } from "@sanity/image-url";
import type { Teaser } from "../components/ui/Carousel.astro";
import { PHOTO_QUALITY, srcsetFor, urlFor } from "../sanity/image";
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

/** What a case's card needs: the case studies teasers' fields (the logo's only for a named case) */
export interface CaseCard extends Partial<LogoFields> {
  title: string;
  slug: string;
  cardTag: string | null;
  industry: keyof typeof industryNames;
  companySize: string;
  heroImage: { asset: { _id: string } | null } & Record<string, unknown>;
}

/** A case as a card in the site's carousel (the ATLAS page's cases, a case page's "other cases"): its photo
 * cropped square, the card tag (or industry and size) on it, a named client's logo under it, the title linking to
 * `href`. Card titles go to the
 * carousel as HTML, so the plain-text title is escaped. */
export const caseTeaser = (c: CaseCard, href: string): Teaser => ({
  image: {
    src: urlFor(c.heroImage as SanityImageSource, PHOTO_QUALITY)
      .width(640)
      .height(640)
      .fit("crop")
      .url(),
    srcset: srcsetFor(c.heroImage as SanityImageSource, [320, 480, 640, 800], 1, PHOTO_QUALITY),
  },
  tag: c.cardTag || `${industryNames[c.industry]} · ${c.companySize}`,
  logo: clientLogo({ anonymised: c.anonymised ?? null, clientLogo: c.clientLogo ?? null }, 26),
  title: c.title.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"),
  href,
});
