import type { ExtensionManagerAPI } from '../../core/extensionManager.js';
import type { ExtensionAPI, ExtensionInstance, ExtensionOptions } from './createExtension.js';
import type { FilePondEntry } from '../../types/index.js';
export type ValidatorFactory = (instance: ExtensionOptions, api: ExtensionAPI) => ValidatorExtensionFunctions;
export interface ValidationResultInvalid {
    code: string;
    values?: {
        [key: string]: any;
    } | null;
}
export interface ValidatorExtensionOptions {
    /**
     * Determines if we should validate the entry, if returns `false`, the entry is skipped
     */
    shouldValidate?: (entry: FilePondEntry) => Promise<boolean>;
}
export interface ValidatorExtensionFunctions {
    /** Returns `true` when can run validation logic on this entry */
    canValidateEntry?: (entry: FilePondEntry) => Promise<boolean> | boolean;
    /** Returns `string` when error state, returns `null` when all is fine */
    validateEntry: (entry: FilePondEntry) => Promise<null | ValidationResultInvalid> | (null | ValidationResultInvalid);
}
export declare function createValidatorExtension(extensionName: string, validatorProps: ValidatorExtensionOptions, validatorFactory: ValidatorFactory): (pond: ExtensionManagerAPI) => ExtensionInstance;
