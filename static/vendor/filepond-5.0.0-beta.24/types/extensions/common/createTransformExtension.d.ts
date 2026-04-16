import type { ExtensionManagerAPI } from '../../core/extensionManager.js';
import type { ExtensionAPI, ExtensionInstance, ExtensionOptions } from './createExtension.js';
import type { FilePondEntry, FilePondFileEntry, Progress } from '../../types/index.js';
export type TransformFactory = (instance: ExtensionOptions, api: ExtensionAPI) => TransformExtensionFunctions;
export interface TransformExtensionFunctions {
    /** Determines if we even can transform this entry */
    canTransformEntry?: (entry: FilePondEntry) => Promise<boolean> | boolean;
    /** Runs before the transformEntry function, useful for loading dependencies */
    prepareTransformEntry?: (entry: FilePondFileEntry & {
        file: File;
    }, options: {
        abortController: AbortController;
        onprogress: (e: Progress) => void;
    }) => Promise<void>;
    /** Transforms the passed FilePond entry */
    transformEntry: (entry: FilePondFileEntry & {
        file: File;
    }, options: {
        abortController: AbortController;
        onprogress: (e: Progress) => void;
    }) => Promise<{
        file: File;
        history?: any[];
    } | File | undefined | null> | {
        file: File;
        history?: any[];
    } | File | undefined | null;
}
export interface TransformExtensionOptions {
    /** Action to run to trigger this extension, defaults to 'transform' */
    actionTransform?: string;
    /** Action to run to trigger file load */
    actionLoad?: string;
    /**
     * Determines if we should transform the entry, if true, the `actionTransfrom` prop is set
     * automatically. When this prop is set the `actionTransform` prop cannot be set to `false` to
     * reset the transform
     */
    shouldTransform?: (entry: FilePondEntry) => Promise<boolean> | boolean;
    /** How many transform operations can run in parallel, defaults to `1` */
    parallel?: number;
}
export declare function createTransformExtension(extensionName: string, transformProps: TransformExtensionOptions, transformFactory: TransformFactory): (pond: ExtensionManagerAPI) => ExtensionInstance;
