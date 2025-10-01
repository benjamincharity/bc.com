import { useEffect, useState } from 'react';

interface ScrollBehaviorProps {
  showScrollToTop?: boolean;
  threshold?: number;
  smoothScroll?: boolean;
  className?: string;
}

export default function ScrollBehavior({
  showScrollToTop = true,
  threshold = 300,
  smoothScroll = true,
  className = ''
}: ScrollBehaviorProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;

      // Update visibility based on threshold
      setIsVisible(scrollTop > threshold);

      // Update scroll progress
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setScrollProgress(Math.min(100, Math.max(0, progress)));
    };

    // Set initial scroll behavior if enabled
    if (smoothScroll) {
      document.documentElement.style.scrollBehavior = 'smooth';
    }

    // Add scroll listener
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Initial call to set state
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (smoothScroll) {
        document.documentElement.style.scrollBehavior = '';
      }
    };
  }, [threshold, smoothScroll]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: smoothScroll ? 'smooth' : 'auto'
    });
  };

  const scrollToBottom = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: smoothScroll ? 'smooth' : 'auto'
    });
  };

  if (!showScrollToTop) {
    return null;
  }

  return (
    <>
      {/* Scroll Progress Bar */}
      <div
        className="fixed top-0 left-0 z-50 h-1 bg-gradient-to-r from-pink-500 to-teal-500 transition-all duration-300"
        style={{ width: `${scrollProgress}%` }}
        aria-hidden="true"
      />

      {/* Scroll to Top Button */}
      <div className={`fixed bottom-6 right-6 z-40 ${className}`}>
        <button
          onClick={scrollToTop}
          className={`
            flex items-center justify-center w-12 h-12 rounded-full
            bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700
            text-gray-700 dark:text-gray-300
            hover:text-pink-600 dark:hover:text-pink-400
            hover:shadow-xl hover:scale-105
            focus:outline-none focus:ring-2 focus:ring-pink-500/50
            transition-all duration-300
            ${isVisible
              ? 'opacity-100 translate-y-0 pointer-events-auto'
              : 'opacity-0 translate-y-2 pointer-events-none'
            }
          `}
          title="Scroll to top"
          aria-label="Scroll to top"
          disabled={!isVisible}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 10l7-7m0 0l7 7m-7-7v18"
            />
          </svg>
        </button>
      </div>

      {/* Additional scroll behaviors can be controlled via custom events */}
      <ScrollEventHandler smoothScroll={smoothScroll} />
    </>
  );
}

// Component to handle custom scroll events
function ScrollEventHandler({ smoothScroll }: { smoothScroll: boolean }) {
  useEffect(() => {
    const handleScrollToElement = (event: CustomEvent) => {
      const { elementId, offset = 0 } = event.detail;
      const element = document.getElementById(elementId);

      if (element) {
        const elementTop = element.getBoundingClientRect().top + window.pageYOffset;
        window.scrollTo({
          top: elementTop - offset,
          behavior: smoothScroll ? 'smooth' : 'auto'
        });
      }
    };

    const handleScrollToSection = (event: CustomEvent) => {
      const { selector, offset = 0 } = event.detail;
      const element = document.querySelector(selector);

      if (element) {
        const elementTop = element.getBoundingClientRect().top + window.pageYOffset;
        window.scrollTo({
          top: elementTop - offset,
          behavior: smoothScroll ? 'smooth' : 'auto'
        });
      }
    };

    // Listen for custom scroll events
    window.addEventListener('scrollToElement', handleScrollToElement as EventListener);
    window.addEventListener('scrollToSection', handleScrollToSection as EventListener);

    return () => {
      window.removeEventListener('scrollToElement', handleScrollToElement as EventListener);
      window.removeEventListener('scrollToSection', handleScrollToSection as EventListener);
    };
  }, [smoothScroll]);

  return null;
}

// Utility functions to trigger scroll behaviors from other components
export const scrollToElement = (elementId: string, offset = 0) => {
  window.dispatchEvent(new CustomEvent('scrollToElement', {
    detail: { elementId, offset }
  }));
};

export const scrollToSection = (selector: string, offset = 0) => {
  window.dispatchEvent(new CustomEvent('scrollToSection', {
    detail: { selector, offset }
  }));
};