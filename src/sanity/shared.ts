import { sanityClient } from "./client";
import { CASE_STUDY_TEASERS_QUERY, DELIVERY_EPISODES_QUERY, FINDING_TEASERS_QUERY, FOUNDERS_QUERY } from "./queries";

// Queries that many pages run, fetched once per build and shared: the build renders every page in one process,
// so each of these is one request to Sanity, not one per page.

const once = <T>(fetch: () => Promise<T>) => {
  let result: Promise<T> | undefined;
  return () => (result ??= fetch());
};

/** the findings' teasers: the carousels (one per enabler on the catalogue page, on the ATLAS page and on every
 * finding) and the site map */
export const getFindingTeasers = once(() => sanityClient.fetch(FINDING_TEASERS_QUERY));

/** the founders' faces: the call to action beside every finding, case study and episode, and the phones' call bar */
export const getFounders = once(() => sanityClient.fetch(FOUNDERS_QUERY));

/** the case studies' teasers: the index, the "other cases" carousels and the site map */
export const getCaseStudyTeasers = once(() => sanityClient.fetch(CASE_STUDY_TEASERS_QUERY));

/** the delivery management episodes: the index and the site map */
export const getDeliveryEpisodes = once(() => sanityClient.fetch(DELIVERY_EPISODES_QUERY));
