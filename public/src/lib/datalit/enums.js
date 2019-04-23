export const EventSourceType = Object.freeze({
    CONTROL: "CONTROL",
    DATAMODEL: "DATAMODEL",
    NATIVE: "NATIVE"
});

export const Colors = Object.freeze({
    RED: "rgb(255, 0, 0)",
    GREEN: "rgb(0, 255, 0)",
    BLUE: "rgb(0, 0, 255)",
    OFFWHITE: "rgb(210, 210, 210)",
    OFFBLACK: "rgb(20, 20, 20)"
});

export const ControlState = Object.freeze({
    DISABLED: "DISABLED",
    ENABLED: "ENABLED",
    HOVERED: "HOVERED",
    FOCUSED: "FOCUSED",
    DEPRESSED: "DEPRESSED",
    DRAGGED: "DRAGGED"
});

export const Align = Object.freeze({
    TOP: "TOP",
    BOTTOM: "BOTTOM",
    CENTER: "CENTER",
    FREE: "FREE",
    FILL: "FILL",
    RIGHT: "RIGHT",
    LEFT: "LEFT"
});

export const PageState = Object.freeze({
    READY: "READY",
    ACTIVE: "ACTIVE"
});

export const FlowType = Object.freeze({
    HORIZONTAL: "HORIZONTAL",
    VERTICAL: "VERTICAL"
});

export const SizeTarget = Object.freeze({
    MINIMUM: "MINIMUM"
});

export default {
    Colors,
    ControlState,
    Align,
    PageState,
    FlowType,
    SizeTarget,
    EventSourceType
};
