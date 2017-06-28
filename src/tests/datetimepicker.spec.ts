import {Component, ViewChild} from '@angular/core';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {By} from '@angular/platform-browser';
import {MdDatetimepickerModule} from './index';
import {MdDatetimepicker} from './datetimepicker';
import {MdDatetimepickerInput} from './datetimepicker-input';
import {MdInputModule} from '../input/index';
import {MdNativeDateModule, DateAdapter, NativeDateAdapter} from '../core/datetime/index';
import {ESCAPE} from '../core';
import {
  dispatchFakeEvent,
  dispatchMouseEvent,
  dispatchKeyboardEvent,
} from '../core/testing/dispatch-events';


// When constructing a Date, the month is zero-based. This can be confusing, since people are
// used to seeing them one-based. So we create these aliases to make reading the tests easier.
const JAN = 0, FEB = 1, MAR = 2, APR = 3, MAY = 4, JUN = 5, JUL = 6, AUG = 7, SEP = 8, OCT = 9,
      NOV = 10, DEC = 11;


describe('MdDatetimepicker', () => {
  describe('with MdNativeDateModule', () => {
    beforeEach(async(() => {
      TestBed.configureTestingModule({
        imports: [
          FormsModule,
          MdDatetimepickerModule,
          MdInputModule,
          MdNativeDateModule,
          NoopAnimationsModule,
          ReactiveFormsModule,
        ],
        providers: [
          {provide: DateAdapter, useFactory: () => {
            let adapter = new NativeDateAdapter();
            adapter.setLocale('en-US');
            return adapter;
          }},
        ],
        declarations: [
          DatepickerWithFilterAndValidation,
          DatepickerWithFormControl,
          DatepickerWithMinAndMaxValidation,
          DatepickerWithNgModel,
          DatepickerWithStartAt,
          DatepickerWithStartView,
          DatepickerWithToggle,
          InputContainerDatepicker,
          MultiInputDatepicker,
          NoInputDatepicker,
          StandardDatepicker,
        ],
      });

      TestBed.compileComponents();
    }));

    describe('standard datetimepicker', () => {
      let fixture: ComponentFixture<StandardDatepicker>;
      let testComponent: StandardDatepicker;

      beforeEach(async(() => {
        fixture = TestBed.createComponent(StandardDatepicker);
        fixture.detectChanges();

        testComponent = fixture.componentInstance;
      }));

      afterEach(async(() => {
        testComponent.datetimepicker.close();
        fixture.detectChanges();
      }));

      it('open non-touch should open popup', async(() => {
        expect(document.querySelector('.cdk-overlay-pane')).toBeNull();

        testComponent.datetimepicker.open();
        fixture.detectChanges();

        expect(document.querySelector('.cdk-overlay-pane')).not.toBeNull();
      }));

      it('open touch should open dialog', async(() => {
        testComponent.touch = true;
        fixture.detectChanges();

        expect(document.querySelector('md-dialog-container')).toBeNull();

        testComponent.datetimepicker.open();
        fixture.detectChanges();

        expect(document.querySelector('md-dialog-container')).not.toBeNull();
      }));

      it('close should close popup', async(() => {
        testComponent.datetimepicker.open();
        fixture.detectChanges();

        let popup = document.querySelector('.cdk-overlay-pane');
        expect(popup).not.toBeNull();
        expect(parseInt(getComputedStyle(popup).height)).not.toBe(0);

        testComponent.datetimepicker.close();
        fixture.detectChanges();

        fixture.whenStable().then(() => {
          expect(parseInt(getComputedStyle(popup).height)).toBe(0);
        });
      }));

      it('should close the popup when pressing ESCAPE', () => {
        testComponent.datetimepicker.open();
        fixture.detectChanges();

        let content = document.querySelector('.cdk-overlay-pane md-datetimepicker-content');
        expect(content).toBeTruthy('Expected datetimepicker to be open.');

        let keyboadEvent = dispatchKeyboardEvent(content, 'keydown', ESCAPE);
        fixture.detectChanges();

        content = document.querySelector('.cdk-overlay-pane md-datetimepicker-content');

        expect(content).toBeFalsy('Expected datetimepicker to be closed.');
        expect(keyboadEvent.defaultPrevented)
            .toBe(true, 'Expected default ESCAPE action to be prevented.');
      });

      it('close should close dialog', async(() => {
        testComponent.touch = true;
        fixture.detectChanges();

        testComponent.datetimepicker.open();
        fixture.detectChanges();

        expect(document.querySelector('md-dialog-container')).not.toBeNull();

        testComponent.datetimepicker.close();
        fixture.detectChanges();

        fixture.whenStable().then(() => {
          expect(document.querySelector('md-dialog-container')).toBeNull();
        });
      }));

      it('setting selected should update input and close calendar', async(() => {
        testComponent.touch = true;
        fixture.detectChanges();

        testComponent.datetimepicker.open();
        fixture.detectChanges();

        expect(document.querySelector('md-dialog-container')).not.toBeNull();
        expect(testComponent.datetimepickerInput.value).toEqual(new Date(2020, JAN, 1));

        let cells = document.querySelectorAll('.mat-calendar-body-cell');
        dispatchMouseEvent(cells[1], 'click');
        fixture.detectChanges();

        fixture.whenStable().then(() => {
          expect(document.querySelector('md-dialog-container')).toBeNull();
          expect(testComponent.datetimepickerInput.value).toEqual(new Date(2020, JAN, 2));
        });
      }));

      it('startAt should fallback to input value', () => {
        expect(testComponent.datetimepicker.startAt).toEqual(new Date(2020, JAN, 1));
      });

      it('should attach popup to native input', () => {
        let attachToRef = testComponent.datetimepickerInput.getPopupConnectionElementRef();
        expect(attachToRef.nativeElement.tagName.toLowerCase())
            .toBe('input', 'popup should be attached to native input');
      });
    });

    describe('datetimepicker with too many inputs', () => {
      it('should throw when multiple inputs registered', async(() => {
        let fixture = TestBed.createComponent(MultiInputDatepicker);
        expect(() => fixture.detectChanges()).toThrow();
      }));
    });

    describe('datetimepicker with no inputs', () => {
      let fixture: ComponentFixture<NoInputDatepicker>;
      let testComponent: NoInputDatepicker;

      beforeEach(async(() => {
        fixture = TestBed.createComponent(NoInputDatepicker);
        fixture.detectChanges();

        testComponent = fixture.componentInstance;
      }));

      afterEach(async(() => {
        testComponent.datetimepicker.close();
        fixture.detectChanges();
      }));

      it('should throw when opened with no registered inputs', async(() => {
        expect(() => testComponent.datetimepicker.open()).toThrow();
      }));
    });

    describe('datetimepicker with startAt', () => {
      let fixture: ComponentFixture<DatepickerWithStartAt>;
      let testComponent: DatepickerWithStartAt;

      beforeEach(async(() => {
        fixture = TestBed.createComponent(DatepickerWithStartAt);
        fixture.detectChanges();

        testComponent = fixture.componentInstance;
      }));

      afterEach(async(() => {
        testComponent.datetimepicker.close();
        fixture.detectChanges();
      }));

      it('explicit startAt should override input value', () => {
        expect(testComponent.datetimepicker.startAt).toEqual(new Date(2010, JAN, 1));
      });
    });

    describe('datetimepicker with startView', () => {
      let fixture: ComponentFixture<DatepickerWithStartView>;
      let testComponent: DatepickerWithStartView;

      beforeEach(async(() => {
        fixture = TestBed.createComponent(DatepickerWithStartView);
        fixture.detectChanges();

        testComponent = fixture.componentInstance;
      }));

      afterEach(async(() => {
        testComponent.datetimepicker.close();
        fixture.detectChanges();
      }));

      it('should start at the specified view', () => {
        testComponent.datetimepicker.open();
        fixture.detectChanges();

        const firstCalendarCell = document.querySelector('.mat-calendar-body-cell');

        // When the calendar is in year view, the first cell should be for a month rather than
        // for a date.
        expect(firstCalendarCell.textContent)
            .toBe('JAN', 'Expected the calendar to be in year-view');
      });
    });

    describe('datetimepicker with ngModel', () => {
      let fixture: ComponentFixture<DatepickerWithNgModel>;
      let testComponent: DatepickerWithNgModel;

      beforeEach(async(() => {
        fixture = TestBed.createComponent(DatepickerWithNgModel);
        fixture.detectChanges();

        fixture.whenStable().then(() => {
          fixture.detectChanges();

          testComponent = fixture.componentInstance;
        });
      }));

      afterEach(async(() => {
        testComponent.datetimepicker.close();
        fixture.detectChanges();
      }));

      it('should update datetimepicker when model changes', async(() => {
        expect(testComponent.datetimepickerInput.value).toBeNull();
        expect(testComponent.datetimepicker._selected).toBeNull();

        let selected = new Date(2017, JAN, 1);
        testComponent.selected = selected;
        fixture.detectChanges();

        fixture.whenStable().then(() => {
          fixture.detectChanges();

          expect(testComponent.datetimepickerInput.value).toEqual(selected);
          expect(testComponent.datetimepicker._selected).toEqual(selected);
        });
      }));

      it('should update model when date is selected', async(() => {
        expect(testComponent.selected).toBeNull();
        expect(testComponent.datetimepickerInput.value).toBeNull();

        let selected = new Date(2017, JAN, 1);
        testComponent.datetimepicker._selectAndClose(selected);
        fixture.detectChanges();

        fixture.whenStable().then(() => {
          fixture.detectChanges();

          expect(testComponent.selected).toEqual(selected);
          expect(testComponent.datetimepickerInput.value).toEqual(selected);
        });
      }));

      it('should mark input dirty after input event', () => {
        let inputEl = fixture.debugElement.query(By.css('input')).nativeElement;

        expect(inputEl.classList).toContain('ng-pristine');

        dispatchFakeEvent(inputEl, 'input');
        fixture.detectChanges();

        expect(inputEl.classList).toContain('ng-dirty');
      });

      it('should mark input dirty after date selected', async(() => {
        let inputEl = fixture.debugElement.query(By.css('input')).nativeElement;

        expect(inputEl.classList).toContain('ng-pristine');

        testComponent.datetimepicker._selectAndClose(new Date(2017, JAN, 1));
        fixture.detectChanges();

        fixture.whenStable().then(() => {
          fixture.detectChanges();

          expect(inputEl.classList).toContain('ng-dirty');
        });
      }));

      it('should not mark dirty after model change', async(() => {
        let inputEl = fixture.debugElement.query(By.css('input')).nativeElement;

        expect(inputEl.classList).toContain('ng-pristine');

        testComponent.selected = new Date(2017, JAN, 1);
        fixture.detectChanges();

        fixture.whenStable().then(() => {
          fixture.detectChanges();

          expect(inputEl.classList).toContain('ng-pristine');
        });
      }));

      it('should mark input touched on blur', () => {
        let inputEl = fixture.debugElement.query(By.css('input')).nativeElement;

        expect(inputEl.classList).toContain('ng-untouched');

        dispatchFakeEvent(inputEl, 'focus');
        fixture.detectChanges();

        expect(inputEl.classList).toContain('ng-untouched');

        dispatchFakeEvent(inputEl, 'blur');
        fixture.detectChanges();

        expect(inputEl.classList).toContain('ng-touched');
      });
    });

    describe('datetimepicker with formControl', () => {
      let fixture: ComponentFixture<DatepickerWithFormControl>;
      let testComponent: DatepickerWithFormControl;

      beforeEach(async(() => {
        fixture = TestBed.createComponent(DatepickerWithFormControl);
        fixture.detectChanges();

        testComponent = fixture.componentInstance;
      }));

      afterEach(async(() => {
        testComponent.datetimepicker.close();
        fixture.detectChanges();
      }));

      it('should update datetimepicker when formControl changes', () => {
        expect(testComponent.datetimepickerInput.value).toBeNull();
        expect(testComponent.datetimepicker._selected).toBeNull();

        let selected = new Date(2017, JAN, 1);
        testComponent.formControl.setValue(selected);
        fixture.detectChanges();

        expect(testComponent.datetimepickerInput.value).toEqual(selected);
        expect(testComponent.datetimepicker._selected).toEqual(selected);
      });

      it('should update formControl when date is selected', () => {
        expect(testComponent.formControl.value).toBeNull();
        expect(testComponent.datetimepickerInput.value).toBeNull();

        let selected = new Date(2017, JAN, 1);
        testComponent.datetimepicker._selectAndClose(selected);
        fixture.detectChanges();

        expect(testComponent.formControl.value).toEqual(selected);
        expect(testComponent.datetimepickerInput.value).toEqual(selected);
      });

      it('should disable input when form control disabled', () => {
        let inputEl = fixture.debugElement.query(By.css('input')).nativeElement;

        expect(inputEl.disabled).toBe(false);

        testComponent.formControl.disable();
        fixture.detectChanges();

        expect(inputEl.disabled).toBe(true);
      });
    });

    describe('datetimepicker with MdDatetimepickerToggle', () => {
      let fixture: ComponentFixture<DatepickerWithToggle>;
      let testComponent: DatepickerWithToggle;

      beforeEach(async(() => {
        fixture = TestBed.createComponent(DatepickerWithToggle);
        fixture.detectChanges();

        testComponent = fixture.componentInstance;
      }));

      afterEach(async(() => {
        testComponent.datetimepicker.close();
        fixture.detectChanges();
      }));

      it('should open calendar when toggle clicked', () => {
        expect(document.querySelector('md-dialog-container')).toBeNull();

        let toggle = fixture.debugElement.query(By.css('button'));
        dispatchMouseEvent(toggle.nativeElement, 'click');
        fixture.detectChanges();

        expect(document.querySelector('md-dialog-container')).not.toBeNull();
      });

      it('should set the `button` type on the trigger to prevent form submissions', () => {
        let toggle = fixture.debugElement.query(By.css('button')).nativeElement;
        expect(toggle.getAttribute('type')).toBe('button');
      });

      it('should restore focus to the toggle after the calendar is closed', () => {
        let toggle = fixture.debugElement.query(By.css('button')).nativeElement;

        fixture.componentInstance.touchUI = false;
        fixture.detectChanges();

        toggle.focus();
        expect(document.activeElement).toBe(toggle, 'Expected toggle to be focused.');

        fixture.componentInstance.datetimepicker.open();
        fixture.detectChanges();

        let pane = document.querySelector('.cdk-overlay-pane');

        expect(pane).toBeTruthy('Expected calendar to be open.');
        expect(pane.contains(document.activeElement))
            .toBe(true, 'Expected focus to be inside the calendar.');

        fixture.componentInstance.datetimepicker.close();
        fixture.detectChanges();

        expect(document.activeElement).toBe(toggle, 'Expected focus to be restored to toggle.');
      });
    });

    describe('datetimepicker inside input-container', () => {
      let fixture: ComponentFixture<InputContainerDatepicker>;
      let testComponent: InputContainerDatepicker;

      beforeEach(async(() => {
        fixture = TestBed.createComponent(InputContainerDatepicker);
        fixture.detectChanges();

        testComponent = fixture.componentInstance;
      }));

      afterEach(async(() => {
        testComponent.datetimepicker.close();
        fixture.detectChanges();
      }));

      it('should attach popup to input-container underline', () => {
        let attachToRef = testComponent.datetimepickerInput.getPopupConnectionElementRef();
        expect(attachToRef.nativeElement.classList.contains('mat-input-underline'))
            .toBe(true, 'popup should be attached to input-container underline');
      });
    });

    describe('datetimepicker with min and max dates and validation', () => {
      let fixture: ComponentFixture<DatepickerWithMinAndMaxValidation>;
      let testComponent: DatepickerWithMinAndMaxValidation;

      beforeEach(async(() => {
        fixture = TestBed.createComponent(DatepickerWithMinAndMaxValidation);
        fixture.detectChanges();

        testComponent = fixture.componentInstance;
      }));

      afterEach(async(() => {
        testComponent.datetimepicker.close();
        fixture.detectChanges();
      }));

      it('should use min and max dates specified by the input', () => {
        expect(testComponent.datetimepicker._minDate).toEqual(new Date(2010, JAN, 1));
        expect(testComponent.datetimepicker._maxDate).toEqual(new Date(2020, JAN, 1));
      });

      it('should mark invalid when value is before min', () => {
        testComponent.date = new Date(2009, DEC, 31);
        fixture.detectChanges();

        fixture.whenStable().then(() => {
          fixture.detectChanges();

          expect(fixture.debugElement.query(By.css('input')).nativeElement.classList)
              .toContain('ng-invalid');
        });
      });

      it('should mark invalid when value is after max', () => {
        testComponent.date = new Date(2020, JAN, 2);
        fixture.detectChanges();

        fixture.whenStable().then(() => {
          fixture.detectChanges();

          expect(fixture.debugElement.query(By.css('input')).nativeElement.classList)
              .toContain('ng-invalid');
        });
      });

      it('should not mark invalid when value equals min', () => {
        testComponent.date = testComponent.datetimepicker._minDate;
        fixture.detectChanges();

        fixture.whenStable().then(() => {
          fixture.detectChanges();

          expect(fixture.debugElement.query(By.css('input')).nativeElement.classList)
              .not.toContain('ng-invalid');
        });
      });

      it('should not mark invalid when value equals max', () => {
        testComponent.date = testComponent.datetimepicker._maxDate;
        fixture.detectChanges();

        fixture.whenStable().then(() => {
          fixture.detectChanges();

          expect(fixture.debugElement.query(By.css('input')).nativeElement.classList)
              .not.toContain('ng-invalid');
        });
      });

      it('should not mark invalid when value is between min and max', () => {
        testComponent.date = new Date(2010, JAN, 2);
        fixture.detectChanges();

        fixture.whenStable().then(() => {
          fixture.detectChanges();

          expect(fixture.debugElement.query(By.css('input')).nativeElement.classList)
              .not.toContain('ng-invalid');
        });
      });
    });

    describe('datetimepicker with filter and validation', () => {
      let fixture: ComponentFixture<DatepickerWithFilterAndValidation>;
      let testComponent: DatepickerWithFilterAndValidation;

      beforeEach(async(() => {
        fixture = TestBed.createComponent(DatepickerWithFilterAndValidation);
        fixture.detectChanges();

        testComponent = fixture.componentInstance;
      }));

      afterEach(async(() => {
        testComponent.datetimepicker.close();
        fixture.detectChanges();
      }));

      it('should mark input invalid', async(() => {
        testComponent.date = new Date(2017, JAN, 1);
        fixture.detectChanges();

        fixture.whenStable().then(() => {
          fixture.detectChanges();

          expect(fixture.debugElement.query(By.css('input')).nativeElement.classList)
              .toContain('ng-invalid');

          testComponent.date = new Date(2017, JAN, 2);
          fixture.detectChanges();

          fixture.whenStable().then(() => {
            fixture.detectChanges();

            expect(fixture.debugElement.query(By.css('input')).nativeElement.classList)
                .not.toContain('ng-invalid');
          });
        });
      }));

      it('should disable filtered calendar cells', () => {
        fixture.detectChanges();

        testComponent.datetimepicker.open();
        fixture.detectChanges();

        expect(document.querySelector('md-dialog-container')).not.toBeNull();

        let cells = document.querySelectorAll('.mat-calendar-body-cell');
        expect(cells[0].classList).toContain('mat-calendar-body-disabled');
        expect(cells[1].classList).not.toContain('mat-calendar-body-disabled');
      });
    });
  });

  describe('with missing DateAdapter and MD_DATE_FORMATS', () => {
    beforeEach(async(() => {
      TestBed.configureTestingModule({
        imports: [
          FormsModule,
          MdDatetimepickerModule,
          MdInputModule,
          NoopAnimationsModule,
          ReactiveFormsModule,
        ],
        declarations: [StandardDatepicker],
      });

      TestBed.compileComponents();
    }));

    it('should throw when created', () => {
      expect(() => TestBed.createComponent(StandardDatepicker))
          .toThrowError(/MdDatetimepicker: No provider found for .*/);
    });
  });

  describe('popup positioning', () => {
    let fixture: ComponentFixture<StandardDatepicker>;
    let testComponent: StandardDatepicker;
    let input: HTMLElement;

    beforeEach(async(() => {
      TestBed.configureTestingModule({
        imports: [MdDatetimepickerModule, MdInputModule, MdNativeDateModule, NoopAnimationsModule],
        declarations: [StandardDatepicker],
      }).compileComponents();

      fixture = TestBed.createComponent(StandardDatepicker);
      fixture.detectChanges();
      testComponent = fixture.componentInstance;
      input = fixture.debugElement.query(By.css('input')).nativeElement;
      input.style.position = 'fixed';
    }));

    it('should be below and to the right when there is plenty of space', () => {
      input.style.top = input.style.left = '20px';
      testComponent.datetimepicker.open();
      fixture.detectChanges();

      const overlayRect = document.querySelector('.cdk-overlay-pane').getBoundingClientRect();
      const inputRect = input.getBoundingClientRect();

      expect(Math.floor(overlayRect.top))
          .toBe(Math.floor(inputRect.bottom), 'Expected popup to align to input bottom.');
      expect(Math.floor(overlayRect.left))
          .toBe(Math.floor(inputRect.left), 'Expected popup to align to input left.');
    });

    it('should be above and to the right when there is no space below', () => {
      input.style.bottom = input.style.left = '20px';
      testComponent.datetimepicker.open();
      fixture.detectChanges();

      const overlayRect = document.querySelector('.cdk-overlay-pane').getBoundingClientRect();
      const inputRect = input.getBoundingClientRect();

      expect(Math.floor(overlayRect.bottom))
          .toBe(Math.floor(inputRect.top), 'Expected popup to align to input top.');
      expect(Math.floor(overlayRect.left))
          .toBe(Math.floor(inputRect.left), 'Expected popup to align to input left.');
    });

    it('should be below and to the left when there is no space on the right', () => {
      input.style.top = input.style.right = '20px';
      testComponent.datetimepicker.open();
      fixture.detectChanges();

      const overlayRect = document.querySelector('.cdk-overlay-pane').getBoundingClientRect();
      const inputRect = input.getBoundingClientRect();

      expect(Math.floor(overlayRect.top))
          .toBe(Math.floor(inputRect.bottom), 'Expected popup to align to input bottom.');
      expect(Math.floor(overlayRect.right))
          .toBe(Math.floor(inputRect.right), 'Expected popup to align to input right.');
    });

    it('should be above and to the left when there is no space on the bottom', () => {
      input.style.bottom = input.style.right = '20px';
      testComponent.datetimepicker.open();
      fixture.detectChanges();

      const overlayRect = document.querySelector('.cdk-overlay-pane').getBoundingClientRect();
      const inputRect = input.getBoundingClientRect();

      expect(Math.floor(overlayRect.bottom))
          .toBe(Math.floor(inputRect.top), 'Expected popup to align to input top.');
      expect(Math.floor(overlayRect.right))
          .toBe(Math.floor(inputRect.right), 'Expected popup to align to input right.');
    });

  });
});


@Component({
  template: `
    <input [MdDatetimepicker]="d" [value]="date">
    <md-datetimepicker #d [touchUi]="touch"></md-datetimepicker>
  `,
})
class StandardDatepicker {
  touch = false;
  date = new Date(2020, JAN, 1);
  @ViewChild('d') datetimepicker: MdDatetimepicker<Date>;
  @ViewChild(MdDatetimepickerInput) datetimepickerInput: MdDatetimepickerInput<Date>;
}


@Component({
  template: `
    <input [MdDatetimepicker]="d"><input [MdDatetimepicker]="d"><md-datetimepicker #d></md-datetimepicker>
  `,
})
class MultiInputDatepicker {}


@Component({
  template: `<md-datetimepicker #d></md-datetimepicker>`,
})
class NoInputDatepicker {
  @ViewChild('d') datetimepicker: MdDatetimepicker<Date>;
}


@Component({
  template: `
    <input [MdDatetimepicker]="d" [value]="date">
    <md-datetimepicker #d [startAt]="startDate"></md-datetimepicker>
  `,
})
class DatepickerWithStartAt {
  date = new Date(2020, JAN, 1);
  startDate = new Date(2010, JAN, 1);
  @ViewChild('d') datetimepicker: MdDatetimepicker<Date>;
}


@Component({
  template: `
    <input [MdDatetimepicker]="d" [value]="date">
    <md-datetimepicker #d startView="year"></md-datetimepicker>
  `,
})
class DatepickerWithStartView {
  date = new Date(2020, JAN, 1);
  @ViewChild('d') datetimepicker: MdDatetimepicker<Date>;
}


@Component({
  template: `<input [(ngModel)]="selected" [MdDatetimepicker]="d"><md-datetimepicker #d></md-datetimepicker>`,
})
class DatepickerWithNgModel {
  selected: Date = null;
  @ViewChild('d') datetimepicker: MdDatetimepicker<Date>;
  @ViewChild(MdDatetimepickerInput) datetimepickerInput: MdDatetimepickerInput<Date>;
}


@Component({
  template: `
    <input [formControl]="formControl" [MdDatetimepicker]="d">
    <md-datetimepicker #d></md-datetimepicker>
  `,
})
class DatepickerWithFormControl {
  formControl = new FormControl();
  @ViewChild('d') datetimepicker: MdDatetimepicker<Date>;
  @ViewChild(MdDatetimepickerInput) datetimepickerInput: MdDatetimepickerInput<Date>;
}


@Component({
  template: `
    <input [MdDatetimepicker]="d">
    <button [MdDatetimepickerToggle]="d"></button>
    <md-datetimepicker #d [touchUi]="touchUI"></md-datetimepicker>
  `,
})
class DatepickerWithToggle {
  @ViewChild('d') datetimepicker: MdDatetimepicker<Date>;
  touchUI = true;
}


@Component({
  template: `
      <md-input-container>
        <input mdInput [MdDatetimepicker]="d">
        <md-datetimepicker #d></md-datetimepicker>
      </md-input-container>
  `,
})
class InputContainerDatepicker {
  @ViewChild('d') datetimepicker: MdDatetimepicker<Date>;
  @ViewChild(MdDatetimepickerInput) datetimepickerInput: MdDatetimepickerInput<Date>;
}


@Component({
  template: `
    <input [MdDatetimepicker]="d" [(ngModel)]="date" [min]="minDate" [max]="maxDate">
    <button [MdDatetimepickerToggle]="d"></button>
    <md-datetimepicker #d></md-datetimepicker>
  `,
})
class DatepickerWithMinAndMaxValidation {
  @ViewChild('d') datetimepicker: MdDatetimepicker<Date>;
  date: Date;
  minDate = new Date(2010, JAN, 1);
  maxDate = new Date(2020, JAN, 1);
}


@Component({
  template: `
    <input [MdDatetimepicker]="d" [(ngModel)]="date" [MdDatetimepickerFilter]="filter">
    <button [MdDatetimepickerToggle]="d"></button>
    <md-datetimepicker #d [touchUi]="true"></md-datetimepicker>
  `,
})
class DatepickerWithFilterAndValidation {
  @ViewChild('d') datetimepicker: MdDatetimepicker<Date>;
  date: Date;
  filter = (date: Date) => date.getDate() != 1;
}
