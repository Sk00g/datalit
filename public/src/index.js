"use strict";

import { App } from "./lib/datalit/app.js";
import { WelcomePage } from "./pages/welcomePage.js";

console.log(`... initialized application (${[window.innerWidth, window.innerHeight]})`);

setTimeout(() => {
    App.addPage(new WelcomePage(), { default: true });
    App.run();
}, 200);
