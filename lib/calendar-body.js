/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
/**
 * An internal class that represents the data corresponding to a single calendar cell.
 * @docs-private
 */
var MdCalendarCell = (function () {
    function MdCalendarCell(value, displayValue, ariaLabel, enabled) {
        this.value = value;
        this.displayValue = displayValue;
        this.ariaLabel = ariaLabel;
        this.enabled = enabled;
    }
    return MdCalendarCell;
}());
export { MdCalendarCell };
/**
 * An internal component used to display calendar data in a table.
 * @docs-private
 */
var MdCalendarBody = (function () {
    function MdCalendarBody() {
        /** The number of columns in the table. */
        this.numCols = 7;
        /** Whether to allow selection of disabled cells. */
        this.allowDisabledSelection = false;
        /** The cell number of the active cell in the table. */
        this.activeCell = 0;
        /** Emits when a new value is selected. */
        this.selectedValueChange = new EventEmitter();
    }
    MdCalendarBody.prototype._cellClicked = function (cell) {
        if (!this.allowDisabledSelection && !cell.enabled) {
            return;
        }
        this.selectedValueChange.emit(cell.value);
    };
    Object.defineProperty(MdCalendarBody.prototype, "_firstRowOffset", {
        /** The number of blank cells to put at the beginning for the first row. */
        get: function () {
            return this.rows && this.rows.length && this.rows[0].length ?
                this.numCols - this.rows[0].length : 0;
        },
        enumerable: true,
        configurable: true
    });
    MdCalendarBody.prototype._isActiveCell = function (rowIndex, colIndex) {
        var cellNumber = rowIndex * this.numCols + colIndex;
        // Account for the fact that the first row may not have as many cells.
        if (rowIndex) {
            cellNumber -= this._firstRowOffset;
        }
        return cellNumber == this.activeCell;
    };
    return MdCalendarBody;
}());
export { MdCalendarBody };
MdCalendarBody.decorators = [
    { type: Component, args: [{
                selector: '[md-calendar-body]',
                template: "<tr *ngIf=\"_firstRowOffset < labelMinRequiredCells\" aria-hidden=\"true\"> <td class=\"mat-calendar-body-label\" [attr.colspan]=\"numCols\" >{{label}}</td></tr><tr *ngFor=\"let row of rows; let rowIndex=index\" role=\"row\"><!-- We mark this cell as aria-hidden so it doesn't get read out as one of the days in the week. --> <td *ngIf=\"rowIndex===0 && _firstRowOffset\" aria-hidden=\"true\" class=\"mat-calendar-body-label\" [attr.colspan]=\"_firstRowOffset\">{{_firstRowOffset >=labelMinRequiredCells ? label : ''}}</td><td *ngFor=\"let item of row; let colIndex=index\" role=\"gridcell\" class=\"mat-calendar-body-cell\" [tabindex]=\"_isActiveCell(rowIndex, colIndex) ? 0 : -1\" [class.mat-calendar-body-disabled]=\"!item.enabled\" [class.mat-calendar-body-active]=\"_isActiveCell(rowIndex, colIndex)\" [attr.aria-label]=\"item.ariaLabel\" [attr.aria-disabled]=\"!item.enabled || null\" (click)=\"_cellClicked(item)\"> <div class=\"mat-calendar-body-cell-content\" [class.mat-calendar-body-selected]=\"selectedValue===item.value\" [class.mat-calendar-body-today]=\"todayValue===item.value\">{{item.displayValue}}</div></td></tr>",
                styles: [".mat-calendar-body{min-width: 224px;}.mat-calendar-body-label{padding: 7.14286% 0 7.14286% 7.14286%;height: 0;line-height: 0;transform: translateX(-6px);text-align: left;}.mat-calendar-body-cell{position: relative;width: 14.28571%;height: 0;line-height: 0;padding: 7.14286% 0;text-align: center;outline: none;cursor: pointer;}.mat-calendar-body-disabled{cursor: default;}.mat-calendar-body-cell-content{position: absolute;top: 5%;left: 5%;display: flex;align-items: center;justify-content: center;box-sizing: border-box;width: 90%;height: 90%;border-width: 1px;border-style: solid;border-radius: 50%;}[dir='rtl'] .mat-calendar-body-label{padding: 0 7.14286% 0 0;transform: translateX(6px);text-align: right;}"],
                host: {
                    'class': 'mat-calendar-body',
                },
                encapsulation: ViewEncapsulation.None,
                changeDetection: ChangeDetectionStrategy.OnPush,
            },] },
];
/** @nocollapse */
MdCalendarBody.ctorParameters = function () { return []; };
MdCalendarBody.propDecorators = {
    'label': [{ type: Input },],
    'rows': [{ type: Input },],
    'todayValue': [{ type: Input },],
    'selectedValue': [{ type: Input },],
    'labelMinRequiredCells': [{ type: Input },],
    'numCols': [{ type: Input },],
    'allowDisabledSelection': [{ type: Input },],
    'activeCell': [{ type: Input },],
    'selectedValueChange': [{ type: Output },],
};
//# sourceMappingURL=calendar-body.js.map