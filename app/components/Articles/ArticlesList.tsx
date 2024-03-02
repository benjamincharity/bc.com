import { Link } from '@remix-run/react';
import React from 'react';

import { siteMetadata } from '~/data/siteMetadata';

import { ArticleReference } from '~/utils/articles.server';
import { useActiveBreakpoint } from '~/utils/useActiveBreakpoint';

export function ArticlesList({
  articles = [],
  className = '',
}: {
  articles: ArticleReference[];
  className?: string;
}) {
  const [firstArticle, ...rest] = articles;

  return (
    <section className={`body-font ${className}`}>
      <div className="container mx-auto px-5 py-8">
        <Article article={firstArticle} />

        <div className="grid grid-cols-1 lg:grid-cols-3">
          {rest?.map((item) => {
            return (
              <Article article={item} key={item.slug} layoutSize={'small'} />
            );
          })}
        </div>
      </div>
    </section>
  );
}

interface ArticleProps extends React.HTMLProps<HTMLDivElement> {
  article: ArticleReference;
  layoutSize?: 'small' | 'large';
}

function Article({ article, layoutSize = 'large', ...divProps }: ArticleProps) {
  const url = `/articles/${article.slug}`;
  const { slug, frontmatter } = article;
  const { title, summary, readingTime, images, tags } = frontmatter;
  const breakpoint = useActiveBreakpoint();
  const CDN_URL_BASE =
    layoutSize === 'large' &&
    breakpoint !== 'xs' &&
    breakpoint !== 'sm' &&
    breakpoint !== 'md'
      ? siteMetadata.articleThinImagePath
      : siteMetadata.articleImagePath;

  return (
    <div
      className={`group ${layoutSize === 'small' ? 'p-4' : 'mb-8 w-full'}`}
      key={slug}
      {...divProps}
    >
      <div className="flex h-full flex-col overflow-hidden rounded-lg">
        <img
          alt={title}
          className={`inline-block ${layoutSize === 'large' ? 'lg:aspect-first-hero' : 'lg:aspect-video'} w-full max-w-full bg-gradient-to-r from-indigo-200 to-yellow-100 text-center text-xs italic leading-loose text-gray-600 outline-gray-300`}
          src={`${CDN_URL_BASE}${images[0]}`}
        />
        <div className="flex-1 rounded-b-lg border-2 border-t-0 border-gray-500 border-opacity-20 p-6 transition hover:border-opacity-50">
          <TagsDisplay tags={tags} />
          <h1 className={'mb-3 line-clamp-3'} title={title}>
            <Link className={'link-underline text-2xl font-semibold'} to={url}>
              {title}
            </Link>
          </h1>
          <p className="mb-3 line-clamp-6 text-lg leading-relaxed">{summary}</p>
          <div className="flex flex-wrap items-center justify-between">
            <Link
              className="group inline-flex items-center font-semibold text-indigo-500 underline underline-offset-4 dark:text-indigo-400"
              to={url}
            >
              Read more
              <svg
                className="ml-1 h-4 w-4 transition-all group-hover:ml-2"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M5 12h14"></path>
                <path d="M12 5l7 7-7 7"></path>
              </svg>
            </Link>

            <span className="inline-block items-center text-sm leading-none before:mr-1 before:inline-block before:opacity-60 before:transition-opacity before:content-['⌚'] group-hover:before:opacity-100">
              {readingTime}min
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

interface TagsDisplayProps extends React.HTMLProps<HTMLDivElement> {
  tags: string[];
}

function TagsDisplay({ tags, ...divProps }: TagsDisplayProps) {
  const { className = '', ...rest } = divProps;

  return (
    <div
      className={`mb-1 line-clamp-2 flex flex-wrap gap-x-4 gap-y-1 font-code text-xs tracking-wide opacity-60 ${className}`}
      {...rest}
    >
      {tags.map((tag) => (
        <span key={tag} className="">
          {tag}
        </span>
      ))}
    </div>
  );
}
