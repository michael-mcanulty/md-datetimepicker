/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Inject,
  Input,
  Optional,
  AfterContentInit,
  Output,
  ViewEncapsulation,
  OnChanges,
  Host
} from '@angular/core';
import {MdCalendar} from './calendar';
import {createMissingDateImplError} from './datetimepicker-errors';
import {TimepickerAttrs} from './timepicker-attrs';
import {DateAdapter} from './native-date-module/index';
import {MD_DATE_FORMATS, MdDateFormats} from '@angular/material';

/**
 * An internal component used to display a single month in the datetimepicker.
 * @docs-private
 */
@Component({
  selector: 'md-time-view',
  template: `<table style="width:100%" cellspacing="0"> <tr><th class="mat-calendar-table-header-divider" colspan="7" aria-hidden="true"></th></tr></table><div class="mat-time-container"> <div class="mat-time-button-wrapper"> <div class="mat-time-button"> <button *ngIf="!_isCompatibilityMode" md-icon-button class="mat-calendar-up-button" (click)="_increaseHoursClicked()" [attr.aria-label]="_increaseHoursButtonLabel"> </button> <button *ngIf="_isCompatibilityMode" mat-icon-button class="mat-calendar-up-button" (click)="_increaseHoursClicked()" [attr.aria-label]="_increaseHoursButtonLabel"> </button> </div><div class="mat-time-display"> <input [value]="_getClockHrs(selected)" pattern="\d*" class="mat-time-input"/> </div><div class="mat-time-button"> <button *ngIf="!_isCompatibilityMode" md-icon-button class="mat-calendar-down-button" (click)="_decreaseHoursClicked()" [attr.aria-label]="_decreaseHoursButtonLabel"> </button> <button *ngIf="_isCompatibilityMode" mat-icon-button class="mat-calendar-down-button" (click)="_decreaseHoursClicked()" [attr.aria-label]="_decreaseHoursButtonLabel"> </button> </div></div><div class="mat-time-spacer-wrapper"> <div class="mat-button-spacer-wrapper"> </div><div class="mat-time-colon-wrapper"> <div class="mat-time-colon">:</div></div><div class="mat-button-spacer-wrapper"></div></div><div class="mat-time-button-wrapper time-minutes"> <div class="mat-time-button"> <button *ngIf="!_isCompatibilityMode" md-icon-button class="mat-calendar-up-button" (click)="_increaseMinutesClicked()" [attr.aria-label]="_increaseMinutesButtonLabel"> </button> <button *ngIf="_isCompatibilityMode" mat-icon-button class="mat-calendar-up-button" (click)="_increaseMinutesClicked()" [attr.aria-label]="_increaseMinutesButtonLabel"> </button> </div><div class="mat-time-display"> <input [value]="_getClockMins(selected)" pattern="\d*" class="mat-time-input"/> </div><div class="mat-time-button"> <button *ngIf="!_isCompatibilityMode" md-icon-button class="mat-calendar-down-button" (click)="_decreaseMinutesClicked()" [attr.aria-label]="_decreaseMinutesButtonLabel"> </button> <button *ngIf="_isCompatibilityMode" mat-icon-button class="mat-calendar-down-button" (click)="_decreaseMinutesClicked()" [attr.aria-label]="_decreaseMinutesButtonLabel"> </button> </div></div><div class="mat-time-button-wrapper" *ngIf="_dateAdapter.is12Hour()"> <button class="mat-raised-button mat-time-ampm" (click)="_pmClicked()" [attr.aria-label]="_ampmButtonLabel">{{ampm}}</button> </div></div>`,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MdTimeView<D> implements AfterContentInit {
  /** Emits when time is added to date. */
  @Output() selectedChange = new EventEmitter<D>();

  /** The date of the month that today falls on. Null if today is in another month. */
  private _selected: D;

  pm:boolean;
  _ampm:string;

  get ampm():string{
    return this._ampm;
  };

  set ampm(label:string){
    this._ampm = label;
  };
  
  @Input()
  get timepickerAttrs():TimepickerAttrs {
    return this._timepickerAttrs;
  }
  set timepickerAttrs(v : TimepickerAttrs) {
    this._timepickerAttrs = v;
  }
  private _timepickerAttrs: TimepickerAttrs;

  _getClockHrs():string{
    let time:string = this._dateAdapter.toLocaleTimeString(this._selected);
    let timeArr = time.split(":");
    return timeArr[0];
  }
  _getClockMins():string{
    let time:string = this._dateAdapter.toLocaleTimeString(this._selected);
    let timeArr = time.split(":");
    return timeArr[1];
  }
  /* Hours */
  _decreaseHoursClicked(){
    this._selected = this._dateAdapter.setHours(this._selected, this._dateAdapter.getHours(this._selected) - 1);
    this._timeSelected();
  }
  _increaseHoursClicked(){
    this._selected = this._dateAdapter.setHours(this._selected, this._dateAdapter.getHours(this._selected) + 1);
    this._timeSelected();
  }

  _increaseMinutesClicked(){
    this._selected = this._dateAdapter.setMinutes(this._selected, this._dateAdapter.getMinutes(this._selected) + 1);
    this._timeSelected();
  }
  _decreaseMinutesClicked(){
    this._selected = this._dateAdapter.setMinutes(this._selected, this._dateAdapter.getMinutes(this._selected) - 1);
    this._timeSelected();
  }
  /* PM */
  _pmClicked(){
    if(this.pm){
      this.ampm = "AM";
      this._selected = this._dateAdapter.setHours(this._selected, this._dateAdapter.getHours(this._selected) - 12);
    }else{
      this.ampm = "PM";
      this._selected = this._dateAdapter.setHours(this._selected, this._dateAdapter.getHours(this._selected) + 12);
    }
    this.pm = !this.pm;
    this._timeSelected();
  }

  constructor(@Host() private _calendar:MdCalendar<D>, @Optional() public _dateAdapter: DateAdapter<D>) { }

  /** The currently selected date. */
  @Input()
  get selected(): D { return this._selected; }
  set selected(value: D) {
    this._selected = value || this._dateAdapter.today();
  }

  ngAfterContentInit(){
    this.timepickerAttrs =  this._calendar.timepickerAttrs;
    this.timepickerAttrs =  this._calendar.timepickerAttrs;
    this.pm = this._dateAdapter.isPm(this._selected);
    this.ampm = (this.pm)?"PM":"AM";
  }

  ngOnChanges(){
    if(this.selected){
      if(this.ampm === "AM" && this._dateAdapter.isPm(this._selected)){
        this._selected = this._dateAdapter.setHours(this._selected, this._dateAdapter.getHours(this._selected) - 12);
      }else if(this.ampm === "PM" && !this._dateAdapter.isPm(this._selected)){
        this._selected = this._dateAdapter.setHours(this._selected, this._dateAdapter.getHours(this._selected) + 12);
      }
    }
  }

  _timeSelected():void{
    this.selectedChange.emit( this.selected );
  }
}
