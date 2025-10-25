import { defineField, defineType } from 'sanity'

export const postType = defineType({
    name: 'post',
    title: 'Post',
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            type: 'string',
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'slug',
            type: 'slug',
            options: { source: 'title' },
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'publishedAt',
            type: 'datetime',
            initialValue: () => new Date().toISOString(),
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'youtubeLink',
            title: "Youtube clip link",
            description: "Link to a Youtube clip with explanation of this Delivery Audit finding",
            type: 'url',
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
        }),
        defineField({
            name: 'body',
            description: "Page contents",
            type: 'array',
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