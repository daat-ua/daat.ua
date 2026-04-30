import {ALL_FIELDS_GROUP, defineField, defineType} from 'sanity'

export const caseStudy = defineType({
    name: 'caseStudy',
    title: 'Case Studies',
    type: 'document',

    groups: [
        {
            name: 'content',
            title: 'Content',
            default: true,
        },
        {
            name: 'meta',
            title: 'Meta data',
        },
        {
            name: 'seo',
            title: 'SEO',
        },
        {
            ...ALL_FIELDS_GROUP,
            hidden: true,
        },
    ],

    fields: [
        defineField({
            name: 'title',
            type: 'string',
            validation: (rule) => rule.required(),
            group: 'content',
        }),

        defineField({
            name: 'slug',
            type: 'slug',
            options: {source: 'title'},
            validation: (rule) => rule.required(),
            group: 'content',
        }),

        defineField({
            name: 'author',
            type: 'reference',
            to: [{type: 'authors'}],
            validation: (rule) => rule.required(),
            group: 'meta',
        }),

        defineField({
            name: 'tags',
            type: 'array',
            of: [{type: 'string'}],
            options: {layout: 'tags'},
            group: 'meta',
        }),

        defineField({
            name: 'teaser',
            description: 'Short brief shown on listing pages',
            type: 'text',
            rows: 3,
            group: 'content',
        }),

        defineField({
            name: 'body',
            description: 'Page contents',
            type: 'array',
            of: [{type: 'block'}, {type: 'image'}],
            group: 'content',
        }),

        defineField({
            name: 'seo_title',
            title: 'SEO title',
            type: 'string',
            group: 'seo',
        }),

        defineField({
            name: 'seo_description',
            title: 'SEO description',
            type: 'text',
            rows: 3,
            group: 'seo',
        }),

        defineField({
            name: 'seo_keywords',
            title: 'SEO keywords',
            type: 'array',
            of: [{type: 'string'}],
            options: {layout: 'tags'},
            group: 'seo',
        }),

        defineField({
            name: 'seo_image',
            title: 'Social sharing image',
            description: 'Image used for Open Graph / Twitter cards',
            type: 'image',
            options: {hotspot: true},
            fields: [
                {
                    name: 'alt',
                    type: 'string',
                    title: 'Alternative Text',
                },
            ],
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

    preview: {
        select: {
            title: 'title',
            subtitle: 'author.name',
        },
    },
})
