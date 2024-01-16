import type { MetaFunction } from '@remix-run/node';
import pluralize from 'pluralize';
import { json } from '@remix-run/node';
import { useLoaderData, useParams } from '@remix-run/react';
import {
  ArticleReference,
  Frontmatter,
  getAllArticles,
} from '~/utils/articles.server';
// import { filterArticlesByTitle } from "~/utils/articles.server";
// import { getArticlesSortedByDate } from "~/utils/articles.server";
// import { ArticlesList } from "~/components/ArticlesList";
import { getPagingData } from '~/utils/paging.server';
import { siteMetadata } from '~/siteMetadata';
import { SearchForm } from '~/components/SearchForm';
import { ArticlesList } from '~/components/Articles/ArticlesList';
import { BackToArticlesLink } from '../articles_.$id/components/BackToArticlesLink';
import { BrowseByTags } from '~/routes/articles/components/BrowseByTags';
import { getTagsFromArticles } from '~/utils/getTagsFromArticles';
import { TagsPayload } from '~/routes/tags/route';

interface Params {
  tag: string;
}

interface LoaderData {
  articles: ArticleReference[];
  // nextPage: number | null;
  // previousPage: number | null;
  // totalPages: number;
  // page: number;
  query: string | null;
  // slug: string;
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

  // const articles = query ? filterArticlesByTitle(query) : getArticlesSortedByDate();
  const filteredArticles = articles.filter((a) =>
    a.frontmatter?.tags?.includes(tag),
  );
  // .map((a) => a.frontmatter);
  const data = getPagingData(request, filteredArticles);

  return json<LoaderData>({ articles: filteredArticles, query, tags });
};

export default function Tag() {
  const { tag } = useParams();
  const { articles, query, tags } = useLoaderData<LoaderData>();

  // const { articles, nextPage, previousPage, totalPages, page, query } =
  //   useLoaderData<LoaderData>();

  return (
    <section
      className="max-w-articleMaxWidth pt-8 mx-auto"
      aria-labelledby="tagged-posts-header"
    >
      <header className={'mb-8'}>
        <h1
          id="tagged-posts-header"
          className={
            'text-gray-600 italic font-sourceSerif4 text-sm text-center'
          }
        >
          Showing <strong>{articles?.length ?? 0}</strong>{' '}
          {pluralize('article', articles?.length)} tagged with &quot;
          <strong className={'highlight'}>{tag}.</strong>&quot;
        </h1>
      </header>

      <BackToArticlesLink />

      <ArticlesList articles={articles} className={'pt-4 mb-10'} />

      {/*<ArticlesList*/}
      {/*  articles={articles}*/}
      {/*  nextPage={nextPage}*/}
      {/*  page={page}*/}
      {/*  previousPage={previousPage}*/}
      {/*  totalPages={totalPages}*/}
      {/*/>*/}

      <BrowseByTags tags={tags} currentTag={tag} />
    </section>
  );
}
