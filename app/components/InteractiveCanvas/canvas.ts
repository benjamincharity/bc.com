import { Row } from '~/components/InteractiveCanvas/row';
import {
  Palette,
  PALETTES,
} from '~/components/InteractiveCanvas/palettes.data';
import { shuffle } from '~/utils/shuffle';
import { createSVG } from '~/components/Squiggle';

export const PaletteDirection = {
  NEXT: 'next',
  PREV: 'prev',
} as const;

export type PaletteDirection =
  typeof PaletteDirection[keyof typeof PaletteDirection];

export const MOUSE_OFF = -1000;

export class Canvas {
  canvas: HTMLCanvasElement;
  rows: Row[];
  totalPoints: number;
  dist: number;
  mouse: { x: number; y: number } = { x: MOUSE_OFF, y: MOUSE_OFF };
  palette: Palette;
  shuffled: Palette[];

  constructor(
    canvas: HTMLCanvasElement,
    rows: Row[],
    totalPoints: number,
    dist: number,
  ) {
    this.canvas = canvas;
    this.rows = rows;
    this.totalPoints = totalPoints;
    this.dist = dist;
    this.shuffled = shuffle([...PALETTES]);
    this.palette = this.shuffled[0];
  }

  updateCanvasSizeAndRows() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.canvas.style.width = `${window.innerWidth}px`;
    this.canvas.style.height = `${window.innerHeight}px`;

    for (let i = this.rows.length; i--; ) {
      this.rows[i].resize(this.totalPoints);
    }
  }

  drawRows() {
    const context = this.canvas.getContext('2d');
    if (
      !this.totalPoints ||
      !context ||
      !this.canvas.offsetWidth ||
      !this.canvas.offsetHeight
    ) {
      return;
    }

    context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    for (let i = this.rows.length; i--; ) {
      this.rows[i].draw(this.canvas, this.dist, this.mouse.x, this.mouse.y);
    }
  }

  wobbleRows(paletteDirection?: PaletteDirection) {
    for (let i = this.rows.length; i--; ) {
      this.rows[i].wobble(this.dist, this.totalPoints);
    }
    if (paletteDirection === PaletteDirection.NEXT) {
      this.nextPalette();
    } else if (paletteDirection === PaletteDirection.PREV) {
      this.previousPalette();
    }
  }

  setMousePosition(x: number, y: number) {
    this.mouse.x = x;
    this.mouse.y = y;
  }

  setPalette(newPalette: Palette) {
    this.palette = newPalette;
    // Update the colors of the rows based on the new palette
    for (let i = this.rows.length; i--; ) {
      this.rows[i].color = this.palette[this.palette.length - i - 1];
    }
    this.setNewPaletteColors(newPalette);
  }

  nextPalette() {
    const currentIndex = this.shuffled.indexOf(this.palette);
    const nextIndex = (currentIndex + 1) % this.shuffled.length;
    this.setPalette(this.shuffled[nextIndex]);
    this.setNewPaletteColors(this.palette);
  }

  previousPalette() {
    const currentIndex = this.shuffled.indexOf(this.palette);
    const prevIndex =
      (currentIndex - 1 + this.shuffled.length) % this.shuffled.length;
    this.setPalette(this.shuffled[prevIndex]);
    this.setNewPaletteColors(this.palette);
  }

  setNewPaletteColors(palette: Palette): void {
    document.documentElement.style.setProperty(
      `--o-squiggle-link-backgroundImage`,
      `url(data:image/svg+xml;base64,${window.btoa(createSVG(palette[0]))})`,
    );

    for (let i = 0; i < palette.length; i += 1) {
      const cssVar = `--highlight-color-${i + 1}`;
      document.documentElement.style.setProperty(cssVar, `${palette[i]}`);
    }
  }
}
