import type { AstroIntegration } from "astro";

// The dev toolbar's "SEO" app (src/dev-toolbar/seo-app.ts, DAA-220): the page's search result, its shared-link
// cards and its SEO checks while working on it. Only `astro dev` registers it, so the build carries none of it.
export default function seoToolbar(): AstroIntegration {
  return {
    name: "daat-seo-toolbar",
    hooks: {
      "astro:config:setup": ({ command, addDevToolbarApp }) => {
        if (command !== "dev") return;
        addDevToolbarApp({
          id: "daat-seo",
          name: "SEO",
          icon: "file-search",
          entrypoint: new URL("../dev-toolbar/seo-app.ts", import.meta.url),
        });
      },
    },
  };
}
