import { Point } from "./point";

/**
 * An individual, horizontal strip of the canvas
 */
export class Row {
  color: string | undefined;
  points: Point[] = [];
  scale: number;
  // The y-axis of the row
  y: number;

  constructor(y: number, scale: number, totalPoints: number) {
    this.y = y;
    this.scale = scale;
    this.points = [];
    this.resize(totalPoints);
  }

  draw(
    canvas: HTMLCanvasElement,
    dist: number,
    mouseX: number,
    mouseY: number,
    totalPoints: number
  ): void {
    if (!this.points.length) {
      return;
    }
    const context: CanvasRenderingContext2D | null = canvas.getContext("2d");
    if (!context) {
      return;
    }
    let point: Point = this.points[totalPoints - 1];
    // TODO: color not present here:
    // console.log("ROW: this.color: ", this.color);
    if (this.color) {
      context.fillStyle = this.color;
    }
    context.beginPath();
    context.moveTo(point.x * canvas.width, point.y * canvas.height);

    for (let i = totalPoints - 1; i > 0; i--) {
      point = this.points[i];
      point.move(canvas, dist, mouseX, mouseY);
      let cx = ((point.x + this.points[i - 1].x) / 2) * canvas.width;
      const cy = ((point.y + this.points[i - 1].y) / 2) * canvas.height;

      if (i === 1) {
        cx = canvas.width;
      } else if (i === totalPoints - 1) {
        context.bezierCurveTo(
          point.x * canvas.width,
          point.y * canvas.height,
          cx,
          cy,
          cx,
          cy
        );
        point.x = 0;
      }

      context.bezierCurveTo(
        point.x * canvas.width,
        point.y * canvas.height,
        cx,
        cy,
        cx,
        cy
      );
    }

    context.lineTo(canvas.width, canvas.height);
    context.lineTo(0, canvas.height);
    context.closePath();
    context.fill();
  }

  resize(totalPoints: number): void {
    this.points = new Array(totalPoints);
    for (let i = 0; i < totalPoints; i++) {
      this.points[i] = new Point(i / (totalPoints - 3), this.y, this.scale);
    }
  }

  wobble(dist: number, totalPoints: number): void {
    for (let i = totalPoints - 1; i > 0; i--) {
      this.points[i].vy += (Math.random() - 0.5) * dist * 0.6;
    }
  }
}
