import { defineQuery } from "groq";

// GROQ queries for the "Delivery audit findings" (`post`) and "Case Studies" (`caseStudy`) collections. Types
// are generated from these by `npm run typegen` (src/sanity/sanity.types.ts), and sanityClient.fetch() returns
// them.

/** Slugs of all findings, for getStaticPaths */
export const FINDING_SLUGS_QUERY = defineQuery(`*[_type == "post" && defined(slug.current)].slug.current`);

/** One finding, everything its page shows */
export const FINDING_QUERY = defineQuery(`*[_type == "post" && slug.current == $slug][0]{
  title,
  "slug": slug.current,
  image{ alt, hotspot, crop, asset->{ _id, metadata{ lqip, dimensions{ width, height } } } },
  art_description,
  artist,
  "author": author.author->{
    name,
    bio,
    linkedin_link,
    photo{ alt, hotspot, crop, asset->{ _id } }
  },
  teaser,
  body,
  summarisation,
  "efforts": [
    efforts_strategic_management,
    efforts_delivery_excellence,
    efforts_sales,
    efforts_marketing,
    efforts_company_operations,
    efforts_people_management,
    efforts_financial_control
  ],
  seo_title,
  seo_description,
  no_index
}`);

/** Teaser cards for the findings carousel, newest first */
export const FINDING_TEASERS_QUERY = defineQuery(`*[_type == "post" && defined(slug.current)] | order(publishedAt desc){
  _id,
  title,
  "slug": slug.current,
  enabler,
  image{ hotspot, crop, asset->{ _id, metadata{ lqip } } }
}`);

/** The founders (every author is one), for the calls to action on a finding page */
export const FOUNDERS_QUERY = defineQuery(`*[_type == "authors" && defined(photo.asset)] | order(name asc){
  _id,
  name,
  photo{ hotspot, crop, asset->{ _id } }
}`);

/** Slugs of all case studies, for getStaticPaths */
export const CASE_STUDY_SLUGS_QUERY = defineQuery(`*[_type == "caseStudy" && defined(slug.current)].slug.current`);

/** One case study, everything its page shows */
export const CASE_STUDY_QUERY = defineQuery(`*[_type == "caseStudy" && slug.current == $slug][0]{
  _id,
  title,
  "slug": slug.current,
  lead,
  heroImage{ hotspot, crop, asset->{ _id, metadata{ lqip, dimensions{ width, height } } } },
  industry,
  companySize,
  market,
  commissionedBy,
  duration,
  year,
  figures[]{ _key, value, label },
  context,
  contextQuote,
  phases[]{ _key, label, title, text },
  phasesText,
  findingsIntro,
  conclusions[]{ _key, title, text, findingLabel, "finding": finding->{ title, "slug": slug.current } },
  maturity,
  roadmapLead,
  horizons[]{ _key, tab, label, title, text },
  changes[]{ _key, metric, before, after, period },
  changesText,
  testimonial{ quote, "name": select(showName == true => name), role, showName, transcript },
  "otherCases": otherCases[]->{ _id, title, "slug": slug.current, cardTag, industry, companySize, heroImage{ hotspot, crop, asset->{ _id } } },
  seo_title,
  seo_description,
  no_index
}`);

/** The case studies' teasers, newest first: the index page (featured case and list) and "other cases" carousels */
export const CASE_STUDY_TEASERS_QUERY =
  defineQuery(`*[_type == "caseStudy" && defined(slug.current)] | order(publishedAt desc){
  _id,
  title,
  "slug": slug.current,
  lead,
  featured,
  cardTag,
  industry,
  companySize,
  commissionedBy,
  "figure": figures[0]{ value, label },
  heroImage{ hotspot, crop, asset->{ _id, metadata{ lqip } } }
}`);

/** "Все про менеджмент делівері": every episode, newest first (the index, the carousel, the slugs) */
export const DELIVERY_EPISODES_QUERY =
  defineQuery(`*[_type == "deliveryEpisode" && defined(slug.current)] | order(publishedAt desc){
  _id,
  title,
  "slug": slug.current,
  youtubeUrl,
  teaser,
  lead,
  thumbnail{ hotspot, crop, asset->{ _id } }
}`);

/** One episode, everything its page shows */
export const DELIVERY_EPISODE_QUERY = defineQuery(`*[_type == "deliveryEpisode" && slug.current == $slug][0]{
  _id,
  title,
  "slug": slug.current,
  youtubeUrl,
  teaser,
  lead,
  body,
  publishedAt,
  duration,
  "author": author->name,
  thumbnail{ hotspot, crop, asset->{ _id } },
  seo_title,
  seo_description,
  no_index
}`);
