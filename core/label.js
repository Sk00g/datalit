import core from "./core.js";
import { Element } from "./element.js";

export class Label extends Element {
  constructor(alignment, context, text, fontColor = "rgb(0, 0, 0)", fontSize = 12) {
    super();

    this.alignment = alignment;
    this.text = text;
    this.fontSize = fontSize;
    this.color = fontColor;
    this.context = context;


    this.context.font = this.fontSize + "pt sans-serif";
    this.size = [this.context.measureText(text).width, this.fontSize];

    if (this.alignment == core.Align.FILL) {
       throw new Error("Text-based elements cannot have a FILL alignment");
    }
  }

  calculateViewsize() {
    return [this.size[0] + this.margin[0] + this.margin[2], 
            this.size[1] + this.margin[1] + this.margin[3]];
  }

  draw(context) {
    context.fillStyle = this.color;
    context.font = this.fontSize + "pt sans-serif";
    let truePosition = [this.position[0] + this.margin[0], 
      this.position[1] + this.fontSize + this.margin[1]]
    console.log(`Pos[1]: ${this.position[1]} || TruePos[1]: ${truePosition[1]}`);
    context.fillText(this.text, ...truePosition);
  }
}
