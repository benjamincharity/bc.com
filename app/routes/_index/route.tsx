import React, { useEffect, useState, useRef } from 'react';
import { Link, Outlet, useLocation, useNavigate } from '@remix-run/react';
import { generateSvgSquiggle } from '~/utils/generateSvgSquiggle';
import type { InteractiveCanvasRefType } from '~/components/InteractiveCanvas/InteractiveCanvas';
import InteractiveCanvas from '~/components/InteractiveCanvas/InteractiveCanvas';
import type { Palette } from '~/components/InteractiveCanvas/palettes.data';
import { PALETTES } from '~/components/InteractiveCanvas/palettes.data';
import { ClientOnly } from '~/components/ClientOnly';
import { InfoBubble, InfoBubbleProps } from '~/components/InfoBubble';
import { Navigation } from '~/routes/_index/utils/Navigation';

const DEFAULT_INFO_INTRO_DELAY = 7000;
const DEFAULT_INFO_EXIT_DELAY = DEFAULT_INFO_INTRO_DELAY * 2;

const pagesWithBackground = ['', '404'];

export function determineIfShouldShowBackground(url: string): boolean {
  return pagesWithBackground.includes(url.replace(/\//, ''));
}

export default function Index() {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentRoute, setCurrentRoute] = useState(location.pathname);
  const [isSubPage, setIsSubPage] = useState(true);
  const [shouldShowBackground, setShouldShowBackground] = useState(false);
  const [partyModeEnabled, setPartyModeEnabled] = useState(false);
  const [shouldBeReducedMotion, setShouldBeReducedMotion] =
    useState<boolean>(false);
  const [palettes] = useState<ReadonlyArray<Palette>>([...PALETTES]);
  const [partyModeInterval, setPartyModeInterval] =
    useState<NodeJS.Timeout | null>(null);
  const [userHasInteractedWithInfoPanel, setUserHasInteractedWithInfoPanel] =
    useState<boolean>(false);

  const infoRef = useRef(null);
  const canvasRef = useRef<InteractiveCanvasRefType>(null);

  useEffect(() => {
    // Similar to React, handle routing and state updates here
    const handleRouteChange = () => {
      // Update states based on route change
      setCurrentRoute(location.pathname);
      // Other state updates...
    };

    // Call handleRouteChange initially and on every location change
    handleRouteChange();
  }, [location]);

  useEffect(() => {
    setCurrentRoute(window.location.pathname);

    if (typeof window !== 'undefined') {
      setShouldBeReducedMotion(
        window.matchMedia('(prefers-reduced-motion: reduce)').matches,
      );
    }
    const localDetermination = determineIfShouldShowBackground(
      window.location.pathname,
    );
    setShouldShowBackground(localDetermination);
  }, []);

  // useEffect(() => {
  //   const onKeydownHandler = (event: KeyboardEvent) => {
  //     if (event.key === "Escape" && infoRef.current) {
  //       // infoRef.current.showPopover = false;
  //     }
  //   };
  //
  //   document.addEventListener("keydown", onKeydownHandler);
  //
  //   return () => {
  //     document.removeEventListener("keydown", onKeydownHandler);
  //   };
  // }, []);

  // useEffect(() => {
  //   const showThenHideInfo = () => {
  //     const infoTimer = setTimeout(() => {
  //       if (shouldShowBackground) {
  //         setShowInfo(true);
  //
  //         const hideInfoTimer = setTimeout(() => {
  //           setShowInfo(false);
  //         }, DEFAULT_INFO_EXIT_DELAY);
  //
  //         return () => {
  //           clearTimeout(hideInfoTimer);
  //         };
  //       }
  //     }, DEFAULT_INFO_INTRO_DELAY);
  //
  //     return () => {
  //       clearTimeout(infoTimer);
  //     };
  //   };
  //
  //   showThenHideInfo();
  // }, [shouldShowBackground]);

  const setNewPaletteColors = (palette: Palette) => {
    document.documentElement.style.setProperty(
      `--o-squiggle-link-backgroundImage`,
      `url(data:image/svg+xml;base64,${window.btoa(
        generateSvgSquiggle(palette[0]),
      )})`,
    );

    for (let i = 0; i < palette.length; i += 1) {
      const cssVar = `--highlight-color-${i + 1}`;
      document.documentElement.style.setProperty(cssVar, `${palette[i]}`);
    }
  };

  const togglePartyMode = (isOn: boolean) => {
    setPartyModeEnabled(isOn);

    if (isOn && canvasRef.current) {
      const canvas = canvasRef.current;
      const intervalId = setInterval(() => {
        canvas.wobbleRows();
      }, 500);

      setPartyModeInterval(intervalId);
    } else if (partyModeInterval) {
      clearInterval(partyModeInterval);
      setPartyModeInterval(null);
    }
  };

  return (
    <div className={'bc-home'}>
      <div
        className={`container ${
          !shouldShowBackground ? 'container--no-background' : ''
        } ${shouldShowBackground ? 'u-pointer-off' : ''} ${
          shouldBeReducedMotion ? 'container--reduced-motion' : ''
        }`}
        // bcKonami
        // konami={togglePartyMode}
      >
        <main
          className={`container__inner ${
            shouldShowBackground ? 'u-pointer-off' : ''
          }`}
          style={{ outline: '2px solid red' }}
        >
          <Outlet />
        </main>
      </div>

      <InfoBubble
        // animationsArePaused={!!canvasRef.current?.isPaused}
        togglePauseRequest={() => {
          if (canvasRef.current) {
            // canvasRef.current.togglePause();
          }
        }}
        // infoPanelStateChange={() => userHasInteractedWithInfoPanel()}
        ref={infoRef}
      />
    </div>
  );
}
