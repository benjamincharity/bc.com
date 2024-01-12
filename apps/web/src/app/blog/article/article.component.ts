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
import {
  skeletonArticleSizes,
  SkeletonInstanceThemeArrayObject,
} from '../../shared/skeleton.constants';

const DRAFT_KEY = `___UNPUBLISHED___`;
const DRAFT_METADATA = {
  title: 'Can you punch up the fun level on these icons?',
  description:
    'Make the font bigger could you move it a tad to the left, and we are your relatives can you make it faster?, but we need to make the new version clean and sexy. Im not sure, try something else. This looks perfect.',
  disableHighlight: false,
  tags: ['ux', 'design', 'javascript'],
  publishDate: '2021-03-23',
};
function isDraft(postId: string): boolean {
  const draftRegex = new RegExp(DRAFT_KEY, 'i');
  return draftRegex.test(postId);
}

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
  readonly skeletonSizes: SkeletonInstanceThemeArrayObject = skeletonArticleSizes;
  articleMetadata$ = combineLatest([
    this.activatedRoute.params.pipe(pluck('postId')),
    this.scully.available$,
  ]).pipe(
    map(([postId, routes]) =>
      isDraft(postId)
        ? { ...DRAFT_METADATA }
        : routes.find((route) => route.route === `/articles/${postId}`),
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
