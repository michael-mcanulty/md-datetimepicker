/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { MdDatetimepickerIntl } from './datetimepicker-intl';
var MdDatetimepickerToggle = (function () {
    function MdDatetimepickerToggle(_intl) {
        this._intl = _intl;
    }
    Object.defineProperty(MdDatetimepickerToggle.prototype, "_datetimepicker", {
        get: function () { return this.datetimepicker; },
        set: function (v) { this.datetimepicker = v; },
        enumerable: true,
        configurable: true
    });
    MdDatetimepickerToggle.prototype._open = function (event) {
        if (this.datetimepicker) {
            this.datetimepicker.open();
            event.stopPropagation();
        }
    };
    return MdDatetimepickerToggle;
}());
export { MdDatetimepickerToggle };
MdDatetimepickerToggle.decorators = [
    { type: Component, args: [{
                selector: 'button[mdDatetimepickerToggle], button[matDatepickerToggle]',
                template: '',
                styleUrls: ['datetimepicker-toggle.scss'],
                host: {
                    'type': 'button',
                    'class': 'mat-datepicker-toggle',
                    '[attr.aria-label]': '_intl.openCalendarLabel',
                    '(click)': '_open($event)',
                },
                encapsulation: ViewEncapsulation.None,
                changeDetection: ChangeDetectionStrategy.OnPush,
            },] },
];
/** @nocollapse */
MdDatetimepickerToggle.ctorParameters = function () { return [
    { type: MdDatetimepickerIntl, },
]; };
MdDatetimepickerToggle.propDecorators = {
    'datetimepicker': [{ type: Input, args: ['mdDatetimepickerToggle',] },],
    '_datetimepicker': [{ type: Input, args: ['matDatetimepickerToggle',] },],
};
//# sourceMappingURL=datetimepicker-toggle.js.map