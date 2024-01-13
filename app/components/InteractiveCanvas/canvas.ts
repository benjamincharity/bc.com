import { Row } from '~/components/InteractiveCanvas/row';
import { MOUSE_OFF, shuffle } from '~/components/InteractiveCanvas/store';
import {
  Palette,
  PALETTES,
} from '~/components/InteractiveCanvas/palettes.data';

export class Canvas {
  canvas: HTMLCanvasElement;
  scale: number;
  rows: Row[];
  totalPoints: number;
  dist: number;
  mouse: { x: number; y: number } = { x: MOUSE_OFF, y: MOUSE_OFF };
  palette: Palette;
  shuffled: Palette[];

  constructor(
    canvas: HTMLCanvasElement,
    scale: number,
    rows: Row[],
    totalPoints: number,
    dist: number,
  ) {
    this.canvas = canvas;
    this.scale = scale;
    this.rows = rows;
    this.totalPoints = totalPoints;
    this.dist = dist;
    this.shuffled = shuffle([...PALETTES]);
    this.palette = this.shuffled[0];
  }

  updateCanvasSizeAndRows() {
    this.canvas.width = window.innerWidth * this.scale;
    this.canvas.height = window.innerHeight * this.scale;
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

  wobbleRows(goToNextPalette = true) {
    for (let i = this.rows.length; i--; ) {
      this.rows[i].wobble(this.dist, this.totalPoints);
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
  }

  nextPalette() {
    const currentIndex = this.shuffled.indexOf(this.palette);
    const nextIndex = (currentIndex + 1) % this.shuffled.length;
    this.setPalette(this.shuffled[nextIndex]);
  }

  previousPalette() {
    const currentIndex = this.shuffled.indexOf(this.palette);
    const prevIndex =
      (currentIndex - 1 + this.shuffled.length) % this.shuffled.length;
    this.setPalette(this.shuffled[prevIndex]);
  }
}
