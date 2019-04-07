import core from "./core.js";
import { Element } from "./element.js";
import { Rect } from "./rect.js";

export class Section extends Element {
  constructor(
    flowType = core.FlowType.VERTICAL,
    alignment = core.Align.LEFT,
    targetSize = core.SizeTarget.MINIMUM,
    background = core.GlobalState.DefaultBackground
  ) {
    super();

    // console.log("Section constructor");
    if (targetSize != core.SizeTarget.MINIMUM && (targetSize < 0 || targetSize >= 1.0)) {
      throw new Error("Invalid targetSize for Section. Must be between 0 and 1.0");
    }

    this.children = [];
    this.flowType = flowType;
    this.alignment = alignment;
    this.contentAlignment = core.Align.CENTER;
    this.targetSize = targetSize;
    this.margin = [0, 0, 0, 0];

    if (background) {
      this.background = new Rect([0, 0], background);
      this.background.margin = [0, 0, 0, 0];
    }
  }

  render() {
    if (this.children.length < 1) return;
    
    if (this.flowType == core.FlowType.HORIZONTAL) {
      
    } else if (this.flowType == core.FlowType.VERTICAL) {
      // All horizontal positions are the same regardless of alignment
      for (let child of this.children) {
        if (child.fillWidth) {
          child.setSize([this.size[0] - child.margin[0] - child.margin[2], child.size[1]]);
          console.log(`Child: ${child.size[0]} vs Section: ${this.size[0]}`);
          console.log(`Child: ${child.position[0]} vs Section: ${this.position[0]}`);
          child.setPosition([this.position[0] + child.margin[0]]);
          continue;
        }
        
        switch (child.alignment) {
          case core.Align.RIGHT: 
            child.setPosition([this.position[0] + this.size[0] - Math.min(child.calculateViewsize()[0], this.size[0]), -1]);
            break;
          case core.Align.CENTER:
            let space = Math.max(this.position[0] + this.size[0] - child.calculateViewsize()[0], 0);
            child.setPosition([Math.floor(space / 2), -1]);
            break;
        }
      }
      
      switch (this.contentAlignment) {
        case core.Align.TOP: 
          var origin = 0;
          for (let child of this.children) {
            child.setPosition([-1, this.position[1] + origin]);
            origin += child.calculateViewsize()[1];
          }
          break;
        case core.Align.BOTTOM: 
          var origin = 0;
          for (let child of this.children) {
            let childPosition = [-1, this.position[1] + this.size[1] - origin - child.calculateViewsize()[1]];
            child.setPosition(childPosition);
            origin += child.calculateViewsize()[1];
          }
          break;
        case core.Align.CENTER: 
          let heights = this.children.map(ch => ch.calculateViewsize()[1]);
          let totalHeight = heights.reduce((total, amount) => total + amount);
          var origin = this.position[1] + Math.floor((this.size[1] - totalHeight) / 2);

          for (let child of this.children) {
            child.setPosition([-1, origin]);
            origin += child.calculateViewsize()[1];
          }

          break;
      }
    }
  }

  calculateViewsize(availableSpace) {
    let requestedSize = [0, 0];

    if (this.flowType == core.FlowType.HORIZONTAL) {
      if (this.targetSize == core.SizeTarget.MINIMUM) {
        let largestHeight = 0;
        for (let child of this.children) {
          if (child.height > largestHeight) {
            largestHeight = child.height;
          }
        }
        requestedSize = [availableSpace[0], largestHeight];
      } else {
        // targetSize is a float value between 0 and 1
        requestedSize = [availableSpace[0], Math.floor(this.targetSize * availableSpace[1])];
      }
    } else if (this.flowType == core.FlowType.VERTICAL) {
      if (this.targetSize == core.SizeTarget.MINIMUM) {
        let largestWidth = 0;
        for (let child of this.children) {
          if (child.width() > largestWidth) {
            largestWidth = child.width();
          }
        }
        requestedSize = [largestWidth, availableSpace[1]];
      } else {
        requestedSize = [Math.floor(this.targetSize * availableSpace[0]), availableSpace[1]];
      }
    }

    return requestedSize;
  }

  setSize(newSize) {
    super.setSize(newSize);
    this.background.setSize(newSize);

    // This render can now determine the size and alignment of nested sections and elements
    this.render();
  }

  setPosition(newPosition) {
    super.setPosition(newPosition);
    this.background.setPosition(newPosition);
  }

  addChildren(newChildren) {
    if (Array.isArray(newChildren)) {
      for (let child of newChildren) {
        this.children.push(child);
      }
    } else {
      this.children.push(newChildren);
    }
  }

  update(elapsed) {
    for (let child of this.children) {
      child.update(elapsed);
    }
  }

  draw(context) {
    if (!this.visible) {
      throw new Error("Cannot draw invisible elements!");
    }

    if (this.background) this.background.draw(context);

    for (let child of this.children) {
      if (child.visible) {
        child.draw(context);
      }
    }
  }
}
