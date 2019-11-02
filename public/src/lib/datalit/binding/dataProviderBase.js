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
    initializeEndpoint(key) {
        throw new Error("'initializeEndpoint' must be implemented in all DataProvider classes'");
    }

    hasEndpoint(key) {
        throw new Error("'hasEndpoint' must be implemented in all DataProvider classes'");
    }

    getEndpointType(key) {
        throw new Error("'getEndpointType' must be implemented in all DataProvider classes'");
    }

    persistEndpoint(key, data) {
        throw new Error("'persistEndpoint' must be implemented in all DataProvider classes");
    }

    validateEndpoint(key, data) {
        throw new Error("'validateEndpoint' must be implemented in all DataProvider classes");
    }
}
