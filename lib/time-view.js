/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Optional, Output, ViewEncapsulation, Host } from '@angular/core';
import { MdCalendar } from './calendar';
import { DateAdapter } from './native-date-module/index';
/**
 * An internal component used to display a single month in the datetimepicker.
 * @docs-private
 */
var MdTimeView = (function () {
    function MdTimeView(_calendar, _dateAdapter) {
        this._calendar = _calendar;
        this._dateAdapter = _dateAdapter;
        /** Emits when time is added to date. */
        this.selectedChange = new EventEmitter();
    }
    Object.defineProperty(MdTimeView.prototype, "ampm", {
        get: function () {
            return this._ampm;
        },
        set: function (label) {
            this._ampm = label;
        },
        enumerable: true,
        configurable: true
    });
    ;
    ;
    Object.defineProperty(MdTimeView.prototype, "timepickerAttrs", {
        get: function () {
            return this._timepickerAttrs;
        },
        set: function (v) {
            this._timepickerAttrs = v;
        },
        enumerable: true,
        configurable: true
    });
    MdTimeView.prototype._getClockHrs = function () {
        var time = this._dateAdapter.toLocaleTimeString(this._selected);
        var timeArr = time.split(":");
        return timeArr[0];
    };
    MdTimeView.prototype._getClockMins = function () {
        var time = this._dateAdapter.toLocaleTimeString(this._selected);
        var timeArr = time.split(":");
        return timeArr[1];
    };
    /* Hours */
    MdTimeView.prototype._decreaseHoursClicked = function () {
        this._selected = this._dateAdapter.setHours(this._selected, this._dateAdapter.getHours(this._selected) - 1);
        this._timeSelected();
    };
    MdTimeView.prototype._increaseHoursClicked = function () {
        this._selected = this._dateAdapter.setHours(this._selected, this._dateAdapter.getHours(this._selected) + 1);
        this._timeSelected();
    };
    MdTimeView.prototype._increaseMinutesClicked = function () {
        this._selected = this._dateAdapter.setMinutes(this._selected, this._dateAdapter.getMinutes(this._selected) + 1);
        this._timeSelected();
    };
    MdTimeView.prototype._decreaseMinutesClicked = function () {
        this._selected = this._dateAdapter.setMinutes(this._selected, this._dateAdapter.getMinutes(this._selected) - 1);
        this._timeSelected();
    };
    /* PM */
    MdTimeView.prototype._pmClicked = function () {
        if (this.pm) {
            this.ampm = "AM";
            this._selected = this._dateAdapter.setHours(this._selected, this._dateAdapter.getHours(this._selected) - 12);
        }
        else {
            this.ampm = "PM";
            this._selected = this._dateAdapter.setHours(this._selected, this._dateAdapter.getHours(this._selected) + 12);
        }
        this.pm = !this.pm;
        this._timeSelected();
    };
    Object.defineProperty(MdTimeView.prototype, "selected", {
        /** The currently selected date. */
        get: function () { return this._selected; },
        set: function (value) {
            this._selected = value || this._dateAdapter.today();
        },
        enumerable: true,
        configurable: true
    });
    MdTimeView.prototype.ngAfterContentInit = function () {
        this.timepickerAttrs = this._calendar.timepickerAttrs;
        this.timepickerAttrs = this._calendar.timepickerAttrs;
        this.pm = this._dateAdapter.isPm(this._selected);
        this.ampm = (this.pm) ? "PM" : "AM";
    };
    MdTimeView.prototype.ngOnChanges = function () {
        if (this.selected) {
            if (this.ampm === "AM" && this._dateAdapter.isPm(this._selected)) {
                this._selected = this._dateAdapter.setHours(this._selected, this._dateAdapter.getHours(this._selected) - 12);
            }
            else if (this.ampm === "PM" && !this._dateAdapter.isPm(this._selected)) {
                this._selected = this._dateAdapter.setHours(this._selected, this._dateAdapter.getHours(this._selected) + 12);
            }
        }
    };
    MdTimeView.prototype._timeSelected = function () {
        this.selectedChange.emit(this.selected);
    };
    return MdTimeView;
}());
export { MdTimeView };
MdTimeView.decorators = [
    { type: Component, args: [{
                selector: 'md-time-view',
                templateUrl: 'time-view.html',
                encapsulation: ViewEncapsulation.None,
                changeDetection: ChangeDetectionStrategy.OnPush
            },] },
];
/** @nocollapse */
MdTimeView.ctorParameters = function () { return [
    { type: MdCalendar, decorators: [{ type: Host },] },
    { type: DateAdapter, decorators: [{ type: Optional },] },
]; };
MdTimeView.propDecorators = {
    'selectedChange': [{ type: Output },],
    'timepickerAttrs': [{ type: Input },],
    'selected': [{ type: Input },],
};
//# sourceMappingURL=time-view.js.map