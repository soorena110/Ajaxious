export enum AjaxStatus {
    error = -1,
    notSent = 0,
    ok = 200,
    badRequest = 400,
    unAuthorized = 401
}

export interface AjaxiousResponse {
    status: AjaxStatus;
    data: any;
    response: Response;

    is1xx?: true;
    is2xx?: true;
    is3xx?: true;
    is4xx?: true;
    is5xx?: true;
    isSuccess: boolean;
}

export type AjaxOptions = {
    neverLog?: boolean;
    dontTriggerEvents?: boolean;
    headers?: HeadersInit;
    urlType?: 'relative' | 'absolute';
    fetchOptions: RequestInit;
} | any;

export interface AjaxRequest {
    url: string;
    method: AjaxiousMethodTypes;
    body?: AjaxBody;
    params?: object;
    options?: AjaxOptions;
}

export type AjaxBody = object | FormData;

export type AjaxiousEventHandler = (request: AjaxRequest, result: AjaxiousResponse) => void;

export type AjaxiousEventTypes =
    'onRequesting'
    | 'onSuccess'
    | 'onError'
    | 'onDone'
    | 'onUnauthorized'
    | string

export type AjaxiousMethodTypes = 'POST' | 'GET' | 'PUT' | 'DELETE' | 'PATCH' | string;

export const ajaxEmpty = {status: AjaxStatus.notSent, data: {}} as AjaxiousResponse;
export const ajaxEmptyPromise = new Promise((resolve) => resolve(ajaxEmpty));

