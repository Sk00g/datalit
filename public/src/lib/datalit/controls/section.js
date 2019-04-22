import enums from "../enums.js";
import { App } from "../app.js";
import { Control } from "./control.js";
import { Rect } from "./rect.js";

export class Section extends Control {
    constructor(initialProperties = {}) {
        // console.log("Section constructor");
        super();

        // Unique property definitions
        this._flowType = enums.FlowType.VERTICAL;
        this._sizeTarget = enums.SizeTarget.MINIMUM;
        this._contentAlignment = enums.Align.CENTER;
        this._backgroundColor = App.GlobalState.DefaultBackground;

        this.isArranger = true;
        this.requiresRender = true;
        this.children = [];

        // Sections default differently than regular controls
        this.align = enums.Align.LEFT;

        this.updateProperties(initialProperties);

        this.background = new Rect({ fillColor: this.backgroundColor });
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
    get sizeTarget() {
        return this._sizeTarget;
    }
    set sizeTarget(newTarget) {
        if (!enums.SizeTarget.hasOwnProperty(newTarget) && (sizeTarget < 0 || sizeTarget >= 1.0))
            datalitError("propertySet", ["Section.sizeTarget", String(newTarget), "enums.SizeTarget"]);

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

    scheduleRender() {
        this.requiresRender = true;
    }

    render() {
        if (this.children.length < 1) return;

        console.log("rendering section...");
        this.requiresRender = false;

        if (this.flowType == enums.FlowType.HORIZONTAL) {
            for (let child of this.children) {
                switch (child.align) {
                    case enums.Align.TOP:
                        child.arrangePosition(this, [-1, this._arrangedPosition[1]]);
                        break;
                    case enums.Align.BOTTOM:
                        child.arrangePosition(this, [
                            -1,
                            this._arrangedPosition[1] + this.size[1] - Math.min(child.viewHeight, this.size[1])
                        ]);
                        break;
                    case enums.Align.CENTER:
                        let space = Math.max(this.size[1] - child.viewHeight, 0);
                        child.arrangePosition(this, [-1, Math.floor(space / 2)]);
                        break;
                }
            }

            switch (this.contentAlignment) {
                case enums.Align.LEFT:
                    var origin = 0;
                    for (let child of this.children) {
                        child.arrangePosition(this, [this._arrangedPosition[0] + origin, -1]);
                        origin += child.viewWidth;
                    }
                    break;
                case enums.Align.RIGHT:
                    var origin = 0;
                    for (let child of this.children) {
                        let childPosition = [this._arrangedPosition[0] + this.size[0] - origin - child.viewWidth, -1];
                        child.arrangePosition(this, childPosition);
                        origin += child.viewWidth;
                    }
                    break;
                case enums.Align.CENTER:
                    let widths = this.children.map(ch => ch.viewWidth);
                    let totalWidth = widths.reduce((total, amount) => total + amount);
                    var origin = this._arrangedPosition[0] + Math.floor((this.size[0] - totalWidth) / 2);

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
                        child.arrangePosition(this, [this._arrangedPosition[0], -1]);
                        break;
                    case enums.Align.RIGHT:
                        child.arrangePosition(this, [
                            this._arrangedPosition[0] + this.size[0] - Math.min(child.viewWidth, this.size[0]),
                            -1
                        ]);
                        break;
                    case enums.Align.CENTER:
                        let space = Math.max(this.size[0] - child.viewWidth, 0);
                        child.arrangePosition(this, [Math.floor(space / 2), -1]);
                        break;
                }
            }

            switch (this.contentAlignment) {
                case enums.Align.TOP:
                    var origin = 0;
                    for (let child of this.children) {
                        child.arrangePosition(this, [-1, this._arrangedPosition[1] + origin]);
                        origin += child.viewHeight;
                    }
                    break;
                case enums.Align.BOTTOM:
                    var origin = 0;
                    for (let child of this.children) {
                        let childPosition = [-1, this._arrangedPosition[1] + this.size[1] - origin - child.viewHeight];
                        child.arrangePosition(this, childPosition);
                        origin += child.viewHeight;
                    }
                    break;
                case enums.Align.CENTER:
                    let heights = this.children.map(ch => ch.viewHeight);
                    let totalHeight = heights.reduce((total, amount) => total + amount);
                    var origin = this._arrangedPosition[1] + Math.floor((this.size[1] - totalHeight) / 2);

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
                requestedSize = [availableSpace[0], largestHeight];
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
                requestedSize = [largestWidth, availableSpace[1]];
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
