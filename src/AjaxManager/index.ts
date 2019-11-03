import {
    AjaxBody,
    ajaxEmpty,
    AjaxiousEventHandler,
    AjaxiousEventTypes,
    AjaxOptions,
    AjaxRequest,
    AjaxResult,
    AjaxStatus
} from "../models";
import {sendRequestOrFetch} from "../Base/sendRequestFunctions";
import {EventManager} from "azi-tools";

export default class AjaxManager {

    private _eventHandler = new EventManager<AjaxiousEventHandler, AjaxiousEventTypes>("Ajaxious");

    public setAllLogOptions(enabled: boolean) {
        (window as any).$trace.ajax.setAllLogsEnablity(enabled);
    }

    private _basePath = '';
    set basePath(path: string) {
        const lastChar = path[path.length - 1];
        if (lastChar == '/' || lastChar == '\\')
            path = path.substr(0, path.length - 1);
        this._basePath = path;
    }

    get basePath() {
        return this._basePath;
    }

    private _baseHeaders: HeadersInit | any = {};
    set baseHeaders(header: HeadersInit | any) {
        this._baseHeaders = header;
    }

    get baseHeaders() {
        return this._baseHeaders;
    }

    private _baseFetchOptions: RequestInit = {};
    set baseFetchOptions(options: RequestInit) {
        this._baseFetchOptions = options;
    }

    get baseFetchOptions() {
        return this._baseFetchOptions;
    }

    public addEventListener(eventName: AjaxiousEventTypes, handler: AjaxiousEventHandler) {
        this._eventHandler.addEventListener(eventName, handler);
    };

    public removeEventListener(eventName: AjaxiousEventTypes, handler: AjaxiousEventHandler) {
        this._eventHandler.removeEventListener(eventName, handler)
    }

    public removeAllListeners(eventName: AjaxiousEventTypes) {
        this._eventHandler.removeAllListeners(eventName)
    }


    public async post(url: string, body?: AjaxBody, params?: object, options?: AjaxOptions) {
        return this.request({url, method: 'POST', body, params, options});
    }

    public async get(url: string, params?: object, options?: AjaxOptions) {
        return this.request({url, method: 'GET', params, options});
    }

    public async delete(url: string, body?: AjaxBody, params?: object, options?: AjaxOptions) {
        return this.request({url, method: 'DELETE', body, params, options});
    }

    public async put(url: string, body?: AjaxBody, params?: object, options?: AjaxOptions) {
        return this.request({url, method: 'PUT', body, params, options});
    }

    public async request(request: AjaxRequest) {
        let result: AjaxResult = ajaxEmpty;

        if (!request.options || !request.options.dontTriggerEvents)
            this._eventHandler.trigger('onRequesting', request, result);

        try {
            result = await sendRequestOrFetch(this._basePath, this.baseHeaders, this.baseFetchOptions, request);
            this.raiseEvents(request, result);
            return result as AjaxResult;
        } catch (error) {
            console.error('Ajaxious has error !', error);
            const result = {
                status: AjaxStatus.error,
                data: {},
                response: error
            } as AjaxResult;
            this._eventHandler.trigger('onError', request, result);
            return result
        } finally {
            if (!request.options || !request.options.dontTriggerEvents)
                this._eventHandler.trigger('onDone', request, result);
        }
    }

    public raiseEvents(request: AjaxRequest, result: AjaxResult) {
        if (request.options && request.options.dontTriggerEvents)
            return;

        const eventArgs = [request, result];
        if (result.status == AjaxStatus.ok)
            this._eventHandler.trigger('onSuccess', ...eventArgs);
        else if (result.status / 100 >= 4)
            this._eventHandler.trigger('onError', ...eventArgs);
        if (result.status == AjaxStatus.unAuthorized)
            this._eventHandler.trigger('onUnauthorized', ...eventArgs);
        this._eventHandler.trigger(`on${result.status}`, ...eventArgs);
        this._eventHandler.trigger(`on${Number(result.status / 100)}xx`, ...eventArgs)
    }
}

