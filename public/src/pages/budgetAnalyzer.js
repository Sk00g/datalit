import { App } from "../lib/datalit/app.js";
import { BindingContext } from "../lib/datalit/binding/bindingContext.js";
import { BudgetAnalyzerData } from "../dataProviders/budgetAnalyzerData.js";
import { ContentDirection, ControlState, HAlign, VAlign, MIN_SIZE, SizeTargetType, Color } from "../lib/datalit/enums";
import { Events } from "../lib/datalit/events/events.js";
import { Page } from "../lib/datalit/controls/page";
import utils from "../lib/datalit/utils.js";
import factory from "../lib/datalit/controlFactory.js";
import themeMap from "../../assets/themeMap.js";
import { Assets } from "../lib/datalit/assetManager.js";

var Expense = require("../../../sharedModel/expense.js");

export class BudgetAnalyzerPage extends Page {
    constructor() {
        super();

        var data = new Expense({ amount: 24.23, note: "Test Expense" });

        // console.log(data);
        // console.log(data.validate());
        // console.log(data.validate({ amount: -10.23 }));

        this.debugName = "budgetAnalyzerPage";
        this.backgroundColor = "999d99";
        this.contentDirection = ContentDirection.VERTICAL;

        let dataProvider = new BudgetAnalyzerData();
        let bindingContext = new BindingContext(
            this,
            {
                navigateCommand: btn => this.handleNavigateButton(btn),
                saveCommand: btn => dataProvider.persistEndpoint("newExpenseName")
            },
            { coreData: dataProvider }
        );

        this.navbar = factory.generateMarkupObjects("budgetAnalyzer.navbar", bindingContext);
        this.enterExpenseSection = factory.generateMarkupObjects("budgetAnalyzer.enterExpenseSection", bindingContext);

        // DEBUG FOR NOW
        this.enterExpenseSection.mainSection.totalSection.totalExpenseValue.text = "316";
        // -------------

        this.addSection(this.navbar);
        this.addSection(this.enterExpenseSection);

        this.updateTime();
        setInterval(() => this.updateTime(), 5000);

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
                this.enterExpenseSection.mainSection.totalSection.totalExpenseValue.text = "311";
                break;
            case "b":
                break;
            case "c":
                break;
        }
    }
}
