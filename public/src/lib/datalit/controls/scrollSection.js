import { App } from "../app";
import { datalitError } from "../errors.js";
import { ContentDirection, HAlign, VAlign, SizeTargetType } from "../enums.js";
import { Section } from "./section";
import { Events } from "../events/events";
import { Button } from "./button";

const WHEEL_FACTOR = 5;
const BAR_SIZE = 22;

export class ScrollSection extends Section {
    constructor(initialProperties = {}, withholdEvents = false) {
        super();

        // Keep our own Canvas element to draw onto the main canvas
        this._selfCanvas = document.createElement("canvas");
        this._selfContext = this._selfCanvas.getContext("2d");

        // Create our scroll bars, not as children because we don't want them affected by the full offsets, just partial
        this.verticalScrollbar = new Section({
            contentDirection: ContentDirection.VERTICAL,
            backgroundColor: "bbbbbb",
            size: [BAR_SIZE, 0]
        });
        this.verticalScrollbar.topButton = new Button({});

        // Unique Properties
        this._horizontalScrollable = true;
        this._verticalScrollable = true;
        this._verticalScrollLocation = 0;
        this._horizontalScrollLocation = 0;
        this.registerProperty("horizontalScrollable", true, true, true);
        this.registerProperty("verticalScrollable", true, true, true);
        this.registerProperty("verticalScrollLocation", false, true, true);
        this.registerProperty("horizontalScrollLocation", false, true, true);

        // Apply base theme before customized properties
        this.applyTheme("ScrollSection");

        this.updateProperties(initialProperties);

        // Will typically continue to withold events until child constructor sets = false
        // However, new Section() will sometimes be called directly
        this._withholdingEvents = withholdEvents;

        // Listen for scroll events and update accordingly
        Events.register(this, "wheel", (ev, data) => this.handleScroll(ev, data));
    }

    handleScroll(ev, data) {
        let ndistance = data.distance * WHEEL_FACTOR;
        if (data.direction === "horizontal") {
            this.horizontalScrollLocation =
                data.distance > 0
                    ? Math.min(this.horizontalScrollLocation + ndistance, this.getVirtualWidth() - this.size[0])
                    : Math.max(this.horizontalScrollLocation + ndistance, 0);
        } else if (data.direction === "vertical") {
            this.verticalScrollLocation =
                data.distance > 0
                    ? Math.min(this.verticalScrollLocation + ndistance, this.getVirtualHeight() - this.size[1])
                    : Math.max(this.verticalScrollLocation + ndistance, 0);
        }
    }

    getVirtualHeight() {
        if (this.contentDirection == ContentDirection.VERTICAL) {
            return Math.max(this.size[1], this.children.reduce((val, item) => val + item.viewHeight, 0));
        } else if (this.contentDirection == ContentDirection.HORIZONTAL) {
            return this.size[1];
        }
    }

    getVirtualWidth() {
        if (this.contentDirection == ContentDirection.HORIZONTAL) {
            return Math.max(this.size[0], this.children.reduce((val, item) => val + item.viewWidth, 0));
        } else if (this.contentDirection == ContentDirection.VERTICAL) {
            return this.size[0];
        }
    }

    //#region Method overrides
    prerenderCheck() {
        // ContentDirection.FREE is always viable, just might not make sense
        if (this.contentDirection == ContentDirection.FREE) return;

        let alignProp = this.contentDirection == ContentDirection.HORIZONTAL ? "halign" : "valign";
        let sizeTargetProp = this.contentDirection == ContentDirection.HORIZONTAL ? "hsizeTarget" : "vsizeTarget";
        // Cannot have both Align.CENTER and SizeTargetType.FILL in the same axis
        let fills = this.children.filter(ch => ch.isArranger && ch[sizeTargetProp][0] == SizeTargetType.FILL);
        let centers = this.children.filter(ch => ch[alignProp] === HAlign.CENTER);
        if (fills.length > 0 && centers.length > 0)
            datalitError("invalidAlignment", [this.debugName, "Cannot have CENTER + FILL in same axis"]);
    }
    draw(context = App.Context, offset = [0, 0]) {
        let positionOffset = [
            -this._arrangedPosition[0] - this.margin[0] - offset[0],
            -this._arrangedPosition[1] - this.margin[1] - offset[1]
        ];
        if (this.background) this.background.draw(this._selfContext, positionOffset);

        for (let child of this.orderedChildren) {
            if (child.visible) {
                child.draw(this._selfContext, [
                    positionOffset[0] - this.horizontalScrollLocation,
                    positionOffset[1] - this.verticalScrollLocation
                ]);
            }
        }

        // After all children are drawn to this canvas, draw our canvas onto parent canvas
        context.drawImage(
            this._selfCanvas,
            this.margin[0] + this._arrangedPosition[0] + offset[0],
            this.margin[1] + this._arrangedPosition[1] + offset[1]
        );
        console.log(
            `draw self canvas at ${this._arrangedPosition} with size (${this._selfCanvas.width}, ${this._selfCanvas.height})`
        );
    }

    //#region Property overrides
    get size() {
        return super.size;
    }
    set size(newSize) {
        super.size = newSize;
        if (this.background) this.background.size = newSize;

        // We must match the internal canvas to the arranged size given by parent
        this._selfCanvas.width = newSize[0];
        this._selfCanvas.height = newSize[1];

        // Scroll bars must match their length
        this.horizontalScrollbar.width = newSize[0];
        this.verticalScrollbar.height = newSize[1];

        // This render can now determine the size and alignment of nested sections and elements
        this.scheduleRender();
    }
    //#endregion

    //#region Unique property definitions
    get horizontalScrollLocation() {
        return this._horizontalScrollLocation;
    }
    set horizontalScrollLocation(newLocation) {
        if (!Number.isInteger(newLocation))
            datalitError("propertySet", ["ScrollSection.horizontalScrollLocation", String(newLocation), "INT"]);
        if (newLocation > this.getVirtualWidth() - this.size[0] || newLocation < 0)
            datalitError("propertySet", [
                "ScrollSection.horizontalScrollLocation",
                String(newLocation),
                `< ${this.getVirtualWidth() - this.size[0]} && > 0`
            ]);

        this._horizontalScrollLocation = newLocation;
        this.notifyPropertyChange("horizontalScrollLocation");
    }
    get verticalScrollLocation() {
        return this._verticalScrollLocation;
    }
    set verticalScrollLocation(newLocation) {
        if (!Number.isInteger(newLocation))
            datalitError("propertySet", ["ScrollSection.verticalScrollLocation", String(newLocation), "INT"]);
        if (newLocation > this.getVirtualHeight() - this.size[1] || newLocation < 0)
            datalitError("propertySet", [
                "ScrollSection.verticalScrollLocation",
                String(newLocation),
                `< ${this.getVirtualHeight() - this.size[1]} && > 0`
            ]);

        this._verticalScrollLocation = newLocation;
        this.notifyPropertyChange("verticalScrollLocation");
    }
    get horizontalScrollable() {
        return this._horizontalScrollable;
    }
    set horizontalScrollable(flag) {
        if (typeof flag != "boolean")
            datalitError("propertySet", ["ScrollSection.horizontalScrollable", String(flag), "BOOL"]);

        this._horizontalScrollable = flag;
        this.notifyPropertyChange("horizontalScrollable");
    }

    get verticalScrollable() {
        return this._verticalScrollable;
    }
    set verticalScrollable(flag) {
        if (typeof flag != "boolean")
            datalitError("propertySet", ["ScrollSection.verticalScrollable", String(flag), "BOOL"]);

        this._verticalScrollable = flag;
        this.notifyPropertyChange("verticalScrollable");
    }
}
