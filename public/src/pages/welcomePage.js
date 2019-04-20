import enums from "../lib/datalit/enums.js";
import utils from "../lib/datalit/utils.js";
import { Control } from "../lib/datalit/controls/control.js";
import { Page } from "../lib/datalit/controls/page.js";
import { Section } from "../lib/datalit/controls/section.js";

export class WelcomePage extends Page {
    constructor() {
        super([0, 0, 0, 0]);

        let newControl = new Control();
        console.log(`size: ${newControl.size}`);
        newControl.size = [12, 20];
        console.log(`size: ${newControl.size}`);

        console.log(`newControl.viewingRect: ${newControl.viewingRect}`);
        newControl.arrangePosition(this, [10, 10]);
        console.log(`newControl.viewingRect: ${newControl.viewingRect}`);

        console.log(`newControl.margin: ${newControl.margin}`);
        console.log(`newControl.hitRect: ${newControl.hitRect}`);
        newControl.margin = [8, 8, 8, 8];
        console.log(`newControl.hitRect: ${newControl.hitRect}`);

        console.log(`newControl.zValue: ${newControl.zValue}`);
        newControl.zValue = 2;
        console.log(`newControl.zValue: ${newControl.zValue}`);

        // this.mainSection = new Section(enums.FlowType.VERTICAL, enums.Align.FILL, 0, utils.newColor(20, 20, 40));

        // this.addSection(this.mainSection);

        window.addEventListener("keydown", e => this.handleKeypress(e));
    }

    handleKeypress(event) {
        switch (event.key) {
            case "a":
                console.log(`mainSection: ${this.mainSection.position} ||${this.mainSection.size}`);
                console.log(`otherSection: ${this.otherSection.position} ||${this.otherSection.size}`);
                console.log(`thirdSection: ${this.thirdSection.position} ||${this.thirdSection.size}`);
                break;
            case "b":
                this.otherSection.background.position[0]++;
                this.otherSection.position[0]++;
                enums.GlobalState.RedrawRequired = true;
                break;
            case "c":
                this.otherSection.visible = !this.otherSection.visible;
                enums.GlobalState.RedrawRequired = true;
                break;
        }
    }
}
