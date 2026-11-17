import { post } from './post'
import { author } from './author';
import { caseStudy } from './caseStudy';
import { deliveryEpisode } from './deliveryEpisode';
import { daatTalksEpisode } from './daatTalksEpisode';
import { daatTalksArticle } from './daatTalksArticle';
import { daatTalksContributor } from './daatTalksContributor';

export const schemaTypes = [
    post,
    author,
    caseStudy,
    deliveryEpisode,
    daatTalksEpisode,
    daatTalksArticle,
    daatTalksContributor,
];
