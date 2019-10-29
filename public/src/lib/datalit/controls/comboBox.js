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
            contentDirection: ContentDirection.FREE,
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
            valign: VAlign.TOP,
            halign: null,
            vsizeTarget: [SizeTargetType.FIXED, 30],
            hsizeTarget: [SizeTargetType.FILL, null],
            backgroundColor: Color.WHITE,
            borderColor: Color.BLACK,
            borderThickness: [1, 0, 1, 1]
        };
        this._optionStyles = {
            HOVERED: { backgroundColor: Color.GRAY },
            SELECTED: { backgroundColor: "bbbbee" }
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
        });

        Events.register(this, "keydown", (event, data) => this.handleKeyDown(event, data));
    }

    initialize(generateControl) {
        super.initialize(generateControl);

        // Create building block controls
        this.toggleButton = generateControl("IconButton", {
            imagePath: "down-filled",
            action: btn => this._handleTogglePress(),
            margin: 0,
            localPosition: [200 - BUTTON_SIZE, 0],
            size: [BUTTON_SIZE, 30],
            iconMargin: 10,
            borderThickness: [0, 1, 1, 1],
            borderColor: Color.BLACK,
            backgroundColor: Color.WHITE,
            debugName: "toggleButton"
        });
        super.addChild(this.toggleButton);

        this.selectionLabel = generateControl("Label", {
            localPosition: [8, 8],
            debugName: "selectionLabel"
        });
        super.addChild(this.selectionLabel);

        // Alias properties
        this.registerAliasProperty("toggleImagePath", "toggleButton", "imagePath", false);
        this.registerAliasProperty("selectedText", "selectionLabel", "text", true);
    }

    handleKeyDown(event, data) {
        console.log(JSON.stringify(data));

        if (data.code === "Escape") this.focused = false;
    }

    activate() {
        super.activate();

        // Ensure popup is updated from initial creation
        this.updatePopup();

        // Add defaultOption as selected if present
        if (this.defaultOption) {
            this.selectedText = this.defaultOption;
            this._selectedIndex = this.selectionOptions.indexOf(this.selectedText);
        }
    }

    updatePopupPosition() {
        this.popupSection.arrangePosition(this, [
            this._arrangedPosition[0],
            this._arrangedPosition[1] + this.height + 2
        ]);
    }

    updatePopup() {
        console.log("updating popup");

        if (this.popupSection) {
            super.removeChild(this.popupSection);
            App.removePopup(this.popupSection);
        }

        this.popupSection = this._generator("Section", {
            contentDirection: ContentDirection.VERTICAL,
            size: [200, this.visibleOptionCount * this._optionProperties.vsizeTarget[1]],
            localPosition: [0, 30],
            borderColor: Color.BLACK,
            borderThickness: 1,
            backgroundColor: Color.WHITE,
            debugName: "comboboxPopupSection"
        });

        for (var i = 0; i < this.selectionOptions.length; i++) {
            var optionSection = this._generator(
                "Section",
                { ...this._optionProperties, debugName: `option ${i}` },
                this._optionStyles
            );
            optionSection.label = this._generator("Label", {
                text: this.selectionOptions[i],
                margin: [10, 0, 10, 0],
                valign: VAlign.CENTER
            });
            optionSection.addChild(optionSection.label);
            this.popupSection.addChild(optionSection);
        }

        this.updatePopupPosition();

        // Record as a popup, so mouse events still hit it, despite it being outside the bounds of its parent Section
        // App.addPopup(this.popupSection);
    }

    handleFocusChange() {
        console.log("focus changed to " + this.focused);

        if (this.focused) {
            super.addChild(this.popupSection);
            App.addPopup(this.popupSection);
        } else {
            super.removeChild(this.popupSection);
            App.removePopup(this.popupSection);
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
