/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { AfterContentInit, ElementRef, EventEmitter, OnDestroy, Renderer2 } from '@angular/core';
import { MdDatetimepicker } from './datetimepicker';
import { AbstractControl, ControlValueAccessor, ValidationErrors, Validator } from '@angular/forms';
import { TimepickerAttrs } from './timepicker-attrs';
import { MdInputContainer, MdDateFormats } from '@angular/material';
import { DateAdapter } from './native-date-module/index';
export declare const MD_DATEPICKER_VALUE_ACCESSOR: any;
export declare const MD_DATEPICKER_VALIDATORS: any;
/** Directive used to connect an input to a MdDatetimepicker. */
export declare class MdDatetimepickerInput<D> implements AfterContentInit, ControlValueAccessor, OnDestroy, Validator {
    private _elementRef;
    private _renderer;
    private _dateAdapter;
    private _dateFormats;
    private _mdInputContainer;
    /** The datetimepicker that this input is associated with. */
    MdDatetimepicker: MdDatetimepicker<D>;
    _datetimepicker: MdDatetimepicker<D>;
    matDatetimepicker: MdDatetimepicker<D>;
    MdDatetimepickerFilter: (date: D | null) => boolean;
    _dateFilter: (date: D | null) => boolean;
    matDatepickerFilter: (date: D | null) => boolean;
    private _dateFormatting(isParse);
    /** The value of the input. */
    value: D;
    /** The minimum valid date. */
    min: D;
    private _min;
    /** The maximum valid date. */
    max: D;
    private _max;
    timeViewAttrs: TimepickerAttrs;
    /** Emits when the value changes (either due to user input or programmatic change). */
    _valueChange: EventEmitter<D>;
    private _timeViewAttrs;
    _onTouched: () => void;
    private _cvaOnChange;
    private _validatorOnChange;
    private _datetimepickerSubscription;
    /** The form control validator for the min date. */
    private _minValidator;
    /** The form control validator for the max date. */
    private _maxValidator;
    /** The form control validator for the date filter. */
    private _filterValidator;
    /** The combined form control validator for this input. */
    private _validator;
    constructor(_elementRef: ElementRef, _renderer: Renderer2, _dateAdapter: DateAdapter<D>, _dateFormats: MdDateFormats, _mdInputContainer: MdInputContainer);
    ngAfterContentInit(): void;
    ngOnDestroy(): void;
    registerOnValidatorChange(fn: () => void): void;
    validate(c: AbstractControl): ValidationErrors | null;
    /**
    * Gets the element that the datetimepicker popup should be connected to.
    * @return The element to connect the popup to.
    */
    getPopupConnectionElementRef(): ElementRef;
    writeValue(value: D): void;
    registerOnChange(fn: (value: any) => void): void;
    registerOnTouched(fn: () => void): void;
    setDisabledState(disabled: boolean): void;
    _onKeydown(event: KeyboardEvent): void;
    _onInput(value: string): void;
}
