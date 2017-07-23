/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ChangeDetectionStrategy, Component, EventEmitter, Inject, Input, Optional, Output, ViewEncapsulation, Host } from '@angular/core';
import { MdCalendarCell } from './calendar-body';
import { MdCalendar } from './calendar';
import { DateAdapter } from './native-date-module/index';
import { MD_DATE_FORMATS } from '@angular/material';
import { createMissingDateImplError } from './datetimepicker-errors';
/**
 * An internal component used to display a single year in the datetimepicker.
 * @docs-private
 */
var MdYearView = (function () {
    function MdYearView(_calendar, _dateAdapter, _dateFormats) {
        this._calendar = _calendar;
        this._dateAdapter = _dateAdapter;
        this._dateFormats = _dateFormats;
        /** Emits when a new month is selected. */
        this.selectedChange = new EventEmitter();
        if (!this._dateAdapter) {
            throw createMissingDateImplError('DateAdapter');
        }
        if (!this._dateFormats) {
            throw createMissingDateImplError('MD_DATE_FORMATS');
        }
        this._activeDate = this._calendar.date || this._dateAdapter.today();
    }
    Object.defineProperty(MdYearView.prototype, "activeDate", {
        /** The date to display in this year view (everything other than the year is ignored). */
        get: function () { return this._activeDate; },
        set: function (value) {
            var oldActiveDate = this._activeDate;
            this._activeDate = value || this._dateAdapter.today();
            if (this._dateAdapter.getYear(oldActiveDate) != this._dateAdapter.getYear(this._activeDate)) {
                this._init();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdYearView.prototype, "selected", {
        /** The currently selected date. */
        get: function () { return this._selected; },
        set: function (value) {
            this._selected = value;
            this._selectedMonth = this._getMonthInCurrentYear(this.selected);
        },
        enumerable: true,
        configurable: true
    });
    MdYearView.prototype.ngAfterContentInit = function () {
        this._init();
    };
    /** Handles when a new month is selected. */
    MdYearView.prototype._monthSelected = function (month) {
        var defaultHours = this._dateAdapter.getHours(this.activeDate);
        var defaultMinutes = this._dateAdapter.getMinutes(this.activeDate);
        this.selectedChange.emit(this._dateAdapter.createDate(this._dateAdapter.getYear(this.activeDate), month, this._dateAdapter.getDate(this.activeDate), defaultHours, defaultMinutes));
    };
    /** Initializes this month view. */
    MdYearView.prototype._init = function () {
        var _this = this;
        this._selectedMonth = this._getMonthInCurrentYear(this.selected);
        this._todayMonth = this._getMonthInCurrentYear(this._dateAdapter.today());
        this._yearLabel = this._dateAdapter.getYearName(this.activeDate);
        var monthNames = this._dateAdapter.getMonthNames('short');
        // First row of months only contains 5 elements so we can fit the year label on the same row.
        this._months = [[0, 1, 2, 3, 4], [5, 6, 7, 8, 9, 10, 11]].map(function (row) { return row.map(function (month) { return _this._createCellForMonth(month, monthNames[month]); }); });
    };
    /**
     * Gets the month in this year that the given Date falls on.
     * Returns null if the given Date is in another year.
     */
    MdYearView.prototype._getMonthInCurrentYear = function (date) {
        return date && this._dateAdapter.getYear(date) == this._dateAdapter.getYear(this.activeDate) ?
            this._dateAdapter.getMonth(date) : null;
    };
    /** Creates an MdCalendarCell for the given month. */
    MdYearView.prototype._createCellForMonth = function (month, monthName) {
        var defaultHours = this._dateAdapter.getHours(this.activeDate);
        var defaultMinutes = this._dateAdapter.getMinutes(this.activeDate);
        var ariaLabel = this._dateAdapter.format(this._dateAdapter.createDate(this._dateAdapter.getYear(this.activeDate), month, 1, defaultHours, defaultMinutes), this._dateFormats.display.monthYearA11yLabel);
        return new MdCalendarCell(month, monthName.toLocaleUpperCase(), ariaLabel, this._isMonthEnabled(month));
    };
    /** Whether the given month is enabled. */
    MdYearView.prototype._isMonthEnabled = function (month) {
        if (!this.dateFilter) {
            return true;
        }
        var defaultHours = this._dateAdapter.getHours(this.activeDate);
        var defaultMinutes = this._dateAdapter.getMinutes(this.activeDate);
        var firstOfMonth = this._dateAdapter.createDate(this._dateAdapter.getYear(this.activeDate), month, 1, defaultHours, defaultMinutes);
        // If any date in the month is enabled count the month as enabled.
        for (var date = firstOfMonth; this._dateAdapter.getMonth(date) == month; date = this._dateAdapter.addCalendarDays(date, 1)) {
            if (this.dateFilter(date)) {
                return true;
            }
        }
        return false;
    };
    return MdYearView;
}());
export { MdYearView };
MdYearView.decorators = [
    { type: Component, args: [{
                selector: 'md-year-view',
                template: "<table class=\"mat-calendar-table\"> <thead class=\"mat-calendar-table-header\"> <tr><th class=\"mat-calendar-table-header-divider\" colspan=\"7\"></th></tr></thead> <tbody md-calendar-body role=\"grid\" allowDisabledSelection=\"true\" [label]=\"_yearLabel\" [rows]=\"_months\" [todayValue]=\"_todayMonth\" [selectedValue]=\"_selectedMonth\" [labelMinRequiredCells]=\"2\" [activeCell]=\"_dateAdapter.getMonth(activeDate)\" (selectedValueChange)=\"_monthSelected($event)\"> </tbody></table>",
                encapsulation: ViewEncapsulation.None,
                changeDetection: ChangeDetectionStrategy.OnPush,
            },] },
];
/** @nocollapse */
MdYearView.ctorParameters = function () { return [
    { type: MdCalendar, decorators: [{ type: Host },] },
    { type: DateAdapter, decorators: [{ type: Optional },] },
    { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [MD_DATE_FORMATS,] },] },
]; };
MdYearView.propDecorators = {
    'activeDate': [{ type: Input },],
    'selected': [{ type: Input },],
    'dateFilter': [{ type: Input },],
    'selectedChange': [{ type: Output },],
};
//# sourceMappingURL=year-view.js.map