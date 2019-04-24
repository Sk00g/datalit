export class EventListener {
    constructor(targetSource, eventType, callback, options) {
        this.targetSource = targetSource;
        this.eventType = eventType;
        this.callback = callback;
        this.priority = options.priority;
        this.oneOff = options.oneOff;
        this.UID = options.UID;
    }
}
