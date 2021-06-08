import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

import { ArticleTags } from '../../shared/scully.service';

@Component({
  selector: 'bc-tag-links',
  templateUrl: './tag-links.component.html',
  styleUrls: ['./tag-links.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TagLinksComponent {
  @Input() currentTag: ArticleTags | null = null;
  @Input() routeBase = '';
  @Input() tags: ReadonlyArray<ArticleTags> | null = [];
}
