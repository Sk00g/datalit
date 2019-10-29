import { App } from "../app.js";
import { Assets } from "../assetManager.js";
import { ControlState, HAlign, VAlign, SizeTargetType, Color } from "../enums.js";
import { datalitError } from "../errors.js";
import { Events } from "../events/events.js";
import utils from "../utils.js";

var GUID = 0;

export class Control {
    constructor() {
        // Convenience member for internal rerender / redraw logic
        this.__parent = null;

        // As the name suggests, main use is for identifying controls during debugging
        this._debugName = null;

        // Used for event dictionary quick hash-lookups
        this.__GUID = GUID++;

        // Used by factory to withhold property change events and their side effects until init is complete
        this.__active = false;

        // Keep track of generateControl method for complex controls who generate controls dynamically
        this._generator = null;

        this._state = ControlState.READY;
        this._visible = true;
        this._arrangedPosition = [0, 0];
        this._size = [0, 0];
        this._margin = [0, 0, 0, 0];
        this._halign = HAlign.LEFT;
        this._valign = VAlign.TOP;
        this._focused = false;
        this._isFocusable = false;
        this._localPosition = [0, 0];
        this._zValue = 0;
        this._scrollOffset = [0, 0];

        // Members used for property event functions
        this.propertyMetadata = {};
        this.registerProperty("state", false, false, true);
        this.registerProperty("visible", false, true, true);
        this.registerProperty("size", true, true, true, utils.comparePoints);
        this.registerProperty("margin", true, true, true, utils.compareSides);
        this.registerProperty("halign", true);
        this.registerProperty("valign", true);
        this.registerProperty("focused", false, true, true);
        this.registerProperty("localPosition", true, true, false, utils.comparePoints);
        this.registerProperty("zValue");
        this.registerProperty("scrollOffset", false, false, true, utils.comparePoints);

        // All controls must register with the event system for 'propertyChanged' events
        this.eventListeners = { propertyChanged: [] };
        Events.attachSource(this, ["propertyChanged"]);
    }

    //#region Method Overrides
    toString() {
        let str = this.constructor.name;
        return this.debugName ? `${str} - ${this.debugName}` : `${str} (${this._arrangedPosition})`;
    }
    //#endregion

    //#region Methods
    applyTheme(className, newTheme = Assets.BaseTheme) {
        let styleMatch = newTheme.controlProperties[className];
        if (styleMatch) {
            for (const [key, value] of Object.entries(styleMatch)) {
                if (key == "styles") {
                    for (const [styleKey, styleValue] of Object.entries(value)) {
                        let propertyDefinitions = [];
                        for (const [propKey, propValue] of Object.entries(styleValue))
                            propertyDefinitions.push([propKey, propValue]);
                        this.addStyle(styleKey, propertyDefinitions, true);
                    }
                }

                this[key] = value;
            }
        }
    }

    isChildOf(parent) {
        if (!parent.isArranger) return false;

        return parent.children.indexOf(this) != -1;
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

    /* ALIAS Properties are properties that expose an internal control (controlAlias) in a complex (composite)
        Control. They directly pass through the property's functionality to the child, so validation
        logic is optional, not required. Additional logic is also optional. 
    */
    registerAliasProperty(propertyName, controlAlias, propertyAlias = null, styleProtected = false) {
        // If no propertyAlias is provided, use propertyName and assume they share the property name
        propertyAlias = propertyAlias || propertyName;

        this.propertyMetadata[propertyName] = {
            previousValue: this[controlAlias][propertyAlias],
            redraw: this[controlAlias].propertyMetadata[propertyAlias].redraw,
            rerender: this[controlAlias].propertyMetadata[propertyAlias].rerender,
            compare: this[controlAlias].propertyMetadata[propertyAlias].compare,
            styleProtected: styleProtected,
            alias: true
        };

        // Create getters and setters automatically
        Object.defineProperty(this, propertyName, {
            get: function() {
                return this[controlAlias][propertyAlias];
            },
            set: function(newValue) {
                this[controlAlias][propertyAlias] = newValue;
                this.notifyPropertyChange(propertyName);
            }
        });
    }

    registerProperty(
        propertyName,
        rerenderOnChange = false,
        redrawOnChange = true,
        styleProtected = false,
        comparisonFunc = null
    ) {
        this.propertyMetadata[propertyName] = {
            previousValue: this[propertyName],
            redraw: redrawOnChange,
            rerender: rerenderOnChange,
            compare: comparisonFunc == null ? (a, b) => a === b : comparisonFunc,
            styleProtected: styleProtected
        };
    }

    notifyPropertyChange(name) {
        // Check for withholding
        if (!this.__active) return;

        const metadata = this.propertyMetadata[name];

        // Can't notify before registering
        if (!metadata) return;

        if (!metadata.compare(metadata.previousValue, this[name])) {
            this.dispatchEvent("propertyChanged", {
                property: name,
                oldValue: metadata.previousValue,
                newValue: this[name]
            });
            // console.log(`Property ${name} changed from ${metadata.previousValue} to ${this[name]}`);
            metadata.previousValue = this[name];
            // Request rerender based on metadata, re-render ancestor until FIXED, FILL, OR PERCENT
            if (metadata.rerender && this.__parent) {
                var parent = this.__parent;
                // Keep climbing genetic tree until we hit a parent that does not have Target -> Min or Color.Transparent background
                while (
                    parent.hsizeTarget[0] == SizeTargetType.MIN ||
                    parent.vsizeTarget[0] == SizeTargetType.MIN ||
                    parent.backgroundColor == Color.TRANSPARENT
                ) {
                    if (!parent.__parent) break;
                    parent = parent.__parent;
                }

                // console.log(`add render target - ${parent.debugName}`);
                parent.scheduleRender();

                // Redraw parent rendered section, which encapsulates redrawing all children as well
                App.addDrawTarget(parent);
            }
            // Request redraw as required
            else if (metadata.redraw) {
                if (!this.isArranger && !this.__parent) App.addDrawTarget(this);
                else {
                    var parent = this.isArranger ? this : this.__parent;
                    parent = parent.__parent || parent;
                    // console.log(`addDrawTarget - ${parent.debugName}`);
                    App.addDrawTarget(parent);
                }
            }
        }
    }

    updateProperties(newProperties) {
        for (const [key, value] of Object.entries(newProperties)) {
            if (this.propertyMetadata[key] === undefined && !this.hasOwnProperty("_" + key))
                datalitError("propertyNotFound", ["Control", key]);
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

    isPointWithin(point) {
        let hr = this.hitRect;
        hr[0] -= this.scrollOffset[0];
        hr[1] -= this.scrollOffset[1];
        return hr[0] < point[0] && point[0] < hr[0] + hr[2] && hr[1] < point[1] && point[1] < hr[1] + hr[3];
    }

    disable() {
        this.state = ControlState.DISABLED;
    }

    enable() {
        if (this.state == ControlState.DISABLED) this.state = ControlState.READY;
    }
    //#endregion

    //#region Properties
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
        if (newState == this._state) return;

        if (!ControlState.hasOwnProperty(newState))
            datalitError("propertySet", ["Control.state", String(newState), "ControlState"]);

        if (this.state == ControlState.DISABLED && newState != ControlState.READY)
            datalitError("illogical", ["newState", newState, "previousState", "DISABLED"]);

        // console.log(`Swapping state from ${this._state} to ${newState}`);

        this._state = newState;
        this.notifyPropertyChange("state");
    }

    get visible() {
        return this._visible;
    }
    set visible(flag) {
        if (typeof flag != "boolean") datalitError("propertySet", ["Control.visible", String(flag), "BOOL"]);

        this._visible = flag;
        this.notifyPropertyChange("visible");
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
        this.notifyPropertyChange("size");
    }
    get width() {
        return this._size[0];
    }
    get height() {
        return this._size[1];
    }
    set width(newWidth) {
        if (typeof newWidth != "number" || !Number.isInteger(newWidth))
            datalitError("propertySet", ["Control.width", String(newWidth), "int"]);

        this.size = [newWidth, this._size[1]];
    }
    set height(newHeight) {
        if (typeof newHeight != "number" || !Number.isInteger(newHeight))
            datalitError("propertySet", ["Control.height", String(newHeight), "int"]);

        this.size = [this._size[0], newHeight];
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
        this.notifyPropertyChange("margin");
    }

    get viewingRect() {
        return [
            this._arrangedPosition[0] + this.margin[0],
            this._arrangedPosition[1] + this.margin[1],
            this._size[0],
            this._size[1]
        ];
    }
    get viewWidth() {
        return this._size[0] + this._margin[0] + this._margin[2];
    }
    get viewHeight() {
        return this._size[1] + this._margin[1] + this._margin[3];
    }
    set viewWidth(newWidth) {
        if (typeof newWidth != "number" || !Number.isInteger(newWidth))
            datalitError("propertySet", ["Control.viewWidth", String(newWidth), "int"]);

        this.size = [Math.max(0, newWidth - this.margin[0] - this.margin[2]), this._size[1]];
    }
    set viewHeight(newHeight) {
        if (typeof newHeight != "number" || !Number.isInteger(newHeight))
            datalitError("propertySet", ["Control.viewHeight", String(newHeight), "int"]);

        this.size = [this._size[0], Math.max(0, newHeight - this.margin[1] - this.margin[3])];
    }

    get hitRect() {
        return [
            this._arrangedPosition[0] + this.margin[0],
            this._arrangedPosition[1] + this.margin[1],
            this.size[0],
            this.size[1]
        ];
    }

    get halign() {
        return this._halign;
    }
    set halign(newAlign) {
        if (!HAlign.hasOwnProperty(newAlign) && newAlign != null)
            datalitError("propertySet", ["Control.halign", String(newAlign), "HAlign"]);

        this._halign = newAlign;
        this.notifyPropertyChange("halign");
    }

    get valign() {
        return this._valign;
    }
    set valign(newAlign) {
        if (!VAlign.hasOwnProperty(newAlign) && newAlign != null)
            datalitError("propertySet", ["Control.valign", String(newAlign), "VAlign"]);

        this._valign = newAlign;
        this.notifyPropertyChange("valign");
    }

    get zValue() {
        return this._zValue;
    }
    set zValue(newValue) {
        if (typeof newValue != "number" || newValue < 0)
            datalitError("propertySet", ["Control.zValue", String(newValue), "int 0 or greater"]);

        this._zValue = newValue;
        this.notifyPropertyChange("zValue");
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
        this.notifyPropertyChange("focused");
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
        this.notifyPropertyChange("localPosition");
    }

    get scrollOffset() {
        return this._scrollOffset;
    }
    set scrollOffset(newValue) {
        if (
            typeof newValue != "object" ||
            newValue.length != 2 ||
            !Number.isInteger(newValue[0]) ||
            !Number.isInteger(newValue[1])
        )
            datalitError("propertySet", ["Control.scrollOffset", String(newValue), "LIST of 2 int"]);

        this._scrollOffset = newValue;
        this.notifyPropertyChange("scrollOffset");
    }
    //#endregion

    // Overrideable methods
    activate() {
        this.__active = true;
    }
    initialize(generateControl) {
        this._generator = generateControl;
    }
    update(elapsed) {}
    draw(context, offset) {}
}
