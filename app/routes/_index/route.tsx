import React, { useEffect, useState, useRef } from "react";
import { Link, Outlet } from "@remix-run/react";
import { generateSvgSquiggle } from "~/utils/generateSvgSquiggle";
import type { InteractiveCanvasRefType } from "~/components/InteractiveCanvas/InteractiveCanvas";
import InteractiveCanvas from "~/components/InteractiveCanvas/InteractiveCanvas";
import type { Palette } from "~/components/InteractiveCanvas/palettes.data";
import { PALETTES } from "~/components/InteractiveCanvas/palettes.data";
import { ClientOnly } from "~/components/ClientOnly";

const DEFAULT_INFO_INTRO_DELAY = 7000;
const DEFAULT_INFO_EXIT_DELAY = DEFAULT_INFO_INTRO_DELAY * 2;

const pagesWithBackground = ["", "404"];

export function determineIfShouldShowBackground(url: string): boolean {
  return pagesWithBackground.includes(url.replace(/\//, ""));
}

export enum LogoStates {
  VOID = "void",
  DEFAULT = "default",
  SHRUNK = "shrunk",
}

export default function Index() {
  const [currentRoute, setCurrentRoute] = useState<string>("");
  const [shouldBeReducedMotion, setShouldBeReducedMotion] =
    useState<boolean>(false);
  const [isSubPage, setIsSubPage] = useState<boolean>(true);
  const [shouldShowBackground, setShouldShowBackground] =
    useState<boolean>(false);
  const [logoState, setLogoState] = useState<LogoStates>(LogoStates.VOID);
  const [palettes] = useState<ReadonlyArray<Palette>>([...PALETTES]);
  const [partyModeEnabled, setPartyModeEnabled] = useState<boolean>(false);
  const [partyModeInterval, setPartyModeInterval] =
    useState<NodeJS.Timeout | null>(null);
  const [showInfo, setShowInfo] = useState<boolean>(false);
  const [userHasInteractedWithInfoPanel, setUserHasInteractedWithInfoPanel] =
    useState<boolean>(false);

  const infoRef = useRef(null);
  const canvasRef = useRef<InteractiveCanvasRefType>(null);

  useEffect(() => {
    setCurrentRoute(window.location.pathname);

    if (typeof window !== "undefined") {
      setShouldBeReducedMotion(
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
      );
    }
    const localDetermination = determineIfShouldShowBackground(
      window.location.pathname
    );
    setShouldShowBackground(localDetermination);

    setLogoState(localDetermination ? LogoStates.DEFAULT : LogoStates.SHRUNK);
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
        generateSvgSquiggle(palette[0])
      )})`
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
    <div>
      <div
        className={`container ${
          !shouldShowBackground ? "container--no-background" : ""
        } ${shouldShowBackground ? "u-pointer-off" : ""} ${
          shouldBeReducedMotion ? "container--reduced-motion" : ""
        }`}
        // bcKonami
        // konami={togglePartyMode}
      >
        <header
          className={`global-header ${
            !shouldShowBackground ? "global-header--small" : ""
          } ${shouldShowBackground ? "u-pointer-off" : ""}`}
        >
          {/*<h1 className="global-header__title" shrink={logoState}>*/}
          <h1 className="global-header__title">
            {shouldShowBackground ? (
              <>
                Benjamin
                <br />
                Charity
              </>
            ) : (
              <Link className="o-sliding-background-link" to="/">
                Benjamin
                <br />
                Charity
              </Link>
            )}
          </h1>
        </header>

        <main
          className={`container__inner ${
            shouldShowBackground ? "u-pointer-off" : ""
          }`}
        >
          <Outlet />
        </main>
      </div>

      <div
        className={`background ${
          !shouldShowBackground ? "background--hidden" : ""
        } ${partyModeEnabled ? "background--party-mode" : ""}`}
      >
        <ClientOnly>
          <InteractiveCanvas
            ref={canvasRef}
            isDisabled={shouldBeReducedMotion}
            // paletteChange={setNewPaletteColors}
          />
        </ClientOnly>
        <div className="canvas-fallback"></div>
      </div>

      {/*<InfoComponent*/}
      {/*  showInfo={showInfo}*/}
      {/*  animationsArePaused={canvasRef.current.isPaused}*/}
      {/*  togglePauseRequest={canvasRef.current.togglePause}*/}
      {/*  // infoPanelStateChange={() => userHasInteractedWithInfoPanel()}*/}
      {/*  ref={infoRef}*/}
      {/*/>*/}
    </div>
  );
}
