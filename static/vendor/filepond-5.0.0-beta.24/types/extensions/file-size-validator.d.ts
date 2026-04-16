import { type ValidatorExtensionOptions } from './common/createValidatorExtension.js';
export interface FileSizeValidatorOptions extends ValidatorExtensionOptions {
    /** Min file size in bytes or a natural file size. Defaults to `0` */
    minSize?: number | string;
    /** Max file size in bytes or a natural file size. Defaults to `Infinity` */
    maxSize?: number | string;
    /** The natural file size format to use, defaults to `'mega'` if no natural file size supplied for `minSize` or `maxSize` */
    byteUnits?: 'mega' | 'mebi';
}
export declare const FileSizeValidator: (pond: import("../core/extensionManager.js").ExtensionManagerAPI) => import("./common/createExtension.js").ExtensionInstance;
declare module '../index.js' {
    interface FilePondElement {
        FileSizeValidator: FileSizeValidatorOptions;
    }
    interface defineFilePondOptions {
        FileSizeValidator: FileSizeValidatorOptions;
    }
}
