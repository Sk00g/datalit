import { ContentDirection, Color, HAlign, VAlign, ControlState } from "../lib/datalit/enums.js";
import utils from "../lib/datalit/utils.js";
import { Page } from "../lib/datalit/controls/page.js";
import { Section } from "../lib/datalit/controls/section.js";
import { Events } from "../lib/datalit/events/events.js";
import { App } from "../lib/datalit/app.js";
// import { Icon } from "../lib/datalit/controls/icon.js";
import { Assets } from "../lib/datalit/assetManager.js";
import { Rect } from "../lib/datalit/controls/rect.js";
import { Label } from "../lib/datalit/controls/label.js";
import { Circle } from "../lib/datalit/controls/circle.js";
import { TextButton } from "../lib/datalit/controls/textButton.js";

export class WelcomePage extends Page {
    constructor() {
        super();

        this.contentDirection = ContentDirection.HORIZONTAL;
        this.debugName = "welcomePage";

        let main = new Section({
            contentDirection: ContentDirection.VERTICAL,
            halign: HAlign.FILL,
            valign: VAlign.FILL,
            backgroundColor: Assets.BaseTheme.colors.BackgroundMain,
            zValue: 1,
            debugName: "main"
        });
        let text = new TextButton("Hello Scott", () => console.log("hello scott"), {
            fontSize: 16,
            fontColor: "dd",
            halign: HAlign.CENTER,
            valign: VAlign.CENTER
        });
        text.addStyle(ControlState.HOVERED, [["fontColor", Color.WHITE]]);
        text.addStyle(ControlState.DISABLED, [["fontColor", "99"]]);
        text.addStyle(ControlState.DEPRESSED, [["fontColor", "bb"], ["margin", [2, 2, 0, 0]]]);
        main.addChild(text);
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

        this.text = text;
    }

    handleKeypress(event, data) {
        // console.log(`welcomePage event -> ${data.key} | ${data.code}`);

        switch (data.key) {
            case "a":
                this.text.disable();
                break;
            case "b":
                this.text.enable();
                break;
        }
    }
}
