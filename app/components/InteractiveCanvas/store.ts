import { observable, computed, ObservableComputed } from '@legendapp/state';
import type { Palette } from '~/components/InteractiveCanvas/palettes.data';
import { PALETTES } from '~/components/InteractiveCanvas/palettes.data';
import { Row } from '~/components/InteractiveCanvas/row';

export const MOUSE_OFF = -1000;

export function shuffle<T>(arr: T[]): T[] {
  return arr.sort(() => Math.random() - 0.5);
}

interface StateShape {
  canvasSize: { width: number; height: number };
  dist: number;
  mouse: { x: number; y: number };
  needsRedraw: boolean;
  nextPalette(): void;
  palette: Palette;
  palettes: Palette[];
  paused: boolean;
  previousPalette(): void;
  resetMouse(): void;
  rows: ObservableComputed<Row[]>;
  scale: number;
  totalPoints: number;
}

export const state$ = observable<StateShape>({
  canvasSize: { width: 0, height: 0 },
  dist: 0,
  palettes: shuffle([...PALETTES]),
  palette: PALETTES[0],
  mouse: { x: MOUSE_OFF, y: MOUSE_OFF },
  rows: computed(() => {
    const totalPoints = state$.totalPoints.get();
    const scale: number = state$.scale.get();
    const palette = state$.palette.get();
    return [4 / 5, 3 / 5, 2 / 5, 1 / 5].map((fraction, i) => {
      const row: Row = new Row(fraction, scale, totalPoints);
      row.color = palette[palette.length - i - 1];
      return row;
    });
  }),
  scale: 1,
  totalPoints: 0,
  paused: false,
  needsRedraw: false,

  resetMouse() {
    this.mouse = { x: MOUSE_OFF, y: MOUSE_OFF };
  },

  nextPalette() {
    const currentIndex = this.palettes.findIndex(
      (palette) => palette === this.palette,
    );
    const nextIndex = (currentIndex + 1) % this.palettes.length;
    this.palette = this.palettes[nextIndex];
  },

  previousPalette() {
    const currentIndex = this.palettes.findIndex(
      (palette) => palette === this.palette,
    );
    const previousIndex =
      (currentIndex - 1 + this.palettes.length) % this.palettes.length;
    this.palette = this.palettes[previousIndex];
  },
} as StateShape);
