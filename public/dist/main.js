/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _lib_datalit_app_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./lib/datalit/app.js */ \"./src/lib/datalit/app.js\");\n/* harmony import */ var _pages_welcomePage_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./pages/welcomePage.js */ \"./src/pages/welcomePage.js\");\n\n\n\n\n\nconsole.log(`... initialized application (${[window.innerWidth, window.innerHeight]})`);\n\n_lib_datalit_app_js__WEBPACK_IMPORTED_MODULE_0__[\"App\"].addPage(new _pages_welcomePage_js__WEBPACK_IMPORTED_MODULE_1__[\"WelcomePage\"](_lib_datalit_app_js__WEBPACK_IMPORTED_MODULE_0__[\"App\"].Context), { default: true });\n_lib_datalit_app_js__WEBPACK_IMPORTED_MODULE_0__[\"App\"].run();\n\n\n//# sourceURL=webpack:///./src/index.js?");

/***/ }),

/***/ "./src/lib/datalit/app.js":
/*!********************************!*\
  !*** ./src/lib/datalit/app.js ***!
  \********************************/
/*! exports provided: App */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"App\", function() { return App; });\n/* harmony import */ var _enums_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./enums.js */ \"./src/lib/datalit/enums.js\");\n/* harmony import */ var _events_events_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./events/events.js */ \"./src/lib/datalit/events/events.js\");\n/* harmony import */ var _pageManager_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./pageManager.js */ \"./src/lib/datalit/pageManager.js\");\n\n\n\n\nclass DatalitApp {\n    constructor() {\n        this.Canvas = document.getElementById(\"canvas\");\n        this.Context = this.Canvas.getContext(\"2d\");\n        this.GlobalState = {\n            DefaultBackground: _enums_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].Colors.OFFWHITE,\n            DefaultMargin: 10,\n            RedrawRequired: true,\n            ClearRegions: []\n        };\n\n        // Specify the alpha resolution strategy\n        this.Context.globalCompositeOperation = \"destination-over\";\n\n        // Initialize the canvas to the appropriate size\n        this.resizeCanvas();\n\n        // All resize events results in the resizing of the canvas\n        window.addEventListener(\"resize\", this.resizeCanvas);\n\n        // For tracking main application loop elapsed\n        this.lastTick = 0;\n\n        // Create the base manager classes\n        this.eventManager = new _events_events_js__WEBPACK_IMPORTED_MODULE_1__[\"EventManager\"]();\n        this.pageManager = new _pageManager_js__WEBPACK_IMPORTED_MODULE_2__[\"PageManager\"](this.eventManager);\n    }\n\n    addPage(newPage, options = {}) {\n        this.pageManager.pushPage(newPage);\n    }\n\n    resizeCanvas() {\n        this.Canvas.width = window.innerWidth;\n        this.Canvas.height = window.innerHeight;\n    }\n\n    run(currentTime) {\n        let elapsed = currentTime - this.lastTick;\n        this.lastTick = currentTime;\n\n        if (this.GlobalState.RedrawRequired) {\n            this.GlobalState.RedrawRequired = false;\n            this.Context.clearRect(0, 0, this.Canvas.width, this.Canvas.height);\n\n            this.pageManager.draw(this.Context);\n        }\n\n        this.pageManager.update(elapsed);\n\n        window.requestAnimationFrame(this.run);\n    }\n}\n\nconsole.log(\"creating new app instance\");\n\n// Export a single instance of this class\nconst App = new DatalitApp();\n\n\n//# sourceURL=webpack:///./src/lib/datalit/app.js?");

/***/ }),

/***/ "./src/lib/datalit/controls/control.js":
/*!*********************************************!*\
  !*** ./src/lib/datalit/controls/control.js ***!
  \*********************************************/
/*! exports provided: Control */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Control\", function() { return Control; });\n/* harmony import */ var _enums_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../enums.js */ \"./src/lib/datalit/enums.js\");\n/* harmony import */ var _app_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../app.js */ \"./src/lib/datalit/app.js\");\n\n\n\nclass Control {\n    constructor() {\n        this.position = [0, 0];\n        this.size = [1, 1];\n        this.visible = true;\n        this.alignment = _enums_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].Align.CENTER;\n\n        this.margin = [0, 0, 0, 0];\n        for (let i = 0; i < 4; i++) this.margin[i] = _app_js__WEBPACK_IMPORTED_MODULE_1__[\"App\"].GlobalState.DefaultMargin;\n\n        // console.log(\"Control Constructor - 1\");\n    }\n\n    get height() {\n        return this.size[1];\n    }\n    set height(newHeight) {\n        this.size[1] = newHeight;\n    }\n    get width() {\n        return this.size[0];\n    }\n\n    setPosition(newPosition) {\n        if (newPosition[0] == -1) {\n            this.position[1] = newPosition[1];\n        } else if (newPosition[1] == -1) {\n            this.position[0] = newPosition[0];\n        } else {\n            this.position = newPosition;\n        }\n    }\n\n    setSize(newSize) {\n        this.size = newSize;\n    }\n\n    calculateViewsize() {\n        if (this.alignment == _enums_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].Align.FILL) {\n            return null;\n        } else {\n            return size;\n        }\n    }\n\n    update(elapsed) {}\n    draw(context) {}\n}\n\n\n//# sourceURL=webpack:///./src/lib/datalit/controls/control.js?");

/***/ }),

/***/ "./src/lib/datalit/controls/page.js":
/*!******************************************!*\
  !*** ./src/lib/datalit/controls/page.js ***!
  \******************************************/
/*! exports provided: Page */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Page\", function() { return Page; });\n/* harmony import */ var _app_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../app.js */ \"./src/lib/datalit/app.js\");\n/* harmony import */ var _enums_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../enums.js */ \"./src/lib/datalit/enums.js\");\n/* harmony import */ var _control_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./control.js */ \"./src/lib/datalit/controls/control.js\");\n\n\n\n\nclass Page extends _control_js__WEBPACK_IMPORTED_MODULE_2__[\"Control\"] {\n    constructor(margins = [0, 0, 0, 0]) {\n        super();\n\n        // console.log(\"Page Constructor - 2\");\n\n        this._sectionList = [];\n        this._state = _enums_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"].PageState.READY;\n\n        this.margin = margins;\n\n        // These private variables are used to simplify the render 'arrangement' process\n        this._origin = [margins[0], margins[1]];\n        this._freeOrigins = [0, 0, 0, 0];\n    }\n\n    _prerenderCheck() {\n        if (this._sectionList.filter(sec => sec.alignment == _enums_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"].Align.FILL).length > 1) {\n            throw new Error(\"Can only have one Section with alignment == enums.Align.FILL\");\n        }\n    }\n\n    render() {\n        this._prerenderCheck();\n\n        this._freeOrigins = [\n            this.margin[0],\n            this.margin[1],\n            window.innerWidth - this.margin[2],\n            window.innerHeight - this.margin[3]\n        ];\n        let totalSpace = [this._freeOrigins[2] - this._freeOrigins[0], this._freeOrigins[3] - this._freeOrigins[1]];\n\n        let viewableSections = this._sectionList.filter(sec => sec.visible && sec.alignment != _enums_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"].Align.FILL);\n        for (let i = 0; i < viewableSections.length; i++) {\n            let sec = viewableSections[i];\n            let requestedSize = sec.calculateViewsize(totalSpace);\n            // console.log(`Requested size: ${requestedSize}`);\n            if (sec.flowType == _enums_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"].FlowType.HORIZONTAL) {\n                switch (sec.alignment) {\n                    case _enums_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"].Align.TOP:\n                        sec.setPosition([this._freeOrigins[0], this._freeOrigins[1]]);\n                        sec.setSize([this._freeOrigins[2] - this._freeOrigins[0], requestedSize[1]]);\n                        this._freeOrigins[1] = requestedSize[1];\n                        break;\n                    case _enums_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"].Align.BOTTOM:\n                        sec.setPosition([this._freeOrigins[0], this._freeOrigins[3] - requestedSize[1]]);\n                        sec.setSize([this._freeOrigins[2] - this._freeOrigins[0], requestedSize[1]]);\n                        this._freeOrigins[3] -= requestedSize[1];\n                        break;\n                }\n            } else if (sec.flowType == _enums_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"].FlowType.VERTICAL) {\n                switch (sec.alignment) {\n                    case _enums_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"].Align.LEFT:\n                        sec.setPosition([this._freeOrigins[0], this._freeOrigins[1]]);\n                        sec.setSize([requestedSize[0], this._freeOrigins[3] - this._freeOrigins[1]]);\n                        this._freeOrigins[0] = requestedSize[0];\n                        break;\n                    case _enums_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"].Align.RIGHT:\n                        sec.setPosition([this._freeOrigins[2] - requestedSize[0], this._freeOrigins[1]]);\n                        sec.setSize([requestedSize[0], this._freeOrigins[3] - this._freeOrigins[1]]);\n                        this._freeOrigins[2] -= requestedSize[0];\n                        break;\n                }\n            }\n        }\n\n        // Arrange the align.FILL section\n        let fillSection = this._sectionList.find(sec => sec.alignment == _enums_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"].Align.FILL);\n        fillSection.setPosition([this._freeOrigins[0], this._freeOrigins[1]]);\n        fillSection.setSize([this._freeOrigins[2] - this._freeOrigins[0], this._freeOrigins[3] - this._freeOrigins[1]]);\n\n        // console.log(`finished render... ${this._freeOrigins}`);\n    }\n\n    // Private / Protected classes\n    addSection(section) {\n        this._sectionList.push(section);\n\n        if (this._sectionList.find(sec => sec.alignment == _enums_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"].Align.FILL) == undefined) {\n            throw new Error(\"A page must have at least one section with alignment == FILL\");\n        }\n\n        this.render();\n    }\n\n    removeSection(section) {\n        this._sectionList.splice(this._sectionList.indexOf(section), 1);\n        this.render();\n    }\n\n    // Extending classes should implement the following methods\n    activate() {\n        this._state = _enums_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"].PageState.ACTIVE;\n\n        this.render();\n    }\n\n    deactivate() {\n        this._state = _enums_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"].PageState.READY;\n    }\n\n    // Called by PageManager (think FSM)\n    update(elapsed) {\n        for (let section of this._sectionList) {\n            section.update(elapsed);\n        }\n    }\n\n    draw(context) {\n        for (let section of this._sectionList) {\n            if (section.visible) {\n                section.draw(context);\n            }\n        }\n    }\n}\n\n\n//# sourceURL=webpack:///./src/lib/datalit/controls/page.js?");

/***/ }),

/***/ "./src/lib/datalit/controls/rect.js":
/*!******************************************!*\
  !*** ./src/lib/datalit/controls/rect.js ***!
  \******************************************/
/*! exports provided: Rect */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Rect\", function() { return Rect; });\n/* harmony import */ var _enums_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../enums.js */ \"./src/lib/datalit/enums.js\");\n/* harmony import */ var _control_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./control.js */ \"./src/lib/datalit/controls/control.js\");\n\n\n\nclass Rect extends _control_js__WEBPACK_IMPORTED_MODULE_1__[\"Control\"] {\n    constructor(size, fillColor, alignment = _enums_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].Align.FILL) {\n        super();\n\n        this.size = size;\n        this.alignment = alignment;\n        this.fillColor = fillColor;\n    }\n\n    calculateViewsize() {\n        return [this.size[0] + this.margin[0] + this.margin[2], this.size[1] + this.margin[1] + this.margin[3]];\n    }\n\n    draw(context) {\n        context.fillStyle = this.fillColor;\n        let truePosition = [this.position[0] + this.margin[0], this.position[1] + this.margin[1]];\n        console.log(`drawing rect at ${truePosition}`);\n        context.fillRect(...truePosition, ...this.size);\n    }\n}\n\n\n//# sourceURL=webpack:///./src/lib/datalit/controls/rect.js?");

/***/ }),

/***/ "./src/lib/datalit/controls/section.js":
/*!*********************************************!*\
  !*** ./src/lib/datalit/controls/section.js ***!
  \*********************************************/
/*! exports provided: Section */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Section\", function() { return Section; });\n/* harmony import */ var _app_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../app.js */ \"./src/lib/datalit/app.js\");\n/* harmony import */ var _enums_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../enums.js */ \"./src/lib/datalit/enums.js\");\n/* harmony import */ var _control_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./control.js */ \"./src/lib/datalit/controls/control.js\");\n/* harmony import */ var _rect_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./rect.js */ \"./src/lib/datalit/controls/rect.js\");\n\n\n\n\n\nclass Section extends _control_js__WEBPACK_IMPORTED_MODULE_2__[\"Control\"] {\n    constructor(\n        flowType = _enums_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"].FlowType.VERTICAL,\n        alignment = _enums_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"].Align.LEFT,\n        targetSize = _enums_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"].SizeTarget.MINIMUM,\n        background = _app_js__WEBPACK_IMPORTED_MODULE_0__[\"App\"].GlobalState.DefaultBackground\n    ) {\n        super();\n\n        // console.log(\"Section constructor\");\n        if (targetSize != _enums_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"].SizeTarget.MINIMUM && (targetSize < 0 || targetSize >= 1.0)) {\n            throw new Error(\"Invalid targetSize for Section. Must be between 0 and 1.0\");\n        }\n\n        this.children = [];\n        this.flowType = flowType;\n        this.alignment = alignment;\n        this.contentAlignment = _enums_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"].Align.CENTER;\n        this.targetSize = targetSize;\n        this.margin = [0, 0, 0, 0];\n\n        if (background) {\n            this.background = new _rect_js__WEBPACK_IMPORTED_MODULE_3__[\"Rect\"]([0, 0], background);\n            this.background.margin = [0, 0, 0, 0];\n        }\n    }\n\n    render() {\n        if (this.children.length < 1) return;\n\n        if (this.flowType == _enums_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"].FlowType.HORIZONTAL) {\n        } else if (this.flowType == _enums_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"].FlowType.VERTICAL) {\n            // All horizontal positions are the same regardless of alignment\n            for (let child of this.children) {\n                if (child.fillWidth) {\n                    child.setSize([this.size[0] - child.margin[0] - child.margin[2], child.size[1]]);\n                    // console.log(`Child: ${child.size[0]} vs Section: ${this.size[0]}`);\n                    // console.log(`Child: ${child.position[0]} vs Section: ${this.position[0]}`);\n                    child.setPosition([this.position[0] + child.margin[0]]);\n                    continue;\n                }\n\n                switch (child.alignment) {\n                    case _enums_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"].Align.RIGHT:\n                        child.setPosition([\n                            this.position[0] + this.size[0] - Math.min(child.calculateViewsize()[0], this.size[0]),\n                            -1\n                        ]);\n                        break;\n                    case _enums_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"].Align.CENTER:\n                        let space = Math.max(this.position[0] + this.size[0] - child.calculateViewsize()[0], 0);\n                        child.setPosition([Math.floor(space / 2), -1]);\n                        break;\n                }\n            }\n\n            switch (this.contentAlignment) {\n                case _enums_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"].Align.TOP:\n                    var origin = 0;\n                    for (let child of this.children) {\n                        child.setPosition([-1, this.position[1] + origin]);\n                        origin += child.calculateViewsize()[1];\n                    }\n                    break;\n                case _enums_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"].Align.BOTTOM:\n                    var origin = 0;\n                    for (let child of this.children) {\n                        let childPosition = [\n                            -1,\n                            this.position[1] + this.size[1] - origin - child.calculateViewsize()[1]\n                        ];\n                        child.setPosition(childPosition);\n                        origin += child.calculateViewsize()[1];\n                    }\n                    break;\n                case _enums_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"].Align.CENTER:\n                    let heights = this.children.map(ch => ch.calculateViewsize()[1]);\n                    let totalHeight = heights.reduce((total, amount) => total + amount);\n                    var origin = this.position[1] + Math.floor((this.size[1] - totalHeight) / 2);\n\n                    for (let child of this.children) {\n                        child.setPosition([-1, origin]);\n                        origin += child.calculateViewsize()[1];\n                    }\n\n                    break;\n            }\n        }\n    }\n\n    calculateViewsize(availableSpace) {\n        let requestedSize = [0, 0];\n\n        if (this.flowType == _enums_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"].FlowType.HORIZONTAL) {\n            if (this.targetSize == _enums_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"].SizeTarget.MINIMUM) {\n                let largestHeight = 0;\n                for (let child of this.children) {\n                    if (child.height > largestHeight) {\n                        largestHeight = child.height;\n                    }\n                }\n                requestedSize = [availableSpace[0], largestHeight];\n            } else {\n                // targetSize is a float value between 0 and 1\n                requestedSize = [availableSpace[0], Math.floor(this.targetSize * availableSpace[1])];\n            }\n        } else if (this.flowType == _enums_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"].FlowType.VERTICAL) {\n            if (this.targetSize == _enums_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"].SizeTarget.MINIMUM) {\n                let largestWidth = 0;\n                for (let child of this.children) {\n                    if (child.width() > largestWidth) {\n                        largestWidth = child.width();\n                    }\n                }\n                requestedSize = [largestWidth, availableSpace[1]];\n            } else {\n                requestedSize = [Math.floor(this.targetSize * availableSpace[0]), availableSpace[1]];\n            }\n        }\n\n        return requestedSize;\n    }\n\n    setSize(newSize) {\n        super.setSize(newSize);\n        this.background.setSize(newSize);\n\n        // This render can now determine the size and alignment of nested sections and elements\n        this.render();\n    }\n\n    setPosition(newPosition) {\n        super.setPosition(newPosition);\n        this.background.setPosition(newPosition);\n    }\n\n    addChildren(newChildren) {\n        if (Array.isArray(newChildren)) {\n            for (let child of newChildren) {\n                this.children.push(child);\n            }\n        } else {\n            this.children.push(newChildren);\n        }\n    }\n\n    update(elapsed) {\n        for (let child of this.children) {\n            child.update(elapsed);\n        }\n    }\n\n    draw(context) {\n        if (!this.visible) {\n            throw new Error(\"Cannot draw invisible elements!\");\n        }\n\n        if (this.background) this.background.draw(context);\n\n        for (let child of this.children) {\n            if (child.visible) {\n                child.draw(context);\n            }\n        }\n    }\n}\n\n\n//# sourceURL=webpack:///./src/lib/datalit/controls/section.js?");

/***/ }),

/***/ "./src/lib/datalit/enums.js":
/*!**********************************!*\
  !*** ./src/lib/datalit/enums.js ***!
  \**********************************/
/*! exports provided: Colors, ControlState, Align, PageState, FlowType, SizeTarget, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Colors\", function() { return Colors; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"ControlState\", function() { return ControlState; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Align\", function() { return Align; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"PageState\", function() { return PageState; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"FlowType\", function() { return FlowType; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"SizeTarget\", function() { return SizeTarget; });\nconst Colors = Object.freeze({\n    RED: \"rgb(255, 0, 0)\",\n    GREEN: \"rgb(0, 255, 0)\",\n    BLUE: \"rgb(0, 0, 255)\",\n    OFFWHITE: \"rgb(210, 210, 210)\",\n    OFFBLACK: \"rgb(20, 20, 20)\"\n});\n\nconst ControlState = Object.freeze({\n    DISABLED: 0,\n    ENABLED: 1,\n    HOVERED: 2,\n    FOCUSED: 3,\n    DEPRESSED: 4,\n    DRAGGED: 5\n});\n\nconst Align = Object.freeze({\n    TOP: 0,\n    BOTTOM: 1,\n    CENTER: 2,\n    FREE: 3,\n    FILL: 4,\n    RIGHT: 5,\n    LEFT: 6\n});\n\nconst PageState = Object.freeze({\n    READY: 0,\n    ACTIVE: 1\n});\n\nconst FlowType = Object.freeze({\n    HORIZONTAL: 0,\n    VERTICAL: 1\n});\n\nconst SizeTarget = Object.freeze({\n    MINIMUM: 0xff\n});\n\n/* harmony default export */ __webpack_exports__[\"default\"] = ({\n    Colors,\n    ControlState,\n    Align,\n    PageState,\n    FlowType,\n    SizeTarget\n});\n\n\n//# sourceURL=webpack:///./src/lib/datalit/enums.js?");

/***/ }),

/***/ "./src/lib/datalit/events/events.js":
/*!******************************************!*\
  !*** ./src/lib/datalit/events/events.js ***!
  \******************************************/
/*! exports provided: EventManager */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"EventManager\", function() { return EventManager; });\nclass EventManager {\n  constructor() {}\n}\n\n\n//# sourceURL=webpack:///./src/lib/datalit/events/events.js?");

/***/ }),

/***/ "./src/lib/datalit/pageManager.js":
/*!****************************************!*\
  !*** ./src/lib/datalit/pageManager.js ***!
  \****************************************/
/*! exports provided: PageManager */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"PageManager\", function() { return PageManager; });\nclass PageManager {\n    constructor(eventManager) {\n        this.eventManager = eventManager;\n\n        this.pageStack = [];\n    }\n\n    peek() {\n        return this.pageStack.length > 0 ? this.pageStack[this.pageStack.length - 1] : null;\n    }\n\n    popPage() {\n        oldPage = this.pageStack.pop();\n        oldPage.deactivate();\n\n        if (this.peek()) {\n            this.peek().activate();\n        }\n    }\n\n    changePage(page) {\n        while (this.peek()) {\n            page = this.pageStack.pop();\n            page.deactivate();\n        }\n\n        this.pushPage(page);\n    }\n\n    pushPage(page) {\n        if (this.peek()) this.peek().deactivate();\n\n        this.pageStack.push(page);\n        page.activate();\n    }\n\n    update(elapsed) {\n        if (this.pageStack.length < 1) throw new Error(\"Cannot update empty pageManager!\");\n\n        this.peek().update(elapsed);\n    }\n\n    draw(context) {\n        if (this.pageStack.length < 1) throw new Error(\"Cannot draw empty pageManager!\");\n\n        this.peek().draw(context);\n    }\n}\n\n\n//# sourceURL=webpack:///./src/lib/datalit/pageManager.js?");

/***/ }),

/***/ "./src/lib/datalit/utils.js":
/*!**********************************!*\
  !*** ./src/lib/datalit/utils.js ***!
  \**********************************/
/*! exports provided: newColor, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"newColor\", function() { return newColor; });\nfunction newColor(r, g, b, a = 1.0) {\n    return `rgba(${r},${g},${b},${a})`;\n}\n\n/* harmony default export */ __webpack_exports__[\"default\"] = ({\n    newColor\n});\n\n\n//# sourceURL=webpack:///./src/lib/datalit/utils.js?");

/***/ }),

/***/ "./src/pages/welcomePage.js":
/*!**********************************!*\
  !*** ./src/pages/welcomePage.js ***!
  \**********************************/
/*! exports provided: WelcomePage */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"WelcomePage\", function() { return WelcomePage; });\n/* harmony import */ var _lib_datalit_enums_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../lib/datalit/enums.js */ \"./src/lib/datalit/enums.js\");\n/* harmony import */ var _lib_datalit_utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../lib/datalit/utils.js */ \"./src/lib/datalit/utils.js\");\n/* harmony import */ var _lib_datalit_controls_page_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../lib/datalit/controls/page.js */ \"./src/lib/datalit/controls/page.js\");\n/* harmony import */ var _lib_datalit_controls_section_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../lib/datalit/controls/section.js */ \"./src/lib/datalit/controls/section.js\");\n/* harmony import */ var _lib_datalit_controls_rect_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../lib/datalit/controls/rect.js */ \"./src/lib/datalit/controls/rect.js\");\n\n\n\n\n\n\nclass WelcomePage extends _lib_datalit_controls_page_js__WEBPACK_IMPORTED_MODULE_2__[\"Page\"] {\n    constructor(context) {\n        super(context, [0, 0, 0, 0]);\n\n        this.mainSection = new _lib_datalit_controls_section_js__WEBPACK_IMPORTED_MODULE_3__[\"Section\"](_lib_datalit_enums_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].FlowType.VERTICAL, _lib_datalit_enums_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].Align.FILL, 0, _lib_datalit_utils_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"].newColor(20, 20, 40));\n\n        this.addSection(this.mainSection);\n\n        window.addEventListener(\"keydown\", e => this.handleKeypress(e));\n    }\n\n    handleKeypress(event) {\n        switch (event.key) {\n            case \"a\":\n                console.log(`mainSection: ${this.mainSection.position} ||${this.mainSection.size}`);\n                console.log(`otherSection: ${this.otherSection.position} ||${this.otherSection.size}`);\n                console.log(`thirdSection: ${this.thirdSection.position} ||${this.thirdSection.size}`);\n                break;\n            case \"b\":\n                this.otherSection.background.position[0]++;\n                this.otherSection.position[0]++;\n                _lib_datalit_enums_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].GlobalState.RedrawRequired = true;\n                break;\n            case \"c\":\n                this.otherSection.visible = !this.otherSection.visible;\n                _lib_datalit_enums_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].GlobalState.RedrawRequired = true;\n                break;\n        }\n    }\n}\n\n\n//# sourceURL=webpack:///./src/pages/welcomePage.js?");

/***/ })

/******/ });