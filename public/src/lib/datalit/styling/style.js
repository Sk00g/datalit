import { ControlState } from "../enums";
import { Events } from "../events/events";

/*
:param control -> The control this style applies to
:param triggerState -> The control's state that when activated, will apply the style (enum ControlState.*)
:param propertyDefinitions -> List of properties and their values to apply on state change. 
    Must be a list of Lists [propertyNameString, propertyValue]
*/

export class Style {
    constructor(control, triggerState, propertyDefinitions) {
        this.host = control;
        this.triggerState = triggerState;
        // Automatically remove alignment-based properties and other problem properties
        this.propertyDefinitions = propertyDefinitions.filter(
            kvp =>
                kvp[0] != "halign" &&
                kvp[0] != "valign" &&
                kvp[0] != "hfillTarget" &&
                kvp[0] != "vfillTarget" &&
                kvp[0] != "state" &&
                kvp[0] != "focused"
        );

        if (control.state == triggerState) this.activate();

        Events.register(control, "propertyChanged", (ev, data) => this.handleStateChange(ev, data));
    }

    activate() {
        for (let def of this.propertyDefinitions) {
            if (!this.host.propertyMetadata[def[0]].styleProtected) this.host[def[0]] = def[1];
        }
    }

    handleStateChange(ev, data) {
        if (data.property == "state") {
            if (data.newValue == this.triggerState) this.activate();
        }
    }
}
