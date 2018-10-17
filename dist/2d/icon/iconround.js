'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _konvabase = require('../common/konvabase.js');

var _konvabase2 = _interopRequireDefault(_konvabase);

var _geometry = require('../../geometry/geometry.js');

var geometry = _interopRequireWildcard(_geometry);

var _konva = require('konva');

var _konva2 = _interopRequireDefault(_konva);

var _jsonUtilsx = require('json-utilsx');

var _jsonUtilsx2 = _interopRequireDefault(_jsonUtilsx);

var _utils = require('../../common/utils.js');

var utils = _interopRequireWildcard(_utils);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var IconRound = function (_VisChartBase) {
    _inherits(IconRound, _VisChartBase);

    function IconRound(box, width, height) {
        _classCallCheck(this, IconRound);

        var _this = _possibleConstructorReturn(this, (IconRound.__proto__ || Object.getPrototypeOf(IconRound)).call(this, box, width, height));

        _this.name = 'IconRound ' + Date.now();

        _this.outRadius = 6;
        _this.inRadius = 2;

        _this.color = '#ffffff';

        _this.max = 1.1;
        _this.min = 0.8;

        _this.step = .006;
        _this.cur = 1;

        _this.isplus = 1;

        _this.init();
        return _this;
    }

    _createClass(IconRound, [{
        key: 'init',
        value: function init() {
            return this;
        }
    }, {
        key: 'update',
        value: function update(point) {
            this.point = point;

            this.group = new _konva2.default.Group({
                x: this.point.x + this.cx,
                y: this.point.y + this.cy,
                width: this.outRadius * 2,
                height: this.outRadius * 2
            });
            this.addDestroy(this.group);

            this.circle = new _konva2.default.Circle({
                radius: this.inRadius,
                fill: this.color,
                stroke: this.color,
                x: 0,
                y: 0
            });
            this.addDestroy(this.circle);

            this.outcircle = new _konva2.default.Circle({
                radius: this.outRadius,
                fill: '#ffffff00',
                stroke: this.color,
                strokeWidth: 1,
                x: 0,
                y: 0
            });
            this.addDestroy(this.outcircle);

            this.group.add(this.circle);
            this.group.add(this.outcircle);

            this.group.scale({ x: this.cur, y: this.cur });

            this.layer.add(this.group);

            //window.requestAnimationFrame( ()=>{ this.animation() } );
        }
    }, {
        key: 'reset',
        value: function reset() {}
    }, {
        key: 'animation',
        value: function animation() {
            var _this2 = this;

            if (this.plus) {
                this.cur = this.cur + this.step;

                if (this.cur > this.max) {
                    this.cur = this.max;
                    this.plus = 0;
                }
            } else {
                this.cur = this.cur - this.step;
                if (this.cur < this.min) {
                    this.cur = this.min;
                    this.plus = 1;
                }
            }

            this.group.scale({ x: this.cur, y: this.cur });

            this.stage.add(this.layer);

            window.requestAnimationFrame(function () {
                _this2.animation();
            });
        }
    }, {
        key: 'initDataLayout',
        value: function initDataLayout() {}
    }, {
        key: 'calcDataPosition',
        value: function calcDataPosition() {}
    }, {
        key: 'animationLine',
        value: function animationLine() {}
    }, {
        key: 'calcLayoutPosition',
        value: function calcLayoutPosition() {}
    }]);

    return IconRound;
}(_konvabase2.default);

exports.default = IconRound;