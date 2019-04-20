import enums from "../lib/datalit/enums.js";
import utils from "../lib/datalit/utils.js";
import { Page } from "../lib/datalit/controls/page.js";
import { Rect } from "../lib/datalit/controls/rect.js";
import { Label } from "../lib/datalit/controls/label.js";
import { Section } from "../lib/datalit/controls/section.js";
import { Icon } from "../lib/datalit/controls/icon.js";

export class WelcomePage extends Page {
    constructor(context) {
        // super(context, [20, 20, 20, 20]);
        super(context, [0, 0, 0, 0]);

        this.topSection = new Section(enums.FlowType.HORIZONTAL, enums.Align.TOP, 0.07, utils.newColor(25, 10, 35));
        this.leftSection = new Section(enums.FlowType.VERTICAL, enums.Align.LEFT, 0.2, utils.newColor(25, 10, 15));
        this.mainSection = new Section(enums.FlowType.VERTICAL, enums.Align.FILL, 0, utils.newColor(20, 20, 40));
        this.rightSection = new Section(enums.FlowType.VERTICAL, enums.Align.RIGHT, 0.2, utils.newColor(25, 10, 15));
        this.botSection = new Section(enums.FlowType.HORIZONTAL, enums.Align.BOTTOM, 0.07, enums.Colors.OFFBLACK);

        // Add elements
        let la = enums.Align.RIGHT;
        let testLabel = new Label(la, context, "COMPONENTS", enums.Colors.OFFWHITE, 14);
        let label2 = new Label(la, context, "ORDERS", enums.Colors.OFFWHITE, 14);
        let label3 = new Label(la, context, "ACCOUNTS", enums.Colors.OFFWHITE, 14);

        // for (let lb of [testLabel, label2, label3]) {
        //   lb.margin = [0, 0, 0, 0];
        // }

        let line = new Rect([1, 2], enums.newColor(200, 200, 200, 0.15), enums.Align.CENTER);
        line.height = 4;
        line.fillWidth = true;

        this.leftSection.contentAlignment = enums.Align.TOP;
        this.leftSection.addChildren([testLabel, label2, line, label3]);
        // this.rightSection.addChildren([testLabel, label2, label3]);

        this.addSection(this.mainSection);
        this.addSection(this.topSection);
        this.addSection(this.botSection);
        this.addSection(this.leftSection);
        this.addSection(this.rightSection);

        // this.testImage = new Icon([32, 32], enums.Align.LEFT, "../../../assets/images/search-purple.png");
        // this.mainSection.addChildren(this.testImage);

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
