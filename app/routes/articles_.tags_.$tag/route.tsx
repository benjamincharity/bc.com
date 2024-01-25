import { LinksFunction, MetaFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData, useParams } from '@remix-run/react';
import pluralize from 'pluralize';
import React from 'react';

import { ArticlesList } from '~/components/Articles/ArticlesList';
import { BackToTop } from '~/components/BackToTop';
import { RoutesPath } from '~/data/routes.data';
import { siteMetadata } from '~/data/siteMetadata';
import { BrowseByTags } from '~/routes/articles/components/BrowseByTags';
import { TagsPayload } from '~/routes/articles_.tags/route';
import { ArticleReference, getAllArticles } from '~/utils/articles.server';
import { getTagsFromArticles } from '~/utils/getTagsFromArticles';

import { BackToLink } from '../articles_.$id/components/BackToLink';

interface Params {
  tag: string;
}

interface LoaderData {
  articles: ArticleReference[];
  query: string | null;
  tags: TagsPayload;
}

export const meta: MetaFunction = ({ params }) => {
  const { tag } = params;
  const title = `${tag} - ${siteMetadata.author}`;
  const summary = `Articles about ${tag} of ${siteMetadata.author}.`;

  return [
    { name: 'title', content: title },
    { name: 'description', content: summary },
    { property: 'og:title', content: title },
    { property: 'og:description', content: summary },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: summary },
  ];
};

export const links: LinksFunction = () => {
  return [
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Source+Serif+4:wght@400;600;700&display=swap',
    },
  ];
};

export const loader = async ({
  params,
  request,
}: {
  params: Params;
  request: Request;
}) => {
  const { tag } = params;
  const url = new URL(request.url);
  const query = url.searchParams.get('q');
  const articles = await getAllArticles();
  const tags = getTagsFromArticles(articles);

  const filteredArticles = articles.filter((a) =>
    a.frontmatter?.tags?.includes(tag)
  );

  return json<LoaderData>({ articles: filteredArticles, query, tags });
};

export default function Tag() {
  const { tag } = useParams();
  const { articles, tags } = useLoaderData<LoaderData>();

  return (
    <section
      aria-labelledby="tagged-posts-header"
      className="prose-wrapper max-w-articleMaxWidth"
    >
      <header>
        <h1
          id="tagged-posts-header"
          className={
            'mb-4 text-center font-sourceSerif4 text-sm italic text-gray-600'
          }
        >
          Showing <strong>{articles?.length ?? 0}</strong>{' '}
          {pluralize('article', articles?.length)} tagged with &quot;
          <strong className={'highlight'}>{tag}.</strong>&quot;
        </h1>
      </header>

      <BackToLink to={RoutesPath.articles}>Back to all articles</BackToLink>
      <BackToLink className={'mb-4'} to={RoutesPath.tags}>
        Back to all tags
      </BackToLink>

      <ArticlesList articles={articles} className={'mb-10 pt-4'} />

      <BackToTop />

      <hr className={'fancy'} />

      <BrowseByTags tags={tags} currentTag={tag} />
    </section>
  );
}
