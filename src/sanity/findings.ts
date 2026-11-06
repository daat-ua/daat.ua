import { sanityClient } from "./client";
import { FINDING_TEASERS_QUERY } from "./queries";
import type { FINDING_TEASERS_QUERY_RESULT } from "./sanity.types";

// The findings' teaser data, fetched once per build: the carousels (one per enabler on the catalogue page,
// one on the ATLAS page and on every finding) all read this.
let teasers: Promise<FINDING_TEASERS_QUERY_RESULT> | undefined;

export const getFindingTeasers = () => (teasers ??= sanityClient.fetch(FINDING_TEASERS_QUERY));
