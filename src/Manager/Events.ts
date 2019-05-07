export class EventHandler {
    private _eventHandlers: { [key: string]: Function[]; } = {};

    public addEventListener(theEvent: string, theHandler: any) {
        this._eventHandlers[theEvent] = this._eventHandlers[theEvent] || [];
        this._eventHandlers[theEvent].push(theHandler);
    }

    removeEventListener(theEvent: string, theHandler: any) {
        throw 'not implemented yet'
    }

    removeAllListeners(theEvent: string) {
        throw 'not implemented yet'
    }

    trigger(theEvent: string, data?: any) {
        var theHandlers = this._eventHandlers[theEvent];
        if (theHandlers) {
            for (var i = 0; i < theHandlers.length; i += 1) {
                this.dispatchEvent(theEvent, theHandlers[i], data);
            }
        }
    }

    private dispatchEvent(theEvent: string, theHandler: any, data?: any) {
        theHandler(data);
    }
}