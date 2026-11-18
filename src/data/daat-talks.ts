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

/** minutes to read a text of so many words, at 180 words a minute */
export const readingMinutes = (words: number) => Math.max(1, Math.round(words / 180));

/** "20 червня 2026" */
export const formatDate = (iso: string) =>
  new Intl.DateTimeFormat("uk-UA", { day: "numeric", month: "long", year: "numeric" })
    .format(new Date(iso))
    .replace(/\s*р\.$/, "");

/** "1 епізод", "3 епізоди", "15 епізодів" */
export function episodesCount(n: number) {
  const forms = { one: "епізод", few: "епізоди", many: "епізодів", other: "епізоду" };
  return `${n} ${forms[new Intl.PluralRules("uk").select(n) as keyof typeof forms] ?? forms.many}`;
}
