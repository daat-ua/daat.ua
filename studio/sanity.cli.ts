import { defineCliConfig } from 'sanity/cli'

export default defineCliConfig({
    api: {
        projectId: '7mfhokh5',
        dataset: 'production'
    },
    // Types for the website's GROQ queries (src/ at the repo root): `npm run typegen`
    typegen: {
        path: '../src/**/*.{ts,astro}',
        schema: 'schema.json',
        generates: '../src/sanity/sanity.types.ts',
        overloadClientMethods: true,
    },
    deployment: {
        /**
         * Enable auto-updates for studios.
         * Learn more at https://www.sanity.io/docs/cli#auto-updates
         */
        autoUpdates: true,
        appId: 'mefxsszr4sq54fk1rrjalzca',
    }
})
