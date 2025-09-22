import { Link } from '@remix-run/react';
import React from 'react';

import { siteMetadata } from '~/data/siteMetadata';

import { ArticleTitleLink } from '~/components/ArticleTitleLink';
import { ArticleReference } from '~/utils/articles.server';

export function ArticlesList({
  articles = [],
  className = '',
  isCompactView = false,
}: {
  articles: ArticleReference[];
  className?: string;
  isCompactView?: boolean;
}) {
  const [firstArticle, ...rest] = articles;

  if (isCompactView) {
    return (
      <section className={`body-font ${className}`}>
        <div className="container mx-auto py-8">
          <div className="space-y-6">
            <Article 
              article={firstArticle} 
              layoutSize={'compact-first'} 
              hideImage={true}
            />
            {rest?.map((item) => {
              return (
                <Article 
                  article={item} 
                  key={item.slug} 
                  layoutSize={'compact'} 
                  hideImage={true}
                />
              );
            })}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={`body-font ${className}`}>
      <div className="container mx-auto py-8">
        <Article article={firstArticle} />

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
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
  layoutSize?: 'small' | 'large' | 'compact' | 'compact-first';
  hideImage?: boolean;
}

function Article({ article, layoutSize = 'large', hideImage = false, ...divProps }: ArticleProps) {
  const url = `/articles/${article.slug}`;
  const { slug, frontmatter } = article;
  const { title, summary, readingTime, images, tags } = frontmatter;

  const isCompact = layoutSize === 'compact' || layoutSize === 'compact-first';
  const isCompactFirst = layoutSize === 'compact-first';

  return (
    <div
      className={`group ${
        layoutSize === 'small' ? '' : 
        isCompact ? 'w-full' : 
        'mb-8 w-full'
      }`}
      key={slug}
      {...divProps}
    >
      <div className={`flex h-full ${isCompact ? 'flex-row items-start' : 'flex-col'} overflow-hidden rounded-lg`}>
        {!hideImage && images?.[0] && (
          <Link to={url} className={isCompact ? 'flex-shrink-0 mr-4' : ''}>
            <img
              alt={title}
              className={`inline-block ${
                layoutSize === 'large'
                  ? 'lg:aspect-first-hero'
                  : 'lg:aspect-video'
              } aspect-video ${isCompact ? 'w-24 h-24 object-cover rounded' : 'w-full max-w-full'} bg-gradient-to-r from-indigo-200 to-yellow-100 object-cover text-center text-xs italic leading-loose text-gray-600 outline-gray-300`}
              src={`${siteMetadata.articleImagePath}${images[0]}`}
            />
          </Link>
        )}
        <div className={`flex-1 ${isCompact ? 'border-l-0' : 'rounded-b-lg border-t-0'} border-2 border-gray-500 border-opacity-20 ${isCompact ? 'p-4' : 'p-6'} transition hover:border-opacity-50`}>
          <TagsDisplay tags={tags} />
          <ArticleTitleLink 
            title={title} 
            to={url} 
            className={isCompactFirst ? 'text-2xl' : isCompact ? 'text-xl' : ''}
          />
          <p className={`my-3 ${isCompact ? 'line-clamp-2 text-base' : 'line-clamp-8 text-lg'} leading-relaxed text-slate-700 dark:text-slate-100`}>
            {summary}
          </p>
          <div className="flex flex-wrap items-center justify-between">
            <Link
              className="animated-gradient-text group inline-flex items-center border-b-2 border-b-rose-600 border-opacity-40 font-semibold transition hover:border-opacity-80 dark:border-b-rose-400 dark:border-opacity-20 dark:hover:border-opacity-80"
              to={url}
            >
              Read more
              <span className="sr-only"> about {title}</span>
              <svg
                className="ml-1 h-4 w-4 transition-all group-hover:ml-2"
                fill="none"
                stroke="#db2777"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M5 12h14"></path>
                <path d="M12 5l7 7-7 7"></path>
              </svg>
            </Link>

            <span className="inline-block items-center text-sm leading-none text-slate-600 before:mr-1 before:inline-block before:opacity-60 before:transition-opacity before:content-['⌚'] group-hover:before:opacity-100 dark:text-slate-200">
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
      className={`mb-1 flex flex-wrap gap-x-4 gap-y-1 font-code text-xs tracking-wide opacity-60 ${className}`}
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
