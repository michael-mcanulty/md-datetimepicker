/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { Injectable } from '@angular/core';
import { MdDatepickerIntl } from '@angular/material';
/** Datepicker data that requires internationalization. */
var MdDatetimepickerIntl = (function (_super) {
    __extends(MdDatetimepickerIntl, _super);
    function MdDatetimepickerIntl() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /** A label to 'decrease hours' on the time widgit (used by screen readers). */
        _this.increaseHoursButtonLabel = "Increase Hours";
        /** A label to 'increase hours' on time widgit (used by screen readers). */
        _this.decreaseHoursButtonLabel = "Decrease Hours";
        /** A label to 'decrease minutes' on time widgit (used by screen readers). */
        _this.increaseMinutesButtonLabel = "Increase Minutes";
        /** A label to 'increasing minutes' on time widgit (used by screen readers). */
        _this.decreaseMinutesButtonLabel = "Decrease Minutes";
        _this.ampmButtonLabel = "Toggle AM and PM";
        return _this;
    }
    return MdDatetimepickerIntl;
}(MdDatepickerIntl));
export { MdDatetimepickerIntl };
MdDatetimepickerIntl.decorators = [
    { type: Injectable },
];
/** @nocollapse */
MdDatetimepickerIntl.ctorParameters = function () { return []; };
//# sourceMappingURL=datetimepicker-intl.js.map