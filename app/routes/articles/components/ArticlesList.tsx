import type { Frontmatter } from '~/utils/articles.server';
import { Link } from '@remix-run/react';
import { ArticleTitleLink } from '~/routes/articles/components/ArticleTitleLink';

type Article = Pick<
  Frontmatter,
  'formattedDate' | 'slug' | 'summary' | 'title'
>;

interface Props {
  articles: Article[];
  nextPage: number | null;
  page: number;
  previousPage: number | null;
  totalPages: number;
}

export const ArticlesList = ({
  articles,
  nextPage,
  page,
  previousPage,
  totalPages,
}: Props) => {
  return (
    <ul className="articles__list" aria-label="Articles">
      {articles.map((article) => {
        // console.log('article: ', article);
        return (
          <li key={article.slug} className="articles__listing">
            <Link
              className="articles__listing-link o-sliding-background-link g{{ i + 1 }}"
              prefetch="intent"
              to={article.slug}
            >
              <ArticleTitleLink title={article.title} />
            </Link>

            <div className="articles__listing-description leading-4">
              {article.summary}
              <span className="articles__listing-reading-time">
                [{article.formattedDate}]
              </span>
            </div>
          </li>
        );
      })}
      {/*//   <div *ngIf="article?.description" class="articles__listing-description">*/}
      {/*//     {{ article.description }}*/}
      {/*//   <span class="articles__listing-reading-time"*/}
      {/*//   >[{{ article.readingTime | number: '1.0-0' }}min]</span*/}
      {/*//   >*/}
      {/*// </div>*/}
      {/*  // <bc-article-dates*/}
      {/*  //       [publishDate]="article.publishDate"*/}
      {/*  //   [lastUpdatedDate]="article.lastUpdatedDate"*/}
      {/*  //   ></bc-article-dates>*/}
    </ul>
  );
};
