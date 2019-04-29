import utils from "../utils.js";
import { App } from "../app.js";
import { Colors } from "../enums.js";
import { Control } from "./control.js";
import { datalitError } from "../errors.js";

export class Circle extends Control {
    constructor(radius, initialProperties = {}) {
        super();

        // Unique properties
        this._radius = radius;
        this._fillColor = Colors.OFFWHITE;
        this._borderColor = null;
        this._borderThickness = 0;

        this.updateProperties(initialProperties);

        this.registerProperty("radius");
        this.registerProperty("fillColor");
        this.registerProperty("borderColor");
        this.registerProperty("borderThickness");
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
    get viewSize() {
        return [this.radius * 2 + this.margin[0] + this.margin[2], this.radius * 2 + this.margin[1] + this.margin[3]];
    }
    set viewSize(size) {
        if (typeof size != "object" || size.length != 2 || !Number.isInteger(size[0]) || !Number.isInteger(size[1]))
            datalitError("propertySet", ["Circle.viewSize", String(size), "LIST of 2 int"]);

        if (size[0] != 0) this._radius = Math.floor(size[0] / 2);
        else if (size[1] != 0) this._radius = Math.floor(size[1] / 2);
    }

    //#region Unique Properties
    get radius() {
        return this._radius;
    }
    set radius(newRadius) {
        if (!Number.isInteger(newRadius)) datalitError("propertySet", ["Circle.radius", String(newRadius), "int"]);

        this._radius = newRadius;
    }

    get fillColor() {
        return this._fillColor;
    }
    set fillColor(newColor) {
        if (typeof newColor != "string") datalitError("propertySet", ["Circle.fillColor", String(newColor), "string"]);

        this._fillColor = newColor;
    }

    get borderColor() {
        return this._borderColor;
    }
    set borderColor(newColor) {
        if (typeof newColor != "string") {
            datalitError("propertySet", ["Circle.borderColor", String(newColor), "string"]);
        }

        this._borderColor = newColor;
    }

    get borderThickness() {
        return this._borderThickness;
    }
    set borderThickness(thickness) {
        if (!Number.isInteger(thickness) || thickness < 0)
            datalitError("propertySet", ["Circle.borderThickness", String(thickness), "int"]);
        this._borderThickness = thickness;
    }
    //#endregion

    draw() {
        App.Context.beginPath();
        App.Context.fillStyle = this.fillColor;
        let center = [
            this._arrangedPosition[0] + this.radius + this.margin[0],
            this._arrangedPosition[1] + this.radius + this.margin[1]
        ];
        App.Context.arc(...center, this.radius, 0, Math.PI * 2);
        App.Context.fill();

        if (!this.borderColor) return;

        App.Context.strokeStyle = this.borderColor;
        var count = 1;
        while (count <= this.borderThickness) {
            App.Context.beginPath();
            App.Context.arc(...center, this.radius - (count - 1), 0, Math.PI * 2);
            App.Context.stroke();
            count++;
        }
    }
}
