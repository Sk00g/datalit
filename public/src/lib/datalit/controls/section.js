import { App } from "../app.js";
import { Color, ContentDirection, HAlign, VAlign, MIN_SIZE } from "../enums.js";
import { datalitError } from "../errors.js";
import { DynamicControl } from "./dynamicControl.js";
import { Events } from "../events/events.js";
import { Rect } from "./rect.js";
import utils from "../utils.js";

export class Section extends DynamicControl {
    constructor(initialProperties = {}, withholdEvents = false) {
        super();

        this.childEventRegisters = {}; // Keep track of child event registrations
        this.isArranger = true;
        this.requiresRender = true;
        this.children = [];
        this.orderedChildren = []; // For zValue drawing

        // Default Control property values
        this.hfillTarget = MIN_SIZE;
        this.vfillTarget = MIN_SIZE;

        // Unique property definitions
        this._contentDirection = ContentDirection.VERTICAL;
        this._backgroundColor = Color.TRANSPARENT;
        this._borderColor = Color.BLACK;
        this._borderThickness = [0, 0, 0, 0];
        this.registerProperty("backgroundColor");
        this.registerProperty("borderColor");
        this.registerProperty("borderThickness", false, true, false, utils.compareSides);

        // Apply base theme before customized properties
        this.applyTheme("Section");

        this.updateProperties(initialProperties);

        // Will typically continue to withold events until child constructor sets = false
        // However, new Section() will sometimes be called directly
        this._withholdingEvents = withholdEvents;

        this.background = new Rect({
            fillColor: this.backgroundColor,
            size: this.size
        });
        if (this.borderColor) this.background.borderColor = this.borderColor;
        if (this.borderThickness) this.background.borderThickness = this.borderThickness;

        // Attach to Event system as a source for 'childrenChanged' events
        this.eventListeners.childrenChanged = [];
        Events.attachSource(this, ["childrenChanged"]);
    }

    isParentOf(child) {
        return this.children.indexOf(child) != -1;
    }

    getDescendents(includeSelf = true) {
        let kids = includeSelf ? [this] : [];
        for (let ctrl of this.children) {
            if (ctrl.isArranger) kids = kids.concat(ctrl.getDescendents());
            else kids.push(ctrl);
        }
        return kids;
    }

    scheduleRender() {
        this.requiresRender = true;
    }

    prerenderCheck(totalSpace) {
        // ContentDirection.FREE is always viable, just might not make sense
        if (this.contentDirection == ContentDirection.FREE) return;

        let alignProp = this.contentDirection == ContentDirection.HORIZONTAL ? "halign" : "valign";
        // Cannot have both Align.CENTER and Align.FILL in the same parent
        let fills = this.children.filter(ch => ch[alignProp] === HAlign.FILL);
        let centers = this.children.filter(ch => ch[alignProp] === HAlign.CENTER);
        if (fills.length > 0 && centers.length > 0)
            datalitError("invalidAlignment", [this.debugName, "Cannot have CENTER + FILL in same axis"]);

        // Multiple CENTER children cannot have a combined width/height of greater than totalSpace
        if (centers.length > 0) {
            if (this.contentDirection == ContentDirection.HORIZONTAL) {
                let combinedWidth = 0;
                for (let ctrl of centers) combinedWidth += ctrl.requestWidth(totalSpace[0], this.width);
                if (combinedWidth > totalSpace[0])
                    datalitError("invalidAlignment", [
                        this.debugName,
                        "Cannot have CENTER children with width sum > totalSpace[0]"
                    ]);
            } else if (this.contentDirection == ContentDirection.VERTICAL) {
                let combinedHeight = 0;
                for (let ctrl of centers) combinedHeight += ctrl.requestHeight(totalSpace[1], this.height);
                if (combinedHeight > totalSpace[1]) {
                    console.log(`combinedHeight: ${combinedHeight} | totalSpace[1]: ${totalSpace[1]}`);
                    datalitError("invalidAlignment", [
                        this.debugName,
                        "Cannot have CENTER children with height sum > totalSpace[1]"
                    ]);
                }
            }
        }
    }

    render() {
        if (this.children.length < 1) return;

        // console.log(`rendering section... ${this.debugName} (${this.children.length})`);
        App.GlobalState.RedrawRequired = true;

        let origins = [
            this._arrangedPosition[0] + this.margin[0],
            this._arrangedPosition[1] + this.margin[1],
            this._arrangedPosition[0] + this.margin[0] + this.size[0],
            this._arrangedPosition[1] + this.margin[1] + this.size[1]
        ];
        let totalSpace = [origins[2] - origins[0], origins[3] - origins[1]];

        this.prerenderCheck(totalSpace);

        // Set position and size of all child controls
        let fillChildren = null;
        let centeredChildren = null;
        let alignedChildren = null;
        switch (this.contentDirection) {
            case ContentDirection.FREE:
                for (let child of this.children) {
                    child.arrangePosition(this, [
                        origins[0] + child.localPosition[0],
                        origins[1] + child.localPosition[1]
                    ]);
                }
                break;
            case ContentDirection.HORIZONTAL:
                fillChildren = this.children.filter(child => child.halign == HAlign.FILL);
                centeredChildren = this.children.filter(child => child.halign == HAlign.CENTER);
                alignedChildren = this.children.filter(
                    child => child.halign != HAlign.CENTER && child.halign != HAlign.FILL
                );

                for (let child of alignedChildren) {
                    let totalSpace = [origins[2] - origins[0], origins[3] - origins[1]];
                    child.viewWidth = child.requestWidth(totalSpace[0], this.viewWidth);
                    child.viewHeight = child.requestHeight(totalSpace[1], this.viewHeight);

                    switch (child.halign) {
                        case HAlign.LEFT:
                            child.arrangePosition(this, [origins[0], -1]);
                            origins[0] += child.viewWidth;
                            break;
                        case HAlign.RIGHT:
                            child.arrangePosition(this, [origins[2] - child.viewWidth, -1]);
                            origins[2] -= child.viewWidth;
                            break;
                    }
                }

                // Now arrange center or fill children
                if (fillChildren.length > 0) {
                    let totalSpace = [origins[2] - origins[0], origins[3] - origins[1]];
                    // Evenly divide remaining width
                    let splitWidth = Math.floor(totalSpace[0] / fillChildren.length);
                    let remainder = totalSpace[0] - splitWidth * fillChildren.length;

                    for (let child of fillChildren) {
                        child.viewHeight = child.requestHeight(totalSpace[1], this.viewHeight);
                        let trueWidth = splitWidth;
                        if (remainder > 0) {
                            trueWidth = splitWidth + 1;
                            remainder -= 0;
                        }

                        child.viewWidth = trueWidth;
                        child.arrangePosition(this, [origins[0], -1]);
                        origins[0] += trueWidth;
                    }
                } else if (centeredChildren.length > 0) {
                    let totalSpace = [origins[2] - origins[0], origins[3] - origins[1]];
                    let widthSum = 0;
                    for (let child of centeredChildren) {
                        child.viewWidth = child.requestWidth(totalSpace[0], this.viewWidth);
                        child.viewHeight = child.requestHeight(totalSpace[1], this.viewHeight);
                        widthSum += child.viewWidth;
                    }
                    let space = totalSpace[0] - widthSum;
                    origins[0] += Math.floor(space / 2);
                    for (let child of centeredChildren) {
                        child.arrangePosition(this, [origins[0], -1]);
                        origins[0] += child.viewWidth;
                    }
                }

                // Vertical alignment of children in a ContentDirection.HORIZONTAL parent is isolated
                for (let child of this.children) {
                    switch (child.valign) {
                        case VAlign.CENTER:
                            let sp = Math.max(this.viewHeight - this.margin[1] - this.margin[3] - child.viewHeight, 0);
                            child.arrangePosition(this, [-1, origins[1] + Math.floor(sp / 2)]);
                            break;
                        case VAlign.TOP:
                        case VAlign.FILL:
                        case VAlign.STRETCH:
                            child.arrangePosition(this, [-1, origins[1]]);
                            break;
                        case VAlign.BOTTOM:
                            child.arrangePosition(this, [-1, origins[3] - child.viewHeight]);
                            break;
                            break;
                    }
                }
                break;
            case ContentDirection.VERTICAL:
                fillChildren = this.children.filter(child => child.valign == VAlign.FILL);
                centeredChildren = this.children.filter(child => child.valign == VAlign.CENTER);
                alignedChildren = this.children.filter(
                    child => child.valign != VAlign.CENTER && child.valign != VAlign.FILL
                );

                for (let child of alignedChildren) {
                    let totalSpace = [origins[2] - origins[0], origins[3] - origins[1]];
                    child.viewWidth = child.requestWidth(totalSpace[0], this.viewWidth);
                    child.viewHeight = child.requestHeight(totalSpace[1], this.viewHeight);

                    switch (child.valign) {
                        case VAlign.TOP:
                            child.arrangePosition(this, [-1, origins[1]]);
                            origins[1] += child.viewHeight;
                            break;
                        case VAlign.BOTTOM:
                            child.arrangePosition(this, [-1, origins[3] - child.viewHeight]);
                            origins[3] -= child.viewHeight;
                            break;
                    }
                }

                // Now arrange center or fill children
                if (fillChildren.length > 0) {
                    let totalSpace = [origins[2] - origins[0], origins[3] - origins[1]];
                    // Evenly divide remaining width
                    let splitHeight = Math.floor(totalSpace[1] / fillChildren.length);

                    for (let child of fillChildren) {
                        child.viewHeight = splitHeight;
                        child.viewWidth = child.requestWidth(totalSpace[0], this.viewWidth);
                        child.arrangePosition(this, [-1, origins[1]]);
                        origins[1] += splitHeight;
                    }
                } else if (centeredChildren.length > 0) {
                    let totalSpace = [origins[2] - origins[0], origins[3] - origins[1]];
                    let heightSum = 0;
                    for (let child of centeredChildren) {
                        child.viewWidth = child.requestWidth(totalSpace[0], this.viewWidth);
                        child.viewHeight = child.requestHeight(totalSpace[1], this.viewHeight);
                        heightSum += child.viewHeight;
                    }
                    let space = totalSpace[1] - heightSum;
                    origins[1] += Math.floor(space / 2);
                    for (let child of centeredChildren) {
                        child.arrangePosition(this, [-1, origins[1]]);
                        origins[1] += child.viewHeight;
                    }
                }

                // Horizontal alignment of children in a ContentDirection.VERTICAL parent is isolated
                for (let child of this.children) {
                    switch (child.halign) {
                        case HAlign.CENTER:
                            let space = Math.max(this.viewWidth - this.margin[0] - this.margin[2] - child.viewWidth, 0);
                            child.arrangePosition(this, [origins[0] + Math.floor(space / 2), -1]);
                            break;
                        case HAlign.LEFT:
                        case HAlign.FILL:
                        case HAlign.STRETCH:
                            child.arrangePosition(this, [origins[0], -1]);
                            break;
                        case HAlign.RIGHT:
                            child.arrangePosition(this, [origins[2] - child.viewWidth, -1]);
                            break;
                    }
                }
                break;
        }

        this.requiresRender = false;
    }

    addChild(newChild) {
        this.children.push(newChild);
        this.orderedChildren.push(newChild);
        this.orderedChildren.sort((a, b) => {
            if (a.zValue > b.zValue) return 1;
            else if (a.zValue < b.zValue) return -1;
            else return 0;
        });

        // Listen for zValue changes to resort
        this.childEventRegisters[newChild] = Events.register(newChild, "propertyChanged", (event, data) => {
            if (data.property == "zValue") {
                this.orderedChildren.sort((a, b) => {
                    if (a.zValue > b.zValue) return 1;
                    else if (a.zValue < b.zValue) return -1;
                    else return 0;
                });
            }
        });

        // Use this with care
        newChild.__parent = this;

        // Alert subscribers to change in children
        this.dispatchEvent("childrenChanged", { action: "add", child: newChild });

        this.scheduleRender();
    }
    removeChild(child) {
        if (this.children.indexOf(child) == -1) return;

        this.children.splice(this.children.indexOf(child), 1);
        this.orderedChildren.splice(this.orderedChildren.indexOf(child), 1);
        Events.unregister(this.childEventRegisters[child]);

        // Use this with care
        child.__parent = null;

        // Alert subscribers to change in children
        this.dispatchEvent("childrenChanged", { action: "remove", child: child });

        this.scheduleRender();
    }

    //#region Method overrides
    arrangePosition(arranger, newPosition) {
        if (utils.comparePoints(newPosition, this._arrangedPosition)) return;

        super.arrangePosition(arranger, newPosition);
        if (this.background)
            this.background.arrangePosition(arranger, [
                newPosition[0] != -1 ? newPosition[0] + this.margin[0] : -1,
                newPosition[1] != -1 ? newPosition[1] + this.margin[1] : -1
            ]);

        this.scheduleRender();
    }

    // Only Sections should have [h|v]fillTarget == MIN_SIZE, meaning minimum size based on child elements
    requestWidth(availableWidth, parentWidth) {
        if (this.halign == HAlign.FILL) return availableWidth;
        else if (this.halign == HAlign.STRETCH) return parentWidth;
        else if (this.hfillTarget == MIN_SIZE) {
            // If we have ContentDirection.VERTICAL, just get largest child width
            if (this.contentDirection == ContentDirection.VERTICAL) {
                let largestWidth = 0;
                for (let child of this.children) {
                    let cWidth = child.requestWidth(availableWidth, this.viewWidth);
                    if (cWidth > largestWidth) largestWidth = cWidth;
                }
                return largestWidth + this.margin[0] + this.margin[2];
            } // Otherwise we have to get the combination of child widths
            else if (this.contentDirection == ContentDirection.HORIZONTAL) {
                let widthSum = 0;
                for (let child of this.children) widthSum += child.requestWidth(availableWidth, this.viewWidth);
                return widthSum + this.margin[0] + this.margin[2];
            }
        } else if (this.hfillTarget != null) return Math.floor(availableWidth * this.hfillTarget);
        else if (this.contentDirection == ContentDirection.FREE) return this.viewWidth;
        else return this.viewWidth;
    }

    requestHeight(availableHeight, parentHeight) {
        if (this.valign == VAlign.FILL) return availableHeight;
        else if (this.valign == VAlign.STRETCH) return parentHeight;
        else if (this.vfillTarget == -1) {
            // If we have ContentDirection.HORIZONTAL, just get largest child height
            if (this.contentDirection == ContentDirection.HORIZONTAL) {
                let largestHeight = 0;
                for (let child of this.children) {
                    let cHeight = child.requestHeight(availableHeight, this.viewHeight);
                    if (cHeight > largestHeight) largestHeight = cHeight;
                }
                return largestHeight + this.margin[1] + this.margin[3];
            } // Otherwise we have to get the combination of child heights
            else if (this.contentDirection == ContentDirection.VERTICAL) {
                let heightSum = 0;
                for (let child of this.children) heightSum += child.requestHeight(availableHeight, this.viewHeight);
                return heightSum + this.margin[1] + this.margin[3];
            }
        } else if (this.vfillTarget != null) return Math.floor(availableHeight * this.vfillTarget);
        else if (this.contentDirection == ContentDirection.FREE) return this.viewHeight;
        else return this.viewHeight;
    }
    //#endregion

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
    //#endregion

    //#region Unique Properties
    get backgroundColor() {
        return this._backgroundColor;
    }
    set backgroundColor(newColor) {
        if (typeof utils.hexColor(newColor) != "string")
            datalitError("propertySet", ["Section.backgroundColor", String(newColor), "string"]);

        this._backgroundColor = newColor;
        if (this.background) this.background.fillColor = this._backgroundColor;
        this.notifyPropertyChange("backgroundColor");
    }

    get borderColor() {
        return this._borderColor;
    }
    set borderColor(newColor) {
        if (typeof utils.hexColor(newColor) != "string") {
            datalitError("propertySet", ["Section.borderColor", String(newColor), "string"]);
        }

        this._borderColor = newColor;
        if (this.background) this.background.borderColor = this._borderColor;
        this.notifyPropertyChange("borderColor");
    }

    get borderThickness() {
        return this._borderThickness;
    }
    set borderThickness(thickness) {
        if (typeof thickness == "number") {
            if (!Number.isInteger(thickness) || thickness < 0)
                datalitError("propertySet", ["Section.borderThickness", String(thickness), "int or LIST of 4 int"]);
            this._borderThickness = [thickness, thickness, thickness, thickness];
        } else {
            if (typeof thickness != "object" || thickness.length != 4)
                datalitError("propertySet", ["Section.borderThickness", String(thickness), "int LIST of 4 int"]);
            for (let i = 0; i < 4; i++)
                if (!Number.isInteger(thickness[i]) && thickness[i] >= 0)
                    datalitError("propertySet", ["Section.borderThickness", String(thickness), "int LIST of 4 int"]);

            this._borderThickness = thickness;
        }
        if (this.background) this.background.borderThickness = this._borderThickness;
        this.notifyPropertyChange("borderThickness");
    }

    get contentDirection() {
        return this._contentDirection;
    }
    set contentDirection(dir) {
        if (!ContentDirection.hasOwnProperty(dir))
            datalitError("propertySet", ["Section.contentDirection", String(dir), "ContentDirection"]);

        this._contentDirection = dir;
    }
    //#endregion

    update(elapsed) {
        super.update(elapsed);

        // Only render once per update loop
        if (this.requiresRender) this.render();

        for (let child of this.children) {
            child.update(elapsed);
        }
    }

    draw(context = App.Context, offset = [0, 0]) {
        if (this.background) this.background.draw(context, offset);

        for (let child of this.orderedChildren) {
            if (child.visible) {
                child.draw(context, offset);
            }
        }
    }
}
