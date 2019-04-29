import enums from "../enums.js";
import { Control } from "./control.js";
import { App } from "../app.js";
import { datalitError } from "../errors";
import { Section } from "./section.js";

// Keep in mind a Page defaults to ContentDirection.VERTICAL, but this can be changed manually
export class Page extends Section {
    constructor(initialProperties = {}) {
        super();
        // console.log("Page Constructor - 2");

        // Unique property fields
        this._state = enums.PageState.READY;
        this._focusedControl = null;

        this.requiresRender = true;

        this.updateProperties(initialProperties);

        this.registerProperty("state");
        this.registerProperty("focusedControl");
    }

    get focusedControl() {
        return this._focusedControl;
    }
    set focusedControl(newControl) {
        if (!(newControl instanceof Control))
            datalitError("propertySet", ["Page.focusedControl", String(newControl), "Control class"]);
        if (!newControl.isFocusable)
            datalitError("propertySet", ["Page.focusedControl", String(newControl), "focusabled control"]);

        this._focusedControl = newControl;
    }

    get state() {
        return this._state;
    }
    set state(newState) {
        if (!enums.PageState.hasOwnProperty(newState))
            datalitError("propertySet", ["Page.state", String(newState), "enums.PageState"]);

        this._state = newState;
    }

    addChild(child) {
        throw new Error("Cannot add children to pages Use addSection()");
    }

    // Private / Protected classes
    addSection(section) {
        this.children.push(section);

        this.scheduleRender();
    }

    removeSection(section) {
        this.children.splice(this.children.indexOf(section), 1);
        this.scheduleRender();
    }

    // Extending classes should implement the following methods
    activate() {
        this.state = enums.PageState.ACTIVE;

        this.scheduleRender();
    }

    deactivate() {
        this.state = enums.PageState.READY;
    }

    render() {
        this.viewSize = [App.Canvas.width, App.Canvas.height];
        super.render();
    }

    // Called by PageManager (think FSM)
    update(elapsed) {
        super.update(elapsed);

        // Only render once per update loop
        if (this.requiresRender) this.render();

        for (let section of this.children) {
            section.update(elapsed);
        }
    }

    draw() {
        for (let section of this.children) {
            if (section.visible) {
                section.draw();
            }
        }
    }
}
