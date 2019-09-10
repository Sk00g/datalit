"use strict";

import { App } from "./lib/datalit/app.js";
// import { KTHomePage } from "./pages/kempertime.js";
import { BudgetAnalyzerPage } from "./pages/budgetAnalyzer.js";
import { TestPage } from "./pages/testApp.js";

console.log(`... initialized application (${[window.innerWidth, window.innerHeight]})`);

setTimeout(() => {
    // App.addPage(new WelcomePage(), { default: true });
    // App.addPage(new KTHomePage(), { default: true });
    App.addPage(new BudgetAnalyzerPage(), { default: true });
    // App.addPage(new TestPage(), { default: true });
    App.run();
}, 200);
