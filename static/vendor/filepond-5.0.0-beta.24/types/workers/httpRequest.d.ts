export interface RequestParams {
    url: string;
    method: string | undefined;
    responseType: XMLHttpRequestResponseType | undefined;
    formData?: any;
    data?: any;
    headers: string[][];
    timeout?: number;
    withCredentials: boolean | undefined;
}
export interface RequestResponse {
    response: string;
    responseHeaders: string;
}
export interface RequestOptions {
    abortController?: AbortController;
    onprogress: (e: ProgressEvent) => void;
    onabort: () => void;
}
export declare function httpRequest({ url, method, formData, data, headers, timeout, withCredentials, responseType, }: RequestParams, cb: (error: string | null, response?: RequestResponse, transferList?: Transferable[]) => void, { abortController, onprogress, onabort }: RequestOptions): void;
export declare namespace httpRequest {
    var fileName: string;
}
