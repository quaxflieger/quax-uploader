import type { Needle, FilePondEntry, FilePondEntrySource } from '../../types/index.js';
import type { Vector } from '../../utils/vector.js';
import { FilePondSvelteComponentElement } from '../FilePondSvelteComponent/index.svelte.js';
export interface AnimatedEntry {
    delayed: boolean;
    entry: FilePondEntry;
    animation: string;
    oncancel: () => void;
    oncomplete: () => void;
}
export interface DragInteraction {
    id: string;
    element: HTMLElement | undefined;
    offset?: Vector;
    translation?: Vector;
    vector?: Vector;
    viewPosition?: Vector;
    direction?: 'none' | 'up' | 'down' | 'left' | 'right';
}
export interface DropState {
    id?: string;
    remove: boolean;
}
export interface DragState {
    id: string;
    index: number;
    element: HTMLElement | undefined;
    offset?: Vector;
    translation?: Vector;
    parentTranslation?: Vector;
    outside?: boolean;
}
export interface AppCallbacks {
    setEntries: (entries: FilePondEntry[]) => void;
    insertEntries: (entry: FilePondEntrySource | FilePondEntrySource[], index?: number | number[]) => void;
    removeEntries: (...needles: Needle[]) => ({
        entry: FilePondEntry;
        index: number[];
    } | void)[] | {
        entry: FilePondEntry;
        index: number[];
    } | void;
    updateEntry: (needle: Needle, ...props: any[]) => void;
    setEntryExtensionState: (entry: FilePondEntry, props: {
        [key: string]: any;
    }) => void;
    getEntryExtensionState: (entry: FilePondEntry) => {
        [key: string]: any;
    };
    pushTask: (id: string, fn: Function, options?: {
        parallel?: number;
        ignoreSoftFailure?: boolean;
    }) => void;
    abortTask: (id: string, fn: Function) => void;
}
export declare const COMPONENT_PROPS: string[];
/** FilePond EntryList Element */
export declare class FilePondEntryListElement extends FilePondSvelteComponentElement {
    constructor();
    connectedCallback(): void;
}
export declare function getDefaultEntryAnimationOriginMap(): {
    clipboard: string;
    drop: string;
    input: string;
    remote: string;
};
export declare function getDefaultSpringOptions(): {
    stiffness: number;
    damping: number;
    precision: number;
};
export declare function getDefaultEntryAnimationProps(): {
    disolve: {
        scale: number;
        opacity: number;
    };
    lift: {
        translationSpringOptions: {
            stiffness: number;
            damping: number;
        };
        scaleSpringOptions: {
            stiffness: number;
            damping: number;
        };
        scale: number;
        opacity: number;
    };
    release: {
        scale: number;
        opacity: number;
    };
    fall: {
        scaleSpringOptions: {
            stiffness: number;
            damping: number;
        };
        scale: number;
        opacitySpringOptions: {
            stiffness: number;
            damping: number;
        };
        opacity: number;
    };
    rise: {
        translationFrom: {
            x: number;
            y: number;
        };
        scaleSpringOptions: {
            stiffness: number;
            damping: number;
        };
        scaleFrom: number;
        scale: number;
        opacitySpringOptions: {
            stiffness: number;
            damping: number;
        };
        opacityFrom: number;
        opacity: number;
    };
    drop: {
        scaleSpringOptions: {
            stiffness: number;
            damping: number;
        };
        scaleFrom: number;
        scale: number;
        opacitySpringOptions: {
            stiffness: number;
            damping: number;
        };
        opacityFrom: number;
        opacity: number;
    };
    slide: {
        translationSpringOptions: {
            stiffness: number;
            damping: number;
        };
        translationFrom: {
            x: number;
            y: number;
        };
        scaleSpringOptions: {
            stiffness: number;
            damping: number;
        };
        scaleFrom: number;
        scale: number;
        opacitySpringOptions: {
            stiffness: number;
            damping: number;
        };
        opacityFrom: number;
        opacity: number;
    };
};
