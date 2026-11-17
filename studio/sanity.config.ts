import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './schemaTypes'
import { table } from '@sanity/table';
import { richTablePlugin } from 'sanity-plugin-rich-table';

export default defineConfig({
    name: 'default',
    title: 'daat.ua',

    projectId: '7mfhokh5',
    dataset: 'production',

    plugins: [
        structureTool(),
        visionTool(),
        table(),
        richTablePlugin(),
    ],

    schema: {
        types: schemaTypes,
    },
})
