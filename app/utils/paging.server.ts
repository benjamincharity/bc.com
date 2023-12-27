import type { Frontmatter } from "./articles.server";

export const getPagingData = (request: Request, articles: Frontmatter[]) => {
  const url = new URL(request.url);
  const page = url.searchParams.get("page") ?? 0;
  const pageNumber = Number(page);

  const from = 10 * pageNumber;
  const to = 10 * (pageNumber + 1);

  return {
    page: pageNumber,
    articles: articles.slice(from, to),
    nextPage: articles.length > to ? pageNumber + 1 : null,
    previousPage: pageNumber > 0 ? pageNumber - 1 : null,
    totalPages: Math.ceil(articles.length / 10),
  };
};
