/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {ChangeDetectionStrategy, Component, Input, ViewEncapsulation} from '@angular/core';
import {MdDatetimepicker} from './datetimepicker';
import {MdDatetimepickerIntl} from './datetimepicker-intl';


@Component({
  selector: 'button[mdDatetimepickerToggle], button[matDatepickerToggle]',
  template: '',
  styleUrls: ['datetimepicker-toggle.css'],
  host: {
    'type': 'button',
    'class': 'mat-datepicker-toggle',
    '[attr.aria-label]': '_intl.openCalendarLabel',
    '(click)': '_open($event)',
  },
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MdDatetimepickerToggle<D> {
  /** Datepicker instance that the button will toggle. */
  @Input('mdDatetimepickerToggle') datetimepicker: MdDatetimepicker<D>;

  @Input('matDatetimepickerToggle')
  get _datetimepicker() { return this.datetimepicker; }
  set _datetimepicker(v: MdDatetimepicker<D>) { this.datetimepicker = v; }

  constructor(public _intl: MdDatetimepickerIntl) {}

  _open(event: Event): void {
    if (this.datetimepicker) {
      this.datetimepicker.open();
      event.stopPropagation();
    }
  }
}
