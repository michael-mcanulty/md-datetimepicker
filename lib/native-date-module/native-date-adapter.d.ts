import { DateAdapter } from './date-adapter';
/** Adapts the native JS Date for use with cdk-based components that work with dates. */
export declare class NativeDateAdapter extends DateAdapter<Date> {
    getYear(date: Date): number;
    getMonth(date: Date): number;
    getDate(date: Date): number;
    getDayOfWeek(date: Date): number;
    getMonthNames(style: 'long' | 'short' | 'narrow'): string[];
    getDateNames(): string[];
    getDayOfWeekNames(style: 'long' | 'short' | 'narrow'): string[];
    getYearName(date: Date): string;
    getFirstDayOfWeek(): number;
    getNumDaysInMonth(date: Date): number;
    clone(date: Date): Date;
    today(): Date;
    parse(value: any): Date | null;
    format(date: Date, displayFormat: Object): string;
    addCalendarYears(date: Date, years: number): Date;
    addCalendarMonths(date: Date, months: number): Date;
    addCalendarDays(date: Date, days: number): Date;
    getISODateString(date: Date): string;
    /** Creates a date but allows the month and date to overflow. */
    private _createDateWithOverflow(year, month, date, hours?, minutes?);
    /**
     * Pads a number to make it two digits.
     * @param n The number to pad.
     * @returns The padded number.
     */
    private _2digit(n);
    /**
     * Strip out unicode LTR and RTL characters. Edge and IE insert these into formatted dates while
     * other browsers do not. We remove them to make output consistent and because they interfere with
     * date parsing.
     * @param str The string to strip direction characters from.
     * @returns The stripped string.
     */
    private _stripDirectionalityCharacters(str);
    createDate(year: number, month: number, date: number, hours?: number, minutes?: number): Date;
    setHours(date: Date, hours: number): Date;
    setMinutes(date: Date, minutes: number): Date;
    setSeconds(date: Date): Date;
    getHours(date: Date): number;
    isPm(date: Date): boolean;
    getMinutes(date: Date): number;
    is12Hour(): boolean;
    toLocaleTimeString(date: Date): string;
}
