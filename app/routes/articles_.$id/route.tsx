import { LinksFunction, MetaFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import type { LoaderFunction } from '@remix-run/server-runtime';
import { json, redirect } from '@remix-run/server-runtime';
import React from 'react';
import { ExternalScriptsHandle } from 'remix-utils/external-scripts';

import { BackToTop } from '~/components/BackToTop';
import { Footer } from '~/components/Footer';
import { PrimaryTitle } from '~/components/PrimaryTitle';
import { RoutesPath } from '~/data/routes.data';
import { siteMetadata } from '~/data/siteMetadata';
import { BrowseByTags } from '~/routes/articles/components/BrowseByTags';
import { BackToLink } from '~/routes/articles_.$id/components/BackToLink';
import { PublishDate } from '~/routes/articles_.$id/components/PublishDate';
import { TagsPayload } from '~/routes/articles_.tags/route';
import { FixMeLater } from '~/types/shame';
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
    const newUrl = new URL(RoutesPath.notFound, siteMetadata.url);
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

export const handle: ExternalScriptsHandle = {
  scripts: [
    {
      src: 'https://cpwebassets.codepen.io/assets/embed/ei.js',
      crossOrigin: 'anonymous',
      preload: true,
    },
  ],
};

export const links: LinksFunction = () => {
  return [
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Source+Serif+4:wght@400;600;700&display=swap',
    },
  ];
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

  return (
    <main className={'prose-wrapper py-4'}>
      <BackToLink />

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
      <BackToTop />

      <hr className={'fancy'} />

      <BrowseByTags heading={'Tags:'} tags={localTags} />

      <Footer />
    </main>
  );
}
