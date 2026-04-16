export declare function fade(node: HTMLElement, options?: {
    duration?: number;
    easing?: (t: number) => number;
}): {
    duration: number;
    easing: ((value: any) => any) | ((t: number) => number);
    tick: (t: number) => string;
};
