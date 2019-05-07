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
    CENTER: "CENTER",
    FILL: "FILL",
    STRETCH: "STRETCH"
});

export const VAlign = Object.freeze({
    TOP: "TOP",
    BOTTOM: "BOTTOM",
    CENTER: "CENTER",
    FILL: "FILL",
    STRETCH: "STRETCH"
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

export default {
    Color,
    ControlState,
    HAlign,
    VAlign,
    ContentDirection,
    PageState,
    EventSourceType,
    MouseButton,
    Modifier
};
