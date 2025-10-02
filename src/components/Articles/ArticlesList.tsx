import React from 'react';
import { siteMetadata } from '../../data/siteMetadata';
import { ArticleTitleLink } from '~/components/ArticleTitleLink';

// TagsDisplay component
function TagsDisplay({ tags, ...divProps }: { tags: string[]; [key: string]: any }) {
  const { className = '', ...rest } = divProps;

  return (
    <div
      className={`mb-1 flex flex-wrap gap-x-4 gap-y-1 font-code text-xs tracking-wide opacity-60 ${className}`}
      {...rest}
    >
      {tags.map((tag, index) => (
        <span key={`${tag}-${index}`} className="">
          {tag}
        </span>
      ))}
    </div>
  );
}

interface ArticleProps extends React.HTMLProps<HTMLDivElement> {
  article: any;
  layoutSize?: 'small' | 'large' | 'compact' | 'compact-first';
  hideImage?: boolean;
}

function Article({ article, layoutSize = 'large', hideImage = false, ...divProps }: ArticleProps) {
  const url = `/articles/${article.id}`;
  const { id, data } = article;
  const { title, description, image, tags, readingTime } = data;

  const isCompact = layoutSize === 'compact' || layoutSize === 'compact-first';
  const isCompactFirst = layoutSize === 'compact-first';

  return (
    <div
      className={`group ${
        layoutSize === 'small' ? '' :
        isCompact ? 'w-full' :
        'mb-8 w-full'
      }`}
      key={id}
      {...divProps}
    >
      <div className={`flex h-full ${isCompact ? 'flex-row items-start' : 'flex-col'} overflow-hidden rounded-lg`}>
        {!hideImage && image && (
          <a href={url} className={isCompact ? 'flex-shrink-0 mr-4' : ''}>
            <img
              alt={title}
              className={`inline-block ${
                layoutSize === 'large'
                  ? 'lg:aspect-first-hero'
                  : 'lg:aspect-video'
              } aspect-video ${isCompact ? 'w-24 h-24 object-cover rounded' : 'w-full max-w-full'} bg-gradient-to-r from-indigo-200 to-yellow-100 object-cover text-center text-xs italic leading-loose text-gray-600 outline-gray-300`}
              src={`${siteMetadata.articleImagePath}${image}`}
            />
          </a>
        )}
        <div className={`flex-1 border-2 border-gray-500 border-opacity-20 ${isCompact ? 'p-4 rounded-lg' : 'rounded-b-lg border-t-0 p-6'} transition hover:border-opacity-50`}>
          <TagsDisplay tags={tags || []} />
          <ArticleTitleLink
            title={title}
            to={url}
            className={isCompactFirst ? 'text-2xl' : isCompact ? 'text-xl' : ''}
          />
          <p className={`my-3 ${isCompact ? 'line-clamp-2 text-base' : 'line-clamp-8 text-lg'} leading-relaxed text-slate-700 dark:text-slate-100`}>
            {description}
          </p>
          <div className="flex flex-wrap items-center justify-between">
            <a
              className="animated-gradient-text group inline-flex items-center border-b-2 border-b-rose-600 border-opacity-40 font-semibold transition hover:border-opacity-80 dark:border-b-rose-400 dark:border-opacity-20 dark:hover:border-opacity-80"
              href={url}
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
            </a>

            <span className="inline-block items-center text-sm leading-none text-slate-600 before:mr-1 before:inline-block before:opacity-60 before:transition-opacity before:content-['⌚'] group-hover:before:opacity-100 dark:text-slate-200">
              {readingTime}min
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main ArticlesList component
export function ArticlesList({
  articles = [],
  className = '',
  isCompactView = false,
}: {
  articles: any[];
  className?: string;
  isCompactView?: boolean;
}) {
  // Filter out any invalid articles first
  const validArticles = articles.filter(article => article && article.id && article.data && article.data.title);

  if (validArticles.length === 0) {
    return (
      <section className={`body-font ${className}`}>
        <div className="container mx-auto py-8">
          <p>No articles found.</p>
        </div>
      </section>
    );
  }

  const [firstArticle, ...rest] = validArticles;

  if (isCompactView) {
    return (
      <section className={`body-font ${className}`}>
        <div className="container mx-auto py-8">
          <div className="space-y-6">
            {firstArticle && (
              <Article
                article={firstArticle}
                layoutSize={'compact-first'}
                hideImage={true}
              />
            )}
            {rest?.map((item) => (
              <Article
                article={item}
                key={item.id}
                layoutSize={'compact'}
                hideImage={true}
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={`body-font ${className}`}>
      <div className="container mx-auto py-8">
        {firstArticle && <Article article={firstArticle} />}

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {rest?.map((item) => (
            <Article article={item} key={item.id} layoutSize={'small'} />
          ))}
        </div>
      </div>
    </section>
  );
}