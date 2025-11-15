import { ALL_FIELDS_GROUP, defineField, defineType } from 'sanity'

export const finding = defineType({
    name: 'findings',
    title: 'Delivery audit findings',
    type: 'document',
    groups: [
        {
            name: 'content',
            title: 'Content',
            default: true
        },
        {
            name: 'seo',
            title: 'SEO',
        },
        {
            name: 'efforts_radar',
            title: 'Efforts radar',
        },
        {
            ...ALL_FIELDS_GROUP,
            hidden: true,
        },
    ],
    fields: [

        // SEO-specific fields
        defineField({
            name: 'seo_title',
            type: 'string',
            validation: (rule) => rule.required(),
            group: 'seo'
        }),

        // Efforts radar fields
        defineField({
            title: 'Strategic management',
            name: 'efforts_radar_strategic_management',
            type: 'number',
            options: { list: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100] },
            initialValue: 10,
            group: 'efforts_radar'
        }),

        defineField({
            title: 'Delivery',
            name: 'efforts_radar_delivery',
            type: 'number',
            options: { list: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100] },
            initialValue: 10,
            group: 'efforts_radar'
        }),

        defineField({
            title: 'Sales',
            name: 'efforts_radar_sales',
            type: 'number',
            options: { list: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100] },
            initialValue: 10,
            group: 'efforts_radar'
        }),

        defineField({
            title: 'Marketing',
            name: 'efforts_radar_marketing',
            type: 'number',
            options: { list: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100] },
            initialValue: 10,
            group: 'efforts_radar'
        }),

        defineField({
            title: 'Company operations',
            name: 'efforts_radar_company_operations',
            type: 'number',
            options: { list: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100] },
            initialValue: 10,
            group: 'efforts_radar'
        }),

        defineField({
            title: 'People management',
            name: 'efforts_radar_people_management',
            type: 'number',
            options: { list: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100] },
            initialValue: 10,
            group: 'efforts_radar'
        }),

        defineField({
            title: 'Financial control',
            name: 'efforts_radar_financial_control',
            type: 'number',
            options: { list: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100] },
            initialValue: 10,
            group: 'efforts_radar'
        }),

        defineField({
            name: 'title',
            type: 'string',
            validation: (rule) => rule.required(),
            group: 'content'
        }),
        defineField({
            name: 'slug',
            type: 'slug',
            options: { source: 'title' },
            validation: (rule) => rule.required(),
            group: 'content'
        }),
        defineField({
            name: 'publishedAt',
            type: 'datetime',
            initialValue: () => new Date().toISOString(),
            validation: (rule) => rule.required(),
            group: 'content'
        }),
        defineField({
            name: 'youtubeLink',
            title: "Youtube clip link",
            description: "Link to a Youtube clip with explanation of this Delivery Audit finding",
            type: 'url',
            group: 'content'
        }),
        defineField({
            name: 'image',
            type: 'image',
            group: 'content',
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
        }),
        defineField({
            name: 'body',
            description: "Page contents",
            type: 'array',
            group: 'content',
            of: [
                {
                    type: 'block'
                }, {
                    type: 'image'
                }],
        }),
        defineField({
            name: 'teaser',
            description: "Short brief of a post, will be displayed at the index page",
            type: 'array',
            group: 'content',
            of: [{ type: 'block' }],
        }),
    ],

    preview: {
        select: {
            title: "title",
            media: "image"
        },
    },
})