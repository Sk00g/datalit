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

/***/ "./assets/assetConfig.js":
/*!*******************************!*\
  !*** ./assets/assetConfig.js ***!
  \*******************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony default export */ __webpack_exports__[\"default\"] = ({\"baseDir\": \"assets\", \"imageDir\": \"images\", \"imagePaths\": [\"char.png\", \"search-purple.png\", \"login-teal.png\"], \"imageCount\": 3});\n\n//# sourceURL=webpack:///./assets/assetConfig.js?");

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _pages_welcomePage_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./pages/welcomePage.js */ \"./src/pages/welcomePage.js\");\n/* harmony import */ var _lib_datalit_assetManager_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./lib/datalit/assetManager.js */ \"./src/lib/datalit/assetManager.js\");\n\n\n\n\n\nlet canvas = document.getElementById(\"canvas\");\nlet context = canvas.getContext(\"2d\");\n\nvar page = new _pages_welcomePage_js__WEBPACK_IMPORTED_MODULE_0__[\"WelcomePage\"](context);\n\nconsole.log(`... initialized application (${[window.innerWidth, window.innerHeight]})`);\n\nvar img = _lib_datalit_assetManager_js__WEBPACK_IMPORTED_MODULE_1__[\"Assets\"].getImage(\"search-purple\");\nvar img2 = _lib_datalit_assetManager_js__WEBPACK_IMPORTED_MODULE_1__[\"Assets\"].getImage(\"login-teal\");\nvar img3 = _lib_datalit_assetManager_js__WEBPACK_IMPORTED_MODULE_1__[\"Assets\"].getImage(\"char\");\n\nfunction main(currentTime) {\n    context.clearRect(0, 0, canvas.width, canvas.height);\n\n    context.drawImage(img, 10, 10);\n    context.drawImage(img2, 100, 10);\n    context.drawImage(img3, 50, 50);\n\n    window.requestAnimationFrame(main);\n}\n\nmain();\n\n\n//# sourceURL=webpack:///./src/index.js?");

/***/ }),

/***/ "./src/lib/datalit/assetManager.js":
/*!*****************************************!*\
  !*** ./src/lib/datalit/assetManager.js ***!
  \*****************************************/
/*! exports provided: Assets */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Assets\", function() { return Assets; });\n/* harmony import */ var _assets_assetConfig_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../assets/assetConfig.js */ \"./assets/assetConfig.js\");\n\n\n// Handles all assets for the application.\nclass AssetManager {\n    constructor() {\n        this._images = {};\n        this._imageDir = _assets_assetConfig_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].imageDir;\n\n        for (let file of _assets_assetConfig_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].imagePaths) {\n            let key = file;\n            if (file.search(\".\") != -1) key = file.split(\".\")[0];\n            this._images[key] = new Image();\n            this._images[key].src = \"../\" + _assets_assetConfig_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].baseDir + \"/\" + _assets_assetConfig_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].imageDir + \"/\" + file;\n        }\n    }\n\n    getImage(name) {\n        if (name.search(\".\") != -1) name = name.split(\".\")[0];\n\n        if (!(name in this._images)) {\n            throw new Error(`Image file ${name} not found in directory ${this._imageDir}`);\n        }\n\n        return this._images[name];\n    }\n\n    // getData(name) {\n    //     if (!(name in this._dataFiles)) {\n    //         throw new Error(`Data file ${name} not found in directory ${this._dataDir}`);\n    //     }\n\n    //     return fetch(\n    //         \"http://localhost:9080/public/\" + configData.baseDir + \"/\" + configData.dataDir + \"/\" + name\n    //     ).then(rsp => {\n    //         return rsp.json();\n    //     }).then();\n\n    //     return JSON.parse(this._dataFiles[name]);\n    // }\n}\n\nconst Assets = new AssetManager();\n\n\n//# sourceURL=webpack:///./src/lib/datalit/assetManager.js?");

/***/ }),

/***/ "./src/lib/datalit/controls/element.js":
/*!*********************************************!*\
  !*** ./src/lib/datalit/controls/element.js ***!
  \*********************************************/
/*! exports provided: Element */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Element\", function() { return Element; });\n/* harmony import */ var _core_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../core.js */ \"./src/lib/datalit/core.js\");\n\n\nclass Element {\n    constructor() {\n        this.position = [0, 0];\n        this.size = [1, 1];\n        this.visible = true;\n        this.alignment = _core_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].Align.CENTER;\n\n        this.margin = [0, 0, 0, 0];\n        for (let i = 0; i < 4; i++) this.margin[i] = _core_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].GlobalState.DefaultMargin;\n\n        // console.log(\"Element Constructor - 1\");\n    }\n\n    get height() {\n        return this.size[1];\n    }\n    set height(newHeight) {\n        this.size[1] = newHeight;\n    }\n    get width() {\n        return this.size[0];\n    }\n\n    setPosition(newPosition) {\n        if (newPosition[0] == -1) {\n            this.position[1] = newPosition[1];\n        } else if (newPosition[1] == -1) {\n            this.position[0] = newPosition[0];\n        } else {\n            this.position = newPosition;\n        }\n    }\n\n    setSize(newSize) {\n        this.size = newSize;\n    }\n\n    calculateViewsize() {\n        if (this.alignment == _core_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].Align.FILL) {\n            return null;\n        } else {\n            return size;\n        }\n    }\n\n    update(elapsed) {}\n    draw(context) {}\n}\n\n\n//# sourceURL=webpack:///./src/lib/datalit/controls/element.js?");

/***/ }),

/***/ "./src/lib/datalit/controls/icon.js":
/*!******************************************!*\
  !*** ./src/lib/datalit/controls/icon.js ***!
  \******************************************/
/*! exports provided: Icon */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Icon\", function() { return Icon; });\n/* harmony import */ var _element_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./element.js */ \"./src/lib/datalit/controls/element.js\");\n/* harmony import */ var _core_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../core.js */ \"./src/lib/datalit/core.js\");\n\n\n\nclass Icon extends _element_js__WEBPACK_IMPORTED_MODULE_0__[\"Element\"] {\n    constructor(size, alignment, sourceFile, sourceRect = null) {\n        super();\n\n        this.size = size;\n        this.alignment = alignment;\n        this.image = new Image();\n        this.sourceRect = sourceRect;\n        this.visible = false;\n\n        this.image.src = sourceFile;\n        this.image.onload = () => {\n            this.visible = true;\n            _core_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"].GlobalState.RedrawRequired = true;\n        };\n    }\n\n    draw(context) {\n        if (this.visible) {\n            if (this.sourceRect) {\n                context.drawImage(this.image, ...this.sourceRect, ...this.position, ...this.size);\n            } else {\n                context.drawImage(this.image, ...this.position, ...this.size);\n            }\n        }\n    }\n}\n\n\n//# sourceURL=webpack:///./src/lib/datalit/controls/icon.js?");

/***/ }),

/***/ "./src/lib/datalit/controls/label.js":
/*!*******************************************!*\
  !*** ./src/lib/datalit/controls/label.js ***!
  \*******************************************/
/*! exports provided: Label */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Label\", function() { return Label; });\n/* harmony import */ var _core_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../core.js */ \"./src/lib/datalit/core.js\");\n/* harmony import */ var _element_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./element.js */ \"./src/lib/datalit/controls/element.js\");\n\n\n\nclass Label extends _element_js__WEBPACK_IMPORTED_MODULE_1__[\"Element\"] {\n    constructor(alignment, context, text, fontColor = \"rgb(0, 0, 0)\", fontSize = 12) {\n        super();\n\n        this.alignment = alignment;\n        this.text = text;\n        this.fontSize = fontSize;\n        this.color = fontColor;\n        this.context = context;\n\n        this.context.font = this.fontSize + \"pt sans-serif\";\n        this.size = [this.context.measureText(text).width, this.fontSize];\n\n        if (this.alignment == _core_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].Align.FILL) {\n            throw new Error(\"Text-based elements cannot have a FILL alignment\");\n        }\n    }\n\n    calculateViewsize() {\n        return [this.size[0] + this.margin[0] + this.margin[2], this.size[1] + this.margin[1] + this.margin[3]];\n    }\n\n    draw(context) {\n        context.fillStyle = this.color;\n        context.font = this.fontSize + \"pt sans-serif\";\n        let truePosition = [this.position[0] + this.margin[0], this.position[1] + this.fontSize + this.margin[1]];\n        console.log(`Pos[1]: ${this.position[1]} || TruePos[1]: ${truePosition[1]}`);\n        context.fillText(this.text, ...truePosition);\n    }\n}\n\n\n//# sourceURL=webpack:///./src/lib/datalit/controls/label.js?");

/***/ }),

/***/ "./src/lib/datalit/controls/page.js":
/*!******************************************!*\
  !*** ./src/lib/datalit/controls/page.js ***!
  \******************************************/
/*! exports provided: Page */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Page\", function() { return Page; });\n/* harmony import */ var _element_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./element.js */ \"./src/lib/datalit/controls/element.js\");\n/* harmony import */ var _core_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../core.js */ \"./src/lib/datalit/core.js\");\n\n\n\nclass Page extends _element_js__WEBPACK_IMPORTED_MODULE_0__[\"Element\"] {\n    constructor(context, margins = [0, 0, 0, 0]) {\n        super();\n\n        // console.log(\"Page Constructor - 2\");\n\n        this.context = context;\n\n        this._sectionList = [];\n        this._state = _core_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"].PageState.READY;\n\n        this.margin = margins;\n\n        // These private variables are used to simplify the render 'arrangement' process\n        this._origin = [margins[0], margins[1]];\n        this._freeOrigins = [0, 0, 0, 0];\n    }\n\n    _prerenderCheck() {\n        if (this._sectionList.filter(sec => sec.alignment == _core_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"].Align.FILL).length > 1) {\n            throw new Error(\"Can only have one Section with alignment == core.Align.FILL\");\n        }\n    }\n\n    render() {\n        this._prerenderCheck();\n\n        this._freeOrigins = [\n            this.margin[0],\n            this.margin[1],\n            window.innerWidth - this.margin[2],\n            window.innerHeight - this.margin[3]\n        ];\n        let totalSpace = [this._freeOrigins[2] - this._freeOrigins[0], this._freeOrigins[3] - this._freeOrigins[1]];\n\n        let viewableSections = this._sectionList.filter(sec => sec.visible && sec.alignment != _core_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"].Align.FILL);\n        for (let i = 0; i < viewableSections.length; i++) {\n            let sec = viewableSections[i];\n            let requestedSize = sec.calculateViewsize(totalSpace);\n            // console.log(`Requested size: ${requestedSize}`);\n            if (sec.flowType == _core_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"].FlowType.HORIZONTAL) {\n                switch (sec.alignment) {\n                    case _core_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"].Align.TOP:\n                        sec.setPosition([this._freeOrigins[0], this._freeOrigins[1]]);\n                        sec.setSize([this._freeOrigins[2] - this._freeOrigins[0], requestedSize[1]]);\n                        this._freeOrigins[1] = requestedSize[1];\n                        break;\n                    case _core_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"].Align.BOTTOM:\n                        sec.setPosition([this._freeOrigins[0], this._freeOrigins[3] - requestedSize[1]]);\n                        sec.setSize([this._freeOrigins[2] - this._freeOrigins[0], requestedSize[1]]);\n                        this._freeOrigins[3] -= requestedSize[1];\n                        break;\n                }\n            } else if (sec.flowType == _core_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"].FlowType.VERTICAL) {\n                switch (sec.alignment) {\n                    case _core_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"].Align.LEFT:\n                        sec.setPosition([this._freeOrigins[0], this._freeOrigins[1]]);\n                        sec.setSize([requestedSize[0], this._freeOrigins[3] - this._freeOrigins[1]]);\n                        this._freeOrigins[0] = requestedSize[0];\n                        break;\n                    case _core_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"].Align.RIGHT:\n                        sec.setPosition([this._freeOrigins[2] - requestedSize[0], this._freeOrigins[1]]);\n                        sec.setSize([requestedSize[0], this._freeOrigins[3] - this._freeOrigins[1]]);\n                        this._freeOrigins[2] -= requestedSize[0];\n                        break;\n                }\n            }\n        }\n\n        // Arrange the align.FILL section\n        let fillSection = this._sectionList.find(sec => sec.alignment == _core_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"].Align.FILL);\n        fillSection.setPosition([this._freeOrigins[0], this._freeOrigins[1]]);\n        fillSection.setSize([this._freeOrigins[2] - this._freeOrigins[0], this._freeOrigins[3] - this._freeOrigins[1]]);\n\n        // console.log(`finished render... ${this._freeOrigins}`);\n    }\n\n    // Private / Protected classes\n    addSection(section) {\n        this._sectionList.push(section);\n\n        if (this._sectionList.find(sec => sec.alignment == _core_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"].Align.FILL) == undefined) {\n            throw new Error(\"A page must have at least one section with alignment == FILL\");\n        }\n\n        this.render();\n    }\n\n    removeSection(section) {\n        this._sectionList.splice(this._sectionList.indexOf(section), 1);\n        this.render();\n    }\n\n    // Extending classes should implement the following methods\n    activate() {\n        this._state = _core_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"].PageState.ACTIVE;\n\n        this.render();\n    }\n\n    deactivate() {\n        this._state = _core_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"].PageState.READY;\n    }\n\n    // Called by PageManager (think FSM)\n    update(elapsed) {\n        for (let section of this._sectionList) {\n            section.update(elapsed);\n        }\n    }\n\n    draw(context) {\n        for (let section of this._sectionList) {\n            if (section.visible) {\n                section.draw(context);\n            }\n        }\n    }\n}\n\n\n//# sourceURL=webpack:///./src/lib/datalit/controls/page.js?");

/***/ }),

/***/ "./src/lib/datalit/controls/rect.js":
/*!******************************************!*\
  !*** ./src/lib/datalit/controls/rect.js ***!
  \******************************************/
/*! exports provided: Rect */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Rect\", function() { return Rect; });\n/* harmony import */ var _core_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../core.js */ \"./src/lib/datalit/core.js\");\n/* harmony import */ var _element_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./element.js */ \"./src/lib/datalit/controls/element.js\");\n\n\n\nclass Rect extends _element_js__WEBPACK_IMPORTED_MODULE_1__[\"Element\"] {\n    constructor(size, fillColor, alignment = _core_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].Align.FILL) {\n        super();\n\n        this.size = size;\n        this.alignment = alignment;\n        this.fillColor = fillColor;\n    }\n\n    calculateViewsize() {\n        return [this.size[0] + this.margin[0] + this.margin[2], this.size[1] + this.margin[1] + this.margin[3]];\n    }\n\n    draw(context) {\n        context.fillStyle = this.fillColor;\n        let truePosition = [this.position[0] + this.margin[0], this.position[1] + this.margin[1]];\n        console.log(`drawing rect at ${truePosition}`);\n        context.fillRect(...truePosition, ...this.size);\n    }\n}\n\n\n//# sourceURL=webpack:///./src/lib/datalit/controls/rect.js?");

/***/ }),

/***/ "./src/lib/datalit/controls/section.js":
/*!*********************************************!*\
  !*** ./src/lib/datalit/controls/section.js ***!
  \*********************************************/
/*! exports provided: Section */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Section\", function() { return Section; });\n/* harmony import */ var _core_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../core.js */ \"./src/lib/datalit/core.js\");\n/* harmony import */ var _element_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./element.js */ \"./src/lib/datalit/controls/element.js\");\n/* harmony import */ var _rect_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./rect.js */ \"./src/lib/datalit/controls/rect.js\");\n\n\n\n\nclass Section extends _element_js__WEBPACK_IMPORTED_MODULE_1__[\"Element\"] {\n    constructor(\n        flowType = _core_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].FlowType.VERTICAL,\n        alignment = _core_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].Align.LEFT,\n        targetSize = _core_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].SizeTarget.MINIMUM,\n        background = _core_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].GlobalState.DefaultBackground\n    ) {\n        super();\n\n        // console.log(\"Section constructor\");\n        if (targetSize != _core_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].SizeTarget.MINIMUM && (targetSize < 0 || targetSize >= 1.0)) {\n            throw new Error(\"Invalid targetSize for Section. Must be between 0 and 1.0\");\n        }\n\n        this.children = [];\n        this.flowType = flowType;\n        this.alignment = alignment;\n        this.contentAlignment = _core_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].Align.CENTER;\n        this.targetSize = targetSize;\n        this.margin = [0, 0, 0, 0];\n\n        if (background) {\n            this.background = new _rect_js__WEBPACK_IMPORTED_MODULE_2__[\"Rect\"]([0, 0], background);\n            this.background.margin = [0, 0, 0, 0];\n        }\n    }\n\n    render() {\n        if (this.children.length < 1) return;\n\n        if (this.flowType == _core_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].FlowType.HORIZONTAL) {\n        } else if (this.flowType == _core_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].FlowType.VERTICAL) {\n            // All horizontal positions are the same regardless of alignment\n            for (let child of this.children) {\n                if (child.fillWidth) {\n                    child.setSize([this.size[0] - child.margin[0] - child.margin[2], child.size[1]]);\n                    // console.log(`Child: ${child.size[0]} vs Section: ${this.size[0]}`);\n                    // console.log(`Child: ${child.position[0]} vs Section: ${this.position[0]}`);\n                    child.setPosition([this.position[0] + child.margin[0]]);\n                    continue;\n                }\n\n                switch (child.alignment) {\n                    case _core_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].Align.RIGHT:\n                        child.setPosition([\n                            this.position[0] + this.size[0] - Math.min(child.calculateViewsize()[0], this.size[0]),\n                            -1\n                        ]);\n                        break;\n                    case _core_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].Align.CENTER:\n                        let space = Math.max(this.position[0] + this.size[0] - child.calculateViewsize()[0], 0);\n                        child.setPosition([Math.floor(space / 2), -1]);\n                        break;\n                }\n            }\n\n            switch (this.contentAlignment) {\n                case _core_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].Align.TOP:\n                    var origin = 0;\n                    for (let child of this.children) {\n                        child.setPosition([-1, this.position[1] + origin]);\n                        origin += child.calculateViewsize()[1];\n                    }\n                    break;\n                case _core_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].Align.BOTTOM:\n                    var origin = 0;\n                    for (let child of this.children) {\n                        let childPosition = [\n                            -1,\n                            this.position[1] + this.size[1] - origin - child.calculateViewsize()[1]\n                        ];\n                        child.setPosition(childPosition);\n                        origin += child.calculateViewsize()[1];\n                    }\n                    break;\n                case _core_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].Align.CENTER:\n                    let heights = this.children.map(ch => ch.calculateViewsize()[1]);\n                    let totalHeight = heights.reduce((total, amount) => total + amount);\n                    var origin = this.position[1] + Math.floor((this.size[1] - totalHeight) / 2);\n\n                    for (let child of this.children) {\n                        child.setPosition([-1, origin]);\n                        origin += child.calculateViewsize()[1];\n                    }\n\n                    break;\n            }\n        }\n    }\n\n    calculateViewsize(availableSpace) {\n        let requestedSize = [0, 0];\n\n        if (this.flowType == _core_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].FlowType.HORIZONTAL) {\n            if (this.targetSize == _core_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].SizeTarget.MINIMUM) {\n                let largestHeight = 0;\n                for (let child of this.children) {\n                    if (child.height > largestHeight) {\n                        largestHeight = child.height;\n                    }\n                }\n                requestedSize = [availableSpace[0], largestHeight];\n            } else {\n                // targetSize is a float value between 0 and 1\n                requestedSize = [availableSpace[0], Math.floor(this.targetSize * availableSpace[1])];\n            }\n        } else if (this.flowType == _core_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].FlowType.VERTICAL) {\n            if (this.targetSize == _core_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].SizeTarget.MINIMUM) {\n                let largestWidth = 0;\n                for (let child of this.children) {\n                    if (child.width() > largestWidth) {\n                        largestWidth = child.width();\n                    }\n                }\n                requestedSize = [largestWidth, availableSpace[1]];\n            } else {\n                requestedSize = [Math.floor(this.targetSize * availableSpace[0]), availableSpace[1]];\n            }\n        }\n\n        return requestedSize;\n    }\n\n    setSize(newSize) {\n        super.setSize(newSize);\n        this.background.setSize(newSize);\n\n        // This render can now determine the size and alignment of nested sections and elements\n        this.render();\n    }\n\n    setPosition(newPosition) {\n        super.setPosition(newPosition);\n        this.background.setPosition(newPosition);\n    }\n\n    addChildren(newChildren) {\n        if (Array.isArray(newChildren)) {\n            for (let child of newChildren) {\n                this.children.push(child);\n            }\n        } else {\n            this.children.push(newChildren);\n        }\n    }\n\n    update(elapsed) {\n        for (let child of this.children) {\n            child.update(elapsed);\n        }\n    }\n\n    draw(context) {\n        if (!this.visible) {\n            throw new Error(\"Cannot draw invisible elements!\");\n        }\n\n        if (this.background) this.background.draw(context);\n\n        for (let child of this.children) {\n            if (child.visible) {\n                child.draw(context);\n            }\n        }\n    }\n}\n\n\n//# sourceURL=webpack:///./src/lib/datalit/controls/section.js?");

/***/ }),

/***/ "./src/lib/datalit/core.js":
/*!*********************************!*\
  !*** ./src/lib/datalit/core.js ***!
  \*********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\nfunction newColor(r, g, b, a = 1.0) {\n    return `rgba(${r},${g},${b},${a})`;\n}\n\nconst Colors = Object.freeze({\n    RED: \"rgb(255, 0, 0)\",\n    GREEN: \"rgb(0, 255, 0)\",\n    BLUE: \"rgb(0, 0, 255)\",\n    OFFWHITE: \"rgb(210, 210, 210)\",\n    OFFBLACK: \"rgb(20, 20, 20)\"\n});\n\nconst ControlState = Object.freeze({\n    DISABLED: 0,\n    ENABLED: 1,\n    HOVERED: 2,\n    FOCUSED: 3,\n    DEPRESSED: 4,\n    DRAGGED: 5\n});\n\nconst Align = Object.freeze({\n    TOP: 0,\n    BOTTOM: 1,\n    CENTER: 2,\n    FREE: 3,\n    FILL: 4,\n    RIGHT: 5,\n    LEFT: 6\n});\n\nconst PageState = Object.freeze({\n    READY: 0,\n    ACTIVE: 1\n});\n\nconst FlowType = Object.freeze({\n    HORIZONTAL: 0,\n    VERTICAL: 1\n});\n\nconst SizeTarget = Object.freeze({\n    MINIMUM: 0xff\n});\n\nfunction resizeCanvas() {\n    let canvas = document.getElementById(\"canvas\");\n    canvas.width = window.innerWidth;\n    canvas.height = window.innerHeight;\n}\n\nfunction initialize(context, defaultBackground = Colors.OFFWHITE) {\n    // Define the app-wide default background\n    GlobalState.DefaultBackground = defaultBackground;\n\n    // Specify the alpha resolution strategy\n    context.globalCompositeOperation = \"destination-over\";\n\n    // Initialize the canvas to the appropriate size\n    resizeCanvas();\n\n    // All resize events results in the resizing of the canvas\n    window.addEventListener(\"resize\", resizeCanvas);\n}\n\nlet GlobalState = {\n    DefaultBackground: Colors.OFFWHITE,\n    DefaultMargin: 10,\n    RedrawRequired: true,\n    ClearRegions: []\n};\n\n/* harmony default export */ __webpack_exports__[\"default\"] = ({\n    Colors,\n    ControlState,\n    Align,\n    PageState,\n    FlowType,\n    SizeTarget,\n    initialize,\n    newColor,\n    GlobalState\n});\n\n\n//# sourceURL=webpack:///./src/lib/datalit/core.js?");

/***/ }),

/***/ "./src/pages/welcomePage.js":
/*!**********************************!*\
  !*** ./src/pages/welcomePage.js ***!
  \**********************************/
/*! exports provided: WelcomePage */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"WelcomePage\", function() { return WelcomePage; });\n/* harmony import */ var _lib_datalit_core_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../lib/datalit/core.js */ \"./src/lib/datalit/core.js\");\n/* harmony import */ var _lib_datalit_controls_page_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../lib/datalit/controls/page.js */ \"./src/lib/datalit/controls/page.js\");\n/* harmony import */ var _lib_datalit_controls_rect_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../lib/datalit/controls/rect.js */ \"./src/lib/datalit/controls/rect.js\");\n/* harmony import */ var _lib_datalit_controls_label_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../lib/datalit/controls/label.js */ \"./src/lib/datalit/controls/label.js\");\n/* harmony import */ var _lib_datalit_controls_section_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../lib/datalit/controls/section.js */ \"./src/lib/datalit/controls/section.js\");\n/* harmony import */ var _lib_datalit_controls_icon_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../lib/datalit/controls/icon.js */ \"./src/lib/datalit/controls/icon.js\");\n\n\n\n\n\n\n\nclass WelcomePage extends _lib_datalit_controls_page_js__WEBPACK_IMPORTED_MODULE_1__[\"Page\"] {\n    constructor(context) {\n        // super(context, [20, 20, 20, 20]);\n        super(context, [0, 0, 0, 0]);\n\n        this.topSection = new _lib_datalit_controls_section_js__WEBPACK_IMPORTED_MODULE_4__[\"Section\"](_lib_datalit_core_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].FlowType.HORIZONTAL, _lib_datalit_core_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].Align.TOP, 0.07, _lib_datalit_core_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].newColor(25, 10, 35));\n        this.leftSection = new _lib_datalit_controls_section_js__WEBPACK_IMPORTED_MODULE_4__[\"Section\"](_lib_datalit_core_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].FlowType.VERTICAL, _lib_datalit_core_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].Align.LEFT, 0.2, _lib_datalit_core_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].newColor(25, 10, 15));\n        this.mainSection = new _lib_datalit_controls_section_js__WEBPACK_IMPORTED_MODULE_4__[\"Section\"](_lib_datalit_core_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].FlowType.VERTICAL, _lib_datalit_core_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].Align.FILL, 0, _lib_datalit_core_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].newColor(20, 20, 40));\n        this.rightSection = new _lib_datalit_controls_section_js__WEBPACK_IMPORTED_MODULE_4__[\"Section\"](_lib_datalit_core_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].FlowType.VERTICAL, _lib_datalit_core_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].Align.RIGHT, 0.2, _lib_datalit_core_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].newColor(25, 10, 15));\n        this.botSection = new _lib_datalit_controls_section_js__WEBPACK_IMPORTED_MODULE_4__[\"Section\"](_lib_datalit_core_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].FlowType.HORIZONTAL, _lib_datalit_core_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].Align.BOTTOM, 0.07, _lib_datalit_core_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].Colors.OFFBLACK);\n\n        // Add elements\n        let la = _lib_datalit_core_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].Align.RIGHT;\n        let testLabel = new _lib_datalit_controls_label_js__WEBPACK_IMPORTED_MODULE_3__[\"Label\"](la, context, \"COMPONENTS\", _lib_datalit_core_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].Colors.OFFWHITE, 14);\n        let label2 = new _lib_datalit_controls_label_js__WEBPACK_IMPORTED_MODULE_3__[\"Label\"](la, context, \"ORDERS\", _lib_datalit_core_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].Colors.OFFWHITE, 14);\n        let label3 = new _lib_datalit_controls_label_js__WEBPACK_IMPORTED_MODULE_3__[\"Label\"](la, context, \"ACCOUNTS\", _lib_datalit_core_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].Colors.OFFWHITE, 14);\n\n        // for (let lb of [testLabel, label2, label3]) {\n        //   lb.margin = [0, 0, 0, 0];\n        // }\n\n        let line = new _lib_datalit_controls_rect_js__WEBPACK_IMPORTED_MODULE_2__[\"Rect\"]([1, 2], _lib_datalit_core_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].newColor(200, 200, 200, 0.15), _lib_datalit_core_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].Align.CENTER);\n        line.height = 4;\n        line.fillWidth = true;\n\n        this.leftSection.contentAlignment = _lib_datalit_core_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].Align.TOP;\n        this.leftSection.addChildren([testLabel, label2, line, label3]);\n        // this.rightSection.addChildren([testLabel, label2, label3]);\n\n        this.addSection(this.mainSection);\n        this.addSection(this.topSection);\n        this.addSection(this.botSection);\n        this.addSection(this.leftSection);\n        this.addSection(this.rightSection);\n\n        // this.testImage = new Icon([32, 32], core.Align.LEFT, \"../../../assets/images/search-purple.png\");\n        // this.mainSection.addChildren(this.testImage);\n\n        window.addEventListener(\"keydown\", e => this.handleKeypress(e));\n    }\n\n    handleKeypress(event) {\n        switch (event.key) {\n            case \"a\":\n                console.log(`mainSection: ${this.mainSection.position} ||${this.mainSection.size}`);\n                console.log(`otherSection: ${this.otherSection.position} ||${this.otherSection.size}`);\n                console.log(`thirdSection: ${this.thirdSection.position} ||${this.thirdSection.size}`);\n                break;\n            case \"b\":\n                this.otherSection.background.position[0]++;\n                this.otherSection.position[0]++;\n                _lib_datalit_core_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].GlobalState.RedrawRequired = true;\n                break;\n            case \"c\":\n                this.otherSection.visible = !this.otherSection.visible;\n                _lib_datalit_core_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].GlobalState.RedrawRequired = true;\n                break;\n        }\n    }\n}\n\n\n//# sourceURL=webpack:///./src/pages/welcomePage.js?");

/***/ })

/******/ });