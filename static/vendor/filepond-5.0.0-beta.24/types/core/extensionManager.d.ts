import { type TaskOptions } from './taskScheduler.js';
import type { ExtensionInstance, ExtensionState, ExtensionStatus, Extension } from '../extensions/common/createExtension.js';
import type { FilePondEntry } from '../types/index.js';
import type { createEntryTree, Needle } from './entryTree.js';
export type ExtensionFactory = Extension | [Extension, {
    [key: string]: unknown;
}];
export type ExtensionFactoryInsertInstructions = Extension | [Extension, {
    [key: string]: unknown;
}] | [Extension, {
    [key: string]: unknown;
}, {
    before: string;
    after?: undefined;
}] | [Extension, {
    [key: string]: unknown;
}, {
    before?: undefined;
    after: string;
}];
export interface LoadedExtension {
    current?: any;
    index: number;
    instance: ExtensionInstance;
    factory: Extension;
}
export interface ExtensionManagerState {
    extension: {
        [name: string]: ExtensionState;
    };
}
export interface ExtensionManagerAPI {
    on: (event: string, callback: (detail?: any) => void) => () => void;
    setEntries: (entries: FilePondEntry[]) => void;
    getEntries: () => FilePondEntry[];
    insertEntries: (entry: FilePondEntry | FilePondEntry[], index?: number | number[]) => void;
    removeEntries: (...needles: Needle[]) => ({
        entry: FilePondEntry;
        index: number[];
    } | void)[] | {
        entry: FilePondEntry;
        index: number[];
    } | void;
    updateEntry: (needle: Needle, ...props: any[]) => void;
    replaceEntry: (needle: Needle, ...entries: FilePondEntry[]) => void;
    pushTask: <T>(entryId: string, fn: (entry: T, options: {
        abortController: AbortController;
    }) => Promise<void | boolean> | void | boolean, options?: TaskOptions) => void;
    abortTask: <T>(entryId: string, fn: (entry: T, options: {
        abortController: AbortController;
    }) => Promise<void | boolean> | void | boolean) => void;
    abortTasks: (group?: string) => void;
    setExtensionState: (state: any) => void;
    getExtensionState: () => any;
    setExtensionStatus: (status: ExtensionStatus) => void;
    getExtensionStatus: () => ExtensionStatus;
}
export interface ExtensionMangerInstance {
    on: (event: string, callback: (detail?: any) => void) => () => void;
    get extensions(): Extension[];
    set extensions(newExtensionFactories: ExtensionFactory[]);
    propagateExtensionProperty: (propertyName: string, value: any) => void;
    setExtensionProperties: (extensionName: string, props: {
        [key: string]: any;
    }) => void;
    getExtensionProperties: (extensionName: string) => {
        [key: string]: any;
    } | undefined;
    getState(): {
        [name: string]: ExtensionState;
    };
    destroy(): void;
}
export declare function createExtensionManager(tree: ReturnType<typeof createEntryTree>): ExtensionMangerInstance;
