import { App } from "../app.js";
import { Color, HAlign, VAlign } from "../enums.js";
import { ControlState } from "../enums.js";
import { datalitError } from "../errors.js";
import { DynamicControl } from "./dynamicControl.js";
import { Events } from "../events/events.js";
import utils from "../utils.js";

export class LabelButton extends DynamicControl {
    constructor(text, action, initialProperties = {}) {
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

        // Apply base theme before customized properties
        this.applyTheme("LabelButton");

        this.updateProperties(initialProperties);

        if (this.halign == HAlign.FILL || this.valign == VAlign.FILL) {
            throw new Error("Text-based elements cannot have a FILL align");
        }

        this.calculateSize();

        // Set the initial or default properties as the ControlState.READY style
        this.generateDefaultStyle();

        if (action) this.addEventListener("click", action);
        Events.attachSource(this, ["click"]);
    }

    handleMouseUp() {
        if (this.state == ControlState.DEPRESSED) this.dispatchEvent("click", null);

        super.handleMouseUp();
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
        return;
    }
    //#endregion

    //#region Override Properties
    get hitRect() {
        return [
            this._arrangedPosition[0] + this.margin[0] - 2,
            this._arrangedPosition[1] + this.margin[1] - 2,
            this.viewSize[0] - this.margin[2] - this.margin[0] + 4,
            this.viewSize[1] - this.margin[3] - this.margin[1] + 4
        ];
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
            datalitError("propertySet", ["Label.fontSize", String(size), "int > 2"]);

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
