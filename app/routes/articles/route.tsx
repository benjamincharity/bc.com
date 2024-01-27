import { useReducedMotion } from '@mantine/hooks';
import { type MetaFunction, json } from '@remix-run/node';
import { useLoaderData, useSearchParams } from '@remix-run/react';
import React, { useMemo } from 'react';

import { ArticlesList } from '~/components/Articles/ArticlesList';
import { BackToTop } from '~/components/BackToTop';
import { RoutesPath } from '~/data/routes.data';
import { siteMetadata } from '~/data/siteMetadata';
import { BrowseByTags } from '~/routes/articles/components/BrowseByTags';
import { BackToLink } from '~/routes/articles_.$id/components/BackToLink';
import { TagsPayload } from '~/routes/articles_.tags/route';
import { FixMeLater } from '~/types/shame';
import { ArticleReference, getAllArticles } from '~/utils/articles.server';
import { generateMetaCollection } from '~/utils/generateMetaCollection';
import { getTagsFromArticles } from '~/utils/getTagsFromArticles';

interface LoaderData {
  articles: ArticleReference[];
  tags: TagsPayload;
}

export async function loader() {
  const articles = await getAllArticles();
  const tags = getTagsFromArticles(articles);

  return json<LoaderData>(
    {
      articles,
      tags,
    },
    {
      headers: { 'Cache-Control': 'private, max-age=10' },
    }
  );
}

export const meta: MetaFunction = ({ data }: FixMeLater) => {
  return generateMetaCollection({
    title: 'Articles',
    summary:
      'Explore expert articles on engineering leadership in startups and scale-ups. Discover guides on career paths, team dynamics, and innovation in tech.',
    tags: data.tags,
    url: `${siteMetadata.url}/articles`,
  });
};

export default function Route() {
  const { articles, tags } = useLoaderData<LoaderData>();
  const [searchParams] = useSearchParams();
  const query = useMemo(() => searchParams.get('q'), [searchParams]);
  const reduceMotion = useReducedMotion();

  const scrollToBottom = (event: React.MouseEvent) => {
    event.preventDefault();
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: reduceMotion ? 'auto' : 'smooth',
    });
  };

  return (
    <section className={'prose-wrapper pb-6'}>
      <div className="flex justify-between align-middle">
        <BackToLink to={RoutesPath.home}>Home</BackToLink>
        <button
          className={
            'animated-link-underline relative -top-1 mb-4 text-sm font-normal'
          }
          onClick={scrollToBottom}
        >
          Jump to tags &darr;
        </button>
      </div>

      <ArticlesList articles={articles} />

      <BackToTop />

      <hr className={'fancy'} />

      <BrowseByTags
        currentTag={query ?? ''}
        heading={'Browse by tags:'}
        id="tags-section"
        tags={tags}
      />
    </section>
  );
}
