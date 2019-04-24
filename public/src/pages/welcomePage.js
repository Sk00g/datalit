import enums from "../lib/datalit/enums.js";
import utils from "../lib/datalit/utils.js";
import { App } from "../lib/datalit/app";
import { Page } from "../lib/datalit/controls/page.js";
import { Section } from "../lib/datalit/controls/section.js";
import { Rect } from "../lib/datalit/controls/rect.js";
import { Label } from "../lib/datalit/controls/label.js";
import { Icon } from "../lib/datalit/controls/icon.js";
import { Assets } from "../lib/datalit/assetManager.js";
import { Circle } from "../lib/datalit/controls/circle.js";
import { Events } from "../lib/datalit/events/events.js";

export class WelcomePage extends Page {
    constructor() {
        super();

        this.leftSection = new Section({
            flowType: enums.FlowType.VERTICAL,
            align: enums.Align.LEFT,
            sizeTarget: 0.2,
            contentAlignment: enums.Align.TOP,
            backgroundColor: utils.newColor(15, 15, 30),
            borderColor: utils.newColor(50, 50, 60),
            borderThickness: [0, 0, 1, 0]
        });
        this.mainSection = new Section({
            flowType: enums.FlowType.VERTICAL,
            align: enums.Align.FILL,
            contentAlignment: enums.Align.TOP,
            backgroundColor: utils.newColor(20, 20, 40)
        });
        this.navBar = new Section({
            flowType: enums.FlowType.HORIZONTAL,
            align: enums.Align.TOP,
            sizeTarget: 0.08,
            contentAlignment: enums.Align.RIGHT,
            backgroundColor: utils.newColor(15, 15, 30),
            borderColor: utils.newColor(50, 50, 60),
            borderThickness: [0, 0, 0, 1]
        });
        this.navBar.addChild(new Icon(Assets.Map.loginTeal, { size: [32, 32] }));
        this.navBar.addChild(new Icon(Assets.Map.searchPurple, { size: [32, 32] }));
        this.navBar.addChild(new Rect({ size: [32, 32], fillColor: utils.newColor(30, 30, 60) }));

        this.subSection = new Section({
            align: enums.Align.TOP,
            flowType: enums.FlowType.HORIZONTAL,
            sizeTarget: enums.SizeTarget.MINIMUM,
            contentAlignment: enums.Align.LEFT,
            backgroundColor: utils.newColor(25, 25, 50),
            margin: 4
        });
        this.subSection.addChild(new Icon(Assets.Map.loginTeal, { size: [32, 32] }));
        this.subSection.addChild(new Icon(Assets.Map.searchPurple, { size: [32, 32] }));
        this.testRect = new Rect({ size: [32, 32], fillColor: utils.newColor(30, 30, 60) });
        this.subSection.addChild(this.testRect);

        this.leftSection.addChild(this.subSection);

        this.addSection(this.mainSection);
        this.addSection(this.leftSection);
        this.addSection(this.navBar);

        Events.register(App.Canvas, "keyup", (ev, data) => this.handleKeypress(ev, data));
    }

    handleKeypress(event, data) {
        // console.log(`welcomePage event -> ${data.key} | ${data.code}`);

        switch (data.key) {
            case "a":
                console.log("switching visibility");
                this.leftSection.visible = !this.leftSection.visible;
                break;
        }
    }
}
