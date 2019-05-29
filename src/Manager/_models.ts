export enum AjaxStatus {
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
    successMessage?: string;
    errorMessage?: string;
}

export interface AjaxRequest {
    url: string;
    method: MethodTypes;
    body?: any;
    params?: any;
    options?: AjaxOptions;
}

export type EventHandler = (request: AjaxRequest, result: AjaxResult) => void;

export type EventTypes = 'onRequesting' | 'onSuccess' | 'onError' | 'onDone' | 'onUnauthorized' | string

export type MethodTypes = 'POST' | 'GET' | 'PUT' | 'DELETE';

