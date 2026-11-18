// Daat Talks (DAA-239): helpers for the index (/uk-UA/daat-talks), the episode pages (/uk-UA/daat-talks/<slug>) and
// the articles (/uk-UA/article/<slug>). The content is Sanity's: daatTalksEpisode, daatTalksArticle and
// daatTalksContributor (src/sanity/queries.ts).

export const EPISODES_PER_PAGE = 5;

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
