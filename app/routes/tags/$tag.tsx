import type { MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, useParams } from "@remix-run/react";
import type { Frontmatter } from "~/utils/articles.server";
import { filterArticlesByTitle } from "~/utils/articles.server";
import { getArticlesSortedByDate } from "~/utils/articles.server";
import { ArticlesList } from "~/components/ArticlesList";
import { getPagingData } from "~/utils/paging.server";
import { siteMetadata } from "~/siteMetadata";
import { SearchForm } from "~/components/SearchForm";

interface Params {
  tag: string;
}

interface LoaderData {
  articles: Frontmatter[];
  nextPage: number | null;
  previousPage: number | null;
  totalPages: number;
  page: number;
  query: string | null;
}

export const meta: MetaFunction = ({ params }) => {
  const { tag } = params;
  const title = `${tag} - ${siteMetadata.author}`;
  const summary = `Articles about ${tag} of ${siteMetadata.author}.`;

  return [
    { name: "title", content: title },
    { name: "description", content: summary },
    { property: "og:title", content: title },
    { property: "og:description", content: summary },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: summary },
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
  const query = url.searchParams.get("q");

  const articles = query ? filterArticlesByTitle(query) : getArticlesSortedByDate();
  const filteredArticles = articles.filter((a) => a.tags.includes(tag));
  const data = getPagingData(request, filteredArticles);

  return json<LoaderData>({ ...data, query });
};

export default function Tag() {
  const { tag } = useParams();
  const { articles, nextPage, previousPage, totalPages, page, query } =
    useLoaderData<LoaderData>();

  return (
    <div className="w-full">
      <div className="md:flex md:justify-between md:items-center">
        <h1>#{tag}</h1>
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
