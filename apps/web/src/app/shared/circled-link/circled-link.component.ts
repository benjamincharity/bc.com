import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
  selector: 'bc-circled-link',
  templateUrl: './circled-link.component.html',
  styleUrls: ['./circled-link.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CircledLinkComponent {
  @Input() isActive = false;
  @Input() queryParams: Record<string, string> | undefined;
  @Input() routerLink: string | string[] = '';
}
