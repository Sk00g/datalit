export const Colors = Object.freeze({
    RED: "rgb(255, 0, 0)",
    GREEN: "rgb(0, 255, 0)",
    BLUE: "rgb(0, 0, 255)",
    OFFWHITE: "rgb(210, 210, 210)",
    OFFBLACK: "rgb(20, 20, 20)"
});

export const ControlState = Object.freeze({
    DISABLED: 0,
    ENABLED: 1,
    HOVERED: 2,
    FOCUSED: 3,
    DEPRESSED: 4,
    DRAGGED: 5
});

export const Align = Object.freeze({
    TOP: 0,
    BOTTOM: 1,
    CENTER: 2,
    FREE: 3,
    FILL: 4,
    RIGHT: 5,
    LEFT: 6
});

export const PageState = Object.freeze({
    READY: 0,
    ACTIVE: 1
});

export const FlowType = Object.freeze({
    HORIZONTAL: 0,
    VERTICAL: 1
});

export const SizeTarget = Object.freeze({
    MINIMUM: 0xff
});

export default {
    Colors,
    ControlState,
    Align,
    PageState,
    FlowType,
    SizeTarget
};
