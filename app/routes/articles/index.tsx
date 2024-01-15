import { Frontmatter, getAllArticles } from '~/utils/articles.server';
import { DataFunctionArgs } from '@remix-run/server-runtime';
import { Link, useLoaderData } from '@remix-run/react';
import { ArticleTitleLink } from '~/routes/articles/components/ArticleTitleLink';
import SlidingLink from '~/components/SlidingLink';

export async function loader(data: DataFunctionArgs) {
  const posts = await getAllArticles();
  return posts;
}

function ListOfBlogPosts() {
  const data = useLoaderData<
    Array<{
      slug: string;
      frontmatter: Frontmatter;
    }>
  >();
  return (
    <>
      {data.map((v) => {
        return <BlogItem item={v} key={v.slug} />;
      })}
    </>
  );
}

function BlogItem(props: {
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

      <p className={'text-base text-gray-600 font-bold leading-5 opacity-80'}>
        {item.frontmatter.summary}
      </p>
    </article>
  );
}

export default function Index() {
  return (
    <section className={'articles max-w-2xl m-auto pt-8'}>
      <ListOfBlogPosts />
    </section>
  );
}
