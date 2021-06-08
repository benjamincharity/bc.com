import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  Inject,
  Input,
  NgZone,
  OnDestroy,
  Output,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { ANIMATION_FRAME, WINDOW } from '@ng-web-apis/common';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import {
  BehaviorSubject,
  combineLatest,
  fromEvent,
  Observable,
  Subject,
} from 'rxjs';
import { distinctUntilChanged, skip, takeUntil } from 'rxjs/operators';

import { Palette } from './palettes.data';
import { Row } from './row';

export enum ArrowDirection {
  ARROW_LEFT = 'ArrowLeft',
  ARROW_RIGHT = 'ArrowRight',
}

/**
 * Shuffle an array
 *
 * @param arr - The array of items to shuffle
 * @returns The shuffled array
 */
export function shuffle<T = unknown>(arr: T[]): T[] {
  return arr.sort(() => Math.random() - 0.5);
}

/**
 * Clamp a number
 *
 * @param n - The number to clamp
 * @param min - The bottom of the clamp range
 * @param max - The top of the clamp range
 * @returns The clamped number
 */
export function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(n, max));
}

@UntilDestroy()
@Component({
  selector: 'bc-canvas',
  template: `<canvas #canvasRef></canvas>`,
  styleUrls: ['./canvas.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  exportAs: 'bcCanvas',
})
export class CanvasComponent implements AfterViewInit, OnDestroy {
  private context: CanvasRenderingContext2D | null = null;
  private currentPalettes$ = new BehaviorSubject<ReadonlyArray<Palette>>([]);
  private destroy$ = new Subject();
  private dist = 0;
  private mouseOff = -1000;
  private mouseX = this.mouseOff;
  private mouseY = this.mouseOff;
  private paletteNumber$ = new BehaviorSubject<number>(-1);
  private rows: Row[] = [];
  private scale: number = this.windowRef.devicePixelRatio || 1;
  private totalPoints = 0;
  private windowResizeEvent$ = fromEvent(this.windowRef, 'resize').pipe(
    distinctUntilChanged(),
    untilDestroyed(this),
  );
  isPaused = false;

  @HostBinding('class.bc-canvas') baseClass = true;
  @ViewChild('canvasRef') canvasRef!: ElementRef<HTMLCanvasElement>;

  get canvas(): HTMLCanvasElement {
    return this.canvasRef.nativeElement;
  }

  @Input() palettes: ReadonlyArray<Palette> = [];
  @Input() isDisabled = false;

  @Output() readonly paletteChange = new EventEmitter<Palette>();

  constructor(
    @Inject(WINDOW) readonly windowRef: Window,
    @Inject(ANIMATION_FRAME)
    private readonly animationFrame$: Observable<number>,
    private ngZone: NgZone,
  ) {}

  ngAfterViewInit(): void {
    if (this.canvas) {
      this.initialize(this.canvas, this.scale);
    }
    this.windowResizeEvent$.subscribe(() => {
      if (this.canvas) {
        this.resizeRows(this.canvas);
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Initialize canvas and event listeners
   *
   * @param canvas - The canvas element
   * @param scale - The scale to use as a multiplier
   */
  private initialize(canvas: HTMLCanvasElement, scale: number): void {
    this.context = canvas.getContext('2d');
    this.currentPalettes$.next(shuffle<Palette>([...this.palettes]));

    if (!this.isDisabled) {
      this.ngZone.runOutsideAngular(() => {
        fromEvent<MouseEvent>(canvas, 'mousemove', { passive: true })
          .pipe(takeUntil(this.destroy$))
          .subscribe((event) =>
            this.handleMove(event.pageX, event.pageY, scale),
          );

        fromEvent<MouseEvent>(canvas, 'mousedown', { passive: true })
          .pipe(takeUntil(this.destroy$))
          .subscribe(() => this.wobbleRows());

        fromEvent<MouseEvent>(canvas, 'mouseleave', { passive: true })
          .pipe(takeUntil(this.destroy$))
          .subscribe(() => this.resetMousePositions());

        fromEvent<TouchEvent>(canvas, 'touchmove', { passive: true })
          .pipe(takeUntil(this.destroy$))
          .subscribe((event) =>
            this.handleMove(
              event.targetTouches[0].pageX,
              event.targetTouches[0].pageY,
              scale,
            ),
          );

        fromEvent<TouchEvent>(canvas, 'touchstart', { passive: true })
          .pipe(takeUntil(this.destroy$))
          .subscribe((event) => event.preventDefault());

        fromEvent<TouchEvent>(canvas, 'touchend', { passive: true })
          .pipe(takeUntil(this.destroy$))
          .subscribe(() => {
            this.wobbleRows();
            this.resetMousePositions();
          });

        fromEvent<KeyboardEvent>(window, 'keyup', { passive: true })
          .pipe(takeUntil(this.destroy$))
          .subscribe((event) => {
            if (event.code === ArrowDirection.ARROW_LEFT) {
              this.previousPalette();
            }
            if (event.code === ArrowDirection.ARROW_RIGHT) {
              this.nextPalette();
            }
          });
      });
    }

    combineLatest([this.paletteNumber$, this.currentPalettes$])
      .pipe(skip(1), takeUntil(this.destroy$))
      .subscribe(([newNumber, palettes]) =>
        this.setPalette(palettes, newNumber),
      );

    this.rows = [
      new Row(4 / 5, this.scale, this.totalPoints),
      new Row(3 / 5, this.scale, this.totalPoints),
      new Row(2 / 5, this.scale, this.totalPoints),
      new Row(1 / 5, this.scale, this.totalPoints),
    ];

    this.paletteNumber$.next(0);
    this.resizeRows(canvas);
    this.update();
  }

  private handleMove(x: number, y: number, scale: number): void {
    this.mouseX = x * scale;
    this.mouseY = y * scale;
  }

  private resizeRows(canvas: HTMLCanvasElement): void {
    const currentHeight = this.windowRef.innerHeight;
    const currentWidth = this.windowRef.innerWidth;
    canvas.width = currentWidth * this.scale;
    canvas.height = currentHeight * this.scale;
    canvas.style.width = `${currentWidth}px`;
    canvas.style.height = `${currentHeight}px`;
    this.totalPoints = Math.round(
      clamp(Math.pow(Math.random() * 8, 2), 16, currentWidth / 35),
    );
    this.dist = clamp(currentWidth / 4, 150, 200);

    for (let i = this.rows.length; i--; ) {
      this.rows[i].resize(this.totalPoints);
    }
    this.drawRows(canvas);
  }

  wobbleRows(goToNextPalette = true): void {
    this.resizeRows(this.canvas);
    for (let i = this.rows.length; i--; ) {
      this.rows[i].wobble(this.dist, this.totalPoints);
    }
    if (goToNextPalette) {
      this.nextPalette();
    }
  }

  private drawRows(canvas: HTMLCanvasElement): void {
    this.context?.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = this.rows.length; i--; ) {
      this.rows[i].draw(
        canvas,
        this.dist,
        this.mouseX,
        this.mouseY,
        this.totalPoints,
      );
    }
  }

  private setPalette(
    palettes: ReadonlyArray<Palette>,
    paletteNumber = 0,
  ): void {
    if (this.canvas) {
      const palette: Palette = palettes[paletteNumber] ?? palettes[0];
      this.paletteChange.emit(palette);
      this.canvas.style.backgroundColor = palette[0];
      for (let i = this.rows.length; i--; ) {
        this.rows[this.rows.length - i - 1].color = palette[i + 1];
      }
    }
  }

  private update() {
    if (!this.isPaused) {
      requestAnimationFrame(this.update.bind(this));
      if (this.canvas) {
        this.drawRows(this.canvas);
      }
    }
  }

  private resetMousePositions(): void {
    this.mouseX = this.mouseY = this.mouseOff;
  }

  previousPalette(): void {
    const unvalidatedNumber = this.paletteNumber$.getValue() - 1;
    const validatedNumber =
      unvalidatedNumber < 0 ? this.palettes.length : unvalidatedNumber;
    this.paletteNumber$.next(validatedNumber);
  }

  nextPalette(): void {
    const unvalidatedNumber = this.paletteNumber$.getValue() + 1;
    const validatedNumber =
      unvalidatedNumber > this.palettes.length - 1 ? 0 : unvalidatedNumber;
    this.paletteNumber$.next(validatedNumber);
  }

  togglePause(): void {
    this.isPaused = !this.isPaused;
    if (!this.isPaused) {
      this.update();
    }
  }
}
