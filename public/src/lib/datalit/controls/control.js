import enums from "../enums.js";
import { App } from "../app.js";
import { datalitError } from "../errors.js";
import { Events } from "../events/events.js";

export class Control {
    constructor(initialProperties = {}) {
        // console.log("Control Constructor - 1");

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

        // All controls must register with the event system for 'propertyChanged' events
        this.propertyChangedListeners = [];
        Events.attachSource(this, ["propertyChanged"]);
    }

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
        return [
            this._arrangedPosition[0] - this.margin[0],
            this._arrangedPosition[1] - this.margin[1],
            Math.max(0, this.size[0] + this.margin[0] + this.margin[2]),
            Math.max(0, this.size[1] + this.margin[1] + this.margin[3])
        ];
    }

    // Default implementation, can be overriden
    get hitRect() {
        return [...this._arrangedPosition, ...this.size];
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
                    propertyName: name,
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
