import { App } from "../app.js";
import { Color, ContentDirection, ControlState, Cursor, HAlign, VAlign } from "../enums.js";
import { datalitError } from "../errors.js";
import { Events } from "../events/events.js";
import { Label } from "./label.js";
import { Rect } from "./rect.js";
import { Section } from "./section.js";
import utils from "../utils.js";

export class TextInput extends Section {
    constructor(initialProperties = {}) {
        super({
            contentDirection: ContentDirection.HORIZONTAL,
            backgroundColor: "DD",
            borderColor: Color.BLACK,
            borderThickness: 1,
            size: [200, 30]
        });

        // Must be built before registering properties, as they directly access this object
        this.label = new Label("", {
            fontSize: App.GlobalState.DefaultFontSize,
            fontColor: Color.BLACK,
            fontType: "sans-serif",
            margin: [8, 0, 8, 0],
            halign: HAlign.LEFT,
            valign: VAlign.CENTER
        });
        this.addChild(this.label);

        // Don't add cursor as a child, it needs to be drawn via absolute coordinates
        this.cursor = new Rect({ size: [1, 24], fillColor: "33" });
        this.cursorTimeSinceChange = 0;

        this._cursorBlinkRate = 500; // Timeout between on/off swaps in ms
        this._cursorPos = 0;

        this.registerProperty("text", true);
        this.registerProperty("fontSize", true);
        this.registerProperty("fontColor");
        this.registerProperty("fontType", true);
        this.registerProperty("fontMargin", true);
        this.registerProperty("cursorColor");
        this.registerProperty("cursorSize");
        this.registerProperty("cursorPos");

        // Apply base theme before customized properties
        this.applyTheme("TextInput");

        this.updateProperties(initialProperties);

        // Set the initial or default properties as the ControlState.READY style
        this.generateDefaultStyle();
    }

    updateCursorPosition() {
        let origin = this._arrangedPosition;

        // let preText =
        let newX = origin[0] + this.label.margin[0];
        let newY = origin[1];

        this.cursor.arrangePosition(this, [newX, newY]);
    }

    //#region Override Method
    handleMouseEnter(event, data) {
        super.handleMouseEnter(event, data);
        utils.changeCursor(Cursor.TEXT);
    }
    handleMouseLeave(event, data) {
        super.handleMouseLeave(event, data);
        utils.changeCursor(Cursor.DEFAULT);
    }
    //#endregion

    //#region Override Properties
    arrangePosition(arranger, newPosition) {
        super.arrangePosition(arranger, newPosition);
        this.updateCursorPosition();
    }
    //#endregion

    //#region Unique Properties
    get cursorPos() {
        return this._cursorPos;
    }
    set cursorPos(newPos) {
        if (!Number.isInteger(newPos) || newPos < 0 || newPos > this.label.text.length)
            datalitError("propertySet", ["Button.cursorPos", String(newPos), "int 0 - text.length"]);

        this._cursorPos = newPos;
        this.notifyPropertyChange("cursorPos");
    }

    get cursorBlinkRate() {
        return this._cursorBlinkRate;
    }
    set cursorBlinkRate(newRate) {
        if (!Number.isInteger(newRate) || newRate < 50 || newRate > 2000)
            datalitError("propertySet", ["Button.cursorBlinkRate", String(newRate), "int 50 - 2000"]);

        this._cursorBlinkRate = newRate;
    }

    get cursorColor() {
        return this.cursor.fillColor;
    }
    set cursorColor(newColor) {
        this.cursor.fillColor = newColor;
        this.notifyPropertyChange("cursorColor");
    }

    get cursorSize() {
        return this.cursor.size;
    }
    set cursorSize(newSize) {
        this.cursor.size = newSize;
        this.notifyPropertyChange("cursorSize");
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

    get fontMargin() {
        return this.label.margin;
    }
    set fontMargin(newMargin) {
        this.label.margin = newMargin;
        this.notifyPropertyChange("fontMargin");
    }
    //#endregion

    update(elapsed) {
        this.cursorTimeSinceChange += elapsed;
        if (this.cursorTimeSinceChange >= this.cursorBlinkRate) {
            this.cursorTimeSinceChange = 0;
            this.cursor.visible = !this.cursor.visible;
        }
    }

    draw() {
        if (this.cursor.visible) this.cursor.draw();
    }
}
