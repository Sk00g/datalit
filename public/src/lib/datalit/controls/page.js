import enums from "../enums.js";
import { Control } from "./control.js";
import { App } from "../app.js";

export class Page extends Control {
    constructor(initialProperties = {}) {
        super();
        // console.log("Page Constructor - 2");

        // Unique property fields
        this._state = enums.PageState.READY;

        this.isArranger = true;
        this.requiresRender = true;
        this.sectionList = [];

        // This is used internally to simplify the render 'arrangement' process
        this.freeOrigins = [0, 0, 0, 0];

        this.updateProperties(initialProperties);
    }

    get state() {
        return this._state;
    }
    set state(newState) {
        if (!enums.PageState.hasOwnProperty(newState))
            datalitError("propertySet", ["Page.state", String(newState), "enums.PageState"]);

        this._state = newState;
    }

    prerenderCheck() {
        if (this.sectionList.filter(sec => sec.align == enums.Align.FILL).length != 1) {
            throw new Error("Must have exactly one Section with align == enums.Align.FILL");
        }
    }

    scheduleRender() {
        this.requiresRender = true;
    }

    render() {
        this.prerenderCheck();

        // console.log("rendering page...");
        this.requiresRender = false;

        this.freeOrigins = [
            this.margin[0],
            this.margin[1],
            App.Canvas.width - this.margin[2],
            App.Canvas.height - this.margin[3]
        ];
        let totalSpace = [this.freeOrigins[2] - this.freeOrigins[0], this.freeOrigins[3] - this.freeOrigins[1]];

        let viewableSections = this.sectionList.filter(sec => sec.visible && sec.align != enums.Align.FILL);
        for (let i = 0; i < viewableSections.length; i++) {
            let sec = viewableSections[i];
            let requestedSize = sec.calculateViewsize(totalSpace);
            // console.log(`Requested size: ${requestedSize}`);
            if (sec.flowType == enums.FlowType.HORIZONTAL) {
                switch (sec.align) {
                    case enums.Align.TOP:
                        sec.arrangePosition(this, [this.freeOrigins[0], this.freeOrigins[1]]);
                        sec.size = [this.freeOrigins[2] - this.freeOrigins[0], requestedSize[1]];
                        this.freeOrigins[1] = requestedSize[1];
                        break;
                    case enums.Align.BOTTOM:
                        sec.arrangePosition(this, [this.freeOrigins[0], this.freeOrigins[3] - requestedSize[1]]);
                        sec.size = [this.freeOrigins[2] - this.freeOrigins[0], requestedSize[1]];
                        this.freeOrigins[3] -= requestedSize[1];
                        break;
                }
            } else if (sec.flowType == enums.FlowType.VERTICAL) {
                switch (sec.align) {
                    case enums.Align.LEFT:
                        sec.arrangePosition(this, [this.freeOrigins[0], this.freeOrigins[1]]);
                        sec.size = [requestedSize[0], this.freeOrigins[3] - this.freeOrigins[1]];
                        this.freeOrigins[0] = requestedSize[0];
                        break;
                    case enums.Align.RIGHT:
                        sec.arrangePosition(this, [this.freeOrigins[2] - requestedSize[0], this.freeOrigins[1]]);
                        sec.size = [requestedSize[0], this.freeOrigins[3] - this.freeOrigins[1]];
                        this.freeOrigins[2] -= requestedSize[0];
                        break;
                }
            }
        }

        // Arrange the align.FILL section
        let fillSection = this.sectionList.find(sec => sec.align == enums.Align.FILL);
        fillSection.arrangePosition(this, [this.freeOrigins[0], this.freeOrigins[1]]);
        fillSection.size = [this.freeOrigins[2] - this.freeOrigins[0], this.freeOrigins[3] - this.freeOrigins[1]];
    }

    // Private / Protected classes
    addSection(section) {
        this.sectionList.push(section);

        this.scheduleRender();
    }

    removeSection(section) {
        this.sectionList.splice(this.sectionList.indexOf(section), 1);
        this.scheduleRender();
    }

    // Extending classes should implement the following methods
    activate() {
        this.state = enums.PageState.ACTIVE;

        this.scheduleRender();
    }

    deactivate() {
        this.state = enums.PageState.READY;
    }

    // Called by PageManager (think FSM)
    update(elapsed) {
        super.update(elapsed);

        // Only render once per update loop
        if (this.requiresRender) this.render();

        for (let section of this.sectionList) {
            section.update(elapsed);
        }
    }

    draw() {
        for (let section of this.sectionList) {
            if (section.visible) {
                section.draw();
            }
        }
    }
}
