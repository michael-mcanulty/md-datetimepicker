/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Inject, Input, NgZone, Optional, Output, ViewEncapsulation } from '@angular/core';
import { DOWN_ARROW, END, ENTER, HOME, LEFT_ARROW, PAGE_DOWN, PAGE_UP, RIGHT_ARROW, UP_ARROW, MATERIAL_COMPATIBILITY_MODE, MD_DATE_FORMATS } from '@angular/material';
import { MdDatetimepickerIntl } from './datetimepicker-intl';
import { createMissingDateImplError } from './datetimepicker-errors';
import { DateAdapter } from './native-date-module/index';
/**
 * A calendar that is used as part of the datetimepicker.
 * @docs-private
 */
var MdCalendar = (function () {
    function MdCalendar(_elementRef, _intl, _ngZone, _isCompatibilityMode, _dateAdapter, _dateFormats) {
        var _this = this;
        this._elementRef = _elementRef;
        this._intl = _intl;
        this._ngZone = _ngZone;
        this._isCompatibilityMode = _isCompatibilityMode;
        this._dateAdapter = _dateAdapter;
        this._dateFormats = _dateFormats;
        /** Whether the calendar should be started in month or year view. */
        this.monthView = 'month';
        /** The view that the picker should start in on the first view. */
        this.pickerView = 'calendar';
        /** Emits when the currently selected date changes. */
        this.selectedChange = new EventEmitter();
        this.closeDialog = new EventEmitter();
        this.calHeight = new EventEmitter();
        /** Date filter for the month and year views. */
        this._dateFilterForViews = function (date) {
            return !!date &&
                (!_this.dateFilter || _this.dateFilter(date)) &&
                (!_this.minDate || _this._dateAdapter.compareDate(date, _this.minDate) >= 0) &&
                (!_this.maxDate || _this._dateAdapter.compareDate(date, _this.maxDate) <= 0);
        };
        if (!this._dateAdapter) {
            throw createMissingDateImplError('DateAdapter');
        }
        if (!this._dateFormats) {
            throw createMissingDateImplError('MD_DATE_FORMATS');
        }
    }
    Object.defineProperty(MdCalendar.prototype, "date", {
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
    Object.defineProperty(MdCalendar.prototype, "_activeDate", {
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
    Object.defineProperty(MdCalendar.prototype, "hideTime", {
        get: function () {
            return this._hideTime;
        },
        set: function (value) {
            this._hideTime = value;
        },
        enumerable: true,
        configurable: true
    });
    MdCalendar.prototype._closeDialog = function () {
        this.closeDialog.emit(true);
    };
    Object.defineProperty(MdCalendar.prototype, "_periodButtonText", {
        /** The label for the current calendar view. */
        get: function () {
            return this._monthView ?
                this._dateAdapter.format(this._activeDate, this._dateFormats.display.monthYearLabel)
                    .toLocaleUpperCase() :
                this._dateAdapter.getYearName(this._activeDate);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdCalendar.prototype, "_periodButtonLabel", {
        get: function () {
            return this._monthView ? this._intl.switchToYearViewLabel : this._intl.switchToMonthViewLabel;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdCalendar.prototype, "_prevButtonLabel", {
        /** The label for the the previous button. */
        get: function () {
            return this._monthView ? this._intl.prevMonthLabel : this._intl.prevYearLabel;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdCalendar.prototype, "_nextButtonLabel", {
        /** The label for the the next button. */
        get: function () {
            return this._monthView ? this._intl.nextMonthLabel : this._intl.nextYearLabel;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdCalendar.prototype, "_increaseHoursButtonLabel", {
        /** The label for the the hours increase button. */
        get: function () {
            return this._intl.increaseHoursButtonLabel;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdCalendar.prototype, "_decreaseHoursButtonLabel", {
        /** The label for th hours decrease button. */
        get: function () {
            return this._intl.decreaseHoursButtonLabel;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdCalendar.prototype, "_increaseMinutesButtonLabel", {
        /** The label for the minutes increase button. */
        get: function () {
            return this._intl.increaseMinutesButtonLabel;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdCalendar.prototype, "_idecreaseMinutesButtonLabel", {
        /** The label for the minutes increase button. */
        get: function () {
            return this._intl.decreaseMinutesButtonLabel;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdCalendar.prototype, "_ampmButtonLabel", {
        /** The label for displaying AM or PM */
        get: function () {
            return this._intl.ampmButtonLabel;
        },
        enumerable: true,
        configurable: true
    });
    MdCalendar.prototype.ngAfterContentInit = function () {
        var today = new Date();
        this._activeDate = this.date || this._dateAdapter.today();
        this._focusActiveCell();
        this._monthView = this.monthView != 'year';
        this._calView = this.pickerView != 'timesheet';
    };
    /** Handles date selection in the month view. */
    MdCalendar.prototype._dateSelected = function (date) {
        if (date) {
            this.calHeight.emit(this._elementRef.nativeElement.offsetHeight + "px");
            this.selected = date;
            this.selectedChange.emit(date);
            this.pickerView = "timesheet";
        }
    };
    /** Handles month selection in the year view. */
    MdCalendar.prototype._monthSelected = function (month) {
        this._activeDate = month;
        this._monthView = true;
    };
    /** Handles user clicks on the period label. */
    MdCalendar.prototype._currentPeriodClicked = function () {
        this._monthView = !this._monthView;
    };
    /** Handles user clicks on the previous button. */
    MdCalendar.prototype._previousClicked = function () {
        this._activeDate = this._monthView ?
            this._dateAdapter.addCalendarMonths(this._activeDate, -1) :
            this._dateAdapter.addCalendarYears(this._activeDate, -1);
    };
    /** Handles user clicks on the next button. */
    MdCalendar.prototype._nextClicked = function () {
        this._activeDate = this._monthView ?
            this._dateAdapter.addCalendarMonths(this._activeDate, 1) :
            this._dateAdapter.addCalendarYears(this._activeDate, 1);
    };
    /** Whether the previous period button is enabled. */
    MdCalendar.prototype._previousEnabled = function () {
        if (!this.minDate) {
            return true;
        }
        return !this.minDate || !this._isSameView(this._activeDate, this.minDate);
    };
    /** Whether the next period button is enabled. */
    MdCalendar.prototype._nextEnabled = function () {
        return !this.maxDate || !this._isSameView(this._activeDate, this.maxDate);
    };
    /** Handles keydown events on the calendar body. */
    MdCalendar.prototype._handleCalendarBodyKeydown = function (event) {
        // TODO(mmalerba): We currently allow keyboard navigation to disabled dates, but just prevent
        // disabled ones from being selected. This may not be ideal, we should look into whether
        // navigation should skip over disabled dates, and if so, how to implement that efficiently.
        if (this._monthView) {
            this._handleCalendarBodyKeydownInMonthView(event);
        }
        else {
            this._handleCalendarBodyKeydownInYearView(event);
        }
    };
    /** Focuses the active cell after the microtask queue is empty. */
    MdCalendar.prototype._focusActiveCell = function () {
        var _this = this;
        this._ngZone.runOutsideAngular(function () { return _this._ngZone.onStable.first().subscribe(function () {
            var activeEl = _this._elementRef.nativeElement.querySelector('.mat-calendar-body-active');
            activeEl.focus();
        }); });
    };
    /** Whether the two dates represent the same view in the current view mode (month or year). */
    MdCalendar.prototype._isSameView = function (date1, date2) {
        return this._monthView ?
            this._dateAdapter.getYear(date1) == this._dateAdapter.getYear(date2) &&
                this._dateAdapter.getMonth(date1) == this._dateAdapter.getMonth(date2) :
            this._dateAdapter.getYear(date1) == this._dateAdapter.getYear(date2);
    };
    /** Handles keydown events on the calendar body when calendar is in month view. */
    MdCalendar.prototype._handleCalendarBodyKeydownInMonthView = function (event) {
        switch (event.keyCode) {
            case LEFT_ARROW:
                this._activeDate = this._dateAdapter.addCalendarDays(this._activeDate, -1);
                break;
            case RIGHT_ARROW:
                this._activeDate = this._dateAdapter.addCalendarDays(this._activeDate, 1);
                break;
            case UP_ARROW:
                this._activeDate = this._dateAdapter.addCalendarDays(this._activeDate, -7);
                break;
            case DOWN_ARROW:
                this._activeDate = this._dateAdapter.addCalendarDays(this._activeDate, 7);
                break;
            case HOME:
                this._activeDate = this._dateAdapter.addCalendarDays(this._activeDate, 1 - this._dateAdapter.getDate(this._activeDate));
                break;
            case END:
                this._activeDate = this._dateAdapter.addCalendarDays(this._activeDate, (this._dateAdapter.getNumDaysInMonth(this._activeDate) -
                    this._dateAdapter.getDate(this._activeDate)));
                break;
            case PAGE_UP:
                this._activeDate = event.altKey ?
                    this._dateAdapter.addCalendarYears(this._activeDate, -1) :
                    this._dateAdapter.addCalendarMonths(this._activeDate, -1);
                break;
            case PAGE_DOWN:
                this._activeDate = event.altKey ?
                    this._dateAdapter.addCalendarYears(this._activeDate, 1) :
                    this._dateAdapter.addCalendarMonths(this._activeDate, 1);
                break;
            case ENTER:
                if (this._dateFilterForViews(this._activeDate)) {
                    this._dateSelected(this._activeDate);
                    // Prevent unexpected default actions such as form submission.
                    event.preventDefault();
                }
                return;
            default:
                // Don't prevent default or focus active cell on keys that we don't explicitly handle.
                return;
        }
        this._focusActiveCell();
        // Prevent unexpected default actions such as form submission.
        event.preventDefault();
    };
    /** Handles keydown events on the calendar body when calendar is in year view. */
    MdCalendar.prototype._handleCalendarBodyKeydownInYearView = function (event) {
        switch (event.keyCode) {
            case LEFT_ARROW:
                this._activeDate = this._dateAdapter.addCalendarMonths(this._activeDate, -1);
                break;
            case RIGHT_ARROW:
                this._activeDate = this._dateAdapter.addCalendarMonths(this._activeDate, 1);
                break;
            case UP_ARROW:
                this._activeDate = this._prevMonthInSameCol(this._activeDate);
                break;
            case DOWN_ARROW:
                this._activeDate = this._nextMonthInSameCol(this._activeDate);
                break;
            case HOME:
                this._activeDate = this._dateAdapter.addCalendarMonths(this._activeDate, -this._dateAdapter.getMonth(this._activeDate));
                break;
            case END:
                this._activeDate = this._dateAdapter.addCalendarMonths(this._activeDate, 11 - this._dateAdapter.getMonth(this._activeDate));
                break;
            case PAGE_UP:
                this._activeDate =
                    this._dateAdapter.addCalendarYears(this._activeDate, event.altKey ? -10 : -1);
                break;
            case PAGE_DOWN:
                this._activeDate =
                    this._dateAdapter.addCalendarYears(this._activeDate, event.altKey ? 10 : 1);
                break;
            case ENTER:
                this._monthSelected(this._activeDate);
                break;
            default:
                // Don't prevent default or focus active cell on keys that we don't explicitly handle.
                return;
        }
        this._focusActiveCell();
        // Prevent unexpected default actions such as form submission.
        event.preventDefault();
    };
    /**
     * Determine the date for the month that comes before the given month in the same column in the
     * calendar table.
     */
    MdCalendar.prototype._prevMonthInSameCol = function (date) {
        // Determine how many months to jump forward given that there are 2 empty slots at the beginning
        // of each year.
        var increment = this._dateAdapter.getMonth(date) <= 4 ? -5 :
            (this._dateAdapter.getMonth(date) >= 7 ? -7 : -12);
        return this._dateAdapter.addCalendarMonths(date, increment);
    };
    /**
     * Determine the date for the month that comes after the given month in the same column in the
     * calendar table.
     */
    MdCalendar.prototype._nextMonthInSameCol = function (date) {
        // Determine how many months to jump forward given that there are 2 empty slots at the beginning
        // of each year.
        var increment = this._dateAdapter.getMonth(date) <= 4 ? 7 :
            (this._dateAdapter.getMonth(date) >= 7 ? 5 : 12);
        return this._dateAdapter.addCalendarMonths(date, increment);
    };
    return MdCalendar;
}());
export { MdCalendar };
MdCalendar.decorators = [
    { type: Component, args: [{
                selector: 'md-calendar',
                template: "<div class=\"mat-calendar-header\"> <div class=\"mat-calendar-controls\"> <button *ngIf=\"!_isCompatibilityMode\" md-button class=\"mat-calendar-period-button\" (click)=\"_currentPeriodClicked()\" [attr.aria-label]=\"_periodButtonLabel\">{{_periodButtonText}}<div class=\"mat-calendar-arrow\" [class.mat-calendar-invert]=\"!_monthView\"></div></button> <button *ngIf=\"_isCompatibilityMode\" mat-button class=\"mat-calendar-period-button\" (click)=\"_currentPeriodClicked()\" [attr.aria-label]=\"_periodButtonLabel\">{{_periodButtonText}}<div class=\"mat-calendar-arrow\" [class.mat-calendar-invert]=\"!_monthView\"></div></button> <div class=\"mat-calendar-spacer\"></div><button *ngIf=\"!_isCompatibilityMode\" md-icon-button class=\"mat-calendar-previous-button\" [disabled]=\"!_previousEnabled()\" (click)=\"_previousClicked()\" [attr.aria-label]=\"_prevButtonLabel\"> </button> <button *ngIf=\"_isCompatibilityMode\" mat-icon-button class=\"mat-calendar-previous-button\" [disabled]=\"!_previousEnabled()\" (click)=\"_previousClicked()\" [attr.aria-label]=\"_prevButtonLabel\"> </button> <button *ngIf=\"!_isCompatibilityMode\" md-icon-button class=\"mat-calendar-next-button\" [disabled]=\"!_nextEnabled()\" (click)=\"_nextClicked()\" [attr.aria-label]=\"_nextButtonLabel\"> </button> <button *ngIf=\"_isCompatibilityMode\" mat-icon-button class=\"mat-calendar-next-button\" [disabled]=\"!_nextEnabled()\" (click)=\"_nextClicked()\" [attr.aria-label]=\"_nextButtonLabel\"> </button> </div></div><div class=\"mat-calendar-content\" (keydown)=\"_handleCalendarBodyKeydown($event)\" (swipeleft)=\"_previousClicked()\" (swiperight)=\"_nextClicked()\" [ngSwitch]=\"_monthView\" cdkMonitorSubtreeFocus> <md-month-view *ngSwitchCase=\"true\" [activeDate]=\"_activeDate\" [selected]=\"selected\" [dateFilter]=\"_dateFilterForViews\" (selectedChange)=\"_dateSelected($event)\"> </md-month-view> <md-year-view *ngSwitchDefault [activeDate]=\"_activeDate\" [selected]=\"selected\" [dateFilter]=\"_dateFilterForViews\" (selectedChange)=\"_monthSelected($event)\"> </md-year-view></div>",
                styles: [".mat-calendar{display: block;}.mat-calendar-header{padding: 8px 8px 0 8px;min-height:76px;}.mat-calendar-content{padding: 0 8px 8px 8px;outline: none;}.mat-calendar-controls{display: flex;padding: 5% calc(100% / 14 - 22px) 5% calc(100% / 14 - 22px);}.mat-calendar-spacer{flex: 1 1 auto;}.mat-calendar-period-button{min-width: 0;}.mat-calendar-arrow{display: inline-block;width: 0;height: 0;border-left: 5px solid transparent;border-right: 5px solid transparent;border-top-width: 5px;border-top-style: solid;margin: 0 0 0 5px;vertical-align: middle;}.mat-calendar-arrow.mat-calendar-invert{transform: rotate(180deg);}[dir='rtl'] .mat-calendar-arrow{margin: 0 5px 0 0;}.mat-calendar-previous-button,.mat-calendar-next-button{position: relative;}.mat-calendar-previous-button::after, .mat-calendar-next-button::after{content: '';position: absolute;top: 0;left: 0;bottom: 0;right: 0;margin: 15.5px;border: 0 solid currentColor;border-top-width: 2px;}[dir='rtl'] .mat-calendar-previous-button, [dir='rtl'] .mat-calendar-next-button{transform: rotate(180deg);}.mat-calendar-previous-button::after{border-left-width: 2px;transform: translateX(2px) rotate(-45deg);}.mat-calendar-next-button::after{border-right-width: 2px;transform: translateX(-2px) rotate(45deg);}.mat-calendar-table{border-spacing: 0;border-collapse: collapse;width: 100%;}.mat-calendar-table-header th{text-align: center;padding: 0 0 8px 0;}.mat-calendar-table-header-divider{position: relative;height: 1px;}.mat-calendar-table-header-divider::after{content: '';position: absolute;top: 0;left: -8px;right: -8px;height: 1px;}.mat-calendar-footer{display: flex;flex-direction: row;margin-top:2px;justify-content: flex-end;max-height:40px;}.mat-time-container{display: flex;justify-content: flex-end;align-items: center;margin: 0 10px;}.mat-time-button-wrapper{display: flex;flex-direction: column;flex-grow: 0;}.mat-time-button{width: 40px;height: 40px;}.mat-time-spacer-wrapper{display: flex;flex-direction: column;flex-grow: 0;width: 25px;}.mat-time-display{text-align: center;font-family: Roboto,\"Helvetica Neue\",sans-serif;width: 88px;height: 55px;color: rgba(0, 0, 0, 0.84);font-size: 18px;font-weight: 500;display: flex;justify-content: center;}.mat-time-colon{text-align: center;font-size: 16px;}.mat-time-colon-wrapper{width: 25px;height: 30px;display: flex;justify-content: center;}.mat-time-spacer{width: 25px;height: 40px;}.mat-button-spacer-wrapper{width: 25px;height: 40px;}.mat-display-spacer-wrapper{width: 25px;height: 40px;}#md-datepicker-0 > div.mat-calendar-content > md-month-view > table{margin-bottom: 8px;}.mat-time-input{text-align: center;border: none;width: 25px;outline: none;}.mat-time-ampm{min-width: 48px !important;line-height: 25px !important;}.time-minutes{margin-right: 10px;}md-dialog-container{padding:0 !important;display: inline !important;}.mat-dialog-container{max-width: 100vw !important;}.timesheet .mat-icon-button{height:50px;width:50px;}.timesheet input{font-size:20px;}.timesheet{display:flex;flex-direction:column;justify-content:space-between;}.control-footer{display:flex;justify-content:flex-end;}.heading{padding:0 10px;font-weight:600;font-size:24px;font-family:'Roboto';text-transform: uppercase;}.subheading{padding:0 10px;font-size:28px;font-family:'Roboto';}input[type=number]::-webkit-inner-spin-button, input[type=number]::-webkit-outer-spin-button{-webkit-appearance: none; -moz-appearance: none; appearance: none; margin: 0;}"],
                host: {
                    'class': 'mat-calendar',
                },
                encapsulation: ViewEncapsulation.None,
                changeDetection: ChangeDetectionStrategy.OnPush,
            },] },
];
/** @nocollapse */
MdCalendar.ctorParameters = function () { return [
    { type: ElementRef, },
    { type: MdDatetimepickerIntl, },
    { type: NgZone, },
    { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [MATERIAL_COMPATIBILITY_MODE,] },] },
    { type: DateAdapter, decorators: [{ type: Optional },] },
    { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [MD_DATE_FORMATS,] },] },
]; };
MdCalendar.propDecorators = {
    'monthView': [{ type: Input },],
    'pickerView': [{ type: Input },],
    'selected': [{ type: Input },],
    'minDate': [{ type: Input },],
    'maxDate': [{ type: Input },],
    'dateFilter': [{ type: Input },],
    'date': [{ type: Input },],
    'hideTime': [{ type: Input },],
    'selectedChange': [{ type: Output },],
    'closeDialog': [{ type: Output },],
    'calHeight': [{ type: Output },],
};
//# sourceMappingURL=calendar.js.map