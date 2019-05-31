import { App } from "../app.js";
import { Assets } from "../assetManager.js";
import { Control } from "./control.js";
import { datalitError } from "../errors.js";
import utils from "../utils.js";

export class Icon extends Control {
    constructor(imageName, size, initialProperties = {}, withholdingEvents = false) {
        super();

        // Unique properties
        this._sourceRect = null;
        this.registerProperty("sourceRect", false, true, false, utils.compareSides);

        this.image = Assets.getImage(imageName);

        this.size = size;

        // Apply base theme before customized properties
        this.applyTheme("Icon");

        this.updateProperties(initialProperties);

        this._withholdingEvents = withholdingEvents;
    }

    //#region Unique Properties
    get sourceRect() {
        return this._sourceRect;
    }
    set sourceRect(rect) {
        if (typeof rect != "object" || rect.length != 4)
            datalitError("propertySet", ["Icon.sourceRect", String(rect), "LIST of 4 int"]);

        this._sourceRect = rect;
        this.notifyPropertyChange("sourceRect");
    }
    //#endregion

    draw() {
        let truePosition = [this._arrangedPosition[0] + this.margin[0], this._arrangedPosition[1] + this.margin[1]];

        if (this.sourceRect) {
            App.Context.drawImage(this.image, ...this.sourceRect, ...truePosition, ...this.size);
        } else {
            App.Context.drawImage(this.image, ...truePosition, ...this.size);
        }
    }
}
