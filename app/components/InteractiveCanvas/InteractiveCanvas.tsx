import React, {
  useRef,
  useEffect,
  useCallback,
  useMemo,
  useState,
} from 'react';
import { Palette, PALETTES } from './palettes.data';
import { useDebounce } from '@uidotdev/usehooks';
import { Row } from '~/components/InteractiveCanvas/row';
import {
  Canvas,
  MOUSE_OFF,
  PaletteDirection,
} from '~/components/InteractiveCanvas/canvas';
import { shuffle } from '~/utils/shuffle';

// Define a dummy window object for SSR
const dummyWindow = {
  addEventListener: (
    event: string,
    listener: EventListenerOrEventListenerObject,
  ) => {},
  removeEventListener: (
    event: string,
    listener: EventListenerOrEventListenerObject,
  ) => {},
  innerWidth: 1024,
  innerHeight: 768,
  devicePixelRatio: 1,
};

function handleEvent(
  e: React.MouseEvent | React.TouchEvent,
  canvas: HTMLCanvasElement | null,
  canvasInstance: Canvas | null,
  isDisabled: boolean,
) {
  if (!isDisabled && canvas) {
    const result = determineMousePosition(e, canvas);
    if (result) {
      canvasInstance?.setMousePosition(result.x, result.y);
    }
  }
}

function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(n, max));
}

function determineMousePosition(
  event: React.MouseEvent | React.TouchEvent,
  canvas: HTMLCanvasElement,
): { x: number; y: number } | undefined {
  let x, y;
  const nativeEvent = event.nativeEvent;
  const rect = canvas.getBoundingClientRect();
  if (
    typeof TouchEvent !== 'undefined' &&
    nativeEvent instanceof TouchEvent &&
    nativeEvent.targetTouches?.length > 0
  ) {
    x = nativeEvent.targetTouches[0].clientX - rect.left;
    y = nativeEvent.targetTouches[0].clientY - rect.top;
  } else if (nativeEvent instanceof MouseEvent) {
    x = nativeEvent.clientX - rect.left;
    y = nativeEvent.clientY - rect.top;
  } else {
    return; // Neither touch nor mouse event, exit the function
  }
  return { x, y };
}

export interface InteractiveCanvasProps {
  forwardedRef?: React.Ref<InteractiveCanvasRefType>;
  shouldShow?: boolean;
  isDisabled?: boolean;
  paletteChange?: (palette: Palette) => void;
}

export interface InteractiveCanvasRefType {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  resetMousePositions: () => void;
  togglePause: () => void;
  wobbleRows: (goToNextPalette?: boolean) => void;
}

export const InteractiveCanvas = React.memo((props: InteractiveCanvasProps) => {
  const { isDisabled = false, paletteChange, shouldShow = true } = props;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const localWindow = typeof window !== 'undefined' ? window : dummyWindow;
  const [isPaused, setIsPaused] = useState(false);
  const shuffled = shuffle([...PALETTES]);
  const [palette, setPalette] = useState<Palette>(shuffled[0]);
  const [totalPoints, setTotalPoints] = useState(0);
  const [dist, setDist] = useState(0);
  const rows = useMemo(() => {
    return [4 / 5, 3 / 5, 2 / 5, 1 / 5].map((fraction, i) => {
      const row: Row = new Row(fraction, totalPoints);
      row.color = palette[palette.length - i - 1];
      return row;
    });
  }, [palette, totalPoints]);

  const [canvasInstance, setCanvasInstance] = useState<Canvas | null>(null);

  useEffect(() => {
    function animate(canvasInstance: Canvas | null, isPaused: boolean) {
      if (!isPaused && canvasInstance) {
        requestAnimationFrame(() => animate(canvasInstance, isPaused));
        canvasInstance.drawRows();
      }
    }

    animate(canvasInstance, isPaused);
  }, [canvasInstance, isPaused]);

  useEffect(() => {
    if (canvasRef.current) {
      const instance = new Canvas(canvasRef.current, rows, totalPoints, dist);
      setCanvasInstance(instance);
    }
  }, [canvasRef, rows, totalPoints, dist]);

  const renderCanvas = useCallback(() => {
    if (canvasInstance) {
      canvasInstance.updateCanvasSizeAndRows();
      canvasInstance.drawRows();
    }
  }, [canvasInstance]);

  const debouncedRenderCanvas = useDebounce(renderCanvas, 300);
  let touchStartX: number | null = null;

  const handleTouchStart = (event: React.TouchEvent) => {
    touchStartX = event.touches[0].clientX;
  };

  const handleTouchEnd = (event: React.TouchEvent) => {
    if (touchStartX !== null) {
      const touchEndX = event.changedTouches[0].clientX;
      if (touchEndX < touchStartX) {
        canvasInstance?.wobbleRows(PaletteDirection.NEXT);
      } else if (touchEndX > touchStartX) {
        canvasInstance?.wobbleRows(PaletteDirection.PREV);
      }
    }
  };

  // INITIAL LOAD:
  useEffect(() => {
    const handleResizeInner = () => {
      if (canvasInstance) {
        canvasInstance.updateCanvasSizeAndRows();
        canvasInstance.drawRows();
      }
    };
    const handleKeyDown = (event: Event) => {
      const keyboardEvent = event as KeyboardEvent;
      if (keyboardEvent.key === 'ArrowRight') {
        canvasInstance?.wobbleRows(PaletteDirection.NEXT);
      } else if (keyboardEvent.key === 'ArrowLeft') {
        canvasInstance?.wobbleRows(PaletteDirection.PREV);
      }
    };
    const newTotalPoints = Math.round(
      clamp(Math.pow(Math.random() * 8, 2), 16, localWindow.innerWidth / 35),
    );
    setTotalPoints(newTotalPoints);
    setDist(clamp(localWindow.innerWidth / 4, 150, 200));

    if (canvasRef.current) {
      debouncedRenderCanvas?.();
    }
    const handleWindowResize = () => {
      handleResizeInner();
    };

    localWindow.addEventListener('resize', handleWindowResize);
    localWindow.addEventListener('keydown', handleKeyDown);
    handleResizeInner();

    return () => {
      localWindow.removeEventListener('resize', handleWindowResize);
      localWindow.removeEventListener('keydown', handleKeyDown);
    };
  }, [canvasInstance, debouncedRenderCanvas, localWindow]);

  return (
    <canvas
      className={'bc-canvas'}
      ref={canvasRef}
      onMouseDown={() => {
        if (!isDisabled) {
          canvasInstance?.wobbleRows(PaletteDirection.NEXT);
        }
      }}
      onMouseLeave={() => {
        canvasInstance?.setMousePosition(MOUSE_OFF, MOUSE_OFF);
      }}
      onMouseMove={(e) =>
        handleEvent(e, canvasRef.current, canvasInstance, isDisabled)
      }
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchMove={(e) =>
        handleEvent(e, canvasRef.current, canvasInstance, isDisabled)
      }
    />
  );
});

InteractiveCanvas.displayName = 'InteractiveCanvas';
