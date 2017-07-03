/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Inject, Input, NgZone, Optional, Output, ViewEncapsulation } from '@angular/core';
import { MATERIAL_COMPATIBILITY_MODE, MD_DATE_FORMATS } from '@angular/material';
import { MdDatetimepickerIntl } from './datetimepicker-intl';
import { createMissingDateImplError } from './datetimepicker-errors';
import { DateAdapter } from './native-date-module/index';
/**
 * A calendar that is used as part of the datetimepicker.
 * @docs-private
 */
var MdTimesheet = (function () {
    function MdTimesheet(_elementRef, _intl, _ngZone, _isCompatibilityMode, _dateAdapter, _dateFormats) {
        var _this = this;
        this._elementRef = _elementRef;
        this._intl = _intl;
        this._ngZone = _ngZone;
        this._isCompatibilityMode = _isCompatibilityMode;
        this._dateAdapter = _dateAdapter;
        this._dateFormats = _dateFormats;
        /** The view that the picker should start in. */
        this.pickerView = 'calendar';
        /** Date filter for the month and year views. */
        this._dateFilterForViews = function (date) {
            return !!date &&
                (!_this.dateFilter || _this.dateFilter(date)) &&
                (!_this.minDate || _this._dateAdapter.compareDate(date, _this.minDate) >= 0) &&
                (!_this.maxDate || _this._dateAdapter.compareDate(date, _this.maxDate) <= 0);
        };
        /** Emits changes to selected date, not [date] of [value] which are changed on save. */
        this.selectedChange = new EventEmitter();
        /** Emits changes to [date] and [value]. These are reflected in the input */
        this.save = new EventEmitter();
        this.closeDialog = new EventEmitter();
        this.timeView = 'calendar';
        if (!this._dateAdapter) {
            throw createMissingDateImplError('DateAdapter');
        }
        if (!this._dateFormats) {
            throw createMissingDateImplError('MD_DATE_FORMATS');
        }
    }
    Object.defineProperty(MdTimesheet.prototype, "ampm", {
        /* set ampm button label */
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
    /* get hours */
    MdTimesheet.prototype._getClockHrs = function () {
        var time = this._dateAdapter.toLocaleTimeString(this._selected);
        var timeArr = time.split(":");
        return timeArr[0];
    };
    /* get minutes */
    MdTimesheet.prototype._getClockMins = function () {
        var time = this._dateAdapter.toLocaleTimeString(this._selected);
        var timeArr = time.split(":");
        return timeArr[1];
    };
    /* Decrease hours by one hour onclick */
    MdTimesheet.prototype._decreaseHoursClicked = function () {
        this._selected = this._dateAdapter.setHours(this._selected, this._dateAdapter.getHours(this._selected) - 1);
        this._timeSelected();
    };
    /* Increase hours by one hour onclick */
    MdTimesheet.prototype._increaseHoursClicked = function () {
        this._selected = this._dateAdapter.setHours(this._selected, this._dateAdapter.getHours(this._selected) + 1);
        this._timeSelected();
    };
    /* Increase minutes by one minute onclick */
    MdTimesheet.prototype._increaseMinutesClicked = function () {
        this._selected = this._dateAdapter.setMinutes(this._selected, this._dateAdapter.getMinutes(this._selected) + 1);
        this._timeSelected();
    };
    /* Decrease minutes by one minute onclick */
    MdTimesheet.prototype._decreaseMinutesClicked = function () {
        this._selected = this._dateAdapter.setMinutes(this._selected, this._dateAdapter.getMinutes(this._selected) - 1);
        this._timeSelected();
    };
    /* ampm toggle onclick */
    MdTimesheet.prototype._pmClicked = function () {
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
    Object.defineProperty(MdTimesheet.prototype, "_activeDate", {
        /**
         * The current active date. This determines which time period is shown and which date is
         * highlighted when using keyboard navigation.
         */
        get: function () { return this._clampedActiveDate; },
        set: function (value) {
            this._clampedActiveDate = this._dateAdapter.clampDate(value, this.minDate, this.maxDate);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdTimesheet.prototype, "calHeight", {
        /* Calendar height. This is set by MdDatetimpicker<D> class (parent) */
        get: function () {
            return this._calHeight;
        },
        /* The setter also sets timeHeight */
        set: function (value) {
            var headerHeight = 84;
            var footerControls = 40;
            this._calHeight = value;
            this.timeHeight = parseInt(value) - headerHeight - footerControls + "px";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdTimesheet.prototype, "timeHeight", {
        /* Sets the time picker content area height */
        get: function () {
            return this._timeHeight;
        },
        set: function (value) {
            this._timeHeight = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdTimesheet.prototype, "hideTime", {
        /** Set as datepicker only; No timepicker*/
        get: function () {
            return this._hideTime;
        },
        set: function (value) {
            this._hideTime = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdTimesheet.prototype, "date", {
        /** The date to open the calendar to initially. */
        get: function () {
            // If an explicit startAt is set we start there, otherwise we start at whatever the currently
            // selected value is.
            return this._date;
        },
        set: function (date) {
            this._date = date;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdTimesheet.prototype, "_increaseHoursButtonLabel", {
        /** The label for the the hours increase button. */
        get: function () {
            return this._intl.increaseHoursButtonLabel;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdTimesheet.prototype, "_decreaseHoursButtonLabel", {
        /** The label for th hours decrease button. */
        get: function () {
            return this._intl.decreaseHoursButtonLabel;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdTimesheet.prototype, "_increaseMinutesButtonLabel", {
        /** The label for the minutes increase button. */
        get: function () {
            return this._intl.increaseMinutesButtonLabel;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdTimesheet.prototype, "_idecreaseMinutesButtonLabel", {
        /** The label for the minutes increase button. */
        get: function () {
            return this._intl.decreaseMinutesButtonLabel;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdTimesheet.prototype, "_ampmButtonLabel", {
        /** The label for displaying AM or PM */
        get: function () {
            return this._intl.ampmButtonLabel;
        },
        enumerable: true,
        configurable: true
    });
    MdTimesheet.prototype.ngAfterContentInit = function () {
        var today = new Date();
        this._elementRef.nativeElement.style.height = this.calHeight;
        this._selected = this.selected || this._dateAdapter.today();
        this._dateArr = this._dateAdapter.format(this._selected, this._dateFormats.display['dateHeader']).split(',');
        this._timeView = this.pickerView != 'calendar';
        this.pm = this._dateAdapter.isPm(this._selected);
        this.ampm = (this.pm) ? "PM" : "AM";
    };
    MdTimesheet.prototype.ngOnChanges = function () {
        if (this._selected) {
            if (this.ampm === "AM" && this._dateAdapter.isPm(this._selected)) {
                this._selected = this._dateAdapter.setHours(this._selected, this._dateAdapter.getHours(this._selected) - 12);
            }
            else if (this.ampm === "PM" && !this._dateAdapter.isPm(this._selected)) {
                this._selected = this._dateAdapter.setHours(this._selected, this._dateAdapter.getHours(this._selected) + 12);
            }
        }
    };
    MdTimesheet.prototype._closeDialog = function () {
        this.closeDialog.emit(true);
    };
    /* time changed in picker */
    MdTimesheet.prototype._timeSelected = function () {
        this.selectedChange.emit(this._selected);
    };
    /* saves date to input [value] and [date] if applicable. Closes dialog. */
    MdTimesheet.prototype._save = function () {
        this.save.emit(this._selected);
    };
    /* adds a leading 0 to an HTMLInputElement is a single digit */
    MdTimesheet.prototype._inputChange = function (event) {
        var input = event.target;
        var ln = input.value.length;
        var isHours = input.classList.contains('hrs-input');
        var val = input.value;
        var intVal = parseInt(val);
        var hrsMin = (this._dateAdapter.is12Hour()) ? 1 : 0;
        var hrsMax = (this._dateAdapter.is12Hour()) ? 12 : 23;
        var minMin = 0;
        var minMax = 59;
        if (ln > 2) {
            var _inputVal = val.slice(ln - 2, ln);
            input.value = _inputVal;
            val = _inputVal;
            intVal = parseInt(val);
            console.log(input.value.length);
        }
        if (val.length && intVal >= 0) {
            if (isHours) {
                if (intVal > hrsMax || intVal < hrsMin) {
                    input.value = hrsMin.toString();
                    val = hrsMin.toString();
                    intVal = parseInt(val);
                }
                if (this._dateAdapter.getHours(this._selected) !== intVal) {
                    console.log(input.value);
                    this._dateAdapter.setHours(this._selected, intVal);
                }
            }
            else {
                if (intVal > minMax || intVal < minMin) {
                    input.value = minMin.toString();
                    val = minMin.toString();
                    intVal = parseInt(val);
                }
                var isChanged = void 0;
                if (input.value.length === 1) {
                    isChanged = this._leadingZero(input);
                }
                if (isChanged || this._dateAdapter.getMinutes(this._selected) !== intVal) {
                    console.log(input.value);
                    this._dateAdapter.setMinutes(this._selected, intVal);
                }
            }
        }
    };
    /* adds a leading 0 to an HTMLInputElement is a single digit. Returns true if the new value is different tahn original value*/
    MdTimesheet.prototype._leadingZero = function (input) {
        var ln = input.value.length;
        var isHours = input.classList.contains('hrs-input');
        console.log(input.classList.contains('hrs-input'));
        var val = input.value;
        var intVal = parseInt(val);
        console.log(val);
        if (ln === 1) {
            input.value = "0" + input.value;
        }
        return intVal === parseInt(input.value);
    };
    return MdTimesheet;
}());
export { MdTimesheet };
MdTimesheet.decorators = [
    { type: Component, args: [{
                selector: 'md-timesheet',
                template: "<div class=\"mat-calendar-header mat-calendar-body-selected\"> <div class=\"subheading\">{{_dateArr[0]}}</div><div class=\"heading\">{{_dateArr[1]}}</div><div *ngIf=\"_dateArr[2]\" class=\"subheading\">{{_dateArr[2]}}</div></div><div class=\"mat-calendar-content timesheet\"> <div class=\"mat-time-container\" style=\"flex-grow:1;\" [style.height]=\"timeHeight\"> <div class=\"mat-time-button-wrapper\" (swipeup)=\"_increaseHoursClicked()\" (swipedown)=\"_decreaseHoursClicked()\"> <div class=\"mat-time-button\"> <button md-button (click)=\"_increaseHoursClicked()\" [attr.aria-label]=\"_increaseHoursButtonLabel\"> <svg fill=\"#000000\" height=\"24\" viewBox=\"0 0 24 24\" width=\"24\" xmlns=\"http://www.w3.org/2000/svg\"> <path d=\"M7 14l5-5 5 5z\"/> <path d=\"M0 0h24v24H0z\" fill=\"none\"/> </svg> </button> </div><div class=\"mat-time-display\"> <input type=\"tel\" min=\"0\" max=\"24\" step=\"1\" [value]=\"_getClockHrs(selected)\" class=\"mat-time-input hrs-input\" (click)=\"$event.target.select()\" (input)=\"_inputChange($event)\"/> </div><div class=\"mat-time-button\"> <button md-button (click)=\"_decreaseHoursClicked()\" [attr.aria-label]=\"_decreaseHoursButtonLabel\"> <svg fill=\"#000000\" height=\"24\" viewBox=\"0 0 24 24\" width=\"24\" xmlns=\"http://www.w3.org/2000/svg\"> <path d=\"M7 10l5 5 5-5z\"/> <path d=\"M0 0h24v24H0z\" fill=\"none\"/> </svg> </button> </div></div><div class=\"mat-time-spacer-wrapper\"> <div class=\"mat-button-spacer-wrapper\"> </div><div class=\"mat-time-colon-wrapper\"> <div class=\"mat-time-colon\">:</div></div><div class=\"mat-button-spacer-wrapper\"></div></div><div class=\"mat-time-button-wrapper time-minutes\" (swipeup)=\"_increaseMinutesClicked()\" (swipedown)=\"_decreaseMinutesClicked()\"> <div class=\"mat-time-button\"> <button md-button (click)=\"_increaseMinutesClicked()\" [attr.aria-label]=\"_increaseMinutesButtonLabel\"> <svg fill=\"#000000\" height=\"24\" viewBox=\"0 0 24 24\" width=\"24\" xmlns=\"http://www.w3.org/2000/svg\"> <path d=\"M7 14l5-5 5 5z\"/> <path d=\"M0 0h24v24H0z\" fill=\"none\"/> </svg> </button> </div><div class=\"mat-time-display\"> <input type=\"tel\" (click)=\"$event.target.select()\" (input)=\"_inputChange($event)\" min=\"0\" max=\"59\" step=\"1\" [value]=\"_getClockMins(selected)\" class=\"mat-time-input min-input\"/> </div><div class=\"mat-time-button\"> <button md-button (click)=\"_decreaseMinutesClicked()\" [attr.aria-label]=\"_decreaseMinutesButtonLabel\"> <svg fill=\"#000000\" height=\"24\" viewBox=\"0 0 24 24\" width=\"24\" xmlns=\"http://www.w3.org/2000/svg\"> <path d=\"M7 10l5 5 5-5z\"/> <path d=\"M0 0h24v24H0z\" fill=\"none\"/> </svg> </button> </div></div><div class=\"mat-time-button-wrapper\" *ngIf=\"_dateAdapter.is12Hour()\"> <button class=\"mat-raised-button mat-time-ampm\" (click)=\"_pmClicked()\" [attr.aria-label]=\"_ampmButtonLabel\">{{ampm}}</button> </div></div><div class=\"control-footer\"> <button md-button (click)=\"_closeDialog()\">Cancel</button> <button md-button color=\"primary\" (click)=\"_save()\">Save</button> </div></div>",
                styles: [".mat-calendar{display: block;}.mat-calendar-header{padding: 8px 8px 0 8px;min-height:76px;}.mat-calendar-content{padding: 0 8px 8px 8px;outline: none;}.mat-calendar-controls{display: flex;padding: 5% calc(100% / 14 - 22px) 5% calc(100% / 14 - 22px);}.mat-calendar-spacer{flex: 1 1 auto;}.mat-calendar-period-button{min-width: 0;}.mat-calendar-arrow{display: inline-block;width: 0;height: 0;border-left: 5px solid transparent;border-right: 5px solid transparent;border-top-width: 5px;border-top-style: solid;margin: 0 0 0 5px;vertical-align: middle;}.mat-calendar-arrow.mat-calendar-invert{transform: rotate(180deg);}[dir='rtl'] .mat-calendar-arrow{margin: 0 5px 0 0;}.mat-calendar-previous-button,.mat-calendar-next-button{position: relative;}.mat-calendar-previous-button::after, .mat-calendar-next-button::after{content: '';position: absolute;top: 0;left: 0;bottom: 0;right: 0;margin: 15.5px;border: 0 solid currentColor;border-top-width: 2px;}[dir='rtl'] .mat-calendar-previous-button, [dir='rtl'] .mat-calendar-next-button{transform: rotate(180deg);}.mat-calendar-previous-button::after{border-left-width: 2px;transform: translateX(2px) rotate(-45deg);}.mat-calendar-next-button::after{border-right-width: 2px;transform: translateX(-2px) rotate(45deg);}.mat-calendar-table{border-spacing: 0;border-collapse: collapse;width: 100%;}.mat-calendar-table-header th{text-align: center;padding: 0 0 8px 0;}.mat-calendar-table-header-divider{position: relative;height: 1px;}.mat-calendar-table-header-divider::after{content: '';position: absolute;top: 0;left: -8px;right: -8px;height: 1px;}.mat-calendar-footer{display: flex;flex-direction: row;margin-top:2px;justify-content: flex-end;max-height:40px;}.mat-time-container{display: flex;justify-content: flex-end;align-items: center;margin: 0 10px;}.mat-time-button-wrapper{display: flex;flex-direction: column;flex-grow: 0;}.mat-time-button{width: 40px;height: 40px;}.mat-time-spacer-wrapper{display: flex;flex-direction: column;flex-grow: 0;width: 25px;}.mat-time-display{text-align: center;font-family: Roboto,\"Helvetica Neue\",sans-serif;width: 88px;height: 55px;color: rgba(0, 0, 0, 0.84);font-size: 18px;font-weight: 500;display: flex;justify-content: center;}.mat-time-colon{text-align: center;font-size: 16px;}.mat-time-colon-wrapper{width: 25px;height: 30px;display: flex;justify-content: center;}.mat-time-spacer{width: 25px;height: 40px;}.mat-button-spacer-wrapper{width: 25px;height: 40px;}.mat-display-spacer-wrapper{width: 25px;height: 40px;}#md-datepicker-0 > div.mat-calendar-content > md-month-view > table{margin-bottom: 8px;}.mat-time-input{text-align: center;border: none;width: 25px;outline: none;}.mat-time-ampm{min-width: 48px !important;line-height: 25px !important;}.time-minutes{margin-right: 10px;}md-dialog-container{padding:0 !important;display: inline !important;}.mat-dialog-container{max-width: 100vw !important;}.timesheet .mat-icon-button{height:50px;width:50px;}.timesheet input{font-size:20px;}.timesheet{display:flex;flex-direction:column;justify-content:space-between;}.control-footer{display:flex;justify-content:flex-end;}.heading{padding:0 10px;font-weight:600;font-size:24px;font-family:'Roboto';text-transform: uppercase;}.subheading{padding:0 10px;font-size:28px;font-family:'Roboto';}input[type=number]::-webkit-inner-spin-button, input[type=number]::-webkit-outer-spin-button{-webkit-appearance: none; -moz-appearance: none; appearance: none; margin: 0;}"],
                host: {
                    'class': 'mat-calendar',
                },
                encapsulation: ViewEncapsulation.None,
                changeDetection: ChangeDetectionStrategy.OnPush,
            },] },
];
/** @nocollapse */
MdTimesheet.ctorParameters = function () { return [
    { type: ElementRef, },
    { type: MdDatetimepickerIntl, },
    { type: NgZone, },
    { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [MATERIAL_COMPATIBILITY_MODE,] },] },
    { type: DateAdapter, decorators: [{ type: Optional },] },
    { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [MD_DATE_FORMATS,] },] },
]; };
MdTimesheet.propDecorators = {
    'pickerView': [{ type: Input },],
    'selected': [{ type: Input },],
    'minDate': [{ type: Input },],
    'maxDate': [{ type: Input },],
    'dateFilter': [{ type: Input },],
    'selectedChange': [{ type: Output },],
    'save': [{ type: Output },],
    'closeDialog': [{ type: Output },],
    'timeView': [{ type: Input },],
    'calHeight': [{ type: Input },],
    'timeHeight': [{ type: Input },],
    'hideTime': [{ type: Input },],
    'date': [{ type: Input },],
};
//# sourceMappingURL=timesheet.js.map