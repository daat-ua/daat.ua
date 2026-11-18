import {ALL_FIELDS_GROUP, defineArrayMember, defineField, defineType} from 'sanity'

// An article written from a Daat Talks episode (DAA-239): its page (/uk-UA/article/<slug>) and its cards on the
// index and the episode page. The article points to its episode; an episode's articles are found by that reference
// and ordered by publishedAt.

export const daatTalksArticle = defineType({
  name: 'daatTalksArticle',
  title: 'Daat Talks articles',
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
      type: 'string',
      group: 'content',
      validation: (rule) => rule.required().max(120),
    }),
    defineField({
      name: 'slug',
      description: 'The URL: /uk-UA/article/<slug>',
      type: 'slug',
      options: {source: 'title'},
      group: 'content',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'episode',
      description:
        'The episode it was written from: the breadcrumb, the video beside the text, "other articles"',
      type: 'reference',
      to: [{type: 'daatTalksEpisode'}],
      group: 'content',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'excerpt',
      description: 'The first paragraph on the cards (index, episode page, "other articles")',
      type: 'text',
      rows: 2,
      group: 'content',
      validation: (rule) => rule.required().max(200),
    }),
    defineField({
      name: 'summary',
      description: 'The second paragraph on the cards, and the article’s lead under its title',
      type: 'text',
      rows: 3,
      group: 'content',
      validation: (rule) => rule.required().max(400),
    }),
    defineField({
      name: 'shortVersion',
      title: 'Short version',
      description:
        '«Коротка версія» at the top of the text: the main points, best as a numbered list. Empty: not shown',
      type: 'array',
      group: 'content',
      of: [
        defineArrayMember({
          type: 'block',
          styles: [{title: 'Normal', value: 'normal'}],
          lists: [
            {title: 'Numbered', value: 'number'},
            {title: 'Bullet', value: 'bullet'},
          ],
          marks: {decorators: [{title: 'Strong', value: 'strong'}], annotations: []},
        }),
      ],
    }),
    defineField({
      name: 'body',
      description: 'H2 headings make the "На цій сторінці" list beside the text',
      type: 'array',
      group: 'content',
      of: [
        defineArrayMember({
          type: 'block',
          styles: [
            {title: 'Normal', value: 'normal'},
            {title: 'Heading 2', value: 'h2'},
            {title: 'Heading 3', value: 'h3'},
            {title: 'Heading 4', value: 'h4'},
            {title: 'Quote', value: 'blockquote'},
          ],
          lists: [
            {title: 'Bullet', value: 'bullet'},
            {title: 'Numbered', value: 'number'},
          ],
          marks: {
            decorators: [
              {title: 'Strong', value: 'strong'},
              {title: 'Emphasis', value: 'em'},
            ],
            annotations: [
              defineArrayMember({
                name: 'link',
                type: 'object',
                title: 'Link',
                fields: [
                  defineField({
                    name: 'href',
                    type: 'url',
                    validation: (rule) =>
                      rule.uri({scheme: ['http', 'https', 'mailto'], allowRelative: true}),
                  }),
                ],
              }),
            ],
          },
        }),
        defineArrayMember({
          name: 'pullQuote',
          title: 'Guest quote',
          type: 'object',
          fields: [
            defineField({
              name: 'text',
              description: 'Word for word, without quotation marks: the site adds «»',
              type: 'text',
              rows: 3,
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'speaker',
              type: 'reference',
              to: [{type: 'daatTalksContributor'}, {type: 'authors'}],
            }),
            defineField({
              name: 'time',
              description:
                'Where it’s said in the video, e.g. "3:42" or "1:02:05": links to that moment',
              type: 'string',
              validation: (rule) =>
                rule.regex(/^(\d+:)?[0-5]?\d:[0-5]\d$/, {name: 'm:ss or h:mm:ss'}),
            }),
          ],
          preview: {
            select: {title: 'text', subtitle: 'speaker.name'},
          },
        }),
        defineArrayMember({
          name: 'callout',
          title: 'Callout',
          type: 'object',
          fields: [
            defineField({
              name: 'title',
              type: 'string',
              initialValue: 'Ключова думка',
            }),
            defineField({
              name: 'text',
              type: 'text',
              rows: 3,
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: {title: 'title', subtitle: 'text'},
          },
        }),
        defineArrayMember({
          type: 'image',
          options: {hotspot: true},
          fields: [
            defineField({
              name: 'alt',
              title: 'Alternative text',
              description: 'What the image shows, for readers who can’t see it',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'caption',
              type: 'string',
            }),
          ],
        }),
        defineArrayMember({
          name: 'richTableBlock',
          title: 'Table',
          type: 'richTableBlock',
        }),
      ],
      validation: (rule) => rule.required(),
    }),

    // ---------- Meta ----------
    defineField({
      name: 'publishedAt',
      description: 'The date under the title; orders the episode’s articles, oldest first',
      type: 'datetime',
      group: 'meta',
      initialValue: () => new Date().toISOString(),
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'authors',
      description: 'The hosts who wrote it, first in the byline',
      type: 'array',
      of: [defineArrayMember({type: 'reference', to: [{type: 'authors'}]})],
      group: 'meta',
      validation: (rule) => rule.required().min(1).unique(),
    }),
    defineField({
      name: 'contributors',
      description: 'Guests in the byline. Empty: the episode’s guests',
      type: 'array',
      of: [defineArrayMember({type: 'reference', to: [{type: 'daatTalksContributor'}]})],
      group: 'meta',
      validation: (rule) => rule.unique(),
    }),
    defineField({
      name: 'heroImage',
      description: 'For social cards and previews. Empty: the episode’s cover',
      type: 'image',
      options: {hotspot: true},
      fields: [{name: 'alt', type: 'string', title: 'Alternative text'}],
      group: 'meta',
    }),

    // ---------- SEO ----------
    defineField({
      name: 'primary_keyword',
      title: 'Primary keyword',
      description: 'The search query the article answers first, e.g. "касовий розрив"',
      type: 'string',
      group: 'seo',
    }),
    defineField({
      name: 'secondary_keywords',
      title: 'Secondary keywords',
      description: 'Related queries it also answers; press Enter after each',
      type: 'array',
      of: [defineArrayMember({type: 'string'})],
      options: {layout: 'tags'},
      group: 'seo',
      validation: (rule) => rule.unique(),
    }),
    defineField({
      name: 'seo_title',
      title: 'SEO title',
      description: 'Empty: "<title> | Daat Talks"',
      type: 'string',
      group: 'seo',
      validation: (rule) =>
        rule.max(60).warning('Search engines cut titles longer than ~60 characters'),
    }),
    defineField({
      name: 'seo_description',
      title: 'SEO description',
      description: 'Empty: the excerpt',
      type: 'text',
      rows: 3,
      group: 'seo',
      validation: (rule) =>
        rule.max(160).warning('Search engines cut descriptions longer than ~160 characters'),
    }),
    defineField({
      name: 'seo_image',
      title: 'Social sharing image',
      description: '1200 × 630. Empty: the hero image, else the episode’s cover',
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
    select: {title: 'title', number: 'episode.number', media: 'heroImage'},
    prepare: ({title, number, media}) => ({
      title,
      subtitle: number ? `Епізод ${number}` : undefined,
      media,
    }),
  },
})
