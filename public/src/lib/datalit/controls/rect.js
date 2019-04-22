import enums from "../enums.js";
import { Control } from "./control.js";
import { datalitError } from "../errors";

export class Rect extends Control {
    constructor(initialProperties = {}) {
        super();

        // Unique properties
        this._fillColor = enums.Colors.OFFWHITE;

        this.updateProperties(initialProperties);
    }

    get fillColor() {
        return this._fillColor;
    }
    set fillColor(newColor) {
        if (typeof newColor != "string") {
            datalitError("propertySet", ["Rect.fillColor", String(newColor), "string"]);
        }

        this._fillColor = newColor;
    }

    draw(context) {
        context.fillStyle = this.fillColor;
        let truePosition = [this._arrangedPosition[0] + this.margin[0], this._arrangedPosition[1] + this.margin[1]];
        context.fillRect(...truePosition, ...this.size);
    }
}
