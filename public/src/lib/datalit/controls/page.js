import { App } from "../app.js";
import { Control } from "./control.js";
import { datalitError } from "../errors";
import { Section } from "./section.js";
import { PageState } from "../enums.js";

// Keep in mind a Page defaults to ContentDirection.VERTICAL, but this can be changed manually
export class Page extends Section {
    constructor(initialProperties = {}) {
        super();
        // console.log("Page Constructor - 2");
        this.isPage = true;

        // Unique property fields
        this._pageState = PageState.READY;
        this._focusedControl = null;
        this.registerProperty("pageState", false, false);
        this.registerProperty("focusedControl", false, false);

        this.requiresRender = true;

        // Apply base theme before customized properties
        this.applyTheme("Page");

        this.updateProperties(initialProperties);
    }

    //region Method Overrides
    render() {
        this.size = [App.Canvas.width, App.Canvas.height];
        super.render();
    }

    addChild(child) {
        throw new Error("Cannot add children to pages Use addSection()");
    }
    removeChild(child) {
        throw new Error("Cannot have children in pages. Use removeSection()");
    }
    //#endregion

    // Private / Protected classes
    addSection(section) {
        if (!section.isArranger) throw new Error("Only Sections can be children of a Page");

        super.addChild(section);
    }

    // Extending classes should implement the following methods
    activate() {
        this.pageState = PageState.ACTIVE;

        this.scheduleRender();
    }

    deactivate() {
        this.pageState = PageState.READY;
    }

    // Unique Properties
    get focusedControl() {
        return this._focusedControl;
    }
    set focusedControl(newControl) {
        if (!(newControl instanceof Control))
            datalitError("propertySet", ["Page.focusedControl", String(newControl), "Control class"]);
        if (!newControl.isFocusable)
            datalitError("propertySet", ["Page.focusedControl", String(newControl), "focusabled control"]);

        this._focusedControl = newControl;
        this.notifyPropertyChange("focusedControl");
    }

    get pageState() {
        return this._pageState;
    }
    set pageState(newState) {
        if (!PageState.hasOwnProperty(newState))
            datalitError("propertySet", ["Page.pageState", String(newState), "enums.PageState"]);

        this._pageState = newState;
        this.notifyPropertyChange("pageState");
    }
}
