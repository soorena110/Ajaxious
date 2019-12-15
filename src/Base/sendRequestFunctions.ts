import {AjaxiousMethodTypes, AjaxiousResponse, AjaxOptions, AjaxRequest} from "../models";
import {logAjaxRequestResult} from "./AjaxLog";

export const sendRequestOrFetch = async (
    basePath: string,
    baseHeaders: HeadersInit,
    baseFetchOptions: RequestInit,
    request: AjaxRequest): Promise<AjaxiousResponse> => {

    const completeUrl = getCompleteUrl(basePath, request.url, request.params);
    const body = getAjaxBody(request.method, request.body);
    const headers = getAjaxHeader(baseHeaders, request.options, request.method, request.body);


    const response = await fetch(completeUrl, {
        ...baseFetchOptions,
        ...(request.options && request.options.fetchOptions || {}),
        method: request.method,
        body, headers
    });

    const data = await getDataFromResponse(response);
    const statusCategory = Math.floor(response.status / 100);
    const retObj: AjaxiousResponse = {
        status: response.status, data, response,
        isSuccess: [4, 5].indexOf(statusCategory) == -1
    };
    (retObj as any)[`is${statusCategory}xx`] = true;


    if (!request.options || !request.options.neverLog) {
        logAjaxRequestResult(request.url, request.method, response, data,
            {
                request,
                response,
                headers,
                completeUrl,
                base: {
                    basePath,
                    baseHeaders,
                    baseFetchOptions
                }
            }
        );
    }

    return retObj;
};


const getCompleteUrl = (basePath: string, url: string, params?: object, options?: AjaxOptions) => {
    if (!params) params = {};

    const urlType = options && options.urlType || (url.indexOf(':/') != -1 ? 'absolute' : 'relative');

    let completeUrl = url;
    if (urlType == 'relative')
        completeUrl = basePath + (url[0] != '/' ? '/' : '') + url;
    if (params) {
        const queryString = Object.getOwnPropertyNames(params).map(v => v + '=' + (params as any)[v]).join('&');
        completeUrl += (queryString != null && queryString != '' ? '?' + queryString : '');
    }

    return completeUrl;
};

const getAjaxBody = (method: AjaxiousMethodTypes, body?: object): BodyInit | undefined => {
    if (method == 'GET' || !body)
        return undefined;

    if (body.toString() == "[object FormData]")
        return body as FormData;
    if (typeof body == 'object')
        return JSON.stringify(body);
    return undefined
};


const getAjaxHeader = (baseHeaders: HeadersInit, options: { headers?: HeadersInit } | undefined, method: AjaxiousMethodTypes, body?: object): HeadersInit => {
    const header = {} as any;
    if (body && typeof body == 'object' && body.toString() != "[object FormData]")
        header['Content-Type'] = 'application/json';

    const overridingOptions = options && options.headers || baseHeaders;
    return {...header, ...overridingOptions};
};

const getDataFromResponse = async (response: Response) => {
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.indexOf("application/json") !== -1)
        try {
            return await response.json();
        } catch {
            console.error(`Response content-type is 'application/json', but could not turn it into json object.`)
        }

    return await response.text();
};