import { App } from "../app.js";
import { Control } from "./control.js";
import { datalitError } from "../errors";
import { Events } from "../events/events.js";
import { Section } from "./section.js";
import { PageState } from "../enums.js";

// Keep in mind a Page defaults to ContentDirection.VERTICAL, but this can be changed manually
export class Page extends Section {
    constructor(initialProperties = {}, withholdingEvents = false) {
        super();
        // console.log("Page Constructor - 2");
        this.isPage = true;

        // Keep track of focusable controls for Tab cycling, ordered stack
        this._focusStack = [];
        this._focusMousedownRegisters = {};
        this._focusChildrenChangedRegisters = {};

        // Unique property fields
        this._pageState = PageState.READY;
        this._focusedControl = null;
        this.registerProperty("pageState", false, false, true);
        this.registerProperty("focusedControl", false, false, true);

        // Apply base theme before customized properties
        this.applyTheme("Page");

        this.updateProperties(initialProperties);

        this._withholdingEvents = withholdingEvents;

        // Listening for Tab / click input
        Events.register(App.Canvas, "keydown", (event, data) => this.handleTab(event, data));
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

    handleTab(event, data) {
        if (this._focusStack.length > 0 && data.key == "Tab") {
            let newFocus = null;
            if (!this._focusedControl) newFocus = this._focusStack[0];
            else {
                let index = this._focusStack.findIndex(ctrl => ctrl == this._focusedControl);
                if (data.modifiers.shift) {
                    index--;
                    if (index < 0) index = this._focusStack.length - 1;
                } else {
                    index++;
                    if (index >= this._focusStack.length) index = 0;
                }
                newFocus = this._focusStack[index];
            }

            if (this._focusedControl) this._focusedControl.focused = false;
            this._focusedControl = newFocus;
            this._focusedControl.focused = true;
        }
    }

    handleMouseDown(event, data) {
        if (event.source != this._focusedControl) {
            if (this._focusedControl) this._focusedControl.focused = false;
            this._focusedControl = event.source;
            this._focusedControl.focused = true;
        }
    }

    addFocusableControl(ctrl) {
        if (ctrl.isFocusable) {
            this._focusStack.push(ctrl);
            this._focusMousedownRegisters[ctrl] = Events.register(ctrl, "mousedown", (event, data) =>
                this.handleMouseDown(event, data)
            );
        }

        // Subscribe to child tree changes to update stack
        if (ctrl.isArranger) {
            Events.register(ctrl, "childrenChanged", (event, data) => this.handleChildChange(event, data));
        }
    }

    removeFocusableControl(ctrl) {
        let matchIndex = this._focusStack.findIndex(c => c == ctrl);
        if (matchIndex != -1) {
            let match = this._focusStack[matchIndex];
            Events.unregister(this._focusMousedownRegisters[match]);
            if (match.isArranger) Events.unregister(this._focusChildrenChangedRegisters[match]);
            this._focusStack.splice(matchIndex, 1);
        }
    }

    handleChildChange(event, data) {
        if (data.action == "add") {
            // Grab any existing children and add them to the stack
            if (data.child.isArranger) {
                for (let ctrl of data.child.getDescendents()) this.addFocusableControl(ctrl);
            } else {
                this.addFocusableControl(data.child);
            }
        } else if (data.action == "remove") {
            if (data.child.isArranger) {
                for (let ctrl of data.child.getDescendents()) this.removeFocusableControl(ctrl);
            } else {
                this.removeFocusableControl(data.child);
            }
        }

        // console.log(`detected '${data.action}' change from ${event.source} (${data.child})`);
    }

    addSection(section) {
        if (!section.isArranger) throw new Error("Only Sections can be children of a Page");

        // Grab any existing children and add them to the stack
        for (let ctrl of section.getDescendents()) this.addFocusableControl(ctrl);

        super.addChild(section);
    }

    removeSection(section) {
        // Grab all section children and remove them from the stack
        for (let ctrl of section.getDescendents()) this.removeFocusableControl(ctrl);

        super.removeChild(section);
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
