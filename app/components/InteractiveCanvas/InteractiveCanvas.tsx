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

// function isMouseEvent(event: MouseEvent | TouchEvent): event is MouseEvent {
//   return event instanceof MouseEvent;
// }

// export enum ArrowDirection {
//   ARROW_LEFT = 'ArrowLeft',
//   ARROW_RIGHT = 'ArrowRight',
// }

const RANDOM_SEED = Math.random() * 8;

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
  console.log('event: ', nativeEvent);
  if (
    typeof TouchEvent !== 'undefined' &&
    nativeEvent instanceof TouchEvent &&
    nativeEvent.targetTouches?.length > 0
  ) {
    x = nativeEvent.targetTouches[0].x;
    y = nativeEvent.targetTouches[0].y;
  } else if (nativeEvent instanceof MouseEvent) {
    x = nativeEvent.x;
    y = nativeEvent.y;
  } else {
    console.log('NOT MOUSE OR TOUCH');
    return; // Neither touch nor mouse event, exit the function
  }
  return { x, y };
}

function updateCanvasSizeAndRows({
  canvas,
  width,
  height,
  scale,
  rows,
  totalPoints,
}: {
  canvas: HTMLCanvasElement;
  width: number;
  height: number;
  scale: number;
  rows: Row[];
  totalPoints: number;
}) {
  canvas.width = width * scale;
  canvas.height = height * scale;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;

  console.log('updateCanvasSizeAndRows totalPoints: ', totalPoints);
  for (let i = rows.length; i--; ) {
    rows[i].resize(totalPoints);
  }
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
  console.log('totalPoints: ', totalPoints);
  const [dist, setDist] = useState(0);
  const mouse = observable({ x: 0, y: 0 });
  // const x = useRef(0);
  // const y = useRef(0);
  const rows = useMemo(() => {
    return [4 / 5, 3 / 5, 2 / 5, 1 / 5].map((fraction, i) => {
      const row: Row = new Row(fraction, scale, totalPoints);
      row.color = palette[palette.length - i - 1];
      return row;
    });
  }, [scale, palette, totalPoints]);

  const drawRows = useCallback(
    (
      canvasRef: React.RefObject<HTMLCanvasElement>,
      dist: number,
      rows: Row[],
      totalPoints: number,
      x: number,
      y: number,
    ) => {
      const canvas = canvasRef.current!;
      const context = canvas.getContext('2d');
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
      for (let i = rows.length; i--; ) {
        rows[i].draw(canvas, dist, x, y, totalPoints);
      }
    },
    [],
  );

  const renderCanvas = useCallback(() => {
    console.log('____________renderCanvas____________', !!canvasRef.current);
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      canvas.style.backgroundColor = palette[0];

      const newTotalPoints = Math.round(
        clamp(Math.pow(RANDOM_SEED, 2), 16, localWindow.innerWidth / 35),
      );

      updateCanvasSizeAndRows({
        canvas,
        width: localWindow.innerWidth,
        height: localWindow.innerHeight,
        scale,
        rows,
        totalPoints: newTotalPoints,
      });

      drawRows(
        canvasRef,
        dist,
        rows,
        newTotalPoints,
        mouse.x.get(),
        mouse.y.get(),
      );
    }
  }, [
    dist,
    drawRows,
    localWindow.innerHeight,
    localWindow.innerWidth,
    palette,
    rows,
    scale,
  ]);

  const wobbleRows = useCallback(
    (goToNextPalette = true) => {
      for (let i = rows.length; i--; ) {
        rows[i].wobble(dist, totalPoints);
      }
      if (goToNextPalette) {
        setPalette((prev) => {
          const index = shuffled.indexOf(prev);
          const nextIndex = index + 1 === shuffled.length ? 0 : index + 1;
          const nextPalette = shuffled[nextIndex];
          paletteChange?.(nextPalette);
          return nextPalette;
        });
      }
    },
    [dist, paletteChange, rows, shuffled, totalPoints],
  );

  const debouncedRenderCanvas = useDebounce(renderCanvas, 300);

  const handleResize = useCallback(() => {
    debouncedRenderCanvas?.();
  }, [debouncedRenderCanvas]);

  const update = useCallback(() => {
    if (!isPaused) {
      requestAnimationFrame(update);
      if (canvasRef.current) {
        // console.log('calling draw in update: ', mouse.get());
        drawRows(
          canvasRef,
          dist,
          rows,
          totalPoints,
          mouse.x.get(),
          mouse.y.get(),
        );
      }
    }
  }, [dist, drawRows, isPaused, rows, totalPoints, mouse]);

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
      console.log('CALLING initial renderCanvas');
      debouncedRenderCanvas?.();
    }
    const handleWindowResize = () => {
      console.log('RESIZE');
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
          wobbleRows();
        }
      }}
      onMouseLeave={() => {
        mouse.set({ x: MOUSE_OFF, y: MOUSE_OFF });
      }}
      onMouseMove={(e) => {
        if (!isDisabled) {
          const result = determineMousePosition(e);
          if (result) {
            mouse.set({ ...result });
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
            mouse.set({ ...result });
          }
        }
      }}
      onTouchEnd={() => {
        if (!isDisabled) {
          wobbleRows();
        }
        mouse.set({ x: MOUSE_OFF, y: MOUSE_OFF });
      }}
    />
  );
});

InteractiveCanvas.displayName = 'InteractiveCanvas';

export default React.memo(InteractiveCanvas);
