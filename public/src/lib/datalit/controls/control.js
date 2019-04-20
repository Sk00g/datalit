import enums from "../enums.js";
import { App } from "../app.js";

export class Control {
    constructor() {
        this.position = [0, 0];
        this.size = [1, 1];
        this.visible = true;
        this.alignment = enums.Align.CENTER;

        this.margin = [0, 0, 0, 0];
        for (let i = 0; i < 4; i++) this.margin[i] = App.GlobalState.DefaultMargin;

        // console.log("Control Constructor - 1");
    }

    get height() {
        return this.size[1];
    }
    set height(newHeight) {
        this.size[1] = newHeight;
    }
    get width() {
        return this.size[0];
    }

    setPosition(newPosition) {
        if (newPosition[0] == -1) {
            this.position[1] = newPosition[1];
        } else if (newPosition[1] == -1) {
            this.position[0] = newPosition[0];
        } else {
            this.position = newPosition;
        }
    }

    setSize(newSize) {
        this.size = newSize;
    }

    calculateViewsize() {
        if (this.alignment == enums.Align.FILL) {
            return null;
        } else {
            return size;
        }
    }

    update(elapsed) {}
    draw(context) {}
}
