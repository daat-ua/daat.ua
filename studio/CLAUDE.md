# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Sanity CMS Studio for daat.ua, a content management system for delivery audit findings and posts. The project is built using TypeScript, React, and Sanity Studio with a focus on structured content management for business consulting and auditing content.

## Development Commands

- `npm run dev` - Start development server (Sanity Studio dev mode)
- `npm run start` - Start production server
- `npm run build` - Build the project for production
- `npm run deploy` - Deploy to Sanity hosting
- `npm run deploy-graphql` - Deploy GraphQL API to Sanity

## Code Architecture

### Content Schema Structure
The project uses Sanity's schema-first approach with three main content types defined in `schemaTypes/`:

- **Posts** (`post.ts`) - Main blog posts/articles with McKinsey S7 framework categorization, Linear issue tracking, and YouTube integration
- **Findings** (`finding.ts`) - Delivery audit findings with effort radar metrics across 7 business dimensions
- **Authors** (`author.ts`) - Content author profiles with LinkedIn integration

### Key Configuration Files
- `sanity.config.ts` - Main Sanity configuration (project: 7mfhokh5, dataset: production)
- `schemaTypes/index.ts` - Schema type exports and registration
- `tsconfig.json` - TypeScript configuration with ES2017 target
- `eslint.config.mjs` - ESLint configuration using Sanity's studio config

### Content Structure Features
- **Grouped field organization** - Content, Meta, SEO, and Efforts radar field groups
- **McKinsey S7 Framework** - Strategic categorization for posts (S1-S7 categories)
- **Efforts Radar** - 7-dimensional scoring system for findings (0-100 scale):
  - Strategic management, Delivery, Sales, Marketing, Company operations, People management, Financial control
- **Rich content support** - Portable text with embedded images
- **YouTube integration** - Dedicated fields for video explanations
- **Linear issue tracking** - Integration with Linear project management

### Styling and Code Standards
- Uses Prettier with custom config (no semicolons, 100 char width, single quotes, no bracket spacing)
- TypeScript strict mode enabled
- Styled Components for styling (v6.1.18)

## Dependencies
- **Sanity Studio v4.15** - Core CMS framework
- **@sanity/table v2.0** - Table editing plugin
- **@sanity/vision v4.15** - GROQ query testing tool
- **React 19.1** - UI framework
- **Styled Components 6.1** - CSS-in-JS styling
- **TypeScript 5.8** - Type system