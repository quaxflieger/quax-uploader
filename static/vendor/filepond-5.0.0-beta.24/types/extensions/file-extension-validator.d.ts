import { type ValidatorExtensionOptions } from './common/createValidatorExtension.js';
export interface FileExtensionValidatorOptions extends ValidatorExtensionOptions {
    /** An array of case-insensitive filename extensions, starting with a period ('.') character */
    accept?: string | string[];
    /** Formats the extensions for presentation in a validation message */
    format?: (mimeTypes: string[]) => string;
}
export declare const FileExtensionValidator: (pond: import("../core/extensionManager.js").ExtensionManagerAPI) => import("./common/createExtension.js").ExtensionInstance;
declare module '../index.js' {
    interface FilePondElement {
        FileExtensionValidator: FileExtensionValidatorOptions;
    }
    interface defineFilePondOptions {
        FileExtensionValidator: FileExtensionValidatorOptions;
    }
}
