// @ts-check
import { defineConfig, envField, fontProviders } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

/**
 * One weight of a local woff2 font.
 * @param {string} file path under src/assets/fonts
 * @param {number} weight
 */
const variant = (file, weight) => ({
  src: /** @type {[string]} */ ([`./src/assets/fonts/${file}.woff2`]),
  weight,
  style: /** @type {const} */ ("normal"),
});
/** @param {string} name @param {number} weight */
const turns = (name, weight) => variant(`TT_Turns_Trial_${name}`, weight);
/** @param {string} name @param {number} weight */
const commons = (name, weight) => variant(`TTCommons-${name}`, weight);

// Static site (no adapter): `astro build` writes dist/, which Caddy serves on Railway (see Dockerfile).
export default defineConfig({
  site: "https://daat.ua",
  output: "static",
  // URLs without a trailing slash (/uk-UA/atlas), each page built as one .html file
  trailingSlash: "never",
  compressHTML: true,
  // One locale for now, always in the URL (/uk-UA/…), so more can be added without moving pages
  i18n: {
    locales: ["uk-UA"],
    defaultLocale: "uk-UA",
    routing: {
      prefixDefaultLocale: true,
      // the root goes to the ATLAS page (below), not to /uk-UA/
      redirectToDefaultLocale: false,
    },
  },
  // Static redirect pages (meta refresh + canonical); Caddy answers these with real HTTP redirects
  redirects: {
    "/": "/uk-UA/atlas",
    "/uk-UA": "/uk-UA/atlas",
    "/sitemap": "/uk-UA/sitemap",
    "/delivery-management": "/uk-UA/delivery-management",
  },
  build: {
    format: "file",
    // one page: inline its CSS (~9 KB gzipped) rather than block rendering on a stylesheet request
    inlineStylesheets: "always",
  },
  image: {
    // optimised images get srcset/sizes and no-layout-shift styles by default
    layout: "constrained",
    responsiveStyles: true,
  },
  // Local woff2 files (Latin + Cyrillic subsets). Astro adds font-display: swap and metric-matched
  // fallbacks, so text keeps its size while the fonts load. TODO: TT Turns is a trial licence.
  fonts: [
    {
      provider: fontProviders.local(),
      name: "TT Turns",
      cssVariable: "--font-turns",
      fallbacks: ["sans-serif"],
      options: { variants: [turns("Light", 300), turns("Medium", 500), turns("DemiBold", 600)] },
    },
    {
      provider: fontProviders.local(),
      name: "TT Commons",
      cssVariable: "--font-commons",
      fallbacks: ["sans-serif"],
      options: {
        variants: [commons("Regular", 400), commons("Medium", 500), commons("DemiBold", 600), commons("Bold", 700)],
      },
    },
  ],
  // Booking a call with the founders (findings' founders block, DAA-226): Cal.com's public API v2 is called
  // from the browser, so these are public identifiers, not secrets. Unset, a build shows only a link to
  // the booking page (and the dev server simulates the flow). See .env.example.
  env: {
    schema: {
      // a string, checked in FoundersCta: Astro's number parsing would read "123abc" as 123
      PUBLIC_CAL_EVENT_TYPE_ID: envField.string({ context: "client", access: "public", optional: true }),
      // the founders' public booking page: where the block sends readers when slots can't be loaded
      PUBLIC_CAL_BOOKING_URL: envField.string({
        context: "client",
        access: "public",
        url: true,
        default: "https://cal.com/serhii-herasymov-qrn95u/30min",
      }),
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
