"use strict";

import { WelcomePage } from "./pages/welcomePage.js";
import { Assets } from "./lib/datalit/assetManager.js";

let canvas = document.getElementById("canvas");
let context = canvas.getContext("2d");

var page = new WelcomePage(context);

console.log(`... initialized application (${[window.innerWidth, window.innerHeight]})`);

var img = Assets.getImage("search-purple");
var img2 = Assets.getImage("login-teal");
var img3 = Assets.getImage("char");

function main(currentTime) {
    context.clearRect(0, 0, canvas.width, canvas.height);

    context.drawImage(img, 10, 10);
    context.drawImage(img2, 100, 10);
    context.drawImage(img3, 50, 50);

    window.requestAnimationFrame(main);
}

main();
