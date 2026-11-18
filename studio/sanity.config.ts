import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './schemaTypes'
import { table } from '@sanity/table';
import { richTablePlugin } from 'sanity-plugin-rich-table';
import { structure } from './structure';

export default defineConfig({
    name: 'default',
    title: 'daat.ua',

    projectId: '7mfhokh5',
    dataset: 'production',

    plugins: [
        structureTool({ structure }),
        visionTool(),
        table(),
        richTablePlugin(),
    ],

    schema: {
        types: schemaTypes,
        // a new article inside an episode's list (structure.ts) starts with that episode
        templates: (previous) => [
            ...previous,
            {
                id: 'daatTalksArticle-by-episode',
                title: 'Daat Talks article in an episode',
                schemaType: 'daatTalksArticle',
                parameters: [{ name: 'episodeId', type: 'string' }],
                value: ({ episodeId }: { episodeId: string }) => ({
                    episode: { _type: 'reference', _ref: episodeId },
                }),
            },
        ],
    },
})
