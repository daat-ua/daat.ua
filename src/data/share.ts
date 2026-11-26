import type { SanityImageSource } from "@sanity/image-url";
import { youtubeCover, youtubeId } from "./delivery-management";
import { urlFor } from "../sanity/image";

// How a page previews when its link is shared (DAA-220): the image of og:image, with its size, so a network can
// lay the card out before fetching it. Base falls back to the site's default (public/share.png) without one.

export interface ShareImage {
  /** an absolute URL */
  url: string;
  width: number;
  height: number;
  alt?: string;
}

/** a Sanity image (with an asset) or nothing */
type MaybeImage = (SanityImageSource & { asset?: unknown; alt?: string | null }) | null | undefined;

/** the first of the images that has an asset, cropped to 1200 × 630 around its hotspot; its alt text if it has one */
export function shareImage(...images: MaybeImage[]): ShareImage | undefined {
  const image = images.find((i) => i?.asset);
  if (!image) return undefined;
  return {
    url: urlFor(image).width(1200).height(630).fit("crop").url(),
    width: 1200,
    height: 630,
    alt: image.alt?.trim() || undefined,
  };
}

/** whether YouTube has a 1280 × 720 cover for a video: it makes one only when the upload is that large, and answers
 * 404 otherwise. Asked once per video per build */
const maxResCover = new Map<string, Promise<boolean>>();
const hasMaxResCover = (id: string) => {
  if (!maxResCover.has(id)) {
    const url = youtubeCover(id, "maxresdefault");
    maxResCover.set(
      id,
      fetch(url, { method: "HEAD" }).then(
        (r) => r.ok,
        () => false,
      ),
    );
  }
  return maxResCover.get(id)!;
};

/** a video's: the first Sanity image with an asset (the social image, the cover), else YouTube's 1280 × 720 cover
 * when the video has one; else none, and Base uses the site's default */
export async function videoShareImage(youtubeUrl: string, ...images: MaybeImage[]): Promise<ShareImage | undefined> {
  const image = shareImage(...images);
  if (image) return image;
  const id = youtubeId(youtubeUrl);
  return id && (await hasMaxResCover(id))
    ? { url: youtubeCover(id, "maxresdefault"), width: 1280, height: 720 }
    : undefined;
}

/** a description for search results and shared links: at most `max` characters, cut between words ("…") */
export function clip(text: string, max = 160) {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max - 1);
  // the last word boundary, wherever it is; a text without one (a single long word or link) can only be cut
  const space = cut.lastIndexOf(" ");
  return `${(space > 0 ? cut.slice(0, space) : cut).replace(/[\s,;:—–-]+$/, "")}…`;
}

/** a generated page title: `title` with the first suffix that keeps it within ~60 characters (what search results
 * show), else `title` alone. An editor's SEO title is used as written instead */
export function pageTitle(title: string, ...suffixes: string[]) {
  const clean = title.replace(/\s+/g, " ").trim();
  return suffixes.map((s) => `${clean}${s}`).find((t) => t.length <= 60) ?? clean;
}
