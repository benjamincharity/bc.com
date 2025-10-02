import { useState, useEffect, useRef } from 'react';

type ViewMode = 'grid' | 'compact';

interface ViewToggleProps {
  defaultView?: ViewMode;
  onViewChange?: (view: ViewMode) => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function ViewToggle({
  defaultView = 'grid',
  onViewChange,
  className = '',
  size = 'md'
}: ViewToggleProps) {
  const [currentView, setCurrentView] = useState<ViewMode>(defaultView);
  const [mounted, setMounted] = useState(false);
  const [announcement, setAnnouncement] = useState('');

  // Use ref to store latest callback without re-rendering
  const onViewChangeRef = useRef(onViewChange);

  useEffect(() => {
    onViewChangeRef.current = onViewChange;
  }, [onViewChange]);

  useEffect(() => {
    // Get saved view preference from localStorage
    const savedView = localStorage.getItem('view-mode') as ViewMode;
    if (savedView && (savedView === 'grid' || savedView === 'compact')) {
      setCurrentView(savedView);
    }
    setMounted(true);
  }, []);

  const handleToggle = () => {
    const newView = currentView === 'grid' ? 'compact' : 'grid';
    setCurrentView(newView);

    // Save view preference to localStorage
    localStorage.setItem('view-mode', newView);

    // Call callback if provided
    onViewChangeRef.current?.(newView);

    // Dispatch custom event for other components to listen to
    window.dispatchEvent(new CustomEvent('viewModeChanged', {
      detail: { view: newView }
    }));

    // Announce view change to screen readers
    const message = `View changed to ${newView} mode`;
    setAnnouncement(message);

    // Clear announcement after 3 seconds
    setTimeout(() => setAnnouncement(''), 3000);
  };

  const sizeClasses = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-11 h-11'
  };

  const iconSizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  if (!mounted) {
    // Return a placeholder that matches the button size
    return (
      <div className={`${sizeClasses[size]} rounded-md border border-gray-300 dark:border-gray-600 ${className}`} />
    );
  }

  const GridIcon = () => (
    <svg className={iconSizeClasses[size]} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
      />
    </svg>
  );

  const CompactIcon = () => (
    <svg className={iconSizeClasses[size]} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 6h16M4 10h16M4 14h16M4 18h16"
      />
    </svg>
  );

  return (
    <>
      {/* Screen reader announcement for view changes */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {announcement}
      </div>

      <button
        onClick={handleToggle}
        className={`
          flex items-center justify-center ${sizeClasses[size]} rounded-md
          text-gray-700 dark:text-gray-300
          hover:text-pink-600 dark:hover:text-pink-400
          hover:bg-gray-100 dark:hover:bg-gray-800
          border border-gray-300 dark:border-gray-600
          hover:border-pink-300 dark:hover:border-pink-700
          transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-pink-500/50
          ${className}
        `}
        title={`Switch to ${currentView === 'grid' ? 'compact' : 'grid'} view`}
        aria-label={`Switch to ${currentView === 'grid' ? 'compact' : 'grid'} view`}
        aria-pressed={currentView === 'compact'}
      >
        {currentView === 'grid' ? <GridIcon /> : <CompactIcon />}
      </button>
    </>
  );
}