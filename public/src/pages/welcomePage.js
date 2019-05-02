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
import { Circle } from "../lib/datalit/controls/circle";

export class WelcomePage extends Page {
    constructor() {
        super();

        const BACK_COLOR = utils.hexColor("ef");
        const GREYLINE_COLOR = utils.hexColor("d2");

        this.contentDirection = ContentDirection.FREE;
        this.debugName = "welcomePage";

        let superSection = new Section({
            localPosition: [0, 0],
            viewSize: [885, 616],
            contentDirection: ContentDirection.VERTICAL,
            halign: HAlign.FILL,
            valign: VAlign.FILL,
            debugName: "superSection"
        });
        this.popupSection = new Section({
            contentDirection: ContentDirection.VERTICAL,
            localPosition: [Math.floor(885 / 2) - 200, Math.floor(616 / 2) - 100],
            viewSize: [400, 200],
            debugName: "popupSection",
            backgroundColor: utils.hexColor("44"),
            borderColor: Colors.RED,
            borderThickness: 2,
            zValue: 1
        });
        this.popupSection.addChild(
            new Label("This is a popup!", {
                halign: HAlign.CENTER,
                valign: VAlign.CENTER,
                fontColor: Colors.OFFWHITE,
                fontSize: 14
            })
        );

        let topbar = new Section({
            debugName: "topbar",
            contentDirection: ContentDirection.HORIZONTAL,
            halign: HAlign.FILL,
            valign: VAlign.TOP,
            vfillTarget: -1,
            backgroundColor: BACK_COLOR,
            borderColor: GREYLINE_COLOR,
            borderThickness: [0, 0, 0, 1]
        });
        topbar.addChild(new Icon(Assets.Map.searchPurple, [32, 32], { halign: HAlign.LEFT, margin: 8 }));
        topbar.addChild(new Icon(Assets.Map.infinitiLogo, [150, 33], { halign: HAlign.LEFT, valign: VAlign.CENTER }));
        topbar.addChild(new Icon(Assets.Map.searchPurple, [32, 32], { halign: HAlign.RIGHT, margin: 4 }));
        topbar.addChild(new Icon(Assets.Map.loginTeal, [32, 32], { halign: HAlign.RIGHT, margin: 4 }));
        topbar.addChild(
            new Rect({
                valign: VAlign.STRETCH,
                halign: HAlign.CENTER,
                margin: 8,
                fillColor: GREYLINE_COLOR,
                viewSize: [500, 1]
            })
        );

        let mainSection = new Section({
            contentDirection: ContentDirection.HORIZONTAL,
            halign: HAlign.FILL,
            valign: VAlign.FILL,
            backgroundColor: utils.hexColor("22"),
            debugName: "mainSection"
        });
        let rightbar = new Section({
            contentDirection: ContentDirection.VERTICAL,
            halign: HAlign.RIGHT,
            valign: VAlign.FILL,
            backgroundColor: BACK_COLOR,
            hfillTarget: -1,
            debugName: "rightbar",
            borderColor: GREYLINE_COLOR,
            borderThickness: [1, 0, 0, 0]
        });
        rightbar.addChild(new Icon(Assets.Map.loginTeal, [32, 32], { margin: 4 }));
        rightbar.addChild(new Icon(Assets.Map.searchPurple, [32, 32], { margin: 4 }));
        rightbar.addChild(new Icon(Assets.Map.loginTeal, [32, 32], { margin: 4 }));
        let leftbar = new Section({
            contentDirection: ContentDirection.VERTICAL,
            halign: HAlign.LEFT,
            valign: VAlign.FILL,
            hfillTarget: 0.3,
            debugName: "leftbar",
            backgroundColor: BACK_COLOR,
            borderColor: GREYLINE_COLOR,
            borderThickness: [0, 0, 1, 0]
        });
        leftbar.addChild(new Icon(Assets.Map.infinitiLogo, [200, 44], { halign: HAlign.CENTER, margin: 8 }));
        leftbar.addChild(new Label("Inbox", { margin: [20, 8, 20, 8] }));
        leftbar.addChild(new Label("Snoozed", { margin: [20, 8, 20, 8] }));
        leftbar.addChild(new Label("Sent", { margin: [20, 8, 20, 8] }));
        leftbar.addChild(new Label("Drafts", { margin: [20, 8, 20, 8] }));
        leftbar.addChild(new Label("Junk", { margin: [20, 8, 20, 8] }));
        let tinybar = new Section({
            contentDirection: ContentDirection.HORIZONTAL,
            halign: HAlign.FILL,
            valign: VAlign.BOTTOM,
            vfillTarget: -1,
            debugName: "tinybar",
            borderColor: GREYLINE_COLOR,
            borderThickness: [0, 1, 0, 0]
        });
        tinybar.addChild(new Icon(Assets.Map.searchPurple, [32, 32], { margin: 4, halign: HAlign.CENTER }));
        tinybar.addChild(new Icon(Assets.Map.loginTeal, [32, 32], { margin: 4, halign: HAlign.CENTER }));
        tinybar.addChild(new Icon(Assets.Map.searchPurple, [32, 32], { margin: 4, halign: HAlign.CENTER }));
        leftbar.addChild(tinybar);

        let center = new Section({
            contentDirection: ContentDirection.VERTICAL,
            halign: HAlign.FILL,
            valign: VAlign.FILL,
            debugName: "center"
        });
        let categorybar = new Section({
            contentDirection: ContentDirection.HORIZONTAL,
            halign: HAlign.FILL,
            valign: VAlign.TOP,
            vfillTarget: -1,
            debugName: "categorybar"
        });
        categorybar.addChild(new Rect({ viewSize: [0, 40], fillColor: BACK_COLOR, halign: HAlign.FILL }));
        categorybar.addChild(new Rect({ viewSize: [0, 40], fillColor: Colors.RED, halign: HAlign.FILL }));
        categorybar.addChild(new Rect({ viewSize: [0, 40], fillColor: Colors.BLUE, halign: HAlign.FILL }));
        categorybar.addChild(new Rect({ viewSize: [0, 40], fillColor: Colors.GREEN, halign: HAlign.FILL }));
        center.addChild(categorybar);

        mainSection.addChild(rightbar);
        mainSection.addChild(leftbar);
        mainSection.addChild(center);

        superSection.addChild(topbar);
        superSection.addChild(mainSection);

        this.addSection(superSection);
        this.addSection(this.popupSection);

        Events.register(App.Canvas, "keyup", (ev, data) => this.handleKeypress(ev, data));
    }

    handleKeypress(event, data) {
        // console.log(`welcomePage event -> ${data.key} | ${data.code}`);

        switch (data.key) {
            case "a":
                console.log(`page.orderedChildren: ${this.orderedChildren.map(sec => sec.debugName)}`);
                break;
            case "b":
                this.popupSection.visible = !this.popupSection.visible;
                break;
            case "c":
                App.GlobalState.PropertyCheckTimeout -= 250;
                break;
            case "d":
                App.GlobalState.PropertyCheckTimeout += 250;
                break;
        }

        console.log(`New Timeout: ${App.GlobalState.PropertyCheckTimeout}`);
    }
}
