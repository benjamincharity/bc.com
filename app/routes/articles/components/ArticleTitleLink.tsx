import React, { ReactElement } from 'react'

import SlidingLink from '~/components/SlidingLink'

export interface ArticleTitleProps {
  className?: string
  level?: 1 | 2 | 3 | 4 | 5 | 6
  title: string
  to: string
}

export const ArticleTitleLink = React.memo(
  (props: ArticleTitleProps): ReactElement => {
    const { className = '', title, level = 2, to } = props
    const titleTrimmed = title?.substring(0, title.lastIndexOf(' ')).trim()
    const titleTail = title
      ?.substring(title.lastIndexOf(' '), title?.length)
      .trim()

    return React.createElement(
      `h${level}`,
      {
        className: `group text-3xl font-bold text-gray-700 inline ${className}`,
      },
      <SlidingLink prefetch={'intent'} to={to}>
        {titleTrimmed}
        <span className="listing-tail relative ml-2 inline-block whitespace-nowrap pr-10">
          {titleTail}
          <span
            className={`listing-arrow absolute right-0 translate-x-0 translate-y-1 pl-2 opacity-0 group-hover:translate-x-2 group-hover:opacity-80 motion-safe:transition-all motion-safe:group-hover:delay-300`}
            aria-hidden="true"
          >
            &#10149;
          </span>
        </span>
      </SlidingLink>
    )
  }
)

ArticleTitleLink.displayName = 'ArticleTitle'
