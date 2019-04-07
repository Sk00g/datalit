"use strict";

import core from "../lib/core/core.js";
import { EventManager } from "../lib/events/events.js";
import { PageManager } from "../lib/core/pageManager.js";
import { WelcomePage } from "./pages/welcomePage.js";

let canvas = document.getElementById("canvas");
let context = canvas.getContext("2d");

core.initialize(context);

let eventManager = new EventManager();
let pageManager = new PageManager(eventManager);

pageManager.pushPage(new WelcomePage(context));

console.log(`... initialized application (${[window.innerWidth, window.innerHeight]})`);

let lastTick = 0;
function main(currentTime) {
  let elapsed = currentTime - lastTick;
  lastTick = currentTime;

  // eventManager.update()
  pageManager.update(elapsed);

  if (core.GlobalState.RedrawRequired) {
    core.GlobalState.RedrawRequired = false;

    context.clearRect(0, 0, canvas.width, canvas.height);
    pageManager.draw(context);
  }

  window.requestAnimationFrame(main);
}

main();
