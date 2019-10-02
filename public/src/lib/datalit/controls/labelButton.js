import { App } from "../app.js";
import { Color, HAlign, VAlign } from "../enums.js";
import { ControlState } from "../enums.js";
import { datalitError } from "../errors.js";
import { DynamicControl } from "./dynamicControl.js";
import { Events } from "../events/events.js";
import utils from "../utils.js";

export class LabelButton extends DynamicControl {
    constructor() {
        super();

        // Unique properties
        this._action = null;
        this._text = initialProperties.text ? initialProperties.text : "";
        this._fontSize = App.GlobalState.DefaultFontSize;
        this._fontColor = Color.BLACK;
        this._fontType = "sans-serif";
        this.registerProperty("action", false, false, true);
        this.registerProperty("text", true, true, true);
        this.registerProperty("fontSize", true);
        this.registerProperty("fontColor");
        this.registerProperty("fontType", true);

        Events.attachSource(this, ["click"]);
    }

    handleMouseUp() {
        if (this.state == ControlState.DEPRESSED) this.dispatchEvent("click", null);

        super.handleMouseUp();
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

    //#region Override Properties
    get hitRect() {
        return [
            this._arrangedPosition[0] + this.margin[0] - 2,
            this._arrangedPosition[1] + this.margin[1] - 2,
            this.size[0] + 4,
            this.size[1] + 4
        ];
    }
    //#endregion

    //#region Unique Properties
    get action() {
        return this._action;
    }
    set action(newAction) {
        if (typeof newAction != "function")
            datalitError("propertySet", ["LabelButton.action", String(newAction), "function"]);

        // Remove current action callback if present
        if (this._action) this.removeEventListener("click", this._action);
        this.addEventListener("click", newAction);

        this._action = newAction;
        this.notifyPropertyChange("action");
    }
    get text() {
        return this._text;
    }
    set text(newText) {
        if (typeof newText != "string") datalitError("propertySet", ["LabelButton.text", String(newText), "string"]);

        this._text = newText;
        this._calculateSize();
        this.notifyPropertyChange("text");
    }

    get fontSize() {
        return this._fontSize;
    }
    set fontSize(size) {
        if (!Number.isInteger(size) || size < 2)
            datalitError("propertySet", ["LabelButton.fontSize", String(size), "int > 2"]);

        this._fontSize = size;
        this._calculateSize();
        this.notifyPropertyChange("fontSize");
    }

    get fontColor() {
        return this._fontColor;
    }
    set fontColor(color) {
        if (typeof utils.hexColor(color) != "string")
            datalitError("propertySet", ["LabelButton.fontColor", String(color), "string"]);

        this._fontColor = color;
        this.notifyPropertyChange("fontColor");
    }

    get fontType() {
        return this._fontType;
    }
    set fontType(font) {
        if (typeof font != "string") datalitError("propertySet", ["LabelButton.fontType", String(font), "string"]);

        this._fontType = font;
        this._calculateSize();
        this.notifyPropertyChange("fontType");
    }
    //#endregion

    draw(context = App.Context, offset = [0, 0]) {
        context.fillStyle = utils.hexColor(this.fontColor);
        context.font = this.fontSize + "pt " + this.fontType;
        let truePosition = [
            this._arrangedPosition[0] + this.margin[0] + offset[0],
            this._arrangedPosition[1] + this.fontSize + this.margin[1] + offset[1]
        ];

        context.fillText(this.text, ...truePosition);
    }
}
