import { App } from "../app.js";
import { Assets } from "../assetManager.js";
import { Control } from "./control.js";
import { datalitError } from "../errors.js";

export class Icon extends Control {
    constructor(imageName, imageSize, initialProperties = {}) {
        super();

        // Unique properties
        this._sourceRect = null;

        this.image = Assets.getImage(imageName);

        this.updateProperties(initialProperties);

        // Set this after margins so viewSize is set properly
        this.imageSize = imageSize;

        this.registerProperty("sourceRect");
    }

    //#region Unique Properties
    get imageSize() {
        return [this.viewWidth - this.margin[0] - this.margin[2], this.viewHeight - this.margin[1] - this.margin[3]];
    }
    set imageSize(size) {
        if (typeof size != "object" || size.length != 2 || !Number.isInteger(size[0]) || !Number.isInteger(size[1]))
            datalitError("propertySet", ["Icon.imageSize", String(size), "LIST of 2 int"]);

        this.viewSize = [size[0] + this.margin[0] + this.margin[2], size[1] + this.margin[1] + this.margin[3]];
    }

    get sourceRect() {
        return this._sourceRect;
    }
    set sourceRect(rect) {
        if (typeof rect != "object" || rect.length != 4)
            datalitError("propertySet", ["Icon.sourceRect", String(rect), "LIST of 4 int"]);

        this._sourceRect = rect;
    }
    //#endregion

    draw() {
        let truePosition = [this._arrangedPosition[0] + this.margin[0], this._arrangedPosition[1] + this.margin[1]];

        if (this.sourceRect) {
            App.Context.drawImage(this.image, ...this.sourceRect, ...truePosition, ...this.imageSize);
        } else {
            App.Context.drawImage(this.image, ...truePosition, ...this.imageSize);
        }
    }
}
