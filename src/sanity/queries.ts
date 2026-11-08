import { defineQuery } from "groq";

// GROQ queries for the "Delivery audit findings" collection (`post` in the Studio). Types are generated
// from these by `npm run typegen` (src/sanity/sanity.types.ts), and sanityClient.fetch() returns them.

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
