import { type ReactNode, useEffect, useMemo, useState } from 'react';

// This should exactly match your existing app/components/Header.tsx
// but adapted to work as an Astro island

const shared = `relative text-center z-20 font-vt323 leading-none`;
const largeState = `${shared} pointer-events-none text-white text-title py-10 text-shadow-title`;
const smallState = `${shared} h-[84px] pointer-events-auto text-gray-700 dark:text-white text-titleSmall pt-6 transition-duration-200`;
const transition = `transition-all duration-200`;

export default function Header({ children }: { children?: ReactNode }) {
  const [isAnimationEnabled, setIsAnimationEnabled] = useState(false);
  const [currentPath, setCurrentPath] = useState('');

  // Determine if background should be visible based on current path
  const backgroundIsVisible =
    currentPath === '/' ||
    currentPath === '' ||
    currentPath === '/404' ||
    currentPath === '/404/';
  const [isSmall, setIsSmall] = useState(!backgroundIsVisible);

  const transitionClasses = useMemo(() => {
    return isAnimationEnabled ? transition : '';
  }, [isAnimationEnabled]);

  const headerClasses = useMemo(() => {
    return isSmall
      ? `${smallState} ${transitionClasses}`
      : `${largeState} ${transitionClasses}`;
  }, [isSmall, transitionClasses]);

  // Track current path and listen for navigation changes
  useEffect(() => {
    const updatePath = () => {
      // Check for canvas layout via data attribute
      const hasCanvasLayout =
        document.body.getAttribute('data-canvas-layout') === 'true';
      if (hasCanvasLayout) {
        setCurrentPath('/'); // Treat as homepage for styling (large title, no scroll)
      } else {
        setCurrentPath(window.location.pathname);
      }
    };

    // Set initial path
    updatePath();

    // Listen for Astro view transitions and regular navigation
    const handleNavigation = () => {
      updatePath();
    };

    document.addEventListener('astro:page-load', handleNavigation);
    window.addEventListener('popstate', handleNavigation);

    return () => {
      document.removeEventListener('astro:page-load', handleNavigation);
      window.removeEventListener('popstate', handleNavigation);
    };
  }, []);

  useEffect(() => {
    setIsSmall(!backgroundIsVisible);
    // Enable animation after initial render to prevent flash
    const timer = setTimeout(() => setIsAnimationEnabled(true), 100);
    return () => clearTimeout(timer);
  }, [backgroundIsVisible]);

  // This should match your existing scroll handling logic
  useEffect(() => {
    if (!backgroundIsVisible) return;

    const handleScroll = () => {
      const shouldBeSmall = window.scrollY > 100;
      setIsSmall(shouldBeSmall);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [backgroundIsVisible]);

  return (
    <header id="primary-header" className={headerClasses}>
      <div>
        {/* Your site title - this should match your existing design */}
        <h1 className="uppercase">
          <a href="/" className="text-inherit no-underline hover:text-inherit">
            Benjamin
            <br />
            Charity
          </a>
        </h1>
        {children}
      </div>
    </header>
  );
}
