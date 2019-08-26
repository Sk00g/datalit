import { Button } from "./controls/button";
import { Circle } from "./controls/circle";
import { Icon } from "./controls/icon";
import { Label } from "./controls/label";
import { LabelButton } from "./controls/labelButton";
import { ListSection } from "./controls/listSection";
import { Rect } from "./controls/rect";
import { ScrollSection } from "./controls/scrollSection";
import { Section } from "./controls/section";
import { TextEdit } from "./controls/textEdit";
import { TextInput } from "./controls/textInput";
import { Assets } from "./assetManager.js";

var CONTROL_CLASSES = null;
function loadClasses() {
    // import("./controls/button").then(({ Button }) => {
    //     CONTROL_CLASSES = { Button };
    // });
    CONTROL_CLASSES = {
        Button,
        Circle,
        Icon,
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

export function generateControlFromControl(source) {
    if (!CONTROL_CLASSES) loadClasses();

    var clone = CONTROL_CLASSES[`${source.constructor.name}`]();
    // ????? is this even possible?
    return null;
}

function _generateControl(source) {
    var newControl = new CONTROL_CLASSES[source.type]({ debugName: source.id, ...source.properties });

    if (source.children && source.children.length > 0) {
        for (let childSource of source.children) {
            newControl[childSource.id] = _generateControl(childSource);
            newControl.addChild(newControl[childSource.id]);
        }
    }

    return newControl;
}

export function generateControlFromMarkup(name) {
    // Load in dynamic class object list
    if (!CONTROL_CLASSES) loadClasses();

    const template = Assets.getMarkup(name);

    // console.log(JSON.stringify(template));

    return _generateControl(template);
}

export default {
    generateControlFromControl,
    generateControlFromMarkup
};
