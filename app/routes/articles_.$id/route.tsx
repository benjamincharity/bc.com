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
import { BackToLink } from '~/routes/articles_.$id/components/BackToArticlesLink';
import { Codepen } from '~/components/Codepen';
import { ArticleTitle } from '~/components/ArticleTitle';
import { getTagsFromArticles } from '~/utils/getTagsFromArticles';
import { TagPayload, TagsPayload } from '~/routes/tags/route';
import { PublishDate } from '~/routes/articles_.$id/components/PublishDate';
import { BrowseByTags, Tags } from '~/routes/articles/components/BrowseByTags';
import { DotSpacer } from '~/components/DotSpacer';

type LoaderData = {
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

function getTagsWithCount(tags: string[], allTags: TagsPayload): TagsPayload {
  return allTags.filter(([tag]) => tags.includes(tag));
}

export default function Article() {
  const { code, frontmatter, allTags } = useLoaderData<LoaderData>();
  const localTags = getTagsWithCount(frontmatter.tags, allTags);
  const Component = useMemo(() => getMDXComponent(code), [code]);
  console.log('_________: ', frontmatter.updatedDate);

  return (
    <main className={'article font-sourceSerif4 max-w-2xl mx-auto py-4'}>
      <div className={'mb-2'}>
        <BackToLink />
      </div>

      <article>
        <PublishDate
          publishDate={frontmatter.publishDate}
          updatedDate={frontmatter.updatedDate}
        />
        <ArticleTitle title={frontmatter.title} />

        <section className={'rendered-markdown'}>
          <Component components={{ MarkdownCodepen: Codepen }} />
        </section>
      </article>

      <hr className={'fancy'} />

      <BrowseByTags heading={'Tags:'} tags={localTags} />
    </main>
  );
}
