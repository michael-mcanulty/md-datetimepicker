/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { InjectionToken } from '@angular/core';
export declare type MdDateFormats = {
    parse: {
        dateInput: any;
        datetimeInput: any;
    };
    display: {
        dateInput: any;
        datetimeInput: any;
        monthYearLabel: any;
        dateA11yLabel: any;
        monthYearA11yLabel: any;
    };
};
export declare const MD_DATE_FORMATS: InjectionToken<MdDateFormats>;
