import {EventHandler} from "./_models";

export class EventManager {
    private _eventHandlers: { [key: string]: EventHandler[]; } = {};

    public addEventListener(theEvent: string, theHandler: EventHandler) {
        this._eventHandlers[theEvent] = this._eventHandlers[theEvent] || [];
        this._eventHandlers[theEvent].push(theHandler);
    }

    removeEventListener(theEvent: string, theHandler: EventHandler) {
        const ix = this._eventHandlers[theEvent].indexOf(theHandler);
        if (ix != -1)
            this._eventHandlers[theEvent].splice(ix, 1);
        else console.warn(`[Ajaxious] You are trying to unsubscribe from '${theEvent}',
         but the handler is not subscribed before`)
    }

    removeAllListeners(theEvent: string) {
        this._eventHandlers[theEvent] = [];
    }

    trigger(theEvent: string, data?: any) {
        const theHandlers = this._eventHandlers[theEvent];
        if (theHandlers) {
            for (let i = 0; i < theHandlers.length; i += 1) {
                this.dispatchEvent(theEvent, theHandlers[i], data);
            }
        }
    }

    private dispatchEvent(theEvent: string, theHandler: any, data?: any) {
        theHandler(data);
    }
}