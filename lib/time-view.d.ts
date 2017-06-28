/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { EventEmitter, AfterContentInit } from '@angular/core';
import { MdCalendar } from './calendar';
import { TimepickerAttrs } from './timepicker-attrs';
import { DateAdapter } from './native-date-module/index';
/**
 * An internal component used to display a single month in the datetimepicker.
 * @docs-private
 */
export declare class MdTimeView<D> implements AfterContentInit {
    private _calendar;
    _dateAdapter: DateAdapter<D>;
    /** Emits when time is added to date. */
    selectedChange: EventEmitter<D>;
    /** The date of the month that today falls on. Null if today is in another month. */
    private _selected;
    pm: boolean;
    _ampm: string;
    ampm: string;
    timepickerAttrs: TimepickerAttrs;
    private _timepickerAttrs;
    _getClockHrs(): string;
    _getClockMins(): string;
    _decreaseHoursClicked(): void;
    _increaseHoursClicked(): void;
    _increaseMinutesClicked(): void;
    _decreaseMinutesClicked(): void;
    _pmClicked(): void;
    constructor(_calendar: MdCalendar<D>, _dateAdapter: DateAdapter<D>);
    /** The currently selected date. */
    selected: D;
    ngAfterContentInit(): void;
    ngOnChanges(): void;
    _timeSelected(): void;
}
