import { useMemo } from 'react';

import { Link, useLoaderData } from '@remix-run/react';

import type { LoaderFunction } from '@remix-run/server-runtime';
import { json } from '@remix-run/server-runtime';
import { getMDXComponent } from 'mdx-bundler/client/index.js';
import {
  Frontmatter,
  getAllArticles,
  getArticle,
} from '~/utils/articles.server';
import { BackToArticlesLink } from '~/routes/articles_.$id/components/BackToArticlesLink';
import { Codepen } from '~/components/Codepen';
import { ArticleTitle } from '~/components/ArticleTitle';
import { getTagsFromArticles } from '~/utils/getTagsFromArticles';
import { TagsPayload } from '~/routes/tags';

type LoaderData = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  frontmatter: Frontmatter;
  code: string;
  allTags: TagsPayload;
};

export const loader: LoaderFunction = async ({ params, request }) => {
  const slug = params.id;
  // console.log('slug: ', slug, params, request);
  if (!slug) throw new Response('Not found', { status: 404 });
  const articles = await getAllArticles();
  const allTags = getTagsFromArticles(articles);

  const post = await getArticle(slug);
  if (post) {
    const { frontmatter, code } = post;
    return json({ frontmatter, code, allTags });
  } else {
    throw new Response('Not found', { status: 404 });
  }
};

export default function Article() {
  const { code, frontmatter, allTags } = useLoaderData<LoaderData>();
  const Component = useMemo(() => getMDXComponent(code), [code]);

  return (
    <main className={'article font-sourceSerif4 max-w-2xl mx-auto py-4'}>
      <BackToArticlesLink />
      <ArticleTitle title={frontmatter.title} />

      <article className={'rendered-markdown'}>
        <Component components={{ MyC: Codepen }} />
      </article>

      <aside>
        {allTags.map(([tag, count]) => (
          <Link
            key={tag + count}
            to={`/tags/${tag}`}
            className={'whitespace-nowrap text-base mr-3 relative'}
          >
            {tag} <sup>{count}</sup>
          </Link>
        ))}
      </aside>
    </main>
  );
}
