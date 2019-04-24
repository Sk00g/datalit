export function newColor(r, g, b, a = 1.0) {
    return `rgba(${r},${g},${b},${a})`;
}

export function comparePoints(pointA, pointB) {
    return pointA[0] == pointB[0] && pointA[1] == pointB[1];
}

export default {
    newColor,
    comparePoints
};
