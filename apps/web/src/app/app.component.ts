import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import {
  bounceInRightOnEnterAnimation,
  fadeInDownOnEnterAnimation,
  rotateOutDownRightOnLeaveAnimation,
} from 'angular-animations';
import { BehaviorSubject, interval, Subscription, timer } from 'rxjs';
import { delay, filter, startWith, tap } from 'rxjs/operators';

import { CanvasComponent } from './canvas/canvas.component';
import { Palette, PALETTES } from './canvas/palettes.data';
import { shrinkHeaderAnimation } from './shared/animation.constants';
import { createSVG } from './shared/squiggle';
import { BC_WINDOW } from './shared/window.service';

const DEFAULT_INFO_INTRO_DELAY = 7000;
const DEFAULT_INFO_EXIT_DELAY = DEFAULT_INFO_INTRO_DELAY * 2;

export enum LogoStates {
  VOID = 'void',
  DEFAULT = 'default',
  SHRUNK = 'shrunk',
}

const pagesWithBackground = ['', '404'];
export function shouldShowBackground(url: string): boolean {
  return pagesWithBackground.includes(url.replace(/\//, ''));
}

@Component({
  selector: 'bc-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    fadeInDownOnEnterAnimation({
      duration: 800,
      translate: '1.6rem',
    }),
    shrinkHeaderAnimation,
    bounceInRightOnEnterAnimation(),
    rotateOutDownRightOnLeaveAnimation(),
  ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  set currentRoute(value: string) {
    this._currentRoute = value ?? '';
    const urlWithoutQuery = this._currentRoute.split('?')[0] ?? '';
    this.shouldShowBackground = shouldShowBackground(this._currentRoute);
    this.isSubPage = urlWithoutQuery.length > 1;
  }
  get currentRoute(): string {
    return this._currentRoute;
  }
  private _currentRoute = '';
  // NOTE: We initialize as `true` so that the canvas is hidden by default
  isSubPage = true;
  shouldShowBackground = false;
  logoState$ = new BehaviorSubject<LogoStates>(LogoStates.VOID);
  mediaQuery = this.window.matchMedia('(prefers-reduced-motion: reduce)');
  palettes: ReadonlyArray<Palette> = [...PALETTES];
  partyModeEnabled = false;
  partyModeSubscription: Subscription | undefined;
  showInfo$ = new BehaviorSubject<boolean>(false);

  get shouldBeReducedMotion(): boolean {
    return this.mediaQuery.media.includes('reduce') && this.mediaQuery.matches;
  }

  @ViewChild(CanvasComponent) canvas?: CanvasComponent;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    @Inject(BC_WINDOW) private window: Window,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.showThenHideInfo();
    this.updateRouteAndLogoState();
  }

  /**
   * Show the info trigger after a delay, then hide if no user interaction has occurred
   */
  showThenHideInfo(): void {
    timer(DEFAULT_INFO_INTRO_DELAY)
      .pipe(
        filter(() => this.shouldShowBackground),
        tap(() => this.showInfo$.next(true)),
        delay(DEFAULT_INFO_EXIT_DELAY),
        tap(() => this.showInfo$.next(false)),
      )
      .subscribe();
  }

  /**
   * Set the current URL and logo state based on router events
   */
  updateRouteAndLogoState(): void {
    this.router.events
      .pipe(
        filter(
          (event): event is NavigationEnd => event instanceof NavigationEnd,
        ),
        tap((event) => {
          this.currentRoute = event.urlAfterRedirects ?? '';
          this.logoState$.next(
            !this.shouldShowBackground ? LogoStates.SHRUNK : LogoStates.DEFAULT,
          );
        }),
      )
      .subscribe();
  }

  /**
   * Set CSS properties when the palette is changed
   *
   * @param palette - The new palette
   */
  setNewPaletteColors(palette: Palette): void {
    this.document.documentElement.style.setProperty(
      `--o-squiggle-link-backgroundImage`,
      `url(data:image/svg+xml;base64,${window.btoa(createSVG(palette[0]))})`,
    );

    for (let i = 0; i < palette.length; i += 1) {
      const cssVar = `--highlight-color-${i + 1}`;
      this.document.documentElement.style.setProperty(cssVar, `${palette[i]}`);
    }
  }

  /**
   * Toggle 🎉party mode🎉
   *
   * @param isOn - If party mode is being enabled or disabled
   */
  togglePartyMode(isOn: boolean): void {
    this.partyModeEnabled = isOn;

    if (isOn && this.canvas) {
      const canvas = this.canvas;
      this.partyModeSubscription = interval(500)
        .pipe(startWith(true))
        .subscribe(() => canvas.wobbleRows());
    } else if (this.partyModeSubscription) {
      this.partyModeSubscription.unsubscribe();
      this.partyModeSubscription = undefined;
    }
  }
}
