import { Button } from "./controls/button";
import { Circle } from "./controls/circle";
import { ComboBox } from "./controls/comboBox";
import { Icon } from "./controls/icon";
import { IconButton } from "./controls/iconButton";
import { Label } from "./controls/label";
import { LabelButton } from "./controls/labelButton";
import { ListSection } from "./controls/listSection";
import { Rect } from "./controls/rect";
import { ScrollSection } from "./controls/scrollSection";
import { Section } from "./controls/section";
import { SectionHost } from "./controls/sectionHost";
import { TextEdit } from "./controls/textEdit";
import { TextInput } from "./controls/textInput";
import { Assets } from "./assetManager.js";

var OID_COUNTER = 0;
var CONTROL_CLASSES = null;
function loadClasses() {
    CONTROL_CLASSES = {
        Button,
        Circle,
        ComboBox,
        Icon,
        IconButton,
        Label,
        LabelButton,
        ListSection,
        Rect,
        ScrollSection,
        Section,
        SectionHost,
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

    // Generate the control using this factory's pattern
    var newControl = generateControl(source.type, { debugName: source.id, ...source.properties }, styles);

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

/* THE ALL POWERFUL CONTROL GENERATOR METHOD
    This should be the ONLY way that controls are generated in datalit by the user
    Generating from markup also relies on this function
    Complex controls generating children however, cannot use this method for circular referencing reasons. Therefore, complex controls are responsible for:
        * instantiating their composite classes using the constructor    
        * applying any themes they want / need
        * applying any initial properties after creation
        * applying any styles after initial property application
        * executing the 'activate' function once the above steps are complete

    prop: controlClass ->       String value of the control class to be created
    prop: initialProperties ->  Specific properties that override theme
    prop: styles ->             For DynamicControl derivatives, provide different ControlState styles as dict object. 
                                If this is not empty, a ControlState.DEFAULT style will be generated
    prop: theme ->              Theme to apply, defaults to the BaseTheme
                                If explicitly set to 'null', then no theme will be applied
*/
export function generateControl(controlClass, initialProperties = {}, styles = {}, theme = Assets.BaseTheme) {
    // Load in dynamic class object list if first call
    if (!CONTROL_CLASSES) loadClasses();

    // Generate new object using generic Control object constructor
    var newControl = new CONTROL_CLASSES[controlClass]();

    // Apply theme before customized properties
    if (theme) newControl.applyTheme(controlClass, theme);

    // Apply custom (non-theme, non-style) initial properties
    newControl.updateProperties(initialProperties);

    // Add custom (non-theme) styles if present
    if (styles && styles.length > 0) {
        for (const [key, value] of Object.entries(styles)) {
            let propertyDefinitions = [];
            for (const [propKey, propValue] of Object.entries(value)) propertyDefinitions.push([propKey, propValue]);
            newControl.addStyle(key, propertyDefinitions);
        }
    }

    // Run class-specific activation logic. Goes in direction child -> ancestor
    newControl.activate();

    return newControl;
}

export default {
    generateMarkupObjects,
    generateControl
};
