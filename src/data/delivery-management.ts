// "Все про менеджмент делівері" (DAA-231): Olena Kyianovska's YouTube series, an index and a page per episode
// (src/pages/uk-UA/delivery-management/). The episodes are Sanity's "Delivery management episodes"
// (`deliveryEpisode`); these helpers turn an episode's YouTube link and optional thumbnail into what the pages show.

import type { SanityImageSource } from "@sanity/image-url";
import { srcsetFor, urlFor } from "../sanity/image";

/** the 11-character video ID in a YouTube link (watch, youtu.be, embed, shorts), as the Studio validates it */
export const youtubeId = (url: string) =>
  url.match(/(?:youtu\.be\/|[?&]v=|\/embed\/|\/shorts\/)([\w-]{11})/)?.[1] ?? "";

const youtubeCover = (id: string, size: "mqdefault" | "maxresdefault") => `https://i.ytimg.com/vi/${id}/${size}.jpg`;

/** an episode's 16:9 cover: the Studio's thumbnail if it has one, else YouTube's */
export function cover(episode: { youtubeUrl: string; thumbnail: { asset: unknown } | null }) {
  const { thumbnail } = episode;
  if (thumbnail?.asset) {
    const image = thumbnail as SanityImageSource;
    return {
      src: urlFor(image).width(1280).height(720).fit("crop").url(),
      srcset: srcsetFor(image, [320, 640, 1280], 16 / 9),
    };
  }
  const id = youtubeId(episode.youtubeUrl);
  return {
    src: youtubeCover(id, "maxresdefault"),
    srcset: `${youtubeCover(id, "mqdefault")} 320w, ${youtubeCover(id, "maxresdefault")} 1280w`,
  };
}

/** "16:42" or "1:02:05" as an ISO 8601 duration ("PT16M42S"), for the video's structured data */
export function isoDuration(duration: string | null) {
  const parts = duration?.split(":").map(Number);
  if (!parts || parts.some(Number.isNaN)) return undefined;
  const [s = 0, m = 0, h = 0] = parts.reverse();
  return `PT${h ? `${h}H` : ""}${m ? `${m}M` : ""}${s}S`;
}
