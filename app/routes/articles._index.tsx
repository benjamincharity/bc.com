import { useReducedMotion } from '@mantine/hooks';
import { type LinksFunction, type MetaFunction } from '@remix-run/node';
import {
  Links,
  PrefetchPageLinks,
  useLoaderData,
  useSearchParams,
} from '@remix-run/react';
import React, { useEffect, useMemo } from 'react';

import { TagsPayload } from '~/types/articles';
import { FixMeLater } from '~/types/shame';

import { RoutePaths } from '~/data/routes.data';
import { siteMetadata } from '~/data/siteMetadata';

import { ArticlesList } from '~/components/Articles/ArticlesList';
import { BackToLink } from '~/components/BackToLink';
import { BackToTop } from '~/components/BackToTop';
import { Badge } from '~/components/Badge';
import { BrowseByTags } from '~/components/BrowseByTags';
import { NewsletterSignUp } from '~/components/NewsletterSignUp';
import {
  ArticleReference,
  getAllTags,
  getLatestArticles,
} from '~/utils/articles.server';
import { generateMetaCollection } from '~/utils/generateMetaCollection';
import { Theme } from '~/utils/theme.provider';
import { getThemeSession } from '~/utils/theme.server';

const PER_PAGE_FIRST = 7;
const PER_PAGE = 6;

interface LoaderData {
  articles: ArticleReference[];
  preloadArticles: ArticleReference[];
  page: number;
  tags: TagsPayload;
  theme: Theme | null;
}

export async function loader({ request }: { request: Request }) {
  const themeSession = await getThemeSession(request);
  const theme = themeSession.getTheme(); // Don't default, let it be null if not set
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get('page') || '1', 10);
  const includeDrafts = url.searchParams.get('draft') === 'true';
  const perPageCount = page === 1 ? PER_PAGE_FIRST : PER_PAGE;
  const total = (page !== 1 ? 1 : 0) + page * perPageCount;
  const articles = await getLatestArticles(total, includeDrafts);
  const preloadArticles = await getLatestArticles(10, includeDrafts);
  const tags = await getAllTags(includeDrafts);

  return { articles, preloadArticles, tags, page, theme };
}

export const handle = {
  getPreloadLinks: (data: LoaderData) => {
    if (!data?.preloadArticles) return [];

    // Skip the first 4 articles that were already preloaded in root.tsx
    return data.preloadArticles.slice(4).flatMap((article) =>
      (article.frontmatter.images || []).map((image) => ({
        rel: 'preload' as const,
        href: `${siteMetadata.articleImagePath}${image}`,
        as: 'image' as const,
      }))
    );
  },
};

export const meta: MetaFunction = ({ data }: FixMeLater) => {
  return generateMetaCollection({
    title: `Articles on startups and engineering, by ${siteMetadata.author}`,
    summary:
      'Explore expert articles on engineering leadership in startups and scale-ups. Discover guides on career paths, team dynamics, and innovation in tech.',
    tags: data.tags,
    url: `${siteMetadata.url}/articles`,
  });
};

export const links: LinksFunction = () => {
  return [];
};

export default function Index() {
  const { articles, preloadArticles, tags, page, theme } =
    useLoaderData<LoaderData>();
  const [searchParams] = useSearchParams();
  const query = useMemo(() => searchParams.get('q'), [searchParams]);
  const reduceMotion = useReducedMotion();
  const hasNextPage = articles.length >= PER_PAGE * page;
  const nextPageLink = `${RoutePaths.articles}?page=${page + 1}`;

  // Get preload links from handle
  const preloadLinks = handle.getPreloadLinks({
    articles,
    preloadArticles,
    tags,
    page,
    theme,
  });

  const scrollToBottom = (event: React.MouseEvent) => {
    event.preventDefault();
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: reduceMotion ? 'auto' : 'smooth',
    });
  };

  return (
    <section className={'prose-wrapper prose-wrapper--large'}>
      {preloadLinks.map((link, i) => (
        <link key={i} {...link} />
      ))}

      {/* Prefetch article routes that weren't preloaded in root.tsx */}
      {preloadArticles.slice(4).map((article) => (
        <PrefetchPageLinks
          key={article.slug}
          page={article.frontmatter.urlPath}
        />
      ))}

      <div className="flex justify-between align-middle">
        <BackToLink to={RoutePaths.home}>Home</BackToLink>
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
            color={'#f184a8'}
            count={-1}
            linkTo={nextPageLink}
            tag={'Load More'}
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

      <NewsletterSignUp />

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
