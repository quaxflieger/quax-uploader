import type { ExtensionFactory } from '../../core/extensionManager.ts';
import type { AnimationMode, Extension, Locale, SpringOptions } from '../../types/index.js';
import { FilePondInputElement } from '../FilePondInput/index.js';
import '../../extensions/file-input-source.js';
import '../../extensions/data-transfer-loader.js';
import '../../extensions/value-callback-store.js';
import '../../extensions/file-extension-validator.js';
import '../../extensions/file-mime-type-validator.js';
import '../../extensions/entry-list-view.js';
/** Wraps a set of extensions in with the default FilePond custom element extensions, this extension selection makes switching from a default input to a file-pond element as frictionless as possible */
export declare function createFilePondExtensionSet(extensions?: ExtensionFactory[]): Extension[];
export declare class FilePondElement extends FilePondInputElement {
    #private;
    /** Pass spring and animaton config to children */
    set springDefaults(value: SpringOptions);
    set animations(value: AnimationMode);
    /** Wraps `createFilePondExtensionSet` so we always set the default extension set */
    set extensions(value: ExtensionFactory[]);
    /** Set to false to hide credits */
    static get observedAttributes(): string[];
    attributeChangedCallback(name: string, _: string, value: string | boolean): void;
    /** Set to `true` to remove drop area */
    set noDrop(value: boolean);
    /** Returns current nodrop state */
    get noDrop(): boolean;
    /** Set to `true` to remove the attribution link */
    set noAttribution(value: boolean);
    /** Returns current noattribution state */
    get noAttribution(): boolean;
    constructor();
    connectedCallback(): void;
    /** Called each time the element is removed from the document. */
    disconnectedCallback(): void;
}
export interface defineFilePondOptions {
    /** Initial locale to use */
    locale?: Locale;
    /** Initial extensions to load on top of default FilePond extensions */
    extensions?: ExtensionFactory[];
    /** Initial Spring configuration */
    springDefaults?: SpringOptions;
    /** Location of web workers */
    workersURL?: URL;
}
/**
 * Registers the `<file-pond>` custom element, `initialOptions` passed will be assigned as props,
 * returns an array of `<file-pond>` components on the page at time of registration
 * @param initialOptions - The initial options to pass to the FilePond components
 */
export declare function defineFilePond(initialOptions?: defineFilePondOptions): FilePondElement[];
