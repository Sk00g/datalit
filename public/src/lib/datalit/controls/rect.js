import { App } from "../app.js";
import { Color } from "../enums.js";
import { Control } from "./control.js";
import { datalitError } from "../errors.js";
import utils from "../utils.js";

export class Rect extends Control {
    constructor(initialProperties = {}, withholdingEvents = false) {
        super();

        // Unique properties
        this._fillColor = Color.BLACK;
        this._borderColor = null;
        this._borderThickness = [0, 0, 0, 0];
        this.registerProperty("fillColor");
        this.registerProperty("borderColor");
        this.registerProperty("borderThickness", false, true, false, utils.compareSides);

        // Apply base theme before customized properties
        this.applyTheme("Rect");

        this.updateProperties(initialProperties);

        this._withholdingEvents = withholdingEvents;
    }

    //#region Unique Properties
    get fillColor() {
        return this._fillColor;
    }
    set fillColor(newColor) {
        if (typeof utils.hexColor(newColor) != "string")
            datalitError("propertySet", ["Rect.fillColor", String(newColor), "string"]);

        this._fillColor = newColor;
        this.notifyPropertyChange("fillColor");
    }

    get borderColor() {
        return this._borderColor;
    }
    set borderColor(newColor) {
        if (typeof utils.hexColor(newColor) != "string")
            datalitError("propertySet", ["Rect.borderColor", String(newColor), "string"]);

        this._borderColor = newColor;
        this.notifyPropertyChange("borderColor");
    }

    get borderThickness() {
        return this._borderThickness;
    }
    set borderThickness(thickness) {
        if (typeof thickness == "number") {
            if (!Number.isInteger(thickness) || thickness < 0)
                datalitError("propertySet", ["Rect.borderThickness", String(thickness), "int or LIST of 4 int"]);
            this._borderThickness = [thickness, thickness, thickness, thickness];
        } else {
            if (typeof thickness != "object" || thickness.length != 4)
                datalitError("propertySet", ["Rect.borderThickness", String(thickness), "int LIST of 4 int"]);
            for (let i = 0; i < 4; i++)
                if (!Number.isInteger(thickness[i]) && thickness[i] >= 0)
                    datalitError("propertySet", ["Rect.borderThickness", String(thickness), "int LIST of 4 int"]);

            this._borderThickness = thickness;
        }
        this.notifyPropertyChange("borderThickness");
    }
    //#endregion

    draw(context = App.Context) {
        context.fillStyle = utils.hexColor(this.fillColor);
        let truePosition = [this._arrangedPosition[0] + this.margin[0], this._arrangedPosition[1] + this.margin[1]];
        // console.log(`drawing rect at ${truePosition} (${this.size})`);
        context.fillRect(...truePosition, ...this.size);

        if (!this.borderColor) return;

        // Draw borders
        context.fillStyle = utils.hexColor(this.borderColor);
        const bt = this.borderThickness;
        if (bt[0] != 0) {
            let size = [bt[0], this.size[1]];
            context.fillRect(...truePosition, ...size);
        }
        if (bt[1] != 0) {
            let size = [this.size[0], bt[1]];
            context.fillRect(...truePosition, ...size);
        }
        if (bt[2] != 0) {
            let pos = [truePosition[0] + this.size[0] - bt[2], truePosition[1]];
            let size = [bt[2], this.size[1]];
            context.fillRect(...pos, ...size);
        }
        if (bt[3] != 0) {
            let pos = [truePosition[0], truePosition[1] + this.size[1] - bt[3]];
            let size = [this.size[0], bt[3]];
            context.fillRect(...pos, ...size);
        }
    }
}
