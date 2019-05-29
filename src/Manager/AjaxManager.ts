import {EventHandler} from "./Events";
import {AjaxSetting} from "./Settings";
import {logAjaxRequestResult} from "./AjaxLog";
import {AjaxOptions, AjaxResult, AjaxStatus, EventTypes, MethodTypes} from "./_models";

if (!(window as any).ajaxiousUrlMapper)
    (window as any).ajaxiousUrlMapper = (url: string) => url;

export default class AjaxManager {
    private _eventHandler = new EventHandler();

    public setPath(path: string) {
        const lastChar = path[path.length - 1];
        if (lastChar == '/' || lastChar == '\\')
            path = path.substr(0, path.length - 1);
        AjaxSetting.path = path;
    }

    public getPath() {
        return AjaxSetting.path;
    }

    public setHeader(header: HeadersInit) {
        AjaxSetting.header = header;
    }

    public getHeader() {
        return AjaxSetting.header;
    }

    public addEventListener(eventName: EventTypes, listener: (response: any) => void) {
        this._eventHandler.addEventListener(eventName, listener);
    };

    public async post(url: string, body?: any, params?: any, options?: AjaxOptions) {
        return this.request(url, 'POST', body, params, options);
    }

    public async get(url: string, params?: any, options?: AjaxOptions) {
        return this.request(url, 'GET', undefined, params, options);
    }

    public async delete(url: string, body?: any, params?: any, options?: AjaxOptions) {
        return this.request(url, 'DELETE', body, params, options);
    }

    public async put(url: string, body?: any, params?: any, options?: AjaxOptions) {
        return this.request(url, 'PUT', body, params, options);
    }

    public async request(url: string, method: MethodTypes,
                         body?: any, params?: any, options: AjaxOptions = {}) {
        const request = {url, method, body, params, options};

        if (!options.dontTriggerEvents)
            this._eventHandler.trigger('onRequesting', {request});

        try {
            const result = await this._sendRequestAndFetch(url, method, body, params, options);

            if (!options.dontTriggerEvents) {
                if (result.status == AjaxStatus.ok) {
                    result.data.description = options.successMessage;
                    this._eventHandler.trigger('onSuccess', {request, result});
                }
                else if (result.status / 100 == 4) {
                    result.data.description = options.errorMessage;
                    this._eventHandler.trigger('onError', {request, result});
                }
                if (result.status == AjaxStatus.unAuthorized)
                    this._eventHandler.trigger('onUnauthorized', {request, result});
                this._eventHandler.trigger(`on${result.status}`, {request, result})
            }

            return result as AjaxResult;
        }
        catch (error) {
            return {
                status: AjaxStatus.notSent,
                data: {},
                response: error
            } as AjaxResult
        }
        finally {
            if (!options.dontTriggerEvents)
                this._eventHandler.trigger('onDone');
        }
    }

    private async _sendRequestAndFetch(url: string, method: MethodTypes, body?: any, params?: any, options: AjaxOptions = {}): Promise<AjaxResult> {
        const ajaxBody = method != 'GET' ? JSON.stringify(body) : undefined;
        const completeUrl = this._getCompleteUrl(url, params);

        const response = await fetch(completeUrl, {
            method: method,
            body: ajaxBody,
            headers: AjaxSetting.header,
        });

        const data = await this._getDataFromResponse(response);

        const retObj = {status: response.status, data, response};


        if (!options.noLog) {
            logAjaxRequestResult(url, method, response, data,
                {body, params, options, completeUrl, response, ajaxiousSettings: AjaxSetting}
            );
        }

        return retObj;
    }

    private async _getDataFromResponse(response: Response) {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1)
            try {
                return await response.json();
            }
            catch {
            }

        return await response.text();
    }

    private _getCompleteUrl(url: string, params: any) {
        if (!params) params = {};

        let completeUrl = AjaxSetting.path + (url[0] != '/' ? '/' : '') + url;
        if (params) {
            const queryString = Object.getOwnPropertyNames(params).map(v => v + '=' + params[v]).join('&');
            completeUrl += (queryString != null && queryString != '' ? '?' + queryString : '');
        }

        const urlMapper = (window as any).ajaxiousUrlMapper;
        if (urlMapper)
            return urlMapper(completeUrl);

        return completeUrl;
    }
}