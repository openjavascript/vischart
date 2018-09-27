'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _two = require('two.js');

var _two2 = _interopRequireDefault(_two);

var _geometry = require('../geometry/geometry.js');

var geometry = _interopRequireWildcard(_geometry);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Dount = function () {
    function Dount(canvas) {
        var width = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 400;
        var height = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 400;

        _classCallCheck(this, Dount);

        this.name = 'DiagramMeter ' + Date.now();

        this.canvas = canvas;
        this.width = width;
        this.height = height;

        this.initPosition();

        this.init();
    }

    _createClass(Dount, [{
        key: 'initPosition',
        value: function initPosition() {
            var tmp = void 0,
                tmppoint = void 0;

            this.cx = this.width / 2;
            this.cy = this.height / 2;
            this.cpoint = { x: this.cx, y: this.cy };
            this.radius = this.width / 2 / 2;
            this.sradius = this.radius - 14;

            this.startAngle = 135;
            this.endAngle = 45;
            this.endAngle = geometry.fixEndAngle(this.startAngle, this.endAngle);

            this.availableAngle = this.endAngle - this.startAngle;
            this.totalpart = 30;

            this.partAngle = this.availableAngle / this.totalpart;

            tmp = geometry.distanceAngleToPoint(this.radius, this.startAngle);
            this.startPoint = geometry.pointPlus(this.cpoint, tmp);

            tmp = geometry.distanceAngleToPoint(this.radius, this.endAngle);
            this.endPoint = geometry.pointPlus(this.cpoint, tmp);

            tmp = geometry.distanceAngleToPoint(this.radius, this.endAngle - this.startAngle);
            this.topPoint = geometry.pointPlus(this.cpoint, tmp);
            //this.endPoint = { x: this.cx + tmp.x, y: this.cy + tmp.y };
            //this.endPoint = { x: this.cx + tmp.x, y: this.cy + tmp.y };

            //计算圆环坐标
            this.outpos = [this.startPoint.x, this.startPoint.y];
            for (var i = this.startAngle; i <= this.endAngle; i++) {
                tmp = geometry.distanceAngleToPoint(this.radius, i);
                tmppoint = geometry.pointPlus(this.cpoint, tmp);
                this.outpos.push(tmppoint.x, tmppoint.y);
            }
            for (var _i = this.endAngle; _i >= this.startAngle; _i--) {
                tmp = geometry.distanceAngleToPoint(this.sradius, _i);
                tmppoint = geometry.pointPlus(this.cpoint, tmp);
                this.outpos.push(tmppoint.x, tmppoint.y);
            }
            this.outpos.push(false);

            //计算圆环分隔线
            this.outline = [];
            for (var _i2 = 0; _i2 < this.totalpart; _i2++) {
                this.outline.push([_i2 * this.partAngle]);
            }

            console.log(this);
        }
    }, {
        key: 'init',
        value: function init() {
            if (!this.canvas) return;
            this.two = new _two2.default({
                type: _two2.default.Types.canvas,
                width: this.width,
                height: this.height,
                domElement: this.canvas
            });

            this.drawDemo();
            this.draw();
        }
    }, {
        key: 'draw',
        value: function draw() {

            console.log(this);
            this.debugPoint(this.startPoint.x, this.startPoint.y);
            this.debugPoint(this.endPoint.x, this.endPoint.y);
            this.debugPoint(this.topPoint.x, this.topPoint.y);

            var center = this.two.makeCircle(this.cx, this.cy, 25);
            center.fill = '#ff800000';
            center.stroke = '#596DA7';

            var textNum = this.two.makeText('64', this.cx - 3, this.cy, {
                fill: '#ffffff',
                size: 22
            });
            var textPercent = this.two.makeText('%', textNum._translation.x + textNum.size / 2 + 8, this.cy + 4, {
                fill: '#ffffff',
                size: 12
            });

            this.drawOut();

            this.two.update();
        }

        //画渐变

    }, {
        key: 'drawOut',
        value: function drawOut() {

            var linearGradient = this.two.makeLinearGradient(-this.width, this.height / 2, this.width, this.height / 2, new _two2.default.Stop(0, 'rgb(89,150,189)'), new _two2.default.Stop(.3, 'rgb(90,149,189)'), new _two2.default.Stop(.5, 'rgb(221,180,96)'), new _two2.default.Stop(.6, 'rgb(170,82,35)'), new _two2.default.Stop(.8, 'rgb(189,108,49)'), new _two2.default.Stop(1, 'rgb(216,154,76)'));

            var path = this.two.makePath.apply(this.two, this.outpos);
            path.stroke = '#00000000';
            path.fill = linearGradient;
        }
    }, {
        key: 'drawDemo',
        value: function drawDemo() {
            console.log('this.drawDemo', Date.now());
        }
    }, {
        key: 'debugPoint',
        value: function debugPoint(x, y) {
            var point = this.two.makeCircle(x, y, 5);
            point.fill = '#ffff00';
            point.stroke = '#ff0000';
        }
    }]);

    return Dount;
}();

exports.default = Dount;