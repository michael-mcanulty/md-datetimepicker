/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  NgZone,
  Optional,
  Output,
  ViewEncapsulation,
  ViewChild
} from '@angular/core';
import {
  DOWN_ARROW,
  END,
  ENTER,
  HOME,
  LEFT_ARROW,
  PAGE_DOWN,
  PAGE_UP,
  RIGHT_ARROW,
  UP_ARROW,
  MATERIAL_COMPATIBILITY_MODE,
  MD_DATE_FORMATS,
  MdDateFormats
}
from '@angular/material';
import {MdDatetimepickerIntl} from './datetimepicker-intl';
import {createMissingDateImplError} from './datetimepicker-errors';
import {DateAdapter} from './native-date-module/index';

/**
 * A calendar that is used as part of the datetimepicker.
 * @docs-private
 */

@Component({
  selector: 'md-calendar',
  template: `<div class="mat-calendar-header"> <div class="mat-calendar-controls"><button *ngIf="!_isCompatibilityMode" md-button class="mat-calendar-period-button" (click)="_currentPeriodClicked()" [attr.aria-label]="_periodButtonLabel">{{_periodButtonText}}<div class="mat-calendar-arrow" [class.mat-calendar-invert]="!_monthView"></div></button> <button *ngIf="_isCompatibilityMode" mat-button class="mat-calendar-period-button" (click)="_currentPeriodClicked()" [attr.aria-label]="_periodButtonLabel">{{_periodButtonText}}<div class="mat-calendar-arrow" [class.mat-calendar-invert]="!_monthView"></div></button> <div class="mat-calendar-spacer"></div><button *ngIf="!_isCompatibilityMode" md-icon-button class="mat-calendar-previous-button" [disabled]="!_previousEnabled()" (click)="_previousClicked()" [attr.aria-label]="_prevButtonLabel"> </button> <button *ngIf="_isCompatibilityMode" mat-icon-button class="mat-calendar-previous-button" [disabled]="!_previousEnabled()" (click)="_previousClicked()" [attr.aria-label]="_prevButtonLabel"> </button> <button *ngIf="!_isCompatibilityMode" md-icon-button class="mat-calendar-next-button" [disabled]="!_nextEnabled()" (click)="_nextClicked()" [attr.aria-label]="_nextButtonLabel"> </button> <button *ngIf="_isCompatibilityMode" mat-icon-button class="mat-calendar-next-button" [disabled]="!_nextEnabled()" (click)="_nextClicked()" [attr.aria-label]="_nextButtonLabel"> </button> </div></div><div class="mat-calendar-content" (keydown)="_handleCalendarBodyKeydown($event)" (swipeleft)="_previousClicked()" (swiperight)="_nextClicked()" [ngSwitch]="_monthView" cdkMonitorSubtreeFocus> <md-month-view *ngSwitchCase="true" [activeDate]="_activeDate" [selected]="selected" [dateFilter]="_dateFilterForViews" (selectedChange)="_dateSelected($event)"> </md-month-view> <md-year-view *ngSwitchDefault [activeDate]="_activeDate" [selected]="selected" [dateFilter]="_dateFilterForViews" (selectedChange)="_monthSelected($event)"> </md-year-view> <md-time-view *ngIf="!hideTime" [selected]="selected" (selectedChange)="_timeSelected($event)"> </md-time-view> </div><div class="mat-calendar-footer"> <button md-button (click)="_closeDialog()">Cancel</button> <button md-button [disabled]="!selected" (click)="_dateComplete()">Submit</button></div>`,
  styles: [`.mat-calendar{display: block;}.mat-calendar-header{padding: 8px 8px 0 8px;}.mat-calendar-content{padding: 0 8px 0 8px;outline: none;}.mat-calendar-controls{display: flex;padding: 5% calc(100% / 14 - 22px) 5% calc(100% / 14 - 22px);}.mat-calendar-spacer{flex: 1 1 auto;}.mat-calendar-period-button{min-width: 0;}.mat-calendar-arrow{display: inline-block;width: 0;height: 0;border-left: 5px solid transparent;border-right: 5px solid transparent;border-top-width: 5px;border-top-style: solid;margin: 0 0 0 5px;vertical-align: middle;}.mat-calendar-arrow.mat-calendar-invert{transform: rotate(180deg);}[dir='rtl'] .mat-calendar-arrow{margin: 0 5px 0 0;}.mat-calendar-down-button,.mat-calendar-up-button,.mat-calendar-previous-button,.mat-calendar-next-button{position: relative;}.mat-calendar-down-button::after, .mat-calendar-up-button::after, .mat-calendar-previous-button::after, .mat-calendar-next-button::after{content: '';position: absolute;top: 0;left: 0;bottom: 0;right: 0;margin: 15.5px;border: 0 solid currentColor;border-top-width: 2px;}[dir='rtl'] .mat-calendar-down-button, [dir='rtl'] .mat-calendar-up-button, [dir='rtl'] .mat-calendar-previous-button, [dir='rtl'] .mat-calendar-next-button{transform: rotate(180deg);}.mat-calendar-previous-button::after{border-left-width: 2px;transform: translateX(2px) rotate(-45deg);}.mat-calendar-next-button::after{border-right-width: 2px;transform: translateX(-2px) rotate(45deg);}.mat-calendar-up-button::after{border-right-width: 2px;transform: translateX(1px) translateY(2px) rotate(315deg);}.mat-calendar-down-button::after{border-right-width: 2px;transform: translateX(1px) rotate(135deg);}.mat-calendar-table{border-spacing: 0;border-collapse: collapse;width: 100%;}.mat-calendar-table-header th{text-align: center;padding: 0 0 8px 0;}.mat-calendar-table-header-divider{position: relative;height: 1px;}.mat-calendar-table-header-divider::after{content: '';position: absolute;top: 0;left: -8px;right: -8px;height: 1px;}.mat-calendar-footer{display: flex;flex-direction: row;justify-content: flex-end;padding: 10px;}.mat-time-container{display: flex;justify-content: flex-end;align-items: center;margin: 0 10px;}.mat-time-button-wrapper{display: flex;flex-direction: column;flex-grow: 0;}.mat-time-button{width: 40px;height: 40px;}.mat-time-spacer-wrapper{display: flex;flex-direction: column;flex-grow: 0;width: 25px;}.mat-time-display{text-align: center;font-family: Roboto,"Helvetica Neue",sans-serif;width: 40px;height: 27px;color: rgba(0, 0, 0, 0.84);font-size: 14px;font-weight: 500;display: flex;justify-content: center;}.mat-time-colon{text-align: center;font-size: 16px;}.mat-time-colon-wrapper{width: 25px;height: 30px;display: flex;justify-content: center;}.mat-time-spacer{width: 25px;height: 40px;}.mat-button-spacer-wrapper{width: 25px;height: 40px;}.mat-display-spacer-wrapper{width: 25px;height: 40px;}#md-datepicker-0 > div.mat-calendar-content > md-month-view > table{margin-bottom: 8px;}.mat-time-input{text-align: center;border: none;width: 18px;outline: none;}.mat-time-ampm{min-width: 48px !important;line-height: 25px !important;}.time-minutes{margin-right: 10px;}md-dialog-container{padding:0 !important;}.mat-dialog-container{max-width: 100vw !important;}`],
  host: {
    'class': 'mat-calendar',
  },
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MdCalendar<D> implements AfterContentInit {

  /** Whether the calendar should be started in month or year view. */
  @Input() startView: 'month' | 'year' = 'month';

  /** The currently selected date. */
  @Input() selected: D;

  /** The minimum selectable date. */
  @Input() minDate: D;

  /** The maximum selectable date. */
  @Input() maxDate: D;

  /** A function used to filter which dates are selectable. */
  @Input() dateFilter: (date: D) => boolean;

  /** Date filter for the month and year views. */
  _dateFilterForViews = (date: D) => {
    return !!date &&
        (!this.dateFilter || this.dateFilter(date)) &&
        (!this.minDate || this._dateAdapter.compareDate(date, this.minDate) >= 0) &&
        (!this.maxDate || this._dateAdapter.compareDate(date, this.maxDate) <= 0);
  }

  /**
   * The current active date. This determines which time period is shown and which date is
   * highlighted when using keyboard navigation.
   */
  get _activeDate(): D { return this._clampedActiveDate; }
  set _activeDate(value: D) {
    this._clampedActiveDate = this._dateAdapter.clampDate(value, this.minDate, this.maxDate);
  }
  private _clampedActiveDate: D;

 /** Set as datepicker only; No timepicker*/
  @Input()
  get hideTime():boolean{
    return this._hideTime;
  }
  set hideTime(value:boolean){
    this._hideTime = value;
  }
  private _hideTime:boolean;
  
  /** Whether the calendar is in month view. */
  _monthView: boolean;

 /** The date to open the calendar to initially. */
  @Input()
  get date(): D {
    // If an explicit startAt is set we start there, otherwise we start at whatever the currently
    // selected value is.
    return this._date;
  }
  set date(date: D) {
    this._date = date;
  }
  private _date: D;

  /** The label for the current calendar view. */
  get _periodButtonText(): string {
    return this._monthView ?
        this._dateAdapter.format(this._activeDate, this._dateFormats.display.monthYearLabel)
            .toLocaleUpperCase() :
        this._dateAdapter.getYearName(this._activeDate);
  }

  get _periodButtonLabel(): string {
    return this._monthView ? this._intl.switchToYearViewLabel : this._intl.switchToMonthViewLabel;
  }

  /** The label for the the previous button. */
  get _prevButtonLabel(): string {
    return this._monthView ? this._intl.prevMonthLabel : this._intl.prevYearLabel;
  }

  /** The label for the the next button. */
  get _nextButtonLabel(): string {
    return this._monthView ? this._intl.nextMonthLabel : this._intl.nextYearLabel;
  }

  /** The label for the the hours increase button. */
  get _increaseHoursButtonLabel(): string {
    return this._intl.increaseHoursButtonLabel;
  }

  /** The label for th hours decrease button. */
  get _decreaseHoursButtonLabel(): string {
    return this._intl.decreaseHoursButtonLabel;
  }

  /** The label for the minutes increase button. */
  get _increaseMinutesButtonLabel(): string {
    return this._intl.increaseMinutesButtonLabel;
  }

  /** The label for the minutes increase button. */
  get _idecreaseMinutesButtonLabel(): string {
    return this._intl.decreaseMinutesButtonLabel;
  }

  /** The label for displaying AM or PM */
  get _ampmButtonLabel(): string {
    return this._intl.ampmButtonLabel;
  }

  constructor(private _elementRef: ElementRef,
              private _intl: MdDatetimepickerIntl,
              private _ngZone: NgZone,
              @Optional() @Inject(MATERIAL_COMPATIBILITY_MODE) public _isCompatibilityMode: boolean,
              @Optional() private _dateAdapter: DateAdapter<D>,
              @Optional() @Inject(MD_DATE_FORMATS) private _dateFormats: MdDateFormats) {
    if (!this._dateAdapter) {
      throw createMissingDateImplError('DateAdapter');
    }
    if (!this._dateFormats) {
      throw createMissingDateImplError('MD_DATE_FORMATS');
    }
  }

  ngAfterContentInit() {
    let  today = new Date();
    this._activeDate = this.date || this._dateAdapter.today();
    this._focusActiveCell();
    this._monthView = this.startView != 'year';
    this._dateSelected(this._activeDate);
    this.selected = this._activeDate;
  }

  /** Handles month selection in the year view. */
  _monthSelected(month: D): void {
    this._activeDate = month;
    this._monthView = true;
  }

  /** Handles user clicks on the period label. */
  _currentPeriodClicked(): void {
    this._monthView = !this._monthView;
  }

  /** Handles user clicks on the previous button. */
  _previousClicked(): void {
    this._activeDate = this._monthView ?
        this._dateAdapter.addCalendarMonths(this._activeDate, -1) :
        this._dateAdapter.addCalendarYears(this._activeDate, -1);
  }

  /** Handles user clicks on the next button. */
  _nextClicked(): void {
    this._activeDate = this._monthView ?
        this._dateAdapter.addCalendarMonths(this._activeDate, 1) :
        this._dateAdapter.addCalendarYears(this._activeDate, 1);
  }

  /** Whether the previous period button is enabled. */
  _previousEnabled(): boolean {
    if (!this.minDate) {
      return true;
    }
    return !this.minDate || !this._isSameView(this._activeDate, this.minDate);
  }

  /** Whether the next period button is enabled. */
  _nextEnabled(): boolean {
    return !this.maxDate || !this._isSameView(this._activeDate, this.maxDate);
  }

  /** Handles keydown events on the calendar body. */
  _handleCalendarBodyKeydown(event: KeyboardEvent): void {
    // TODO(mmalerba): We currently allow keyboard navigation to disabled dates, but just prevent
    // disabled ones from being selected. This may not be ideal, we should look into whether
    // navigation should skip over disabled dates, and if so, how to implement that efficiently.
    if (this._monthView) {
      this._handleCalendarBodyKeydownInMonthView(event);
    } else {
      this._handleCalendarBodyKeydownInYearView(event);
    }
  }

  /** Focuses the active cell after the microtask queue is empty. */
  _focusActiveCell() {
    this._ngZone.runOutsideAngular(() => this._ngZone.onStable.first().subscribe(() => {
      let activeEl = this._elementRef.nativeElement.querySelector('.mat-calendar-body-active');
      activeEl.focus();
    }));
  }

  /** Whether the two dates represent the same view in the current view mode (month or year). */
  private _isSameView(date1: D, date2: D): boolean {
    return this._monthView ?
        this._dateAdapter.getYear(date1) == this._dateAdapter.getYear(date2) &&
        this._dateAdapter.getMonth(date1) == this._dateAdapter.getMonth(date2) :
        this._dateAdapter.getYear(date1) == this._dateAdapter.getYear(date2);
  }

  /** Handles keydown events on the calendar body when calendar is in month view. */
  private _handleCalendarBodyKeydownInMonthView(event: KeyboardEvent): void {
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
        this._activeDate = this._dateAdapter.addCalendarDays(this._activeDate,
            1 - this._dateAdapter.getDate(this._activeDate));
        break;
      case END:
        this._activeDate = this._dateAdapter.addCalendarDays(this._activeDate,
            (this._dateAdapter.getNumDaysInMonth(this._activeDate) -
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
  }

  /** Handles keydown events on the calendar body when calendar is in year view. */
  private _handleCalendarBodyKeydownInYearView(event: KeyboardEvent): void {
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
        this._activeDate = this._dateAdapter.addCalendarMonths(this._activeDate,
            -this._dateAdapter.getMonth(this._activeDate));
        break;
      case END:
        this._activeDate = this._dateAdapter.addCalendarMonths(this._activeDate,
            11 - this._dateAdapter.getMonth(this._activeDate));
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
  }

  /**
   * Determine the date for the month that comes before the given month in the same column in the
   * calendar table.
   */
   
  private _prevMonthInSameCol(date: D): D {
    // Determine how many months to jump forward given that there are 2 empty slots at the beginning
    // of each year.
    let increment = this._dateAdapter.getMonth(date) <= 4 ? -5 :
        (this._dateAdapter.getMonth(date) >= 7 ? -7 : -12);
    return this._dateAdapter.addCalendarMonths(date, increment);
  }

  /**
   * Determine the date for the month that comes after the given month in the same column in the
   * calendar table.
   */

  private _nextMonthInSameCol(date: D): D {
    // Determine how many months to jump forward given that there are 2 empty slots at the beginning
    // of each year.
    let increment = this._dateAdapter.getMonth(date) <= 4 ? 7 :
        (this._dateAdapter.getMonth(date) >= 7 ? 5 : 12);
    return this._dateAdapter.addCalendarMonths(date, increment);
  }

  /** Emits when the currently selected date changes. */
  @Output() selectedChange = new EventEmitter<D>();

  @Output() closeDialog: EventEmitter<boolean> = new EventEmitter<boolean>();
  
  _closeDialog(): void {
    this.closeDialog.emit(true);
  }

  /** Handles date selection in the month view. */
  _dateSelected(date: D): void {
    if (!this._dateAdapter.sameDate(date, this.selected)) {
      this.selected = date;
    }
  }

  _timeSelected(date: D): void {
    this.selected = date;
  }

   /** Handles date selection in the month view. */
  _dateComplete(): void {
    if(this.selected){
      this.selectedChange.emit(this.selected);
    }
  }
}