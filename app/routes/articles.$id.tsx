import { SEOHandle } from '@nasa-gcn/remix-seo';
import { MetaFunction } from '@remix-run/node';
import { useLoaderData, useLocation } from '@remix-run/react';
import type { LoaderFunction } from '@remix-run/server-runtime';
import { json, redirect } from '@remix-run/server-runtime';
import { useEffect } from 'react';
import { ExternalScriptsHandle } from 'remix-utils/external-scripts';

import { TagsPayload } from '~/types/articles';
import { FixMeLater } from '~/types/shame';

import { RoutePaths } from '~/data/routes.data';
import { siteMetadata } from '~/data/siteMetadata';

import { BackToLink } from '~/components/BackToLink';
import { BrowseByTags } from '~/components/BrowseByTags';
import { Footer } from '~/components/Footer';
import { NewsletterSignUp } from '~/components/NewsletterSignUp';
import { PrimaryTitle } from '~/components/PrimaryTitle';
import { PublishDate } from '~/components/PublishDate';
import {
  Frontmatter,
  getAllArticles,
  getArticle,
} from '~/utils/articles.server';
import { generateMetaCollection } from '~/utils/generateMetaCollection';
import { getTagsFromArticles } from '~/utils/getTagsFromArticles';

type LoaderData = {
  allTags: TagsPayload;
  code: string;
  frontmatter: Frontmatter;
  html: FixMeLater;
};

export const loader: LoaderFunction = async ({ params, request }) => {
  const slug = params.id;
  if (!slug) throw new Response('Not found', { status: 404 });
  const articles = await getAllArticles();
  const allTags = getTagsFromArticles(articles);
  const isProd = process.env.NODE_ENV === 'production';

  const post = await getArticle(slug);
  post.frontmatter = {
    ...post.frontmatter,
    slug,
    url: `${request.headers.get('host')}/articles/${slug}`,
  };

  if (post.frontmatter.draft && isProd) {
    console.warn(
      '⚠️ This post is a draft and cannot be viewed in production. ⚠️'
    );
    const newUrl = new URL(RoutePaths.notFound, siteMetadata.url);
    newUrl.searchParams.append(
      'message',
      `
Oops! It seems like the post you're looking for wasn't found.
It might have been removed or doesn't exist. Please double-check the URL or go back to the homepage to explore more content.`
    );

    // Use the new URL in the redirect function
    throw redirect(newUrl.toString());
  }

  if (post) {
    return json(
      {
        ...post,
        allTags,
      },
      {
        headers: { 'Cache-Control': 'private, max-age=10' },
      }
    );
  } else {
    throw new Response('Not found', { status: 404 });
  }
};

export const handle: SEOHandle & ExternalScriptsHandle = {
  scripts: [
    {
      src: 'https://cpwebassets.codepen.io/assets/embed/ei.js',
      crossOrigin: 'anonymous',
      preload: true,
    },
  ],
  getSitemapEntries: async () => {
    const articles = await getAllArticles();
    return articles.map((article) => ({
      route: `/articles/${article.slug}`,
      priority: 0.7,
      lastmod:
        article.frontmatter.updatedDate || article.frontmatter.publishDate,
    }));
  },
};

export const meta: MetaFunction = ({ data }: FixMeLater) => {
  const { title, tags, summary, url, images } = data.frontmatter as Frontmatter;
  const imageUrl = images?.length
    ? `${siteMetadata.articleImagePath}${images[0]}`
    : siteMetadata.image;

  return generateMetaCollection({
    imageUrl,
    summary,
    tags,
    title,
    url,
  });
};

function getTagsWithCount(tags: string[], allTags: TagsPayload): TagsPayload {
  return allTags.filter(([tag]) => tags.includes(tag));
}

export default function Article() {
  const { frontmatter, allTags, html } = useLoaderData<LoaderData>();
  const localTags = getTagsWithCount(frontmatter.tags, allTags);
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const el = document.querySelector(location.hash);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [location]);

  return (
    <main className={'prose-wrapper py-4'}>
      <BackToLink id={'top'} className={'mb-4'} />

      <article>
        <PublishDate
          publishDate={frontmatter.publishDate}
          updatedDate={frontmatter.updatedDate}
        />
        <PrimaryTitle title={frontmatter.title} />

        <p className={'reading-time'}>
          Reading time: {frontmatter.readingTime}min
        </p>

        <section className={'rendered-markdown'}>
          <div dangerouslySetInnerHTML={{ __html: html }} />
        </section>
      </article>

      <NewsletterSignUp tags={localTags?.map((tag) => tag[0])} />

      <hr className={'fancy'} />

      <BrowseByTags heading={'Tags:'} tags={localTags} />

      <Footer />
    </main>
  );
}
