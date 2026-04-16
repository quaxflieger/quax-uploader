import type { RequestHook, FilePondEntry } from '../types/index.js';
export interface URLLoaderOptions {
    /** Action to run to trigger the load operation, defaults to `'load'`. */
    actionLoad?: string;
    /** Action to run to abort the load operation, defaults to `'abort'`. */
    actionAbort?: string;
    /** Hook that runs when determining the name for a file. Defaults to `() => 'Untitled'`. */
    getBaseName?: (entry: FilePondEntry, blob: Blob) => string;
    /** An object with key value pairs describing mime type relation to extension. */
    mimeTypeMap?: {
        [key: string]: string;
    };
    /** Fetch remote HEAD to get file content length and type so meta data is updated sooner, defaults to `true`. */
    fetchHead?: boolean;
    /** Maximum number of URLs to load in parallel, defaults to `2`. */
    parallel?: number;
    /** Determines if we should use WebWorkers for the `XMLHttpRequest`, defaults to `true`. */
    useWebWorkers?: boolean;
    /** Where the extension can find the WebWorker to use */
    workersURL?: URL;
    /** Intercept options sent to XMLHttpRequest with `RequestHook`. */
    willRequestWithOptions?: RequestHook;
}
export declare const URLLoader: import("./common/createExtension.js").Extension;
declare module '../index.js' {
    interface FilePondElement {
        URLLoader: URLLoaderOptions;
    }
    interface defineFilePondOptions {
        URLLoader: URLLoaderOptions;
    }
}
