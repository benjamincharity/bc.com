import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  Inject,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ScullyRoutesService } from '@scullyio/ng-lib';
import { fadeInUpOnEnterAnimation } from 'angular-animations';
import { MetafrenzyService } from 'ngx-metafrenzy';
import { BehaviorSubject } from 'rxjs';
import { filter, tap } from 'rxjs/operators';

import { buildCanonicalUrl } from '../../app-routing.module';
import {
  blogDescription,
  blogImagePath,
  siteTitle,
} from '../../shared/content.constants';
import { ArticleTags, ScullyService } from '../../shared/scully.service';
import {
  skeletonArticleListingSizes,
  SkeletonInstanceThemeObject,
} from '../../shared/skeleton.constants';

/**
 * Convert string to ArticleTag
 *
 * @param value - The value to check
 * @returns True if it is an ArticleTag
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function typeGuardArticleTags(value: any): value is ArticleTags {
  return Object.values(ArticleTags).includes(value);
}

/**
 * Return the value from the URL param for tag
 *
 * @param url - The full URL string
 * @returns The tag
 */
export function pluckTagFromUrl(url: string): string {
  return url?.split('?')[1]?.split('=')[1] ?? '';
}

@UntilDestroy()
@Component({
  selector: 'bc-articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.scss'],
  animations: [fadeInUpOnEnterAnimation({ anchor: 'enter' })],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class ArticlesComponent implements OnInit {
  readonly skeletonCount = new Array(3);
  readonly skeletonSizes: SkeletonInstanceThemeObject = skeletonArticleListingSizes;
  allArticles$ = this.scullyService.visibleArticles$.pipe(
    tap((v) => console.log(v)),
  );
  allTags$: BehaviorSubject<readonly ArticleTags[]> = this.scullyService
    .allTags$;
  currentTag$ = new BehaviorSubject<ArticleTags | null>(null);
  navigationEnd$ = this.router.events.pipe(
    untilDestroyed(this),
    filter((e): e is NavigationEnd => e instanceof NavigationEnd),
  );

  @HostBinding('class.bc-articles') baseClass = true;

  constructor(
    @Inject(DOCUMENT) private readonly document: Document,
    private activatedRoute: ActivatedRoute,
    private metafrenzyService: MetafrenzyService,
    private route: ActivatedRoute,
    private router: Router,
    private scully: ScullyRoutesService,
    private scullyService: ScullyService,
  ) {}

  ngOnInit(): void {
    const initialTag = pluckTagFromUrl(this.router.url);
    this.handleTagChange(
      typeGuardArticleTags(initialTag) ? initialTag : undefined,
    );
    this.navigationEnd$.pipe().subscribe((b) => {
      const tag = pluckTagFromUrl(b.url);
      this.handleTagChange(typeGuardArticleTags(tag) ? tag : undefined);
    });

    this.metafrenzyService.setTags({
      title: siteTitle,
      description: blogDescription,
      url: buildCanonicalUrl(this.activatedRoute),
      image: blogImagePath,
    });
  }

  handleTagChange(tag: ArticleTags | undefined): void {
    if (tag) {
      this.currentTag$.next(tag);
      this.scullyService.getArticlesByTag(tag);
      return;
    }
    this.scullyService.clearTagFilter();
    this.currentTag$.next(null);
    this.clearFilter();
  }

  clearFilter(): void {
    this.router.navigate([], {
      queryParams: {
        tag: null,
      },
      queryParamsHandling: 'merge',
    });
  }
}
