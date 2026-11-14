import {ALL_FIELDS_GROUP, defineField, defineType} from 'sanity'

// An episode of "Все про менеджмент делівері" (DAA-231), Olena Kyianovska's YouTube series: the index and the
// episode pages at /uk-UA/delivery-management (src/pages/uk-UA/delivery-management/). The video is YouTube's;
// the page retells it as prose.

/** the 11-character video ID in a YouTube link (watch, youtu.be, embed, shorts); null if there is none */
const youtubeId = (url?: string) =>
  url?.match(/(?:youtu\.be\/|[?&]v=|\/embed\/|\/shorts\/)([\w-]{11})/)?.[1] ?? null

export const deliveryEpisode = defineType({
  name: 'deliveryEpisode',
  title: 'Delivery management episodes',
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
      name: 'title',
      description: 'The page title and the teaser title',
      type: 'string',
      group: 'content',
      validation: (rule) => rule.required().max(100),
    }),
    defineField({
      name: 'slug',
      description: 'The URL: /uk-UA/delivery-management/<slug>',
      type: 'slug',
      options: {source: 'title'},
      group: 'content',
      validation: (rule) => rule.required(),
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
      description: 'One or two sentences for the index and the "other episodes" carousel',
      type: 'text',
      rows: 2,
      group: 'content',
      validation: (rule) => rule.required().max(200),
    }),
    defineField({
      name: 'lead',
      description:
        'The opening paragraph of the episode page; the index shows it for the latest episode',
      type: 'text',
      rows: 3,
      group: 'content',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'body',
      description: 'The episode retold as prose (not a verbatim transcript)',
      type: 'array',
      group: 'content',
      of: [
        {
          type: 'block',
          styles: [
            {title: 'Normal', value: 'normal'},
            {title: 'Heading', value: 'h3'},
            {title: 'Quote', value: 'blockquote'},
          ],
        },
      ],
    }),

    // ---------- Meta ----------
    defineField({
      name: 'publishedAt',
      description: 'Orders the episodes: the newest is the large one on the index',
      type: 'datetime',
      group: 'meta',
      initialValue: () => new Date().toISOString(),
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'author',
      description: 'Olena by default: the series is hers',
      type: 'reference',
      to: [{type: 'authors'}],
      group: 'meta',
      initialValue: {_ref: '2901a5d2-ac5e-4b99-9fc1-c4ae271aa281'},
    }),
    defineField({
      name: 'duration',
      description: 'The video’s length, e.g. "16:42" or "1:02:05". Not shown; tells search engines',
      type: 'string',
      group: 'meta',
      validation: (rule) => rule.regex(/^(\d+:)?[0-5]?\d:[0-5]\d$/, {name: 'm:ss or h:mm:ss'}),
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
      description: 'Empty: the title',
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
    {
      title: 'Newest first',
      name: 'publishedAtDesc',
      by: [{field: 'publishedAt', direction: 'desc'}],
    },
  ],

  preview: {
    select: {title: 'title', date: 'publishedAt', media: 'thumbnail'},
    prepare: ({title, date, media}) => ({
      title,
      subtitle: date ? new Date(date).toLocaleDateString('uk-UA') : undefined,
      media,
    }),
  },
})
