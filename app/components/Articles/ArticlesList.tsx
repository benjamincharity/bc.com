import React from 'react'

import { RoutesPath } from '~/data/routes.data'
import { ArticleTitleLink } from '~/routes/articles/components/ArticleTitleLink'
import { PublishDate } from '~/routes/articles_.$id/components/PublishDate'
import { ArticleReference } from '~/utils/articles.server'

interface ArticleProps {
    item: ArticleReference
}

const Article = React.forwardRef<HTMLDivElement, ArticleProps>(
    ({ item }, ref) => {
        return (
            <article
                className="group mb-10 font-sourceSerif4"
                key={item.slug}
                ref={ref}
            >
                <ArticleTitleLink
                    title={item.frontmatter.title}
                    to={RoutesPath.article(item.slug)}
                />

                <p
                    className={
                        'mb-1 pt-2 text-base font-bold leading-5 text-gray-600 opacity-80'
                    }
                >
                    {item.frontmatter.summary}
                    {!!item.frontmatter.readingTime && (
                        <span
                            className={'reading-time ml-2'}
                            title={`Estimated reading time: ${item.frontmatter.readingTime}min`}
                        >
                            [{item.frontmatter.readingTime}min]
                        </span>
                    )}
                </p>

                <PublishDate publishDate={item.frontmatter.publishDate} />
            </article>
        )
    }
)
Article.displayName = 'Article'

export function ArticlesList({
    articles = [],
    className = '',
}: {
    articles: ArticleReference[]
    className?: string
}) {
    return (
        <section className={className}>
            {articles?.map((item) => {
                return <Article key={item.slug} item={item} />
            })}
        </section>
    )
}
