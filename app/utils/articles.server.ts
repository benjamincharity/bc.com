import * as PaddingSavesTheDay from '../routes/articles/padding-saves-the-day.mdx';
import * as QuestionsBuildingTable from '../routes/articles/questions-to-ask-when-building-a-data-table.mdx';
import * as RethinkToOutbuild from '../routes/articles/rethink-outbuild-5-mindset-shifts-startup-success.mdx';
import * as EssentialTech2024 from '../routes/articles/essential-tech-toolkit-2024.mdx';
import { formatDate } from './date';

export interface Frontmatter {
  date: string;
  formattedDate: string;
  images: string[];
  slug: string;
  summary: string;
  tags: string[];
  title: string;
}

export const ARTICLES = [
  RethinkToOutbuild,
  EssentialTech2024,
  PaddingSavesTheDay,
  QuestionsBuildingTable,
];

export const getArticlesSortedByDate = () => {
  return ARTICLES.map(articleFromModule).sort((a, b) =>
    a.date > b.date ? -1 : 1,
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
    formattedDate: formatDate(mod.attributes.date),
    slug: mod.filename.replace(/\.mdx?$/, ''),
  };
}
