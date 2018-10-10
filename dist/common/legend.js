'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _vischartbase = require('../common/vischartbase.js');

var _vischartbase2 = _interopRequireDefault(_vischartbase);

var _geometry = require('../geometry/geometry.js');

var geometry = _interopRequireWildcard(_geometry);

var _konva = require('konva');

var _konva2 = _interopRequireDefault(_konva);

var _jsonUtilsx = require('json-utilsx');

var _jsonUtilsx2 = _interopRequireDefault(_jsonUtilsx);

var _utils = require('../common/utils.js');

var utils = _interopRequireWildcard(_utils);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Legend = function (_VisChartBase) {
    _inherits(Legend, _VisChartBase);

    function Legend(box, width, height) {
        _classCallCheck(this, Legend);

        var _this = _possibleConstructorReturn(this, (Legend.__proto__ || Object.getPrototypeOf(Legend)).call(this, box, width, height));

        _this.name = 'Legend ' + Date.now();

        _this.text = [];
        _this.icon = [];
        _this.group = [];

        return _this;
    }

    _createClass(Legend, [{
        key: 'setStage',
        value: function setStage(stage) {
            _get(Legend.prototype.__proto__ || Object.getPrototypeOf(Legend.prototype), 'setStage', this).call(this, stage);

            this.layer = new _konva2.default.Layer({});

            stage.add(this.layer);
        }
    }, {
        key: 'init',
        value: function init() {
            var _this2 = this;

            this.data.data.map(function (item, key) {
                var x = 0,
                    y = 0,
                    count = key + 1,
                    curRow = Math.floor(key / _this2.column());

                switch (_this2.direction()) {
                    case 'bottom':
                        {
                            y = _this2.height - (_this2.row() - curRow) * (_this2.space() + _this2.rowHeight());
                            x = _this2.space() + (_this2.space() + _this2.columnWidth()) * (key % _this2.column());
                            console.log(x, y, key, _this2.direction(), curRow);
                            break;
                        }
                }

                var text = new _konva2.default.Rect({
                    text: key + '',
                    x: x,
                    y: y,
                    width: _this2.columnWidth,
                    height: 20,
                    fill: '#ffffff'
                });

                _this2.layer.add(text);
            });
            this.stage.add(this.layer);

            return this;
        }
    }, {
        key: 'update',
        value: function update(data) {
            this.data = data || {};
            if (!(this.data && this.data.data && this.data.data.length)) return;

            console.log(this.column(), this.row(), this.direction(), this.outerHeight(), this.columnWidth());

            this.init();
        }
    }, {
        key: 'outerHeight',
        value: function outerHeight() {
            return this.rowHeight() * this.row() + this.space();
        }
    }, {
        key: 'total',
        value: function total() {
            var r = 0;

            return r;
        }
    }, {
        key: 'columnWidth',
        value: function columnWidth() {
            return (this.width - (this.column() + 2 + this.column() - 1) * this.space()) / this.column();
        }
    }, {
        key: 'column',
        value: function column() {
            return this.data.column || 1;
        }
    }, {
        key: 'space',
        value: function space() {
            return this.data.space || 15;
        }
    }, {
        key: 'rowHeight',
        value: function rowHeight() {
            return this.data.rowHeight || 24;
        }
    }, {
        key: 'row',
        value: function row() {
            return Math.ceil(this.data.data.length / this.column());
        }
    }, {
        key: 'direction',
        value: function direction() {
            var r = 'top';

            if (this.data.bottom) {
                r = 'bottom';
            } else if (this.data.left) {
                r = 'left';
            } else if (this.data.right) {
                r = 'right';
            }

            return r;
        }
    }]);

    return Legend;
}(_vischartbase2.default);

exports.default = Legend;