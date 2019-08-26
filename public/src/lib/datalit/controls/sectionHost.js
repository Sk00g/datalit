import { HAlign } from "../enums";
import { datalitError } from "../errors";
import { Section } from "../controls/section.js";

/* Low level control used for 'hosting' any number of sections within itself. Basically a simplified layer over Section that allows basic navigation methods
 */

export class SectionHost extends Section {
    constructor(initialProperties = {}, withholdingEvents = false, initialSectionList = []) {
        super();

        // Track all sections to be hosted
        this._sectionStack = initialSectionList;
        if (this._sectionStack) super.addChild(this.getActiveSection());

        // Apply base theme before customized properties
        this.applyTheme("SectionHost");

        this.updateProperties(initialProperties);

        this._withholdingEvents = withholdingEvents;
    }

    //region Method Overrides
    addChild(child) {
        throw new Error("Cannot add children to sectionHost, Use addSection()");
    }
    removeChild(child) {
        throw new Error("Cannot have children in sectionHost, Use removeSection()");
    }
    //#endregion

    getActiveSection() {
        return this._sectionStack.length > 0 ? this._sectionStack[this._sectionStack.length - 1] : null;
    }

    navigateBack() {
        if (this._sectionStack.length <= 1) {
            console.log("SectionHost.navigateBack: only one section exists");
            return;
        }

        // Remove current active section
        var old = this._sectionStack.pop();
        super.removeChild(old);
        this._sectionStack.unshift(old);

        super.addChild(this.getActiveSection());
    }

    navigateTo(section) {
        if (this.getActiveSection() == section) return;

        var index = this._sectionStack.indexOf(section);
        if (index == -1) throw new Error("SectionHost.navigateTo: section not found");

        // Remove current active section
        super.removeChild(this.getActiveSection());

        // Slice given section from current location and push to front
        index = this._sectionStack.indexOf(section);
        this._sectionStack.splice(index, 1);
        this._sectionStack.push(section);
        super.addChild(section);
    }

    addSection(section) {
        if (!section.isArranger) throw new Error("Only Section objects can be added to a SectionHost");

        // Child sections must use the entire SectionHost visible space
        section.halign = HAlign.FILL;
        section.valign = VAlign.FILL;

        // Only push to stack, addChild / removeChild are used for deciding which section is actually displayed
        if (this.getActiveSection()) super.removeChild(this.getActiveSection());

        this._sectionStack.push(section);
        super.addChild(section);
    }
}
