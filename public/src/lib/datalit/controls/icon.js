import { Element } from "./element.js";
import core from "../core.js";

export class Icon extends Element {
    constructor(size, alignment, sourceFile, sourceRect = null) {
        super();

        this.size = size;
        this.alignment = alignment;
        this.image = new Image();
        this.sourceRect = sourceRect;
        this.visible = false;

        this.image.src = sourceFile;
        this.image.onload = () => {
            this.visible = true;
            core.GlobalState.RedrawRequired = true;
        };
    }

    draw(context) {
        if (this.visible) {
            if (this.sourceRect) {
                context.drawImage(this.image, ...this.sourceRect, ...this.position, ...this.size);
            } else {
                context.drawImage(this.image, ...this.position, ...this.size);
            }
        }
    }
}
