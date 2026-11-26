import { social } from "./navigation";

// What the pages tell search engines (and AI search) about themselves: schema.org JSON-LD (DAA-220). Every page has
// the organisation and the site (Base); pages below a section, their breadcrumb trail; a document's page, what it
// is (a BlogPosting, an Article, a VideoObject). Checked with Google's Rich Results Test.

const SITE = "https://daat.ua";

/** the organisation's node ID: every page's nodes point to it (publisher, author) instead of repeating it */
export const ORGANIZATION_ID = `${SITE}/#organization`;
const WEBSITE_ID = `${SITE}/#website`;

/** a reference to the organisation, for `publisher` and an organisation `author` */
export const organizationRef = { "@id": ORGANIZATION_ID };

/** Daat and daat.ua, on every page. `logo`: the square mark's URL */
export const siteGraph = (logo: string) => ({
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": ORGANIZATION_ID,
      name: "Daat",
      alternateName: "DA’AT",
      url: SITE,
      logo,
      sameAs: social.map((s) => s.href),
    },
    {
      "@type": "WebSite",
      "@id": WEBSITE_ID,
      name: "Daat",
      url: SITE,
      inLanguage: "uk-UA",
      publisher: organizationRef,
    },
  ],
});

/** a breadcrumb trail: the sections above the page (their absolute URLs), then the page itself */
export const breadcrumbList = (trail: { name: string; url: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: trail.map((step, i) => ({ "@type": "ListItem", position: i + 1, name: step.name, item: step.url })),
});

/** a person who wrote something, with their LinkedIn as their URL */
export const person = (p: { name: string | null; linkedin?: string | null }) => ({
  "@type": "Person",
  name: p.name,
  ...(p.linkedin && { url: p.linkedin }),
});

/** JSON for a <script type="application/ld+json">: "<" escaped, so text can't close the script */
export const jsonLd = (data: unknown) => JSON.stringify(data).replace(/</g, "\\u003c");

/** the page's own absolute URL, as its canonical link has it (no ".html") */
export const pageUrl = (url: URL, site: URL | undefined) =>
  new URL(url.pathname.replace(/\.html$/, ""), site ?? SITE).href;
