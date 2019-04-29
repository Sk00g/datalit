export class ControlEventLayer {
    constructor(manager) {
        this.manager = manager;

        // Keep track of all controls which currently have the mouse 'hovering' in them
        // This allows for direct 'mouseenter' and 'mouseleave' events
        this.hoveredControls = [];
    }

    _gatherHitChildren(section, point) {
        // Gather all children, including sections that contain the given point
        let hits = section.children.filter(ctrl => ctrl.isPointWithin(point));

        // For each section hit, gather its children that are also hit, using recursion
        let sections = hits.filter(ctrl => ctrl.constructor.name == "Section");
        for (let sec of sections) hits = hits.concat(this._gatherHitChildren(sec, point));

        return hits;
    }

    rerouteKeyboardEvent(type, code, key, repeat, modifiers) {
        // All keyboards are system-wide with canvas as a source
        this.manager.handleEvent(this.manager.canvas, type, {
            code: code,
            key: key,
            repeat: repeat,
            modifiers: modifiers
        });

        // If there is a focused control, it will be the event source as well
        let page = this.manager.activePage;
        if (page && page.focusedControl)
            this.manager.handleEvent(page.focusedControl, type, {
                code: code,
                key: key,
                repeat: repeat,
                modifiers: modifiers
            });
    }

    rerouteMouseEvent(position, type, button, modifiers) {
        if (this.manager.activePage == null) return;

        let targetControls = [];
        for (let section of this.manager.activePage.children) {
            if (section.isPointWithin(position)) {
                targetControls.push(section);
                targetControls = targetControls.concat(this._gatherHitChildren(section, position));
            }
        }

        for (let ctrl of targetControls) {
            this.manager.handleEvent(ctrl, type, {
                position: position,
                button: button,
                modifiers: modifiers
            });
        }

        // Handle mouseenter/mouseleave logic
        if (type == "mousemove") {
            let unhovers = this.hoveredControls.filter(ctrl => targetControls.indexOf(ctrl) == -1);
            for (let ctrl of unhovers) {
                this.hoveredControls.splice(this.hoveredControls.indexOf(ctrl), 1);
                this.manager.handleEvent(ctrl, "mouseleave", {});
            }
            let newhovers = targetControls.filter(ctrl => this.hoveredControls.indexOf(ctrl) == -1);
            for (let ctrl of newhovers) {
                this.hoveredControls.push(ctrl);
                this.manager.handleEvent(ctrl, "mouseenter", {});
            }
        }
    }
}
