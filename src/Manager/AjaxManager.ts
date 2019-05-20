import {EventHandler} from "./Events";
import {AjaxSetting} from "../Settings";
import {logAjaxRequestResult} from "./AjaxLog";
import {AjaxOptions, AjaxResult, AjaxStatus, MethodTypes} from "../AjaxModels";

export default class AjaxManager {
    private _eventHandler = new EventHandler();

    public setPath(path: string) {
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

    public addEventListener(eventName: 'onRequesting' | 'onSuccess' | 'onError' | 'onDone' | 'onUnauthorized', listener: (response: any) => void) {
        this._eventHandler.addEventListener(eventName, listener);
    };

    public async post(url: string, body?: any, params?: any, options?: AjaxOptions) {
        return this.request(url, 'POST', body, params, options);
    }

    public async get(url: string, params?: any, options?: AjaxOptions) {
        options = Object.assign({}, {isSilent: true}, options);
        return this.request(url, 'GET', undefined, params, options);
    }

    public async delete(url: string, body?: any, params?: any, options?: AjaxOptions) {
        return this.request(url, 'DELETE', body, params, options);
    }

    public async put(url: string, body?: any, params?: any, options?: AjaxOptions) {
        return this.request(url, 'PUT', body, params, options);
    }

    public async request(url: string, method: MethodTypes,
                         body?: any, params?: any, options?: AjaxOptions) {

        if (!options || !options.isSilent)
            this._eventHandler.trigger('onRequesting');

        if (!options)
            options = {};

        try {
            const retObj = await this._fetch(url, method, body, params, options);

            if (!options || !options.isSilent) {
                if (retObj.status == AjaxStatus.ok) {
                    retObj.data.description = options.successMessage;
                    this._eventHandler.trigger('onSuccess', retObj);
                }
                else if (retObj.status / 100 == 4) {
                    retObj.data.description = options.errorMessage;
                    this._eventHandler.trigger('onError', retObj);
                }
            }
            if (retObj.status == AjaxStatus.unAuthorized)
                this._eventHandler.trigger('onUnauthorized', retObj);


            return retObj as AjaxResult;
        }
        catch {
            return {
                status: AjaxStatus.notSent,
                data: {}
            } as AjaxResult
        }
        finally {
            if (!options || !options.isSilent)
                this._eventHandler.trigger('onDone');
        }
    }

    private async _fetch(url: string, method: MethodTypes, body?: any, params?: any, options?: AjaxOptions): Promise<AjaxResult> {
        let ajaxBody = undefined;
        if (method != 'GET')
            ajaxBody = JSON.stringify(body);

        let completeUrl = this._getCompleteUrl(url, params);

        const response = await fetch(completeUrl, {
            method: method,
            body: ajaxBody ? ajaxBody : undefined,
            headers: AjaxSetting.header,
        });

        let json = {} as any;
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1)
            try {
                json = await response.json();
            }
            catch {
            }
        else json = await response.text();

        const retObj = {
            status: response.status,
            data: json
        };


        if (!options || !options.noLog)
            logAjaxRequestResult(url, method, response, body, params, json);

        return retObj;
    }

    private _getCompleteUrl(url: string, params: any) {
        if (!params) params = {};

        let completeUrl = AjaxSetting.path + (url[0] != '/' ? '/' : '') + url;
        if (params) {
            const queryString = Object.getOwnPropertyNames(params).map(v => v + '=' + params[v]).join('&');
            completeUrl += (queryString != null && queryString != '' ? '?' + queryString : '');
        }

        return completeUrl;
    }
}