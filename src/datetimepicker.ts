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
  ComponentRef,
  EventEmitter,
  Input,
  OnDestroy,
  Optional,
  Output,
  ViewChild,
  ViewContainerRef,
  ViewEncapsulation,
  NgZone,
  Inject,
} from '@angular/core';
import {DOCUMENT} from '@angular/platform-browser';
import {Overlay, OverlayRef, MdDialog, MdDialogRef, PositionStrategy, MdDialogConfig, ESCAPE, ComponentPortal, OverlayState, Dir} from '@angular/material';
import {MdDatetimepickerInput} from './datetimepicker-input';
import {Subscription} from 'rxjs/Subscription';
import {DateAdapter} from './native-date-module/index';
import {createMissingDateImplError} from './datetimepicker-errors';
import {MdCalendar} from './calendar';
import {MdTimesheet} from './timesheet';
import 'rxjs/add/operator/first';

/** Used to generate a unique ID for each datetimepicker instance. */
let datetimepickerUid = 0;

/**
 * Component used as the content for the datetimepicker dialog and popup. We use this instead of using
 * MdCalendar directly as the content so we can control the initial focus. This also gives us a
 * place to put additional features of the popup that are not part of the calendar itself in the
 * future. (e.g. confirmation buttons).
 * @docs-private
 */
@Component({
  selector: 'md-datetimepicker-content',
  templateUrl: 'datetimepicker-content.html',
  styleUrls: ['datetimepicker-content.css'],
  host: {
    'class': 'mat-datepicker-content',
    '[class.mat-datepicker-content-touch]': 'datetimepicker.touchUi',
    '(keydown)': '_handleKeydown($event)',
  },
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MdDatetimepickerContent<D> implements AfterContentInit {
  datetimepicker: MdDatetimepicker<D>;
  @ViewChild(MdCalendar) calendar: MdCalendar<D>;

  ngAfterContentInit() {
    if(this.calendar){
      this.calendar._focusActiveCell();
    }
  }

  /**
   * Handles keydown event on datetimepicker content.
   * @param event The event.
   */
  _handleKeydown(event: KeyboardEvent):void{
    if (event.keyCode === ESCAPE) {
      this.datetimepicker.close();
      event.preventDefault();
    }
  }
}


// TODO(mmalerba): We use a component instead of a directive here so the user can use implicit
// template reference variables (e.g. #d vs #d="MdDatetimepicker"). We can change this to a directive if
// angular adds support for `exportAs: '$implicit'` on directives.
/** Component responsible for managing the datetimepicker popup/dialog. */
@Component({
  selector: 'md-datetimepicker, mat-datetimepicker',
  template: '',
})
export class MdDatetimepicker<D> implements OnDestroy {

  /** The view that the calendar should start in. */
  @Input() calView: 'month' | 'year' = 'month';

  /** The view that is displayed in. This is either calendar or timesheet, but can be changed to add more */
  @Input()
  get pickerView():string{
    return (this._pickerView)?this._pickerView:'calendar';
  }
  set pickerView(value:string){
    this._pickerView = value;
  }
  private _pickerView:string;

  /** Height of the calendar. This is passed to timesheet */
  @Input()
  get calHeight():string{
    return this._calHeight;
  }
  setCalHeight(value:string){
    this._calHeight = value;
  }
  private _calHeight:string;

  /**
   * Whether the calendar UI is in touch mode. In touch mode the calendar opens in a dialog rather
   * than a popup and elements have more padding to allow for bigger touch targets.
   */
    /** Set as datepicker only; No timepicker*/
  @Input()
  get date():D{
    return this._date;
  }
  set date(value:D){
    this._date = value;
  }
  private _date:D;


  /** Set as datepicker only; No timepicker*/
  @Input()
  get hideTime():boolean{
    return this._hideTime;
  }
  set hideTime(value:boolean){
    this._hideTime = value;
  }
  private _hideTime:boolean;

  /** Set as Timepicker only. No calendar for date*/
  @Input()
  get hideDate():boolean{
    return this._hideTime;
  }
  set hideDate(value:boolean){
    this._hideDate = value;
  }
  private _hideDate:boolean;

  /** Sets to dialog to popup. Dialog req on small screen */
  @Input()
  get touchUi(): boolean {
    return this._touchUi || this._datetimepickerInput.touch || false;
  }
  set touchUi(isUi: boolean) { this._touchUi = isUi; }
  private _touchUi: boolean;

  /** Emits new selected date when selected date changes. */
  @Output() selectedChanged = new EventEmitter<D>();

  /** Whether the calendar is open. */
  opened = false;

  /** The id for the datetimepicker calendar. */
  id = `md-datetimepicker-${datetimepickerUid++}`;

  /** The currently selected date. */
  _selected: D = null;

  /** The minimum selectable date. */
  get _minDate(): D {
    return this._datetimepickerInput && this._datetimepickerInput.min;
  }

  /** The maximum selectable date. */
  get _maxDate(): D {
    return this._datetimepickerInput && this._datetimepickerInput.max;
  }

  get _dateFilter(): (date: D | null) => boolean {
    return this._datetimepickerInput && this._datetimepickerInput._dateFilter;
  }
  
  /** A reference to the overlay when the calendar is opened as a popup. */
  private _popupRef: OverlayRef;

  /** A reference to the dialog when the calendar is opened as a dialog. */
  private _dialogRef: MdDialogRef<any>;

  /** A portal containing the calendar for this datetimepicker. */
  private _calendarPortal: ComponentPortal<MdDatetimepickerContent<D>>;

  /** The input element this datetimepicker is associated with. */
  private _datetimepickerInput: MdDatetimepickerInput<D>;

  /** The element that was focused before the datetimepicker was opened. */
  private _focusedElementBeforeOpen: HTMLElement;

  private _inputSubscription: Subscription;

  constructor(private _dialog: MdDialog,
    private _overlay: Overlay,
    private _ngZone: NgZone,
    private _viewContainerRef: ViewContainerRef,
    @Optional() private _dateAdapter: DateAdapter<D>,
    @Optional() private _dir: Dir,
    @Optional() @Inject(DOCUMENT) private _document: any) {
    if (!this._dateAdapter) {
      throw createMissingDateImplError('DateAdapter');
    }
  }

  ngOnDestroy() {
    this.close();
    if (this._popupRef) {
      this._popupRef.dispose();
    }
    if (this._inputSubscription) {
      this._inputSubscription.unsubscribe();
    }
  }

  /** Handles date selection in the month view. This closes the dialog */
  _dateComplete(date:D): void {
    this._selected = date;
  }

  /** Selects the given date and closes the currently open popup or dialog. */
  _selectAndClose(v: D): void {
    this._selected = v;
    this.selectedChanged.emit(v);
    this.close();
  }

  /** Selects the given date and closes the currently open popup or dialog. */
  _dateSelected(v: D): void {
    this._selected = v;
    this.pickerView = "timesheet";
  }

  /**
   * Register an input with this datetimepicker.
   * @param input The datetimepicker input to register with this datetimepicker.
   */
  _registerInput(input: MdDatetimepickerInput<D>): void {
    if (this._datetimepickerInput) {
      throw Error('An MdDatetimepicker can only be associated with a single input.');
    }
    this._datetimepickerInput = input;
    this._inputSubscription = this._datetimepickerInput._valueChange.subscribe((value: D) => { this._selected = value; this.date = value; });
  }

  /** Open the calendar. */
  open(): void {
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
    this.pickerView = (this.hideDate)?"timesheet":"calendar";
    this.opened = true;
  }

  /** Close the calendar. */
  close(): void {
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
  }

  /** Open the calendar as a dialog. */
  private _openAsDialog(): void {
    let config = new MdDialogConfig();
    config.viewContainerRef = this._viewContainerRef;
    config.disableClose = true;
    this._dialogRef = this._dialog.open(MdDatetimepickerContent, config);
    this._dialogRef.afterClosed().subscribe(() => this.close());
    this._dialogRef.componentInstance.datetimepicker = this;
  }

  /** Open the calendar as a popup. */
  private _openAsPopup(): void {
    if (!this._calendarPortal) {
      this._calendarPortal = new ComponentPortal(MdDatetimepickerContent, this._viewContainerRef);
    }

    if (!this._popupRef) {
      this._createPopup();
    }

    if (!this._popupRef.hasAttached()) {
      let componentRef: ComponentRef<MdDatetimepickerContent<D>> =
      this._popupRef.attach(this._calendarPortal);
      componentRef.instance.datetimepicker = this;

      // Update the position once the calendar has rendered.
      this._ngZone.onStable.first().subscribe(() => this._popupRef.updatePosition());
    }

    this._popupRef.backdropClick().subscribe(() => this.close());
  }

  /** Create the popup. */
  private _createPopup(): void {
    const overlayState = new OverlayState();
    overlayState.positionStrategy = this._createPopupPositionStrategy();
    overlayState.hasBackdrop = true;
    overlayState.backdropClass = 'md-overlay-transparent-backdrop';
    overlayState.direction = this._dir ? this._dir.value : 'ltr';
    overlayState.scrollStrategy = this._overlay.scrollStrategies.reposition();

    this._popupRef = this._overlay.create(overlayState);
  }

  /** Create the popup PositionStrategy. */
  private _createPopupPositionStrategy(): PositionStrategy {
    return this._overlay.position()
      .connectedTo(this._datetimepickerInput.getPopupConnectionElementRef(),
        {originX: 'start', originY: 'bottom'},
        {overlayX: 'start', overlayY: 'top'}
      )
      .withFallbackPosition(
        { originX: 'start', originY: 'top' },
        { overlayX: 'start', overlayY: 'bottom' }
      )
      .withFallbackPosition(
        {originX: 'end', originY: 'bottom'},
        {overlayX: 'end', overlayY: 'top'}
      )
      .withFallbackPosition(
        { originX: 'end', originY: 'top' },
        { overlayX: 'end', overlayY: 'bottom' }
      );
  }
}
