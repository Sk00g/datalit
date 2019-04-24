import enums from "../enums.js";
import { App } from "../app.js";
import { datalitError } from "../errors.js";
import { Events } from "../events/events.js";

export class Control {
    constructor(initialProperties = {}) {
        // console.log("Control Constructor - 1");

        // As the name suggests, main use is for identifying controls during debugging
        this._debugName = null;

        // State management properties
        this._state = enums.ControlState.READY;
        this._isFocusable = false;
        this._focused = false;

        this._margin = App.GlobalState.DefaultMargin;
        this._size = [1, 1];
        this._localPosition = [0, 0];
        this._visible = true;
        this._align = enums.Align.CENTER;
        this._arrangedPosition = [0, 0];
        this._zValue = 0;

        this.updateProperties(initialProperties);

        // Members used for property event functions
        this.propertyMetadata = {};
        this.registerProperty("margin");
        this.registerProperty("size");
        this.registerProperty("visible");
        this.registerProperty("align");
        this.registerProperty("zValue");
        this.registerProperty("localPosition");
        this.registerProperty("focused");
        this.registerProperty("state");

        // All controls must register with the event system for 'propertyChanged' events
        this.propertyChangedListeners = [];
        Events.attachSource(this, ["propertyChanged"]);

        // Listen for self-source events to trigger state swaps
        Events.register(this, "mouseenter", (ev, data) => this.handleMouseEnter(ev, data));
        Events.register(this, "mouseleave", (ev, data) => this.handleMouseLeave(ev, data));
        Events.register(this, "mousedown", (ev, data) => this.handleMouseDown(ev, data));
        Events.register(this, "mouseup", (ev, data) => this.handleMouseUp(ev, data));
        Events.register(this, "mousemove", (ev, data) => this.handleMouseMove(ev, data));
    }

    handleMouseEnter(event, data) {}
    handleMouseLeave(event, data) {}
    handleMouseDown(event, data) {}
    handleMouseUp(event, data) {}
    handleMouseMove(event, data) {}

    dispatchEvent(eventName, data) {
        if (eventName == "propertyChanged") {
            if (this.propertyChangedListeners.length < 1) return;

            for (let cb of this.propertyChangedListeners) cb(data);
        } else {
            datalitError("notYetImplemented");
        }
    }

    addEventListener(eventName, callback) {
        if (eventName == "propertyChanged") this.propertyChangedListeners.push(callback);
        else {
            datalitError("notYetImplemented");
        }
    }

    registerProperty(propertyName) {
        this.propertyMetadata[propertyName] = { previousValue: this[propertyName] };
    }

    updateProperties(newProperties) {
        for (const [key, value] of Object.entries(newProperties)) {
            if (!this.hasOwnProperty("_" + key)) datalitError("propertyNotFound", ["Control", "_" + key]);

            this[key] = value;
        }
    }

    arrangePosition(arranger, newPosition) {
        if (!arranger.isArranger) datalitError("arrangeAuthority", [String(arranger.constructor.name)]);
        if (
            typeof newPosition != "object" ||
            newPosition.length != 2 ||
            !Number.isInteger(newPosition[0]) ||
            !Number.isInteger(newPosition[1])
        )
            datalitError("propertySet", ["Control.arrangePosition()", String(newPosition), "LIST of 2 int"]);

        if (newPosition[0] == -1) {
            this._arrangedPosition[1] = newPosition[1];
        } else if (newPosition[1] == -1) {
            this._arrangedPosition[0] = newPosition[0];
        } else {
            this._arrangedPosition = newPosition;
        }
    }

    get debugName() {
        return this._debugName;
    }
    set debugName(name) {
        this._debugName = name;
    }

    get state() {
        return this._state;
    }
    set state(newState) {
        if (!enums.ControlState.hasOwnProperty(newState))
            datalitError("propertySet", ["Control.state", String(newState), "enums.ControlState"]);

        if (this.state == enums.ControlState.DISABLED && newState != enums.ControlState.READY)
            datalitError("illogical", ["newState", newState, "previousState", "DISABLED"]);

        this._state = newState;
    }

    get isFocusable() {
        return this._isFocusable;
    }
    set isFocusable(flag) {
        if (typeof flag != "boolean") datalitError("propertySet", ["Control.isFocusable", String(flag), "BOOL"]);

        this._isFocusable = flag;
    }

    get focused() {
        return this._focused;
    }
    set focused(flag) {
        if (typeof flag != "boolean") datalitError("propertySet", ["Control.focused", String(flag), "BOOL"]);

        if (flag && !this.isFocusable)
            datalitError("illogical", ["Control.focused", true, "Control.isFocusable", false]);

        this._focused = flag;
    }

    get zValue() {
        return this._zValue;
    }
    set zValue(newValue) {
        if (typeof newValue != "number" || newValue < 0)
            datalitError("propertySet", ["Control.zValue", String(newValue), "int 0 or greater"]);

        this._zValue = newValue;
    }

    get margin() {
        return this._margin;
    }
    set margin(newMargin) {
        if (typeof newMargin == "number") {
            if (!Number.isInteger(newMargin))
                datalitError("propertySet", ["Control.margin", String(newMargin), "int or LIST of 4 int"]);
            this._margin = [newMargin, newMargin, newMargin, newMargin];
        } else {
            if (typeof newMargin != "object" || newMargin.length != 4)
                datalitError("propertySet", ["Control.margin", String(newMargin), "int LIST of 4 int"]);
            for (let i = 0; i < 4; i++)
                if (!Number.isInteger(newMargin[i]))
                    datalitError("propertySet", ["Control.margin", String(newMargin), "int LIST of 4 int"]);

            this._margin = newMargin;
        }
    }

    // Default implementation, can be overriden
    get viewWidth() {
        return this.viewingRect[2];
    }
    get viewHeight() {
        return this.viewingRect[3];
    }
    get viewingRect() {
        return [...this._arrangedPosition, ...this.size];
    }

    // Default implementation, can be overriden
    get hitRect() {
        return [
            this._arrangedPosition[0] + this.margin[0],
            this._arrangedPosition[1] + this.margin[1],
            this.size[0] - this.margin[2] - this.margin[0],
            this.size[1] - this.margin[3] - this.margin[1]
        ];
    }

    isPointWithin(point) {
        const hr = this.hitRect;
        return hr[0] < point[0] && point[0] < hr[0] + hr[2] && hr[1] < point[1] && point[1] < hr[1] + hr[3];
    }

    get align() {
        return this._align;
    }
    set align(newAlign) {
        if (!enums.Align.hasOwnProperty(newAlign))
            datalitError("propertySet", ["Control.align", String(newAlign), "enums.Align"]);

        this._align = newAlign;
    }

    get visible() {
        return this._visible;
    }
    set visible(flag) {
        if (typeof flag != "boolean") datalitError("propertySet", ["Control.visible", String(flag), "BOOL"]);

        this._visible = flag;
    }

    get localPosition() {
        return this._localPosition;
    }

    set localPosition(newPosition) {
        if (
            typeof newPosition != "object" ||
            newPosition.length != 2 ||
            !Number.isInteger(newPosition[0]) ||
            !Number.isInteger(newPosition[1])
        )
            datalitError("propertySet", ["Control.localPosition", String(newPosition), "LIST of 2 int"]);

        this._localPosition = newPosition;
    }

    get height() {
        return this._size[1];
    }
    get width() {
        return this._size[0];
    }
    get size() {
        return this._size;
    }
    set size(newSize) {
        if (
            typeof newSize != "object" ||
            newSize.length != 2 ||
            !Number.isInteger(newSize[0]) ||
            !Number.isInteger(newSize[1])
        )
            datalitError("propertySet", ["Control.size", String(newSize), "LIST of 2 int"]);

        this._size = newSize;
    }

    update(elapsed) {
        for (const [name, metadata] of Object.entries(this.propertyMetadata)) {
            if (metadata.previousValue != this[name]) {
                this.dispatchEvent("propertyChanged", {
                    property: name,
                    oldValue: metadata.previousValue,
                    newValue: this[name]
                });
                // launch event to listeners
                // console.log(`would launch event for ${name}: ${this[name]}`);

                metadata.previousValue = this[name];
            }
        }
    }
    draw(context) {}
}
