import {AjaxSetting} from "../AjaxManager/Settings";
import {AjaxBody, AjaxOptions, AjaxRequest, AjaxResult, MethodTypes} from "../models";
import {logAjaxRequestResult} from "./AjaxLog";

export const sendRequestOrFetch = async (request: AjaxRequest): Promise<AjaxResult> => {
    const completeUrl = getCompleteUrl(request.url, request.params);
    const body = getAjaxBody(request.method, request.body);
    const headers = getAjaxHeader(request.options, request.method, request.body);


    const response = await fetch(completeUrl, {
        method: request.method, body, headers
    });

    const data = await getDataFromResponse(response);
    const retObj = {status: response.status, data, response};

    if (!request.options || !request.options.neverLog) {
        logAjaxRequestResult(request.url, request.method, response, data,
            {
                body: request.body,
                params: request.params,
                options: request.options,
                headers,
                completeUrl,
                response,
                ajaxiousSettings: AjaxSetting
            }
        );
    }

    return retObj;
};


const getCompleteUrl = (url: string, params?: object, options?: AjaxOptions) => {
    if (!params) params = {};

    const urlType = options && options.urlType || (url.indexOf('://') != -1 ? 'absolute' : 'relative');

    let completeUrl = url;
    if (urlType == 'relative')
        completeUrl = AjaxSetting.path + (url[0] != '/' ? '/' : '') + url;
    if (params) {
        const queryString = Object.getOwnPropertyNames(params).map(v => v + '=' + (params as any)[v]).join('&');
        completeUrl += (queryString != null && queryString != '' ? '?' + queryString : '');
    }

    return completeUrl;
};

const getAjaxBody = (method: MethodTypes, body?: object): BodyInit | undefined => {
    if (method == 'GET' || !body)
        return undefined;

    if (body.toString() == "[object FormData]")
        return body as FormData;
    if (typeof body == 'object')
        return JSON.stringify(body);
    return undefined
};


const getAjaxHeader = (options: { headers?: HeadersInit } | undefined, method: MethodTypes, body?: object): HeadersInit => {
    const header = {} as any;
    if (body && typeof body == 'object' && body.toString() != "[object FormData]")
        header['Content-Type'] = 'application/json';

    const overridingOptions = options && options.headers || AjaxSetting.header;
    return {...header, ...overridingOptions};
};

const getDataFromResponse = async (response: Response) => {
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.indexOf("application/json") !== -1)
        try {
            return await response.json();
        } catch {
        }

    return await response.text();
};