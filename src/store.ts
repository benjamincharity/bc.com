// Legacy store - being replaced with React useState hooks
// This file is kept for backward compatibility during migration

// CANVAS STATE - moved to individual components using useState
export const state$ = {
  isPaused: { get: () => false, set: (_value: boolean) => {} },
  isVisible: { get: () => true, set: (_value: boolean) => {} },
  isPartyModeEnabled: { get: () => false, set: (_value: boolean) => {} },
};

// NAVIGATION STATE - moved to individual components
export const navigationState$ = {
  history: { get: () => [], set: () => {} },
};

// ARTICLES VIEW STATE - moved to ArticlesPageWrapper component
export const articlesViewState$ = {
  isCompactView: {
    get: () => typeof window !== 'undefined' ? localStorage.getItem('articlesCompactView') === 'true' : false,
    set: () => {}
  },
};
