import { createImageUrlBuilder, type SanityImageSource } from "@sanity/image-url";
import { dataset, projectId } from "./client";

const builder = createImageUrlBuilder({ projectId, dataset });

/** The quality for photographs. Without a quality, `auto=format` gets AVIF at the CDN's default, which smears fine
 * detail (fabric, hands, edges); with one, the CDN serves WebP, which keeps it. */
export const PHOTO_QUALITY = 85;

/** Image URL builder; crops respect the hotspot set in the Studio. Format is negotiated by the CDN; `quality` for
 * photographs (PHOTO_QUALITY). */
export const urlFor = (source: SanityImageSource, quality?: number) => {
  const url = builder.image(source).auto("format");
  return quality ? url.quality(quality) : url;
};

/** srcset for an image at the given widths; with `aspect` (width / height) it is cropped to that ratio */
export function srcsetFor(source: SanityImageSource, widths: number[], aspect?: number, quality?: number) {
  return widths
    .map((w) => {
      const url = aspect
        ? urlFor(source, quality)
            .width(w)
            .height(Math.round(w / aspect))
            .fit("crop")
        : urlFor(source, quality).width(w);
      return `${url.url()} ${w}w`;
    })
    .join(", ");
}
