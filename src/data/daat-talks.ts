// Daat Talks (DAA-239): helpers for the index (/uk-UA/daat-talks), the episode pages (/uk-UA/daat-talks/<slug>) and
// the articles (/uk-UA/article/<slug>). The content is Sanity's: daatTalksEpisode, daatTalksArticle and
// daatTalksContributor (src/sanity/queries.ts).

import type { SanityImageCrop, SanityImageHotspot } from "../sanity/sanity.types";
import { PHOTO_QUALITY, srcsetFor, urlFor } from "../sanity/image";
import { cover } from "./delivery-management";

export const EPISODES_PER_PAGE = 5;

interface CoverImage {
  hotspot: SanityImageHotspot | null;
  crop: SanityImageCrop | null;
  asset: { _id: string; metadata: { dimensions: { width: number } | null } | null } | null;
}

/** An episode's 16:9 cover: the YouTube cover uploaded in the Studio, served sharp (WebP at PHOTO_QUALITY, up to
 * 2560 wide, never past the original); without one, the lower-quality image YouTube serves */
export function talksCover(episode: { youtubeUrl: string; youtubeCover: CoverImage | null }) {
  const image = episode.youtubeCover?.asset ? episode.youtubeCover : null;
  if (!image) return cover({ youtubeUrl: episode.youtubeUrl, thumbnail: null });
  const max = image.asset?.metadata?.dimensions?.width ?? 1920;
  const fits = [480, 960, 1440, 1920, 2560].filter((w) => w <= max);
  const widths = fits.length ? fits : [max];
  const src = (width: number) =>
    urlFor(image, PHOTO_QUALITY)
      .width(width)
      .height(Math.round((width * 9) / 16))
      .fit("crop")
      .url();
  return { src: src(Math.min(1440, max)), srcset: srcsetFor(image, widths, 16 / 9, PHOTO_QUALITY) };
}

/** a small copy of the cover for a blurred backdrop (the article's first screen) */
export function talksBackdrop(episode: Parameters<typeof talksCover>[0]) {
  const image = episode.youtubeCover?.asset ? episode.youtubeCover : null;
  if (!image)
    return cover({ youtubeUrl: episode.youtubeUrl, thumbnail: null }).src.replace("maxresdefault", "hqdefault");
  return urlFor(image).width(640).height(360).fit("crop").url();
}

/** "ЖВ": an avatar's initials, for a guest without a photo */
export const initials = (name: string) =>
  name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

/** minutes to read a text, at 180 words a minute (any run of whitespace, line breaks too, separates words) */
export const readingMinutes = (text: string | null) =>
  Math.max(1, Math.round((text?.split(/\s+/).filter(Boolean).length ?? 0) / 180));

/** "20 червня 2026", the date in Kyiv, wherever the site is built */
export const formatDate = (iso: string) =>
  new Intl.DateTimeFormat("uk-UA", { day: "numeric", month: "long", year: "numeric", timeZone: "Europe/Kyiv" })
    .format(new Date(iso))
    .replace(/\s*р\.$/, "");

/** "1 епізод", "3 епізоди", "15 епізодів" */
export function episodesCount(n: number) {
  const forms = { one: "епізод", few: "епізоди", many: "епізодів", other: "епізоду" };
  return `${n} ${forms[new Intl.PluralRules("uk").select(n) as keyof typeof forms] ?? forms.many}`;
}

/** the index's intro, under its title */
export const TALKS_INTRO =
  "Подкаст Daat про те, як будують і ведуть IT-компанії: відверті розмови з фаундерами, CEO та експертами. З кожного епізоду ми робимо кілька статей\u00a0— щоб до ідей можна було повернутися.";

/** a title as HTML that never breaks at a hyphen: "IT-компанії" stays on one line. Escaped, for set:html */
export const keepHyphenated = (text: string) =>
  text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replace(/\S+-\S+/g, (word) => `<span class="nowrap">${word}</span>`);
