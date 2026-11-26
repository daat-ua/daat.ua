# daat.ua

The Daat site: the ATLAS diagnostic's landing page, the delivery-audit findings, case studies, the contact page,
"Все про менеджмент делівері" and the Daat Talks podcast with its articles. Astro 7 + Tailwind 4, built as a
static site and served by Caddy on Railway. Content comes from Sanity at build time; the Studio lives in
`studio/`. The contact form posts to a Cloudflare Worker in `workers/contact-form/`.

## Develop

Requires Node 26 LTS (see `.nvmrc`; Astro 7.4 needs ≥ 22.23.4).

```sh
npm install
npm run dev           # http://localhost:4321/uk-UA/atlas
npm run check         # type check (astro check); CI runs it, the deploy build does not
npm run build         # static build into dist/
npm run preview       # serve dist/ locally
npm run format        # Prettier; CI runs format:check
npm run test:visual   # compare each section of the ATLAS page with a reference (needs a build; see below)
```

`test:visual` screenshots every section of the ATLAS page in a reference and in `dist/` at 1440, 1280, 1024 and 500px wide and compares them pixel by pixel, using your installed Google Chrome. The reference is either another commit of the site, built in a temporary git worktree (`--base-ref=origin/main`), or by default the original single-file page (read from git history, `--legacy-ref=<commit>`). CI runs it on pull requests against the PR's base branch, so only what a change does to the page is flagged; a PR that changes the page on purpose gets the `visual-change` label, which skips the step. Against a build every section is compared, the findings carousel included; against the original page the carousel is left out, since its cards now come from Sanity. Only the ATLAS page is covered. Options: `--widths=1440,500`, `--sections=hero,faq`, `--threshold=0.005`, `--allow-missing` (skip sections absent on either side instead of failing), `--images` (images are hidden by default, because Astro's resizing shifts their pixels without changing the design; their boxes are still compared). Diffs are saved to `tests/visual/output/`.

## Pages

All under `/uk-UA/` (see Locales and URLs):

| URL                                                  | Source                               | Content                                                                                   |
| ---------------------------------------------------- | ------------------------------------ | ----------------------------------------------------------------------------------------- |
| `atlas`                                              | `pages/uk-UA/atlas.astro`            | The ATLAS landing page: its sections, video testimonials, case studies, findings carousel |
| `atlas/findings`, `atlas/findings/<slug>`            | `pages/uk-UA/atlas/findings/`        | Delivery-audit findings: the catalogue and one page each                                  |
| `atlas/case-studies`, `atlas/case-studies/<slug>`    | `pages/uk-UA/atlas/case-studies/`    | Case studies: the index and one page each                                                 |
| `atlas/contact-us`                                   | `pages/uk-UA/atlas/contact-us.astro` | The request form, the video testimonials, the FAQ before a first call                     |
| `delivery-management`, `delivery-management/<slug>`  | `pages/uk-UA/delivery-management/`   | Olena Kyianovska's video series: the index and one page per episode                       |
| `daat-talks`, `daat-talks/<n>`, `daat-talks/<slug>`  | `pages/uk-UA/daat-talks/`            | The podcast: episodes five to a page, one page per episode                                |
| `article/<slug>`                                     | `pages/uk-UA/article/[slug].astro`   | The articles written from Daat Talks episodes                                             |
| `about`, `privacy-policy`, `terms-of-use`, `sitemap` | `pages/uk-UA/`                       | About Daat, the legal pages, the site map                                                 |

`sample.astro` is a layout demo, not linked and kept out of search results. The header carries the menu button and, left of it, the link to the contact page; the global menu (`GlobalMenu.astro`) lists the pages from `src/data/navigation.ts`.

## Content (Sanity)

Project `7mfhokh5`, dataset `production`. The site reads it at build time only (`src/sanity/`), so published content reaches the site with the next build. Publishing starts that build by itself: publishing, changing or deleting a document of a type below fires a Sanity webhook that redeploys the site on Railway (see [Deploy](#deploy)), and the change is live within about five minutes. Drafts don't trigger it. The document types (`studio/schemaTypes/`):

| Type                                                           | On the site                                                   |
| -------------------------------------------------------------- | ------------------------------------------------------------- |
| `post` ("Delivery audit findings")                             | the findings pages and the findings carousels                 |
| `caseStudy`                                                    | the case studies, the ATLAS page's case carousel              |
| `videoTestimonial`                                             | the video testimonials on the ATLAS page and the contact page |
| `deliveryEpisode`                                              | "Все про менеджмент делівері"                                 |
| `daatTalksEpisode`, `daatTalksArticle`, `daatTalksContributor` | Daat Talks: episodes, their articles, guests                  |
| `authors`                                                      | findings' and articles' authors, the founders' faces          |

The Studio is a separate app in `studio/` (Sanity 6, its own `package.json`), deployed to Sanity's hosting:

```sh
cd studio && npm install
npm run dev       # http://localhost:3333
npm run deploy    # deploy the hosted Studio
```

Queries are written with `defineQuery` in `src/sanity/queries.ts`; `src/sanity/shared.ts` fetches each collection once per build for every page that needs it. After changing a query or the schema, run `npm run typegen` (from the root): it extracts the schema (`studio/schema.json`) and regenerates `src/sanity/sanity.types.ts`, which types `sanityClient.fetch()`. Both files are committed.

## Video testimonials (Cloudflare R2)

A testimonial's "Video folder" points to an HLS stream on Cloudflare R2 (`playlist.m3u8` with 720p, 1080p and 2160p). The player (`src/scripts/hls-video.ts`) attaches it under the cover once the section is near the screen, buffering only the first seconds, with hls.js loaded on demand (or the browser's own HLS on iOS). The bucket's CORS must allow every origin that plays it: `https://daat.ua` and `http://localhost:4321` today. Previews on another port won't play the videos.

## Booking a call (Cal.com)

The founders' block on the findings, case study and delivery management pages (`src/components/findings/FoundersCta.astro`) books a call in place: it loads the founders' free slots from Cal.com's public API v2 as the reader nears it, takes a name and email, and creates the booking (Cal.com then sends the invitation). Both calls go from the browser and need no API key, so the site stays static. Two public settings, declared in `astro.config.mjs` (`env`) and listed in `.env.example`:

- `PUBLIC_CAL_EVENT_TYPE_ID`: the event type to book (its numeric ID)
- `PUBLIC_CAL_BOOKING_URL`: the public booking page, shown when slots can't be loaded

Without an event type, `npm run dev` simulates the slots and the booking, and a production build shows only a link to the booking page. Never put a Cal.com API key in a `PUBLIC_` variable. Details and decisions: DAA-226.

## Contact form (Cloudflare Worker + Resend)

The contact page's form posts JSON to `PUBLIC_CONTACT_FORM_URL`: the Worker in `workers/contact-form/` (`https://forms.daat.ua`), which checks the request (the site's origins only, five a minute per IP, field limits, a bot trap) and mails it to the founders through Resend, the sender as Reply-To. Nothing is stored. Its Resend key and recipients are Wrangler secrets, never in the repo. Without `PUBLIC_CONTACT_FORM_URL`, `npm run dev` simulates sending and a production build says it couldn't send, with the booking link. Setup and deploy: `workers/contact-form/README.md`. The Worker has its own `package.json` and is left out of the site's type check and Docker build.

## Settings

The `PUBLIC_` variables above go in `.env` locally (copy `.env.example`) and in Railway's service variables in production; the `Dockerfile` passes each one to the build as a build arg, so a new one needs an `ARG` line there too. Every one of them ends up in the page, so none may hold a secret.

## Locales and URLs

Astro i18n with one locale, `uk-UA`, always in the URL. The ATLAS page lives at `/uk-UA/atlas`; `/` and `/uk-UA` redirect there (302 from Caddy in production, static redirect pages elsewhere). Pages are built as `.html` files (`dist/uk-UA/atlas.html`) and linked without the extension, so any other host must serve `/path` from `/path.html`: Caddy does it with `try_files {path} {path}.html`; on Netlify, Cloudflare Pages or Vercel this is the default ("pretty URLs"); nginx needs `try_files $uri $uri.html $uri/ =404`. A plain static server (e.g. `python -m http.server`) returns 404 for `/uk-UA/atlas`; use `npm run preview` locally. New locales go in `astro.config.mjs` (`i18n.locales`) with their pages under `src/pages/<locale>/`.

The previous daat.ua site's URLs redirect to their new places (301, in the `Caddyfile`): findings (`/insights/delivery-audit-findings/<slug>`), case studies (`/uk-UA/case-studies/…`), `/delivery-management` and `/sitemap`.

## Deploy

Railway builds the `Dockerfile`: Node 26 builds the site, then Caddy (`Caddyfile`) serves it on `$PORT` with compression, long-lived caching for hashed assets and security headers. The contact form Worker deploys separately, with Wrangler (see its README).

Content changes deploy through the Sanity webhook `Railway: rebuild daat.ua` (sanity.io/manage → project `7mfhokh5` → API → Webhooks): on a publish, change or delete in `production` (drafts off) of a type the site renders, it POSTs Railway's GraphQL API (`https://backboard.railway.com/graphql/v2`) the mutation `serviceInstanceDeploy(serviceId, environmentId, latestCommit: true)` for the `daat.ua` service's production environment, a fresh build of the latest commit (`serviceInstanceRedeploy` could reuse the old build, and with it the old content). The `Dockerfile` makes sure such a build reads Sanity again instead of reusing Docker's cached build step. The webhook authenticates with a Railway token for that environment only, held in the webhook's header and never in the repo.

- **A new document type** the site renders has to be added to the webhook's filter (`_type in [...]`), or publishing it won't rebuild the site.
- **Each publish starts its own build**, so publishing several documents in a row queues several; the last one wins.
- **The attempts log isn't proof**: Railway's API answers 200 even when it refuses the call (the error is in the body), so check that a deployment started in Railway. If a build fails, the site keeps serving the previous one.

## Structure

```
src/
  assets/       fonts, images, charts, icons (optimised by Astro)
  styles/       global.css (Tailwind and design tokens), patterns.css (buttons, section titles and other shared patterns)
  data/         page copy and navigation as typed data, helpers for Sanity content
  sanity/       Sanity client, image URLs, GROQ queries, shared fetches, generated types
  layouts/      Base.astro (every page), FindingsLayout.astro (findings, cases, Daat Talks…), LegalLayout.astro
  components/
    ui/                     shared building blocks (logo, burger, carousel, divider, contact link)
    atlas-landing/sections/ the ATLAS page's sections
    findings/               findings and case pages: breadcrumb, table of contents, founders' block
    daat-talks/             Daat Talks: guests, article body blocks
  scripts/      client-side TypeScript (frame animations, in-page links, the HLS player)
  pages/        uk-UA/… (see Pages), 404.astro
public/         files served as-is (frame sequences for the canvas animations, the delivery management video)
studio/         Sanity Studio (separate app)
workers/        contact-form: the contact form's Cloudflare Worker (separate app)
tests/visual/   the visual check
```

Design deviations from Figma are logged in `FIGMA-DEVIATIONS.md`.
