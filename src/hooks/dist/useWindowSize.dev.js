"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = require("react");

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var useWindowSize = function useWindowSize() {
  var _useState = (0, _react.useState)({
    width: undefined,
    height: undefined
  }),
      _useState2 = _slicedToArray(_useState, 2),
      windowSize = _useState2[0],
      setWindowSize = _useState2[1];

  (0, _react.useEffect)(function () {
    var handleResize = function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    handleResize();
    return function () {
      return window.removeEventListener('resize', handleResize);
    };
  }, []);
  return windowSize;
};

var _default = useWindowSize;
exports["default"] = _default;
//# sourceMappingURL=useWindowSize.dev.js.map
