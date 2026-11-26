import { post } from './post'
import { author } from './author';
import { caseStudy } from './caseStudy';
import { deliveryEpisode } from './deliveryEpisode';
import { daatTalksEpisode } from './daatTalksEpisode';
import { daatTalksArticle } from './daatTalksArticle';
import { daatTalksContributor } from './daatTalksContributor';
import { videoTestimonial } from './videoTestimonial';

// A new type the site renders must also go in the filter of the Sanity webhook that rebuilds the site (README, Deploy)
export const schemaTypes = [
    post,
    author,
    caseStudy,
    deliveryEpisode,
    daatTalksEpisode,
    daatTalksArticle,
    daatTalksContributor,
    videoTestimonial,
];
