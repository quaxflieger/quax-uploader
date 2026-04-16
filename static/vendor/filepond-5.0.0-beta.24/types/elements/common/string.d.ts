import type { Locale, DynamicLocale } from '../../types/index.js';
/** Removes falsy values, concatenated strings, returns undefined if results in empty string */
export declare function toSpaceSeparatedString(...names: (string | undefined)[]): string | undefined;
export declare function statusCodeToLocaleKey(code: string): string;
/** Drills down into an objecto find a prop value, if is null or undefined, returns empty string */
export declare function getObjectValueByString(selector: string, value: any): any;
export declare function stringReplaceVariables(label: string | DynamicLocale, data?: {
    [key: string]: string | number | boolean | null;
}, locale?: Locale): string;
export declare function getValueByKeyFromData(key: string, data: {
    [key: string]: string;
}, defaultValue?: string): string;
export declare function statusToLabel({ code, subcode, values }: any, locale: Locale): string | undefined;
export declare function statusToIcon({ type }: {
    type: string;
}, locale: Locale, assets: {
    [key: string]: string;
}): string | null | undefined;
/** Automatically replace labels and icons */
export declare function withResources(props: any, resourceMap: {
    [componentProperty: string]: string;
}, resources: {
    locale: Locale;
    assets: {
        [key: string]: string;
    };
}): any;
