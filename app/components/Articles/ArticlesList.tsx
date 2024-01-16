import { useLoaderData } from '@remix-run/react';
import { ArticlesLoaderData, Frontmatter } from '~/utils/articles.server';
import { ArticleTitleLink } from '~/routes/articles/components/ArticleTitleLink';

export function ArticlesList() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { articles, query } = useLoaderData<{
    articles: Frontmatter[];
    query?: string;
  }>();
  console.log('my log: ', articles);
  return (
    <>
      {/*{articles?.map((v) => {*/}
      {/*  return <ArticleTease item={v} key={v.title} />;*/}
      {/*})}*/}
    </>
  );
}

function ArticleTease(props: {
  item: {
    slug: string;
    frontmatter: Frontmatter;
  };
}) {
  const { item } = props;

  return (
    <article className="article-tease font-sourceSerif4 mb-4">
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
        <span className={'text-xs ml-1'}>[4 min]</span>
      </p>

      <footer className={'text-[10px] font-mono italic text-gray-500'}>
        Published on{' '}
        <time dateTime={item.frontmatter.publishDate}>
          {item.frontmatter.publishDate}
        </time>
      </footer>
    </article>
  );
}
