import { Section } from "./section";

export class ScrollSection extends Section {
    constructor(initialProperties = {}, withholdEvents = false) {
        super(initialProperties);

        // Unique Properties
        this._horizontalScrollable = true;
        this._verticalScrollable = true;
        this.registerProperty("horizontalScrollable");
        this.registerProperty("verticalScrollable");

        // Apply base theme before customized properties
        this.applyTheme("Section");

        this.updateProperties(initialProperties);

        // Will typically continue to withold events until child constructor sets = false
        // However, new Section() will sometimes be called directly
        this._withholdingEvents = withholdEvents;
    }

    //#region Method overrides
    prerenderCheck(totalSpace) {
        super.prerenderCheck(totalSpace);

        // ScrollSections cannot have [h|v]fillTarget == -1 if that axis is scrollable, as they by definition have limitless size
        if (this.horizontalScrollable && this.hfillTarget == -1)
            datalitError("illogical", ["ScrollSection.hfillTarget", -1, "ScrollSection.horizontalScrollable", "true"]);
        if (this.verticalScrollable && this.vfillTarget == -1)
            datalitError("illogical", ["ScrollSection.vfillTarget", -1, "ScrollSection.verticalScrollable", "true"]);
    }

    //#region Unique property definitions
    get horizontalScrollable() {
        return this._horizontalScrollable;
    }
    set horizontalScrollable(flag) {
        if (typeof flag != "boolean")
            datalitError("propertySet", ["ScrollSection.horizontalScrollable", String(flag), "BOOL"]);

        this._horizontalScrollable = flag;
        this.notifyPropertyChange("horizontalScrollable");
    }

    get verticalScrollable() {
        return this._verticalScrollable;
    }
    set verticalScrollable(flag) {
        if (typeof flag != "boolean")
            datalitError("propertySet", ["ScrollSection.verticalScrollable", String(flag), "BOOL"]);

        this._verticalScrollable = flag;
        this.notifyPropertyChange("verticalScrollable");
    }
}
