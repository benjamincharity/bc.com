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
    // TODO: Not sure why this check is necessary
    if (!this.points.length) {
      return;
    }
    const context: CanvasRenderingContext2D | null = canvas.getContext("2d");
    if (!context) {
      return;
    }
    let point: Point = this.points[totalPoints - 1];
    // console.log("Row: totalPoints: ", totalPoints);
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
    // console.log("resize: ", totalPoints);
    this.points = new Array(totalPoints);
    // console.log("this.points after array: ", this.points);
    for (let i = 0; i < totalPoints; i++) {
      this.points[i] = new Point(i / (totalPoints - 3), this.y, this.scale);
    }
    // console.log("this.points after LOOP: ", this.points);
  }

  wobble(dist: number, totalPoints: number): void {
    for (let i = totalPoints - 1; i > 0; i--) {
      this.points[i].vy += (Math.random() - 0.5) * dist * 0.6;
    }
  }
}
