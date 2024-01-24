import { TagsPayload } from '~/routes/articles_.tags/route'
import { ArticleReference } from '~/utils/articles.server'

export function getTagsFromArticles(articles: ArticleReference[]): TagsPayload {
    const tags = new Map<string, number>()

    articles.forEach((a) => {
        a.frontmatter?.tags?.forEach((tag: string) => {
            tags.set(tag, (tags.get(tag) || 0) + 1)
        })
    })
    return Array.from(tags.entries()).sort((a, b) => a[0].localeCompare(b[0])) // sort alphabetically
}
