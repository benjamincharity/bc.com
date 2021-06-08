import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  HostBinding,
  HostListener,
  Inject,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { fadeInUpOnEnterAnimation } from 'angular-animations';
import { MetafrenzyService } from 'ngx-metafrenzy';
import { buildCanonicalUrl } from '../app-routing.module';

import { CanvasComponent, shuffle } from '../canvas/canvas.component';
import { Palette, PALETTES } from '../canvas/palettes.data';
import {
  fadeUpDelay,
  fadeUpDistance,
  fadeUpDuration,
} from '../shared/animation.constants';
import {
  homeDescription,
  homeImagePath,
  siteTitle,
} from '../shared/content.constants';
import { ScullyService } from '../shared/scully.service';
import { COMPANIES } from './companies.data';
import { Link, NAVIGATION_LINKS } from './navigation.data';

export enum ArrowDirection {
  ARROW_LEFT = 'ArrowLeft',
  ARROW_RIGHT = 'ArrowRight',
}

@Component({
  selector: 'bc-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [
    fadeInUpOnEnterAnimation({
      anchor: 'AnimationIn1',
      duration: fadeUpDuration,
      translate: fadeUpDistance,
    }),
    fadeInUpOnEnterAnimation({
      anchor: 'AnimationIn2',
      duration: fadeUpDuration,
      delay: fadeUpDelay,
      translate: fadeUpDistance,
    }),
    fadeInUpOnEnterAnimation({
      anchor: 'AnimationIn3',
      duration: fadeUpDuration * 1.2,
      delay: fadeUpDelay * 3,
      translate: fadeUpDistance,
    }),
  ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit {
  companies: ReadonlyArray<string> = shuffle<string>([...COMPANIES]);
  navigationLinks: ReadonlyArray<Link> = [...NAVIGATION_LINKS];
  palettes: ReadonlyArray<Palette> = [...PALETTES];

  @HostBinding('class.bc-home') baseClass = true;
  @ViewChild(CanvasComponent) canvas?: CanvasComponent;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private activatedRoute: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private metafrenzyService: MetafrenzyService,
    // NOTE: ScullyService is injected here so articles get prefetched
    private scullyService: ScullyService,
  ) {}

  ngOnInit(): void {
    this.metafrenzyService.setTags({
      title: siteTitle,
      description: homeDescription,
      url: buildCanonicalUrl(this.activatedRoute),
      image: homeImagePath,
    });
  }

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (
      event.code === ArrowDirection.ARROW_LEFT ||
      event.code === ArrowDirection.ARROW_RIGHT
    ) {
      this.canvas?.nextPalette();
    }
  }
}
