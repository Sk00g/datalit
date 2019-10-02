import { App } from "../app.js";
import { Color, ContentDirection, Cursor, TEXT_KEYSTROKES, MOTION_KEYSTROKES } from "../enums.js";
import { datalitError } from "../errors.js";
import { Events } from "../events/events.js";
import { Label } from "./label.js";
import { Rect } from "./rect.js";
import { Section } from "./section.js";
import utils from "../utils.js";
import factory from "../controlFactory.js";

export class TextEdit extends Section {
    constructor() {
        super();

        super.isFocusable = true;
        super.contentDirection = ContentDirection.FREE;
        super.size = [300, 80];

        // Holds each line of text in this array
        this._lines = [];

        // Rectangle showing the selected text
        this.selectionRect = factory.generateControl("Rect", {
            fillColor: "99BBEE99",
            zValue: 1,
            visible: false
        });
        this._selectionFill = "99BBEE99";
        this.addChild(this.selectionRect);

        // Rectangle showing focus
        this.focusRect = factory.generateControl("Rect", {
            fillColor: Color.TRANSPARENT,
            borderColor: "1133CC88",
            borderThickness: 1,
            localPosition: [-1, -1],
            zValue: 4,
            visible: false,
            size: [this.size[0] + 2, this.size[1] + 2]
        });
        this._focusColor = "1133CC88";
        this.addChild(this.focusRect);

        // Blinking cursor to show current typing location
        this.cursor = factory.generateControl("Rect", { size: [1, 18], fillColor: "22", zValue: 3, visible: false });
        this.cursorTimeSinceChange = 0;
        this.cursorDragStart = 0;
        this.cursorDragging = false;
        this.renderCursor();
        this.addChild(this.cursor);

        // Private fields behind properties
        this._cursorBlinkRate = 500; // Timeout between on/off swaps in ms
        this._cursorPos = [0, 0];
        this._selectPos = [0, 0];
        this._lineSpace = 8;

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
        this.registerProperty("focusColor", false, true, true);
        this.registerProperty("lineSpace", true, true, true);

        // Subsribe to self events for rendering
        Events.register(this, "propertyChanged", (event, data) => {
            if (data.property == "cursorPos") this.renderCursor();
            else if (data.property == "focused") {
                this.cursor.visible = this.focused;
                this.focusRect.visible = this.focused;
                if (!this.focused) {
                    this.selectPos = this.cursorPos;
                    this.renderSelection();
                }
            }
        });

        // Listen for keyboard input
        Events.register(this, "keydown", (event, data) => this.handleKeyDown(event, data));

        // Listen for double-click selection
        Events.register(this, "dblclick", (event, data) => this.handleDoubleClick(event, data));
    }

    renderCursor() {
        let text = this.label.text;

        App.Context.font = this._fontSize + "pt " + this._fontType;
        let preTextWidth = Math.floor(App.Context.measureText(text.substr(0, this.cursorPos[0])).width);
        let newX = this.label.margin[0] + preTextWidth;
        let newY = this.fontMargin[1] + (this.fontSize / 2) * (this.cursorPos[1] + 1);

        this.cursor.localPosition = [newX, newY];

        if (this._hasSelection()) this.renderSelection();
        else this.selectionRect.visible = false;
    }

    renderSelection() {
        this.selectionRect.visible = true;
        let text = this.label.text;

        App.Context.font = this._fontSize + "pt " + this._fontType;

        let rectWidth, preTextWidth;
        // Shift + Right
        if (this.selectPos < this.cursorPos) {
            rectWidth = Math.floor(App.Context.measureText(text.slice(this.selectPos, this.cursorPos)).width);
            preTextWidth = Math.floor(App.Context.measureText(text.substr(0, this.selectPos)).width);
        }
        // Shift + Left
        else {
            rectWidth = Math.floor(App.Context.measureText(text.slice(this.cursorPos, this.selectPos)).width);
            preTextWidth = Math.floor(App.Context.measureText(text.substr(0, this.cursorPos)).width);
        }

        this.selectionRect.localPosition = [
            this.label.margin[0] + preTextWidth,
            Math.floor((this.height - this.cursorSize[1]) / 2)
        ];
        this.selectionRect.size = [rectWidth, this.cursorSize[1]];
    }

    handleMotion(key, modifiers) {
        this.cursorTimeSinceChange = 0;
        this.cursor.visible = true;

        let text = this.label.text;
        switch (key) {
            case "Delete":
                if (this._hasSelection()) this._removeSelection();
                else if (this.cursorPos < text.length)
                    this.label.text = text.slice(0, this.cursorPos) + text.slice(this.cursorPos + 1);
                break;
            case "Backspace":
                if (this._hasSelection()) this._removeSelection();
                else if (this.cursorPos > 0) {
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
            case "ArrowUp":
                if (this.cursorPos[1] > 0) {
                    this.cursorPos[1]--;
                }
                break;
            case "ArrowDown":
                if (this.cursorPos[1] < this._lines.length - 1) {
                    this.cursorPos[1]++;
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

    handleText(newText) {
        // Replace selected text if present
        if (this._hasSelection()) this._removeSelection();

        let text = this.label.text;

        if (this.cursorPos == text.length) this.label.text += newText;
        else this.label.text = text.slice(0, this.cursorPos) + newText + text.slice(this.cursorPos);

        this.selectPos = this.cursorPos + newText.length;
        this.cursorPos = this.selectPos;
    }

    handleDoubleClick(event, data) {
        let text = this.label.text;
        // let text = "hello there scott";
        let clickPos = this._getTextIndexFromPosition(data.position);

        let wordStart = clickPos;
        let wordEnd = clickPos;
        while (text[wordStart] != " " && wordStart >= 0) wordStart--;
        while (text[wordEnd] != " " && wordEnd < text.length) wordEnd++;

        this.selectPos = wordStart + 1;
        this.cursorPos = wordEnd;
    }

    handleKeyDown(event, data) {
        this.cursorTimeSinceChange = 0;
        this.cursor.visible = true;

        // command shortcut support
        if (data.modifiers.ctrl && data.code == "KeyA") {
            let previousCursor = this.cursorPos;
            this.selectPos = 0;
            this.cursorPos = this.label.text.length;
            // Trigger selection if cursor didn't change values, as propertyChanged handler won't catch it
            if (previousCursor == this.cursorPos) this.renderSelection();
        } else if (data.modifiers.ctrl && data.code == "KeyC") {
            if (this._hasSelection()) App.GlobalState.Clipboard = this._getSelection();
        } else if (data.modifiers.ctrl && data.code == "KeyX") {
            if (this._hasSelection()) {
                App.GlobalState.Clipboard = this._getSelection();
                this._removeSelection();
            }
        } else if (data.modifiers.ctrl && data.code == "KeyV") {
            if (this._hasSelection()) this._removeSelection();
            this.handleText(App.GlobalState.Clipboard);
        } else if (MOTION_KEYSTROKES.includes(data.key)) this.handleMotion(data.key, data.modifiers);
        else if (!data.modifiers.ctrl && TEXT_KEYSTROKES.includes(data.key)) this.handleText(data.key);
    }

    _removeSelection() {
        let previousCursor = this.cursorPos;
        let text = this.label.text;
        let firstText = text.substr(0, Math.min(this.selectPos, this.cursorPos));
        let secondText = text.substr(Math.max(this.selectPos, this.cursorPos));
        this.label.text = firstText + secondText;
        this.selectPos = Math.min(this.selectPos, this.cursorPos);
        this.cursorPos = this.selectPos;
        // Trigger selection if cursor didn't change values, as propertyChanged handler won't catch it
        if (previousCursor == this.cursorPos) this.renderSelection();
    }

    _hasSelection() {
        return this.selectPos != this.cursorPos;
    }

    _getSelection() {
        if (this.selectPos == this.cursorPos) return null;
        else if (this.selectPos < this.cursorPos) return this.label.text.slice(this.selectPos, this.cursorPos);
        else return this.label.text.slice(this.cursorPos, this.selectPos);
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
            // Estimate halfway point for average character
            let halfway = Math.floor(this.fontSize / 2);
            while (originX + App.Context.measureText(text.substr(0, index)).width + halfway < px) {
                index++;
            }
            return index;
        }
    }

    //#region Override Method
    render() {
        // Before arranging Align.FREE elements, calculate their positions
        this.label.localPosition = [0, Math.floor((this.height - this.label.height) / 2)];

        super.render();
    }
    handleMouseEnter(event, data) {
        super.handleMouseEnter(event, data);

        utils.changeCursor(Cursor.TEXT);
    }
    handleMouseLeave(event, data) {
        super.handleMouseLeave(event, data);

        utils.changeCursor(Cursor.DEFAULT);
    }
    handleMouseMove(event, data) {
        super.handleMouseMove(event, data);

        if (this.cursorDragging) {
            this.cursorPos = this._getTextIndexFromPosition(data.position);
        }
    }
    handleMouseUp(event, data) {
        super.handleMouseUp(event, data);

        if (this.cursorDragging) {
            this.cursorPos = this._getTextIndexFromPosition(data.position);
        }
        this.cursorDragging = false;
    }
    handleMouseDown(event, data) {
        super.handleMouseDown(event, data);

        // console.log(`Text Index from ${data.position[0]}: ${this._getTextIndexFromPosition(data.position)}`);

        if (this.focused) {
            let newPos = this._getTextIndexFromPosition(data.position);
            if (!data.modifiers.shift) this.selectPos = newPos;
            this.cursorPos = newPos;
        }
        this.cursorTimeSinceChange = 0;
        this.cursor.visible = true;
        this.cursorDragging = true;
        this.cursorDragStart = data.position;
    }
    //#endregion

    //#region Override Properties
    get size() {
        return super.size;
    }
    set size(newSize) {
        // Match focusRect size to this.size
        if (this.focusRect) this.focusRect.size = [newSize[0] + 2, newSize[1] + 2];

        super.size = newSize;
    }
    //#endregion

    //#region Unique Properties
    get lineSpace() {
        return this._lineSpace;
    }
    set lineSpace(newSpace) {
        if (!Number.isInteger(newSpace) || newSpace < 0 || newSpace > 100)
            datalitError("propertySet", ["TextEdit.lineSpace", String(newSpace), "int 0 - 100"]);

        this._lineSpace = newSpace;
        this.notifyPropertyChange("newSpace");
    }

    get focusColor() {
        return this._focusColor;
    }
    set focusColor(color) {
        if (typeof utils.hexColor(color) != "string")
            datalitError("propertySet", ["TextEdit.focusColor", String(color), "string"]);

        this.focusRect.borderColor = color;
        this.notifyPropertyChange("focusColor");
    }

    get selectionFill() {
        return this._selectionFill;
    }
    set selectionFill(color) {
        if (typeof utils.hexColor(color) != "string")
            datalitError("propertySet", ["TextEdit.selectionFill", String(color), "string"]);

        this.selectionRect.fillColor = color;
        this.notifyPropertyChange("selectionFill");
    }

    get selectPos() {
        return this._selectPos;
    }
    set selectPos(newPos) {
        if (!Number.isInteger(newPos) || newPos < -1 || newPos > this.label.text.length)
            datalitError("propertySet", ["TextEdit.selectPos", String(newPos), "int (-1) - (text.length - 1)"]);

        this._selectPos = newPos;
        this.notifyPropertyChange("selectPos");
    }

    get cursorPos() {
        return this._cursorPos;
    }
    set cursorPos(newPos) {
        if (!Number.isInteger(newPos) || newPos < 0 || newPos > this.label.text.length)
            datalitError("propertySet", ["TextEdit.cursorPos", String(newPos), "int 0 - text.length"]);

        this._cursorPos = newPos;
        this.notifyPropertyChange("cursorPos");
    }

    get cursorBlinkRate() {
        return this._cursorBlinkRate;
    }
    set cursorBlinkRate(newRate) {
        if (!Number.isInteger(newRate) || newRate < 50 || newRate > 2000)
            datalitError("propertySet", ["TextEdit.cursorBlinkRate", String(newRate), "int 50 - 2000"]);

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
        if (typeof newText != "string") datalitError("propertySet", ["TextEdit.text", String(newText), "string"]);

        this.label.text = newText;
        this.notifyPropertyChange("text");
    }

    get fontSize() {
        return this.label.fontSize;
    }
    set fontSize(size) {
        if (!Number.isInteger(size) || size < 2)
            datalitError("propertySet", ["TextEdit.fontSize", String(size), "int > 2"]);

        this.label.fontSize = size;
        this.notifyPropertyChange("fontSize");
    }

    get fontColor() {
        return this.label.fontColor;
    }
    set fontColor(color) {
        if (typeof utils.hexColor(color) != "string")
            datalitError("propertySet", ["TextEdit.fontColor", String(color), "string"]);

        this.label.fontColor = color;
        this.notifyPropertyChange("fontColor");
    }

    get fontType() {
        return this.label.fontType;
    }
    set fontType(font) {
        if (typeof font != "string") datalitError("propertySet", ["TextEdit.fontType", String(font), "string"]);

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
}
