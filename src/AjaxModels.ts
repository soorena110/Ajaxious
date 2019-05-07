export enum AjaxStatus {
    notSent = 0,
    ok = 200,
    badRequest = 400,
    unAuthorized = 401
}

export interface AjaxResult {
    status: AjaxStatus;
    data: any;
}

export interface AjaxOptions {
    isSilent?: boolean;
    successMessage?: string;
    errorMessage?: string;
}

export const ajaxEmptyPromise = new Promise((resolve) => resolve({status: -1, data: {}} as AjaxResult));
