import { Assets } from "./assetManager.js";
import { Color } from "./enums.js";
import { Events } from "./events/events.js";
import { PageManager } from "./pageManager.js";

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
        let elapsed = currentTime - this.lastTick;
        this.lastTick = currentTime;

        this.pageManager.update(elapsed);

        // Redraw everything if requested
        if (this.GlobalState.RedrawRequired) {
            console.log("redrawing full screen");
            this.GlobalState.RedrawRequired = false;
            this.GlobalState.DirtySections = [];
            this.Context.clearRect(0, 0, this.Canvas.width, this.Canvas.height);
            this.pageManager.draw();
        }

        // Redraw only dirty sections (this doesn't yet work with ScrollSections)
        if (this.GlobalState.DirtySections.length > 0) {
            console.log("redrawing dirty sections: " + this.GlobalState.DirtySections.length);
            for (let i = 0; i < this.GlobalState.DirtySections.length; i++) {
                this.Context.clearRect(...this.GlobalState.DirtySections[i].viewingRect);
                this.GlobalState.DirtySections[i].draw(App.Context);
            }
            this.GlobalState.DirtySections = [];
        }

        window.requestAnimationFrame(this.run);
    }
}

console.log("creating new app instance");

// Export a single instance of this class
export const App = new DatalitApp();
