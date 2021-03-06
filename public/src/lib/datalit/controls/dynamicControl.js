import { Control } from "./control.js";
import { ControlState } from "../enums.js";
import { Events } from "../events/events.js";
import { Style } from "../styling/style.js";

export class DynamicControl extends Control {
    constructor() {
        super();

        // Internal list of styles, should never be used externally
        this.__styles = [];

        // Since all Section objects are children, only subscribe on first addition of style
        this.__initialized = false;
    }

    initializeDynamicStyles() {
        // console.log(`initializing dynamic interaction for ${this.debugName}`);

        this.__initialized = true;

        // Listen for self-source events to trigger state swaps
        Events.register(this, "mouseenter", (ev, data) => this.handleMouseEnter(ev, data));
        Events.register(this, "mouseleave", (ev, data) => this.handleMouseLeave(ev, data));
        Events.register(this, "mousedown", (ev, data) => this.handleMouseDown(ev, data));
        Events.register(this, "mouseup", (ev, data) => this.handleMouseUp(ev, data));
        Events.register(this, "mousemove", (ev, data) => this.handleMouseMove(ev, data));

        // Only require a default if another style exists
        this._generateDefaultStyle();
    }

    _generateDefaultStyle() {
        let propertyDefinitions = [];
        for (const [name, metadata] of Object.entries(this.propertyMetadata)) {
            if (!metadata.styleProtected) {
                propertyDefinitions.push([name, this[name]]);
            }
        }
        this.__styles.push(new Style(this, ControlState.READY, propertyDefinitions));
        // console.log("generated default style: " + JSON.stringify(this.__styles[0].propertyDefinitions));
    }

    addStyle(triggerState, propertyDefinitions, themeAllocated = false) {
        if (!this.__initialized && !themeAllocated) this.initialize();

        let existingIndex = this.__styles.findIndex(sty => sty.triggerState == triggerState);
        if (existingIndex != -1) {
            // throw new Error(`Style for state ${triggerState} already exists`);
            this.__styles.splice(existingIndex, 1);
        }

        // For each property not given in this style, set it to the default style
        for (const [name, metadata] of Object.entries(this.propertyMetadata)) {
            if (propertyDefinitions.findIndex(def => def[0] == name) == -1)
                propertyDefinitions.push([name, this[name]]);
        }

        this.__styles.push(new Style(this, triggerState, propertyDefinitions));
    }

    handleMouseEnter(event, data) {
        if (this.state == ControlState.READY) this.state = ControlState.HOVERED;
    }
    handleMouseLeave(event, data) {
        if (this.state == ControlState.HOVERED || this.state == ControlState.DEPRESSED) {
            this.state = ControlState.READY;
        }
    }
    handleMouseDown(event, data) {
        if (this.state == ControlState.READY || this.state == ControlState.HOVERED) {
            this.state = ControlState.DEPRESSED;
        }
    }
    handleMouseUp(event, data) {
        if (this.state == ControlState.DEPRESSED) this.state = ControlState.HOVERED;
    }
    handleMouseMove(event, data) {}
}
