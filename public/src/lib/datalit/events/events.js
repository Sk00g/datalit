import enums from "../enums.js";
import { datalitError } from "../errors.js";

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
        this.canvas = document.getElementById("canvas");

        window.addEventListener("resize", ev => this.handleEvent(window, "resize", null));

        this.setupMouseEvents();

        this.keyboardModifiers = { alt: false, shift: false, ctrl: false };
        this.setupKeyboardEvents();

        this.registrations = [];
    }

    attachSource(source, eventList) {
        if (typeof source["addEventListener"] === "undefined" || typeof source["dispatchEvent"] === "undefined")
            datalitError("objectInterfaceMismatch", [source.toString(), ["addEventListener", "dispatchEvent"]]);
        if (typeof eventList != "object") datalitError("typeMismatch", [typeof eventList, "eventList", "object"]);

        for (let event of eventList) {
            source.addEventListener(event, ev => this.handleEvent(source, event, ev));
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

    setupKeyboardEvents() {
        window.addEventListener("keydown", ev => this.handleKeyboardEvent("keydown", ev.code, ev.key, ev.repeat));
        window.addEventListener("keyup", ev => this.handleKeyboardEvent("keyup", ev.code, ev.key, ev.repeat));
    }

    _setupMouseEvent(eventName) {
        this.canvas.addEventListener(eventName, ev => {
            let mods = [];
            if (ev.altKey) mods.push(enums.Modifier.ALT);
            if (ev.shiftKey) mods.push(enums.Modifier.SHIFT);
            if (ev.ctrlKey) mods.push(enums.Modifier.CTRL);

            this.handleEvent(canvas, eventName, {
                position: [ev.clientX, ev.clientY],
                button: ev.which,
                modifiers: mods
            });
        });
    }
    setupMouseEvents() {
        this._setupMouseEvent("mousedown");
        this._setupMouseEvent("mouseup");
        this._setupMouseEvent("mousemove");
        this._setupMouseEvent("click");
        this._setupMouseEvent("dblclick");
        this._setupMouseEvent("mouseover");
        this._setupMouseEvent("mouseout");
    }

    getSourceType(source) {
        const className = source.constructor.name;
        if (className == "HTMLCanvasElement" || className == "Window") {
            return enums.EventSourceType.NATIVE;
        }
        // else if (source instanceof DataModel) return enums.EventSourceType.DATAMODEL;
        else {
            return enums.EventSourceType.CONTROL;
        }
    }

    handleKeyboardEvent(type, code, key, repeat) {
        // console.log(
        //     `Handling ${type} event: ${code}/${key} (${JSON.stringify(this.keyboardModifiers)}) | (repeat: ${repeat})`
        // );

        this.handleEvent(this.canvas, type, {
            code: code,
            key: key,
            repeat: repeat,
            modifiers: this.keyboardModifiers
        });

        // Update modifiers AFTER the event is called, so modifiers keys don't modify themselves
        if (code == "ShiftLeft" || code == "ShiftRight") this.keyboardModifiers.shift = type == "keydown";
        if (code == "ControlLeft" || code == "ControlRight") this.keyboardModifiers.ctrl = type == "keydown";
        if (code == "AltLeft" || code == "AltRight") this.keyboardModifiers.alt = type == "keydown";
    }

    handleEvent(source, type, data) {
        console.log(`Handling event ${type} from ${this.getSourceType(source)}`);

        let activeListeners = this.registrations.filter(reg => reg.targetSource == source && reg.eventType == type);
        if (activeListeners.length < 1) return;

        // console.log(`Active listeners: ${activeListeners.length}`);

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

        // console.log(`Event data: ${event.sourceType} | ${event.eventType} | ${event.triggerTime}`);

        for (let listener of activeListeners) {
            listener.callback(event, data);
            if (listener.oneOff) this.unregister(listener.UID);
            if (event.killChain) break;
        }
    }
}

export const Events = new EventManager();
