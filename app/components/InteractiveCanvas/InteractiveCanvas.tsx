import React, {
  useRef,
  useEffect,
  useCallback,
  useMemo,
  useState,
} from 'react';
import { Palette, PALETTES } from './palettes.data';
import { MOUSE_OFF, shuffle } from '~/components/InteractiveCanvas/store';
import { useDebounce } from '@uidotdev/usehooks';
import { Row } from '~/components/InteractiveCanvas/row';
import { observable } from '@legendapp/state';
import { Canvas } from '~/components/InteractiveCanvas/canvas';

// function isMouseEvent(event: MouseEvent | TouchEvent): event is MouseEvent {
//   return event instanceof MouseEvent;
// }

// export enum ArrowDirection {
//   ARROW_LEFT = 'ArrowLeft',
//   ARROW_RIGHT = 'ArrowRight',
// }

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

function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(n, max));
}

function determineMousePosition(
  event: React.MouseEvent | React.TouchEvent,
): { x: number; y: number } | undefined {
  let x, y;
  const nativeEvent = event.nativeEvent;
  if (
    typeof TouchEvent !== 'undefined' &&
    nativeEvent instanceof TouchEvent &&
    nativeEvent.targetTouches?.length > 0
  ) {
    x = nativeEvent.targetTouches[0].pageX;
    y = nativeEvent.targetTouches[0].pageY;
  } else if (nativeEvent instanceof MouseEvent) {
    x = nativeEvent.x;
    y = nativeEvent.y;
  } else {
    return; // Neither touch nor mouse event, exit the function
  }
  return { x, y };
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

//
// point.ts is identical
// once row.ts was identical again we are much closer.
// seems mouse position is off now?
//
//
const InteractiveCanvas = React.forwardRef<
  InteractiveCanvasRefType,
  InteractiveCanvasProps
>((props, ref) => {
  const { isDisabled = false, paletteChange } = props;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const localWindow = typeof window !== 'undefined' ? window : dummyWindow;
  const [isPaused, setIsPaused] = useState(false);
  const shuffled = shuffle([...PALETTES]);
  const [palette, setPalette] = useState<Palette>(shuffled[0]);
  const [scale, setScale] = useState(1);
  const [totalPoints, setTotalPoints] = useState(0);
  const [dist, setDist] = useState(0);
  const rows = useMemo(() => {
    return [4 / 5, 3 / 5, 2 / 5, 1 / 5].map((fraction, i) => {
      const row: Row = new Row(fraction, scale, totalPoints);
      row.color = palette[palette.length - i - 1];
      return row;
    });
  }, [scale, palette, totalPoints]);

  const [canvasInstance, setCanvasInstance] = useState<Canvas | null>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const instance = new Canvas(
        canvasRef.current,
        scale,
        rows,
        totalPoints,
        dist,
      );
      setCanvasInstance(instance);
    }
  }, [canvasRef, scale, rows, totalPoints, dist]);

  const renderCanvas = useCallback(() => {
    if (canvasInstance) {
      canvasInstance.updateCanvasSizeAndRows();
      canvasInstance.drawRows();
    }
  }, [canvasInstance]);

  const debouncedRenderCanvas = useDebounce(renderCanvas, 300);

  const handleResize = useCallback(() => {
    debouncedRenderCanvas?.();
  }, [debouncedRenderCanvas]);

  const update = useCallback(() => {
    if (!isPaused) {
      requestAnimationFrame(update);
      if (canvasInstance) {
        canvasInstance.drawRows();
      }
    }
  }, [isPaused, canvasInstance]);

  useEffect(() => {
    update();
  }, [update]);

  // INITIAL LOAD:
  useEffect(() => {
    const newTotalPoints = Math.round(
      clamp(Math.pow(Math.random() * 8, 2), 16, localWindow.innerWidth / 35),
    );
    setTotalPoints(newTotalPoints);
    setDist(clamp(localWindow.innerWidth / 4, 150, 200));
    setScale(localWindow.devicePixelRatio);

    if (canvasRef.current) {
      debouncedRenderCanvas?.();
    }
    const handleWindowResize = () => {
      handleResize();
    };

    localWindow.addEventListener('resize', handleWindowResize);
    handleResize(); // Call it once initially

    return () => {
      localWindow.removeEventListener('resize', handleWindowResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <canvas
      className={'bc-canvas'}
      ref={canvasRef}
      onMouseDown={() => {
        if (!isDisabled) {
          canvasInstance?.wobbleRows();
        }
      }}
      onMouseLeave={() => {
        canvasInstance?.setMousePosition(MOUSE_OFF, MOUSE_OFF);
      }}
      onMouseMove={(e) => {
        if (!isDisabled) {
          const result = determineMousePosition(e);
          if (result) {
            canvasInstance?.setMousePosition(result.x, result.y);
          }
        }
      }}
      onTouchStart={(e) => {
        !isDisabled && e.preventDefault();
      }}
      onTouchMove={(e) => {
        if (!isDisabled) {
          const result = determineMousePosition(e);
          if (result) {
            canvasInstance?.setMousePosition(result.x, result.y);
          }
        }
      }}
      onTouchEnd={() => {
        if (!isDisabled) {
          canvasInstance?.wobbleRows();
        }
        canvasInstance?.setMousePosition(MOUSE_OFF, MOUSE_OFF);
      }}
    />
  );
});

InteractiveCanvas.displayName = 'InteractiveCanvas';

export default React.memo(InteractiveCanvas);
