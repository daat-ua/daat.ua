import { defineQuery } from "groq";

// GROQ queries for the "Delivery audit findings" (`post`), "Case Studies" (`caseStudy`), "Delivery management
// episodes" (`deliveryEpisode`) and Daat Talks (`daatTalksEpisode`, `daatTalksArticle`) collections. Types are generated from these by `npm run typegen`
// (src/sanity/sanity.types.ts), and sanityClient.fetch() returns them. A page per document gets its whole
// collection in one query in getStaticPaths, not a query per page; queries several pages share run once
// (src/sanity/shared.ts).

/** Every finding, everything its page shows, for getStaticPaths */
export const FINDINGS_QUERY = defineQuery(`*[_type == "post" && defined(slug.current)]{
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

/** Every case study, everything its page shows, for getStaticPaths */
export const CASE_STUDIES_QUERY = defineQuery(`*[_type == "caseStudy" && defined(slug.current)]{
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
  anonymised,
  clientLogo{ alt, asset->{ _id, url, extension, metadata{ dimensions{ width, height } } } },
  clientLinkedin,
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
  showTestimonial,
  testimonial{ quote, "name": select(showName == true => name), role, showName, transcript },
  "otherCases": otherCases[]->{ _id, title, "slug": slug.current, cardTag, industry, companySize, anonymised, clientLogo{ alt, asset->{ _id, url, extension, metadata{ dimensions{ width, height } } } }, heroImage{ hotspot, crop, asset->{ _id } } },
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
  anonymised,
  clientLogo{ alt, asset->{ _id, url, extension, metadata{ dimensions{ width, height } } } },
  heroImage{ hotspot, crop, asset->{ _id, metadata{ lqip } } }
}`);

/** "Все про менеджмент делівері": every episode's teaser, newest first (the index and the site map) */
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

/** Every episode, everything its page shows, newest first (its "other episodes" carousel), for getStaticPaths */
export const DELIVERY_EPISODE_PAGES_QUERY =
  defineQuery(`*[_type == "deliveryEpisode" && defined(slug.current)] | order(publishedAt desc){
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

// ---------- Daat Talks (DAA-239): episodes (`daatTalksEpisode`), the articles written from them
// (`daatTalksArticle`) and their guests (`daatTalksContributor`) ----------

/** Every episode, newest first, with its guests and its articles' cards (oldest first): the index, the episode
 * pages and the site map. `text` (the prose, quotes, callouts and table cells) gives the reading time. References
 * to unpublished documents (a guest in a release) are left out before they're followed */
export const TALKS_EPISODES_QUERY =
  defineQuery(`*[_type == "daatTalksEpisode" && defined(slug.current)] | order(number desc){
  _id,
  number,
  title,
  "slug": slug.current,
  youtubeUrl,
  teaser,
  description,
  "guests": guests[defined(@->_id)]->{ _id, name, role, company, linkedin, photo{ hotspot, crop, asset->{ _id } } },
  thumbnail{ hotspot, crop, asset->{ _id } },
  "articles": *[_type == "daatTalksArticle" && episode._ref == ^._id && defined(slug.current)] | order(publishedAt asc){
    _id,
    title,
    "slug": slug.current,
    excerpt,
    summary,
    "text": array::join([pt::text(body)] + body[_type in ["pullQuote", "callout"]].text + [pt::text(body[_type == "richTableBlock"].rows[].cells[].content[])], " ")
  },
  seo_title,
  seo_description,
  seo_image{ hotspot, crop, asset->{ _id } },
  no_index
}`);

/** Every article with an episode, everything its page shows, for getStaticPaths: the byline's people (the guests
 * default to the episode's), the body with its images' assets and its quotes' speakers, and the episode with
 * its articles for "other articles" */
export const TALKS_ARTICLES_QUERY =
  defineQuery(`*[_type == "daatTalksArticle" && defined(slug.current) && defined(episode->slug.current)]{
  _id,
  title,
  "slug": slug.current,
  excerpt,
  summary,
  shortVersion,
  body[]{
    ...,
    _type == "image" => { ..., asset->{ _id, metadata{ lqip, dimensions{ width, height } } } },
    _type == "pullQuote" => { ..., "speaker": speaker->name }
  },
  "text": array::join([pt::text(body)] + body[_type in ["pullQuote", "callout"]].text + [pt::text(body[_type == "richTableBlock"].rows[].cells[].content[])], " "),
  publishedAt,
  "authors": authors[defined(@->_id)]->{ _id, name, photo{ hotspot, crop, asset->{ _id } } },
  "contributors": select(
    count(contributors[defined(@->_id)]) > 0 => contributors[defined(@->_id)]->{ _id, name, photo{ hotspot, crop, asset->{ _id } } },
    episode->guests[defined(@->_id)]->{ _id, name, photo{ hotspot, crop, asset->{ _id } } }
  ),
  heroImage{ hotspot, crop, asset->{ _id } },
  "episode": episode->{
    _id,
    number,
    title,
    "slug": slug.current,
    youtubeUrl,
    thumbnail{ hotspot, crop, asset->{ _id } },
    "articles": *[_type == "daatTalksArticle" && episode._ref == ^._id && defined(slug.current)] | order(publishedAt asc){
      _id,
      title,
      "slug": slug.current,
      excerpt
    }
  },
  seo_title,
  seo_description,
  seo_image{ hotspot, crop, asset->{ _id } },
  primary_keyword,
  secondary_keywords,
  no_index
}`);
