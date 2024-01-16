import type { MetaFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData, useParams } from '@remix-run/react';
import { Frontmatter, getAllArticles } from '~/utils/articles.server';
// import { filterArticlesByTitle } from "~/utils/articles.server";
// import { getArticlesSortedByDate } from "~/utils/articles.server";
// import { ArticlesList } from "~/components/ArticlesList";
import { getPagingData } from '~/utils/paging.server';
import { siteMetadata } from '~/siteMetadata';
import { SearchForm } from '~/components/SearchForm';
import { ArticlesList } from '~/components/Articles/ArticlesList';

interface Params {
  tag: string;
}

interface LoaderData {
  articles: Frontmatter[];
  // nextPage: number | null;
  // previousPage: number | null;
  // totalPages: number;
  // page: number;
  query: string | null;
  // slug: string;
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

  // const articles = query ? filterArticlesByTitle(query) : getArticlesSortedByDate();
  const filteredArticles = articles
    .filter((a) => a.frontmatter?.tags?.includes(tag))
    .map((a) => a.frontmatter);
  // const data = getPagingData(request, filteredArticles);

  return json<LoaderData>({ articles: filteredArticles, query });
};

export default function Tag() {
  const { tag } = useParams();
  // const data = useLoaderData<
  //   Array<{
  //     slug: string;
  //     frontmatter: Frontmatter;
  //   }>
  // >();

  // const { articles, nextPage, previousPage, totalPages, page, query } =
  //   useLoaderData<LoaderData>();

  return (
    <div className="w-full">
      {/*<div className="md:flex md:justify-between md:items-center">*/}
      {/*  <h1>#{tag}</h1>*/}
      {/*  /!*<SearchForm query={query} />*!/*/}
      {/*</div>*/}

      {/*TODO*/}
      <div>
        Showing articles tagged <code>{tag}</code>. Clear filter
      </div>

      <ArticlesList />

      {/*<ArticlesList*/}
      {/*  articles={articles}*/}
      {/*  nextPage={nextPage}*/}
      {/*  page={page}*/}
      {/*  previousPage={previousPage}*/}
      {/*  totalPages={totalPages}*/}
      {/*/>*/}
    </div>
  );
}
