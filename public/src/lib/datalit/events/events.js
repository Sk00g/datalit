import enums from "../enums.js";

var UID_COUNT = 1523;

class EventListener {
    constructor(targetSource, eventType, callback, options) {
        this.targetSource = targetSource;
        this.eventType = eventType;
        this.callback = callback;
        this.priority = options.priority;
        this.oneOff = options.oneOff;
        this.UID = options.UID;
    }
}

class EventManager {
    constructor(options = {}) {
        window.addEventListener("resize", ev => this.handleEvent(window, "resize", null));

        this.registrations = [];
    }

    getSourceType(source) {
        if (source.toString() == "Control") {
            return enums.EventSourceType.CONTROL;
        }
        // else if (source instanceof DataModel) return enums.EventSourceType.DATAMODEL;
        else {
            return enums.EventSourceType.NATIVE;
        }
    }

    unregister(UID) {
        let match = this.registrations.find(reg => reg.UID == UID);
        if (match) this.registrations.splice(this.registrations.indexOf(match), 1);
    }

    register(targetSource, eventType, callback, options = { oneOff: false, priority: 0, UID: UID_COUNT++ }) {
        if (!("oneOff" in options)) options.oneOff = false;
        if (!("priority" in options)) options.priority = 0;
        if (!("UID" in options)) options.UID = UID_COUNT++;

        console.log(`register for event ${eventType} from ${this.getSourceType(targetSource)} (UID: ${options.UID})`);

        this.registrations.push(new EventListener(targetSource, eventType, callback, options));
        return options.UID;
    }

    handleEvent(source, type, data) {
        console.log(`Handling event ${type} from ${this.getSourceType(source)}`);

        let activeListeners = this.registrations.filter(reg => reg.targetSource == source && reg.eventType == type);
        if (activeListeners.length < 1) return;

        console.log(`Active listeners: ${activeListeners.length}`);

        activeListeners.sort((a, b) => {
            if (a.priority < b.priority) return 1;
            if (a.priority > b.priority) return -1;
            if (a.priority == b.priority) return 0;
        });

        const event = {
            sourceType: this.getSourceType(source),
            source: source,
            eventType: type,
            triggerTime: new Date().getTime(),
            killChain: false
        };

        console.log(`Event data: ${event.sourceType} | ${event.eventType} | ${event.triggerTime}`);

        for (let listener of activeListeners) {
            listener.callback(event, data);
            if (listener.oneOff) this.unregister(listener.UID);
            if (event.killChain) break;
        }
    }
}

export const Events = new EventManager();
