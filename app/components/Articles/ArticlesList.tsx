import { ArticleReference } from '~/utils/articles.server';
import { ArticleTitleLink } from '~/routes/articles/components/ArticleTitleLink';
import { formatDate } from '~/utils/date';
import { Datetime } from '~/components/Datetime';

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
        const { short, full } = formatDate(item.frontmatter.publishDate);
        return (
          <article key={item.slug} className="font-sourceSerif4 mb-4">
            <ArticleTitleLink
              title={item.frontmatter.title}
              to={`/articles/${item.slug}`}
            />

            <p
              className={
                'text-base pt-1 mb-1 text-gray-600 font-bold leading-5 opacity-80'
              }
            >
              {item.frontmatter.summary}
              {/*TODO*/}
              <span className={'text-xs ml-1'}>[99 min]</span>
            </p>

            <footer className={'text-[10px] font-mono italic text-gray-500'}>
              Published on <Datetime date={item.frontmatter.publishDate} />
            </footer>
          </article>
        );
      })}
    </section>
  );
}
