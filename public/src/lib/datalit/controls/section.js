import { App } from "../app.js";
import { Color, ContentDirection, HAlign, VAlign, SizeTargetType } from "../enums.js";
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

        // Control property defaults
        this._halign = null;
        this._valign = null;

        // Unique property definitions
        this._contentDirection = ContentDirection.VERTICAL;
        this._backgroundColor = Color.TRANSPARENT;
        this._borderColor = Color.BLACK;
        this._borderThickness = [0, 0, 0, 0];
        this._hsizeTarget = [SizeTargetType.FILL, 0];
        this._vsizeTarget = [SizeTargetType.FILL, 0];
        this.registerProperty("backgroundColor");
        this.registerProperty("borderColor");
        this.registerProperty("borderThickness", false, true, false, utils.compareSides);
        this.registerProperty("hsizeTarget", true, true, false, utils.compareSides);
        this.registerProperty("vsizeTarget", true, true, false, utils.compareSides);

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
        // For redraw purposes
        this.background.__parent = this;
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

    prerenderCheck(allocatedSpace) {
        // ContentDirection.FREE is always viable, just might not make sense
        if (this.contentDirection == ContentDirection.FREE) return;

        let alignProp = this.contentDirection == ContentDirection.HORIZONTAL ? "halign" : "valign";
        let sizeTargetProp = this.contentDirection == ContentDirection.HORIZONTAL ? "hsizeTarget" : "vsizeTarget";
        // Cannot have both Align.CENTER and SizeTargetType.FILL in the same parent
        let fills = this.children.filter(ch => ch.isArranger && ch[sizeTargetProp][0] === SizeTargetType.FILL);
        let centers = this.children.filter(ch => ch[alignProp] === HAlign.CENTER);
        if (fills.length > 0 && centers.length > 0)
            datalitError("invalidAlignment", [this.debugName, "Cannot have CENTER + FILL in same axis"]);

        // align can't be null when SizeTargetType != FILL
        if (this.hsizeTarget[0] !== SizeTargetType.FILL && this.halign == null)
            datalitError("invalidAlignment", [
                this.debugName,
                `Must have halign (${this.halign}) unless Type (${this.hsizeTarget[0]}) is FILL`
            ]);
        if (this.vsizeTarget[0] !== SizeTargetType.FILL && this.valign == null)
            datalitError("invalidAlignment", [this.debugName, "Must have valign unless Type is FILL"]);

        // align must be null when SizeTargetType == FILL
        if (this.hsizeTarget[0] === SizeTargetType.FILL && this.halign !== null)
            datalitError("invalidAlignment", [this.debugName, "halign must be null when Type is FILL"]);
        if (this.vsizeTarget[0] === SizeTargetType.FILL && this.valign !== null)
            datalitError("invalidAlignment", [this.debugName, "valign must be null when Type is FILL"]);

        // Multiple CENTER children cannot have a combined width/height of greater than allocatedSpace
        if (centers.length > 0) {
            if (this.contentDirection == ContentDirection.HORIZONTAL) {
                let combinedWidth = 0;
                for (let ctrl of centers)
                    combinedWidth += ctrl.isArranger ? ctrl.requestWidth(allocatedSpace[0]) : ctrl.viewWidth;
                if (combinedWidth > allocatedSpace[0])
                    datalitError("invalidAlignment", [
                        this.debugName,
                        "Cannot have CENTER children with width sum > allocatedSpace[0]"
                    ]);
            } else if (this.contentDirection == ContentDirection.VERTICAL) {
                let combinedHeight = 0;
                for (let ctrl of centers)
                    combinedHeight += ctrl.isArranger ? ctrl.requestHeight(allocatedSpace[1]) : ctrl.viewHeight;
                if (combinedHeight > allocatedSpace[1]) {
                    console.log(`combinedHeight: ${combinedHeight} | allocatedSpace[1]: ${allocatedSpace[1]}`);
                    datalitError("invalidAlignment", [
                        this.debugName,
                        "Cannot have CENTER children with height sum > allocatedSpace[1]"
                    ]);
                }
            }
        }
    }

    render() {
        console.log(`rendering section '${this.debugName}' (${this.children.length})`);
        if (this.children.length < 1) {
            this.prerenderCheck(null);
            this.requiresRender = false;
            return;
        }

        // If page is being rendered, redraw everything
        if (this.isPage) App.GlobalState.RedrawRequired = true;
        else App.addDrawTarget(this);

        // Designate the space available for child Controls
        let origins = [
            this._arrangedPosition[0] + this.margin[0],
            this._arrangedPosition[1] + this.margin[1],
            this._arrangedPosition[0] + this.margin[0] + this.size[0],
            this._arrangedPosition[1] + this.margin[1] + this.size[1]
        ];

        // Ensure this Section has valid properties for arrangement
        let availableSpace = [origins[2] - origins[0], origins[3] - origins[1]];
        this.prerenderCheck(availableSpace);

        // ContentDirection.FREE allocation is simple
        if (this.contentDirection == ContentDirection.FREE) {
            for (let child of this.children) {
                child.arrangePosition(this, [origins[0] + child.localPosition[0], origins[1] + child.localPosition[1]]);
            }
            this.requiresRender = false;
            return;
        }

        // Using available space, set position and size of direct children
        let fillChildren = null;
        let centeredChildren = null;
        let alignedChildren = null;
        if (this.contentDirection == ContentDirection.HORIZONTAL) {
            // Manage children in order: ALIGN -> CENTER -> FILL
            alignedChildren = this.children.filter(
                ch => ch.halign == HAlign.CENTER || ch.halign == HAlign.LEFT || ch.halign == HAlign.RIGHT
            );
            centeredChildren = this.children.filter(child => child.halign == HAlign.CENTER);
            fillChildren = this.children.filter(ch => ch.isArranger && ch.hsizeTarget[0] == SizeTargetType.FILL);

            // Split up x-axis among aligned children
            for (let child of alignedChildren) {
                // Re-calculated after each allocation
                let remainingSpace = [origins[2] - origins[0], origins[3] - origins[1]];

                // If the child is an Arranger, gather and allocate its width specification
                if (child.isArranger) {
                    child.viewWidth = child.requestWidth(remainingSpace[0]);
                    child.viewHeight = child.requestHeight(remainingSpace[1]);
                }

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

            // Now arrange center or fill children (all FILL children are Arrangers)
            if (fillChildren.length > 0) {
                let remainingSpace = [origins[2] - origins[0], origins[3] - origins[1]];
                // Evenly divide remaining width
                let splitWidth = Math.floor(remainingSpace[0] / fillChildren.length);
                let remainder = remainingSpace[0] - splitWidth * fillChildren.length;

                for (let child of fillChildren) {
                    child.viewHeight = child.requestHeight(remainingSpace[1]);

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
                let remainingSpace = [origins[2] - origins[0], origins[3] - origins[1]];
                let widthSum = 0;
                for (let child of centeredChildren) {
                    if (child.isArranger) {
                        child.viewWidth = child.requestWidth(remainingSpace[0]);
                        child.viewHeight = child.requestHeight(remainingSpace[1]);
                    }
                    widthSum += child.viewWidth;
                }
                let space = remainingSpace[0] - widthSum;
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
                        child.arrangePosition(this, [-1, origins[1]]);
                        break;
                    case VAlign.BOTTOM:
                        child.arrangePosition(this, [-1, origins[3] - child.viewHeight]);
                        break;
                    // Null valign means SizeTargetType == FILL
                    case null:
                        child.arrangePosition(this, [-1, origins[1]]);
                        break;
                }
            }
        } else if (this.contentDirection == ContentDirection.VERTICAL) {
            // Manage children in order: ALIGN -> CENTER -> FILL
            alignedChildren = this.children.filter(
                ch => ch.valign == VAlign.CENTER || ch.valign == VAlign.TOP || ch.valign == VAlign.BOTTOM
            );
            centeredChildren = this.children.filter(child => child.valign == VAlign.CENTER);
            fillChildren = this.children.filter(ch => ch.isArranger && ch.vsizeTarget[0] == SizeTargetType.FILL);

            // Split up y-axis among aligned children
            for (let child of alignedChildren) {
                // Re-calculated after each allocation
                let remainingSpace = [origins[2] - origins[0], origins[3] - origins[1]];

                // If the child is an Arranger, gather and allocate its width specification
                if (child.isArranger) {
                    child.viewWidth = child.requestWidth(remainingSpace[0]);
                    child.viewHeight = child.requestHeight(remainingSpace[1]);
                }

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

            // Now arrange center or fill children (all FILL children are Arrangers)
            if (fillChildren.length > 0) {
                let remainingSpace = [origins[2] - origins[0], origins[3] - origins[1]];
                // Evenly divide remaining height
                let splitHeight = Math.floor(remainingSpace[1] / fillChildren.length);

                for (let child of fillChildren) {
                    child.viewHeight = splitHeight;
                    child.viewWidth = child.requestWidth(remainingSpace[0]);
                    child.arrangePosition(this, [-1, origins[1]]);
                    origins[1] += splitHeight;
                }
            } else if (centeredChildren.length > 0) {
                let remainingSpace = [origins[2] - origins[0], origins[3] - origins[1]];
                let heightSum = 0;
                for (let child of centeredChildren) {
                    if (child.isArranger) {
                        child.viewWidth = child.requestWidth(remainingSpace[0]);
                        child.viewHeight = child.requestHeight(remainingSpace[1]);
                    }
                    heightSum += child.viewHeight;
                }
                let space = remainingSpace[1] - heightSum;
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
                        child.arrangePosition(this, [origins[0], -1]);
                        break;
                    case HAlign.RIGHT:
                        child.arrangePosition(this, [origins[2] - child.viewWidth, -1]);
                        break;
                    // Null valign means SizeTargetType == FILL
                    case null:
                        child.arrangePosition(this, [origins[0], -1]);
                        break;
                }
            }
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
        Events.unregister(child, "propertyChanged", this.childEventRegisters[child]);

        // Use this with care
        child.__parent = null;

        // Alert subscribers to change in children
        this.dispatchEvent("childrenChanged", { action: "remove", child: child });

        this.scheduleRender();
    }

    _calculateMinimumWidth(available) {
        // If we have ContentDirection.VERTICAL, just get largest child width
        if (this.contentDirection == ContentDirection.VERTICAL) {
            let largestWidth = 0;
            for (let child of this.children) {
                let cWidth = child.isArranger ? child.requestWidth(available) : child.viewWidth;
                if (cWidth > largestWidth) largestWidth = cWidth;
            }
            return largestWidth + this.margin[0] + this.margin[2];
        } // Otherwise we have to get the combination of child widths
        else if (this.contentDirection == ContentDirection.HORIZONTAL) {
            let widthSum = 0;
            for (let child of this.children)
                widthSum += child.isArranger ? child.requestWidth(available) : child.viewWidth;
            return widthSum + this.margin[0] + this.margin[2];
        }
    }

    _calculateMinimumHeight(available) {
        // If we have ContentDirection.HORIZONTAL, just get largest child height
        if (this.contentDirection == ContentDirection.HORIZONTAL) {
            let largestHeight = 0;
            for (let child of this.children) {
                let cHeight = child.isArranger ? child.requestHeight(available) : child.viewHeight;
                if (cHeight > largestHeight) largestHeight = cHeight;
            }
            return largestHeight + this.margin[1] + this.margin[3];
        } // Otherwise we have to get the combination of child heights
        else if (this.contentDirection == ContentDirection.VERTICAL) {
            let heightSum = 0;
            for (let child of this.children)
                heightSum += child.isArranger ? child.requestHeight(available) : child.viewHeight;
            return heightSum + this.margin[1] + this.margin[3];
        }
    }

    requestWidth(availableWidth) {
        switch (this.hsizeTarget[0]) {
            case SizeTargetType.MIN:
                return this._calculateMinimumWidth(availableWidth);
            case SizeTargetType.FILL:
                return availableWidth;
            case SizeTargetType.PERCENT:
                return Math.floor(availableWidth * this.hsizeTarget[1]);
            case SizeTargetType.FIXED:
                return this.hsizeTarget[1] + this.margin[0] + this.margin[2];
        }
    }

    requestHeight(availableHeight) {
        switch (this.vsizeTarget[0]) {
            case SizeTargetType.MIN:
                return this._calculateMinimumHeight(availableHeight);
            case SizeTargetType.FILL:
                return availableHeight;
            case SizeTargetType.PERCENT:
                return Math.floor(availableHeight * this.vsizeTarget[1]);
            case SizeTargetType.FIXED:
                return this.vsizeTarget[1] + this.margin[1] + this.margin[3];
        }
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

    get hsizeTarget() {
        return this._hsizeTarget;
    }
    set hsizeTarget(newTarget) {
        if (!SizeTargetType.hasOwnProperty(newTarget[0]))
            datalitError("propertySet", ["Section.sizeTarget", String(newTarget), "SizeTargetType"]);
        else if (newTarget[0] == SizeTargetType.FIXED && !Number.isInteger(newTarget[1]))
            datalitError("propertySet", ["Section.sizeTarget", String(newTarget), "FIXED -> INT"]);
        else if (newTarget[0] == SizeTargetType.PERCENT && (newTarget[1] <= 0 || newTarget[1] >= 1.0))
            datalitError("propertySet", ["Section.sizeTarget", String(newTarget), "PERCENT -> 0 - 1.0"]);

        this._hsizeTarget = newTarget;
        this.notifyPropertyChange("hsizeTarget");
    }

    get vsizeTarget() {
        return this._vsizeTarget;
    }
    set vsizeTarget(newTarget) {
        if (!SizeTargetType.hasOwnProperty(newTarget[0]))
            datalitError("propertySet", ["Section.sizeTarget", String(newTarget), "SizeTargetType"]);
        else if (newTarget[0] == SizeTargetType.FIXED && !Number.isInteger(newTarget[1]))
            datalitError("propertySet", ["Section.sizeTarget", String(newTarget), "FIXED -> INT"]);
        else if (newTarget[0] == SizeTargetType.PERCENT && (newTarget[1] <= 0 || newTarget[1] >= 1.0))
            datalitError("propertySet", ["Section.sizeTarget", String(newTarget), "PERCENT -> 0 - 1.0"]);

        this._vsizeTarget = newTarget;
        this.notifyPropertyChange("vsizeTarget");
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
        // console.log(`drawing section ${this.debugName}`);
        if (this.background) this.background.draw(context, offset);

        for (let child of this.orderedChildren) {
            if (child.visible) {
                child.draw(context, offset);
            }
        }
    }
}
