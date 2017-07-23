/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ElementRef, Renderer2, AfterContentInit } from '@angular/core';
import { MdDatetimepicker } from './datetimepicker';
import { MdDatetimepickerIntl } from './datetimepicker-intl';
export declare class MdDatetimepickerToggle<D> implements AfterContentInit {
    _intl: MdDatetimepickerIntl;
    private _elm;
    private _renderer;
    /** Datepicker instance that the button will toggle. */
    datetimepicker: MdDatetimepicker<D>;
    hideTime: boolean;
    color: string;
    _datetimepicker: MdDatetimepicker<D>;
    constructor(_intl: MdDatetimepickerIntl, _elm: ElementRef, _renderer: Renderer2);
    private _div;
    _setIcon(hideTime: boolean): void;
    _open(event: Event): void;
    ngAfterContentInit(): void;
}
