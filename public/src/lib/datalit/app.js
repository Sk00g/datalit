import enums from "./enums.js";
import { EventManager } from "./events/events.js";
import { PageManager } from "./pageManager.js";

class DatalitApp {
    constructor() {
        this.Canvas = document.getElementById("canvas");
        this.Context = this.Canvas.getContext("2d");
        this.GlobalState = {
            DefaultBackground: enums.Colors.OFFWHITE,
            DefaultMargin: [10, 10, 10, 10],
            RedrawRequired: true,
            ClearRegions: []
        };

        // Specify the alpha resolution strategy
        this.Context.globalCompositeOperation = "destination-over";

        // Initialize the canvas to the appropriate size
        this.resizeCanvas();

        // All resize events results in the resizing of the canvas
        window.addEventListener("resize", this.resizeCanvas);

        // For tracking main application loop elapsed
        this.lastTick = 0;

        // Create the base manager classes
        this.eventManager = new EventManager();
        this.pageManager = new PageManager(this.eventManager);
    }

    addPage(newPage, options = {}) {
        this.pageManager.pushPage(newPage);
    }

    resizeCanvas() {
        this.Canvas.width = window.innerWidth;
        this.Canvas.height = window.innerHeight;
    }

    run(currentTime) {
        let elapsed = currentTime - this.lastTick;
        this.lastTick = currentTime;

        if (this.GlobalState.RedrawRequired) {
            this.GlobalState.RedrawRequired = false;
            this.Context.clearRect(0, 0, this.Canvas.width, this.Canvas.height);

            this.pageManager.draw(this.Context);
        }

        this.pageManager.update(elapsed);

        window.requestAnimationFrame(this.run);
    }
}

console.log("creating new app instance");

// Export a single instance of this class
export const App = new DatalitApp();
