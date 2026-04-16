import type { FilePondFileEntry } from '../types/index.js';
import { type TransformExtensionOptions } from './common/createTransformExtension.js';
export interface FileNameTransformOptions extends TransformExtensionOptions {
    /** Action name to use for rename. Defaults to `'renameFile'` */
    actionTransform?: string;
    /** Function to use for sanitizing the user input. */
    sanitizeName?: (fileName: string) => string;
    /** Allows requesting a new filename. */
    renameEntry?: (entry: FilePondFileEntry, options: {
        basename: string;
        extension: string;
        history: string[];
    }) => Promise<string>;
}
export declare const FileNameTransform: (pond: import("../core/extensionManager.js").ExtensionManagerAPI) => import("./common/createExtension.js").ExtensionInstance;
declare module '../index.js' {
    interface FilePondElement {
        FileNameTransform: FileNameTransformOptions;
    }
    interface defineFilePondOptions {
        FileNameTransform: FileNameTransformOptions;
    }
}
