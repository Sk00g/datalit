export const SizeTargetType = Object.freeze({
    MIN: "MIN", // Requires alignment
    FILL: "FILL", // Ignores alignment
    PERCENT: "PERCENT", // Requires alignment
    FIXED: "FIXED" // Requires alignment
});

export const Cursor = Object.freeze({
    TEXT: "text",
    DEFAULT: "default",
    WAIT: "wait",
    RESIZE: "resize",
    POINTER: "pointer",
    PROGRESS: "progress"
});

export const Color = Object.freeze({
    TRANSPARENT: "00000000",
    BLACK: "00",
    WHITE: "FF",
    RED: "FF0000",
    GREEN: "00FF00",
    BLUE: "0000FF"
});

export const Modifier = Object.freeze({
    ALT: "ALT",
    SHIFT: "SHIFT",
    CTRL: "CTRL"
});

export const MouseButton = Object.freeze({
    LEFT: 1,
    MIDDLE: 2,
    RIGHT: 3
});

export const EventSourceType = Object.freeze({
    CONTROL: "CONTROL",
    DATAMODEL: "DATAMODEL",
    NATIVE: "NATIVE"
});

export const ControlState = Object.freeze({
    DISABLED: "DISABLED",
    READY: "READY",
    HOVERED: "HOVERED",
    DEPRESSED: "DEPRESSED",
    DRAGGED: "DRAGGED"
});

export const HAlign = Object.freeze({
    RIGHT: "RIGHT",
    LEFT: "LEFT",
    CENTER: "CENTER"
});

export const VAlign = Object.freeze({
    TOP: "TOP",
    BOTTOM: "BOTTOM",
    CENTER: "CENTER"
});

export const ContentDirection = Object.freeze({
    HORIZONTAL: "HORIZONTAL",
    VERTICAL: "VERTICAL",
    FREE: "FREE"
});

export const PageState = Object.freeze({
    READY: "READY",
    ACTIVE: "ACTIVE"
});

export const TEXT_KEYSTROKES = [
    " ",
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h",
    "i",
    "j",
    "k",
    "l",
    "m",
    "n",
    "o",
    "p",
    "q",
    "r",
    "s",
    "t",
    "u",
    "v",
    "w",
    "x",
    "y",
    "z",
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
    "Backquote",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "0",
    "`",
    "~",
    "!",
    "@",
    "#",
    "$",
    "%",
    "^",
    "&",
    "*",
    "(",
    ")",
    "-",
    "=",
    "+",
    "_",
    "[",
    "{",
    "]",
    "}",
    "\\",
    "|",
    ";",
    ":",
    "'",
    '"',
    ",",
    ".",
    "<",
    ">",
    "/",
    "?"
];

export const MOTION_KEYSTROKES = [
    "Backspace",
    "ArrowLeft",
    "ArrowRight",
    "ArrowUp",
    "ArrowDown",
    "Delete",
    "Enter",
    "Home",
    "End"
];

export default {
    Cursor,
    Color,
    ControlState,
    HAlign,
    VAlign,
    ContentDirection,
    PageState,
    EventSourceType,
    MouseButton,
    Modifier,
    SizeTargetType
};
