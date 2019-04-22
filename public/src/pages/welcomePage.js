import enums from "../lib/datalit/enums.js";
import utils from "../lib/datalit/utils.js";
import { Page } from "../lib/datalit/controls/page.js";
import { Section } from "../lib/datalit/controls/section.js";
import { Rect } from "../lib/datalit/controls/rect.js";
import { Label } from "../lib/datalit/controls/label.js";
import { Icon } from "../lib/datalit/controls/icon.js";
import { Assets } from "../lib/datalit/assetManager.js";
import { Circle } from "../lib/datalit/controls/circle.js";

export class WelcomePage extends Page {
    constructor() {
        super();

        this.mainSection = new Section({
            flowType: enums.FlowType.VERTICAL,
            align: enums.Align.FILL,
            contentAlignment: enums.Align.TOP,
            backgroundColor: utils.newColor(20, 20, 40)
        });

        this.mainSection.addChild(
            new Rect({
                size: [100, 100],
                fillColor: enums.Colors.RED,
                align: enums.Align.LEFT,
                margin: 10,
                borderColor: enums.Colors.OFFWHITE,
                borderThickness: 2
            })
        );
        this.mainSection.addChild(
            new Rect({
                size: [100, 100],
                fillColor: enums.Colors.RED,
                align: enums.Align.LEFT,
                margin: 10
            })
        );
        this.mainSection.addChild(
            new Label("Hello Scott", { align: enums.Align.LEFT, margin: 10, fontColor: enums.Colors.OFFWHITE })
        );
        this.mainSection.addChild(new Icon(Assets.Map.loginTeal, { size: [32, 32], align: enums.Align.LEFT }));
        this.mainSection.addChild(new Icon(Assets.Map.searchPurple, { size: [32, 32], align: enums.Align.LEFT }));
        this.mainSection.addChild(
            new Circle(50, { align: enums.Align.LEFT, fillColor: utils.newColor(40, 24, 88), margin: 10 })
        );
        this.mainSection.addChild(
            new Circle(50, {
                align: enums.Align.LEFT,
                fillColor: enums.Colors.RED,
                margin: 10,
                borderColor: enums.Colors.GREEN,
                borderThickness: 1
            })
        );

        this.addSection(this.mainSection);

        window.addEventListener("keydown", e => this.handleKeypress(e));
    }

    handleKeypress(event) {
        switch (event.key) {
            case "a":
                for (let child of this.mainSection.children) console.log("child align: " + child.align);
                break;
            case "b":
                break;
            case "c":
                break;
        }
    }
}
