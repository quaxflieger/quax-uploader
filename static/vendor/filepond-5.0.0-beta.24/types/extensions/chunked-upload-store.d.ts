import type { StoreExtensionOptions } from './common/createStoreExtension.js';
import type { RequestHook } from '../types/index.js';
export interface ChunkedUploadStoreOptions extends StoreExtensionOptions {
    /** Server URL */
    url?: string;
    /** Chunk size in bytes */
    chunkSize?: number | string;
    /** Chunks to upload in parallel */
    parallelChunks?: number;
    /** How many milliseconds between retries */
    retryDelays?: number[];
    /** Allow pause/resume */
    resume?: boolean;
    /** Intercept options sent to XMLHttpRequest */
    willRequestWithOptions?: RequestHook;
}
export declare const ChunkedUploadStore: import("./common/createExtension.js").Extension;
declare module '../index.js' {
    interface FilePondElement {
        ChunkedUploadStore: ChunkedUploadStoreOptions;
    }
    interface defineFilePondOptions {
        ChunkedUploadStore: ChunkedUploadStoreOptions;
    }
}
