export enum AjaxStatus {
    error = -3,
    cachedResult = -2,
    emptyResult = -1,
    notSent = 0,
    ok = 200,
    badRequest = 400,
    unAuthorized = 401
}

export interface AjaxResult {
    status: AjaxStatus;
    data: any;
    response: Response;
}

export interface AjaxOptions {
    neverLog?: boolean;
    dontTriggerEvents?: boolean;
    headers?: HeadersInit;
    urlType?: 'relative' | 'absolute'
}

export interface AjaxRequest {
    url: string;
    method: MethodTypes;
    body?: AjaxBody;
    params?: object;
    options?: AjaxOptions;
}

export type AjaxBody = object | FormData;

export type EventHandler = (request: AjaxRequest, result: AjaxResult) => void;

export type EventTypes = 'onRequesting' | 'onSuccess' | 'onError' | 'onDone' | 'onUnauthorized' | 'onError' | string

export type MethodTypes = 'POST' | 'GET' | 'PUT' | 'DELETE' | 'PATCH';

