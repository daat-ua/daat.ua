import { defineField, defineType } from 'sanity'

export const author = defineType({
    name: 'authors',
    title: 'Content authors',
    type: 'document',
    fields: [

        defineField({
            name: 'name',
            type: 'string',
            validation: (rule) => rule.required(),
        }),

        defineField({
            name: 'bio',
            type: 'text',
            rows: 3,
            validation: (rule) => rule.required(),
        }),

        defineField({
            name: 'linkedin_link',
            type: 'string'
        }),

        defineField({
            name: 'photo',
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
    ],

    preview: {
        select: {
            title: "name",
            media: "photo"
        },
    },
})