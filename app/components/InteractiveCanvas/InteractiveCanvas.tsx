import React, {
  useRef,
  useEffect,
  useState,
  useCallback,
  useImperativeHandle,
} from "react";
import type { Palette } from "./palettes.data";
import { Row } from "./row";
import { state$ } from "~/components/InteractiveCanvas/store";
import { useDebounce } from "@uidotdev/usehooks";

// TODO: STILL working on infinite loop
// TODO: STILL working on infinite loop
// TODO: STILL working on infinite loop
// TODO: STILL working on infinite loop
// TODO: STILL working on infinite loop
// colors are present in row finally

function isMouseEvent(event: MouseEvent | TouchEvent): event is MouseEvent {
  return event instanceof MouseEvent;
}

export enum ArrowDirection {
  ARROW_LEFT = "ArrowLeft",
  ARROW_RIGHT = "ArrowRight",
}

// Define a dummy window object for SSR
const dummyWindow = {
  addEventListener: (
    event: string,
    listener: EventListenerOrEventListenerObject
  ) => {},
  removeEventListener: (
    event: string,
    listener: EventListenerOrEventListenerObject
  ) => {},
  innerWidth: 1024,
  innerHeight: 768,
  devicePixelRatio: 1,
};

function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(n, max));
}

export interface InteractiveCanvasProps {
  forwardedRef?: React.Ref<InteractiveCanvasRefType>;
  isDisabled?: boolean;
  paletteChange?: (palette: Palette) => void;
}

export interface InteractiveCanvasRefType {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  resetMousePositions: () => void;
  togglePause: () => void;
  wobbleRows: (goToNextPalette?: boolean) => void;
}

const InteractiveCanvas = React.forwardRef<
  InteractiveCanvasRefType,
  InteractiveCanvasProps
>((props, ref) => {
  const { isDisabled = false, paletteChange } = props;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);
  // const [currentPalettes, setCurrentPalettes] = useState<
  //   ReadonlyArray<Palette>
  // >([]);
  const localWindow = typeof window !== "undefined" ? window : dummyWindow;
  const needsRedraw = false;

  const drawRows = useCallback(() => {
    if (!needsRedraw) {
      return;
    }
    const canvas = canvasRef.current!;
    const context = canvas.getContext("2d");
    const totalPoints = state$.totalPoints.peek();
    if (
      !totalPoints ||
      !canvas ||
      !context ||
      !canvas.offsetWidth ||
      !canvas.offsetHeight
    ) {
      return;
    }

    context.clearRect(0, 0, canvas.width, canvas.height);
    const rows = state$.rows.peek();
    const dist = state$.dist.peek();
    for (let i = rows.length; i--; ) {
      console.log("calling row.draw: ", rows[i]);
      rows[i].draw(
        canvas,
        dist,
        state$.mouse.x.peek(),
        state$.mouse.y.peek(),
        totalPoints
      );
    }
    state$.needsRedraw.set(false);
  }, [needsRedraw]);

  // const setPalette = useCallback(
  //   (palette: Palette) => {
  //     const canvas = canvasRef.current;
  //     console.log("setPalette: ", !!canvas);
  //     if (canvas) {
  //       const palette: Palette = PALETTES[paletteNumber] ?? PALETTES[0];
  //       console.log("palette: ", palette[0]);
  //       canvas.style.backgroundColor = palette[0];
  //       for (let i = rows.length; i--; ) {
  //         console.log("pal color: ", palette[i + 1]);
  //         rows[rows.length - i - 1].color = palette[i + 1];
  //       }
  //     }
  //   },
  //   [paletteNumber, rows]
  // );

  // currently only called one place
  // const resizeRows = useCallback(
  //   (canvas: HTMLCanvasElement) => {
  //     const currentHeight = localWindow.innerHeight;
  //     const currentWidth = localWindow.innerWidth;
  //     const scale = state$.scale.peek();
  //     const rows = state$.rows.peek();
  //     const totalPoints = state$.totalPoints.peek();
  //     canvas.width = currentWidth * scale;
  //     canvas.height = currentHeight * scale;
  //     canvas.style.width = `${currentWidth}px`;
  //     canvas.style.height = `${currentHeight}px`;
  //     state$.totalPoints.set(
  //       Math.round(clamp(Math.pow(Math.random() * 8, 2), 16, currentWidth / 35))
  //     );
  //     state$.dist.set(clamp(currentWidth / 4, 150, 200));
  //
  //     for (let i = rows.length; i--; ) {
  //       rows[i].resize(totalPoints);
  //     }
  //     drawRows();
  //   },
  //   [drawRows, localWindow.innerHeight, localWindow.innerWidth]
  // );

  const handleMove = useCallback((event: MouseEvent | TouchEvent) => {
    const x = isMouseEvent(event) ? event.pageX : event.targetTouches[0].pageX;
    const y = isMouseEvent(event) ? event.pageY : event.targetTouches[0].pageY;
    state$.mouse.set({ x, y });
  }, []);

  // useEffect(() => {
  //   const canvas = canvasRef.current;
  //   setContext(canvas?.getContext("2d") || null);
  //   // setCurrentPalettes(shuffle([...PALETTES]));
  // }, [localWindow, isDisabled]);

  // useImperativeHandle(ref, () => ({
  //   canvasRef,
  //   wobbleRows: (goToNextPalette = true) => {
  //     // const canvas = canvasRef.current;
  //     // if (canvas) {
  //     //   const currentHeight = localWindow.innerHeight;
  //     //   const currentWidth = localWindow.innerWidth;
  //     //   canvas.width = currentWidth * scale;
  //     //   canvas.height = currentHeight * scale;
  //     //   canvas.style.width = `${currentWidth}px`;
  //     //   canvas.style.height = `${currentHeight}px`;
  //     // }
  //     // const updatedRows = [...rows];
  //     // for (let i = updatedRows.length; i--; ) {
  //     //   updatedRows[i].wobble(dist, totalPoints);
  //     // }
  //     // setRows(updatedRows);
  //     // if (goToNextPalette) {
  //     //   nextPalette();
  //     // }
  //   },
  //   resetMousePositions: () => {
  //     // setMouseX(mouseOff);
  //     // setMouseY(mouseOff);
  //   },
  //   togglePause: () => {
  //     // setIsPaused(!isPaused);
  //     // if (!isPaused) {
  //     //   update();
  //     // }
  //   },
  // }));

  const update = useCallback(() => {
    state$.needsRedraw.set(true);
    // if (!isPaused) {
    //   requestAnimationFrame(update);
    //   if (canvasRef.current) {
    //     console.log("update func: calling drawRows");
    //     drawRows();
    //   }
    // }
  }, []);

  const renderCanvas = useCallback(() => {
    console.log("____________renderCanvas____________");
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const scale = state$.scale.peek();
      const palette = state$.palette.peek();
      const totalPoints = state$.totalPoints.peek();
      canvas.style.backgroundColor = palette[0];

      const localRows = [4 / 5, 3 / 5, 2 / 5, 1 / 5].map((fraction, i) => {
        const row = new Row(fraction, scale, totalPoints);
        row.color = palette[palette.length - i - 1];
        return row;
      });

      state$.rows.set(localRows);
      // resizeRows(canvas);

      // start resizeRows
      const currentHeight = localWindow.innerHeight;
      const currentWidth = localWindow.innerWidth;
      const rows = state$.rows.peek();
      canvas.width = currentWidth * scale;
      canvas.height = currentHeight * scale;
      canvas.style.width = `${currentWidth}px`;
      canvas.style.height = `${currentHeight}px`;
      state$.totalPoints.set(
        Math.round(clamp(Math.pow(Math.random() * 8, 2), 16, currentWidth / 35))
      );
      state$.dist.set(clamp(currentWidth / 4, 150, 200));

      for (let i = rows.length; i--; ) {
        rows[i].resize(totalPoints);
      }
      drawRows();
      // end resizeRows

      // update();
    }
  }, [drawRows, localWindow.innerHeight, localWindow.innerWidth]);

  const debouncedRenderCanvas = useDebounce(renderCanvas, 300);

  const handleResize = useCallback(() => {
    debouncedRenderCanvas?.();
  }, [debouncedRenderCanvas]);

  // const handlePaletteChange = useCallback(
  //   (newNumber: number) => {
  //     const palette = PALETTES[newNumber] ?? PALETTES[0];
  //     console.log("CALLING palette change");
  //     paletteChange?.(palette);
  //
  //     if (canvasRef.current) {
  //       canvasRef.current.style.backgroundColor = palette[0];
  //       const updatedRows = [...rows];
  //       for (let i = updatedRows.length; i--; ) {
  //         updatedRows[updatedRows.length - i - 1].color = palette[i + 1];
  //       }
  //       setRows(updatedRows);
  //     }
  //   },
  //   [paletteChange, rows]
  // );

  useEffect(() => {
    if (needsRedraw) {
      requestAnimationFrame(drawRows);
    }
  }, [drawRows, needsRedraw]);

  // INITIAL LOAD:
  useEffect(() => {
    state$.scale.set(localWindow.devicePixelRatio);

    if (canvasRef.current) {
      console.log("CALLING initial renderCanvas");
      // initialize();
      debouncedRenderCanvas?.();
    }
    const handleWindowResize = () => {
      handleResize();
    };

    localWindow.addEventListener("resize", handleWindowResize);
    handleResize(); // Call it once initially

    return () => {
      localWindow.removeEventListener("resize", handleWindowResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // NOTE: cre
  // useEffect(() => {
  //   if (!debounceRef.current) {
  //     debounceRef.current = new InclusiveDebounce(() => {
  //       const canvas = canvasRef.current;
  //       const scale = state$.scale.peek();
  //       const currentHeight = localWindow.innerHeight;
  //       const currentWidth = localWindow.innerWidth;
  //       if (canvas) {
  //         canvas.width = currentWidth * scale;
  //         canvas.height = currentHeight * scale;
  //         canvas.style.width = `${currentWidth}px`;
  //         canvas.style.height = `${currentHeight}px`;
  //       }
  //
  //       const newTotalPoints = Math.round(
  //         clamp(Math.pow(Math.random() * 8, 2), 16, currentWidth / 35)
  //       );
  //
  //       state$.dist.set(clamp(currentWidth / 4, 150, 200));
  //       state$.rows.set([
  //         new Row(4 / 5, scale, newTotalPoints),
  //         new Row(3 / 5, scale, newTotalPoints),
  //         new Row(2 / 5, scale, newTotalPoints),
  //         new Row(1 / 5, scale, newTotalPoints),
  //       ]);
  //       setTotalPoints(newTotalPoints);
  //
  //       if (canvas) {
  //         drawRows();
  //       }
  //     });
  //   }
  // }, [
  //   drawRows,
  //   localWindow.innerHeight,
  //   localWindow.innerWidth,
  //   scale,
  //   totalPoints,
  // ]);

  return (
    <canvas
      ref={canvasRef}
      onMouseMove={(e) => {
        if (!isDisabled) {
          handleMove(e as unknown as MouseEvent);
        }
      }}
      onTouchMove={(e) => {
        if (!isDisabled) {
          handleMove(e as unknown as TouchEvent);
        }
      }}
    />
  );
});

export default React.memo(InteractiveCanvas);
