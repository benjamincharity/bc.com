import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import type { Frontmatter } from "~/utils/articles.server";
import { filterArticlesByTitle } from "~/utils/articles.server";
import { getArticlesSortedByDate } from "~/utils/articles.server";
import { ArticlesList } from "~/components/ArticlesList";
import { getPagingData } from "~/utils/paging.server";
import { SearchForm } from "~/components/SearchForm";

interface LoaderData {
  page: number;
  articles: Frontmatter[];
  nextPage: number | null;
  previousPage: number | null;
  totalPages: number;
  query: string | null;
}

export const loader = async ({ request }: { request: Request }) => {
  const url = new URL(request.url);
  const query = url.searchParams.get("q");

  const articles = query ? filterArticlesByTitle(query) : getArticlesSortedByDate();
  const data = getPagingData(request, articles);

  return json<LoaderData>({ ...data, query });
};

export default function Articles() {
  const { page, articles, nextPage, previousPage, totalPages, query } =
    useLoaderData<LoaderData>();
  console.table({
    page,
    articles,
    nextPage,
    previousPage,
    totalPages,
    query,
  });

  return (
    <div className="w-full">
      <div className="md:flex md:justify-between md:items-center">
        <h1>All articles</h1>
        <SearchForm query={query} />
      </div>

      <ArticlesList
        articles={articles}
        nextPage={nextPage}
        page={page}
        previousPage={previousPage}
        totalPages={totalPages}
      />
    </div>
  );
}
