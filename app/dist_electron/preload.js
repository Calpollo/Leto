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
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/preload.js":
/*!************************!*\
  !*** ./src/preload.js ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const { contextBridge, ipcRenderer } = __webpack_require__(/*! electron */ \"electron\");\r\nconst fs = __webpack_require__(/*! fs */ \"fs\");\r\n\r\ncontextBridge.exposeInMainWorld(\"fileWriter\", {\r\n  saveConfig: (config) => {\r\n    fs.writeFile(\r\n      \"./config/leto.config.json\",\r\n      JSON.stringify(config, null, 2),\r\n      () => { }\r\n    );\r\n  },\r\n});\r\n\r\ncontextBridge.exposeInMainWorld(\"ipc\", {\r\n  getZeitspanne: (data) => ipcRenderer.invoke(\"getZeitspanne\", data),\r\n  getTermin: (data) => ipcRenderer.invoke(\"getTermin\", data),\r\n  getVertrag: (data) => ipcRenderer.invoke(\"getVertrag\", data),\r\n  getKunde: (data) => ipcRenderer.invoke(\"getKunde\", data),\r\n  getTherapeut: (data) => ipcRenderer.invoke(\"getTherapeut\", data),\r\n  getPraxis: (data) => ipcRenderer.invoke(\"getPraxis\", data),\r\n  getRezept: (data) => ipcRenderer.invoke(\"getRezept\", data),\r\n  getHeilmittel: (data) => ipcRenderer.invoke(\"getHeilmittel\", data),\r\n  getDatum: (data) => ipcRenderer.invoke(\"getDatum\", data),\r\n  getICD10Code: (data) => ipcRenderer.invoke(\"getICD10Code\", data),\r\n  getArzt: (data) => ipcRenderer.invoke(\"getArzt\", data),\r\n\r\n  createZeitspanne: (data) => ipcRenderer.invoke(\"createZeitspanne\", data),\r\n  createTermin: (data) => ipcRenderer.invoke(\"createTermin\", data),\r\n  createVertrag: (data) => ipcRenderer.invoke(\"createVertrag\", data),\r\n  createKunde: (data) => ipcRenderer.invoke(\"createKunde\", data),\r\n  createTherapeut: (data) => ipcRenderer.invoke(\"createTherapeut\", data),\r\n  createPraxis: (data) => ipcRenderer.invoke(\"createPraxis\", data),\r\n  createRezept: (data) => ipcRenderer.invoke(\"createRezept\", data),\r\n  createHeilmittel: (data) => ipcRenderer.invoke(\"createHeilmittel\", data),\r\n  createDatum: (data) => ipcRenderer.invoke(\"createDatum\", data),\r\n  createArzt: (data) => ipcRenderer.invoke(\"createArzt\", data),\r\n\r\n  updateZeitspanne: (data) => ipcRenderer.invoke(\"updateZeitspanne\", data),\r\n  updateTermin: (data) => ipcRenderer.invoke(\"updateTermin\", data),\r\n  updateVertrag: (data) => ipcRenderer.invoke(\"updateVertrag\", data),\r\n  updateKunde: (data) => ipcRenderer.invoke(\"updateKunde\", data),\r\n  updateTherapeut: (data) => ipcRenderer.invoke(\"updateTherapeut\", data),\r\n  updatePraxis: (data) => ipcRenderer.invoke(\"updatePraxis\", data),\r\n  updateRezept: (data) => ipcRenderer.invoke(\"updateRezept\", data),\r\n  updateHeilmittel: (data) => ipcRenderer.invoke(\"updateHeilmittel\", data),\r\n  updateDatum: (data) => ipcRenderer.invoke(\"updateDatum\", data),\r\n\r\n  setTherapeutHeilmittel: (data) =>\r\n    ipcRenderer.invoke(\"setTherapeutHeilmittel\", data),\r\n  setRezeptHeilmittel: (data) =>\r\n    ipcRenderer.invoke(\"setRezeptHeilmittel\", data),\r\n\r\n  removeZeitspanne: (data) => ipcRenderer.invoke(\"removeZeitspanne\", data),\r\n  removeTermin: (data) => ipcRenderer.invoke(\"removeTermin\", data),\r\n  removeVertrag: (data) => ipcRenderer.invoke(\"removeVertrag\", data),\r\n  removeKunde: (data) => ipcRenderer.invoke(\"removeKunde\", data),\r\n  removeTherapeut: (data) => ipcRenderer.invoke(\"removeTherapeut\", data),\r\n  removePraxis: (data) => ipcRenderer.invoke(\"removePraxis\", data),\r\n  removeRezept: (data) => ipcRenderer.invoke(\"removeRezept\", data),\r\n  removeHeilmittel: (data) => ipcRenderer.invoke(\"removeHeilmittel\", data),\r\n  removeDatum: (data) => ipcRenderer.invoke(\"removeDatum\", data),\r\n});\r\n\n\n//# sourceURL=webpack:///./src/preload.js?");

/***/ }),

/***/ 0:
/*!******************************!*\
  !*** multi ./src/preload.js ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("module.exports = __webpack_require__(/*! C:\\Users\\Andreas\\IdeaProjects\\leto\\src\\preload.js */\"./src/preload.js\");\n\n\n//# sourceURL=webpack:///multi_./src/preload.js?");

/***/ }),

/***/ "electron":
/*!***************************!*\
  !*** external "electron" ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"electron\");\n\n//# sourceURL=webpack:///external_%22electron%22?");

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"fs\");\n\n//# sourceURL=webpack:///external_%22fs%22?");

/***/ })

/******/ });