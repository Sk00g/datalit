import { Button } from "./controls/button";
import { Circle } from "./controls/circle";
import { Icon } from "./controls/icon";
import { IconButton } from "./controls/iconButton";
import { Label } from "./controls/label";
import { LabelButton } from "./controls/labelButton";
import { ListSection } from "./controls/listSection";
import { Rect } from "./controls/rect";
import { ScrollSection } from "./controls/scrollSection";
import { Section } from "./controls/section";
import { TextEdit } from "./controls/textEdit";
import { TextInput } from "./controls/textInput";
import { Assets } from "./assetManager.js";

var OID_COUNTER = 0;
var CONTROL_CLASSES = null;
function loadClasses() {
    // import("./controls/button").then(({ Button }) => {
    //     CONTROL_CLASSES = { Button };
    // });
    CONTROL_CLASSES = {
        Button,
        Circle,
        Icon,
        IconButton,
        Label,
        LabelButton,
        ListSection,
        Rect,
        ScrollSection,
        Section,
        TextEdit,
        TextInput
    };
}

function _generateControl(source) {
    // Assign a generic name if no id is present
    if (!source.id) source.id = `${OID_COUNTER++}_${source.type}`;

    // Delete any properties that equal null (binding path replacements)
    Object.keys(source.properties)
        .filter(val => source.properties[val] == null)
        .map(key => delete source.properties[key]);

    // Extract style list if present
    let styles = null;
    if (source.properties.styles) {
        styles = source.properties.styles;
        delete source.properties.styles;
    }

    // Generate new object using generic Control object constructor
    var newControl = new CONTROL_CLASSES[source.type]({ debugName: source.id, ...source.properties });

    // Add styles if present
    if (styles) {
        for (const [key, value] of Object.entries(styles)) {
            let propertyDefinitions = [];
            for (const [propKey, propValue] of Object.entries(value)) propertyDefinitions.push([propKey, propValue]);
            newControl.addStyle(key, propertyDefinitions);
        }
    }

    if (source.children && source.children.length > 0) {
        for (let childSource of source.children) {
            // Assign a generic name if no id is present
            if (!childSource.id) childSource.id = `${OID_COUNTER++}_${childSource.type}`;
            newControl[childSource.id] = _generateControl(childSource);
            newControl.addChild(newControl[childSource.id]);
        }
    }

    return newControl;
}

export function generateMarkupObjects(name, bindingContext = null) {
    // Load in dynamic class object list
    if (!CONTROL_CLASSES) loadClasses();

    let { object, commandBindings } = Assets.getMarkup(name);
    if (bindingContext) bindingContext.addCommandBindings(commandBindings);

    // console.log(JSON.stringify(object));

    OID_COUNTER = 0;
    return _generateControl(object);
}

export function generateControl(controlClass, initialProperties, styles, theme = Assets.BaseTheme) {
    // Generate new object using generic Control object constructor
    var newControl = new CONTROL_CLASSES[controlClass]();

    // Apply base theme before customized properties
    newControl.applyTheme(controlClass, theme);

    // Apply custom (non-theme, non-style) initial properties
    newControl.updateProperties(initialProperties);

    // Add custom (non-theme) styles if present
    if (styles) {
        for (const [key, value] of Object.entries(styles)) {
            let propertyDefinitions = [];
            for (const [propKey, propValue] of Object.entries(value)) propertyDefinitions.push([propKey, propValue]);
            newControl.addStyle(key, propertyDefinitions);
        }
    }

    // If we have at least one style, generate our default style
    if (newControl.__styles && newControl.__styles.length > 0) newControl.initializeDynamicStyles();
}

export default {
    generateMarkupObjects,
    generateControl
};
