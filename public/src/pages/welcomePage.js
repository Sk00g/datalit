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
