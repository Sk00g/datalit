import { App } from "../app.js";
import { Assets } from "../assetManager.js";
import { Control } from "./control.js";
import { datalitError } from "../errors.js";
import utils from "../utils.js";

export class Icon extends Control {
    constructor(initialProperties = {}, withholdingEvents = false) {
        super();

        // Unique properties
        this._sourceRect = null;
        this._imagePath = null;
        this.registerProperty("imagePath", false, true, false);
        this.registerProperty("sourceRect", false, true, false, utils.compareSides);

        // Store the actual image object
        this._image = null;

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
    get imagePath() {
        return this._imagePath;
    }
    set imagePath(newPath) {
        if (typeof newPath != "string")
            datalitError("propertySet", ["Icon.imagePath", String(newPath), "filepath STRING"]);

        // Get image based on file path
        this._image = Assets.getImage(newPath);

        this._imagePath = newPath;
        this.notifyPropertyChange("imagePath");
    }
    //#endregion

    draw(context = App.Context) {
        if (this._image) {
            let truePosition = [this._arrangedPosition[0] + this.margin[0], this._arrangedPosition[1] + this.margin[1]];

            if (this.sourceRect) {
                context.drawImage(this._image, ...this.sourceRect, ...truePosition, ...this.size);
            } else {
                context.drawImage(this._image, ...truePosition, ...this.size);
            }
        }
    }
}
