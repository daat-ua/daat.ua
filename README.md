# daat.ua — ATLAS landing page

Astro 7 + Tailwind 4, built as a static site and served by Caddy on Railway.

## Develop

Requires Node 26 LTS (see `.nvmrc`; Astro 7.4 needs ≥ 22.23.4).

```sh
npm install
npm run dev       # http://localhost:4321/uk-UA/atlas
npm run build     # astro check + static build into dist/
npm run preview   # serve dist/ locally
npm run test:visual  # compare each section of the build with the original single-file page (needs a build)
```

`test:visual` screenshots every section of the original single-file page (read from git history, `--legacy-ref=<commit>`) and of `dist/` at 1440, 1280, 1024 and 500px wide and compares them pixel by pixel, using your installed Google Chrome. Options: `--widths=1440,500`, `--sections=hero,faq`, `--threshold=0.005`, `--images` (images are hidden by default, because Astro's resizing shifts their pixels without changing the design; their boxes are still compared). Diffs are saved to `tests/visual/output/`.

## Locales and URLs

Astro i18n with one locale, `uk-UA`, always in the URL. The ATLAS page lives at `/uk-UA/atlas`; `/` and `/uk-UA` redirect there (302 from Caddy in production, static redirect pages elsewhere). New locales go in `astro.config.mjs` (`i18n.locales`) with their pages under `src/pages/<locale>/`.

## Deploy

Railway builds the `Dockerfile`: Node 26 builds the site, then Caddy (`Caddyfile`) serves it on `$PORT` with compression, long-lived caching for hashed assets and security headers.

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
  pages/        uk-UA/atlas.astro (the ATLAS page), 404.astro
public/         files served as-is (frame sequences for the canvas animations)
```

Design deviations from Figma are logged in `FIGMA-DEVIATIONS.md`.
