import type { DragState } from '../index.js';
export interface DragContext {
    readonly current: DragState | undefined;
}
export declare function setDragContext(value: DragContext): void;
export declare function getDragContext(): DragContext;
