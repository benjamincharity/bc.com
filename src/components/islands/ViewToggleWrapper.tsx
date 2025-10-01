import React, { useState, useEffect } from 'react';
import { ViewToggle } from '../ViewToggle';
import { ArticlesList } from '../Articles/ArticlesList';

interface ViewToggleWrapperProps {
  articles: any[];
}

export default function ViewToggleWrapper({ articles }: ViewToggleWrapperProps) {
  const [isCompactView, setIsCompactView] = useState(false);
  const [visibleCount, setVisibleCount] = useState(7);

  // Load saved view preference
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('articlesCompactView');
      if (saved) {
        setIsCompactView(saved === 'true');
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
    setVisibleCount(prev => prev + 6);
  };

  const visibleArticles = articles.slice(0, visibleCount);
  const hasMore = visibleCount < articles.length;
  const remainingCount = articles.length - visibleCount;

  return (
    <>
      <ViewToggle isCompactView={isCompactView} onToggle={toggleView} />

      <ArticlesList articles={visibleArticles} isCompactView={isCompactView} />

      {/* Load More Section */}
      <div className="text-center px-4 pt-4">
        {hasMore ? (
          <div className="inline-block">
            <button
              onClick={loadMore}
              className="bg-pink-400 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-pink-500 transition-colors"
            >
              Load More ({remainingCount} more articles)
            </button>
          </div>
        ) : (
          <div>
            <p className="mb-2 text-sm italic text-gray-700 dark:text-gray-200">
              You've reached the end!
            </p>
            <img
              className="mx-auto w-80 max-w-full animate-gentleRotate rounded-full shadow-md"
              alt="A person asleep on a couch, illuminated by the glow of a single open laptop in a dimly lit room, conveying a serene late-night session."
              src="https://res.cloudinary.com/da2exoho7/image/upload/ar_1:1,c_fill,g_auto,r_max,w_1000/v1707251970/website/person_fallen_asleep.webp"
            />
          </div>
        )}
      </div>
    </>
  );
}