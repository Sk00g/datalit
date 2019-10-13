import { App } from "../lib/datalit/app.js";
import { BindingContext } from "../lib/datalit/binding/bindingContext.js";
import { ContentDirection, ControlState, HAlign, VAlign, MIN_SIZE, SizeTargetType, Color } from "../lib/datalit/enums";
import { Events } from "../lib/datalit/events/events.js";
import { Page } from "../lib/datalit/controls/page";
import utils from "../lib/datalit/utils.js";
import factory from "../lib/datalit/controlFactory.js";
import themeMap from "../../assets/themeMap.js";
import { Assets } from "../lib/datalit/assetManager.js";

export class BudgetAnalyzerPage extends Page {
    constructor() {
        super();

        this.debugName = "budgetAnalyzerPage";
        this.backgroundColor = "999d99";
        this.contentDirection = ContentDirection.VERTICAL;

        let bindingContext = new BindingContext(this, {
            navigateCommand: btn => this.handleNavigateButton(btn)
        });

        // this.navbar = factory.generateMarkupObjects("budgetAnalyzer.navbar", bindingContext);
        // this.enterExpenseSection = factory.generateMarkupObjects("budgetAnalyzer.enterExpenseSection", bindingContext);

        // this.addSection(this.navbar);
        // this.addSection(this.enterExpenseSection);

        let main = factory.generateControl("Section", { backgroundColor: "FF0000", debugName: "main" });
        let second = factory.generateControl("Section", { backgroundColor: "00FF00", debugName: "second" });
        let title = factory.generateControl("Label", { text: "Hello Scott", margin: 10 });
        let button = factory.generateControl("Button", {
            text: "Press Me",
            action: x => console.log("YOU DID IT"),
            debugName: "button",
            margin: 10
        });
        button.addStyle(ControlState.HOVERED, [["borderColor", Color.BLUE]]);
        button.addStyle(ControlState.DEPRESSED, [["borderColor", "0000FF99"]]);
        let button2 = factory.generateControl(
            "Button",
            {
                text: "No Press Me",
                action: x => console.log("YOU DID NOT DO IT"),
                debugName: "button",
                margin: 10
            },
            {},
            Assets.getTheme(Assets.Themes.greenBusiness)
        );
        let iconButton = factory.generateControl(
            "IconButton",
            {
                imagePath: "categories",
                action: x => console.log("icon button press")
            },
            {},
            Assets.getTheme(Assets.Themes.greenBusiness)
        );
        let input = factory.generateControl("TextInput", {
            margin: 10
        });
        let combo = factory.generateControl("ComboBox", { margin: 10 });
        // let listSection = factory.generateControl("ScrollSection", {
        //     margin: 10,
        //     backgroundColor: "bbbbbb",
        //     verticalScrollbarVisible: false
        // });
        // for (var i = 0; i < 10; i++)
        //     listSection.addChild(factory.generateControl("Label", { margin: 12, text: `Hello (${i})` }));

        main.addChild(title);
        main.addChild(button);
        main.addChild(button2);
        main.addChild(iconButton);
        main.addChild(input);
        main.addChild(combo);
        // main.addChild(listSection);

        this.addSection(main);
        this.addSection(second);

        this.button = button;

        // let main = new Section({ backgroundColor: "999d99" });
        // let combo = new ComboBox({
        //     margin: 20,
        //     halign: HAlign.CENTER,
        //     valign: VAlign.CENTER,
        //     backgroundColor: "dddddd"
        // });
        // main.addChild(combo);
        // this.addSection(main);

        // this.updateTime();
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
                console.log(`this.button.text = ${this.button.text}`);
                break;
            case "b":
                this.button.text = "Hello Kevin";
                break;
            case "c":
                this.button.fontSize = 8;
                break;
        }
    }
}
