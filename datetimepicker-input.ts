/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {
  AfterContentInit,
  Directive,
  ElementRef,
  EventEmitter,
  forwardRef,
  Inject,
  Input,
  Output,
  OnDestroy,
  Optional,
  Renderer2,
  OnChanges
} from '@angular/core';
import {MdDatetimepicker} from './datetimepicker';
import {
  AbstractControl,
  ControlValueAccessor,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator,
  ValidatorFn,
  Validators
} from '@angular/forms';
import {Subscription} from 'rxjs/Subscription';
import {MdInputContainer, DOWN_ARROW, MD_DATE_FORMATS, MdDateFormats} from '@angular/material';
import {DateAdapter} from './native-date-module/index';
import {createMissingDateImplError} from './datetimepicker-errors';

export const MD_DATEPICKER_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => MdDatetimepickerInput),
  multi: true
};


export const MD_DATEPICKER_VALIDATORS: any = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => MdDatetimepickerInput),
  multi: true
};


/** Directive used to connect an input to a MdDatetimepicker. */
@Directive({
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
})
export class MdDatetimepickerInput<D> implements AfterContentInit, ControlValueAccessor, OnDestroy,
    Validator {
      /** The datetimepicker that this input is associated with. */
      @Input()
      set MdDatetimepicker(value: MdDatetimepicker<D>) {
        if (value) {
          this._datetimepicker = value;
          this._datetimepicker._registerInput(this);
        }
      }
  _datetimepicker: MdDatetimepicker<D>;

  /** Check if the device is a touch Ui. */
  isTouch():boolean{
    return ("ontouchstart" in document.documentElement)?true:false;
  }

  @Input() set matDatetimepicker(value: MdDatetimepicker<D>) {
    this.MdDatetimepicker = value;
  }

  @Input() set MdDatetimepickerFilter(filter: (date: D | null) => boolean) {
    this._dateFilter = filter;
    this._validatorOnChange();
  }

  _dateFilter: (date: D | null) => boolean;

  @Input() set matDatepickerFilter(filter: (date: D | null) => boolean) {
    this.MdDatetimepickerFilter = filter;
  }

  /** The date to open the calendar to initially. */
  @Input()
  get date(): D {
    // If an explicit date is set we start there, otherwise we start at whatever the currently
    // selected value is.
    return this._date;
  }
  set date(date: D) {
    this._date = date;
    this.value = date;
  }
  private _date: D;

  /** Set as datepicker only; No timepicker*/
  get hideTime():boolean{
    return this._hideTime;
  }
  set hideTime(value:boolean){
    this._hideTime = value;
  }
  private _hideTime:boolean;

  dateFormatting(isParse:boolean){
    let _input = (this.hideTime)?'dateInput':'datetimeInput';
    if(this._dateFormats && isParse){
      return this._dateFormats.parse[_input];
    }else if(this._dateFormats && !isParse){
      return this._dateFormats.display[_input];
    }
  }

  /** The value of the input. */
  @Input()
  get value(): D {
    let parse_format = this.dateFormatting(true);
    return this._dateAdapter.parse(this._elementRef.nativeElement.value, parse_format);
  }
  set value(value: D) {
    let parse_format = this.dateFormatting(true);
    let display_format = this.dateFormatting(false);
    let date = this._dateAdapter.parse(value, parse_format);
    let oldDate = this.value;
    this._renderer.setProperty(this._elementRef.nativeElement, 'value',
        date ? this._dateAdapter.format(date, display_format) : '');
    if (!this._dateAdapter.sameDate(oldDate, date)) {
      this._valueChange.emit(date);
    }
  }

  /** Enables touchUi by calling isTouch() method that looks for the presence of "ontouchstart" event on the document Element **/
  get touch(): boolean { return this._touch; }
  set touch(value: boolean) {
    this._touch = value;
  }
  private _touch: boolean;

  /** The minimum valid date. */
  @Input()
  get min(): D { return this._min; }
  set min(value: D) {
    this._min = value;
    this._validatorOnChange();
  }
  private _min: D;

  /** The maximum valid date. */
  @Input()
  get max(): D { return this._max; }
  set max(value: D) {
    this._max = value;
    this._validatorOnChange();
  }
  private _max: D;

  /** Emits when the value changes (either due to user input or programmatic change). */
  _valueChange = new EventEmitter<D>();

  _onTouched = () => {};

  private _cvaOnChange: (value: any) => void = () => {};

  private _validatorOnChange = () => {};

  private _datetimepickerSubscription: Subscription;

  /** The form control validator for the min date. */
  private _minValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    return (!this.min || !control.value ||
        this._dateAdapter.compareDate(this.min, control.value) <= 0) ?
        null : {'MdDatetimepickerMin': {'min': this.min, 'actual': control.value}};
  }

  /** The form control validator for the max date. */
  private _maxValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    return (!this.max || !control.value ||
        this._dateAdapter.compareDate(this.max, control.value) >= 0) ?
        null : {'MdDatetimepickerMax': {'max': this.max, 'actual': control.value}};
  }

  /** The form control validator for the date filter. */
  private _filterValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    return !this._dateFilter || !control.value || this._dateFilter(control.value) ?
        null : {'MdDatetimepickerFilter': true};
  }

  /** The combined form control validator for this input. */
  private _validator: ValidatorFn = Validators.compose([this._minValidator, this._maxValidator, this._filterValidator]);

  constructor(
      private _elementRef: ElementRef,
      private _renderer: Renderer2,
      @Optional() private _dateAdapter: DateAdapter<D>,
      @Optional() @Inject(MD_DATE_FORMATS) private _dateFormats: MdDateFormats,
      @Optional() private _mdInputContainer: MdInputContainer) {
      if (!this._dateAdapter) {
        throw createMissingDateImplError('DateAdapter');
      }
      if (!this._dateFormats) {
        throw createMissingDateImplError('MD_DATE_FORMATS');
      }
  }

  ngAfterContentInit() {
    if (this._datetimepicker) {
        this.touch = this.isTouch();
        this._datetimepickerSubscription = this._datetimepicker.selectedChanged.subscribe((selected: D) => {
          this.value = selected;
          this._cvaOnChange(selected);
        });
    }
  }

  ngOnDestroy() {
    if (this._datetimepickerSubscription) {
      this._datetimepickerSubscription.unsubscribe();
    }
  }

  registerOnValidatorChange(fn: () => void): void {
    this._validatorOnChange = fn;
  }

  validate(c: AbstractControl): ValidationErrors | null {
    return this._validator ? this._validator(c) : null;
  }

 /**
 * Gets the element that the datetimepicker popup should be connected to.
 * @return The element to connect the popup to.
 */
  getPopupConnectionElementRef(): ElementRef {
    return this._mdInputContainer ? this._mdInputContainer.underlineRef : this._elementRef;
  }

  // Implemented as part of ControlValueAccessor
  writeValue(value: D): void {
    this.value = value;
  }

  // Implemented as part of ControlValueAccessor
  registerOnChange(fn: (value: any) => void): void {
    this._cvaOnChange = fn;
  }

  // Implemented as part of ControlValueAccessor
  registerOnTouched(fn: () => void): void {
    this._onTouched = fn;
  }

  // Implemented as part of ControlValueAccessor
  setDisabledState(disabled: boolean): void {
    this._renderer.setProperty(this._elementRef.nativeElement, 'disabled', disabled);
  }

  _onKeydown(event: KeyboardEvent) {
    if (event.altKey && event.keyCode === DOWN_ARROW) {
      this._datetimepicker.open();
      event.preventDefault();
    }
  }

  _onInput(value: string) {
    let date = this._dateAdapter.parse(value, this._dateFormats.parse.dateInput);
    this._cvaOnChange(date);
    this.date = date;
    this._valueChange.emit(date);
  }
}
