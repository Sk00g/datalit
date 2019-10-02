import { App } from "../app";
import { datalitError } from "../errors.js";
import { ContentDirection, HAlign, VAlign, SizeTargetType, ControlState, Color } from "../enums.js";
import { Section } from "./section";
import { Events } from "../events/events";
import { Label } from "./label";
import { IconButton } from "./iconButton";

const BUTTON_SIZE = 28;

export class ComboBox extends Section {
    constructor(initialProperties = {}, withholdEvents = false) {
        super({
            contentDirection: ContentDirection.HORIZONTAL,
            borderThickness: [1, 1, 0, 1],
            borderColor: Color.BLACK,
            hsizeTarget: [SizeTargetType.FIXED, 200],
            vsizeTarget: [SizeTargetType.FIXED, 30]
        });

        // Always horizontal because to place button beside label section
        initialProperties.contentDirection = ContentDirection.HORIZONTAL;

        // Create building block controls
        this._toggleButton = new IconButton({
            imagePath: "down-filled",
            action: btn => this._handleTogglePress(),
            halign: HAlign.RIGHT,
            valign: null,
            margin: 0,
            hsizeTarget: [SizeTargetType.FIXED, BUTTON_SIZE],
            vsizeTarget: [SizeTargetType.FILL, null],
            iconMargin: 10,
            borderThickness: [0, 1, 1, 1],
            borderColor: initialProperties.borderColor || Color.BLACK,
            backgroundColor: initialProperties.backgroundColor || "DDDDDD",
            ignoreTheme: true,
            debugName: "toggleButton"
        });
        super.addChild(this._toggleButton);

        this._selectionLabel = new Label({
            halign: HAlign.LEFT,
            valign: VAlign.CENTER,
            debugName: "selectionLabel"
        });
        super.addChild(this._selectionLabel);

        // Unique Properties

        // Apply base theme before customized properties
        this.applyTheme("ComboBox");

        this.updateProperties(initialProperties);

        // Will typically continue to withold events until child constructor sets = false
        // However, new Section() will sometimes be called directly
        this._withholdingEvents = withholdEvents;
    }

    // Method Overrides
    addChild(newChild) {
        throw new Error("Cannot have children in ComboBox");
    }
    removeChild(child) {
        throw new Error("Cannot have children in ComboBox");
    }

    _handleTogglePress(btn) {
        console.log("toggle button pressed");
    }
}
