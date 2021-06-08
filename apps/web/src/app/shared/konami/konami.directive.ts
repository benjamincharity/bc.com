import { Directive, EventEmitter, HostListener, Output } from '@angular/core';

/**
 * A directive that listens for the Konami code and emits and event
 */
@Directive({ selector: '[bcKonami]' })
export class KonamiDirective {
  private readonly sequence: string[] = [];
  private konamiSequenceKeys: ReadonlyArray<string> = [
    'ArrowUp',
    'ArrowUp',
    'ArrowDown',
    'ArrowDown',
    'ArrowLeft',
    'ArrowRight',
    'ArrowLeft',
    'ArrowRight',
    'KeyB',
    'KeyA',
  ];

  get isKonamiCode(): boolean {
    return this.konamiSequenceKeys.every(
      (code: string, index: number) => code === this.sequence[index],
    );
  }

  @Output() private konami = new EventEmitter<boolean>();

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent): void {
    if (event.code) {
      // Escape resets the sequence
      if (event.code === 'Escape') {
        this.sequence.length = 0;
        this.konami.emit(false);
        return;
      }

      this.sequence.push(event.code);
      if (this.sequence.length > this.konamiSequenceKeys.length) {
        this.sequence.shift();
      }
      if (this.isKonamiCode) {
        this.konami.emit(true);
      }
    }
  }
}
