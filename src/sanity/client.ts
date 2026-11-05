import { createClient } from "@sanity/client";

// The daat.ua dataset (the Studio lives in studio/). Read at build time only: the site is static and is
// rebuilt when content is published, so it reads the API directly (no CDN) and published documents only.
export const projectId = "7mfhokh5";
export const dataset = "production";

export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion: "2025-02-19",
  useCdn: false,
  perspective: "published",
});
