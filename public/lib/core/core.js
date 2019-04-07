function newColor(r, g, b, a = 1.0) {
  return `rgba(${r},${g},${b},${a})`;
}

const Colors = Object.freeze({
  RED: "rgb(255, 0, 0)",
  GREEN: "rgb(0, 255, 0)",
  BLUE: "rgb(0, 0, 255)",
  OFFWHITE: "rgb(210, 210, 210)",
  OFFBLACK: "rgb(20, 20, 20)"
});

const ControlState = Object.freeze({
  DISABLED: 0,
  ENABLED: 1,
  HOVERED: 2,
  FOCUSED: 3,
  DEPRESSED: 4,
  DRAGGED: 5
});

const Align = Object.freeze({
  TOP: 0,
  BOTTOM: 1,
  CENTER: 2,
  FREE: 3,
  FILL: 4,
  RIGHT: 5,
  LEFT: 6
});

const PageState = Object.freeze({
  READY: 0,
  ACTIVE: 1
});

const FlowType = Object.freeze({
  HORIZONTAL: 0,
  VERTICAL: 1
});

const SizeTarget = Object.freeze({
  MINIMUM: 0xff
});

function resizeCanvas() {
  let canvas = document.getElementById("canvas");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function initialize(context, defaultBackground = Colors.OFFWHITE) {
  // Define the app-wide default background
  GlobalState.DefaultBackground = defaultBackground;

  // Specify the alpha resolution strategy
  context.globalCompositeOperation = "destination-over";

  // Initialize the canvas to the appropriate size
  resizeCanvas();

  // All resize events results in the resizing of the canvas
  window.addEventListener("resize", resizeCanvas);
}

let GlobalState = {
  DefaultBackground: Colors.OFFWHITE,
  DefaultMargin: 10,
  RedrawRequired: true,
  ClearRegions: []
};

export default {
  Colors,
  ControlState,
  Align,
  PageState,
  FlowType,
  SizeTarget,
  initialize,
  newColor,
  GlobalState
};
