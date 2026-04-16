import type { FilePondEntryListOptions } from '../types/index.js';
export interface EntryListViewOptions extends FilePondEntryListOptions {
}
export declare const EntryListView: import("./common/createExtension.js").Extension;
declare module '../index.js' {
    interface FilePondElement {
        EntryListView: EntryListViewOptions;
    }
    interface defineFilePondOptions {
        EntryListView: EntryListViewOptions;
    }
}
