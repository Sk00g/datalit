import enums from "../enums.js";
import { datalitError } from "../errors.js";
import { EventListener } from "./eventListener.js";
import { ControlEventLayer } from "./controlEventLayer.js";

var UID_COUNT = 1523;

class EventManager {
    constructor(options = {}) {
        this.canvas = document.getElementById("canvas");
        this.activePage = null;
        this.controlLayer = new ControlEventLayer(this);

        window.addEventListener("resize", ev => this.handleEvent(window, "resize", null));

        this.setupMouseEvents();

        this.keyboardModifiers = { alt: false, shift: false, ctrl: false };
        this.setupKeyboardEvents();

        this.registrations = [];
    }

    updateActivePage(page) {
        this.activePage = page;
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

        // console.log(`register for event ${eventType} from ${this.getSourceType(targetSource)} (UID: ${options.UID})`);

        this.registrations.push(new EventListener(targetSource, eventType, callback, options));
        return options.UID;
    }

    _setupKeyboardEvent(eventName) {
        window.addEventListener(eventName, ev => {
            // console.log(
            //     `Handling ${eventName} event: ${ev.code}/${ev.key} (${JSON.stringify(
            //         this.keyboardModifiers
            //     )}) | (repeat: ${ev.repeat})`
            // );

            // Stop problem events
            if (eventName == "keydown" && (ev.code == "Tab" || ev.key == "'" || ev.key == "/")) ev.preventDefault();

            // Sends this event out to helper class ControlEventLayer to determine which control(s)
            // this keyboard event should be sourced by. It then calls handleEvent with each control as source
            this.controlLayer.rerouteKeyboardEvent(eventName, ev.code, ev.key, ev.repeat, this.keyboardModifiers);

            // Update modifiers AFTER the event is called, so modifiers keys don't modify themselves
            if (ev.code == "ShiftLeft" || ev.code == "ShiftRight")
                this.keyboardModifiers.shift = eventName == "keydown";
            if (ev.code == "ControlLeft" || ev.code == "ControlRight")
                this.keyboardModifiers.ctrl = eventName == "keydown";
            if (ev.code == "AltLeft" || ev.code == "AltRight") this.keyboardModifiers.alt = eventName == "keydown";
        });
    }
    setupKeyboardEvents() {
        this._setupKeyboardEvent("keydown");
        this._setupKeyboardEvent("keyup");
    }

    _setupMouseEvent(eventName) {
        this.canvas.addEventListener(eventName, ev => {
            let mods = { alt: ev.altKey, shift: ev.shiftKey, ctrl: ev.ctrlKey };

            // Sends this event out to helper class ControlEventLayer to determine which control(s)
            // this mouse event falls under. It then calls handleEvent with each control as source
            this.controlLayer.rerouteMouseEvent([ev.clientX, ev.clientY], eventName, ev.which, mods);
        });
    }
    setupMouseEvents() {
        this._setupMouseEvent("mousedown");
        this._setupMouseEvent("mouseup");
        this._setupMouseEvent("mousemove");
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

    handleEvent(source, type, data) {
        // if (this.getSourceType(source) == enums.EventSourceType.CONTROL)
        //     console.log(`Handling event ${type} from ${source.debugName}`);
        // else console.log(`Handling event ${type} from ${this.getSourceType(source)}`);

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
