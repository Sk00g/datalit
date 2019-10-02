import { App } from "../lib/datalit/app.js";
import { Button } from "../lib/datalit/controls/button.js";
import { BindingContext } from "../lib/datalit/binding/bindingContext.js";
import { Page } from "../lib/datalit/controls/page";
import { Section } from "../lib/datalit/controls/section";
import { ContentDirection, ControlState, HAlign, VAlign, MIN_SIZE, SizeTargetType, Color } from "../lib/datalit/enums";
import { Label } from "../lib/datalit/controls/label";
import { ScrollSection } from "../lib/datalit/controls/scrollSection";
import { Events } from "../lib/datalit/events/events.js";
import { IconButton } from "../lib/datalit/controls/iconButton.js";
import utils from "../lib/datalit/utils.js";
import factory from "../lib/datalit/factory.js";
import { TextInput } from "../lib/datalit/controls/textInput.js";
import { ComboBox } from "../lib/datalit/controls/comboBox.js";

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
        // this.enterExpenseSection = factory.generateMarkupObjects("budgetAnalyzer.enterExpenseSection", bindingContext);

        this.addSection(this.navbar);
        // this.addSection(this.enterExpenseSection);

        let main = new Section({ backgroundColor: "999d99" });
        let combo = new ComboBox({
            margin: 20,
            halign: HAlign.CENTER,
            valign: VAlign.CENTER,
            backgroundColor: "dddddd"
        });
        main.addChild(combo);
        this.addSection(main);

        this.updateTime();
        // setInterval(() => this.updateTime(), 5000);

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
                this.scrollSection.addChild(new Label(this.labelProps));
                break;
            case "b":
                console.log("removing?");
                this.scrollSection.removeChild(this.scrollSection._contentSection.children[0]);
                break;
        }
    }
}
