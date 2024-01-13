import React, { ReactElement } from 'react';
import { ClientOnly } from '~/components/ClientOnly';
import InteractiveCanvas from '~/components/InteractiveCanvas/InteractiveCanvas';

export interface FancyBackgroundProps {
  shouldShowBackground?: boolean;
  partyModeEnabled?: boolean;
  shouldBeReducedMotion?: boolean;
}

export const FancyBackground = React.memo(
  (props: FancyBackgroundProps): ReactElement => {
    const { shouldBeReducedMotion, shouldShowBackground, partyModeEnabled } =
      props;

    return (
      <div
        className={`background ${
          !shouldShowBackground ? 'background--hidden' : ''
        } ${partyModeEnabled ? 'background--party-mode' : ''}`}
      >
        <ClientOnly>
          <InteractiveCanvas />
        </ClientOnly>
        <div className="canvas-fallback"></div>
      </div>
    );
  },
);

FancyBackground.displayName = 'FancyBackground';
