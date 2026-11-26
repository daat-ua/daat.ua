import type {StringRule, TextRule} from 'sanity'

// The SEO tab's checks, the same on every type (DAA-220). Warnings, not errors: an editor may go over on purpose,
// and the site uses the text as written.

/** spaces at either end or doubled: they show in the search result and the browser tab */
const tidy = (value?: string) =>
  !value || value === value.trim().replace(/\s{2,}/g, ' ')
    ? true
    : 'Remove the spaces at the start or end, or the doubled ones'

/** what search results show of a title: about 60 characters */
export const seoTitleRule = (rule: StringRule) => [
  rule.max(60).warning('Search engines cut titles longer than ~60 characters'),
  rule.custom(tidy).warning(),
]

/** what search results show of a description: about 160 characters; the site cuts a longer one between words */
export const seoDescriptionRule = (rule: TextRule) => [
  rule.max(160).warning('Search engines cut descriptions longer than ~160 characters'),
  rule.custom(tidy).warning(),
]
