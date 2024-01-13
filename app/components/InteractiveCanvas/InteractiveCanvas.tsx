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
import { Canvas, MOUSE_OFF } from '~/components/InteractiveCanvas/canvas';
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
          canvasInstance?.wobbleRows(true);
        }
      }}
      onMouseLeave={() => {
        canvasInstance?.setMousePosition(MOUSE_OFF, MOUSE_OFF);
      }}
      onMouseMove={(e) => {
        if (!isDisabled && canvasRef.current) {
          const result = determineMousePosition(e, canvasRef.current);
          if (result) {
            canvasInstance?.setMousePosition(result.x, result.y);
          }
        }
      }}
      onTouchMove={(e) => {
        if (!isDisabled && canvasRef.current) {
          const result = determineMousePosition(e, canvasRef.current);
          if (result) {
            canvasInstance?.setMousePosition(result.x, result.y);
          }
        }
      }}
      onTouchStart={(e) => {
        !isDisabled && e.preventDefault();
      }}
      onTouchEnd={() => {
        if (!isDisabled) {
          canvasInstance?.wobbleRows(true);
        }
        canvasInstance?.setMousePosition(MOUSE_OFF, MOUSE_OFF);
      }}
    />
  );
});

InteractiveCanvas.displayName = 'InteractiveCanvas';

export default React.memo(InteractiveCanvas);
