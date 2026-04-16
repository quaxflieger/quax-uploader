import type { FilePondEntry, Progress } from '../types/index.js';
/**
 * Simulate progress, we'll look at progress from actual upload and compare to simulated progress, we'll use the lower progress value
 */
export declare function createPerceivedPerformanceProxy(fn: any, options: any): (entry: FilePondEntry, { onprogress, onabort, abortController, }: {
    onprogress: (e: Progress) => void;
    onabort: () => void;
    abortController: AbortController;
}) => Promise<unknown>;
