/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {ChangeDetectionStrategy, Component, Input, ViewEncapsulation, ElementRef, Renderer2, AfterContentInit} from '@angular/core';
import {MdDatetimepicker} from './datetimepicker';
import {MdDatetimepickerIntl} from './datetimepicker-intl';


@Component({
  selector: 'button[mdDatetimepickerToggle], button[matDatepickerToggle]',
  template: '',
  styleUrls: ['datetimepicker-toggle.css'],
  host: {
    'type': 'button',
    'class': 'mat-datepicker-toggle',
    '[attr.aria-label]': '_intl.openCalendarLabel',
    '(click)': '_open($event)',
  },
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MdDatetimepickerToggle<D> implements AfterContentInit {
  /** Datepicker instance that the button will toggle. */
  @Input('mdDatetimepickerToggle') datetimepicker: MdDatetimepicker<D>;
  @Input() hideTime:boolean;
  @Input() color:string;
  @Input('matDatetimepickerToggle')
  get _datetimepicker() { return this.datetimepicker; }
  set _datetimepicker(v: MdDatetimepicker<D>) { this.datetimepicker = v; }

  constructor(public _intl: MdDatetimepickerIntl, private _elm: ElementRef, private _renderer:Renderer2) {
    this._div = this._renderer.createElement('div');
    this._renderer.appendChild(this._elm.nativeElement, this._div);

  }
  private _div:HTMLElement;
  
  _setIcon(hideTime:boolean){
    let color = this.color;
    let _datetimeIcon = `<svg version="1.1" id="datetime" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
           viewBox="0 0 24 24" xml:space="preserve" style="fill: ${color}">
        <path d="M12.3,22c-4,0-8,0-12,0c0-6.3,0-12.6,0-18.9c0.9,0,1.9,0,2.8,0c0.5,2,1.3,2.7,2.6,2.7c1.4,0,2.1-0.8,2.6-2.7c2,0,4,0,6,0
          c0.4,1.9,1.2,2.8,2.6,2.7c1.4,0,2.2-0.9,2.5-2.7c0.9,0,1.8,0,2.8,0c0,3,0,6,0,9.1c-0.5-0.3-1-0.6-1.5-0.9c-0.1-0.1-0.1-0.3-0.1-0.5
          c0-0.8,0-1.6,0-2.5c-6.2,0-12.4,0-18.6,0c0,4.1,0,8.2,0,12.4c0.2,0,0.4,0,0.6,0c2.7,0,5.4,0,8.1,0c0.6,0,1,0.1,1.3,0.7
          C12,21.6,12.2,21.8,12.3,22z"/>
        <path d="M17.8,11.6c3.4,0,6.1,2.7,6.1,6c0,3.3-2.8,6-6.1,6c-3.3,0-6.1-2.7-6.1-6C11.7,14.3,14.4,11.6,17.8,11.6z M22.3,17.6
          c0-2.5-2-4.5-4.5-4.6c-2.5,0-4.6,2-4.6,4.5c0,2.5,2,4.6,4.6,4.6C20.3,22.2,22.3,20.1,22.3,17.6z"/>
        <path d="M15.2,2.6c0-0.3,0-0.5,0-0.8c0.1-0.9,0.7-1.6,1.6-1.6c0.9,0,1.6,0.6,1.6,1.6c0,0.5,0,1,0,1.6c-0.1,0.9-0.7,1.6-1.6,1.6
          c-0.9,0-1.6-0.7-1.6-1.6C15.2,3.1,15.2,2.8,15.2,2.6z"/>
        <path d="M7.3,2.6c0,0.4,0,0.8-0.1,1.2C7,4.5,6.3,4.9,5.6,4.9c-0.7,0-1.4-0.5-1.5-1.2C4,3,4,2.3,4.1,1.6c0.1-0.8,0.8-1.4,1.6-1.4
          c0.8,0,1.5,0.6,1.6,1.5C7.3,2,7.3,2.3,7.3,2.6C7.3,2.6,7.3,2.6,7.3,2.6z"/>
        <path d="M6.3,13.5c0,0.8,0,1.5,0,2.2c-0.7,0-1.5,0-2.2,0c0-0.7,0-1.4,0-2.2C4.8,13.5,5.5,13.5,6.3,13.5z"/>
        <path d="M8.2,13.5c0.8,0,1.5,0,2.2,0c0,0.7,0,1.4,0,2.2c-0.7,0-1.4,0-2.2,0C8.2,14.9,8.2,14.2,8.2,13.5z"/>
        <path d="M4.1,19.1c0-0.7,0-1.4,0-2.2c0.7,0,1.5,0,2.2,0c0,0.7,0,1.4,0,2.2C5.6,19.1,4.9,19.1,4.1,19.1z"/>
        <path d="M10.4,19.1c-0.7,0-1.5,0-2.2,0c0-0.7,0-1.4,0-2.2c0.7,0,1.4,0,2.2,0C10.4,17.7,10.4,18.4,10.4,19.1z"/>
        <path d="M10.4,12.2c-0.7,0-1.4,0-2.2,0c0-0.7,0-1.4,0-2.2c0.7,0,1.4,0,2.2,0C10.4,10.7,10.4,11.4,10.4,12.2z"/>
        <path d="M12.3,12.2c0-0.7,0-1.4,0-2.2c0.8,0,1.5,0,2.2,0C15,11.6,13.7,12.4,12.3,12.2z"/>
        <path d="M16.4,10.7c0-0.2,0-0.4,0-0.7c0.7,0,1.5,0,2.2,0c0,0.2,0,0.4,0,0.7C17.9,10.7,17.2,10.7,16.4,10.7z"/>
        <path d="M17.6,18.7c-0.2-0.3-0.5-0.5-0.6-0.8c-0.1-0.4,0.1-0.8,0.5-0.8c1,0,1.8-0.7,2.7-1.1c0.1-0.1,0.3-0.1,0.4-0.2
          c0.3-0.2,0.7-0.2,0.8,0.2c0.1,0.2-0.1,0.5-0.3,0.7c-0.6,0.4-1.3,0.6-1.9,1c-0.3,0.2-0.6,0.4-0.9,0.6C18.1,18.4,17.9,18.5,17.6,18.7z
          "/></svg>`;

      let _dateIcon = `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
             viewBox="0 0 24 24"  xml:space="preserve" style="fill: ${color}">
          <path d="M7.6,12h-3V9.1h3V12z M13.5,9.1h-3V12h3V9.1z M19.4,9.1h-3V12h3V9.1z M7.6,13.5h-3v2.9h3V13.5z M13.5,13.5h-3v2.9h3V13.5z
             M19.4,13.5h-3v2.9h3V13.5z M7.6,17.8h-3v2.9h3V17.8z M13.5,17.8h-3v2.9h3V17.8z M6.1,4.8c0.8,0,1.5-0.6,1.5-1.4V1.9
            c0-0.8-0.7-1.4-1.5-1.4S4.6,1.1,4.6,1.9v1.4C4.6,4.2,5.3,4.8,6.1,4.8z M23.8,3.4v20.2H0.2V3.4h3.7c0,1.2,1,2.2,2.2,2.2
            s2.2-1,2.2-2.2h7.4c0,1.2,1,2.2,2.2,2.2s2.2-1,2.2-2.2H23.8z M22.3,7.7H1.7v14.4h20.7V7.7z M17.9,4.8c0.8,0,1.5-0.6,1.5-1.4V1.9
            c0-0.8-0.7-1.4-1.5-1.4s-1.5,0.6-1.5,1.4v1.4C16.4,4.2,17.1,4.8,17.9,4.8z"/>
          </svg>`
    this._div.innerHTML = (hideTime)?_dateIcon:_datetimeIcon;
  }
  _open(event: Event): void {
    if (this.datetimepicker) {
      this.datetimepicker.open();
      event.stopPropagation();
    }
  }
  ngAfterContentInit(){
    if(!this.color){
      this.color = 'rgba(0,0,0,0.8)';
    }
    this._setIcon(this.hideTime);
  }
}
