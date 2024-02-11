import { useReducedMotion } from '@mantine/hooks';
import { type MetaFunction, json } from '@remix-run/node';
import { useLoaderData, useSearchParams } from '@remix-run/react';
import React, { useMemo } from 'react';

import { ArticlesList } from '~/components/Articles/ArticlesList';
import { BackToTop } from '~/components/BackToTop';
import { Badge } from '~/components/Badge';
import { RoutesPath } from '~/data/routes.data';
import { siteMetadata } from '~/data/siteMetadata';
import { BrowseByTags } from '~/routes/articles/components/BrowseByTags';
import { BackToLink } from '~/routes/articles_.$id/components/BackToLink';
import { TagsPayload } from '~/routes/articles_.tags/route';
import { FixMeLater } from '~/types/shame';
import {
  ArticleReference,
  getAllTags,
  getLatestArticles,
} from '~/utils/articles.server';
import { generateMetaCollection } from '~/utils/generateMetaCollection';

const PER_PAGE = 10;

interface LoaderData {
  articles: ArticleReference[];
  page: number;
  tags: TagsPayload;
}

export async function loader({ request }: { request: Request }) {
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get('page') || '1', 10);
  const articles = await getLatestArticles(page * PER_PAGE);
  const tags = await getAllTags();

  return json<LoaderData>(
    { articles, tags, page },
    {
      headers: { 'Cache-Control': 'private, max-age=10' },
    }
  );
}

export const meta: MetaFunction = ({ data }: FixMeLater) => {
  return generateMetaCollection({
    title: `Articles on startups and engineering, by ${siteMetadata.author}`,
    summary:
      'Explore expert articles on engineering leadership in startups and scale-ups. Discover guides on career paths, team dynamics, and innovation in tech.',
    tags: data.tags,
    url: `${siteMetadata.url}/articles`,
  });
};

export default function Route() {
  const { articles, tags, page } = useLoaderData<LoaderData>();
  const [searchParams] = useSearchParams();
  const query = useMemo(() => searchParams.get('q'), [searchParams]);
  const reduceMotion = useReducedMotion();
  const hasNextPage = articles.length >= PER_PAGE * page;
  const nextPageLink = `${RoutesPath.articles}?page=${page + 1}`;

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

      <div className={'text-small px-4 pt-4 text-center'}>
        {hasNextPage ? (
          <Badge
            tag={'Load More'}
            count={-1}
            linkTo={nextPageLink}
            color={'#f184a8'}
          />
        ) : (
          <div>
            <p
              className={'mb-2 text-sm italic text-gray-700 dark:text-gray-200'}
            >
              You&apos;ve reached the end!
            </p>
            <img
              className={
                'mx-auto w-80 max-w-full animate-gentleRotate rounded-full shadow-md'
              }
              alt="A person asleep on a couch, illuminated by the glow of a single open laptop in a dimly lit room, conveying a serene late-night session."
              src={
                'https://res.cloudinary.com/da2exoho7/image/upload/ar_1:1,c_fill,g_auto,r_max,w_1000/v1707251970/website/person_fallen_asleep.webp'
              }
            />
          </div>
        )}
      </div>

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
