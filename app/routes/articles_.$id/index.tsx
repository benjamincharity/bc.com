import { useMemo } from 'react';

import { Link, useLoaderData } from '@remix-run/react';

import type {
  DataFunctionArgs,
  LoaderFunction,
} from '@remix-run/server-runtime';
import { json } from '@remix-run/server-runtime';
import { getMDXComponent } from 'mdx-bundler/client/index.js';
import { Frontmatter, getArticle } from '~/utils/articles.server';
import { BackLink } from '~/routes/articles_.$id/components/BackLink';
import Codepen from '@shared/Codepen';

type LoaderData = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  frontmatter: any;
  code: string;
};

export const loader: LoaderFunction = async ({ params, request }) => {
  const slug = params.id;
  // console.log('slug: ', slug, params, request);
  if (!slug) throw new Response('Not found', { status: 404 });

  const post = await getArticle(slug);
  if (post) {
    const { frontmatter, code } = post;
    return json({ frontmatter, code });
  } else {
    throw new Response('Not found', { status: 404 });
  }
};

export default function Article() {
  const { code, frontmatter } = useLoaderData<LoaderData>();
  const Component = useMemo(() => getMDXComponent(code), [code]);

  return (
    <main className={'article font-sourceSerif4 max-w-2xl'}>
      <BackLink to="/articles" />
      <h1 className={'text-2xl'}>{frontmatter.title}</h1>

      <article className={'article__content'}>
        <Component components={{ MyC: Codepen }} />
      </article>
    </main>
  );
}
