import { App } from "../lib/datalit/app.js";
import { Button } from "../lib/datalit/controls/button.js";
import { BindingContext } from "../lib/datalit/binding/bindingContext.js";
import { Page } from "../lib/datalit/controls/page";
import { Section } from "../lib/datalit/controls/section";
import { ContentDirection, ControlState, HAlign, VAlign, MIN_SIZE, SizeTargetType } from "../lib/datalit/enums";
import { Label } from "../lib/datalit/controls/label";
import { ScrollSection } from "../lib/datalit/controls/scrollSection";
import { Events } from "../lib/datalit/events/events.js";
import { IconButton } from "../lib/datalit/controls/iconButton.js";
import utils from "../lib/datalit/utils.js";
import factory from "../lib/datalit/factory.js";

export class BudgetAnalyzerPage extends Page {
    constructor() {
        super();

        this.debugName = "budgetAnalyzerPage";
        this.backgroundColor = "999d99";
        this.contentDirection = ContentDirection.VERTICAL;

        let bindingContext = new BindingContext(this, {
            navigateCommand: btn => this.handleNavigateButton(btn)
        });

        this.navbar = factory.generateMarkupObjects("budgetAnalyzer.navbar", bindingContext);
        this.enterExpenseSection = factory.generateMarkupObjects("budgetAnalyzer.enterExpenseSection", bindingContext);

        this.addSection(this.navbar);
        this.addSection(this.enterExpenseSection);

        this.updateTime();
        setInterval(() => this.updateTime(), 1000);

        // this.scrollSection = new ScrollSection({
        // margin: 10,
        // backgroundColor: "444464"
        // });

        // this.addSection(this.scrollSection);

        // let labelProps = {
        //     text: "Hello Scott",
        //     fontColor: "ddddfd",
        //     halign: HAlign.CENTER,
        //     valign: VAlign.TOP,
        //     fontSize: 20,
        //     margin: 20
        // };
        // for (let i = 0; i < 20; i++) this.scrollSection.addChild(new Label(labelProps));
        // this.scrollSection.addChild(
        //     new Button({
        //         text: "CLICK ME",
        //         halign: HAlign.CENTER,
        //         valign: VAlign.TOP,
        //         margin: 20
        //     })
        // );

        // Apply bindings
        bindingContext.initializeBindings();

        Events.register(App.Canvas, "keydown", (ev, data) => this.handleKeypress(data));
    }

    updateTime() {
        let today = new Date();
        this.navbar.todayLabel.text = `${today.getHours()}:${today
            .getMinutes()
            .toString()
            .padStart(2, "0")} Monday ${utils.monthNumberToName(
            today.getMonth()
        )} ${today.getDate()}, ${today.getFullYear()}`;
    }

    handleNavigateButton(btn) {
        console.log("navigation: " + btn.debugName);
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
