import React, {
  useRef,
  useEffect,
  useState,
  useCallback,
  useImperativeHandle,
  useLayoutEffect,
} from "react";
import type { Palette } from "./palettes.data";
import { Row } from "./row";
import { InclusiveDebounce } from "~/utils/debounce";

function isMouseEvent(event: any): event is MouseEvent {
  return event instanceof MouseEvent;
}

function isTouchEvent(event: any): event is TouchEvent {
  return event instanceof TouchEvent;
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

function shuffle<T>(arr: T[]): T[] {
  return arr.sort(() => Math.random() - 0.5);
}

function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(n, max));
}

export interface InteractiveCanvasProps {
  forwardedRef?: React.Ref<InteractiveCanvasRefType>;
  isDisabled?: boolean;
  paletteChange: (palette: Palette) => void;
  palettes: ReadonlyArray<Palette>;
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
  const { palettes, isDisabled = false, paletteChange } = props;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);
  const [currentPalettes, setCurrentPalettes] = useState<
    ReadonlyArray<Palette>
  >([]);
  const [dist, setDist] = useState(0);
  const [mouseOff] = useState(-1000);
  const [mouseX, setMouseX] = useState(mouseOff);
  const [mouseY, setMouseY] = useState(mouseOff);
  const [paletteNumber, setPaletteNumber] = useState(-1);
  const [rows, setRows] = useState<Row[]>([]);
  const [scale, setScale] = useState(1);
  const [totalPoints, setTotalPoints] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const localWindow = typeof window !== "undefined" ? window : dummyWindow;

  useEffect(() => {
    const handleMove = (event: MouseEvent | TouchEvent) => {
      const x = isMouseEvent(event)
        ? event.pageX
        : event.targetTouches[0].pageX;
      const y = isMouseEvent(event)
        ? event.pageY
        : event.targetTouches[0].pageY;
      setMouseX(x * scale);
      setMouseY(y * scale);
    };

    const canvas = canvasRef.current;
    setContext(canvas?.getContext("2d") || null);
    setCurrentPalettes(shuffle([...palettes]));

    if (!isDisabled) {
      const handleMouseMove: EventListener = (event) => {
        if (isMouseEvent(event)) {
          handleMove(event);
        }
      };

      const handleTouchMove: EventListener = (event) => {
        if (isTouchEvent(event)) {
          handleMove(event);
        }
      };

      // Use the dummy window object for SSR
      localWindow.addEventListener(
        "mousemove",
        handleMouseMove as EventListenerOrEventListenerObject,
        { passive: true }
      );
      localWindow.addEventListener(
        "touchmove",
        handleTouchMove as EventListenerOrEventListenerObject,
        { passive: true }
      );

      return () => {
        localWindow.removeEventListener(
          "mousemove",
          handleMouseMove as EventListenerOrEventListenerObject
        );
        localWindow.removeEventListener(
          "touchmove",
          handleTouchMove as EventListenerOrEventListenerObject
        );
      };
    }

    return undefined;
  }, [localWindow, palettes, isDisabled, scale]);

  useImperativeHandle(ref, () => ({
    canvasRef,
    wobbleRows: (goToNextPalette = true) => {
      const canvas = canvasRef.current;
      if (canvas) {
        const currentHeight = localWindow.innerHeight;
        const currentWidth = localWindow.innerWidth;
        canvas.width = currentWidth * scale;
        canvas.height = currentHeight * scale;
        canvas.style.width = `${currentWidth}px`;
        canvas.style.height = `${currentHeight}px`;
      }
      const updatedRows = [...rows];
      for (let i = updatedRows.length; i--; ) {
        updatedRows[i].wobble(dist, totalPoints);
      }
      setRows(updatedRows);
      if (goToNextPalette) {
        nextPalette();
      }
    },
    resetMousePositions: () => {
      setMouseX(mouseOff);
      setMouseY(mouseOff);
    },
    togglePause: () => {
      setIsPaused(!isPaused);
      if (!isPaused) {
        update();
      }
    },
  }));

  const drawRows = useCallback(
    (canvas: HTMLCanvasElement) => {
      if (!totalPoints) {
        return;
      }

      const context: CanvasRenderingContext2D | null = canvas.getContext("2d");
      if (!context) {
        return;
      }
      console.log("in drawRows: ", context, totalPoints);
      context.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = rows.length; i--; ) {
        console.log(
          "CALLING ROW DRAW: ",
          canvas,
          dist,
          mouseX,
          mouseY,
          totalPoints
        );
        rows[i].draw(canvas, dist, mouseX, mouseY, totalPoints);
      }
    },
    [dist, mouseX, mouseY, rows, totalPoints]
  );

  const handleResizeInner = useCallback(() => {
    console.log("========= HANDLE RESIZE INNER ========");
    const canvas = canvasRef.current;
    const currentHeight = localWindow.innerHeight;
    const currentWidth = localWindow.innerWidth;
    if (canvas) {
      canvas.width = currentWidth * scale;
      canvas.height = currentHeight * scale;
      canvas.style.width = `${currentWidth}px`;
      canvas.style.height = `${currentHeight}px`;
    }

    const newTotalPoints = Math.round(
      clamp(Math.pow(Math.random() * 8, 2), 16, currentWidth / 35)
    );
    console.log(
      "111 handleResize: InteractiveCanvas: newTotalPoints: ",
      newTotalPoints,
      totalPoints
    );
    setTotalPoints(newTotalPoints);

    setDist(clamp(currentWidth / 4, 150, 200));
    setRows([
      new Row(4 / 5, scale, totalPoints),
      new Row(3 / 5, scale, totalPoints),
      new Row(2 / 5, scale, totalPoints),
      new Row(1 / 5, scale, totalPoints),
    ]);

    if (canvas) {
      drawRows(canvas);
    }
  }, [
    drawRows,
    localWindow.innerHeight,
    localWindow.innerWidth,
    scale,
    totalPoints,
  ]);
  const debounceRef = useRef<InclusiveDebounce | null>(null);

  const handleResize = useCallback(() => {
    if (debounceRef.current) {
      console.log("in handle resize current exists");
      debounceRef.current.run();
    }
  }, []);

  useEffect(() => {
    const handleWindowResize = () => {
      handleResize();
    };

    localWindow.addEventListener("resize", handleWindowResize);
    handleResize(); // Call it once initially

    return () => {
      localWindow.removeEventListener("resize", handleWindowResize);
    };
  }, [localWindow, handleResize]);

  const handlePaletteChange = (newNumber: number) => {
    const palette = palettes[newNumber] ?? palettes[0];
    paletteChange(palette);

    if (canvasRef.current) {
      canvasRef.current.style.backgroundColor = palette[0];
      const updatedRows = [...rows];
      for (let i = updatedRows.length; i--; ) {
        updatedRows[updatedRows.length - i - 1].color = palette[i + 1];
      }
      setRows(updatedRows);
    }
  };

  const previousPalette = () => {
    const unvalidatedNumber = paletteNumber - 1;
    const validatedNumber =
      unvalidatedNumber < 0 ? palettes.length : unvalidatedNumber;
    setPaletteNumber(validatedNumber);
    handlePaletteChange(validatedNumber);
  };

  const nextPalette = () => {
    const unvalidatedNumber = paletteNumber + 1;
    const validatedNumber =
      unvalidatedNumber > palettes.length - 1 ? 0 : unvalidatedNumber;
    setPaletteNumber(validatedNumber);
    handlePaletteChange(validatedNumber);
  };

  const update = () => {
    if (!isPaused) {
      requestAnimationFrame(update);
      if (canvasRef.current) {
        drawRows(canvasRef.current);
      }
    }
  };

  useLayoutEffect(() => {
    handleResize();
    setScale(localWindow.devicePixelRatio);
  }, [handleResize, localWindow.devicePixelRatio]);

  useEffect(() => {
    if (!debounceRef.current) {
      debounceRef.current = new InclusiveDebounce(() => {
        console.log("Debounced action performed");
        console.log("========= HANDLE RESIZE INNER ========");
        const canvas = canvasRef.current;
        const currentHeight = localWindow.innerHeight;
        const currentWidth = localWindow.innerWidth;
        if (canvas) {
          canvas.width = currentWidth * scale;
          canvas.height = currentHeight * scale;
          canvas.style.width = `${currentWidth}px`;
          canvas.style.height = `${currentHeight}px`;
        }

        const newTotalPoints = Math.round(
          clamp(Math.pow(Math.random() * 8, 2), 16, currentWidth / 35)
        );

        setDist(clamp(currentWidth / 4, 150, 200));
        setRows([
          new Row(4 / 5, scale, newTotalPoints),
          new Row(3 / 5, scale, newTotalPoints),
          new Row(2 / 5, scale, newTotalPoints),
          new Row(1 / 5, scale, newTotalPoints),
        ]);
        setTotalPoints(newTotalPoints);

        if (canvas) {
          drawRows(canvas);
        }
      });
    }
  }, [
    drawRows,
    handleResizeInner,
    localWindow.innerHeight,
    localWindow.innerWidth,
    scale,
    totalPoints,
  ]);

  return <canvas ref={canvasRef} />;
});

export default React.memo(InteractiveCanvas);
