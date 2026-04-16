import { type ValidatorExtensionOptions } from './common/createValidatorExtension.js';
export interface FileNameValidatorOptions extends ValidatorExtensionOptions {
    /** A function that tests if the name is valid */
    test: (name: string) => boolean;
}
export declare const FileNameValidator: (pond: import("../core/extensionManager.js").ExtensionManagerAPI) => import("./common/createExtension.js").ExtensionInstance;
declare module '../index.js' {
    interface FilePondElement {
        FileNameValidator: FileNameValidatorOptions;
    }
    interface defineFilePondOptions {
        FileNameValidator: FileNameValidatorOptions;
    }
}
