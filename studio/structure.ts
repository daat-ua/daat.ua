import {catchError, map, of} from 'rxjs'
import type {ListItemBuilder, StructureBuilder, StructureResolver} from 'sanity/structure'

// The Studio's content list: every document type as by default, but "Daat Talks articles" grouped by episode
// (newest first), each episode opening its articles in the order they were published; then the articles without an
// episode (they get no page on the site) and all of them. An article created inside an episode starts with that
// episode set (the `daatTalksArticle-by-episode` template, sanity.config.ts).

const API_VERSION = '2025-02-19'

const EPISODES_QUERY = `*[_type == "daatTalksEpisode" && !(_id in path("drafts.**"))] | order(number desc){_id, number, title}`

interface Episode {
  _id: string
  number?: number
  title?: string
}

/** an episode's articles, by publishedAt; a new one starts with the episode set */
const episodeItem = (S: StructureBuilder, episode: Episode) =>
  S.listItem()
    // prefixed: an episode's ID can't clash with the fixed items' ids below
    .id(`episode-${episode._id}`)
    .title(`#${episode.number ?? '?'} ${episode.title ?? ''}`.trim())
    .schemaType('daatTalksArticle')
    .child(
      S.documentList()
        .id(`articles-of-${episode._id}`)
        .title(episode.title ?? 'Articles')
        .schemaType('daatTalksArticle')
        .apiVersion(API_VERSION)
        .filter('_type == "daatTalksArticle" && episode._ref == $episodeId')
        .params({episodeId: episode._id})
        .defaultOrdering([{field: 'publishedAt', direction: 'asc'}])
        .initialValueTemplates([
          S.initialValueTemplateItem('daatTalksArticle-by-episode', {episodeId: episode._id}),
        ]),
    )

/** the articles that don't hang on an episode, and all of them: always listed, even if the episodes fail to load */
const fixedItems = (S: StructureBuilder): ListItemBuilder[] => [
  S.listItem()
    .id('articles-without-episode')
    .title('Without an episode')
    .schemaType('daatTalksArticle')
    .child(
      S.documentList()
        .id('articles-without-episode')
        .title('Without an episode')
        .schemaType('daatTalksArticle')
        .apiVersion(API_VERSION)
        .filter('_type == "daatTalksArticle" && !defined(episode)'),
    ),
  S.listItem()
    .id('articles-all')
    .title('All articles')
    .schemaType('daatTalksArticle')
    .child(S.documentTypeList('daatTalksArticle').title('All articles')),
]

export const structure: StructureResolver = (S, {documentStore}) =>
  S.list()
    .title('Content')
    .items(
      S.documentTypeListItems().map((item) =>
        item.getId() !== 'daatTalksArticle'
          ? item
          : S.listItem()
              .id('daatTalksArticle')
              .title('Daat Talks articles')
              .schemaType('daatTalksArticle')
              // a live query: an episode published while the pane is open (or cached) shows up in it
              .child(() =>
                documentStore.listenQuery(EPISODES_QUERY, {}, {apiVersion: API_VERSION}).pipe(
                  map((episodes: Episode[]) =>
                    S.list()
                      .title('Daat Talks articles')
                      .items([
                        ...episodes.map((episode) => episodeItem(S, episode)),
                        S.divider(),
                        ...fixedItems(S),
                      ]),
                  ),
                  catchError(() =>
                    of(
                      S.list()
                        .title('Daat Talks articles (episodes failed to load)')
                        .items(fixedItems(S)),
                    ),
                  ),
                ),
              ),
      ),
    )
