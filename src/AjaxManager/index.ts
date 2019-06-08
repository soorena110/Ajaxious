import {EventManager} from "../Base/Events";
import {AjaxSetting} from "./Settings";
import {
    AjaxOptions,
    AjaxBody,
    AjaxRequest,
    AjaxResult,
    AjaxStatus,
    EventHandler,
    EventTypes,
    MethodTypes
} from "../models";
import {sendRequestOrFetch} from "../Base/sendRequestFunctions";

export default class AjaxManager {
    private _eventHandler = new EventManager();

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

    public addEventListener(eventName: EventTypes, handler: EventHandler) {
        this._eventHandler.addEventListener(eventName, handler);
    };

    public removeEventListener(eventName: EventTypes, handler: EventHandler) {
        this._eventHandler.removeEventListener(eventName, handler)
    }

    public removeAllListeners(eventName: EventTypes) {
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
        if (!request.options || !request.options.dontTriggerEvents)
            this._eventHandler.trigger('onRequesting', {request, result: {status: AjaxStatus.notSent, data: {}}});

        try {
            const result = await sendRequestOrFetch(request);
            this._raiseEvents(request, result);
            return result as AjaxResult;
        }
        catch (error) {
            console.error('Ajaxious has error !', error);
            this._eventHandler.trigger('onError', {request, result: {status: AjaxStatus.notSent, data: {}}});
            return {
                status: AjaxStatus.error,
                data: {},
                response: error
            } as AjaxResult
        }
        finally {
            if (!request.options || !request.options.dontTriggerEvents)
                this._eventHandler.trigger('onDone');
        }
    }

    private _raiseEvents(request: AjaxRequest, result: AjaxResult) {
        if (request.options && request.options.dontTriggerEvents)
            return;

        const eventArgs = {request, result};
        if (result.status == AjaxStatus.ok)
            this._eventHandler.trigger('onSuccess', eventArgs);
        else if (result.status / 100 == 4)
            this._eventHandler.trigger('onError', eventArgs);
        if (result.status == AjaxStatus.unAuthorized)
            this._eventHandler.trigger('onUnauthorized', eventArgs);
        this._eventHandler.trigger(`on${result.status}`, eventArgs)
    }

}

