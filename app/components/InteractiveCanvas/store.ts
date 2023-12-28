import { observable } from "@legendapp/state";
import type { Palette } from "~/components/InteractiveCanvas/palettes.data";
import { PALETTES } from "~/components/InteractiveCanvas/palettes.data";
import type { Row } from "~/components/InteractiveCanvas/row";

export const MOUSE_OFF = -1000;

function shuffle<T>(arr: T[]): T[] {
  return arr.sort(() => Math.random() - 0.5);
}

interface StateShape {
  dist: number;
  mouse: { x: number; y: number };
  needsRedraw: boolean;
  nextPalette(): void;
  palette: Palette;
  palettes: Palette[];
  paused: boolean;
  previousPalette(): void;
  rows: Row[];
  scale: number;
  totalPoints: number;
}

export const state$ = observable<StateShape>({
  dist: 0,
  palettes: shuffle([...PALETTES]),
  palette: PALETTES[0],
  mouse: { x: MOUSE_OFF, y: MOUSE_OFF },
  rows: [],
  scale: 1,
  totalPoints: 0,
  paused: false,
  needsRedraw: false,

  nextPalette() {
    const currentIndex = this.palettes.findIndex(
      (palette) => palette === this.palette
    );
    const nextIndex = (currentIndex + 1) % this.palettes.length;
    this.palette = this.palettes[nextIndex];
  },

  previousPalette() {
    const currentIndex = this.palettes.findIndex(
      (palette) => palette === this.palette
    );
    const previousIndex =
      (currentIndex - 1 + this.palettes.length) % this.palettes.length;
    this.palette = this.palettes[previousIndex];
  },
});
