/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { NgModule } from '@angular/core';
import { MdNativeDateModule } from './native-date-module/index';
import { StyleModule, OverlayModule, A11yModule, MdButtonModule, MdInputModule, MdDialogModule, MdSelectModule, MdOptionModule } from '@angular/material';
import { MdMonthView } from './month-view';
import { MdTimeView } from './time-view';
import { CommonModule } from '@angular/common';
import { MdCalendarBody } from './calendar-body';
import { MdYearView } from './year-view';
import { MdDatetimepicker, MdDatetimepickerContent } from './datetimepicker';
import { MdDatetimepickerInput } from './datetimepicker-input';
import { MdCalendar } from './calendar';
import { MdDatetimepickerToggle } from './datetimepicker-toggle';
import { MdDatetimepickerIntl } from './datetimepicker-intl';
import { FormsModule } from '@angular/forms';
export * from './calendar';
export * from './calendar-body';
export * from './datetimepicker';
export * from './datetimepicker-input';
export * from './datetimepicker-intl';
export * from './datetimepicker-toggle';
export * from './month-view';
export * from './time-view';
export * from './year-view';
var MdDatetimepickerModule = (function () {
    function MdDatetimepickerModule() {
    }
    return MdDatetimepickerModule;
}());
export { MdDatetimepickerModule };
MdDatetimepickerModule.decorators = [
    { type: NgModule, args: [{
                imports: [
                    CommonModule,
                    MdButtonModule,
                    MdDialogModule,
                    OverlayModule,
                    StyleModule,
                    A11yModule,
                    FormsModule,
                    MdInputModule,
                    MdSelectModule,
                    MdOptionModule,
                    MdNativeDateModule
                ],
                exports: [
                    MdDatetimepicker,
                    MdDatetimepickerContent,
                    MdDatetimepickerInput,
                    MdDatetimepickerToggle
                ],
                declarations: [
                    MdCalendar,
                    MdCalendarBody,
                    MdDatetimepicker,
                    MdDatetimepickerContent,
                    MdDatetimepickerInput,
                    MdDatetimepickerToggle,
                    MdMonthView,
                    MdTimeView,
                    MdYearView,
                ],
                providers: [
                    MdDatetimepickerIntl,
                ],
                entryComponents: [
                    MdDatetimepickerContent,
                ]
            },] },
];
/** @nocollapse */
MdDatetimepickerModule.ctorParameters = function () { return []; };
//# sourceMappingURL=index.js.map