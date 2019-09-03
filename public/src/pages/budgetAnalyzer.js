import { App } from "../lib/datalit/app.js";
import { Button } from "../lib/datalit/controls/button.js";
import { Page } from "../lib/datalit/controls/page";
import { Section } from "../lib/datalit/controls/section";
import { ContentDirection, HAlign, VAlign, MIN_SIZE, SizeTargetType } from "../lib/datalit/enums";
import { Label } from "../lib/datalit/controls/label";
import { ScrollSection } from "../lib/datalit/controls/scrollSection";
import { Events } from "../lib/datalit/events/events.js";
import { IconButton } from "../lib/datalit/controls/iconButton.js";
import utils from "../lib/datalit/utils.js";

export class BudgetAnalyzerPage extends Page {
    constructor() {
        super();

        this.debugName = "budgetAnalyzerPage";
        this.backgroundColor = "999d99";
        this.contentDirection = ContentDirection.VERTICAL;

        this.navbar = new Section({
            contentDirection: ContentDirection.HORIZONTAL,
            valign: VAlign.TOP,
            vsizeTarget: [SizeTargetType.MIN, null],
            backgroundColor: "bbbfbb",
            debugName: "navbar"
        });
        this.navbar.addChild(new IconButton({ imagePath: "categories", debugName: "reportButton" }));
        this.navbar.addChild(new IconButton({ imagePath: "expense", debugName: "reportButton" }));
        this.navbar.addChild(new IconButton({ imagePath: "income", debugName: "reportButton" }));
        this.navbar.addChild(new IconButton({ imagePath: "report", debugName: "reportButton" }));

        this.navbar.addChild(
            new Label({
                text: "Budget Analyzer",
                fontSize: 18,
                margin: [0, 0, 360, 0],
                fontColor: "33333f",
                halign: HAlign.CENTER,
                valign: VAlign.CENTER
            })
        );

        this.addSection(this.navbar);

        // let today = new Date();
        // this.topSection.addChild(
        //     new Label({
        //         text: `${today.getHours()}:${today.getMinutes()} Monday ${utils.monthNumberToName(
        //             today.getMonth()
        //         )} ${today.getDate()}, ${today.getFullYear()}`,
        //         fontType: "Lato",
        //         fontSize: 12,
        //         fontColor: "33333f",
        //         halign: HAlign.RIGHT,
        //         valign: VAlign.CENTER,
        //         margin: 8
        //     })
        // );

        // let labelProps = {
        //     text: "Hello Scott",
        //     fontType: "Lato",
        //     halign: HAlign.CENTER,
        //     valign: VAlign.TOP,
        //     fontSize: 20,
        //     margin: 20
        // };
        // this.scrollSection = new ScrollSection({
        //     contentDirection: ContentDirection.VERTICAL,
        //     halign: HAlign.FILL,
        //     valign: VAlign.FILL,
        //     margin: 10,
        //     backgroundColor: "444464"
        // });
        // this.scrollSection.addChild(new Label(labelProps));
        // this.scrollSection.addChild(new Label(labelProps));
        // this.scrollSection.addChild(new Label(labelProps));
        // this.scrollSection.addChild(new Label(labelProps));
        // this.scrollSection.addChild(new Label(labelProps));
        // this.scrollSection.addChild(new Label(labelProps));
        // this.scrollSection.addChild(new Label(labelProps));
        // this.scrollSection.addChild(new Label(labelProps));
        // this.scrollSection.addChild(new Label(labelProps));
        // this.scrollSection.addChild(new Label(labelProps));
        // this.scrollSection.addChild(new Label(labelProps));
        // this.scrollSection.addChild(new Label(labelProps));
        // this.scrollSection.addChild(
        //     new Button({
        //         text: "CLICK ME",
        //         halign: HAlign.CENTER,
        //         valign: VAlign.TOP,
        //         margin: 20
        //     })
        // );

        Events.register(App.Canvas, "keydown", (ev, data) => this.handleKeypress(data));
    }

    handleKeypress(data) {
        switch (data.key) {
            case "a":
                break;
            case "b":
                break;
        }
    }
}
