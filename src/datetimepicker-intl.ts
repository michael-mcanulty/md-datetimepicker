/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {Injectable} from '@angular/core';
import {MdDatepickerIntl} from '@angular/material';

/** Datepicker data that requires internationalization. */

@Injectable()

export class MdDatetimepickerIntl extends MdDatepickerIntl{

 /** A label to 'decrease hours' on the time widgit (used by screen readers). */
  increaseHoursButtonLabel = "Increase Hours";
 
  /** A label to 'increase hours' on time widgit (used by screen readers). */
  decreaseHoursButtonLabel = "Decrease Hours";
 
 /** A label to 'decrease minutes' on time widgit (used by screen readers). */
  increaseMinutesButtonLabel = "Increase Minutes";
 
  /** A label to 'increasing minutes' on time widgit (used by screen readers). */
  decreaseMinutesButtonLabel = "Decrease Minutes";

  /** A label for AMPM if applicable*/
  ampmButtonLabel = "Toggle AM and PM";
}