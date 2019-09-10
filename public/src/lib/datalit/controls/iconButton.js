import { Section } from "./section";
import { Events } from "../events/events.js";
import { Icon } from "./icon";
import { HAlign, VAlign, ControlState } from "../enums";
import utils from "../utils";

export class IconButton extends Section {
    constructor(initialProperties = {}, withholdingEvents = false) {
        super();

        this.icon = new Icon();
        this.addChild(this.icon);

        // Unique Properties
        this._action = null;
        this._iconOffset = [0, 0];
        this.registerProperty("action", false, false, true);
        this.registerProperty("iconMargin", true, true, false, utils.compareSides);
        this.registerProperty("imagePath", false, true, true);
        this.registerProperty("sourceRect", false, true, false, utils.compareSides);

        // Apply base theme before customized properties
        this.applyTheme("IconButton");

        this.updateProperties(initialProperties);

        // Release propertyChanged events
        this._withholdingEvents = withholdingEvents;

        Events.attachSource(this, ["click"]);
    }

    handleMouseUp() {
        if (this.state == ControlState.DEPRESSED) this.dispatchEvent("click", this);

        super.handleMouseUp();
    }
    //#region Property overrides
    get size() {
        return super.size;
    }
    set size(newSize) {
        super.size = newSize;
        this.icon.size = [
            newSize[0] - this.icon.margin[0] - this.icon.margin[2],
            newSize[1] - this.icon.margin[1] - this.icon.margin[3]
        ];
    }

    //#region Unique Properties
    get action() {
        return this._action;
    }
    set action(newAction) {
        if (typeof newAction != "function")
            datalitError("propertySet", ["IconButton.action", String(newAction), "function"]);

        // Remove current action callback if present
        if (this._action) this.removeEventListener("click", this._action);
        this.addEventListener("click", newAction);

        this._action = newAction;
        this.notifyPropertyChange("action");
    }

    get iconMargin() {
        return this.icon.margin;
    }
    set iconMargin(newMargin) {
        this.icon.margin = newMargin;
        this.notifyPropertyChange("iconMargin");
    }

    get imagePath() {
        return this.icon.imagePath;
    }
    set imagePath(newPath) {
        this.icon.imagePath = newPath;
        this.notifyPropertyChange("imagePath");
    }

    get sourceRect() {
        return this.icon.sourceRect;
    }
    set sourceRect(newRect) {
        this.icon.sourceRect = newRect;
        this.notifyPropertyChange("sourceRect");
    }
}
