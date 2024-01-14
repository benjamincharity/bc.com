import React, { ReactElement } from 'react';

export interface ArticleTitleProps {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  title: string;
}

export const ArticleTitle = React.memo(
  (props: ArticleTitleProps): ReactElement => {
    const { title, level = 2 } = props;
    const titleTrimmed = title?.substring(0, title.lastIndexOf(' ')).trim();
    const titleTail = title
      ?.substring(title.lastIndexOf(' '), title?.length)
      .trim();

    return React.createElement(
      `h${level}`,
      {},
      <>
        {titleTrimmed}
        <span className="articles__listing-link-tail">
          {titleTail}
          <span className="articles__listing-link-arrow" aria-hidden="true">
            &#10149;
          </span>
        </span>
      </>,
    );
  },
);

ArticleTitle.displayName = 'ArticleTitle';
