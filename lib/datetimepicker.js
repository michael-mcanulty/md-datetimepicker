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
        this._calendar._focusActiveCell();
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
                templateUrl: 'datetimepicker-content.html',
                styleUrls: ['datetimepicker-content.scss'],
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
    '_calendar': [{ type: ViewChild, args: [MdCalendar,] },],
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
        this.startView = 'month';
        /**
         * Whether the calendar UI is in touch mode. In touch mode the calendar opens in a dialog rather
         * than a popup and elements have more padding to allow for bigger touch targets.
         */
        this.touchUi = false;
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
    Object.defineProperty(MdDatetimepicker.prototype, "startAt", {
        /** The date to open the calendar to initially. */
        get: function () {
            // If an explicit startAt is set we start there, otherwise we start at whatever the currently
            // selected value is.
            return this._startAt || (this._datetimepickerInput ? this._datetimepickerInput.value : null);
        },
        set: function (date) { this._startAt = date; },
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
    Object.defineProperty(MdDatetimepicker.prototype, "timepickerAttrs", {
        get: function () {
            return this._timepickerAttrs;
        },
        set: function (v) {
            if (v) {
                this._timepickerAttrs = v;
            }
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
    /** Selects the given date and closes the currently open popup or dialog. */
    MdDatetimepicker.prototype._selectAndClose = function (date) {
        this._selected = date;
        this.selectedChanged.emit(date);
        this.close();
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
        this._inputSubscription = this._datetimepickerInput._valueChange.subscribe(function (value) { _this._selected = value; });
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
        this.timepickerAttrs = this._datetimepickerInput.timeViewAttrs;
        console.log(this.timepickerAttrs);
        this.touchUi ? this._openAsDialog() : this._openAsPopup();
        this.opened = true;
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
    'startAt': [{ type: Input },],
    'startView': [{ type: Input },],
    'touchUi': [{ type: Input },],
    'selectedChanged': [{ type: Output },],
};
//# sourceMappingURL=datetimepicker.js.map