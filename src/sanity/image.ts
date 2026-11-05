import { createImageUrlBuilder, type SanityImageSource } from "@sanity/image-url";
import { dataset, projectId } from "./client";

const builder = createImageUrlBuilder({ projectId, dataset });

/** Image URL builder; crops respect the hotspot set in the Studio. Format is negotiated by the CDN. */
export const urlFor = (source: SanityImageSource) => builder.image(source).auto("format");

/** srcset for an image at the given widths; with `aspect` (width / height) it is cropped to that ratio */
export function srcsetFor(source: SanityImageSource, widths: number[], aspect?: number) {
  return widths
    .map((w) => {
      const url = aspect
        ? urlFor(source)
            .width(w)
            .height(Math.round(w / aspect))
            .fit("crop")
        : urlFor(source).width(w);
      return `${url.url()} ${w}w`;
    })
    .join(", ");
}
