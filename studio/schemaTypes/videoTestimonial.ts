import {ALL_FIELDS_GROUP, defineField, defineType} from 'sanity'

// A client's video testimonial (DAA-240) for "Відгуки наших клієнтів" on the ATLAS page
// (src/components/atlas-landing/sections/Testimonials.astro): the cover with its title and play button, the HLS
// video from Cloudflare R2, and under it the company's logo, the second title and a link to its case study. The
// section shows the first two, by `order`.

/** an https link to a video's folder (…/testimonials/01-bndigital/) or its playlist.m3u8 */
const isVideoFolder = (value?: string) =>
  !value || /^https:\/\/[^\s]+(\/|\/playlist\.m3u8)$/.test(value)

export const videoTestimonial = defineType({
  name: 'videoTestimonial',
  title: 'Video testimonials',
  type: 'document',

  groups: [
    {name: 'content', title: 'Content', default: true},
    {name: 'meta', title: 'Meta data'},
    {...ALL_FIELDS_GROUP, hidden: true},
  ],

  fields: [
    // ---------- Content ----------
    defineField({
      name: 'title',
      description:
        'On the cover, over the video, e.g. "Як CTO повернув собі тиждень і перестав гасити пожежі"',
      type: 'string',
      group: 'content',
      validation: (rule) => [
        rule.required().max(120),
        rule.max(90).warning('Longer titles crowd the play button'),
      ],
    }),
    defineField({
      name: 'cover',
      title: 'Cover image',
      description:
        'A frame of the video, 16:9 like the video (1920 × 1080 or larger). It stays over the video until play is pressed',
      type: 'image',
      options: {hotspot: true},
      group: 'content',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'videoFolder',
      title: 'Video folder',
      description:
        'The video’s folder on Cloudflare R2 (with playlist.m3u8, 720p, 1080p, 2160p), e.g. https://pub-….r2.dev/testimonials/01-bndigital/. The bucket’s CORS must allow the site’s domain',
      type: 'url',
      group: 'content',
      validation: (rule) =>
        rule
          .required()
          .uri({scheme: ['https']})
          .custom((value) =>
            isVideoFolder(value) ? true : 'A folder ending in "/" or a link to its playlist.m3u8',
          ),
    }),
    defineField({
      name: 'companyLogo',
      title: 'Company logo',
      description:
        'Under the video, on the page’s light ground: SVG (best) or PNG on a transparent ground, any colour (the site shows it in near-black)',
      type: 'image',
      options: {accept: 'image/svg+xml,image/png,image/webp'},
      fields: [
        defineField({
          name: 'alt',
          title: 'Company name',
          description: 'Read out instead of the logo',
          type: 'string',
          validation: (rule) => rule.required(),
        }),
      ],
      group: 'content',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'subtitle',
      title: 'Second title',
      description:
        'Beside the logo, under the video, e.g. "Діагностика ATLAS і дорожня карта для продуктової компанії на 60 людей"',
      type: 'string',
      group: 'content',
      validation: (rule) => [
        rule.required().max(140),
        rule.max(100).warning('Keep it to two lines beside the logo'),
      ],
    }),
    defineField({
      name: 'caseStudy',
      title: 'Case study',
      description:
        'Optional: "Читати кейс ›", beside the second title, opens its page. Empty: no link',
      type: 'reference',
      to: [{type: 'caseStudy'}],
      group: 'content',
    }),

    // ---------- Meta ----------
    defineField({
      name: 'order',
      description: 'Lower first; the section shows the first two, the first one open',
      type: 'number',
      group: 'meta',
      initialValue: 10,
      validation: (rule) => rule.integer(),
    }),
  ],

  orderings: [
    {title: 'As on the page', name: 'orderAsc', by: [{field: 'order', direction: 'asc'}]},
  ],

  preview: {
    select: {title: 'title', company: 'companyLogo.alt', media: 'cover'},
    prepare: ({title, company, media}) => ({title, subtitle: company, media}),
  },
})
