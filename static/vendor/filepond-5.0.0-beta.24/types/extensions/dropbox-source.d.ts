export interface DropboxSourceOptions {
    script?: string;
    appKey?: string;
    target?: string | HTMLElement;
    buttonLabel?: string;
    dropboxOptions?: {
        [key: string]: any;
    };
}
export declare const DropboxSource: import("./common/createExtension.js").Extension;
declare module '../index.js' {
    interface FilePondElement {
        DropboxSource: DropboxSourceOptions;
    }
    interface defineFilePondOptions {
        DropboxSource: DropboxSourceOptions;
    }
}
