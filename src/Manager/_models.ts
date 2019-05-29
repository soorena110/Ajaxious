export enum AjaxStatus {
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
    noLog?: boolean;
    isSilent?: boolean;
    successMessage?: string;
    errorMessage?: string;
}

export type MethodTypes = 'POST' | 'GET' | 'PUT' | 'DELETE';

export const ajaxEmptyPromise = new Promise((resolve) => resolve({status: -1, data: {}, response: {}} as AjaxResult));
