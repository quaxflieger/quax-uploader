import { type StoreExtensionOptions } from './common/createStoreExtension.js';
export interface ObjectURLStoreOptions extends StoreExtensionOptions {
}
export declare const ObjectURLStore: import("./common/createExtension.js").Extension;
declare module '../index.js' {
    interface FilePondElement {
        ObjectURLStore: ObjectURLStoreOptions;
    }
    interface defineFilePondOptions {
        ObjectURLStore: ObjectURLStoreOptions;
    }
}
