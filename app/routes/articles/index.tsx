import { Frontmatter, getPosts } from '~/utils/articles.server';
import { DataFunctionArgs } from '@remix-run/server-runtime';
import { useLoaderData } from '@remix-run/react';

export async function loader(data: DataFunctionArgs) {
  const posts = await getPosts();
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
    <div className="blog-item">
      <a href={`/articles/${item.slug}`}>
        {' '}
        <h3>{item.frontmatter.meta?.title ?? item.slug} </h3>
      </a>
      <p>{item.frontmatter.meta?.description}</p>
    </div>
  );
}

export default function Index() {
  return (
    <div>
      <h1>Blargs</h1>
      <ListOfBlogPosts />
    </div>
  );
}
