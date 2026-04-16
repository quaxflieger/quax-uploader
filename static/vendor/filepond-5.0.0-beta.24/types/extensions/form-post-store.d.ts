import type { StoreExtensionOptions } from './common/createStoreExtension.js';
import type { RequestHook } from '../types/index.js';
export interface FormPostStoreOptions extends StoreExtensionOptions {
    /** Server URL, defaults to empty string */
    url?: string;
    /** The name of the form field being submitted with the form POST, defaults to `'entry'` */
    name?: string;
    /** when restoring a file will first do request head so we have file info, defaults to `true` */
    fetchHead?: boolean;
    /** Intercept options sent to `XMLHttpRequest` */
    willRequestWithOptions?: RequestHook;
}
export declare const FormPostStore: import("./common/createExtension.js").Extension;
declare module '../index.js' {
    interface FilePondElement {
        FormPostStore: FormPostStoreOptions;
    }
    interface defineFilePondOptions {
        FormPostStore: FormPostStoreOptions;
    }
}
