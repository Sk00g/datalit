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

        // Don't draw selection rect as a child, it needs absolute coordinates
        this.selectionRect = new Rect({ fillColor: "88AACC99" });
        this._selectionFill = "BBDDFF99";

        // Don't add cursor as a child, it needs to be drawn via absolute coordinates
        this.cursor = new Rect({ size: [1, 18], fillColor: "22" });
        this.cursorTimeSinceChange = 0;
        this.cursorDragging = false;

        this._cursorBlinkRate = 500; // Timeout between on/off swaps in ms
        this._cursorPos = 0;
        this._selectPos = 0;

        this.registerProperty("text", false, true, true); // Text doesn't determine arrangement
        this.registerProperty("fontSize", true);
        this.registerProperty("fontColor");
        this.registerProperty("fontType", true);
        this.registerProperty("fontMargin", true);
        this.registerProperty("cursorColor");
        this.registerProperty("cursorSize");
        this.registerProperty("cursorPos", false, true, true);
        this.registerProperty("selectPos", false, true, true);
        this.registerProperty("selectionFill");

        // Apply base theme before customized properties
        this.applyTheme("TextInput");

        this.updateProperties(initialProperties);

        // Set the initial or default properties as the ControlState.READY style
        this.generateDefaultStyle();

        // Subsribe to self events for rendering
        Events.register(this, "propertyChanged", (event, data) => {
            if (data.property == "cursorPos") this.renderCursor();
        });

        // Listen for keyboard input
        Events.register(this, "keydown", (event, data) => this.handleKeyDown(event, data));
    }

    renderCursor() {
        let origin = [this._arrangedPosition[0] + this.margin[0], this._arrangedPosition[1] + this.margin[1]];
        let text = this.label.text;

        App.Context.font = this._fontSize + "pt " + this._fontType;
        let preTextWidth = Math.floor(App.Context.measureText(text.substr(0, this.cursorPos)).width);
        let newX = origin[0] + this.label.margin[0] + preTextWidth;
        let newY = origin[1] + Math.floor((this.height - this.cursorSize[1]) / 2);

        this.cursor.arrangePosition(this, [newX, newY]);

        if (this.selectPos != this.cursorPos) this.renderSelection();
    }

    renderSelection() {
        let origin = [this._arrangedPosition[0] + this.margin[0], this._arrangedPosition[1] + this.margin[1]];
        let text = this.label.text;

        App.Context.font = this._fontSize + "pt " + this._fontType;

        let rectWidth, preTextWidth;
        if (this.selectPos < this.cursorPos) {
            rectWidth = Math.floor(App.Context.measureText(text.slice(this.selectPos, this.cursorPos)).width);
            preTextWidth = Math.floor(App.Context.measureText(text.substr(0, this.selectPos)).width);
        } else {
            rectWidth = Math.floor(App.Context.measureText(text.slice(this.cursorPos, this.selectPos)).width);
            preTextWidth = Math.floor(App.Context.measureText(text.substr(0, this.cursorPos + 1)).width);
        }

        this.selectionRect.arrangePosition(this, [
            origin[0] + preTextWidth,
            origin[1] + Math.floor((this.height - this.cursorSize[1]) / 2)
        ]);
        this.selectionRect.size = [rectWidth, this.cursorSize[1]];
        console.log("setup selection rect... wtf is it");
    }

    handleMotion(key, modifiers) {
        this.cursorTimeSinceChange = 0;
        this.cursor.visible = true;

        let text = this.label.text;
        switch (key) {
            case "Backspace":
                if (this.cursorPos > 0) {
                    this.label.text = text.slice(0, this.cursorPos - 1) + text.slice(this.cursorPos);
                    this.selectPos = this.cursorPos - 1;
                    this.cursorPos--;
                }
                break;
            case "ArrowLeft":
                if (this.cursorPos > 0) {
                    if (modifiers.ctrl) {
                        let newPos = this.cursorPos - 1;
                        while (text[newPos - 1] != " " && newPos > 0) newPos--;
                        if (!modifiers.shift) this.selectPos = newPos;
                        this.cursorPos = newPos;
                    } else {
                        if (!modifiers.shift) this.selectPos = this.cursorPos - 1;
                        this.cursorPos--;
                    }
                }
                break;
            case "ArrowRight":
                if (this.cursorPos < text.length) {
                    if (modifiers.ctrl) {
                        let newPos = this.cursorPos + 1;
                        while (text[newPos] != " " && newPos < text.length) newPos++;
                        if (!modifiers.shift) this.selectPos = newPos;
                        this.cursorPos = newPos;
                    } else {
                        if (!modifiers.shift) this.selectPos = this.cursorPos + 1;
                        this.cursorPos++;
                    }
                }
                break;
            case "Home":
                this.selectPos = 0;
                this.cursorPos = 0;
                break;
            case "End":
                this.selectPos = text.length;
                this.cursorPos = text.length;
                break;
        }
    }

    handleText(key) {
        let text = this.label.text;
        if (this.cursorPos == text.length) this.label.text += key;
        else this.label.text = text.slice(0, this.cursorPos) + key + text.slice(this.cursorPos);
        this.selectPos = this.cursorPos + 1;
        this.cursorPos++;
    }

    handleKeyDown(event, data) {
        // console.log(`Text Input Receives: KEY: ${data.key} | CODE: ${data.code}`);
        this.cursorTimeSinceChange = 0;
        this.cursor.visible = true;

        // command shortcut support
        if (data.code == "KeyA" && data.modifiers.ctrl) {
        }

        if (MOTION_KEYSTROKES.includes(data.key)) this.handleMotion(data.key, data.modifiers);
        else if (TEXT_KEYSTROKES.includes(data.key)) this.handleText(data.key);
    }

    _getSelection() {
        return this.label.text.substr(this.selectPos, this.cursorPos + 1);
    }

    _getTextIndexFromPosition(point) {
        let text = this.label.text;
        let px = point[0];
        let originX = this.label.hitRect[0];
        if (px <= originX) return 0;
        else if (px >= originX + this.label.hitRect[2]) return text.length;
        else {
            // Gather width of growing string until we pass our x value
            App.Context.font = this.fontSize + "pt " + this.fontType;
            let index = 0;
            while (originX + App.Context.measureText(text.substr(0, index)).width < px) {
                index++;
            }
            return index;
        }
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
    handleMouseMove(event, data) {
        if (this.cursorDraggin) {
        }
    }
    handleMouseUp(event, data) {
        this.cursorDragging = false;
    }
    handleMouseDown(event, data) {
        // ----- DEBUG / DEV ONLY CODE -----
        Events.activePage.focusedControl = this;
        this.focused = true;
        // console.log("text input receives artifical focus");
        // ----- DO NOT FORGET TO REMOVE LATER -----

        console.log(`Text Index from ${data.position[0]}: ${this._getTextIndexFromPosition(data.position)}`);

        if (this.focused) {
            let newPos = this._getTextIndexFromPosition(data.position);
            if (!data.modifiers.shift) this.selectPos = newPos;
            this.cursorPos = newPos;
        }
        this.cursorTimeSinceChange = 0;
        this.cursor.visible = true;
        this.cursorDragging = true;
    }
    //#endregion

    //#region Override Properties
    arrangePosition(arranger, newPosition) {
        super.arrangePosition(arranger, newPosition);
        this.renderCursor();
    }
    //#endregion

    //#region Unique Properties
    get selectionFill() {
        return this._selectionFill;
    }
    set selectionFill(color) {
        if (typeof utils.hexColor(color) != "string")
            datalitError("propertySet", ["TextInput.selectionFill", String(color), "string"]);

        this.selectionRect.fillColor = color;
        this.notifyPropertyChange("selectionFill");
    }

    get selectPos() {
        return this._selectPos;
    }
    set selectPos(newPos) {
        if (!Number.isInteger(newPos) || newPos < -1 || newPos > this.label.text.length)
            datalitError("propertySet", ["TextInput.selectPos", String(newPos), "int (-1) - (text.length - 1)"]);

        this._selectPos = newPos;
        this.notifyPropertyChange("selectPos");
    }

    get cursorPos() {
        return this._cursorPos;
    }
    set cursorPos(newPos) {
        if (!Number.isInteger(newPos) || newPos < 0 || newPos > this.label.text.length)
            datalitError("propertySet", ["TextInput.cursorPos", String(newPos), "int 0 - text.length"]);

        this._cursorPos = newPos;
        this.notifyPropertyChange("cursorPos");
    }

    get cursorBlinkRate() {
        return this._cursorBlinkRate;
    }
    set cursorBlinkRate(newRate) {
        if (!Number.isInteger(newRate) || newRate < 50 || newRate > 2000)
            datalitError("propertySet", ["TextInput.cursorBlinkRate", String(newRate), "int 50 - 2000"]);

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
        if (typeof newText != "string") datalitError("propertySet", ["TextInput.text", String(newText), "string"]);

        this.label.text = newText;
        this.notifyPropertyChange("text");
    }

    get fontSize() {
        return this.label.fontSize;
    }
    set fontSize(size) {
        if (!Number.isInteger(size) || size < 2)
            datalitError("propertySet", ["TextInput.fontSize", String(size), "int > 2"]);

        this.label.fontSize = size;
        this.notifyPropertyChange("fontSize");
    }

    get fontColor() {
        return this.label.fontColor;
    }
    set fontColor(color) {
        if (typeof utils.hexColor(color) != "string")
            datalitError("propertySet", ["TextInput.fontColor", String(color), "string"]);

        this.label.fontColor = color;
        this.notifyPropertyChange("fontColor");
    }

    get fontType() {
        return this.label.fontType;
    }
    set fontType(font) {
        if (typeof font != "string") datalitError("propertySet", ["TextInput.fontType", String(font), "string"]);

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

        if (this.selectPos != this.cursorPos) this.selectionRect.draw();
    }
}
