import React from 'react';
import { ClientOnly } from '~/components/ClientOnly';
import { InteractiveCanvas } from '~/components/InteractiveCanvas/InteractiveCanvas';
import { state$ } from '~/store';

import styles from './FancyBackground.css';
import { LinksFunction } from '@remix-run/node';

export const links: LinksFunction = () => [{ rel: 'stylesheet', href: styles }];

export const FancyBackground = React.memo(() => {
  const isPartyModeEnabled = state$.isPartyModeEnabled.get();
  const isVisible = state$.isVisible.get();
  console.log('111 FancyBackground: isVisible: ', isVisible);

  return (
    <div
      className={`absolute inset-0  z-10 ${
        !state$.isVisible.get() ? 'opacity-0' : 'opacity-100'
      } ${isPartyModeEnabled ? 'background--party-mode' : ''}`}
    >
      <ClientOnly>
        <InteractiveCanvas />
      </ClientOnly>
      <div className="canvas-fallback inset-0 absolute z-10 bg-[--highlight-color-1]"></div>
    </div>
  );
});

FancyBackground.displayName = 'FancyBackground';
