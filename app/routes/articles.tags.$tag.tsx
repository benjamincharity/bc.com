import { MetaFunction, json } from '@remix-run/node';
import { useLoaderData, useParams } from '@remix-run/react';
import pluralize from 'pluralize';

import { TagsPayload } from '~/types/articles';

import { RoutePaths } from '~/data/routes.data';
import { siteMetadata } from '~/data/siteMetadata';

import { ArticlesList } from '~/components/Articles/ArticlesList';
import { BackToLink } from '~/components/BackToLink';
import { BackToTop } from '~/components/BackToTop';
import { BrowseByTags } from '~/components/BrowseByTags';
import { Footer } from '~/components/Footer';
import { ArticleReference, getAllArticles } from '~/utils/articles.server';
import { generateMetaCollection } from '~/utils/generateMetaCollection';
import { getTagsFromArticles } from '~/utils/getTagsFromArticles';

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

  return generateMetaCollection({
    summary,
    tags: [tag ?? ''].filter(Boolean),
    title,
    url: `${siteMetadata.url}/articles/tags`,
  });
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
      className="prose-wrapper prose-wrapper--large"
    >
      <header>
        <h1
          id="tagged-posts-header"
          className={
            'mb-4 text-center font-sourceSerif4 text-sm italic text-gray-600 dark:text-gray-400'
          }
        >
          Showing <strong>{articles?.length ?? 0}</strong>{' '}
          {pluralize('article', articles?.length)} tagged with &quot;
          <strong className={'highlight'}>{tag}.</strong>&quot;
        </h1>
      </header>

      <BackToLink to={RoutePaths.articles}>Back to all articles</BackToLink>
      <BackToLink className={'mb-4'} to={RoutePaths.tags}>
        Back to all tags
      </BackToLink>

      <ArticlesList articles={articles} className={'mb-10 pt-4'} />

      <BackToTop />

      <hr className={'fancy'} />

      <BrowseByTags tags={tags} currentTag={tag} />
      <Footer />
    </section>
  );
}
