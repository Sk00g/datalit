import enums from "../enums.js";
import { App } from "../app.js";
import { Control } from "./control.js";
import { Rect } from "./rect.js";
import { datalitError } from "../errors.js";

export class Section extends Control {
    constructor(initialProperties = {}) {
        // console.log("Section constructor");
        super();

        // Unique property definitions
        this._flowType = enums.FlowType.VERTICAL;
        this._sizeTarget = enums.SizeTarget.MINIMUM;
        this._contentAlignment = enums.Align.CENTER;
        this._backgroundColor = App.GlobalState.DefaultBackground;
        this._borderColor = null;
        this._borderThickness = [0, 0, 0, 0];

        this.registerProperty("sizeTarget");
        this.registerProperty("contentAlignment");
        this.registerProperty("backgroundColor");
        this.registerProperty("borderColor");
        this.registerProperty("borderThickness");

        this.isArranger = true;
        this.requiresRender = true;
        this.children = [];

        // Sections default differently than regular controls
        this.align = enums.Align.LEFT;

        this.updateProperties(initialProperties);

        this.background = new Rect({ fillColor: this.backgroundColor });
        if (this.borderColor) this.background.borderColor = this.borderColor;
        if (this.borderThickness) this.background.borderThickness = this.borderThickness;
    }

    //#region Unique Properties
    get backgroundColor() {
        return this._backgroundColor;
    }
    set backgroundColor(newColor) {
        if (typeof newColor != "string")
            datalitError("propertySet", ["Section.backgroundColor", String(newColor), "string"]);

        this._backgroundColor = newColor;
    }
    get borderColor() {
        return this._borderColor;
    }
    set borderColor(newColor) {
        if (typeof newColor != "string") {
            datalitError("propertySet", ["Section.borderColor", String(newColor), "string"]);
        }

        this._borderColor = newColor;
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
    }
    get sizeTarget() {
        return this._sizeTarget;
    }
    set sizeTarget(newTarget) {
        if (newTarget < 0 || (newTarget >= 1.0 && !enums.SizeTarget.hasOwnProperty(newTarget)))
            datalitError("propertySet", ["Section.sizeTarget", String(newTarget), "enums.SizeTarget or 0 -> 1.0"]);

        this._sizeTarget = newTarget;
    }

    get contentAlignment() {
        return this._contentAlignment;
    }
    set contentAlignment(newAlign) {
        if (!enums.Align.hasOwnProperty(newAlign))
            datalitError("propertySet", ["Section.contentAlignment", String(newAlign), "enums.Align"]);

        this._contentAlignment = newAlign;
    }

    get flowType() {
        return this._flowType;
    }
    set flowType(newType) {
        if (!enums.FlowType.hasOwnProperty(newType))
            datalitError("propertySet", ["Section.flowType", String(newType), "enums.FlowType"]);

        this._flowType = newType;
    }
    //#endregion

    // Overridden properties
    get viewingRect() {
        return [
            this._arrangedPosition[0] - this.margin[0] - this.borderThickness[0],
            this._arrangedPosition[1] - this.margin[1] - this.borderThickness[1],
            Math.max(
                0,
                this.size[0] + this.margin[0] + this.margin[2] + this.borderThickness[0] + this.borderThickness[2]
            ),
            Math.max(
                0,
                this.size[1] + this.margin[1] + this.margin[3] + this.borderThickness[1] + this.borderThickness[3]
            )
        ];
    }

    scheduleRender() {
        this.requiresRender = true;
    }

    renderSubsections() {
        let sectionList = this.children.filter(child => child instanceof Section && child.visible);
        if (sectionList.filter(sec => sec.align == enums.Align.FILL).length > 1) {
            throw new Error("Sections can have max one Section with align == enums.Align.FILL");
        }

        // console.log(`rendering page subsections... (${sectionList.length})`);

        let freeOrigins = [
            this._arrangedPosition[0] + this.margin[0] + this.borderThickness[0],
            this._arrangedPosition[1] + this.margin[1] + this.borderThickness[1],
            this.size[0] - this.margin[2] - this.borderThickness[2],
            this.size[1] - this.margin[3] - this.borderThickness[3]
        ];
        let totalSpace = [freeOrigins[2] - freeOrigins[0], freeOrigins[3] - freeOrigins[1]];

        for (let i = 0; i < sectionList.length; i++) {
            let sec = sectionList[i];
            // Don't calculate the FILL section until other sectionsh have been allotted
            if (sec.align == enums.Align.FILL) continue;

            let requestedSize = sec.calculateViewsize(totalSpace);
            if (sec.flowType == enums.FlowType.HORIZONTAL) {
                switch (sec.align) {
                    case enums.Align.TOP:
                        sec.arrangePosition(this, [freeOrigins[0], freeOrigins[1]]);
                        sec.size = [freeOrigins[2] - freeOrigins[0], requestedSize[1]];
                        freeOrigins[1] = requestedSize[1];
                        break;
                    case enums.Align.BOTTOM:
                        sec.arrangePosition(this, [freeOrigins[0], freeOrigins[3] - requestedSize[1]]);
                        sec.size = [freeOrigins[2] - freeOrigins[0], requestedSize[1]];
                        freeOrigins[3] -= requestedSize[1];
                        break;
                }
            } else if (sec.flowType == enums.FlowType.VERTICAL) {
                switch (sec.align) {
                    case enums.Align.LEFT:
                        sec.arrangePosition(this, [freeOrigins[0], freeOrigins[1]]);
                        sec.size = [requestedSize[0], freeOrigins[3] - freeOrigins[1]];
                        freeOrigins[0] = requestedSize[0];
                        break;
                    case enums.Align.RIGHT:
                        sec.arrangePosition(this, [freeOrigins[2] - requestedSize[0], freeOrigins[1]]);
                        sec.size = [requestedSize[0], freeOrigins[3] - freeOrigins[1]];
                        freeOrigins[2] -= requestedSize[0];
                        break;
                }
            }
        }

        // Arrange the align.FILL section
        let fillSection = sectionList.find(sec => sec.align == enums.Align.FILL);
        if (fillSection) {
            fillSection.arrangePosition(this, [freeOrigins[0], freeOrigins[1]]);
            fillSection.size = [freeOrigins[2] - freeOrigins[0], freeOrigins[3] - freeOrigins[1]];
        }
    }

    render() {
        if (this.children.length < 1) return;

        // console.log(`rendering section... (${this.children.length})`);
        this.requiresRender = false;

        this.renderSubsections();

        var origins = [
            this._arrangedPosition[0] + this.margin[0],
            this._arrangedPosition[1] + this.margin[1],
            this._arrangedPosition[0] + this.size[0] - this.margin[2],
            this._arrangedPosition[1] + this.size[1] - this.margin[3]
        ];

        // Set position of all child controls except sections
        if (this.flowType == enums.FlowType.HORIZONTAL) {
            for (let child of this.children) {
                switch (child.align) {
                    case enums.Align.TOP:
                        child.arrangePosition(this, [-1, origins[1]]);
                        break;
                    case enums.Align.BOTTOM:
                        child.arrangePosition(this, [-1, origins[3] - Math.min(child.viewHeight, this.size[1])]);
                        break;
                    case enums.Align.CENTER:
                        let space = Math.max(this.size[1] - this.margin[1] - this.margin[3] - child.viewHeight, 0);
                        child.arrangePosition(this, [-1, origins[1] + Math.floor(space / 2)]);
                        break;
                }
            }

            switch (this.contentAlignment) {
                case enums.Align.LEFT:
                    for (let child of this.children) {
                        child.arrangePosition(this, [origins[0], -1]);
                        origins[0] += child.viewWidth;
                    }
                    break;
                case enums.Align.RIGHT:
                    var origin = 0;
                    for (let child of this.children) {
                        let childPosition = [origins[2] - child.viewWidth, -1];
                        child.arrangePosition(this, childPosition);
                        origins[2] -= child.viewWidth;
                    }
                    break;
                case enums.Align.CENTER:
                    let widths = this.children.map(ch => ch.viewWidth);
                    let totalWidth = widths.reduce((total, amount) => total + amount);
                    var origin = origins[0] + Math.floor((this.size[0] - totalWidth) / 2);

                    for (let child of this.children) {
                        child.arrangePosition(this, [origin, -1]);
                        origin += child.viewWidth;
                    }
                    break;
            }
        } else if (this.flowType == enums.FlowType.VERTICAL) {
            for (let child of this.children) {
                switch (child.align) {
                    case enums.Align.LEFT:
                        child.arrangePosition(this, [origins[0], -1]);
                        break;
                    case enums.Align.RIGHT:
                        child.arrangePosition(this, [origins[2] - Math.min(child.viewWidth, this.size[0]), -1]);
                        break;
                    case enums.Align.CENTER:
                        let space = Math.max(this.size[0] - this.margin[0] - this.margin[2] - child.viewWidth, 0);
                        child.arrangePosition(this, origins[0] + [Math.floor(space / 2), -1]);
                        break;
                }
            }

            switch (this.contentAlignment) {
                case enums.Align.TOP:
                    for (let child of this.children) {
                        child.arrangePosition(this, [-1, origins[1]]);
                        origins[1] += child.viewHeight;
                    }
                    break;
                case enums.Align.BOTTOM:
                    for (let child of this.children) {
                        let childPosition = [-1, origins[3] - child.viewHeight];
                        child.arrangePosition(this, childPosition);
                        origin[3] -= child.viewHeight;
                    }
                    break;
                case enums.Align.CENTER:
                    let heights = this.children.map(ch => ch.viewHeight);
                    let totalHeight = heights.reduce((total, amount) => total + amount);
                    var origin = origins[1] + Math.floor((this.size[1] - totalHeight) / 2);

                    for (let child of this.children) {
                        child.arrangePosition(this, [-1, origin]);
                        origin += child.viewHeight;
                    }
                    break;
            }
        }
    }

    calculateViewsize(availableSpace) {
        let requestedSize = [0, 0];

        if (this.flowType == enums.FlowType.HORIZONTAL) {
            if (this.sizeTarget == enums.SizeTarget.MINIMUM) {
                let largestHeight = 0;
                for (let child of this.children) {
                    if (child.viewHeight > largestHeight) {
                        largestHeight = child.viewHeight;
                    }
                }
                requestedSize = [
                    availableSpace[0],
                    largestHeight + this.margin[1] + this.margin[3] + this.borderThickness[0] + this.borderThickness[2]
                ];
            } else {
                // sizeTarget is a float value between 0 and 1
                requestedSize = [availableSpace[0], Math.floor(this.sizeTarget * availableSpace[1])];
            }
        } else if (this.flowType == enums.FlowType.VERTICAL) {
            if (this.sizeTarget == enums.SizeTarget.MINIMUM) {
                let largestWidth = 0;
                for (let child of this.children) {
                    if (child.viewWidth > largestWidth) {
                        largestWidth = child.viewWidth;
                    }
                }
                requestedSize = [
                    largestWidth + this.margin[0] + this.margin[2] + this.borderThickness[1] + this.borderThickness[3],
                    availableSpace[1]
                ];
            } else {
                requestedSize = [Math.floor(this.sizeTarget * availableSpace[0]), availableSpace[1]];
            }
        }

        return requestedSize;
    }

    get size() {
        return this._size;
    }
    set size(newSize) {
        super.size = newSize;
        this.background.size = newSize;

        // This render can now determine the size and alignment of nested sections and elements
        this.scheduleRender();
    }

    arrangePosition(arranger, newPosition) {
        super.arrangePosition(arranger, newPosition);
        this.background.arrangePosition(arranger, newPosition);

        this.scheduleRender();
    }

    addChild(newChild) {
        this.children.push(newChild);
        this.scheduleRender();
    }
    removeChild(child) {
        this.children.splice(this.children.indexOf(child), 1);
        this.scheduleRender();
    }

    update(elapsed) {
        super.update(elapsed);

        // Only render once per update loop
        if (this.requiresRender) this.render();

        for (let child of this.children) {
            child.update(elapsed);
        }
    }

    draw() {
        this.background.draw();

        for (let child of this.children) {
            if (child.visible) {
                child.draw();
            }
        }
    }
}
