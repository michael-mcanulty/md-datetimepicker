import { NgModule } from '@angular/core';
import { DateAdapter } from './date-adapter';
import { NativeDateAdapter } from './native-date-adapter';
import { MD_DATE_FORMATS } from '@angular/material';
import { MD_NATIVE_DATE_FORMATS } from './native-date-formats';
export * from './date-adapter';
export * from './native-date-adapter';
export * from './native-date-formats';
var NativeDateModule = (function () {
    function NativeDateModule() {
    }
    return NativeDateModule;
}());
export { NativeDateModule };
NativeDateModule.decorators = [
    { type: NgModule, args: [{
                providers: [{ provide: DateAdapter, useClass: NativeDateAdapter }],
            },] },
];
/** @nocollapse */
NativeDateModule.ctorParameters = function () { return []; };
var MdNativeDateModule = (function () {
    function MdNativeDateModule() {
    }
    return MdNativeDateModule;
}());
export { MdNativeDateModule };
MdNativeDateModule.decorators = [
    { type: NgModule, args: [{
                imports: [NativeDateModule],
                providers: [{ provide: MD_DATE_FORMATS, useValue: MD_NATIVE_DATE_FORMATS }],
            },] },
];
/** @nocollapse */
MdNativeDateModule.ctorParameters = function () { return []; };
//# sourceMappingURL=index.js.map