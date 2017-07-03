/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { AfterContentInit, ElementRef, EventEmitter, NgZone } from '@angular/core';
import { MdDateFormats } from '@angular/material';
import { MdDatetimepickerIntl } from './datetimepicker-intl';
import { DateAdapter } from './native-date-module/index';
/**
 * A calendar that is used as part of the datetimepicker.
 * @docs-private
 */
export declare class MdTimesheet<D> implements AfterContentInit {
    private _elementRef;
    private _intl;
    private _ngZone;
    _isCompatibilityMode: boolean;
    private _dateAdapter;
    private _dateFormats;
    /** The view that the picker should start in. */
    pickerView: 'timesheet' | 'calendar';
    /** The currently selected date. */
    selected: D;
    /** The minimum selectable date. */
    minDate: D;
    /** The maximum selectable date. */
    maxDate: D;
    /** A function used to filter which dates are selectable. */
    dateFilter: (date: D) => boolean;
    /** Date filter for the month and year views. */
    _dateFilterForViews: (date: D) => boolean;
    /** Emits changes to selected date, not [date] of [value] which are changed on save. */
    selectedChange: EventEmitter<D>;
    /** Emits changes to [date] and [value]. These are reflected in the input */
    save: EventEmitter<D>;
    closeDialog: EventEmitter<boolean>;
    /** The date of the month that today falls on. Null if today is in another month. */
    private _selected;
    timeView: 'timesheet' | 'calendar';
    _timeView: boolean;
    pm: boolean;
    _ampm: string;
    ampm: string;
    _getClockHrs(): string;
    _getClockMins(): string;
    _decreaseHoursClicked(): void;
    _increaseHoursClicked(): void;
    _increaseMinutesClicked(): void;
    _decreaseMinutesClicked(): void;
    _pmClicked(): void;
    _dateArr: Array<string>;
    /**
     * The current active date. This determines which time period is shown and which date is
     * highlighted when using keyboard navigation.
     */
    _activeDate: D;
    private _clampedActiveDate;
    calHeight: string;
    private _calHeight;
    timeHeight: string;
    private _timeHeight;
    /** Set as datepicker only; No timepicker*/
    hideTime: boolean;
    private _hideTime;
    /** Whether the calendar is in month view. */
    _pickerView: boolean;
    /** The date to open the calendar to initially. */
    date: D;
    private _date;
    /** The label for the the hours increase button. */
    readonly _increaseHoursButtonLabel: string;
    /** The label for th hours decrease button. */
    readonly _decreaseHoursButtonLabel: string;
    /** The label for the minutes increase button. */
    readonly _increaseMinutesButtonLabel: string;
    /** The label for the minutes increase button. */
    readonly _idecreaseMinutesButtonLabel: string;
    /** The label for displaying AM or PM */
    readonly _ampmButtonLabel: string;
    constructor(_elementRef: ElementRef, _intl: MdDatetimepickerIntl, _ngZone: NgZone, _isCompatibilityMode: boolean, _dateAdapter: DateAdapter<D>, _dateFormats: MdDateFormats);
    ngAfterContentInit(): void;
    ngOnChanges(): void;
    _closeDialog(): void;
    _timeSelected(): void;
    _save(): void;
    _inputChange(event: any): void;
    _leadingZero(input: HTMLInputElement): boolean;
}
