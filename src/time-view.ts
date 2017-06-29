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
  templateUrl: 'time-view.html',
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
