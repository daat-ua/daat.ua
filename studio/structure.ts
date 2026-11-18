import type {StructureResolver} from 'sanity/structure'

// The Studio's content list: every document type as by default, but "Daat Talks articles" grouped by episode
// (newest first), each episode opening its articles in the order they were published; then the articles without an
// episode (they get no page on the site) and all of them. An article created inside an episode starts with that
// episode set (the `daatTalksArticle-by-episode` template, sanity.config.ts).

const API_VERSION = '2025-02-19'

export const structure: StructureResolver = (S, {getClient}) =>
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
              // fetched each time the pane opens, so a new episode shows up without reloading the Studio
              .child(async () => {
                const episodes = await getClient({apiVersion: API_VERSION}).fetch<
                  {_id: string; number?: number; title?: string}[]
                >(
                  `*[_type == "daatTalksEpisode" && !(_id in path("drafts.**"))] | order(number desc){_id, number, title}`,
                )
                return S.list()
                  .title('Daat Talks articles')
                  .items([
                    ...episodes.map((episode) =>
                      S.listItem()
                        .id(episode._id)
                        .title(`#${episode.number ?? '?'} ${episode.title ?? ''}`.trim())
                        .schemaType('daatTalksArticle')
                        .child(
                          S.documentList()
                            .id(`articles-${episode._id}`)
                            .title(episode.title ?? 'Articles')
                            .schemaType('daatTalksArticle')
                            .apiVersion(API_VERSION)
                            .filter('_type == "daatTalksArticle" && episode._ref == $episodeId')
                            .params({episodeId: episode._id})
                            .defaultOrdering([{field: 'publishedAt', direction: 'asc'}])
                            .initialValueTemplates([
                              S.initialValueTemplateItem('daatTalksArticle-by-episode', {
                                episodeId: episode._id,
                              }),
                            ]),
                        ),
                    ),
                    S.divider(),
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
                  ])
              }),
      ),
    )
