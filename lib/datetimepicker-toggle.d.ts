import { MdDatetimepicker } from './datetimepicker';
import { MdDatetimepickerIntl } from './datetimepicker-intl';
export declare class MdDatetimepickerToggle<D> {
    _intl: MdDatetimepickerIntl;
    /** Datepicker instance that the button will toggle. */
    datetimepicker: MdDatetimepicker<D>;
    _datetimepicker: MdDatetimepicker<D>;
    constructor(_intl: MdDatetimepickerIntl);
    _open(event: Event): void;
}
