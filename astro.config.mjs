// @ts-check
import { defineConfig, fontProviders } from "astro/config";
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
  trailingSlash: "ignore",
  compressHTML: true,
  build: {
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
  vite: {
    plugins: [tailwindcss()],
  },
});
