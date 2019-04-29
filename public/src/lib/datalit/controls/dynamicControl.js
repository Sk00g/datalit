import { Events } from "../events/events.js";
import { Control } from "./control.js";
import { ControlState } from "../enums.js";

export class DynamicControl extends Control {
    constructor(initialProperties = {}) {
        super();

        // Listen for self-source events to trigger state swaps
        Events.register(this, "mouseenter", (ev, data) => this.handleMouseEnter(ev, data));
        Events.register(this, "mouseleave", (ev, data) => this.handleMouseLeave(ev, data));
        Events.register(this, "mousedown", (ev, data) => this.handleMouseDown(ev, data));
        Events.register(this, "mouseup", (ev, data) => this.handleMouseUp(ev, data));
        Events.register(this, "mousemove", (ev, data) => this.handleMouseMove(ev, data));

        this.updateProperties(initialProperties);
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
