import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  Input,
  ViewEncapsulation
} from "@angular/core";

@Component({
  selector: 'bc-article-dates',
  templateUrl: './article-dates.component.html',
  styleUrls: ['./article-dates.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class ArticleDatesComponent {
  @HostBinding('class.article-dates') baseClass = true;
  @Input() publishDate: string;
  @Input() lastUpdatedDate: string;
}
