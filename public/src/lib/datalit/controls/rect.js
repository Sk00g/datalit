import enums from "../enums.js";
import { Control } from "./control.js";

export class Rect extends Control {
    constructor(size, fillColor, alignment = enums.Align.FILL) {
        super();

        this.size = size;
        this.alignment = alignment;
        this.fillColor = fillColor;
    }

    calculateViewsize() {
        return [this.size[0] + this.margin[0] + this.margin[2], this.size[1] + this.margin[1] + this.margin[3]];
    }

    draw(context) {
        context.fillStyle = this.fillColor;
        let truePosition = [this.position[0] + this.margin[0], this.position[1] + this.margin[1]];
        console.log(`drawing rect at ${truePosition}`);
        context.fillRect(...truePosition, ...this.size);
    }
}
