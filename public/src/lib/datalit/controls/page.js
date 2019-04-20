import { App } from "../app.js";
import enums from "../enums.js";
import { Control } from "./control.js";

export class Page extends Control {
    constructor(margins = [0, 0, 0, 0]) {
        super();

        this.isArranger = true;

        // console.log("Page Constructor - 2");

        this.sectionList = [];
        this.state = enums.PageState.READY;

        // These private variables are used to simplify the render 'arrangement' process
        this._origin = [margins[0], margins[1]];
        this._freeOrigins = [0, 0, 0, 0];
    }

    get position() {
        console.log("getting position from Page");
        return super.position;
    }

    set position(newPosition) {
        console.log("set new position from Page");
        super.position = newPosition;
    }

    _prerenderCheck() {
        if (this._sectionList.filter(sec => sec.alignment == enums.Align.FILL).length > 1) {
            throw new Error("Can only have one Section with alignment == enums.Align.FILL");
        }
    }

    render() {
        this._prerenderCheck();

        this._freeOrigins = [
            this.margin[0],
            this.margin[1],
            window.innerWidth - this.margin[2],
            window.innerHeight - this.margin[3]
        ];
        let totalSpace = [this._freeOrigins[2] - this._freeOrigins[0], this._freeOrigins[3] - this._freeOrigins[1]];

        let viewableSections = this._sectionList.filter(sec => sec.visible && sec.alignment != enums.Align.FILL);
        for (let i = 0; i < viewableSections.length; i++) {
            let sec = viewableSections[i];
            let requestedSize = sec.calculateViewsize(totalSpace);
            // console.log(`Requested size: ${requestedSize}`);
            if (sec.flowType == enums.FlowType.HORIZONTAL) {
                switch (sec.alignment) {
                    case enums.Align.TOP:
                        sec.setPosition([this._freeOrigins[0], this._freeOrigins[1]]);
                        sec.setSize([this._freeOrigins[2] - this._freeOrigins[0], requestedSize[1]]);
                        this._freeOrigins[1] = requestedSize[1];
                        break;
                    case enums.Align.BOTTOM:
                        sec.setPosition([this._freeOrigins[0], this._freeOrigins[3] - requestedSize[1]]);
                        sec.setSize([this._freeOrigins[2] - this._freeOrigins[0], requestedSize[1]]);
                        this._freeOrigins[3] -= requestedSize[1];
                        break;
                }
            } else if (sec.flowType == enums.FlowType.VERTICAL) {
                switch (sec.alignment) {
                    case enums.Align.LEFT:
                        sec.setPosition([this._freeOrigins[0], this._freeOrigins[1]]);
                        sec.setSize([requestedSize[0], this._freeOrigins[3] - this._freeOrigins[1]]);
                        this._freeOrigins[0] = requestedSize[0];
                        break;
                    case enums.Align.RIGHT:
                        sec.setPosition([this._freeOrigins[2] - requestedSize[0], this._freeOrigins[1]]);
                        sec.setSize([requestedSize[0], this._freeOrigins[3] - this._freeOrigins[1]]);
                        this._freeOrigins[2] -= requestedSize[0];
                        break;
                }
            }
        }

        // Arrange the align.FILL section
        let fillSection = this._sectionList.find(sec => sec.alignment == enums.Align.FILL);
        fillSection.setPosition([this._freeOrigins[0], this._freeOrigins[1]]);
        fillSection.setSize([this._freeOrigins[2] - this._freeOrigins[0], this._freeOrigins[3] - this._freeOrigins[1]]);

        // console.log(`finished render... ${this._freeOrigins}`);
    }

    // Private / Protected classes
    addSection(section) {
        this._sectionList.push(section);

        if (this._sectionList.find(sec => sec.alignment == enums.Align.FILL) == undefined) {
            throw new Error("A page must have at least one section with alignment == FILL");
        }

        this.render();
    }

    removeSection(section) {
        this._sectionList.splice(this._sectionList.indexOf(section), 1);
        this.render();
    }

    // Extending classes should implement the following methods
    activate() {
        this._state = enums.PageState.ACTIVE;

        this.render();
    }

    deactivate() {
        this._state = enums.PageState.READY;
    }

    // Called by PageManager (think FSM)
    update(elapsed) {
        for (let section of this._sectionList) {
            section.update(elapsed);
        }
    }

    draw(context) {
        for (let section of this._sectionList) {
            if (section.visible) {
                section.draw(context);
            }
        }
    }
}
