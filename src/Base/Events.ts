

import {AjaxiousEventHandler, AjaxiousEventTypes} from "../models";

export class EventManager {
    private _eventHandlers: { [key: string]: AjaxiousEventHandler[]; } = {};

    public addEventListener(theEvent: AjaxiousEventTypes, theHandler: AjaxiousEventHandler) {
        this._eventHandlers[theEvent] = this._eventHandlers[theEvent] || [];
        this._eventHandlers[theEvent].push(theHandler);
    }

    removeEventListener(theEvent: AjaxiousEventTypes, theHandler: AjaxiousEventHandler) {
        const ix = this._eventHandlers[theEvent].indexOf(theHandler);
        if (ix != -1)
            this._eventHandlers[theEvent].splice(ix, 1);
        else console.warn(`[Ajaxious] You are trying to unsubscribe from '${theEvent}',
         but the handler is not subscribed before`)
    }

    removeAllListeners(theEvent: AjaxiousEventTypes) {
        this._eventHandlers[theEvent] = [];
    }

    trigger(theEvent: AjaxiousEventTypes, ...args: any) {
        const theHandlers = this._eventHandlers[theEvent];
        if (theHandlers) {
            for (let i = 0; i < theHandlers.length; i += 1) {
                this.dispatchEvent(theHandlers[i], ...args);
            }
        }
    }

    private dispatchEvent(theHandler: any, ...args: any) {
        theHandler(...args);
    }
}