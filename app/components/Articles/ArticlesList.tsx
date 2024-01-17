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
      <article key={item.slug} className="font-sourceSerif4 mb-10" ref={ref}>
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
          {/*TODO*/}
          <span className={'text-xs ml-1'}>[99 min]</span>
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
