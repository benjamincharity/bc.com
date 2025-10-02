import React, { useState, useEffect } from 'react';
import { ViewToggle } from '../ViewToggle';
import { ArticlesList } from '../Articles/ArticlesList';
import { Badge } from '../Badge';
import { BackToLink } from '../BackToLink';
import type { Article } from '~/types/article';

interface ArticlesPageWrapperProps {
  articles: Article[];
}

export default function ArticlesPageWrapper({ articles }: ArticlesPageWrapperProps) {
  const [isCompactView, setIsCompactView] = useState(false);
  const [visibleCount, setVisibleCount] = useState(7);

  // Load saved view preference and pagination state from URL
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('articlesCompactView');
      if (saved) {
        setIsCompactView(saved === 'true');
      }

      // Read page number from URL query params
      const urlParams = new URLSearchParams(window.location.search);
      const pageParam = urlParams.get('page');
      if (pageParam) {
        const page = parseInt(pageParam, 10);
        if (page > 0) {
          // Calculate visible count: 7 for page 1, then +6 for each additional page
          const count = 7 + (page - 1) * 6;
          setVisibleCount(count);
        }
      }
    }
  }, []);

  const toggleView = () => {
    const newValue = !isCompactView;
    setIsCompactView(newValue);
    // Persist to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('articlesCompactView', String(newValue));
    }
  };

  const loadMore = () => {
    setVisibleCount(prev => {
      const newCount = prev + 6;

      // Update URL with new page number
      if (typeof window !== 'undefined') {
        const currentPage = Math.floor((prev - 7) / 6) + 1;
        const newPage = currentPage + 1;
        const url = new URL(window.location.href);
        url.searchParams.set('page', String(newPage));
        window.history.pushState({}, '', url);
      }

      return newCount;
    });
  };

  const visibleArticles = articles.slice(0, visibleCount);
  const hasMore = visibleCount < articles.length;

  return (
    <>
      <nav className="relative flex items-center justify-between mb-4" aria-label="Article navigation controls">
        <BackToLink to="/" className="text-left">
          Home
        </BackToLink>

        <div className="absolute left-1/2 -translate-x-1/2">
          <ViewToggle isCompactView={isCompactView} onToggle={toggleView} />
        </div>

        <button
          className="animated-link-underline text-sm font-normal"
          onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}
        >
          Jump to tags ↓
        </button>
      </nav>

      <ArticlesList articles={visibleArticles} isCompactView={isCompactView} />

      <div className="text-center px-4 pt-4">
        {hasMore ? (
          <Badge
            color="#f184a8"
            count={-1}
            linkTo="#"
            tag="Load More"
            onClick={(e: React.MouseEvent) => {
              e.preventDefault();
              loadMore();
            }}
          />
        ) : (
          <div>
            <p className="mb-2 text-sm italic text-gray-700 dark:text-gray-200">
              You&rsquo;ve reached the end!
            </p>
            <img
              className="mx-auto w-80 max-w-full animate-gentleRotate rounded-full shadow-md"
              alt="A person asleep on a couch, illuminated by the glow of a single open laptop in a dimly lit room, conveying a serene late-night session."
              src="https://res.cloudinary.com/da2exoho7/image/upload/ar_1:1,c_fill,g_auto,r_max,w_1000/v1707251970/website/person_fallen_asleep.webp"
            />
          </div>
        )}
      </div>

      <div className="flex justify-end pt-4">
        <button
          className="animated-link-underline text-sm font-normal"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          Back to top ↑
        </button>
      </div>
    </>
  );
}