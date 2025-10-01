interface ViewToggleProps {
  isCompactView: boolean;
  onToggle: () => void;
}

export function ViewToggle({ isCompactView, onToggle }: ViewToggleProps) {
  return (
    <button
      onClick={onToggle}
      aria-label={`Switch to ${isCompactView ? 'grid' : 'compact'} view`}
      className="flex items-center space-x-1 rounded-md border border-gray-300 bg-white px-2 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
    >
      {isCompactView ? (
        <>
          <GridIcon />
          <span className="hidden sm:inline">Grid View</span>
        </>
      ) : (
        <>
          <ListIcon />
          <span className="hidden sm:inline">Compact View</span>
        </>
      )}
    </button>
  );
}

function GridIcon() {
  return (
    <svg
      className="h-3 w-3"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
    </svg>
  );
}

function ListIcon() {
  return (
    <svg
      className="h-3 w-3"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <line x1="8" y1="6" x2="21" y2="6" />
      <line x1="8" y1="12" x2="21" y2="12" />
      <line x1="8" y1="18" x2="21" y2="18" />
      <line x1="3" y1="6" x2="3.01" y2="6" />
      <line x1="3" y1="12" x2="3.01" y2="12" />
      <line x1="3" y1="18" x2="3.01" y2="18" />
    </svg>
  );
}