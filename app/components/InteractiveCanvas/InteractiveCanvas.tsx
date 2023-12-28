import React, {
  useRef,
  useEffect,
  useCallback,
  useImperativeHandle,
} from 'react';
import { Palette, PALETTES } from './palettes.data';
import { shuffle, state$ } from '~/components/InteractiveCanvas/store';
import { useDebounce } from '@uidotdev/usehooks';

function isMouseEvent(event: MouseEvent | TouchEvent): event is MouseEvent {
  return event instanceof MouseEvent;
}

export enum ArrowDirection {
  ARROW_LEFT = 'ArrowLeft',
  ARROW_RIGHT = 'ArrowRight',
}

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

function handleMove(event: React.MouseEvent | React.TouchEvent) {
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
    x = nativeEvent.pageX;
    y = nativeEvent.pageY;
  } else {
    console.log('NOT MOUSE OR TOUCH');
    return; // Neither touch nor mouse event, exit the function
  }
  state$.mouse.set({ x, y });
}

function drawRows(canvasRef: React.RefObject<HTMLCanvasElement>) {
  const canvas = canvasRef.current!;
  const context = canvas.getContext('2d');
  const totalPoints = state$.totalPoints.get();
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
  const rows = state$.rows.get();
  const dist = state$.dist.get();
  const x = state$.mouse.x.get();
  const y = state$.mouse.y.get();
  for (let i = rows.length; i--; ) {
    rows[i].draw(canvas, dist, x, y, totalPoints);
  }
  state$.needsRedraw.set(false);
}

function updateCanvasSize({
  canvas,
  width,
  height,
}: {
  canvas: HTMLCanvasElement;
  width: number;
  height: number;
}) {
  const scale = state$.scale.get();
  const rows = state$.rows.get();
  canvas.width = width * scale;
  canvas.height = height * scale;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  state$.totalPoints.set(
    Math.round(clamp(Math.pow(Math.random() * 8, 2), 16, width / 35)),
  );
  state$.dist.set(clamp(width / 4, 150, 200));
  const totalPoints = state$.totalPoints.get();

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

const InteractiveCanvas = React.forwardRef<
  InteractiveCanvasRefType,
  InteractiveCanvasProps
>((props, ref) => {
  const { isDisabled = false, paletteChange } = props;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const localWindow = typeof window !== 'undefined' ? window : dummyWindow;
  const isPaused = state$.isPaused.get();

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

  // const update = useCallback(() => {
  //   // state$.needsRedraw.set(true);
  //   // if (!isPaused) {
  //   //   requestAnimationFrame(update);
  //   //   if (canvasRef.current) {
  //   //     console.log("update func: calling drawRows");
  //   //     drawRows();
  //   //   }
  //   // }
  // }, []);

  const renderCanvas = useCallback(() => {
    console.log('____________renderCanvas____________', !!canvasRef.current);
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const palette = state$.palette.get();
      canvas.style.backgroundColor = palette[0];

      // start resizeRows
      updateCanvasSize({
        canvas,
        width: localWindow.innerWidth,
        height: localWindow.innerHeight,
      });
      drawRows(canvasRef);
      // end resizeRows

      // update();
    }
  }, [localWindow.innerHeight, localWindow.innerWidth]);

  const wobbleRows = useCallback(
    (goToNextPalette = true) => {
      const dist = state$.dist.get();
      const totalPoints = state$.totalPoints.get();
      const rows = state$.rows.get();
      const canvas = canvasRef.current!;
      updateCanvasSize({
        canvas,
        width: localWindow.innerWidth,
        height: localWindow.innerHeight,
      });
      for (let i = rows.length; i--; ) {
        rows[i].wobble(dist, totalPoints);
      }
      if (goToNextPalette) {
        state$.nextPalette();
      }
    },
    [localWindow.innerHeight, localWindow.innerWidth],
  );

  const debouncedRenderCanvas = useDebounce(renderCanvas, 300);

  const handleResize = useCallback(() => {
    debouncedRenderCanvas?.();
  }, [debouncedRenderCanvas]);

  const update = useCallback(() => {
    if (!isPaused) {
      requestAnimationFrame(update);
      if (canvasRef.current) {
        drawRows(canvasRef);
      }
    }
  }, [isPaused]);

  useEffect(() => {
    update();
  }, [update]);

  // INITIAL LOAD:
  useEffect(() => {
    state$.scale.set(localWindow.devicePixelRatio);
    const shuffled = shuffle([...PALETTES]);
    state$.palettes.set(shuffled);
    state$.palette.set(shuffled[0]);
    state$.canvasSize.set({
      width: localWindow.innerWidth,
      height: localWindow.innerHeight,
    });

    if (canvasRef.current) {
      console.log('CALLING initial renderCanvas');
      // initialize();
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
          wobbleRows();
        }
      }}
      onMouseLeave={() => {
        state$.resetMouse();
      }}
      onMouseMove={(e) => {
        if (!isDisabled) {
          handleMove(e);
        }
      }}
      onTouchStart={(e) => {
        !isDisabled && e.preventDefault();
      }}
      onTouchMove={(e) => {
        if (!isDisabled) {
          handleMove(e);
        }
      }}
      onTouchEnd={() => {
        if (!isDisabled) {
          wobbleRows();
        }
        state$.resetMouse();
      }}
    />
  );
});

export default React.memo(InteractiveCanvas);
