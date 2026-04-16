import type { ExtensionManagerAPI } from '../../core/extensionManager.js';
import type { FilePondEntry, Progress } from '../../types/index.js';
type EmptyObject = Record<PropertyKey, never>;
export interface ExtensionState {
    /** Current extension status */
    status?: ExtensionStatus;
    /** The actions that are available on this extension, used for toggling UI features */
    actions?: string[];
    /** Free to set other props */
    [key: string]: unknown;
}
export type ExtensionStatusType = 'error' | 'warning' | 'success' | 'info' | 'system';
export interface ExtensionStatus {
    type: ExtensionStatusType;
    code: string;
    subcode?: string;
    values?: {
        [key: string]: any;
    } | null;
    progress?: number | null;
    meta?: {
        [key: string]: any;
    } | null;
}
export interface ExtensionOptions {
    props: any;
    didSetProps: (cb: (props: any) => void) => void;
    extensionName: string;
}
export interface ExtensionAPI extends ExtensionManagerAPI {
    getEntryExtensionState: (entry: FilePondEntry) => {
        [key: string]: any;
    };
    setEntryExtensionState: (entry: FilePondEntry, state: {
        [key: string]: any;
    }) => void;
    getEntryExtensionStatus: (entry: FilePondEntry) => ExtensionStatus | EmptyObject;
    setEntryExtensionStatus: (entry: FilePondEntry, status: ExtensionStatus) => void;
    createProgressHandler: (entry: FilePondEntry) => (e: Progress) => void;
}
export type ExtensionFactoryFunction = (instance: ExtensionOptions, api: ExtensionAPI) => {
    destroy: () => void;
};
export interface ExtensionInstance {
    /** Extension name */
    get name(): string;
    /** Current props */
    getProps: () => {
        [key: string]: any;
    };
    /** New props */
    setProps: (newProps: {
        [key: string]: any;
    }) => void;
    /** Clean up extension */
    destroy: () => void;
}
export type Extension = (pond: ExtensionManagerAPI) => ExtensionInstance;
export declare function createExtension(extensionName: string, props: any, factory: ExtensionFactoryFunction): Extension;
export {};
