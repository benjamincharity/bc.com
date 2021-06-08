/**
 * Individual points on the canvas
 */
export class Point {
  scale: number;
  x: number;
  y: number;
  ix: number;
  iy: number;
  vx: number;
  vy: number;

  constructor(x: number, y: number, scale: number) {
    this.scale = scale;
    this.x = x;
    this.y = y;
    this.ix = x;
    this.iy = y;
    this.vx = 0;
    this.vy = 0;
  }

  move(
    canvas: HTMLCanvasElement,
    dist: number,
    mouseX: number,
    mouseY: number
  ): void {
    const damping = 0.1;
    const viscosity = 15;
    const width = canvas.width / this.scale;
    const height = canvas.height / this.scale;
    this.vx += ((this.ix - this.x) / viscosity) * width;
    this.vy += ((this.iy - this.y) / viscosity) * height;

    const dx = this.x * width - mouseX / this.scale;
    const dy = this.y * height - mouseY / this.scale;

    if (Math.sqrt(dx * dx + dy * dy) < dist) {
      const a = Math.atan2(dy, dx);
      this.vx += (Math.cos(a) * viscosity - dx) / viscosity;
      this.vy -= (Math.sin(a) * viscosity - dy) / viscosity;
    }

    this.vx *= 1 - damping;
    this.vy *= 1 - damping;
    this.x += this.vx / width;
    this.y += this.vy / height;

    if (this.y < 0) {
      this.y = 0;
    } else if (this.y > 1) {
      this.y = 1;
    }
  }
}
