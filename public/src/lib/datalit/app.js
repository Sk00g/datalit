import { Assets } from "./assetManager.js";
import { Color } from "./enums.js";
import { Events } from "./events/events.js";
import { PageManager } from "./pageManager.js";

var INSTANCE = null;

class DatalitApp {
    constructor() {
        this.Canvas = document.getElementById("canvas");
        this.Context = this.Canvas.getContext("2d");
        this.GlobalState = {
            DefaultBackground: Color.WHITE,
            DefaultFontSize: 12,
            RedrawRequired: true,
            DirtySections: [],
            Clipboard: ""
        };

        // Specify the alpha resolution strategy
        this.Context.globalCompositeOperation = "destination-over";

        // Initialize the canvas to the appropriate size
        this.resizeCanvas();

        // All resize events results in the resizing of the canvas
        Events.register(window, "resize", (ev, data) => this.resizeCanvas(), { priority: 1 });

        // For tracking main application loop elapsed
        this.lastTick = 0;

        // Create the base manager classes
        this.pageManager = new PageManager();

        // Save to static Singleton variable
        INSTANCE = this;
    }

    addDrawTarget(dirtySection) {
        // Don't add duplicates
        if (this.GlobalState.DirtySections.indexOf(dirtySection) != -1) return;

        // Don't add children of existing draw targets
        let parent = dirtySection.__parent || null;
        while (parent) {
            if (this.GlobalState.DirtySections.indexOf(parent) != -1) return;
            else parent = parent.__parent;
        }

        name = dirtySection.debugName || dirtySection.constructor.name;
        // console.log("adding draw target " + name);
        this.GlobalState.DirtySections.push(dirtySection);
    }

    addPage(newPage, options = {}) {
        this.pageManager.pushPage(newPage);
    }

    resizeCanvas() {
        console.log("resizing canvas");
        this.Canvas.width = window.innerWidth;
        this.Canvas.height = window.innerHeight;
    }

    run(currentTime) {
        let elapsed = currentTime - INSTANCE.lastTick;
        INSTANCE.lastTick = currentTime;

        INSTANCE.pageManager.update(elapsed);

        // Redraw everything if requested
        if (INSTANCE.GlobalState.RedrawRequired) {
            // console.log("redrawing full screen");
            // console.log(INSTANCE.GlobalState.DirtySections.length);
            INSTANCE.GlobalState.RedrawRequired = false;
            INSTANCE.GlobalState.DirtySections = [];
            INSTANCE.Context.clearRect(0, 0, INSTANCE.Canvas.width, INSTANCE.Canvas.height);
            INSTANCE.pageManager.draw();
        }

        // Redraw only dirty sections (INSTANCE doesn't yet work with ScrollSections)
        if (INSTANCE.GlobalState.DirtySections.length > 0) {
            // console.log("redrawing dirty sections: " + INSTANCE.GlobalState.DirtySections.length);
            for (let i = 0; i < INSTANCE.GlobalState.DirtySections.length; i++) {
                console.log(`redrawing ${INSTANCE.GlobalState.DirtySections[i].debugName}`);
                INSTANCE.Context.clearRect(...INSTANCE.GlobalState.DirtySections[i].viewingRect);
                INSTANCE.GlobalState.DirtySections[i].draw(App.Context);
            }
            INSTANCE.GlobalState.DirtySections = [];
        }

        window.requestAnimationFrame(INSTANCE.run);
    }
}

console.log("creating new app instance");

// Export a single instance of this class
export const App = new DatalitApp();
