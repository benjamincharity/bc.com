import { observable } from '@legendapp/state';

export const state$ = observable({
  isPaused: false,
  isVisible: true,
  isPartyModeEnabled: false,
});
