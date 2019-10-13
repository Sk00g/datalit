import { App } from "../app";
import { datalitError } from "../errors.js";
import { ContentDirection, HAlign, VAlign, SizeTargetType, ControlState, Color } from "../enums.js";
import { Section } from "./section";
import { Events } from "../events/events";
import { Label } from "./label";
import { IconButton } from "./iconButton";
import utils from "../utils";

const BUTTON_SIZE = 28;

export class ComboBox extends Section {
    constructor() {
        super();

        super.updateProperties({
            isFocusable: true,
            contentDirection: ContentDirection.HORIZONTAL,
            borderThickness: [1, 1, 0, 1],
            borderColor: Color.BLACK,
            backgroundColor: Color.WHITE,
            halign: HAlign.LEFT,
            valign: VAlign.TOP,
            hsizeTarget: [SizeTargetType.FIXED, 200],
            vsizeTarget: [SizeTargetType.FIXED, 30]
        });

        // For convenience, store the index of the currently selected value
        this._selectedIndex = 0;

        // Maintain the option section immutable properties as an internal dict. Mutable properties are exposed as a property
        this._immutableOptionProperties = {
            halign: null,
            valign: VAlign.TOP,
            hsizeTarget: [SizeTargetType.FILL, null]
        };

        // Control declarations
        this.toggleButton = null;
        this.selectionLabel = null;
        this.popupSection = null;

        // Unique property declarations
        this._visibleOptionCount = 8;
        this._selectionOptions = [];
        this._defaultOption = null;
        this._allowNullSelection = false;
        this._optionProperties = {
            vsizeTarget: [SizeTargetType.FIXED, 30],
            backgroundColor: Color.WHITE,
            borderColor: Color.GRAY,
            borderThickness: [0, 1, 0, 1]
        };
        this._optionStyles = {
            HOVERED: { borderColor: Color.BLACK },
            SELECTED: { backgroundColor: Color.GRAY }
        };
        this.registerProperty("selectionOptions", true, true, true, utils.compareSimpleLists);
        this.registerProperty("visibleOptionCount");
        this.registerProperty("defaultOption", false, true, true);
        this.registerProperty("allowNullSelection");

        Events.register(this, "propertyChanged", (event, data) => {
            if (data.property === "focused") this.handleFocusChange();
            else if (
                data.property === "selectionOptions" ||
                data.property === "visibleOptionCount" ||
                data.property === "selectedText"
            )
                this.updatePopup();
        });

        Events.register(this, "mouseup", (event, data) => {
            console.log("mouse click");
            this.popupSection.visible = true;
        });
    }

    initialize(generateControl) {
        super.initialize(generateControl);

        // Create building block controls
        this.toggleButton = generateControl(
            "IconButton",
            {
                imagePath: "down-filled",
                action: btn => this._handleTogglePress(),
                halign: HAlign.RIGHT,
                valign: null,
                margin: 0,
                hsizeTarget: [SizeTargetType.FIXED, BUTTON_SIZE],
                vsizeTarget: [SizeTargetType.FILL, null],
                iconMargin: 10,
                borderThickness: [0, 1, 1, 1],
                borderColor: Color.BLACK,
                backgroundColor: Color.WHITE,
                debugName: "toggleButton"
            },
            null,
            null
        );
        super.addChild(this.toggleButton);

        this.selectionLabel = generateControl("Label", {
            halign: HAlign.LEFT,
            valign: VAlign.CENTER,
            debugName: "selectionLabel"
        });
        super.addChild(this.selectionLabel);

        // Alias properties
        this.registerAliasProperty("toggleImagePath", "toggleButton", "imagePath", false);
        this.registerAliasProperty("selectedText", "selectionLabel", "text", true);

        // Ensure popup is updated from initial creation
        this.updatePopup();
    }

    updatePopupPosition() {
        this.popupSection.arrangePosition(this, [
            this._arrangedPosition[0],
            this._arrangedPosition[1] + this.height + 2
        ]);
    }

    updatePopup() {
        console.log("updating popup");

        var popupSize = [this.width, this.visibleOptionCount * this._optionProperties.vsizeTarget[1]];

        this.popupSection = this._generator("Section", {
            contentDirection: ContentDirection.VERTICAL,
            halign: null,
            hsizeTarget: [SizeTargetType.FIXED, popupSize[0]],
            valign: null,
            vsizeTarget: [SizeTargetType.FIXED, popupSize[1]],
            borderColor: Color.BLACK,
            borderThickness: 1
        });
        this.updatePopupPosition();
    }

    handleFocusChange() {
        console.log("focus changed to " + this.focused);

        if (this.popupSection) {
            this.popupSection.visible = true;
        }
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

    draw(context = App.Context, offset = [0, 0]) {
        super.draw(context, offset);

        if (this.popupSection && this.popupSection.visible) {
            console.log("drawing popup section");
            this.popupSection.draw(context, offset);
        }
    }
    // -----------------

    // Properties
    get selectionOptions() {
        return this._selectionOptions;
    }
    set selectionOptions(newOptions) {
        if (typeof newOptions != "object" || !newOptions.length)
            datalitError("propertySet", ["ComboBox.selectionOptions", String(newOptions), "list"]);

        this._selectionOptions = newOptions;
        this.notifyPropertyChange("selectionOptions");
    }

    get visibleOptionCount() {
        return this._visibleOptionCount;
    }
    set visibleOptionCount(newCount) {
        if (typeof newCount != "number" || newCount < 1)
            datalitError("propertySet", ["ComboBox.visibleOptionCount", String(newCount), "int 1 or greater"]);

        this._visibleOptionCount = newCount;
        this.notifyPropertyChange("visibleOptionCount");
    }

    get defaultOption() {
        return this._defaultOption;
    }
    set defaultOption(newValue) {
        if (typeof newValue != "string")
            datalitError("propertySet", ["ComboBox.defaultOption", String(newValue), "string"]);

        if (newValue != null && !this.selectionOptions.includes(newValue))
            datalitError("propertySet", ["ComboBox.defaultOption", String(newValue), "within options list"]);

        this._defaultOption = newValue;
        this.notifyPropertyChange("defaultOption");
    }

    get allowNullSelection() {
        return this._allowNullSelection;
    }
    set allowNullSelection(newValue) {
        if (typeof newValue != "boolean")
            datalitError("propertySet", ["ComboBox.allowNullSelection", String(newValue), "boolean"]);

        this._allowNullSelection = newValue;
        this.notifyPropertyChange("allowNullSelection");
    }
}
