import { DOCUMENT } from '@angular/common';
import {
  AfterViewChecked,
  ChangeDetectionStrategy,
  Component,
  Inject,
  ViewEncapsulation,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ScullyRoutesService } from '@scullyio/ng-lib';
import {
  fadeInUpOnEnterAnimation,
  fadeOutDownOnLeaveAnimation,
} from 'angular-animations';
import { MetafrenzyService } from 'ngx-metafrenzy';
import { combineLatest } from 'rxjs';
import { map, pluck } from 'rxjs/operators';
import { buildCanonicalUrl } from '../../app-routing.module';
import {
  blogDescription,
  blogImagePath,
  siteTitle,
} from '../../shared/content.constants';

import { HighlightService } from '../../shared/highlight.service';

@Component({
  selector: 'bc-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss'],
  animations: [
    fadeInUpOnEnterAnimation({ duration: 300, translate: '16px' }),
    fadeOutDownOnLeaveAnimation({ duration: 300, translate: '16px' }),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class ArticleComponent implements AfterViewChecked {
  articleMetadata$ = combineLatest([
    this.activatedRoute.params.pipe(pluck('postId')),
    this.scully.available$,
  ]).pipe(
    map(([postId, routes]) =>
      routes.find((route) => route.route === `/articles/${postId}`),
    ),
  );

  constructor(
    @Inject(DOCUMENT) private readonly document: Document,
    private activatedRoute: ActivatedRoute,
    private highlightService: HighlightService,
    private metafrenzyService: MetafrenzyService,
    private scully: ScullyRoutesService,
  ) {}

  ngAfterViewChecked(): void {
    this.highlightService.highlightAll();
    this.articleMetadata$.subscribe((m) => {
      this.metafrenzyService.setTags({
        title: m?.title ?? siteTitle,
        description: m?.description ?? blogDescription,
        url: buildCanonicalUrl(this.activatedRoute),
        image: blogImagePath,
      });
    });
  }
}
