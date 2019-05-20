import { Cursor } from "./enums.js";

export function getWords(input) {
    return input.split(" ");
}

export function changeCursor(newCursor) {
    if (!Cursor.hasOwnProperty(newCursor.toUpperCase())) throw new Error("Invalid cursor: " + String(newCursor));

    document.body.style.cursor = newCursor;
}

export function resolveObjectPath(path, obj = self) {
    return path.reduce((prev, curr) => prev && prev[curr], obj);
}

export function newColor(r, g, b, a = 1.0) {
    return `rgba(${r},${g},${b},${a})`;
}

export function hexColor(hexString) {
    if (hexString.length != 2 && hexString.length != 6 && hexString.length != 8)
        throw new Error("Invalid color hex string");

    if (hexString.length == 2) {
        hexString += hexString + hexString;
    }

    let r = parseInt(hexString.substring(0, 2), 16);
    let g = parseInt(hexString.substring(2, 4), 16);
    let b = parseInt(hexString.substring(4, 6), 16);
    let a = hexString.length == 8 ? parseInt(hexString.substring(6, 8), 16) / 255 : 1.0;

    return `rgb(${r},${g},${b},${a})`;
}

export function comparePoints(pointA, pointB) {
    return pointA[0] == pointB[0] && pointA[1] == pointB[1];
}

// Used for any object that is a list of 4 integers
export function compareSides(sidesA, sidesB) {
    return sidesA[0] == sidesB[0] && sidesA[1] == sidesB[1] && sidesA[2] == sidesB[2] && sidesA[3] == sidesB[3];
}

export function distanceBetweenPoints(pointA, pointB) {
    return Math.sqrt(
        (pointA[0] - pointB[0]) * (pointA[0] - pointB[0]) + (pointA[1] - pointB[1]) * (pointA[1] - pointB[1])
    );
}

export default {
    resolveObjectPath,
    newColor,
    hexColor,
    comparePoints,
    distanceBetweenPoints,
    compareSides,
    changeCursor
};
