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
import factory from "../lib/datalit/controlFactory.js";
import { TextInput } from "../lib/datalit/controls/textInput.js";

export class TestPage extends Page {
    constructor() {
        super();

        this.debugName = "testPage";
        this.backgroundColor = "999d99";
        this.contentDirection = ContentDirection.VERTICAL;

        let bindingContext = new BindingContext(this, {});

        this.main = new Section({
            debugName: "main"
        });
        // this.input = new TextInput();
        // this.main.addChild(this.input);

        this.addSection(this.main);

        // Apply bindings
        bindingContext.initializeBindings();

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
