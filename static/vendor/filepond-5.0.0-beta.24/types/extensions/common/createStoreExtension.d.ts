import type { ExtensionAPI, ExtensionOptions } from './createExtension.js';
import type { FilePondEntry, FilePondFileEntry } from '../../types/index.js';
import type { TaskFnOptions } from '../../core/taskScheduler.js';
export type StoreFactory = (instance: ExtensionOptions, api: ExtensionAPI) => StoreExtensionFunctions;
export interface StoreTaskFnOptions extends TaskFnOptions {
    onprogress: (e: ProgressEvent) => void;
    onabort: () => void;
}
export interface StoreExtensionFunctions {
    storeEntry: FunctionStore;
    restoreEntry?: FunctionRestore;
    releaseEntry?: FunctionRelease;
}
export interface StoreExtensionOptions {
    /** If an upload is really fast, will show simulated progress to instill confidence in upload, configure with `PerceivedPerformanceOptions`. By default isn't set, when set to `true` the following settings are used:
    
    ```js
    {
        minDuration: 500,
        maxDuration: 750,
        minStep: 50,
        maxStep: 150
    }
    ```
    */
    perceivedPerformance?: boolean | PerceivedPerformanceOptions;
    /** How many of these store operations can run in parallel */
    parallel?: number;
    /** The key to use when setting the storage id */
    valueKey?: string;
    /** Action to run to trigger the store operation, defaults to 'store' */
    actionStore?: string;
    /** Action to run to trigger the load operation, defaults to 'load' */
    actionLoad?: string;
    /** Action to run to trigger the abort operation, defaults to 'abort' */
    actionAbort?: string;
    /**
     * Determines if we should store the entry, if returns true, the `actionStore` prop is set
     * automatically. When this prop is set the `actionStore` prop cannot be set to `false` to
     * reset the store operation
     */
    shouldStore: (entry: FilePondEntry) => Promise<boolean>;
}
export type FunctionStore = (entry: FilePondFileEntry, options: StoreTaskFnOptions) => Promise<string | boolean | void>;
export type FunctionRestore = (storageId: string, entry: FilePondFileEntry, options: StoreTaskFnOptions) => Promise<File | void>;
export type FunctionRelease = (storageId: string, entry: FilePondFileEntry, options?: TaskFnOptions & {
    onabort?: () => void;
}) => Promise<boolean | void>;
/** Used to simulate load or store progress, the progress duration will be random between `minDuration` and `maxDuration` the progress step length will be random between `minStep` and `maxStep` */
export interface PerceivedPerformanceOptions {
    /** The minimum duration of the operation in milliseconds */
    minDuration: number;
    /** The maximum duration of the operation in milliseconds  */
    maxDuration: number;
    /** The minimum duration till next step in milliseconds  */
    minStep: number;
    /** The maximum duration till next step in milliseconds  */
    maxStep: number;
}
export declare function createStoreExtension(extensionName: string, storeOptions: StoreExtensionOptions, storeFactory: StoreFactory): import("./createExtension.js").Extension;
