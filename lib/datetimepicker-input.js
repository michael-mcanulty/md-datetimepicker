/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Directive, ElementRef, EventEmitter, forwardRef, Inject, Input, Optional, Renderer2 } from '@angular/core';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import { MdInputContainer, DOWN_ARROW, MD_DATE_FORMATS } from '@angular/material';
import { DateAdapter } from './native-date-module/index';
import { createMissingDateImplError } from './datetimepicker-errors';
export var MD_DATEPICKER_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(function () { return MdDatetimepickerInput; }),
    multi: true
};
export var MD_DATEPICKER_VALIDATORS = {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(function () { return MdDatetimepickerInput; }),
    multi: true
};
/** Directive used to connect an input to a MdDatetimepicker. */
var MdDatetimepickerInput = (function () {
    function MdDatetimepickerInput(_elementRef, _renderer, _dateAdapter, _dateFormats, _mdInputContainer) {
        var _this = this;
        this._elementRef = _elementRef;
        this._renderer = _renderer;
        this._dateAdapter = _dateAdapter;
        this._dateFormats = _dateFormats;
        this._mdInputContainer = _mdInputContainer;
        /** Emits when the value changes (either due to user input or programmatic change). */
        this._valueChange = new EventEmitter();
        this._onTouched = function () { };
        this._cvaOnChange = function () { };
        this._validatorOnChange = function () { };
        /** The form control validator for the min date. */
        this._minValidator = function (control) {
            return (!_this.min || !control.value ||
                _this._dateAdapter.compareDate(_this.min, control.value) <= 0) ?
                null : { 'MdDatetimepickerMin': { 'min': _this.min, 'actual': control.value } };
        };
        /** The form control validator for the max date. */
        this._maxValidator = function (control) {
            return (!_this.max || !control.value ||
                _this._dateAdapter.compareDate(_this.max, control.value) >= 0) ?
                null : { 'MdDatetimepickerMax': { 'max': _this.max, 'actual': control.value } };
        };
        /** The form control validator for the date filter. */
        this._filterValidator = function (control) {
            return !_this._dateFilter || !control.value || _this._dateFilter(control.value) ?
                null : { 'MdDatetimepickerFilter': true };
        };
        /** The combined form control validator for this input. */
        this._validator = Validators.compose([this._minValidator, this._maxValidator, this._filterValidator]);
        if (!this._dateAdapter) {
            throw createMissingDateImplError('DateAdapter');
        }
        if (!this._dateFormats) {
            throw createMissingDateImplError('MD_DATE_FORMATS');
        }
    }
    Object.defineProperty(MdDatetimepickerInput.prototype, "MdDatetimepicker", {
        /** The datetimepicker that this input is associated with. */
        set: function (value) {
            if (value) {
                this._datetimepicker = value;
                this._datetimepicker._registerInput(this);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdDatetimepickerInput.prototype, "matDatetimepicker", {
        set: function (value) {
            this.MdDatetimepicker = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdDatetimepickerInput.prototype, "MdDatetimepickerFilter", {
        set: function (filter) {
            this._dateFilter = filter;
            this._validatorOnChange();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdDatetimepickerInput.prototype, "matDatepickerFilter", {
        set: function (filter) {
            this.MdDatetimepickerFilter = filter;
        },
        enumerable: true,
        configurable: true
    });
    MdDatetimepickerInput.prototype._dateFormatting = function (isParse) {
        var _input = (this._timeViewAttrs.hideTime) ? 'dateInput' : 'datetimeInput';
        if (this._dateFormats && isParse) {
            return this._dateFormats.parse[_input];
        }
        else if (this._dateFormats && !isParse) {
            return this._dateFormats.display[_input];
        }
    };
    Object.defineProperty(MdDatetimepickerInput.prototype, "value", {
        /** The value of the input. */
        get: function () {
            var parse_format = this._dateFormatting(true);
            return this._dateAdapter.parse(this._elementRef.nativeElement.value, parse_format);
        },
        set: function (value) {
            var parse_format = this._dateFormatting(true);
            var display_format = this._dateFormatting(false);
            var date = this._dateAdapter.parse(value, parse_format);
            var oldDate = this.value;
            this._renderer.setProperty(this._elementRef.nativeElement, 'value', date ? this._dateAdapter.format(date, display_format) : '');
            if (!this._dateAdapter.sameDate(oldDate, date)) {
                this._valueChange.emit(date);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdDatetimepickerInput.prototype, "min", {
        /** The minimum valid date. */
        get: function () { return this._min; },
        set: function (value) {
            this._min = value;
            this._validatorOnChange();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdDatetimepickerInput.prototype, "max", {
        /** The maximum valid date. */
        get: function () { return this._max; },
        set: function (value) {
            this._max = value;
            this._validatorOnChange();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdDatetimepickerInput.prototype, "timeViewAttrs", {
        get: function () {
            return this._timeViewAttrs;
        },
        set: function (value) {
            this._timeViewAttrs = value;
        },
        enumerable: true,
        configurable: true
    });
    MdDatetimepickerInput.prototype.ngAfterContentInit = function () {
        var _this = this;
        if (this._datetimepicker) {
            var _attrs = {};
            var hide = this._elementRef.nativeElement.getAttribute('hide-time');
            if (hide === 'false') {
                _attrs.hideTime = false;
            }
            else {
                _attrs.hideTime = Boolean(this._elementRef.nativeElement.getAttribute('hide-time'));
            }
            _attrs.defaultHour = parseInt(this._elementRef.nativeElement.getAttribute('hour')) || new Date().getHours();
            _attrs.defaultMinute = parseInt(this._elementRef.nativeElement.getAttribute('minute')) || new Date().getMinutes();
            this.timeViewAttrs = _attrs;
            this._datetimepickerSubscription = this._datetimepicker.selectedChanged.subscribe(function (selected) {
                _this.value = selected;
                _this._cvaOnChange(selected);
            });
        }
    };
    MdDatetimepickerInput.prototype.ngOnDestroy = function () {
        if (this._datetimepickerSubscription) {
            this._datetimepickerSubscription.unsubscribe();
        }
    };
    MdDatetimepickerInput.prototype.registerOnValidatorChange = function (fn) {
        this._validatorOnChange = fn;
    };
    MdDatetimepickerInput.prototype.validate = function (c) {
        return this._validator ? this._validator(c) : null;
    };
    /**
    * Gets the element that the datetimepicker popup should be connected to.
    * @return The element to connect the popup to.
    */
    MdDatetimepickerInput.prototype.getPopupConnectionElementRef = function () {
        return this._mdInputContainer ? this._mdInputContainer.underlineRef : this._elementRef;
    };
    // Implemented as part of ControlValueAccessor
    MdDatetimepickerInput.prototype.writeValue = function (value) {
        this.value = value;
    };
    // Implemented as part of ControlValueAccessor
    MdDatetimepickerInput.prototype.registerOnChange = function (fn) {
        this._cvaOnChange = fn;
    };
    // Implemented as part of ControlValueAccessor
    MdDatetimepickerInput.prototype.registerOnTouched = function (fn) {
        this._onTouched = fn;
    };
    // Implemented as part of ControlValueAccessor
    MdDatetimepickerInput.prototype.setDisabledState = function (disabled) {
        this._renderer.setProperty(this._elementRef.nativeElement, 'disabled', disabled);
    };
    MdDatetimepickerInput.prototype._onKeydown = function (event) {
        if (event.altKey && event.keyCode === DOWN_ARROW) {
            this._datetimepicker.open();
            event.preventDefault();
        }
    };
    MdDatetimepickerInput.prototype._onInput = function (value) {
        var date = this._dateAdapter.parse(value, this._dateFormats.parse.dateInput);
        this._cvaOnChange(date);
        this._valueChange.emit(date);
    };
    return MdDatetimepickerInput;
}());
export { MdDatetimepickerInput };
MdDatetimepickerInput.decorators = [
    { type: Directive, args: [{
                selector: 'input[MdDatetimepicker], input[matDatetimepicker]',
                providers: [MD_DATEPICKER_VALUE_ACCESSOR, MD_DATEPICKER_VALIDATORS],
                host: {
                    '[attr.aria-expanded]': '_datetimepicker?.opened || "false"',
                    '[attr.aria-haspopup]': 'true',
                    '[attr.aria-owns]': '_datetimepicker?.id',
                    '[attr.min]': 'min ? _dateAdapter.getISODateString(min) : null',
                    '[attr.max]': 'max ? _dateAdapter.getISODateString(max) : null',
                    '(input)': '_onInput($event.target.value)',
                    '(blur)': '_onTouched()',
                    '(keydown)': '_onKeydown($event)',
                }
            },] },
];
/** @nocollapse */
MdDatetimepickerInput.ctorParameters = function () { return [
    { type: ElementRef, },
    { type: Renderer2, },
    { type: DateAdapter, decorators: [{ type: Optional },] },
    { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [MD_DATE_FORMATS,] },] },
    { type: MdInputContainer, decorators: [{ type: Optional },] },
]; };
MdDatetimepickerInput.propDecorators = {
    'MdDatetimepicker': [{ type: Input },],
    'matDatetimepicker': [{ type: Input },],
    'MdDatetimepickerFilter': [{ type: Input },],
    'matDatepickerFilter': [{ type: Input },],
    'value': [{ type: Input },],
    'min': [{ type: Input },],
    'max': [{ type: Input },],
    'timeViewAttrs': [{ type: Input },],
};
//# sourceMappingURL=datetimepicker-input.js.map