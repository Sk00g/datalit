import { Events } from "../events/events.js";

export class DataProviderBase {
    constructor(title) {
        this.title = title;

        this.eventListeners = { dataUpdated: [] };
        Events.attachSource(this, ["dataUpdated"]);
    }

    dispatchEvent(eventName, data) {
        if (this.eventListeners[eventName].length < 1) return;
        for (let cb of this.eventListeners[eventName]) cb(data);
    }

    removeEventListener(eventName, callback) {
        if (!(eventName in this.eventListeners)) return;
        this.eventListeners[eventName].splice(this.eventListeners[eventName].indexOf(callback), 1);
    }

    addEventListener(eventName, callback) {
        if (!(eventName in this.eventListeners)) this.eventListeners[eventName] = [];
        this.eventListeners[eventName].push(callback);
    }

    // Override these
    hasEndpoint(key) {
        throw new Error("'hasEndpoint' must be implemented in all DataProvider classes'");
    }

    getEndpointType(key) {
        throw new Error("'getEndpointType' must be implemented in all DataProvider classes'");
    }
}
