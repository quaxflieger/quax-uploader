import { type ValidatorExtensionOptions } from './common/createValidatorExtension.js';
export interface MediaResolutionValidatorOptions extends ValidatorExtensionOptions {
    /** Min media width. Defaults to `1` */
    minWidth?: number;
    /** Max media width. Defaults to `Infinity` */
    maxWidth?: number;
    /** Min media height. Defaults to `1` */
    minHeight?: number;
    /** Max media height. Defaults to `Infinity` */
    maxHeight?: number;
    /** Min media resolution. Defaults to `1` */
    minResolution?: number;
    /** Max media resolution. Defaults to `Infinity` */
    maxResolution?: number;
    /**
     * Function used to convert pixels (resolution) to natural resolution. Defaults to `(pixels) => Math.round(pixels / 1000000)`
     */
    toNaturalResolution?: (pixels: number) => string;
}
export declare const MediaResolutionValidator: (pond: import("../core/extensionManager.js").ExtensionManagerAPI) => import("./common/createExtension.js").ExtensionInstance;
declare module '../index.js' {
    interface FilePondElement {
        MediaResolutionValidator: MediaResolutionValidatorOptions;
    }
    interface defineFilePondOptions {
        MediaResolutionValidator: MediaResolutionValidatorOptions;
    }
}
