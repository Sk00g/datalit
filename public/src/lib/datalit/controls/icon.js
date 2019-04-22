import { App } from "../app.js";
import { Control } from "./control.js";
import { Assets } from "../assetManager.js";

export class Icon extends Control {
    constructor(imageName, initialProperties = {}) {
        super();

        // Unique properties
        this._sourceRect = null;

        this.image = Assets.getImage(imageName);

        this.updateProperties(initialProperties);
    }

    get sourceRect() {
        return this._sourceRect;
    }
    set sourceRect(rect) {
        if (typeof rect != "object" || rect.length != 4)
            datalitError("propertySet", ["Icon.sourceRect", String(rect), "LIST of 4 int"]);

        this._sourceRect = rect;
    }

    draw() {
        if (this.sourceRect) {
            App.Context.drawImage(this.image, ...this.sourceRect, ...this._arrangedPosition, ...this.size);
        } else {
            App.Context.drawImage(this.image, ...this._arrangedPosition, ...this.size);
        }
    }
}
