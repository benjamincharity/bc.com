import { useMemo } from 'react';

import { Link, useLoaderData } from '@remix-run/react';

import type {
  DataFunctionArgs,
  LoaderFunction,
} from '@remix-run/server-runtime';
import { json } from '@remix-run/server-runtime';
import { getMDXComponent } from 'mdx-bundler/client/index.js';
import { Frontmatter, getPost } from '~/utils/articles.server';

type LoaderData = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  frontmatter: any;
  code: string;
};

export const loader: LoaderFunction = async ({ params, request }) => {
  console.log('HERE articles.$id---------------');
  const slug = params.id;
  console.log('slug: ', slug, params, request);
  if (!slug) throw new Response('Not found', { status: 404 });

  const post = await getPost(slug);
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
  console.log('HERE articles.$id---------------');

  return (
    <>
      <Link to="/">← Back to blog index</Link>
      <h1>{frontmatter.title}</h1>

      <Component />
    </>
  );
}
