import { App } from "../app.js";
import { Color, HAlign, VAlign } from "../enums.js";
import { Control } from "./control.js";
import { datalitError } from "../errors.js";
import utils from "../utils.js";

export class Label extends Control {
    constructor() {
        super();

        // Unique properties
        this._text = "";
        this._fontSize = App.GlobalState.DefaultFontSize;
        this._fontColor = Color.BLACK;
        this._fontType = "sans-serif";
        this.registerProperty("text", false, true, true);
        this.registerProperty("fontSize", true);
        this.registerProperty("fontColor");
        this.registerProperty("fontType", true);
    }

    _calculateSize() {
        App.Context.font = this._fontSize + "pt " + this._fontType;
        super.size = [Math.floor(App.Context.measureText(this._text).width), this._fontSize];
    }

    //#region Override Method
    activate() {
        super.activate();

        this._calculateSize();
    }
    //#endregion

    //#region Unique Properties
    get text() {
        return this._text;
    }
    set text(newText) {
        if (typeof newText != "string") datalitError("propertySet", ["Label.text", String(newText), "string"]);

        this._text = newText;
        this._calculateSize();
        this.notifyPropertyChange("text");
    }

    get fontSize() {
        return this._fontSize;
    }
    set fontSize(size) {
        if (!Number.isInteger(size) || size < 2)
            datalitError("propertySet", ["Label.fontSize", String(size), "int >= 2"]);

        this._fontSize = size;
        this._calculateSize();
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
        this._calculateSize();
        this.notifyPropertyChange("fontType");
    }
    //#endregionfg

    draw(context = App.Context, offset = [0, 0]) {
        context.fillStyle = utils.hexColor(this.fontColor);
        context.font = this.fontSize + "pt " + this.fontType;
        let truePosition = [
            this._arrangedPosition[0] + this.margin[0] + offset[0],
            this._arrangedPosition[1] + this.fontSize + this.margin[1] + offset[1]
        ];
        // console.log(`draw text ${this.text} at ${truePosition}`);
        context.fillText(this.text, ...truePosition);
    }
}
