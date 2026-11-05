// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

// Static site (no adapter): `astro build` writes dist/, which Caddy serves on Railway (see Dockerfile).
export default defineConfig({
  site: "https://daat.ua",
  output: "static",
  trailingSlash: "ignore",
  compressHTML: true,
  build: {
    // small stylesheets go inline, larger ones stay cacheable files
    inlineStylesheets: "auto",
  },
  image: {
    // optimised images get srcset/sizes and no-layout-shift styles by default
    layout: "constrained",
    responsiveStyles: true,
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
