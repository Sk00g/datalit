import { App } from "../app.js";
import {
    Color,
    ContentDirection,
    ControlState,
    Cursor,
    HAlign,
    VAlign,
    TEXT_KEYSTROKES,
    MOTION_KEYSTROKES
} from "../enums.js";
import { datalitError } from "../errors.js";
import { Events } from "../events/events.js";
import { Label } from "./label.js";
import { Rect } from "./rect.js";
import { Section } from "./section.js";
import utils from "../utils.js";

export class TextInput extends Section {
    constructor(initialProperties = {}) {
        super({
            isFocusable: true,
            contentDirection: ContentDirection.HORIZONTAL,
            backgroundColor: "F9",
            borderColor: Color.BLACK,
            borderThickness: 1,
            size: [200, 30]
        });

        // Must be built before registering properties, as they directly access this object
        this.label = new Label("", {
            fontSize: App.GlobalState.DefaultFontSize - 2,
            fontColor: Color.BLACK,
            fontType: "sans-serif",
            margin: [8, 0, 8, 0],
            halign: HAlign.LEFT,
            valign: VAlign.CENTER
        });
        this.addChild(this.label);

        // Don't add cursor as a child, it needs to be drawn via absolute coordinates
        this.cursor = new Rect({ size: [1, 18], fillColor: "22" });
        this.cursorTimeSinceChange = 0;

        this._cursorBlinkRate = 500; // Timeout between on/off swaps in ms
        this._cursorPos = 0;
        this._selectPos = -1;

        this.registerProperty("text", false, true, true); // Text doesn't determine arrangement
        this.registerProperty("fontSize", true);
        this.registerProperty("fontColor");
        this.registerProperty("fontType", true);
        this.registerProperty("fontMargin", true);
        this.registerProperty("cursorColor");
        this.registerProperty("cursorSize");
        this.registerProperty("cursorPos", false, true, true);
        this.registerProperty("selectPos", false, true, true);

        // Apply base theme before customized properties
        this.applyTheme("TextInput");

        this.updateProperties(initialProperties);

        // Set the initial or default properties as the ControlState.READY style
        this.generateDefaultStyle();

        // Subsribe to self events for rendering
        Events.register(this, "propertyChanged", (event, data) => {
            if (data.property == "cursorPos") this.renderCursor();
            else if (data.property == "selectPos") this.renderSelection();
        });

        // Listen for keyboard input
        Events.register(this, "keydown", (event, data) => this.handleKeyDown(event, data));
    }

    renderCursor() {
        let origin = [this._arrangedPosition[0] + this.margin[0], this._arrangedPosition[1] + this.margin[1]];
        let text = this.label.text;

        App.Context.font = this._fontSize + "pt " + this._fontType;
        let preTextWidth = App.Context.measureText(text.substr(0, this.cursorPos)).width;
        let newX = origin[0] + this.label.margin[0] + preTextWidth;
        let newY = origin[1] + Math.floor((this.height - this.cursorSize[1]) / 2);

        this.cursor.arrangePosition(this, [newX, newY]);
    }

    renderSelection() {}

    handleMotion(key) {
        this.cursorTimeSinceChange = 0;
        this.cursor.visible = true;

        let text = this.label.text;
        switch (key) {
            case "Backspace":
                if (this.cursorPos > 0) {
                    this.label.text = text.slice(0, this.cursorPos - 1) + text.slice(this.cursorPos);
                    this.cursorPos--;
                }
                break;
            case "ArrowLeft":
                if (this.cursorPos > 0) this.cursorPos--;
                break;
            case "ArrowRight":
                if (this.cursorPos < text.length) this.cursorPos++;
                break;
            case "Home":
                this.cursorPos = 0;
                break;
            case "End":
                this.cursorPos = text.length;
                break;
        }
    }

    handleText(key) {
        let text = this.label.text;
        if (this.cursorPos == text.length) this.label.text += key;
        else this.label.text = text.slice(0, this.cursorPos) + key + text.slice(this.cursorPos);
        this.cursorPos++;
    }

    handleKeyDown(event, data) {
        // console.log(`Text Input Receives: KEY: ${data.key} | CODE: ${data.code}`);
        this.cursorTimeSinceChange = 0;
        this.cursor.visible = true;

        // hotkey support
        if (data.code == "KeyA" && data.modifiers.ctrl) {
        }

        if (MOTION_KEYSTROKES.includes(data.key)) this.handleMotion(data.key);
        else if (TEXT_KEYSTROKES.includes(data.key)) this.handleText(data.key);
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
    handleMouseDown(event, data) {
        // ----- DEBUG / DEV ONLY CODE -----
        Events.activePage.focusedControl = this;
        this.focused = true;
        console.log("text input receives artifical focus");
        // ----- DO NOT FORGET TO REMOVE LATER -----
    }
    //#endregion

    //#region Override Properties
    arrangePosition(arranger, newPosition) {
        super.arrangePosition(arranger, newPosition);
        this.renderCursor();
    }
    //#endregion

    //#region Unique Properties
    get selectPos() {
        return this._selectPos;
    }
    set selectPos(newPos) {
        if (!Number.isInteger(newPos) || newPos < -1 || newPos > this.label.text.length - 1)
            datalitError("propertySet", ["Button.selectPos", String(newPos), "int (-1) - (text.length - 1)"]);

        this._selectPos = newPos;
        this.notifyPropertyChange("selectPos");
    }

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
        super.update(elapsed);

        if (this.focused) {
            this.cursorTimeSinceChange += Math.floor(elapsed);
            if (this.cursorTimeSinceChange >= this.cursorBlinkRate) {
                this.cursorTimeSinceChange = 0;
                this.cursor.visible = !this.cursor.visible;
            }
        }
    }

    draw() {
        super.draw();

        if (this.focused && this.cursor.visible) this.cursor.draw();
    }
}
