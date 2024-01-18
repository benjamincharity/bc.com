import React, { useEffect } from 'react';
import { ClientOnly } from '~/components/ClientOnly';
import { InteractiveCanvas } from '~/components/InteractiveCanvas/InteractiveCanvas';
import { state$ } from '~/store';

import styles from './FancyBackground.css';
import { LinksFunction } from '@remix-run/node';
import { useReducedMotion } from '@mantine/hooks';

export const links: LinksFunction = () => [{ rel: 'stylesheet', href: styles }];

export const FancyBackground = React.memo(
  ({ isVisible = true }: { isVisible?: boolean }) => {
    const isPartyModeEnabled = state$.isPartyModeEnabled.get();
    const [localIsVisible, setLocalIsVisible] = React.useState(isVisible);
    const reduceMotion = useReducedMotion();

    useEffect(() => {
      state$.isVisible.set(isVisible);
      setLocalIsVisible(isVisible);
    }, [isVisible]);

    return (
      <div
        className={`absolute inset-0 z-10 ${
          localIsVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
        } ${isPartyModeEnabled ? 'background--party-mode' : ''}`}
      >
        <ClientOnly>
          <InteractiveCanvas isDisabled={reduceMotion} />
        </ClientOnly>
        <div className="canvas-fallback inset-0 absolute z-10 bg-[--highlight-color-1]"></div>
      </div>
    );
  },
);

FancyBackground.displayName = 'FancyBackground';
