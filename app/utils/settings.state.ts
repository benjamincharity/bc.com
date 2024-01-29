import { observable } from '@legendapp/state';
import {
  configureObservablePersistence,
  persistObservable,
} from '@legendapp/state/persist';
import { ObservablePersistLocalStorage } from '@legendapp/state/persist-plugins/local-storage';

// Global configuration
configureObservablePersistence({
  pluginLocal: ObservablePersistLocalStorage,
});

export enum Theme {
  DARK = 'dark',
  LIGHT = 'light',
}

export const themes: Array<Theme> = Object.values(Theme);
export const settings$ = observable<{ theme: Theme }>({ theme: Theme.DARK });

persistObservable(settings$, { local: 'settings' });
