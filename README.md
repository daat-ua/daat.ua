# daat.ua — ATLAS landing page

Astro 7 + Tailwind 4, built as a static site and served by Caddy on Railway. Content for the delivery-audit
findings comes from Sanity; the Studio lives in `studio/`.

## Develop

Requires Node 26 LTS (see `.nvmrc`; Astro 7.4 needs ≥ 22.23.4).

```sh
npm install
npm run dev       # http://localhost:4321/uk-UA/atlas
npm run build     # astro check + static build into dist/
npm run preview   # serve dist/ locally
npm run test:visual  # compare each section of the build with a reference (needs a build; see below)
```

`test:visual` screenshots every section of the ATLAS page in a reference and in `dist/` at 1440, 1280, 1024 and 500px wide and compares them pixel by pixel, using your installed Google Chrome. The reference is either another commit of the site, built in a temporary git worktree (`--base-ref=origin/main`), or by default the original single-file page (read from git history, `--legacy-ref=<commit>`). CI runs it on pull requests against the PR's base branch, so only what a change does to the page is flagged; a PR that changes the page on purpose gets the `visual-change` label, which skips the step. Against a build every section is compared, the findings carousel included; against the original page the carousel is left out, since its cards now come from Sanity. Finding pages aren't covered. Options: `--widths=1440,500`, `--sections=hero,faq`, `--threshold=0.005`, `--allow-missing` (skip sections absent on either side instead of failing), `--images` (images are hidden by default, because Astro's resizing shifts their pixels without changing the design; their boxes are still compared). Diffs are saved to `tests/visual/output/`.

## Content (Sanity)

The findings are the Sanity "Delivery audit findings" collection (`post`), project `7mfhokh5`, dataset
`production`. The site reads it at build time only (`src/sanity/`): one page per finding at
`/uk-UA/atlas/findings/<slug>` (`src/pages/uk-UA/atlas/findings/[slug].astro`), and the findings carousel
(`AuditFindings`) on the ATLAS page and under each finding. Published content reaches the site with the next
build, so publishing has to trigger a rebuild.

The Studio is a separate app in `studio/` (Sanity 6, its own `package.json`), deployed to Sanity's hosting:

```sh
cd studio && npm install
npm run dev       # http://localhost:3333
npm run deploy    # deploy the hosted Studio
```

Queries are written with `defineQuery` in `src/sanity/queries.ts`. After changing them or the schema, run
`npm run typegen` (from the root): it extracts the schema (`studio/schema.json`) and regenerates
`src/sanity/sanity.types.ts`, which types `sanityClient.fetch()`. Both files are committed.

Findings from the previous daat.ua site (`/insights/delivery-audit-findings/<slug>`) redirect to their new
URLs (301, in the `Caddyfile`).

## Booking a call (Cal.com)

The founders' block under each finding (`src/components/findings/FoundersCta.astro`) books a call in place:
it loads the founders' free slots from Cal.com's public API v2 as the reader nears it, takes a name and email,
and creates the booking (Cal.com then sends the invitation). Both calls go from the browser and need no API
key, so the site stays static. Two public settings, declared in `astro.config.mjs` (`env`) and listed in
`.env.example`:

- `PUBLIC_CAL_EVENT_TYPE_ID`: the event type to book (its numeric ID)
- `PUBLIC_CAL_BOOKING_URL`: the public booking page, shown when slots can't be loaded

Locally they go in `.env`; on Railway they are service variables (the `Dockerfile` passes them to the build).
Without an event type, `npm run dev` simulates the slots and the booking, and a production build shows only a
link to the booking page. Never put a Cal.com API key in a `PUBLIC_` variable. Details and decisions: DAA-226.

## Locales and URLs

Astro i18n with one locale, `uk-UA`, always in the URL. The ATLAS page lives at `/uk-UA/atlas`; `/` and `/uk-UA` redirect there (302 from Caddy in production, static redirect pages elsewhere). Pages are built as `.html` files (`dist/uk-UA/atlas.html`) and linked without the extension, so any other host must serve `/path` from `/path.html`: Caddy does it with `try_files {path} {path}.html`; on Netlify, Cloudflare Pages or Vercel this is the default ("pretty URLs"); nginx needs `try_files $uri $uri.html $uri/ =404`. A plain static server (e.g. `python -m http.server`) returns 404 for `/uk-UA/atlas`; use `npm run preview` locally. New locales go in `astro.config.mjs` (`i18n.locales`) with their pages under `src/pages/<locale>/`.

## Deploy

Railway builds the `Dockerfile`: Node 26 builds the site, then Caddy (`Caddyfile`) serves it on `$PORT` with compression, long-lived caching for hashed assets and security headers.

## Structure

```
src/
  assets/       fonts, images, charts, icons (optimised by Astro)
  styles/       global.css: Tailwind and design tokens
  data/         page copy as typed data
  sanity/       Sanity client, image URLs, GROQ queries, generated types
  layouts/      Base.astro
  components/
    ui/                     shared building blocks
    atlas-landing/sections/ the landing page's sections
  scripts/      client-side TypeScript
  pages/        uk-UA/atlas.astro (the ATLAS page), uk-UA/atlas/findings/[slug].astro (findings), 404.astro
public/         files served as-is (frame sequences for the canvas animations)
studio/         Sanity Studio (separate app)
```

Design deviations from Figma are logged in `FIGMA-DEVIATIONS.md`.
