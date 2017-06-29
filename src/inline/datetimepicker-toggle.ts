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
  styles: [`.mat-datepicker-toggle{display: inline-block;background: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNHB4IiBoZWlnaHQ9IjI0cHgiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iY3VycmVudENvbG9yIj48cGF0aCBkPSJNMCAwaDI0djI0SDB6IiBmaWxsPSJub25lIi8+PHBhdGggZD0iTTE5IDNoLTFWMWgtMnYySDhWMUg2djJINWMtMS4xMSAwLTEuOTkuOS0xLjk5IDJMMyAxOWMwIDEuMS44OSAyIDIgMmgxNGMxLjEgMCAyLS45IDItMlY1YzAtMS4xLS45LTItMi0yem0wIDE2SDVWOGgxNHYxMXpNNyAxMGg1djVIN3oiLz48L3N2Zz4=") no-repeat;background-size: contain;height: 24px;width: 24px;border: none;outline: none;vertical-align: middle;}.mat-datepicker-toggle:not([disabled]){cursor: pointer;}`],
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
