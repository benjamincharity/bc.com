import { useReducedMotion } from '@mantine/hooks';
import { useEffect, useState } from 'react';

import { state$ } from '../../store';
import { InteractiveCanvas } from '../InteractiveCanvas/InteractiveCanvas';

export default function FancyBackground({
  isVisible = true,
}: {
  isVisible?: boolean;
}) {
  const isPartyModeEnabled = state$.isPartyModeEnabled.get();
  const [localIsVisible, setLocalIsVisible] = useState(() => isVisible);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    state$.isVisible.set(isVisible);
    setLocalIsVisible(isVisible);
  }, [isVisible]);

  return (
    <div
      className={`absolute inset-0 z-10 ${
        localIsVisible ? 'opacity-100' : 'pointer-events-none opacity-0'
      } ${isPartyModeEnabled ? 'background--party-mode' : ''}`}
    >
      <InteractiveCanvas isDisabled={reduceMotion} />
      <div className="canvas-fallback absolute inset-0 z-10 bg-[--highlight-color-1]"></div>
    </div>
  );
}
