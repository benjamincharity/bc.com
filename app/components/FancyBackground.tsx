import React from 'react';
import { ClientOnly } from '~/components/ClientOnly';
import { InteractiveCanvas } from '~/components/InteractiveCanvas/InteractiveCanvas';
import { state$ } from '~/store';

export const FancyBackground = React.memo(() => {
  const isPartyModeEnabled = state$.isPartyModeEnabled.get();
  const isVisible = state$.isVisible.get();
  console.log('111 FancyBackground: isVisible: ', isVisible);

  return (
    <div
      className={`background ${
        !state$.isVisible.get() ? 'background--hidden' : ''
      } ${isPartyModeEnabled ? 'background--party-mode' : ''}`}
    >
      <ClientOnly>
        <InteractiveCanvas />
      </ClientOnly>
      <div className="canvas-fallback"></div>
    </div>
  );
});

FancyBackground.displayName = 'FancyBackground';
