/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Optional, Output, ViewChild, ViewContainerRef, ViewEncapsulation, NgZone, Inject, } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';
import { Overlay, MdDialog, MdDialogConfig, ESCAPE, ComponentPortal, OverlayState, Dir } from '@angular/material';
import { DateAdapter } from './native-date-module/index';
import { createMissingDateImplError } from './datetimepicker-errors';
import { MdCalendar } from './calendar';
import 'rxjs/add/operator/first';
/** Used to generate a unique ID for each datetimepicker instance. */
var datetimepickerUid = 0;
/**
 * Component used as the content for the datetimepicker dialog and popup. We use this instead of using
 * MdCalendar directly as the content so we can control the initial focus. This also gives us a
 * place to put additional features of the popup that are not part of the calendar itself in the
 * future. (e.g. confirmation buttons).
 * @docs-private
 */
var MdDatetimepickerContent = (function () {
    function MdDatetimepickerContent() {
    }
    MdDatetimepickerContent.prototype.ngAfterContentInit = function () {
        if (this.calendar) {
            this.calendar._focusActiveCell();
        }
    };
    /**
     * Handles keydown event on datetimepicker content.
     * @param event The event.
     */
    MdDatetimepickerContent.prototype._handleKeydown = function (event) {
        if (event.keyCode === ESCAPE) {
            this.datetimepicker.close();
            event.preventDefault();
        }
    };
    return MdDatetimepickerContent;
}());
export { MdDatetimepickerContent };
MdDatetimepickerContent.decorators = [
    { type: Component, args: [{
                selector: 'md-datetimepicker-content',
                template: "<md-calendar cdkTrapFocus *ngIf=\"datetimepicker.pickerView==='calendar'\" [id]=\"datetimepicker.id\" (calHeight)=\"datetimepicker.setCalHeight($event)\" [monthView]=\"datetimepicker.calView\" [pickerView]=\"datetimepicker.pickerView\" [minDate]=\"datetimepicker._minDate\" [maxDate]=\"datetimepicker._maxDate\" [dateFilter]=\"datetimepicker._dateFilter\" [selected]=\"datetimepicker._selected\" (selectedChange)=\"datetimepicker._dateSelected($event)\" (closeDialog)=\"datetimepicker.close()\" [hideTime]=\"datetimepicker.hideTime\" [date]=\"datetimepicker.date\"></md-calendar><md-timesheet *ngIf=\"datetimepicker.pickerView==='timesheet'\" [calHeight]=\"datetimepicker.calHeight\" [id]=\"datetimepicker.id\" [pickerView]=\"datetimepicker.pickerView\" [minDate]=\"datetimepicker._minDate\" [maxDate]=\"datetimepicker._maxDate\" [dateFilter]=\"datetimepicker._dateFilter\" [selected]=\"datetimepicker._selected\" (selectedChange)=\"datetimepicker._dateSelected($event)\" (save)=\"datetimepicker._selectAndClose($event)\" (closeDialog)=\"datetimepicker.close()\" [hideTime]=\"datetimepicker.hideTime\" [date]=\"datetimepicker.date\"></md-timesheet>",
                styles: [".mat-datepicker-content{box-shadow: 0px 5px 5px -3px rgba(0, 0, 0, 0.2), 0px 8px 10px 1px rgba(0, 0, 0, 0.14), 0px 3px 14px 2px rgba(0, 0, 0, 0.12);display: block;}.mat-calendar{width: 296px;}.mat-datepicker-content-touch{display: block;max-height: 80vh;overflow: auto;margin: -24px;}.mat-datepicker-content-touch .mat-calendar{width: 64vmin;height: 80vmin;min-width: 250px;min-height: 312px;max-width: 750px;max-height: 788px;}@media (min-width: 100VW){.mat-datepicker-content-touch{box-shadow: 0px 0px 0px 0px rgba(0, 0, 0, 0.2), 0px 0px 0px 0px rgba(0, 0, 0, 0.14), 0px 0px 0px 0px rgba(0, 0, 0, 0.12);}}"],
                host: {
                    'class': 'mat-datepicker-content',
                    '[class.mat-datetimepicker-content-touch]': 'datetimepicker.touchUi',
                    '(keydown)': '_handleKeydown($event)',
                },
                encapsulation: ViewEncapsulation.None,
                changeDetection: ChangeDetectionStrategy.OnPush,
            },] },
];
/** @nocollapse */
MdDatetimepickerContent.ctorParameters = function () { return []; };
MdDatetimepickerContent.propDecorators = {
    'calendar': [{ type: ViewChild, args: [MdCalendar,] },],
};
// TODO(mmalerba): We use a component instead of a directive here so the user can use implicit
// template reference variables (e.g. #d vs #d="MdDatetimepicker"). We can change this to a directive if
// angular adds support for `exportAs: '$implicit'` on directives.
/** Component responsible for managing the datetimepicker popup/dialog. */
var MdDatetimepicker = (function () {
    function MdDatetimepicker(_dialog, _overlay, _ngZone, _viewContainerRef, _dateAdapter, _dir, _document) {
        this._dialog = _dialog;
        this._overlay = _overlay;
        this._ngZone = _ngZone;
        this._viewContainerRef = _viewContainerRef;
        this._dateAdapter = _dateAdapter;
        this._dir = _dir;
        this._document = _document;
        /** The view that the calendar should start in. */
        this.calView = 'month';
        /** Emits new selected date when selected date changes. */
        this.selectedChanged = new EventEmitter();
        /** Whether the calendar is open. */
        this.opened = false;
        /** The id for the datetimepicker calendar. */
        this.id = "md-datetimepicker-" + datetimepickerUid++;
        /** The currently selected date. */
        this._selected = null;
        if (!this._dateAdapter) {
            throw createMissingDateImplError('DateAdapter');
        }
    }
    Object.defineProperty(MdDatetimepicker.prototype, "pickerView", {
        /** The view that is displayed in. This is either calendar or timesheet, but can be changed to add more */
        get: function () {
            return (this._pickerView) ? this._pickerView : 'calendar';
        },
        set: function (value) {
            this._pickerView = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdDatetimepicker.prototype, "calHeight", {
        /** Height of the calendar. This is passed to timesheet */
        get: function () {
            return this._calHeight;
        },
        enumerable: true,
        configurable: true
    });
    MdDatetimepicker.prototype.setCalHeight = function (value) {
        this._calHeight = value;
    };
    Object.defineProperty(MdDatetimepicker.prototype, "date", {
        /**
         * Whether the calendar UI is in touch mode. In touch mode the calendar opens in a dialog rather
         * than a popup and elements have more padding to allow for bigger touch targets.
         */
        /** Set as datepicker only; No timepicker*/
        get: function () {
            return this._date;
        },
        set: function (value) {
            this._date = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdDatetimepicker.prototype, "hideTime", {
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
    Object.defineProperty(MdDatetimepicker.prototype, "touchUi", {
        /** Sets to dialog to popup. Dialog req on small screen */
        get: function () {
            return this._touchUi || this._datetimepickerInput.touch || false;
        },
        set: function (isUi) { this._touchUi = isUi; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdDatetimepicker.prototype, "_minDate", {
        /** The minimum selectable date. */
        get: function () {
            return this._datetimepickerInput && this._datetimepickerInput.min;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdDatetimepicker.prototype, "_maxDate", {
        /** The maximum selectable date. */
        get: function () {
            return this._datetimepickerInput && this._datetimepickerInput.max;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdDatetimepicker.prototype, "_dateFilter", {
        get: function () {
            return this._datetimepickerInput && this._datetimepickerInput._dateFilter;
        },
        enumerable: true,
        configurable: true
    });
    MdDatetimepicker.prototype.ngOnDestroy = function () {
        this.close();
        if (this._popupRef) {
            this._popupRef.dispose();
        }
        if (this._inputSubscription) {
            this._inputSubscription.unsubscribe();
        }
    };
    /** Handles date selection in the month view. This closes the dialog */
    MdDatetimepicker.prototype._dateComplete = function (date) {
        this._selected = date;
    };
    /** Selects the given date and closes the currently open popup or dialog. */
    MdDatetimepicker.prototype._selectAndClose = function (v) {
        this._selected = v;
        this.selectedChanged.emit(v);
        this.close();
    };
    /** Selects the given date and closes the currently open popup or dialog. */
    MdDatetimepicker.prototype._dateSelected = function (v) {
        this._selected = v;
        this.pickerView = "timesheet";
    };
    /**
     * Register an input with this datetimepicker.
     * @param input The datetimepicker input to register with this datetimepicker.
     */
    MdDatetimepicker.prototype._registerInput = function (input) {
        var _this = this;
        if (this._datetimepickerInput) {
            throw Error('An MdDatetimepicker can only be associated with a single input.');
        }
        this._datetimepickerInput = input;
        this._inputSubscription = this._datetimepickerInput._valueChange.subscribe(function (value) { _this._selected = value; _this.date = value; });
    };
    /** Open the calendar. */
    MdDatetimepicker.prototype.open = function () {
        if (this.opened) {
            return;
        }
        if (!this._datetimepickerInput) {
            throw Error('Attempted to open an MdDatetimepicker with no associated input.');
        }
        if (this._document) {
            this._focusedElementBeforeOpen = this._document.activeElement;
        }
        this._datetimepickerInput.hideTime = this.hideTime;
        this.touchUi ? this._openAsDialog() : this._openAsPopup();
        this.opened = true;
        this.pickerView = "calendar";
    };
    /** Close the calendar. */
    MdDatetimepicker.prototype.close = function () {
        if (!this.opened) {
            return;
        }
        if (this._popupRef && this._popupRef.hasAttached()) {
            this._popupRef.detach();
        }
        if (this._dialogRef) {
            this._dialogRef.close();
            this._dialogRef = null;
        }
        if (this._calendarPortal && this._calendarPortal.isAttached) {
            this._calendarPortal.detach();
        }
        if (this._focusedElementBeforeOpen && 'focus' in this._focusedElementBeforeOpen) {
            this._focusedElementBeforeOpen.focus();
            this._focusedElementBeforeOpen = null;
        }
        this.opened = false;
    };
    /** Open the calendar as a dialog. */
    MdDatetimepicker.prototype._openAsDialog = function () {
        var _this = this;
        var config = new MdDialogConfig();
        config.viewContainerRef = this._viewContainerRef;
        config.disableClose = true;
        this._dialogRef = this._dialog.open(MdDatetimepickerContent, config);
        this._dialogRef.afterClosed().subscribe(function () { return _this.close(); });
        this._dialogRef.componentInstance.datetimepicker = this;
    };
    /** Open the calendar as a popup. */
    MdDatetimepicker.prototype._openAsPopup = function () {
        var _this = this;
        if (!this._calendarPortal) {
            this._calendarPortal = new ComponentPortal(MdDatetimepickerContent, this._viewContainerRef);
        }
        if (!this._popupRef) {
            this._createPopup();
        }
        if (!this._popupRef.hasAttached()) {
            var componentRef = this._popupRef.attach(this._calendarPortal);
            componentRef.instance.datetimepicker = this;
            // Update the position once the calendar has rendered.
            this._ngZone.onStable.first().subscribe(function () { return _this._popupRef.updatePosition(); });
        }
        this._popupRef.backdropClick().subscribe(function () { return _this.close(); });
    };
    /** Create the popup. */
    MdDatetimepicker.prototype._createPopup = function () {
        var overlayState = new OverlayState();
        overlayState.positionStrategy = this._createPopupPositionStrategy();
        overlayState.hasBackdrop = true;
        overlayState.backdropClass = 'md-overlay-transparent-backdrop';
        overlayState.direction = this._dir ? this._dir.value : 'ltr';
        overlayState.scrollStrategy = this._overlay.scrollStrategies.reposition();
        this._popupRef = this._overlay.create(overlayState);
    };
    /** Create the popup PositionStrategy. */
    MdDatetimepicker.prototype._createPopupPositionStrategy = function () {
        return this._overlay.position()
            .connectedTo(this._datetimepickerInput.getPopupConnectionElementRef(), { originX: 'start', originY: 'bottom' }, { overlayX: 'start', overlayY: 'top' })
            .withFallbackPosition({ originX: 'start', originY: 'top' }, { overlayX: 'start', overlayY: 'bottom' })
            .withFallbackPosition({ originX: 'end', originY: 'bottom' }, { overlayX: 'end', overlayY: 'top' })
            .withFallbackPosition({ originX: 'end', originY: 'top' }, { overlayX: 'end', overlayY: 'bottom' });
    };
    return MdDatetimepicker;
}());
export { MdDatetimepicker };
MdDatetimepicker.decorators = [
    { type: Component, args: [{
                selector: 'md-datetimepicker, mat-datetimepicker',
                template: '',
            },] },
];
/** @nocollapse */
MdDatetimepicker.ctorParameters = function () { return [
    { type: MdDialog, },
    { type: Overlay, },
    { type: NgZone, },
    { type: ViewContainerRef, },
    { type: DateAdapter, decorators: [{ type: Optional },] },
    { type: Dir, decorators: [{ type: Optional },] },
    { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [DOCUMENT,] },] },
]; };
MdDatetimepicker.propDecorators = {
    'calView': [{ type: Input },],
    'pickerView': [{ type: Input },],
    'calHeight': [{ type: Input },],
    'date': [{ type: Input },],
    'hideTime': [{ type: Input },],
    'touchUi': [{ type: Input },],
    'selectedChanged': [{ type: Output },],
};
//# sourceMappingURL=datetimepicker.js.map