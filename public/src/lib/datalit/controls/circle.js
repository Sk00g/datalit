import { App } from "../app.js";
import { Color } from "../enums.js";
import { Control } from "./control.js";
import { datalitError } from "../errors.js";
import utils from "../utils.js";

export class Circle extends Control {
    constructor() {
        super();

        // Unique properties
        this._radius = 1;
        this._fillColor = Color.BLACK;
        this._borderColor = null;
        this._borderThickness = 0;
        this.registerProperty("radius", true);
        this.registerProperty("fillColor");
        this.registerProperty("borderColor");
        this.registerProperty("borderThickness", false, true, false, utils.compareSides);
    }

    // Method overrides
    isPointWithin(point) {
        let center = [
            this._arrangedPosition[0] + this.radius + this.margin[0],
            this._arrangedPosition[1] + this.radius + this.margin[1]
        ];

        let dist = utils.distanceBetweenPoints(point, center);

        return dist <= this.radius;
    }

    // Property overrides
    get size() {
        return [this.radius * 2, this.radius * 2];
    }
    set size(newSize) {
        if (
            typeof newSize != "object" ||
            newSize.length != 2 ||
            !Number.isInteger(newSize[0]) ||
            !Number.isInteger(newSize[1])
        )
            datalitError("propertySet", ["Circle.size", String(newSize), "LIST of 2 int"]);

        if (newSize[0] != 0) this._radius = Math.floor(newSize[0] / 2);
        else if (newSize[1] != 0) this._radius = Math.floor(newSize[1] / 2);
    }

    //#region Unique Properties
    get radius() {
        return this._radius;
    }
    set radius(newRadius) {
        if (!Number.isInteger(newRadius)) datalitError("propertySet", ["Circle.radius", String(newRadius), "int"]);

        this._radius = newRadius;
        this.notifyPropertyChange("radius");
    }

    get fillColor() {
        return this._fillColor;
    }
    set fillColor(newColor) {
        if (typeof utils.hexColor(newColor) != "string")
            datalitError("propertySet", ["Circle.fillColor", String(newColor), "string"]);

        this._fillColor = newColor;
        this.notifyPropertyChange("fillColor");
    }

    get borderColor() {
        return this._borderColor;
    }
    set borderColor(newColor) {
        if (typeof utils.hexColor(newColor) != "string") {
            datalitError("propertySet", ["Circle.borderColor", String(newColor), "string"]);
        }

        this._borderColor = newColor;
        this.notifyPropertyChange("borderColor");
    }

    get borderThickness() {
        return this._borderThickness;
    }
    set borderThickness(thickness) {
        if (!Number.isInteger(thickness) || thickness < 0)
            datalitError("propertySet", ["Circle.borderThickness", String(thickness), "int"]);
        this._borderThickness = thickness;
        this.notifyPropertyChange("borderThickness");
    }
    //#endregion

    draw(context = App.Context, offset = [0, 0]) {
        context.beginPath();
        context.fillStyle = utils.hexColor(this.fillColor);
        let center = [
            this._arrangedPosition[0] + offset[0] + this.radius + this.margin[0],
            this._arrangedPosition[1] + offset[1] + this.radius + this.margin[1]
        ];
        context.arc(...center, this.radius, 0, Math.PI * 2);
        context.fill();

        if (!this.borderColor) return;

        context.strokeStyle = utils.hexColor(this.borderColor);
        var count = 1;
        while (count <= this.borderThickness) {
            context.beginPath();
            context.arc(...center, this.radius - (count - 1), 0, Math.PI * 2);
            context.stroke();
            count++;
        }
    }
}
