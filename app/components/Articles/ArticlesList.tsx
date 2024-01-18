import { ArticleReference } from '~/utils/articles.server';
import { ArticleTitleLink } from '~/routes/articles/components/ArticleTitleLink';
import { RoutesPath } from '~/data/routes.data';
import { PublishDate } from '~/routes/articles_.$id/components/PublishDate';
import React from 'react';

interface ArticleProps {
  item: ArticleReference;
}

const Article = React.forwardRef<HTMLDivElement, ArticleProps>(
  ({ item }, ref) => {
    return (
      <article
        className="font-sourceSerif4 mb-10 group"
        key={item.slug}
        ref={ref}
      >
        <ArticleTitleLink
          title={item.frontmatter.title}
          to={RoutesPath.article(item.slug)}
        />

        <p
          className={
            'text-base pt-2 mb-1 text-gray-600 font-bold leading-5 opacity-80'
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
    );
  },
);
Article.displayName = 'Article';

export function ArticlesList({
  articles = [],
  className = '',
}: {
  articles: ArticleReference[];
  className?: string;
}) {
  return (
    <section className={className}>
      {articles?.map((item) => {
        return <Article key={item.slug} item={item} />;
      })}
    </section>
  );
}
