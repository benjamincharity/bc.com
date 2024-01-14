import * as PaddingSavesTheDay from '~/routes/articles/padding-saves-the-day.mdx';
import * as QuestionsBuildingTable from '~/routes/articles/questions-to-ask-when-building-a-data-table.mdx';
import * as Example1 from '~/routes/articles/example-post-1.mdx';
// import * as RethinkToOutbuild from '~/routes/articlesORIG/rethink/index.mdx';
import * as EssentialTech2024 from '~/routes/articles/essential-tech-toolkit-2024.mdx';
import { formatDate } from './date';

export interface Frontmatter {
  formattedDate: string;
  images: string[];
  date?: string;
  publishDate: string;
  slug: string;
  summary: string;
  // TODO: need to add categories and use that for 'tags' and use 'tag' for seo keywords
  tags: string[];
  title: string;
  updatedDate: string;
}

export const ARTICLES = [
  // EssentialTech2024,
  // PaddingSavesTheDay,
  // QuestionsBuildingTable,
  // RethinkToOutbuild,
  // Example1,
];

export const getArticlesSortedByDate = () => {
  return ARTICLES.map(articleFromModule).sort((a, b) =>
    a.publishDate > b.publishDate ? -1 : 1,
  );
};

export const filterArticlesByTitle = (query: string) => {
  return ARTICLES.map(articleFromModule).filter((a) =>
    a.title.toLowerCase().includes(query.toLowerCase()),
  );
};

function articleFromModule(mod: { attributes: Frontmatter; filename: string }) {
  return {
    ...mod.attributes,
    formattedDate: formatDate(new Date().toLocaleDateString()),
    slug: mod.filename.replace(/\.mdx?$/, ''),
  };
}
