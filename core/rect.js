import core from "./core.js";
import { Element } from "./element.js";

export class Rect extends Element {
  constructor(size, fillColor, alignment = core.Align.FILL) {
    super();

    this.size = size;
    this.alignment = alignment;
    this.fillColor = fillColor;
  }

  calculateViewsize() {
    return [this.size[0] + this.margin[0] + this.margin[2], 
            this.size[1] + this.margin[1] + this.margin[3]];
  }

  draw(context) {
    context.fillStyle = this.fillColor;
    let truePosition = [this.position[0] + this.margin[0], this.position[1] + this.margin[1]];
    console.log(`drawing rect at ${truePosition}`)
    context.fillRect(...truePosition, ...this.size);
  }
}
