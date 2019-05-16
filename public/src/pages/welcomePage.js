import { App } from "../lib/datalit/app.js";
import { Assets } from "../lib/datalit/assetManager.js";
import { Button } from "../lib/datalit/controls/button";
import { Circle } from "../lib/datalit/controls/circle.js";
import { ContentDirection, Color, HAlign, VAlign, ControlState } from "../lib/datalit/enums.js";
import { Events } from "../lib/datalit/events/events.js";
import { Icon } from "../lib/datalit/controls/icon.js";
import { Label } from "../lib/datalit/controls/label.js";
import { Page } from "../lib/datalit/controls/page.js";
import { Rect } from "../lib/datalit/controls/rect.js";
import { Section } from "../lib/datalit/controls/section.js";
import { LabelButton } from "../lib/datalit/controls/labelButton.js";
import utils from "../lib/datalit/utils.js";

export class WelcomePage extends Page {
    constructor() {
        super();

        this.debugName = "welcomePage";
        this.contentDirection = ContentDirection.HORIZONTAL;

        let main = new Section({
            contentDirection: ContentDirection.VERTICAL,
            halign: HAlign.FILL,
            valign: VAlign.FILL,
            backgroundColor: Assets.BaseTheme.colors.BackgroundMain,
            zValue: 1,
            debugName: "main"
        });

        // main.addChild(new Button("Click Me", () => console.log("Y'all gone dun it")));

        // let topbar = new Section({
        //     contentDirection: ContentDirection.HORIZONTAL,
        //     halign: HAlign.FILL,
        //     valign: VAlign.TOP,
        //     vfillTarget: -1,
        //     debugName: "topbar"
        // });
        // topbar.addChild(
        //     new Icon(Assets.Images.searchPurple, [24, 24], { halign: HAlign.CENTER, valign: VAlign.CENTER })
        // );
        // topbar.addChild(new Label("Hello Katie", { halign: HAlign.CENTER }));
        // topbar.addChild(new LabelButton("Click Me", () => console.log("do stuff"), { halign: HAlign.CENTER }));

        // main.addChild(topbar);

        let left = new Section({
            contentDirection: ContentDirection.VERTICAL,
            halign: HAlign.LEFT,
            valign: VAlign.FILL,
            backgroundColor: Assets.BaseTheme.colors.BackgroundDark,
            hfillTarget: 0.3,
            debugName: "left"
        });

        this.addSection(main);
        this.addSection(left);

        Events.register(App.Canvas, "keyup", (ev, data) => this.handleKeypress(ev, data));
    }

    handleKeypress(event, data) {
        // console.log(`welcomePage event -> ${data.key} | ${data.code}`);

        switch (data.key) {
            case "a":
                break;
            case "b":
                break;
        }
    }
}
