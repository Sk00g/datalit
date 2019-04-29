import { ContentDirection, Colors, HAlign, VAlign } from "../lib/datalit/enums.js";
import utils from "../lib/datalit/utils.js";
import { Page } from "../lib/datalit/controls/page.js";
import { Section } from "../lib/datalit/controls/section.js";
import { Events } from "../lib/datalit/events/events.js";
import { App } from "../lib/datalit/app.js";
import { Icon } from "../lib/datalit/controls/icon.js";
import { Assets } from "../lib/datalit/assetManager.js";
import { Rect } from "../lib/datalit/controls/rect.js";
import { Label } from "../lib/datalit/controls/label";

export class WelcomePage extends Page {
    constructor() {
        super();

        const TEXT_COLOR = Colors.OFFWHITE;
        const BACK_WHITE = utils.hexColor("ea");
        const INFIN_COLOR = utils.hexColor("30415b");

        this.contentDirection = ContentDirection.HORIZONTAL;
        this.debugName = "welcomePage";

        let navbar = new Section({
            debugName: "navbar",
            contentDirection: ContentDirection.VERTICAL,
            halign: HAlign.LEFT,
            hfillTarget: 0.33,
            valign: VAlign.FILL,
            backgroundColor: INFIN_COLOR
        });
        let logoLine = new Section({
            contentDirection: ContentDirection.HORIZONTAL,
            halign: HAlign.FILL,
            valign: VAlign.TOP,
            vfillTarget: -1,
            debugName: "logoline"
        });
        logoLine.addChild(new Icon(Assets.Map.infinitiLogo, [150, 33], { margin: 4 }));
        logoLine.addChild(
            new Icon(Assets.Map.loginTeal, [32, 32], {
                valign: VAlign.CENTER,
                halign: HAlign.RIGHT,
                margin: 4
            })
        );
        navbar.addChild(logoLine);

        let line1 = new Section({
            contentDirection: ContentDirection.HORIZONTAL,
            halign: HAlign.FILL,
            valign: VAlign.TOP,
            vfillTarget: -1,
            debugName: "line1",
            margin: [8, 30, 0, 0]
            // backgroundColor: utils.hexColor("ff000050")
        });
        line1.addChild(new Icon(Assets.Map.searchPurple, [32, 32], { margin: 4 }));
        line1.addChild(
            new Label("HOME", { valign: VAlign.CENTER, fontSize: 11, fontColor: TEXT_COLOR, margin: [12, 0, 0, 0] })
        );
        navbar.addChild(line1);

        let line2 = new Section({
            contentDirection: ContentDirection.HORIZONTAL,
            halign: HAlign.FILL,
            valign: VAlign.TOP,
            vfillTarget: -1,
            debugName: "line2",
            margin: [8, 0, 0, 0]
            // backgroundColor: utils.hexColor("00ff0050")
        });
        line2.addChild(new Icon(Assets.Map.searchPurple, [32, 32], { margin: 4 }));
        line2.addChild(
            new Label("COMPONENTS", {
                valign: VAlign.CENTER,
                fontSize: 11,
                fontColor: TEXT_COLOR,
                margin: [12, 0, 0, 0]
            })
        );
        navbar.addChild(line2);

        let line3 = new Section({
            contentDirection: ContentDirection.HORIZONTAL,
            halign: HAlign.FILL,
            valign: VAlign.TOP,
            vfillTarget: -1,
            debugName: "line3",
            margin: [8, 0, 0, 20]
            // backgroundColor: utils.hexColor("0000ff50")
        });
        line3.addChild(new Icon(Assets.Map.searchPurple, [32, 32], { margin: 4 }));
        line3.addChild(
            new Label("PROJECTS", { valign: VAlign.CENTER, fontSize: 11, fontColor: TEXT_COLOR, margin: [12, 0, 0, 0] })
        );
        navbar.addChild(line3);

        let chunk1 = new Section({
            contentDirection: ContentDirection.HORIZONTAL,
            halign: HAlign.FILL,
            valign: VAlign.TOP,
            vfillTarget: -1,
            debugName: "chunk1",
            // backgroundColor: utils.hexColor("ff000050"),
            borderColor: utils.hexColor("dddddda0"),
            borderThickness: [0, 1, 0, 1]
        });
        chunk1.addChild(
            new Label("FAVORITES", {
                halign: HAlign.LEFT,
                fontSize: 11,
                fontColor: TEXT_COLOR,
                margin: [18, 14, 0, 14]
            })
        );
        navbar.addChild(chunk1);

        let mainSection = new Section({
            contentDirection: ContentDirection.VERTICAL,
            halign: HAlign.FILL,
            valign: VAlign.FILL,
            backgroundColor: BACK_WHITE,
            debugName: "mainSection"
        });

        this.addSection(navbar);
        this.addSection(mainSection);

        Events.register(App.Canvas, "keyup", (ev, data) => this.handleKeypress(ev, data));
    }

    handleKeypress(event, data) {
        // console.log(`welcomePage event -> ${data.key} | ${data.code}`);

        switch (data.key) {
            case "a":
                console.log(`leftSection: ${this.leftSection._arrangedPosition} | ${this.leftSection.viewSize}`);
                console.log(`mainSection: ${this.mainSection._arrangedPosition} | ${this.mainSection.viewSize}`);
                break;
        }
    }
}
