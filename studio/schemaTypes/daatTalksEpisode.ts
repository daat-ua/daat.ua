import {ALL_FIELDS_GROUP, defineArrayMember, defineField, defineType} from 'sanity'

// A Daat Talks episode (DAA-239), the podcast on YouTube: its block on the index (/uk-UA/daat-talks, five to a
// page, by number) and its page (/uk-UA/daat-talks/<slug>). The articles written from it point to it
// (`daatTalksArticle.episode`); the episode doesn't list them.

/** the 11-character video ID in a YouTube link (youtube.com/watch?v=, youtu.be/, /embed/, /shorts/ on a YouTube host);
 * null if it isn't one */
function youtubeId(value?: string) {
  let url: URL
  try {
    url = new URL(value ?? '')
  } catch {
    return null
  }
  const host = url.hostname.replace(/^(www|m)\./, '')
  const id =
    host === 'youtu.be'
      ? url.pathname.slice(1)
      : ['youtube.com', 'youtube-nocookie.com'].includes(host)
        ? (url.searchParams.get('v') ?? url.pathname.match(/^\/(?:embed|shorts)\/([^/]+)/)?.[1])
        : null
  return id && /^[\w-]{11}$/.test(id) ? id : null
}

/** Olena Kyianovska (`authors`): she hosts every episode */
const OLENA = '2901a5d2-ac5e-4b99-9fc1-c4ae271aa281'

export const daatTalksEpisode = defineType({
  name: 'daatTalksEpisode',
  title: 'Daat Talks episodes',
  type: 'document',

  groups: [
    {name: 'content', title: 'Content', default: true},
    {name: 'meta', title: 'Meta data'},
    {name: 'seo', title: 'SEO'},
    {...ALL_FIELDS_GROUP, hidden: true},
  ],

  fields: [
    // ---------- Content ----------
    defineField({
      name: 'number',
      description: 'The episode’s number ("Епізод 17"); orders the index, newest first',
      type: 'number',
      group: 'content',
      validation: (rule) =>
        rule
          .required()
          .integer()
          .positive()
          .custom(async (value, {document, getClient}) => {
            if (value === undefined) return true
            // the published ID, whether this is a draft or a version in a content release
            const id = document?._id.replace(/^drafts\./, '').replace(/^versions\.[^.]+\./, '')
            const taken = await getClient({apiVersion: '2025-02-19'}).fetch<number>(
              `count(*[_type == "daatTalksEpisode" && number == $value && !(_id in [$id, "drafts." + $id])])`,
              {value, id},
            )
            return taken ? `Episode ${value} already exists` : true
          }),
    }),
    defineField({
      name: 'title',
      description: 'Without YouTube’s "| DA’AT Talks #17" tail',
      type: 'string',
      group: 'content',
      validation: (rule) => rule.required().max(120),
    }),
    defineField({
      name: 'slug',
      description:
        'The URL: /uk-UA/daat-talks/<slug>. Not just a number: /daat-talks/2 is the index’s page 2',
      type: 'slug',
      options: {source: 'title'},
      group: 'content',
      validation: (rule) =>
        rule
          .required()
          .custom((value) =>
            value?.current && /^\d+$/.test(value.current)
              ? 'A number alone is taken by the index’s pages'
              : true,
          ),
    }),
    defineField({
      name: 'youtubeUrl',
      title: 'YouTube link',
      description: 'The episode on YouTube, e.g. https://www.youtube.com/watch?v=…',
      type: 'url',
      group: 'content',
      validation: (rule) =>
        rule
          .required()
          .custom((value) => (!value || youtubeId(value) ? true : 'Not a YouTube video link')),
    }),
    defineField({
      name: 'teaser',
      description: 'One or two sentences under the title on the index',
      type: 'text',
      rows: 3,
      group: 'content',
      validation: (rule) => rule.required().max(220),
    }),
    defineField({
      name: 'description',
      description: 'Under the player on the episode page; the first paragraph is set larger',
      type: 'array',
      group: 'content',
      of: [
        defineArrayMember({
          type: 'block',
          styles: [{title: 'Normal', value: 'normal'}],
          lists: [],
          marks: {decorators: [{title: 'Strong', value: 'strong'}]},
        }),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'guests',
      description: 'Shown under the title, with a link to their LinkedIn',
      type: 'array',
      of: [defineArrayMember({type: 'reference', to: [{type: 'daatTalksContributor'}]})],
      group: 'content',
      validation: (rule) => rule.required().min(1).unique(),
    }),

    // ---------- Meta ----------
    defineField({
      name: 'hosts',
      description: 'Olena by default. Not shown yet; the articles’ authors are set on each article',
      type: 'array',
      of: [defineArrayMember({type: 'reference', to: [{type: 'authors'}]})],
      group: 'meta',
      initialValue: [{_type: 'reference', _ref: OLENA, _key: 'olena'}],
      validation: (rule) => rule.unique(),
    }),
    defineField({
      name: 'thumbnail',
      description: 'Instead of YouTube’s cover, where the site shows it. Empty: YouTube’s',
      type: 'image',
      options: {hotspot: true},
      group: 'meta',
    }),

    // ---------- SEO ----------
    defineField({
      name: 'seo_title',
      title: 'SEO title',
      description: 'Empty: "<title> | Daat Talks #<number>"',
      type: 'string',
      group: 'seo',
      validation: (rule) =>
        rule.max(60).warning('Search engines cut titles longer than ~60 characters'),
    }),
    defineField({
      name: 'seo_description',
      title: 'SEO description',
      description: 'Empty: the teaser',
      type: 'text',
      rows: 3,
      group: 'seo',
      validation: (rule) =>
        rule.max(160).warning('Search engines cut descriptions longer than ~160 characters'),
    }),
    defineField({
      name: 'seo_image',
      title: 'Social sharing image',
      description: '1200 × 630. Empty: the thumbnail, else YouTube’s cover',
      type: 'image',
      options: {hotspot: true},
      fields: [{name: 'alt', type: 'string', title: 'Alternative text'}],
      group: 'seo',
    }),
    defineField({
      name: 'no_index',
      title: 'Hide from search engines',
      type: 'boolean',
      initialValue: false,
      group: 'seo',
    }),
  ],

  orderings: [
    {title: 'Newest first', name: 'numberDesc', by: [{field: 'number', direction: 'desc'}]},
  ],

  preview: {
    select: {title: 'title', number: 'number', guest: 'guests.0.name', media: 'thumbnail'},
    prepare: ({title, number, guest, media}) => ({
      title: number ? `#${number} ${title ?? ''}` : title,
      subtitle: guest,
      media,
    }),
  },
})
