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
  exportAs: 'bcInfo',
})
export class InfoComponent {
  set showPopover(value: boolean) {
    this._showPopover = value;
    this.infoPanelStateChange.emit(this._showPopover);
  }
  get showPopover(): boolean {
    return this._showPopover;
  }
  private _showPopover = false;

  @Input() showInfo = false;
  @Input() animationsArePaused = false;

  @Output() readonly togglePauseRequest = new EventEmitter<void>();
  @Output() readonly infoPanelStateChange = new EventEmitter<boolean>();

  stopEvent(event: MouseEvent): void {
    event.preventDefault();
  }
}
