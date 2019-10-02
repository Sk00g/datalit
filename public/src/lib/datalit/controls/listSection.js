import { HAlign, VAlign, ContentDirection } from "../enums";
import { datalitError } from "../errors";
import { Control } from "./control";
import { Events } from "../events/events";
import { Section } from "../controls/section.js";
import factory from "../controlFactory.js";

export class ListSection extends Section {
    constructor() {
        super();

        // Store template as a property, and track the amount created
        this._templatePath = null;
        this._instanceCount = 0;
        this.registerProperty("templatePath", true, true, true);
        this.registerProperty("instanceCount", true, true, true);

        // Inform listeners when instance list is refreshed (re-generated)
        Events.attachSource(this, ["instancesUpdated"]);

        Events.register(this, "propertyChanged", (event, data) => {
            if (data.property == "templatePath" || data.property == "instanceCount") this.refreshInstances();
        });
    }

    //region Method Overrides
    activate() {
        super.activate();
        this.refreshInstances();
    }
    addChild(child) {
        throw new Error("Cannot add children to ListSection object");
    }
    removeChild(child) {
        throw new Error("Cannot have children in ListSection object");
    }
    //#endregion

    // Custom Methods
    refreshInstances() {
        // Clear all current instances
        while (this.children.length > 0) super.removeChild(this.children[0]);

        for (var i = 0; i < this.instanceCount; i++) {
            // Create new control from template
            // console.log(`generating control from markup (${this.templatePath}): ${i}`);
            super.addChild(factory.generateMarkupObjects(this.templatePath));
        }

        this.dispatchEvent("instancesUpdated", this);
    }
    // --------------

    // Unique Properties
    get templatePath() {
        return this._templatePath;
    }
    set templatePath(newPath) {
        if (typeof newPath != "string")
            datalitError("propertySet", ["ListSection.templatePath", String(newPath), "STRING"]);

        this._templatePath = newPath;
        this.notifyPropertyChange("templatePath");
    }

    get instanceCount() {
        return this._instanceCount;
    }
    set instanceCount(newCount) {
        if (typeof newCount != "number" || newCount < 0)
            datalitError("propertySet", ["ListSection.instanceCount", String(newCount), "INT 0 or greater"]);

        this._instanceCount = newCount;
        this.notifyPropertyChange("instanceCount");
    }
}
