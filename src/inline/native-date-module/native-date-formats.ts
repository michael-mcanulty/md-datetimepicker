/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {MdDateFormats} from './date-formats';


export const MD_NATIVE_DATE_FORMATS: MdDateFormats = {
  parse: {
    dateInput: null,
    datetimeInput: null,
  },
  display: {
    dateInput: {year: 'numeric', month: 'numeric', day: 'numeric'},
    datetimeInput: {year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit'},
    monthYearLabel: {year: 'numeric', month: 'short'},
    dateA11yLabel: {year: 'numeric', month: 'long', day: 'numeric'},
    monthYearA11yLabel: {year: 'numeric', month: 'long'},
  }
};