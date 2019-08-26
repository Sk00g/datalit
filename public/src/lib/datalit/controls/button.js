// Keep in mind this is meant to be a default implementation of a button, for more unique buttons
// just subclass Section yourself and go nuts

import { App } from "../app.js";
import { Color, ContentDirection, ControlState, HAlign, VAlign } from "../enums.js";
import { datalitError } from "../errors.js";
import { Events } from "../events/events.js";
import { Label } from "./label.js";
import { Section } from "./section.js";
import utils from "../utils.js";

export class Button extends Section {
    constructor(initialProperties = {}, withholdingEvents = false) {
        super(
            {
                contentDirection: ContentDirection.HORIZONTAL,
                borderColor: Color.BLACK,
                borderThickness: 1,
                size: [100, 30]
            },
            true
        );

        // Must be built before registering properties, as they directly access this object
        this.label = new Label({
            text: initialProperties.text ? initialProperties.text : "",
            fontSize: App.GlobalState.DefaultFontSize,
            fontColor: Color.BLACK,
            fontType: "sans-serif",
            margin: 0,
            halign: HAlign.CENTER,
            valign: VAlign.CENTER
        });
        this.addChild(this.label);

        this._textOffset = 0;
        this._action = null;
        this.registerProperty("text", true, true, true);
        this.registerProperty("fontSize", true);
        this.registerProperty("fontColor");
        this.registerProperty("fontType", true);
        this.registerProperty("textOffset", true);
        this.registerProperty("action", false, false, true);

        // Apply base theme before customized properties
        this.applyTheme("Button");

        this.updateProperties(initialProperties);

        // Set the initial or default properties as the ControlState.READY style
        this.generateDefaultStyle();

        // Release propertyChanged events
        this._withholdingEvents = withholdingEvents;

        Events.attachSource(this, ["click"]);
    }

    handleMouseUp() {
        if (this.state == ControlState.DEPRESSED) this.dispatchEvent("click", this);

        super.handleMouseUp();
    }

    //#region Override Method
    //#endregion

    //#region Override Properties
    //#endregion

    //#region Unique Properties
    get action() {
        return this._action;
    }
    set action(newAction) {
        if (typeof newAction != "function")
            datalitError("propertySet", ["Button.action", String(newAction), "function"]);

        // Remove current action callback if present
        if (this._action) this.removeEventListener("click", this._action);
        this.addEventListener("click", newAction);

        this._action = newAction;
        this.notifyPropertyChange("action");
    }
    get text() {
        return this.label.text;
    }
    set text(newText) {
        if (typeof newText != "string") datalitError("propertySet", ["Button.text", String(newText), "string"]);

        this.label.text = newText;
        this.notifyPropertyChange("text");
    }

    get fontSize() {
        return this.label.fontSize;
    }
    set fontSize(size) {
        if (!Number.isInteger(size) || size < 2)
            datalitError("propertySet", ["Button.fontSize", String(size), "int > 2"]);

        this.label.fontSize = size;
        this.notifyPropertyChange("fontSize");
    }

    get fontColor() {
        return this.label.fontColor;
    }
    set fontColor(color) {
        if (typeof utils.hexColor(color) != "string")
            datalitError("propertySet", ["Button.fontColor", String(color), "string"]);

        this.label.fontColor = color;
        this.notifyPropertyChange("fontColor");
    }

    get fontType() {
        return this.label.fontType;
    }
    set fontType(font) {
        if (typeof font != "string") datalitError("propertySet", ["Button.fontType", String(font), "string"]);

        this.label.fontType = font;
        this.notifyPropertyChange("fontType");
    }

    get textOffset() {
        return this._textOffset;
    }
    set textOffset(offset) {
        if (!Number.isInteger(offset)) datalitError("propertySet", ["Button.textOffset", String(offset), "int"]);

        if (offset > 0) this.label.margin = [offset, offset, 0, 0];
        else if (offset < 0) this.label.margin = [0, 0, -offset, -offset];
        else this.label.margin = 0;
        this._textOffset = offset;
        this.notifyPropertyChange("textOffset");
    }
    //#endregion
}
