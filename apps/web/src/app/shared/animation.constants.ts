import { state, transition, trigger } from '@angular/animations';
import { animate, style } from '@angular/animations';

export const fadeUpDelay = 80;
export const fadeUpDuration = 800;
export const fadeUpDistance = '26px';

export const shrinkHeaderAnimation = trigger('shrink', [
  state('void', style({ transform: 'translate3d(0, -26px, 0)' })),
  state('default', style({ transform: 'translate3d(0, 0, 0)' })),
  state('shrunk', style({ transform: 'scale(.4) translate3d(0, -140px, 0)' })),
  transition('void => shrunk', animate('30ms ease-out')),
  transition('void => default', animate('300ms ease-out')),
  transition('default => shrunk', animate('300ms ease-out')),
  transition('shrunk => default', animate('300ms ease-out')),
]);
