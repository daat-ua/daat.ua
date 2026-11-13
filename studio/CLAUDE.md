# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Sanity Studio v6 for daat.ua — a content backend for delivery-audit findings, blog posts, and author profiles. It lives in `studio/` of the website repo (imported with its history) as a standalone app with its own `package.json`; the website at the repo root reads the Sanity dataset (`projectId: 7mfhokh5`, dataset `production`) at build time.

## Commands

- `npm run dev` — local studio at `http://localhost:3333`
- `npm run build` — production build
- `npm run deploy` — deploy hosted studio to Sanity
- `npm run deploy-graphql` — (re)deploy the GraphQL API for the dataset; run this after any schema change consumers depend on
- `npm run typegen` — extract the schema to `schema.json` and generate the website's query types (`../src/sanity/sanity.types.ts`, configured in `sanity.cli.ts`); run after any schema change, then rebuild the site

There is no test runner, linter script, or formatter script wired into npm. Lint/format are configured (ESLint via `@sanity/eslint-config-studio`, Prettier inline in `package.json`) but must be invoked directly (`npx eslint .`, `npx prettier --check .`).

## Architecture

### Schema is the architecture
Everything meaningful in this repo is the content model in `schemaTypes/`. Each file exports one document type, all are registered through `schemaTypes/index.ts`, and that array is passed to `defineConfig` in `sanity.config.ts`. To add a content type: create the file, export the `defineType(...)`, and add it to the `index.ts` array — registration is purely manual.

### Schema name vs. file name mismatch (gotcha)
The exported variable name, the file name, and the `name:` field of the document do not all match. The file/export name is for humans; references between documents must use the **schema `name`**:
- `post.ts` → `name: 'post'` (titled "Delivery audit findings" in the studio UI; the website renders these at `/uk-UA/atlas/findings/<slug>`, `enabler` — one of the seven ATLAS enablers, stored as a stable key — labels its carousel card in Ukrainian via `src/data/enablers.ts`)
- `author.ts` → `name: 'authors'` (plural)
- `blogPost.ts` → `name: 'blogPost'`

Example: `blogPost.ts` references authors via `to: [{type: 'authors'}]` — using `'author'` would silently break the reference.

### Field groups convention
All document types use the same set of field group names so the editor UX stays consistent: `content` (default), `meta`, `seo`, plus the spread `ALL_FIELDS_GROUP` (hidden) for showing every field. When adding fields, assign a `group` so they land in the right tab. The exception is `caseStudy`: it has one tab per section of the case page (Main, Client, Key figures … SEO), as the editors asked, since its form mirrors the page block by block.

### Project ID / dataset are duplicated
`projectId` and `dataset` appear in both `sanity.config.ts` and `sanity.cli.ts`. Changes must be made in both files.

### Plugins
Registered in `sanity.config.ts`: `structureTool`, `visionTool` (GROQ playground at `/vision` in dev), and `@sanity/table`. Add new plugins to the `plugins: []` array in the same file.

## Conventions

- Prettier: no semicolons, single quotes, 100-char width, no bracket spacing — matches what's in `package.json`'s `"prettier"` block. Existing files are not 100% consistent (some use semicolons); when editing a file, follow the surrounding style of that file.
- `linear_issue` field on posts uses the `DAA-...` Linear ticket prefix.
- TypeScript is `strict: true` with `target: ES2017`.
