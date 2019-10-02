import { App } from "../app";
import { datalitError } from "../errors.js";
import { ContentDirection, HAlign, VAlign, SizeTargetType, ControlState, Color } from "../enums.js";
import { Section } from "./section";
import { Events } from "../events/events";
import { IconButton } from "./iconButton";
import { Rect } from "./rect";
import factory from "../controlFactory";

const WHEEL_FACTOR = 6;
const BUTTON_CLICK_DISTANCE = 20;
const BAR_SIZE = 18;
const BUTTON_HEIGHT = 22;
const INDICATOR_BAR_SIZE = 84;

export class ScrollSection extends Section {
    constructor() {
        super();

        // --- DEBUG ---
        this.contentDirection = ContentDirection.HORIZONTAL;
        // -------------

        // Unique Properties
        this._horizontalScrollable = true;
        this._verticalScrollable = true;
        this._verticalScrollLocation = 0;
        this._horizontalScrollLocation = 0;
        this.registerProperty("horizontalScrollable", true, true, true);
        this.registerProperty("verticalScrollable", true, true, true);
        this.registerProperty("verticalScrollLocation", false, true, true);
        this.registerProperty("horizontalScrollLocation", false, true, true);

        // Keep our own Canvas element to draw onto the main canvas
        this._selfCanvas = document.createElement("canvas");
        this._selfContext = this._selfCanvas.getContext("2d");

        // Create content section to hold the actual scrollable content
        this._contentSection = factory.generateControl("Section", {
            contentDirection: ContentDirection.VERTICAL,
            debugName: "contentSection"
        });
        super.addChild(this._contentSection);

        // Create our scroll bar(s)
        this.verticalScrollbar = this.buildVerticalScrollbar();
        super.addChild(this.verticalScrollbar);

        // Listen for scroll events and update accordingly
        Events.register(this, "wheel", (ev, data) => this.handleScroll(ev, data));

        // Update indicatorRect as necessary
        Events.register(this, "propertyChanged", (ev, data) => {
            if (data.property === "horizontalScrollLocation" || data.property === "verticalScrollLocation") {
                this._updateScrollbars();
            }
        });

        // Listen for updates to _contentSection's size, so we can match our internal Canvas' size
        Events.register(this._contentSection, "propertyChanged", (ev, data) => {
            if (data.property === "size") {
                console.log(`matching canvas to new size ${data.newValue} (${this._contentSection.size[1]})`);
                this._selfCanvas.width = data.newValue[0];
                this._selfCanvas.height = data.newValue[1];

                this._updateScrollbars();
            }
        });

        // Update scrollbar visibility and indicator location when children change
        Events.register(this, "childrenChanged", (ev, data) => {
            this._updateScrollbars();
        });
    }

    _updateScrollbars() {
        // Add or remove scroll bars based on virtual sizes
        if (this.verticalScrollbar.isChildOf(this) && this.getVirtualHeight() == this._contentSection.size[1]) {
            super.removeChild(this.verticalScrollbar);
            return;
        } else if (!this.verticalScrollbar.isChildOf(this) && this.getVirtualHeight() > this._contentSection.size[1])
            super.addChild(this.verticalScrollbar);

        // Calculate new vertical scroll bar location
        let scrollPct = Math.round(
            (this.verticalScrollLocation / (this.getVirtualHeight() - this._contentSection.size[1])) * 100
        );
        let totalRange = this.verticalScrollbar.height - INDICATOR_BAR_SIZE - BUTTON_HEIGHT * 2;
        let targetMargin = Math.floor((scrollPct / 100) * totalRange) || 0;

        this.verticalScrollbar.indicatorRect.margin = [0, targetMargin, 0, 0];

        // console.log(`scrollPct: ${scrollPct}`);
        // console.log(`targetMargin: ${this.verticalScrollbar.indicatorRect.margin}`);
    }

    buildVerticalScrollbar() {
        let scrollbar = factory.generateControl("Section", {
            contentDirection: ContentDirection.VERTICAL,
            halign: HAlign.RIGHT,
            hsizeTarget: [SizeTargetType.FIXED, BAR_SIZE],
            vsizeTarget: [SizeTargetType.FILL, null],
            backgroundColor: "bbbbbb",
            debugName: "verticalScrollbar"
        });

        let buttonStyles = { HOVERED: [["backgroundColor", "999999"]], DEPRESSED: [["backgroundColor", "777777"]] };

        let upButton = factory.generateControl(
            "IconButton",
            {
                imagePath: "up-filled",
                iconMargin: [3, 2, 3, 2],
                valign: VAlign.TOP,
                vsizeTarget: [SizeTargetType.FIXED, BUTTON_HEIGHT],
                halign: null,
                hsizeTarget: [SizeTargetType.FILL, null],
                action: btn =>
                    (this.verticalScrollLocation = Math.max(this.verticalScrollLocation - BUTTON_CLICK_DISTANCE, 0)),
                debugName: "upButton"
            },
            buttonStyles,
            null
        );
        scrollbar.addChild(upButton);

        let downButton = factory.generateControl(
            "IconButton",
            {
                imagePath: "down-filled",
                iconMargin: [3, 2, 3, 2],
                valign: VAlign.BOTTOM,
                vsizeTarget: [SizeTargetType.FIXED, BUTTON_HEIGHT],
                halign: null,
                hsizeTarget: [SizeTargetType.FILL, null],
                action: btn => {
                    let newLocation = Math.min(
                        this.verticalScrollLocation + BUTTON_CLICK_DISTANCE,
                        this.getVirtualHeight() - this.size[1]
                    );
                    this.verticalScrollLocation = newLocation;
                },
                debugName: "downButton"
            },
            buttonStyles,
            null
        );
        scrollbar.addChild(downButton);

        scrollbar.indicatorRect = factory.generateControl("Section", {
            margin: 0,
            valign: VAlign.TOP,
            vsizeTarget: [SizeTargetType.FIXED, INDICATOR_BAR_SIZE],
            backgroundColor: "dddddd",
            debugName: "indicatorRect"
        });
        scrollbar.addChild(scrollbar.indicatorRect);

        return scrollbar;
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
        if (this._contentSection.contentDirection == ContentDirection.VERTICAL) {
            return Math.max(
                this._contentSection.size[1],
                this._contentSection.children.reduce((val, item) => val + item.viewHeight, 0)
            );
        } else if (this._contentSection.contentDirection == ContentDirection.HORIZONTAL) {
            return this._contentSection.size[1];
        }
    }

    getVirtualWidth() {
        if (this.contentDirection == ContentDirection.HORIZONTAL) {
            return Math.max(
                this._contentSection.size[0],
                this._contentSection.children.reduce((val, item) => val + item.viewWidth, 0)
            );
        } else if (this.contentDirection == ContentDirection.VERTICAL) {
            return this._contentSection.size[0];
        }
    }

    //#region Method overrides
    addChild(newChild) {
        this._contentSection.children.push(newChild);
        this._contentSection.orderedChildren.push(newChild);

        // Use this with care
        newChild.__parent = this;

        // Alert subscribers to change in children
        this.dispatchEvent("childrenChanged", { action: "add", child: newChild });

        this.scheduleRender();
    }
    removeChild(child) {
        if (!child.isChildOf(this._contentSection)) return;

        this._contentSection.children.splice(this._contentSection.children.indexOf(child), 1);
        this._contentSection.orderedChildren.splice(this._contentSection.orderedChildren.indexOf(child), 1);

        // Use this with care
        child.__parent = null;

        // Handle edge case where the removing of this child makes current scroll location invalid
        this.verticalScrollLocation = Math.min(
            this.verticalScrollLocation,
            this.getVirtualHeight() - this._contentSection.size[1]
        );

        // Alert subscribers to change in children
        this.dispatchEvent("childrenChanged", { action: "remove", child: child });

        this.scheduleRender();
    }

    draw(context = App.Context, offset = [0, 0]) {
        // Clear content canvas before drawing
        this._selfContext.clearRect(0, 0, this._selfCanvas.width, this._selfCanvas.height);

        // Same as super.draw()
        if (this.background) this.background.draw(context, offset);

        // Draw scroll bar sections normally
        if (this.verticalScrollbar.isChildOf(this) && this.verticalScrollbar.visible)
            this.verticalScrollbar.draw(context, offset);
        if (this.horizontalScrollbar && this.horizontalScrollbar.visible)
            this.horizontalScrollbar.draw(context, offset);

        let positionOffset = [
            -this._arrangedPosition[0] - this.margin[0] - offset[0],
            -this._arrangedPosition[1] - this.margin[1] - offset[1]
        ];

        // Draw contentSection to separated canvas, providing the scrollLocation offsets
        this._contentSection.draw(this._selfContext, [
            positionOffset[0] - this.horizontalScrollLocation,
            positionOffset[1] - this.verticalScrollLocation
        ]);
        for (let child of this._contentSection.children) {
            child.scrollOffset = [this.horizontalScrollLocation, this.verticalScrollLocation];
        }

        // After all children are drawn to this canvas, draw our canvas onto parent canvas
        let scrollX = this.margin[0] + this._arrangedPosition[0] + offset[0];
        let scrollY = this.margin[1] + this._arrangedPosition[1] + offset[1];
        context.drawImage(this._selfCanvas, scrollX, scrollY);
        // console.log(
        //     `draw self canvas at (${scrollX}, ${scrollY}) with size (${this._selfCanvas.width}, ${this._selfCanvas.height})`
        // );
    }

    //#region Property overrides
    get size() {
        return super.size;
    }
    set size(newSize) {
        super.size = newSize;
        if (this.background) this.background.size = newSize;

        // This render can now determine the size and alignment of nested sections and elements
        this.scheduleRender();
    }

    get backgroundColor() {
        return super.backgroundColor;
    }
    set backgroundColor(newColor) {
        super.backgroundColor = newColor;
        if (this._contentSection) this._contentSection.backgroundColor = newColor;
    }
    //#endregion

    //#region Unique property definitions
    get horizontalScrollLocation() {
        return this._horizontalScrollLocation;
    }
    set horizontalScrollLocation(newLocation) {
        if (!Number.isInteger(newLocation))
            datalitError("propertySet", ["ScrollSection.horizontalScrollLocation", String(newLocation), "INT"]);
        if (newLocation > this.getVirtualWidth() - this._contentSection.size[0] || newLocation < 0)
            datalitError("propertySet", [
                "ScrollSection.horizontalScrollLocation",
                String(newLocation),
                `< ${this.getVirtualWidth() - this._contentSection.size[0]} && > 0`
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
        if (newLocation > this.getVirtualHeight() - this._contentSection.size[1] || newLocation < 0)
            datalitError("propertySet", [
                "ScrollSection.verticalScrollLocation",
                String(newLocation),
                `< ${this.getVirtualHeight() - this._contentSection.size[1]} && > 0`
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
