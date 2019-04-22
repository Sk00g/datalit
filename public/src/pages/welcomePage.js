import enums from "../lib/datalit/enums.js";
import utils from "../lib/datalit/utils.js";
import { Page } from "../lib/datalit/controls/page.js";
import { Section } from "../lib/datalit/controls/section.js";

export class WelcomePage extends Page {
    constructor() {
        super();

        this.mainSection = new Section({
            flowType: enums.FlowType.VERTICAL,
            align: enums.Align.FILL,
            contentAlignment: enums.Align.TOP,
            backgroundColor: utils.newColor(20, 20, 40)
        });

        this.addSection(this.mainSection);

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
