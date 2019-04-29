import enums from "../enums.js";
import { ControlState } from "../enums.js";
import { App } from "../app.js";
import { DynamicControl } from "./dynamicControl.js";
import { datalitError } from "../errors.js";
import { Events } from "../events/events.js";

export class TextButton extends DynamicControl {
    constructor(text, action, initialProperties = {}) {
        super();

        // Unique properties
        this._text = text;
        this._fontSize = App.GlobalState.DefaultFontSize;
        this._fontColor = enums.Colors.OFFBLACK;
        this._fontType = "sans-serif";

        this.updateProperties(initialProperties);

        if (this.align == enums.Align.FILL) {
            throw new Error("Text-based elements cannot have a FILL align");
        }

        this.calculateSize();

        this.registerProperty("text");
        this.registerProperty("fontSize");
        this.registerProperty("fontColor");
        this.registerProperty("fontType");

        if (action) this.addEventListener("click", action);
        Events.attachSource(this, ["click"]);
    }

    handleMouseUp() {
        if (this.state == ControlState.DEPRESSED) this.dispatchEvent("click", null);

        super.handleMouseUp();
    }

    calculateSize() {
        App.Context.font = this._fontSize + "pt " + this._fontType;
        this.size = [App.Context.measureText(this._text).width, this._fontSize];
    }

    get text() {
        return this._text;
    }
    set text(newText) {
        if (typeof newText != "string") datalitError("propertySet", ["Label.text", String(newText), "string"]);

        this._text = newText;
        this.calculateSize();
    }

    get fontSize() {
        return this._fontSize;
    }
    set fontSize(size) {
        if (!Number.isInteger(size) || size < 2)
            datalitError("propertySet", ["Label.fontSize", String(size), "int > 2"]);

        this._fontSize = size;
        this.calculateSize();
    }

    get fontColor() {
        return this._fontColor;
    }
    set fontColor(color) {
        if (typeof color != "string") datalitError("propertySet", ["Label.fontColor", String(color), "string"]);

        this._fontColor = color;
    }

    get fontType() {
        return this._fontType;
    }
    set fontType(font) {
        if (typeof font != "string") datalitError("propertySet", ["Label.fontType", String(font), "string"]);

        this._fontType = font;
        this.calculateSize();
    }

    draw() {
        App.Context.fillStyle = this.fontColor;
        App.Context.font = this.fontSize + "pt " + this.fontType;
        let truePosition = [
            this._arrangedPosition[0] + this.margin[0],
            this._arrangedPosition[1] + this.fontSize + this.margin[1]
        ];
        App.Context.fillText(this.text, ...truePosition);
    }
}
