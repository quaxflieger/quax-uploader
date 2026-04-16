import type { FilePondEntry, FilePondEntrySource } from '../types/index.js';
export interface EntryTreeOptions {
    /**
     * Called before inserting entries into the tree, allows limiting the amount of entries inserted
     */
    beforeInsertEntries?: (entriesToInsert: FilePondEntry[], currentEntries: FilePondEntry[]) => FilePondEntry[];
    /**
     * Called before an entry is added to the tree, allows manipulating the entry, or returning
     * false to prevent adding it, can be called multiple times
     */
    beforeOnboardEntry?: (entry: FilePondEntrySource) => false | FilePondEntry;
    /** Called before an `entry` is updated with `props`, allows manipulating the props */
    beforeUpdateEntryWithProps?: (entry: FilePondEntry, props: {
        [key: string]: any;
    }, isUpdatingData: boolean) => void;
}
/**
 * Is passed to `EntryTree` functions to find a `FilePondEntry`
 */
export type Needle = number | number[] | string | {
    id: string;
} | {
    id: string;
}[];
/** Lean headless file processor */
export declare function createEntryTree(options: EntryTreeOptions): {
    on: (event: string, callback: (detail?: any) => void) => () => void;
    insertEntries: (rawEntries: FilePondEntrySource | FilePondEntrySource[], index?: number | number[]) => void;
    findEntries: (...needles: (void | Needle)[]) => FilePondEntry | (FilePondEntry | undefined)[] | undefined;
    removeEntries: (...needles: Needle[]) => void | {
        entry: FilePondEntry;
        index: number[];
    } | (void | {
        entry: FilePondEntry;
        index: number[];
    })[];
    sortEntries: (fn: (a: FilePondEntry, b: FilePondEntry) => 1 | -1 | 0) => void;
    updateEntry: (needle: Needle, ...props: any[]) => void;
    replaceEntry: (needle: Needle, ...rawEntries: any[]) => void;
    moveEntry: (needle: Needle, index: number | number[]) => void;
    get entries(): FilePondEntry[];
    set entries(entries: FilePondEntrySource[]);
    destroy(): void;
};
