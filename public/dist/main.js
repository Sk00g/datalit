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
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _lib_datalit_app_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./lib/datalit/app.js */ \"./src/lib/datalit/app.js\");\n/* harmony import */ var _pages_welcomePage_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./pages/welcomePage.js */ \"./src/pages/welcomePage.js\");\n\n\n\n\n\nconsole.log(`... initialized application (${[window.innerWidth, window.innerHeight]})`);\n\n_lib_datalit_app_js__WEBPACK_IMPORTED_MODULE_0__[\"App\"].addPage(new _pages_welcomePage_js__WEBPACK_IMPORTED_MODULE_1__[\"WelcomePage\"](), { default: true });\n_lib_datalit_app_js__WEBPACK_IMPORTED_MODULE_0__[\"App\"].run();\n\n\n//# sourceURL=webpack:///./src/index.js?");

/***/ }),

/***/ "./src/lib/datalit/app.js":
/*!********************************!*\
  !*** ./src/lib/datalit/app.js ***!
  \********************************/
/*! exports provided: App */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"App\", function() { return App; });\n/* harmony import */ var _enums_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./enums.js */ \"./src/lib/datalit/enums.js\");\n/* harmony import */ var _events_events_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./events/events.js */ \"./src/lib/datalit/events/events.js\");\n/* harmony import */ var _pageManager_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./pageManager.js */ \"./src/lib/datalit/pageManager.js\");\n\n\n\n\nclass DatalitApp {\n    constructor() {\n        this.Canvas = document.getElementById(\"canvas\");\n        this.Context = this.Canvas.getContext(\"2d\");\n        this.GlobalState = {\n            DefaultBackground: _enums_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].Colors.OFFWHITE,\n            DefaultMargin: [0, 0, 0, 0],\n            RedrawRequired: true,\n            ClearRegions: []\n        };\n\n        // Specify the alpha resolution strategy\n        this.Context.globalCompositeOperation = \"destination-over\";\n\n        // Initialize the canvas to the appropriate size\n        this.resizeCanvas();\n\n        // All resize events results in the resizing of the canvas\n        window.addEventListener(\"resize\", this.resizeCanvas);\n\n        // For tracking main application loop elapsed\n        this.lastTick = 0;\n\n        // Create the base manager classes\n        this.eventManager = new _events_events_js__WEBPACK_IMPORTED_MODULE_1__[\"EventManager\"]();\n        this.pageManager = new _pageManager_js__WEBPACK_IMPORTED_MODULE_2__[\"PageManager\"](this.eventManager);\n    }\n\n    addPage(newPage, options = {}) {\n        this.pageManager.pushPage(newPage);\n    }\n\n    resizeCanvas() {\n        this.Canvas.width = window.innerWidth;\n        this.Canvas.height = window.innerHeight;\n    }\n\n    run(currentTime) {\n        let elapsed = currentTime - this.lastTick;\n        this.lastTick = currentTime;\n\n        if (this.GlobalState.RedrawRequired) {\n            this.GlobalState.RedrawRequired = false;\n            this.Context.clearRect(0, 0, this.Canvas.width, this.Canvas.height);\n\n            this.pageManager.draw(this.Context);\n        }\n\n        this.pageManager.update(elapsed);\n\n        window.requestAnimationFrame(ct => this.run(ct));\n    }\n}\n\nconsole.log(\"creating new app instance\");\n\n// Export a single instance of this class\nconst App = new DatalitApp();\n\n\n//# sourceURL=webpack:///./src/lib/datalit/app.js?");

/***/ }),

/***/ "./src/lib/datalit/controls/control.js":
/*!*********************************************!*\
  !*** ./src/lib/datalit/controls/control.js ***!
  \*********************************************/
/*! exports provided: Control */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Control\", function() { return Control; });\n/* harmony import */ var _enums_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../enums.js */ \"./src/lib/datalit/enums.js\");\n/* harmony import */ var _app_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../app.js */ \"./src/lib/datalit/app.js\");\n/* harmony import */ var _errors_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../errors.js */ \"./src/lib/datalit/errors.js\");\n\n\n\n\nclass Control {\n    constructor(initialProperties = {}) {\n        // console.log(\"Control Constructor - 1\");\n\n        this._margin = _app_js__WEBPACK_IMPORTED_MODULE_1__[\"App\"].GlobalState.DefaultMargin;\n        this._size = [1, 1];\n        this._localPosition = [0, 0];\n        this._visible = true;\n        this._align = _enums_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].Align.CENTER;\n        this._arrangedPosition = [0, 0];\n        this._zValue = 0;\n\n        this.updateProperties(initialProperties);\n    }\n\n    updateProperties(newProperties) {\n        for (const [key, value] of Object.entries(newProperties)) {\n            if (!this.hasOwnProperty(\"_\" + key)) Object(_errors_js__WEBPACK_IMPORTED_MODULE_2__[\"datalitError\"])(\"propertyNotFound\", [\"Control\", \"_ \" + key]);\n\n            this[key] = value;\n        }\n    }\n\n    arrangePosition(arranger, newPosition) {\n        if (!arranger.isArranger) Object(_errors_js__WEBPACK_IMPORTED_MODULE_2__[\"datalitError\"])(\"arrangeAuthority\", [String(arranger.constructor.name)]);\n\n        this._arrangedPosition = newPosition;\n    }\n\n    get zValue() {\n        return this._zValue;\n    }\n    set zValue(newValue) {\n        if (typeof newValue != \"number\" || newValue < 0)\n            Object(_errors_js__WEBPACK_IMPORTED_MODULE_2__[\"datalitError\"])(\"propertySet\", [\"Control.zValue\", String(newValue), \"int 0 or greater\"]);\n\n        this._zValue = newValue;\n    }\n\n    get margin() {\n        return this._margin;\n    }\n    set margin(newMargin) {\n        if (typeof newMargin != \"object\" || newMargin.length != 4)\n            Object(_errors_js__WEBPACK_IMPORTED_MODULE_2__[\"datalitError\"])(\"propertySet\", [\"Control.margin\", String(newMargin), \"LIST of 4 int\"]);\n        for (let i = 0; i < 4; i++)\n            if (!Number.isInteger(newMargin[i]))\n                Object(_errors_js__WEBPACK_IMPORTED_MODULE_2__[\"datalitError\"])(\"propertySet\", [\"Control.margin\", String(newMargin), \"LIST of 4 int\"]);\n\n        this._margin = newMargin;\n    }\n\n    // Default implementation, can be overriden\n    get viewWidth() {\n        return this.viewingRect[2];\n    }\n    get viewHeight() {\n        return this.viewingRect[3];\n    }\n    get viewingRect() {\n        return [...this._arrangedPosition, ...this._size];\n    }\n    // Default implementation, can be overriden\n    get hitRect() {\n        return [\n            this._arrangedPosition[0] + this._margin[0],\n            this._arrangedPosition[1] + this._margin[1],\n            Math.max(0, this._size[0] - this.margin[0] - this.margin[2]),\n            Math.max(0, this._size[1] - this.margin[1] - this.margin[3])\n        ];\n    }\n\n    get align() {\n        return this._align;\n    }\n    set align(newAlign) {\n        if (!_enums_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].Align.hasOwnProperty(newAlign))\n            Object(_errors_js__WEBPACK_IMPORTED_MODULE_2__[\"datalitError\"])(\"propertySet\", [\"Control.align\", String(newAlign), \"enums.Align\"]);\n\n        this._align = newAlign;\n    }\n\n    get visible() {\n        return this._visible;\n    }\n    set visible(flag) {\n        if (typeof flag != \"boolean\") Object(_errors_js__WEBPACK_IMPORTED_MODULE_2__[\"datalitError\"])(\"propertySet\", [\"Control.visible\", String(flag), \"BOOL\"]);\n\n        this._visible = flag;\n    }\n\n    get localPosition() {\n        return this._localPosition;\n    }\n\n    set localPosition(newPosition) {\n        if (\n            typeof newPosition != \"object\" ||\n            newPosition.length != 2 ||\n            !Number.isInteger(newPosition[0]) ||\n            !Number.isInteger(newPosition[1])\n        )\n            Object(_errors_js__WEBPACK_IMPORTED_MODULE_2__[\"datalitError\"])(\"propertySet\", [\"Control.localPosition\", String(newPosition), \"LIST of 2 int\"]);\n\n        this._localPosition = newPosition;\n    }\n\n    get height() {\n        return this._size[1];\n    }\n    get width() {\n        return this._size[0];\n    }\n    get size() {\n        return this._size;\n    }\n    set size(newSize) {\n        if (\n            typeof newSize != \"object\" ||\n            newSize.length != 2 ||\n            !Number.isInteger(newSize[0]) ||\n            !Number.isInteger(newSize[1])\n        )\n            Object(_errors_js__WEBPACK_IMPORTED_MODULE_2__[\"datalitError\"])(\"propertySet\", [\"Control.size\", String(newSize), \"LIST of 2 int\"]);\n\n        this._size = newSize;\n    }\n\n    update(elapsed) {}\n    draw(context) {}\n}\n\n\n//# sourceURL=webpack:///./src/lib/datalit/controls/control.js?");

/***/ }),

/***/ "./src/lib/datalit/controls/page.js":
/*!******************************************!*\
  !*** ./src/lib/datalit/controls/page.js ***!
  \******************************************/
/*! exports provided: Page */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Page\", function() { return Page; });\n/* harmony import */ var _app_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../app.js */ \"./src/lib/datalit/app.js\");\n/* harmony import */ var _enums_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../enums.js */ \"./src/lib/datalit/enums.js\");\n/* harmony import */ var _control_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./control.js */ \"./src/lib/datalit/controls/control.js\");\n\n\n\n\nclass Page extends _control_js__WEBPACK_IMPORTED_MODULE_2__[\"Control\"] {\n    constructor(initialProperties = {}) {\n        super();\n        // console.log(\"Page Constructor - 2\");\n\n        // Unique property fields\n        this._state = _enums_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"].PageState.READY;\n\n        this.isArranger = true;\n        this.sectionList = [];\n\n        // This is used internally to simplify the render 'arrangement' process\n        this.freeOrigins = [0, 0, 0, 0];\n\n        this.updateProperties(initialProperties);\n    }\n\n    get state() {\n        return this._state;\n    }\n    set state(newState) {\n        if (!_enums_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"].PageState.hasOwnProperty(newState))\n            datalitError(\"propertySet\", [\"Page.state\", String(newState), \"enums.PageState\"]);\n\n        this._state = newState;\n    }\n\n    prerenderCheck() {\n        if (this.sectionList.filter(sec => sec.align == _enums_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"].Align.FILL).length != 1) {\n            throw new Error(\"Must have exactly one Section with align == enums.Align.FILL\");\n        }\n    }\n\n    render() {\n        this.prerenderCheck();\n\n        this.freeOrigins = [\n            this.margin[0],\n            this.margin[1],\n            window.innerWidth - this.margin[2],\n            window.innerHeight - this.margin[3]\n        ];\n        let totalSpace = [this.freeOrigins[2] - this.freeOrigins[0], this.freeOrigins[3] - this.freeOrigins[1]];\n\n        let viewableSections = this.sectionList.filter(sec => sec.visible && sec.align != _enums_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"].Align.FILL);\n        for (let i = 0; i < viewableSections.length; i++) {\n            let sec = viewableSections[i];\n            let requestedSize = sec.calculateViewsize(totalSpace);\n            // console.log(`Requested size: ${requestedSize}`);\n            if (sec.flowType == _enums_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"].FlowType.HORIZONTAL) {\n                switch (sec.align) {\n                    case _enums_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"].Align.TOP:\n                        sec.arrangePosition(this, [this.freeOrigins[0], this.freeOrigins[1]]);\n                        sec.size = [this.freeOrigins[2] - this.freeOrigins[0], requestedSize[1]];\n                        this.freeOrigins[1] = requestedSize[1];\n                        break;\n                    case _enums_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"].Align.BOTTOM:\n                        sec.arrangePosition(this, [this.freeOrigins[0], this.freeOrigins[3] - requestedSize[1]]);\n                        sec.size = [this.freeOrigins[2] - this.freeOrigins[0], requestedSize[1]];\n                        this.freeOrigins[3] -= requestedSize[1];\n                        break;\n                }\n            } else if (sec.flowType == _enums_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"].FlowType.VERTICAL) {\n                switch (sec.align) {\n                    case _enums_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"].Align.LEFT:\n                        sec.arrangePosition(this, [this.freeOrigins[0], this.freeOrigins[1]]);\n                        sec.size = [requestedSize[0], this.freeOrigins[3] - this.freeOrigins[1]];\n                        this.freeOrigins[0] = requestedSize[0];\n                        break;\n                    case _enums_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"].Align.RIGHT:\n                        sec.arrangePosition(this, [this.freeOrigins[2] - requestedSize[0], this.freeOrigins[1]]);\n                        sec.size = [requestedSize[0], this.freeOrigins[3] - this.freeOrigins[1]];\n                        this.freeOrigins[2] -= requestedSize[0];\n                        break;\n                }\n            }\n        }\n\n        // Arrange the align.FILL section\n        let fillSection = this.sectionList.find(sec => sec.align == _enums_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"].Align.FILL);\n        fillSection.arrangePosition(this, [this.freeOrigins[0], this.freeOrigins[1]]);\n        fillSection.size = [this.freeOrigins[2] - this.freeOrigins[0], this.freeOrigins[3] - this.freeOrigins[1]];\n    }\n\n    // Private / Protected classes\n    addSection(section) {\n        this.sectionList.push(section);\n\n        this.render();\n    }\n\n    removeSection(section) {\n        this.sectionList.splice(this.sectionList.indexOf(section), 1);\n        this.render();\n    }\n\n    // Extending classes should implement the following methods\n    activate() {\n        this.state = _enums_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"].PageState.ACTIVE;\n\n        this.render();\n    }\n\n    deactivate() {\n        this.state = _enums_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"].PageState.READY;\n    }\n\n    // Called by PageManager (think FSM)\n    update(elapsed) {\n        for (let section of this.sectionList) {\n            section.update(elapsed);\n        }\n    }\n\n    draw(context) {\n        for (let section of this.sectionList) {\n            if (section.visible) {\n                section.draw(context);\n            }\n        }\n    }\n}\n\n\n//# sourceURL=webpack:///./src/lib/datalit/controls/page.js?");

/***/ }),

/***/ "./src/lib/datalit/controls/rect.js":
/*!******************************************!*\
  !*** ./src/lib/datalit/controls/rect.js ***!
  \******************************************/
/*! exports provided: Rect */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Rect\", function() { return Rect; });\n/* harmony import */ var _enums_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../enums.js */ \"./src/lib/datalit/enums.js\");\n/* harmony import */ var _control_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./control.js */ \"./src/lib/datalit/controls/control.js\");\n/* harmony import */ var _errors__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../errors */ \"./src/lib/datalit/errors.js\");\n\n\n\n\nclass Rect extends _control_js__WEBPACK_IMPORTED_MODULE_1__[\"Control\"] {\n    constructor(initialProperties = {}) {\n        super();\n\n        // Unique properties\n        this._fillColor = _enums_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].Colors.OFFWHITE;\n\n        this.updateProperties(initialProperties);\n    }\n\n    get fillColor() {\n        return this._fillColor;\n    }\n    set fillColor(newColor) {\n        if (typeof newColor != \"string\") {\n            Object(_errors__WEBPACK_IMPORTED_MODULE_2__[\"datalitError\"])(\"propertySet\", [\"Rect.fillColor\", String(newColor), \"string\"]);\n        }\n\n        this._fillColor = newColor;\n    }\n\n    draw(context) {\n        context.fillStyle = this.fillColor;\n        let truePosition = [this._arrangedPosition[0] + this.margin[0], this._arrangedPosition[1] + this.margin[1]];\n        context.fillRect(...truePosition, ...this.size);\n    }\n}\n\n\n//# sourceURL=webpack:///./src/lib/datalit/controls/rect.js?");

/***/ }),

/***/ "./src/lib/datalit/controls/section.js":
/*!*********************************************!*\
  !*** ./src/lib/datalit/controls/section.js ***!
  \*********************************************/
/*! exports provided: Section */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Section\", function() { return Section; });\n/* harmony import */ var _enums_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../enums.js */ \"./src/lib/datalit/enums.js\");\n/* harmony import */ var _app_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../app.js */ \"./src/lib/datalit/app.js\");\n/* harmony import */ var _control_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./control.js */ \"./src/lib/datalit/controls/control.js\");\n/* harmony import */ var _rect_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./rect.js */ \"./src/lib/datalit/controls/rect.js\");\n\n\n\n\n\nclass Section extends _control_js__WEBPACK_IMPORTED_MODULE_2__[\"Control\"] {\n    constructor(initialProperties = {}) {\n        // console.log(\"Section constructor\");\n        super();\n\n        // Unique property definitions\n        this._flowType = _enums_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].FlowType.VERTICAL;\n        this._sizeTarget = _enums_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].SizeTarget.MINIMUM;\n        this._contentAlignment = _enums_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].Align.CENTER;\n        this._backgroundColor = _app_js__WEBPACK_IMPORTED_MODULE_1__[\"App\"].GlobalState.DefaultBackground;\n\n        this.isArranger = true;\n        this.children = [];\n\n        // Sections default differently than regular controls\n        this.align = _enums_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].Align.LEFT;\n\n        this.updateProperties(initialProperties);\n\n        this.background = new _rect_js__WEBPACK_IMPORTED_MODULE_3__[\"Rect\"]({ fillColor: this.backgroundColor });\n    }\n\n    //#region Unique Properties\n    get backgroundColor() {\n        return this._backgroundColor;\n    }\n    set backgroundColor(newColor) {\n        if (typeof newColor != \"string\")\n            datalitError(\"propertySet\", [\"Section.backgroundColor\", String(newColor), \"string\"]);\n\n        this._backgroundColor = newColor;\n    }\n    get sizeTarget() {\n        return this._sizeTarget;\n    }\n    set sizeTarget(newTarget) {\n        if (!_enums_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].SizeTarget.hasOwnProperty(newTarget) && (sizeTarget < 0 || sizeTarget >= 1.0))\n            datalitError(\"propertySet\", [\"Section.sizeTarget\", String(newTarget), \"enums.SizeTarget\"]);\n\n        this._sizeTarget = newTarget;\n    }\n\n    get contentAlignment() {\n        return this._contentAlignment;\n    }\n    set contentAlignment(newAlign) {\n        if (!_enums_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].Align.hasOwnProperty(newAlign))\n            datalitError(\"propertySet\", [\"Section.contentAlignment\", String(newAlign), \"enums.Align\"]);\n\n        this._contentAlignment = newAlign;\n    }\n\n    get flowType() {\n        return this._flowType;\n    }\n    set flowType(newType) {\n        if (!_enums_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].FlowType.hasOwnProperty(newType))\n            datalitError(\"propertySet\", [\"Section.flowType\", String(newType), \"enums.FlowType\"]);\n\n        this._flowType = newType;\n    }\n    //#endregion\n\n    render() {\n        if (this.children.length < 1) return;\n\n        if (this.flowType == _enums_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].FlowType.HORIZONTAL) {\n        } else if (this.flowType == _enums_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].FlowType.VERTICAL) {\n            for (let child of this.children) {\n                switch (child.align) {\n                    case _enums_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].Align.LEFT:\n                        child.arrangePosition(this, this._arrangedPosition[0], -1);\n                    case _enums_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].Align.RIGHT:\n                        child.arrangePosition(this, [\n                            this.position[0] + this.size[0] - Math.min(child.calculateViewsize()[0], this.size[0]),\n                            -1\n                        ]);\n                        break;\n                    case _enums_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].Align.CENTER:\n                        let space = Math.max(this.position[0] + this.size[0] - child.calculateViewsize()[0], 0);\n                        child.arrangePosition(this, [Math.floor(space / 2), -1]);\n                        break;\n                }\n            }\n\n            switch (this.contentAlignment) {\n                case _enums_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].Align.TOP:\n                    var origin = 0;\n                    for (let child of this.children) {\n                        child.arrangePosition(this, [-1, this.position[1] + origin]);\n                        origin += child.calculateViewsize()[1];\n                    }\n                    break;\n                case _enums_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].Align.BOTTOM:\n                    var origin = 0;\n                    for (let child of this.children) {\n                        let childPosition = [\n                            -1,\n                            this.position[1] + this.size[1] - origin - child.calculateViewsize()[1]\n                        ];\n                        child.arrangePosition(this, childPosition);\n                        origin += child.calculateViewsize()[1];\n                    }\n                    break;\n                case _enums_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].Align.CENTER:\n                    let heights = this.children.map(ch => ch.calculateViewsize()[1]);\n                    let totalHeight = heights.reduce((total, amount) => total + amount);\n                    var origin = this.position[1] + Math.floor((this.size[1] - totalHeight) / 2);\n\n                    for (let child of this.children) {\n                        child.arrangePosition(this, [-1, origin]);\n                        origin += child.calculateViewsize()[1];\n                    }\n                    break;\n            }\n        }\n    }\n\n    calculateViewsize(availableSpace) {\n        let requestedSize = [0, 0];\n\n        if (this.flowType == _enums_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].FlowType.HORIZONTAL) {\n            if (this.sizeTarget == _enums_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].SizeTarget.MINIMUM) {\n                let largestHeight = 0;\n                for (let child of this.children) {\n                    if (child.viewHeight > largestHeight) {\n                        largestHeight = child.viewHeight;\n                    }\n                }\n                requestedSize = [availableSpace[0], largestHeight];\n            } else {\n                // sizeTarget is a float value between 0 and 1\n                requestedSize = [availableSpace[0], Math.floor(this.sizeTarget * availableSpace[1])];\n            }\n        } else if (this.flowType == _enums_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].FlowType.VERTICAL) {\n            if (this.sizeTarget == _enums_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].SizeTarget.MINIMUM) {\n                let largestWidth = 0;\n                for (let child of this.children) {\n                    if (child.viewWidth > largestWidth) {\n                        largestWidth = child.viewWidth;\n                    }\n                }\n                requestedSize = [largestWidth, availableSpace[1]];\n            } else {\n                requestedSize = [Math.floor(this.sizeTarget * availableSpace[0]), availableSpace[1]];\n            }\n        }\n\n        return requestedSize;\n    }\n\n    get size() {\n        return this._size;\n    }\n    set size(newSize) {\n        super.size = newSize;\n        this.background.size = newSize;\n\n        // This render can now determine the size and alignment of nested sections and elements\n        this.render();\n    }\n\n    arrangePosition(arranger, newPosition) {\n        super.arrangePosition(arranger, newPosition);\n        this.background.arrangePosition(arranger, newPosition);\n\n        this.render();\n    }\n\n    addChild(newChild) {\n        this.children.push(newChild);\n        this.render();\n    }\n    removeChild(child) {\n        this.children.splice(this.children.indexOf(child), 1);\n        this.render();\n    }\n\n    update(elapsed) {\n        for (let child of this.children) {\n            child.update(elapsed);\n        }\n    }\n\n    draw(context) {\n        if (!this.visible) {\n            throw new Error(\"Cannot draw invisible elements!\");\n        }\n\n        if (this.background) this.background.draw(context);\n\n        for (let child of this.children) {\n            if (child.visible) {\n                child.draw(context);\n            }\n        }\n    }\n}\n\n\n//# sourceURL=webpack:///./src/lib/datalit/controls/section.js?");

/***/ }),

/***/ "./src/lib/datalit/enums.js":
/*!**********************************!*\
  !*** ./src/lib/datalit/enums.js ***!
  \**********************************/
/*! exports provided: Colors, ControlState, Align, PageState, FlowType, SizeTarget, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Colors\", function() { return Colors; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"ControlState\", function() { return ControlState; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Align\", function() { return Align; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"PageState\", function() { return PageState; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"FlowType\", function() { return FlowType; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"SizeTarget\", function() { return SizeTarget; });\nconst Colors = Object.freeze({\n    RED: \"rgb(255, 0, 0)\",\n    GREEN: \"rgb(0, 255, 0)\",\n    BLUE: \"rgb(0, 0, 255)\",\n    OFFWHITE: \"rgb(210, 210, 210)\",\n    OFFBLACK: \"rgb(20, 20, 20)\"\n});\n\nconst ControlState = Object.freeze({\n    DISABLED: \"DISABLED\",\n    ENABLED: \"ENABLED\",\n    HOVERED: \"HOVERED\",\n    FOCUSED: \"FOCUSED\",\n    DEPRESSED: \"DEPRESSED\",\n    DRAGGED: \"DRAGGED\"\n});\n\nconst Align = Object.freeze({\n    TOP: \"TOP\",\n    BOTTOM: \"BOTTOM\",\n    CENTER: \"CENTER\",\n    FREE: \"FREE\",\n    FILL: \"FILL\",\n    RIGHT: \"RIGHT\",\n    LEFT: \"LEFT\"\n});\n\nconst PageState = Object.freeze({\n    READY: \"READY\",\n    ACTIVE: \"ACTIVE\"\n});\n\nconst FlowType = Object.freeze({\n    HORIZONTAL: \"HORIZONTAL\",\n    VERTICAL: \"VERTICAL\"\n});\n\nconst SizeTarget = Object.freeze({\n    MINIMUM: 0xff\n});\n\n/* harmony default export */ __webpack_exports__[\"default\"] = ({\n    Colors,\n    ControlState,\n    Align,\n    PageState,\n    FlowType,\n    SizeTarget\n});\n\n\n//# sourceURL=webpack:///./src/lib/datalit/enums.js?");

/***/ }),

/***/ "./src/lib/datalit/errors.js":
/*!***********************************!*\
  !*** ./src/lib/datalit/errors.js ***!
  \***********************************/
/*! exports provided: datalitError */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"datalitError\", function() { return datalitError; });\nconst ERROR_LIST = {\n    propertySet: \"Set property '$0': '$1' is invalid, expecting '$2'\",\n    propertyNotFound: \"'$0' property not found: '$1'\",\n    arrangeAuthority: \"Arrange authority breach: '$0' is not a Section or Page\"\n};\n\nfunction datalitError(name, params) {\n    let message = ERROR_LIST[name];\n    for (let i = 0; i < params.length; i++) {\n        message = message.replace(\"$\" + i, params[i]);\n    }\n    throw new Error(message);\n}\n\n\n//# sourceURL=webpack:///./src/lib/datalit/errors.js?");

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
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"WelcomePage\", function() { return WelcomePage; });\n/* harmony import */ var _lib_datalit_enums_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../lib/datalit/enums.js */ \"./src/lib/datalit/enums.js\");\n/* harmony import */ var _lib_datalit_utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../lib/datalit/utils.js */ \"./src/lib/datalit/utils.js\");\n/* harmony import */ var _lib_datalit_controls_page_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../lib/datalit/controls/page.js */ \"./src/lib/datalit/controls/page.js\");\n/* harmony import */ var _lib_datalit_controls_section_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../lib/datalit/controls/section.js */ \"./src/lib/datalit/controls/section.js\");\n\n\n\n\n\nclass WelcomePage extends _lib_datalit_controls_page_js__WEBPACK_IMPORTED_MODULE_2__[\"Page\"] {\n    constructor() {\n        super();\n\n        this.mainSection = new _lib_datalit_controls_section_js__WEBPACK_IMPORTED_MODULE_3__[\"Section\"]({\n            flowType: _lib_datalit_enums_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].FlowType.VERTICAL,\n            align: _lib_datalit_enums_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].Align.FILL,\n            contentAlignment: _lib_datalit_enums_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].Align.TOP,\n            backgroundColor: _lib_datalit_utils_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"].newColor(20, 20, 40)\n        });\n\n        this.addSection(this.mainSection);\n\n        window.addEventListener(\"keydown\", e => this.handleKeypress(e));\n    }\n\n    handleKeypress(event) {\n        switch (event.key) {\n            case \"a\":\n                console.log(`mainSection: ${this.mainSection.position} ||${this.mainSection.size}`);\n                console.log(`otherSection: ${this.otherSection.position} ||${this.otherSection.size}`);\n                console.log(`thirdSection: ${this.thirdSection.position} ||${this.thirdSection.size}`);\n                break;\n            case \"b\":\n                this.otherSection.background.position[0]++;\n                this.otherSection.position[0]++;\n                _lib_datalit_enums_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].GlobalState.RedrawRequired = true;\n                break;\n            case \"c\":\n                this.otherSection.visible = !this.otherSection.visible;\n                _lib_datalit_enums_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].GlobalState.RedrawRequired = true;\n                break;\n        }\n    }\n}\n\n\n//# sourceURL=webpack:///./src/pages/welcomePage.js?");

/***/ })

/******/ });