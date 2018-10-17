'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _threebase = require('./common/threebase.js');

var _threebase2 = _interopRequireDefault(_threebase);

var _jsonUtilsx = require('json-utilsx');

var _jsonUtilsx2 = _interopRequireDefault(_jsonUtilsx);

var _three = require('../utils/three.js');

var _three2 = _interopRequireDefault(_three);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var VisThree = function (_VisChartBase) {
    _inherits(VisThree, _VisChartBase);

    function VisThree(box, width, height) {
        _classCallCheck(this, VisThree);

        var _this = _possibleConstructorReturn(this, (VisThree.__proto__ || Object.getPrototypeOf(VisThree)).call(this, box, width, height));

        _this.ins = [];
        _this.legend = null;

        _this._setSize(width, height);

        console.log(222);

        return _this;
    }

    _createClass(VisThree, [{
        key: 'update',
        value: function update(data, ignoreLegend) {
            var redraw = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
        }
    }]);

    return VisThree;
}(_threebase2.default);

exports.default = VisThree;