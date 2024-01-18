import React, { useEffect, useState, useRef } from 'react';
import { Outlet, useLocation, useNavigate } from '@remix-run/react';
import type { InteractiveCanvasRefType } from '~/components/InteractiveCanvas/InteractiveCanvas';
import type { Palette } from '~/components/InteractiveCanvas/palettes.data';
import { PALETTES } from '~/components/InteractiveCanvas/palettes.data';
import { Navigation } from '~/routes/_index/components/Navigation';

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
  const [shouldShowBackground, setShouldShowBackground] = useState(false);
  const [partyModeEnabled, setPartyModeEnabled] = useState(false);
  const [palettes] = useState<ReadonlyArray<Palette>>([...PALETTES]);
  const [partyModeInterval, setPartyModeInterval] =
    useState<NodeJS.Timeout | null>(null);
  const [userHasInteractedWithInfoPanel, setUserHasInteractedWithInfoPanel] =
    useState<boolean>(false);

  const infoRef = useRef(null);
  const canvasRef = useRef<InteractiveCanvasRefType>(null);

  useEffect(() => {
    const handleRouteChange = () => {
      setCurrentRoute(location.pathname);
    };

    handleRouteChange();
  }, [location]);

  useEffect(() => {
    setCurrentRoute(window.location.pathname);

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

  // const setNewPaletteColors = (palette: Palette) => {
  //   document.documentElement.style.setProperty(
  //     `--o-squiggle-link-backgroundImage`,
  //     `url(data:image/svg+xml;base64,${window.btoa(
  //       generateSvgSquiggle(palette[0]),
  //     )})`,
  //   );
  //
  //   for (let i = 0; i < palette.length; i += 1) {
  //     const cssVar = `--highlight-color-${i + 1}`;
  //     console.log('cssVar: ', cssVar);
  //     document.documentElement.style.setProperty(cssVar, `${palette[i]}`);
  //   }
  // };

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
    <div
      className={
        'bc-home text-center relative z-20 font-vt323 pointer-events-none'
      }
    >
      <div
      // bcKonami
      // konami={togglePartyMode}
      >
        <main>
          <Outlet />

          <h2 className="inline-block hyphens-none whitespace-nowrap uppercase text-subTitle m-4 mt-2 font-vt323 text-white leading-none text-shadow-title text-center">
            Engineering leader at high-growth
            <br />
            startups & scale-ups
          </h2>

          <Navigation />
        </main>
      </div>

      {/*<InfoBubble*/}
      {/*  animationsArePaused={state$.isPaused.get()}*/}
      {/*  togglePauseRequest={() => {*/}
      {/*    state$.isPaused.set(!state$.isPaused.get());*/}
      {/*  }}*/}
      {/*  // infoPanelStateChange={() => userHasInteractedWithInfoPanel()}*/}
      {/*  ref={infoRef}*/}
      {/*/>*/}
    </div>
  );
}
