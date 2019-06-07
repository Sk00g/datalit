import { App } from "../lib/datalit/app.js";
import { Assets } from "../lib/datalit/assetManager.js";
import { Button } from "../lib/datalit/controls/button";
import { Circle } from "../lib/datalit/controls/circle.js";
import { ContentDirection, Color, HAlign, VAlign, ControlState } from "../lib/datalit/enums.js";
import { Events } from "../lib/datalit/events/events.js";
import { Icon } from "../lib/datalit/controls/icon.js";
import { Label } from "../lib/datalit/controls/label.js";
import { LabelButton } from "../lib/datalit/controls/labelButton.js";
import { Page } from "../lib/datalit/controls/page.js";
import { Rect } from "../lib/datalit/controls/rect.js";
import { Section } from "../lib/datalit/controls/section.js";
import { TextInput } from "../lib/datalit/controls/textInput.js";
import utils from "../lib/datalit/utils.js";

export class WelcomePage extends Page {
    constructor() {
        super();

        this.debugName = "welcomePage";
        this.contentDirection = ContentDirection.VERTICAL;

        let nav = new Section({
            contentDirection: ContentDirection.HORIZONTAL,
            halign: HAlign.FILL,
            valign: VAlign.TOP,
            vfillTarget: 0.12,
            backgroundColor: Assets.BaseTheme.colors.BackgroundMain,
            zValue: 1,
            debugName: "nav"
        });

        let main = new Section({
            contentDirection: ContentDirection.VERTICAL,
            halign: HAlign.FILL,
            valign: VAlign.FILL,
            backgroundColor: Assets.BaseTheme.colors.BackgroundDark,
            debugName: "main"
        });

        this.addSection(nav);
        this.addSection(main);

        Events.register(App.Canvas, "keyup", (ev, data) => this.handleKeypress(ev, data));
    }

    handleKeypress(event, data) {
        // console.log(`welcomePage event -> ${data.key} | ${data.code}`);

        switch (data.key) {
            case "a":
                break;
            case "b":
                break;
            case "c":
                break;
        }
    }
}
