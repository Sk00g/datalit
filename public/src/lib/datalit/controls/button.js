import { App } from "../app.js";
import { Color, ContentDirection, ControlState, HAlign, VAlign, SizeTargetType } from "../enums.js";
import { datalitError } from "../errors.js";
import { Events } from "../events/events.js";
import { Label } from "./label.js";
import { Section } from "./section.js";
import utils from "../utils.js";

export class Button extends Section {
    constructor() {
        super();

        super.updateProperties({
            contentDirection: ContentDirection.HORIZONTAL,
            borderColor: Color.BLACK,
            borderThickness: 1,
            valign: VAlign.TOP,
            halign: HAlign.LEFT,
            hsizeTarget: [SizeTargetType.FIXED, 100],
            vsizeTarget: [SizeTargetType.FIXED, 30]
        });

        // Composite control definitions
        this.label = null;

        // Unique Properties
        this._textOffset = 0;
        this._action = null;
        this.registerProperty("textOffset", true);
        this.registerProperty("action", false, false, true);

        Events.attachSource(this, ["click"]);
    }

    initialize(generateControl) {
        super.initialize(generateControl);

        // Button should always wait for mouse press events, even if style events haven't been initialized
        Events.register(this, "mousedown", (ev, data) => this.handleMouseDown(ev, data));
        Events.register(this, "mouseup", (ev, data) => this.handleMouseUp(ev, data));

        this.label = generateControl("Label", {
            text: "",
            margin: 0,
            halign: HAlign.CENTER,
            valign: VAlign.CENTER
        });
        this.addChild(this.label);

        this.registerAliasProperty("text", "label", "text", true);
        this.registerAliasProperty("fontSize", "label");
        this.registerAliasProperty("fontColor", "label");
        this.registerAliasProperty("fontType", "label");
    }

    handleMouseUp() {
        if (this.state == ControlState.DEPRESSED) this.dispatchEvent("click", this);

        super.handleMouseUp();
    }

    //#region Override Method
    //#endregion

    //#region Override Properties
    //#endregion

    //#region Unique Properties
    get action() {
        return this._action;
    }
    set action(newAction) {
        if (typeof newAction != "function")
            datalitError("propertySet", ["Button.action", String(newAction), "function"]);

        // Remove current action callback if present
        if (this._action) this.removeEventListener("click", this._action);
        this.addEventListener("click", newAction);

        this._action = newAction;
        this.notifyPropertyChange("action");
    }
    get textOffset() {
        return this._textOffset;
    }
    set textOffset(offset) {
        if (!Number.isInteger(offset)) datalitError("propertySet", ["Button.textOffset", String(offset), "int"]);

        if (offset > 0) this.label.margin = [offset, offset, 0, 0];
        else if (offset < 0) this.label.margin = [0, 0, -offset, -offset];
        else this.label.margin = 0;
        this._textOffset = offset;
        this.notifyPropertyChange("textOffset");
    }
    //#endregion
}
