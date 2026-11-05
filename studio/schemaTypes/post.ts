import { ALL_FIELDS_GROUP, defineField, defineType } from 'sanity'
import { EffortSliderInput } from './effortSliderInput'

export const post = defineType({
    name: 'post',
    title: 'Delivery audit findings',
    type: 'document',

    groups: [{
        name: 'content',
        title: 'Content',
        default: true
    }, {
        name: 'meta',
        title: 'Meta data',
    }, {
        name: 'seo',
        title: 'SEO-related data',
    }, {
        name: 'efforts_radar',
        title: 'Efforts radar data',
    }, {
        name: 'art',
        title: 'Art',
    }, {
        ...ALL_FIELDS_GROUP,
        hidden: true,
    }],

    fields: [
        defineField({
            name: 'title',
            type: 'string',
            validation: (rule) => rule.required(),
            group: 'content',
        }),

        defineField({
            name: "linear_issue",
            title: "Linear issue",
            description: "Linear issue identificator (e.g. DAA-...)",
            type: 'string',
            group: 'meta',
        }),

        defineField({
            name: 'slug',
            type: 'slug',
            options: { source: 'title' },
            validation: (rule) => rule.required(),
            group: 'content',
        }),

        defineField({
            name: "author",
            type: 'object',
            fields: [
                {
                    // title: "Author",
                    name: "author",
                    type: "reference",
                    to: [{ type: 'authors' }]
                }
            ],
            group: 'meta',
        }),

        defineField({
            name: 'publishedAt',
            type: 'datetime',
            initialValue: () => new Date().toISOString(),
            validation: (rule) => rule.required(),
            group: 'meta',
        }),

        defineField({
            name: "s7_category",
            title: "S7 category",
            description: "McKinsey S7 category for this particular finding",
            type: "string",
            group: 'meta',
            options: {
                layout: 'radio',
                list: [
                    { value: "s1", title: "S1 Strategy" },
                    { value: "s2", title: "S2 Structure" },
                    { value: "s3", title: "S3 Systems" },
                    { value: "s4", title: "S4 Shared values" },
                    { value: "s5", title: "S5 Style" },
                    { value: "s6", title: "S6 Staff" },
                    { value: "s7", title: "S7 Skills" }
                ]
            },
        }),

        defineField({
            name: 'tag',
            title: 'Tag',
            description: 'Short label on the teaser card in the findings carousel (e.g. «Люди та ресурси»)',
            type: 'string',
            validation: (rule) => rule.max(40),
            group: 'meta',
        }),

        defineField({
            name: 'image',
            type: 'image',
            options: {
                hotspot: true,
            },
            fields: [
                {
                    name: "alt",
                    type: "string",
                    title: "Alternative Text",
                },
            ],
            group: 'art',
        }),

        defineField({
            name: 'art_description',
            title: 'Art Description',
            type: 'text',
            group: 'art',
        }),

        defineField({
            name: 'artist',
            title: 'Artist',
            type: 'string',
            group: 'art',
        }),

        defineField({
            name: 'teaser',
            description: "Short brief of a post, will be displayed at the index page. Usually a hook or a first paragraph of a article' body",
            type: 'array',
            of: [{ type: 'block' }],
            group: 'content',
        }),

        defineField({
            name: 'body',
            description: "Page contents",
            type: 'array',
            of: [{
                type: 'block'
            }, {
                type: 'image'
            }],
            group: 'content',
        }),

        defineField({
            name: 'summarisation',
            description: "Article summarisation",
            type: 'array',
            of: [{ type: 'block' }],
            group: 'content',
        }),

        defineField({
            name: 'youtubeLink',
            title: "Youtube clip link",
            description: "Link to a Youtube clip with explanation of this Delivery Audit finding",
            type: 'url',
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

        defineField({
            name: 'efforts_strategic_management',
            title: 'Strategic management',
            type: 'number',
            validation: (rule) => rule.min(0).max(100),
            initialValue: 50,
            group: 'efforts_radar',
            components: {input: EffortSliderInput},
        }),

        defineField({
            name: 'efforts_delivery_excellence',
            title: 'Delivery excellence',
            type: 'number',
            validation: (rule) => rule.min(0).max(100),
            initialValue: 50,
            group: 'efforts_radar',
            components: {input: EffortSliderInput},
        }),

        defineField({
            name: 'efforts_sales',
            title: 'Sales',
            type: 'number',
            validation: (rule) => rule.min(0).max(100),
            initialValue: 50,
            group: 'efforts_radar',
            components: {input: EffortSliderInput},
        }),

        defineField({
            name: 'efforts_marketing',
            title: 'Marketing',
            type: 'number',
            validation: (rule) => rule.min(0).max(100),
            initialValue: 50,
            group: 'efforts_radar',
            components: {input: EffortSliderInput},
        }),

        defineField({
            name: 'efforts_company_operations',
            title: 'Company operations',
            type: 'number',
            validation: (rule) => rule.min(0).max(100),
            initialValue: 50,
            group: 'efforts_radar',
            components: {input: EffortSliderInput},
        }),

        defineField({
            name: 'efforts_people_management',
            title: 'People management',
            type: 'number',
            validation: (rule) => rule.min(0).max(100),
            initialValue: 50,
            group: 'efforts_radar',
            components: {input: EffortSliderInput},
        }),

        defineField({
            name: 'efforts_financial_control',
            title: 'Financial control',
            type: 'number',
            validation: (rule) => rule.min(0).max(100),
            initialValue: 50,
            group: 'efforts_radar',
            components: {input: EffortSliderInput},
        }),
    ],

    preview: {
        select: {
            title: "title",
            subtitle: "linear_issue",
            media: "image"
        },
    },
})