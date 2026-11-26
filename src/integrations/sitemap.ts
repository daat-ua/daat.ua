import { readFile, writeFile } from "node:fs/promises";
import type { AstroIntegration } from "astro";
import { sanityClient } from "../sanity/client";

// sitemap.xml (DAA-220), written after the build from the pages it produced. A page is left out when its HTML
// says so: a robots noindex (Sanity's no_index, the sample page), a redirect page (meta refresh) and the 404,
// so there's no second list of exclusions to keep in sync. A page made from a Sanity document gets its
// <lastmod> from the document's last edit; other pages get none (Google ignores a date that isn't the content's).

/** each Sanity-made page's path (as the build names it, no leading slash) and its document's last edit */
const LASTMOD_QUERY = `*[_type in ["post", "caseStudy", "deliveryEpisode", "daatTalksEpisode", "daatTalksArticle"]
  && defined(slug.current)]{
  "path": select(
    _type == "post" => "uk-UA/atlas/findings/",
    _type == "caseStudy" => "uk-UA/atlas/case-studies/",
    _type == "deliveryEpisode" => "uk-UA/delivery-management/",
    _type == "daatTalksEpisode" => "uk-UA/daat-talks/",
    _type == "daatTalksArticle" => "uk-UA/article/"
  ) + slug.current,
  _updatedAt
}`;

const NOINDEX = /<meta\s+name="robots"\s+content="[^"]*noindex/i;
const REDIRECT = /<meta\s+http-equiv="refresh"/i;

const escape = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export default function sitemap(): AstroIntegration {
  let site: URL | undefined;
  return {
    name: "daat-sitemap",
    hooks: {
      "astro:config:done": ({ config }) => {
        site = config.site ? new URL(config.site) : undefined;
      },
      "astro:build:done": async ({ dir, pages, logger }) => {
        if (!site) throw new Error("sitemap.xml needs `site` in astro.config.mjs");
        const lastmod = new Map(
          (await sanityClient.fetch<{ path: string; _updatedAt: string }[]>(LASTMOD_QUERY)).map((d) => [
            d.path,
            d._updatedAt,
          ]),
        );

        const entries: { loc: string; date?: string }[] = [];
        for (const { pathname } of pages) {
          // pathname: "uk-UA/atlas/" or "" (the root); the build writes uk-UA/atlas.html (build.format "file")
          const path = pathname.replace(/\/$/, "");
          if (path === "404") continue;
          const html = await readFile(new URL(`${path || "index"}.html`, dir), "utf8");
          if (NOINDEX.test(html) || REDIRECT.test(html)) continue;
          entries.push({ loc: new URL(path, site).href, date: lastmod.get(path) });
        }
        entries.sort((a, b) => a.loc.localeCompare(b.loc));
        const urls = entries.map(
          ({ loc, date }) => `<url><loc>${escape(loc)}</loc>${date ? `<lastmod>${date}</lastmod>` : ""}</url>`,
        );

        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>\n`;
        await writeFile(new URL("sitemap.xml", dir), xml);
        logger.info(`sitemap.xml: ${entries.length} pages`);
      },
    },
  };
}
