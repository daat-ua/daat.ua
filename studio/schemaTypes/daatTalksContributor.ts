import {ALL_FIELDS_GROUP, defineField, defineType} from 'sanity'

// A Daat Talks guest (DAA-239): one document per person, reused when they come back for another episode. Shown on
// the index and the episode page (avatar, name, role; the name links to LinkedIn) and in an article's byline.
// The hosts are `authors`, not contributors.

export const daatTalksContributor = defineType({
  name: 'daatTalksContributor',
  title: 'Daat Talks contributors',
  type: 'document',

  groups: [
    {name: 'content', title: 'Content', default: true},
    {name: 'meta', title: 'Meta data'},
    {...ALL_FIELDS_GROUP, hidden: true},
  ],

  fields: [
    // ---------- Content ----------
    defineField({
      name: 'name',
      description: 'First and last name, e.g. "Женя Вишньова"',
      type: 'string',
      group: 'content',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'role',
      description: 'As shown under the name, without the company, e.g. "Засновниця та CEO"',
      type: 'string',
      group: 'content',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'company',
      description: 'Follows the role after a comma, e.g. "Dinarys"',
      type: 'string',
      group: 'content',
    }),
    defineField({
      name: 'photo',
      description: 'A face, cropped to a circle (48–64 px on the site). Empty: the initials',
      type: 'image',
      options: {hotspot: true},
      fields: [{name: 'alt', type: 'string', title: 'Alternative text'}],
      group: 'content',
    }),
    defineField({
      name: 'linkedin',
      title: 'LinkedIn',
      description: 'The guest’s name on the episode page links here',
      type: 'url',
      group: 'content',
    }),
    defineField({
      name: 'bio',
      description: 'One or two sentences. Not shown yet',
      type: 'text',
      rows: 3,
      group: 'content',
    }),

    // ---------- Meta ----------
    defineField({
      name: 'slug',
      description: 'For a future guest page with all their episodes. Not needed yet',
      type: 'slug',
      options: {source: 'name'},
      group: 'meta',
    }),
    defineField({
      name: 'companyUrl',
      title: 'Company website',
      type: 'url',
      group: 'meta',
    }),
  ],

  preview: {
    select: {title: 'name', role: 'role', company: 'company', media: 'photo'},
    prepare: ({title, role, company, media}) => ({
      title,
      subtitle: [role, company].filter(Boolean).join(', '),
      media,
    }),
  },
})
