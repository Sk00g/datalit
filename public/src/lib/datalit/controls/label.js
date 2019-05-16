import { App } from "../app.js";
import { Color, HAlign, VAlign } from "../enums.js";
import { Control } from "./control.js";
import { datalitError } from "../errors.js";
import utils from "../utils.js";

export class Label extends Control {
    constructor(text, initialProperties = {}) {
        super();

        // Unique properties
        this._text = text;
        this._fontSize = App.GlobalState.DefaultFontSize;
        this._fontColor = Color.BLACK;
        this._fontType = "sans-serif";
        this.registerProperty("text", true);
        this.registerProperty("fontSize", true);
        this.registerProperty("fontColor");
        this.registerProperty("fontType", true);

        if (this.halign == HAlign.FILL || this.valign == VAlign.FILL) {
            throw new Error("Text-based elements cannot have a FILL align");
        }

        // Apply base theme before customized properties
        this.applyTheme("Label");

        // Override theme with explicit properties
        this.updateProperties(initialProperties);

        this.calculateSize();
    }

    calculateSize() {
        App.Context.font = this._fontSize + "pt " + this._fontType;
        super.size = [App.Context.measureText(this._text).width, this._fontSize];
    }

    //#region Override Method
    get size() {
        return super.size;
    }
    set size(newSize) {
        // throw new Error("Can't set the size of a label! It is generated from fontSize, text, and margins");
        return;
    }
    //#endregion

    //#region Unique Properties
    get text() {
        return this._text;
    }
    set text(newText) {
        if (typeof newText != "string") datalitError("propertySet", ["Label.text", String(newText), "string"]);

        this._text = newText;
        this.calculateSize();
        this.notifyPropertyChange("text");
    }

    get fontSize() {
        return this._fontSize;
    }
    set fontSize(size) {
        if (!Number.isInteger(size) || size < 2)
            datalitError("propertySet", ["Label.fontSize", String(size), "int >= 2"]);

        this._fontSize = size;
        this.calculateSize();
        this.notifyPropertyChange("fontSize");
    }

    get fontColor() {
        return this._fontColor;
    }
    set fontColor(color) {
        if (typeof utils.hexColor(color) != "string")
            datalitError("propertySet", ["Label.fontColor", String(color), "string"]);

        this._fontColor = color;
        this.notifyPropertyChange("fontColor");
    }

    get fontType() {
        return this._fontType;
    }
    set fontType(font) {
        if (typeof font != "string") datalitError("propertySet", ["Label.fontType", String(font), "string"]);

        this._fontType = font;
        this.calculateSize();
        this.notifyPropertyChange("fontType");
    }
    //#endregion

    draw() {
        App.Context.fillStyle = utils.hexColor(this.fontColor);
        App.Context.font = this.fontSize + "pt " + this.fontType;
        let truePosition = [
            this._arrangedPosition[0] + this.margin[0],
            this._arrangedPosition[1] + this.fontSize + this.margin[1]
        ];
        App.Context.fillText(this.text, ...truePosition);
    }
}
