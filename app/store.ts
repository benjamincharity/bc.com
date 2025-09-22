import { observable } from '@legendapp/state';

// CANVAS STATE
export const state$ = observable({
  isPaused: false,
  isVisible: true,
  isPartyModeEnabled: false,
});

// NAVIGATION STATE
interface NavigationState {
  history: string[];
}

const initialState: NavigationState = {
  history: [],
};

export const navigationState$ = observable(initialState);

// ARTICLES VIEW STATE
export const articlesViewState$ = observable({
  isCompactView: false,
});
