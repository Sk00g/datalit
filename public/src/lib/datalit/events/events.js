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
        this.setupScrollEvents();

        this.keyboardModifiers = { alt: false, shift: false, ctrl: false };
        this.setupKeyboardEvents();

        this._registrations = {};
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

    unregister(targetSource, eventType, cbUID) {
        let key = `${targetSource.__GUID}.${eventType}`;
        let match = this._registrations[key].find(reg => reg.UID == cbUID);
        if (match) this._registrations[key].splice(this._registrations[key].indexOf(match), 1);
    }

    register(targetSource, eventType, callback, options = { oneOff: false, priority: 0, UID: UID_COUNT++ }) {
        if (!("oneOff" in options)) options.oneOff = false;
        if (!("priority" in options)) options.priority = 0;
        if (!("UID" in options)) options.UID = UID_COUNT++;

        // console.log(`register for event ${eventType} from ${this.getSourceType(targetSource)} (UID: ${options.UID})`);

        // Create the unique combination of control + eventType if not present
        let key = `${targetSource.__GUID}.${eventType}`;
        if (!this._registrations[key]) this._registrations[key] = [];

        this._registrations[key].push(new EventListener(targetSource, eventType, callback, options));
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
            if (eventName == "keydown" && (ev.code == "Tab" || ev.key == "'" || ev.key == "/" || ev.key == "Backspace"))
                ev.preventDefault();

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
    setupScrollEvents() {
        this.canvas.addEventListener("wheel", ev => {
            ev.preventDefault();

            let direction = ev.ctrlKey ? "horizontal" : "vertical";
            this.controlLayer.rerouteWheelEvent([ev.clientX, ev.clientY], direction, ev.deltaY);
        });
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

    /*
    WARNING - THIS IS EXTREMELY HIGH TRAFFIC CODE!
    */
    handleEvent(source, type, data) {
        // if (this.getSourceType(source) == enums.EventSourceType.CONTROL)
        //     console.log(`Handling event ${type} from ${source.debugName}`);
        // else console.log(`Handling event ${type} from ${this.getSourceType(source)}`);

        // First check if array exists for key
        if (!this._registrations[`${source.__GUID}.${type}`]) return;

        let key = `${source.__GUID}.${type}`;
        let activeListeners = this._registrations[key];
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
        for (let i = 0; i < activeListeners.length; i++) {
            activeListeners[i].callback(event, data);
            if (activeListeners[i].oneOff) this.unregister(source, type, activeListeners[i].UID);
            if (event.killChain) break;
        }
    }
}

export const Events = new EventManager();
