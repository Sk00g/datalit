import { Section } from "./section";
import { Events } from "../events/events.js";
import { Icon } from "./icon";
import { HAlign, VAlign, ControlState } from "../enums";
import utils from "../utils";

export class IconButton extends Section {
    constructor() {
        super();

        // Composite control declarations
        this.icon = null;

        // Unique Properties
        this._action = null;
        this._iconOffset = [0, 0];
        this.registerProperty("action", false, false, true);

        Events.attachSource(this, ["click"]);
    }

    initialize(generateControl) {
        super.initialize(generateControl);

        this.icon = generateControl("Icon");
        this.addChild(this.icon);

        this.registerProperty("iconMargin", true, true, false, utils.compareSides);
        this.registerAliasProperty("imagePath", "icon");
        this.registerAliasProperty("sourceRect", "icon");
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
        // console.log(`updating iconButton size to ${newSize} (${this.icon.margin})`);
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

        // Also update icon size as this is affected by the icon's margin
        this.icon.size = [
            this.size[0] - this.icon.margin[0] - this.icon.margin[2],
            this.size[1] - this.icon.margin[1] - this.icon.margin[3]
        ];
        this.notifyPropertyChange("iconMargin");
    }
}
