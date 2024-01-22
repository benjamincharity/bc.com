import { ArticleReference, getAllArticles } from '~/utils/articles.server';
import { ArticlesList } from '~/components/Articles/ArticlesList';
import { useLoaderData, useSearchParams } from '@remix-run/react';
import { getTagsFromArticles } from '~/utils/getTagsFromArticles';
import {
  json,
  LinksFunction,
  LoaderFunctionArgs,
  type MetaFunction,
} from '@remix-run/node';
import { BrowseByTags } from '~/routes/articles/components/BrowseByTags';
import React, { useMemo } from 'react';
import { TagsPayload } from '~/routes/articles_.tags/route';
import { useReducedMotion } from '@mantine/hooks';
import { FixMeLater } from '~/types/shame';
import { siteMetadata } from '~/data/siteMetadata';
import { generateMetaCollection } from '~/utils/generateMetaCollection';
import { BackToLink } from '~/routes/articles_.$id/components/BackToLink';
import { RoutesPath } from '~/data/routes.data';
import sharedStyles from '~/styles/shared.css';

interface LoaderData {
  articles: ArticleReference[];
  tags: TagsPayload;
}

export async function loader({ request }: LoaderFunctionArgs) {
  const articles = await getAllArticles();
  const tags = getTagsFromArticles(articles);

  return json<LoaderData>(
    {
      articles,
      tags,
    },
    {
      headers: { 'Cache-Control': 'private, max-age=10' },
    },
  );
}

export const links: LinksFunction = () => {
  return [
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Source+Serif+4:wght@400;600;700&display=swap',
    },
  ];
};

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
  const scrollToTop = (event: React.MouseEvent) => {
    event.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: reduceMotion ? 'auto' : 'smooth',
    });
  };

  return (
    <section className={'prose-wrapper pb-6'}>
      <div className="flex justify-between align-middle">
        <BackToLink to={RoutesPath.home}>Home</BackToLink>
        <button
          className={
            'animated-link-underline font-normal text-sm mb-4 relative -top-1'
          }
          onClick={scrollToBottom}
        >
          Jump to tags &darr;
        </button>
      </div>

      <ArticlesList articles={articles} />

      <div className={'text-right'}>
        <button
          className={
            'animated-link-underline font-normal text-sm mb-4 leading-6'
          }
          onClick={scrollToTop}
        >
          Back to top &uarr;
        </button>
      </div>

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
