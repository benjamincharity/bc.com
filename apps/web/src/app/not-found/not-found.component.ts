import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  ViewEncapsulation,
} from '@angular/core';
import { fadeInUpOnEnterAnimation } from 'angular-animations';

import {
  fadeUpDelay,
  fadeUpDistance,
  fadeUpDuration,
} from '../shared/animation.constants';

@Component({
  selector: 'bc-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss'],
  animations: [
    fadeInUpOnEnterAnimation({
      anchor: 'AnimationIn1',
      duration: fadeUpDuration,
      translate: fadeUpDistance,
    }),
    fadeInUpOnEnterAnimation({
      anchor: 'AnimationIn2',
      duration: fadeUpDuration,
      delay: fadeUpDelay,
      translate: fadeUpDistance,
    }),
    fadeInUpOnEnterAnimation({
      anchor: 'AnimationIn3',
      duration: fadeUpDuration * 1.2,
      delay: fadeUpDelay * 3,
      translate: fadeUpDistance,
    }),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class NotFoundComponent {
  @HostBinding('class.not-found') baseClass = true;
}
