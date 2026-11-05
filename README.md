# daat.ua — ATLAS landing page

Astro 7 + Tailwind 4, built as a static site and served by Caddy on Railway.

> Migration in progress: the legacy single-file page (`index.html`, `assets/`, `fonts/`) stays at the root until every section is ported to `src/`, then it's removed.

## Develop

Requires Node 26 LTS (see `.nvmrc`; Astro 7.4 needs ≥ 22.23.4).

```sh
npm install
npm run dev       # http://localhost:4321
npm run build     # astro check + static build into dist/
npm run preview   # serve dist/ locally
```

## Deploy

Railway builds the `Dockerfile`: Node 26 builds the site, then Caddy (`Caddyfile`) serves it on `$PORT` with compression, long-lived caching for hashed assets and security headers.

While the migration is in progress the image keeps the legacy page live at `/` and serves the Astro build from `/next/`, so merging a migration PR never replaces the live page with a half-ported one. The last migration PR moves the Astro build to `/`.

## Structure

```
src/
  assets/       fonts, images, charts, icons (optimised by Astro)
  styles/       global.css: Tailwind and design tokens
  data/         page copy as typed data
  layouts/      Base.astro
  components/
    ui/                     shared building blocks
    atlas-landing/sections/ the landing page's sections
  scripts/      client-side TypeScript
  pages/        index.astro, 404.astro
public/         files served as-is (frame sequences for the canvas animations)
```

Design deviations from Figma are logged in `FIGMA-DEVIATIONS.md`.
