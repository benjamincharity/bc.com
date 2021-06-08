import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation,
} from '@angular/core';

@Component({
  selector: 'bc-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class InfoComponent {
  userHasInteracted = false;
  set showPopover(value: boolean) {
    if (value) {
      this.userHasInteracted = value;
    }
    this._showPopover = value;
  }
  get showPopover(): boolean {
    return this._showPopover;
  }
  private _showPopover = false;

  @Input() showInfo = false;
  @Input() animationsArePaused = false;

  @Output() readonly togglePauseRequest = new EventEmitter<void>();

  stopEvent(event: MouseEvent): void {
    event.preventDefault();
  }
}
