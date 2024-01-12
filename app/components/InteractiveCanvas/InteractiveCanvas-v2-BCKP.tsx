import React, {
  useRef,
  useEffect,
  useCallback,
  useState,
  useImperativeHandle,
} from 'react';
import { Palette, PALETTES } from './palettes.data';
import { shuffle, state$ } from '~/components/InteractiveCanvas/store';
import { useDebounce } from '@uidotdev/usehooks';
import { useObservable } from '@legendapp/state/react';

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

function determineNewXY(
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
    x = nativeEvent.pageX;
    y = nativeEvent.pageY;
  } else {
    console.log('NOT MOUSE OR TOUCH');
    return;
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
  isPaused: boolean;
  wobbleRows: (goToNextPalette?: boolean) => void;
}

const InteractiveCanvas = React.forwardRef<
  InteractiveCanvasRefType,
  InteractiveCanvasProps
>((props, ref) => {
  const { isDisabled = false, paletteChange } = props;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const localWindow = typeof window !== 'undefined' ? window : dummyWindow;
  const animationFrameId = useRef<number | null>(null);
  const { width, height } = state$.canvasSize.get();
  const [needsRedraw, setNeedsRedraw] = useState(false);
  console.log('needsRedraw: ', needsRedraw);

  const updateCanvasSize = useCallback(
    ({ canvas }: { canvas: HTMLCanvasElement }) => {
      console.log('1111. updateCanvasSize');
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
    },
    [width, height],
  );

  useImperativeHandle(ref, () => ({
    canvasRef,
    wobbleRows: (goToNextPalette = true) => {
      // const canvas = canvasRef.current;
      // if (canvas) {
      //   const currentHeight = localWindow.innerHeight;
      //   const currentWidth = localWindow.innerWidth;
      //   canvas.width = currentWidth * scale;
      //   canvas.height = currentHeight * scale;
      //   canvas.style.width = `${currentWidth}px`;
      //   canvas.style.height = `${currentHeight}px`;
      // }
      // const updatedRows = [...rows];
      // for (let i = updatedRows.length; i--; ) {
      //   updatedRows[i].wobble(dist, totalPoints);
      // }
      // setRows(updatedRows);
      // if (goToNextPalette) {
      //   nextPalette();
      // }
    },
    resetMousePositions: () => {
      // setMouseX(mouseOff);
      // setMouseY(mouseOff);
    },
    isPaused: state$.isPaused.get(),
    togglePause: () => {
      // setIsPaused(!isPaused);
      // if (!isPaused) {
      //   update();
      // }
    },
  }));

  // const update = useCallback(() => {
  //   // state$.needsRedraw.set(true);
  //   // if (!isPaused) {
  //   //   requestAnimationFrame(update);
  //   //   if (canvasRef.current) {
  //   //     console.log("update func: calling drawCanvas");
  //   //     drawCanvas();
  //   //   }
  //   // }
  // }, []);

  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current!;
    const context = canvas.getContext('2d');
    const totalPoints = state$.totalPoints.get();
    const x = state$.mouse.x.get();
    const y = state$.mouse.y.get();
    const rows = state$.rows.get();
    const dist = state$.dist.get();
    console.log('drawCanvas: ', x, y);
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
    setNeedsRedraw(false);
  }, []);

  const renderCanvas = useCallback(() => {
    console.log('____________renderCanvas____________', !!canvasRef.current);
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const palette = state$.palette.get();
      canvas.style.backgroundColor = palette[0];

      updateCanvasSize({
        canvas,
      });
      drawCanvas();
    }
  }, [drawCanvas, updateCanvasSize]);

  const wobbleRows = useCallback(
    (goToNextPalette = true) => {
      const rows = state$.rows.get();
      const dist = state$.dist.get();
      const totalPoints = state$.totalPoints.get();
      const canvas = canvasRef.current!;
      updateCanvasSize({
        canvas,
      });
      for (let i = rows.length; i--; ) {
        rows[i].wobble(dist, totalPoints);
      }
      if (goToNextPalette) {
        state$.nextPalette();
      }
    },
    [updateCanvasSize],
  );

  const debouncedRenderCanvas = useDebounce(renderCanvas, 300);

  const handleResize = useCallback(() => {
    debouncedRenderCanvas?.();
  }, [debouncedRenderCanvas]);

  const animate = useCallback(() => {
    if (needsRedraw) {
      console.log('animate needsRedraw calling: drawCanvas');
      drawCanvas();
      animationFrameId.current = requestAnimationFrame(animate);
    }
  }, [drawCanvas, needsRedraw]);

  useEffect(() => {
    if (needsRedraw && animationFrameId.current === null) {
      animate();
    }
  }, [animate, needsRedraw]);

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
    renderCanvas();

    return () => {
      localWindow.removeEventListener('resize', handleWindowResize);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <canvas
      className={'bc-canvas'}
      ref={canvasRef}
      onMouseMove={(e) => {
        if (!isDisabled) {
          const result = determineNewXY(e);
          if (result) {
            const { x, y } = result;
            state$.mouse.set({ x, y });
            setNeedsRedraw(true);
          }
        }
      }}
      onMouseDown={() => {
        if (!isDisabled) {
          wobbleRows(true);
          setNeedsRedraw(true);
        }
      }}
      onMouseLeave={() => {
        state$.resetMouse();
      }}
      // onTouchStart={(e) => {
      //   !isDisabled && e.preventDefault();
      // }}
      // onTouchMove={(e) => {
      //   if (!isDisabled) {
      //     handleMove(e);
      //   }
      // }}
      // onTouchEnd={() => {
      //   if (!isDisabled) {
      //     wobbleRows();
      //   }
      //   state$.resetMouse();
      // }}
    />
  );
});

InteractiveCanvas.displayName = 'InteractiveCanvas';
export default React.memo(InteractiveCanvas);
