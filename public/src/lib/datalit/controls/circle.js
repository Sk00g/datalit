import enums from "../enums.js";
import { App } from "../app.js";
import { Control } from "./control.js";
import { datalitError } from "../errors.js";

export class Circle extends Control {
    constructor(radius, initialProperties = {}) {
        super();

        // Unique properties
        this._radius = radius;
        this._fillColor = enums.Colors.OFFWHITE;
        this._borderColor = null;
        this._borderThickness = 0;

        this.updateProperties(initialProperties);

        this.registerProperty("radius");
        this.registerProperty("fillColor");
        this.registerProperty("borderColor");
        this.registerProperty("borderThickness");
    }

    // Overridden properties
    get size() {
        return [this.radius * 2, this.radius * 2];
    }
    set size(size) {
        datalitError("invalidProperty", ["Circle", "size"]);
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
        if (typeof newColor != "string") {
            datalitError("propertySet", ["Circle.fillColor", String(newColor), "string"]);
        }

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
