/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { AfterContentInit, EventEmitter, OnDestroy, ViewContainerRef, NgZone } from '@angular/core';
import { Overlay, MdDialog, Dir } from '@angular/material';
import { MdDatetimepickerInput } from './datetimepicker-input';
import { DateAdapter } from './native-date-module/index';
import { MdCalendar } from './calendar';
import 'rxjs/add/operator/first';
/**
 * Component used as the content for the datetimepicker dialog and popup. We use this instead of using
 * MdCalendar directly as the content so we can control the initial focus. This also gives us a
 * place to put additional features of the popup that are not part of the calendar itself in the
 * future. (e.g. confirmation buttons).
 * @docs-private
 */
export declare class MdDatetimepickerContent<D> implements AfterContentInit {
    datetimepicker: MdDatetimepicker<D>;
    calendar: MdCalendar<D>;
    ngAfterContentInit(): void;
    /**
     * Handles keydown event on datetimepicker content.
     * @param event The event.
     */
    _handleKeydown(event: KeyboardEvent): void;
}
/** Component responsible for managing the datetimepicker popup/dialog. */
export declare class MdDatetimepicker<D> implements OnDestroy {
    private _dialog;
    private _overlay;
    private _ngZone;
    private _viewContainerRef;
    private _dateAdapter;
    private _dir;
    private _document;
    /** The view that the calendar should start in. */
    calView: 'month' | 'year';
    /** The view that is displayed in. This is either calendar or timesheet, but can be changed to add more */
    pickerView: string;
    private _pickerView;
    /** Height of the calendar. This is passed to timesheet */
    readonly calHeight: string;
    setCalHeight(value: string): void;
    private _calHeight;
    /**
     * Whether the calendar UI is in touch mode. In touch mode the calendar opens in a dialog rather
     * than a popup and elements have more padding to allow for bigger touch targets.
     */
    /** Set as datepicker only; No timepicker*/
    date: D;
    private _date;
    /** Set as datepicker only; No timepicker*/
    hideTime: boolean;
    private _hideTime;
    /** Sets to dialog to popup. Dialog req on small screen */
    touchUi: boolean;
    private _touchUi;
    /** Emits new selected date when selected date changes. */
    selectedChanged: EventEmitter<D>;
    /** Whether the calendar is open. */
    opened: boolean;
    /** The id for the datetimepicker calendar. */
    id: string;
    /** The currently selected date. */
    _selected: D;
    /** The minimum selectable date. */
    readonly _minDate: D;
    /** The maximum selectable date. */
    readonly _maxDate: D;
    readonly _dateFilter: (date: D | null) => boolean;
    /** A reference to the overlay when the calendar is opened as a popup. */
    private _popupRef;
    /** A reference to the dialog when the calendar is opened as a dialog. */
    private _dialogRef;
    /** A portal containing the calendar for this datetimepicker. */
    private _calendarPortal;
    /** The input element this datetimepicker is associated with. */
    private _datetimepickerInput;
    /** The element that was focused before the datetimepicker was opened. */
    private _focusedElementBeforeOpen;
    private _inputSubscription;
    constructor(_dialog: MdDialog, _overlay: Overlay, _ngZone: NgZone, _viewContainerRef: ViewContainerRef, _dateAdapter: DateAdapter<D>, _dir: Dir, _document: any);
    ngOnDestroy(): void;
    /** Handles date selection in the month view. This closes the dialog */
    _dateComplete(date: D): void;
    /** Selects the given date and closes the currently open popup or dialog. */
    _selectAndClose(v: D): void;
    /** Selects the given date and closes the currently open popup or dialog. */
    _dateSelected(v: D): void;
    /**
     * Register an input with this datetimepicker.
     * @param input The datetimepicker input to register with this datetimepicker.
     */
    _registerInput(input: MdDatetimepickerInput<D>): void;
    /** Open the calendar. */
    open(): void;
    /** Close the calendar. */
    close(): void;
    /** Open the calendar as a dialog. */
    private _openAsDialog();
    /** Open the calendar as a popup. */
    private _openAsPopup();
    /** Create the popup. */
    private _createPopup();
    /** Create the popup PositionStrategy. */
    private _createPopupPositionStrategy();
}
