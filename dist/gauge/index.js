'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _vischartbase = require('../common/vischartbase.js');

var _vischartbase2 = _interopRequireDefault(_vischartbase);

var _geometry = require('../geometry/geometry.js');

var geometry = _interopRequireWildcard(_geometry);

var _pointat = require('../common/pointat.js');

var _pointat2 = _interopRequireDefault(_pointat);

var _konva = require('konva');

var _konva2 = _interopRequireDefault(_konva);

var _jsonUtilsx = require('json-utilsx');

var _jsonUtilsx2 = _interopRequireDefault(_jsonUtilsx);

var _utils = require('../common/utils.js');

var utils = _interopRequireWildcard(_utils);

var _round = require('../icon/round.js');

var _round2 = _interopRequireDefault(_round);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Gauge = function (_VisChartBase) {
    _inherits(Gauge, _VisChartBase);

    function Gauge(box, width, height) {
        _classCallCheck(this, Gauge);

        var _this = _possibleConstructorReturn(this, (Gauge.__proto__ || Object.getPrototypeOf(Gauge)).call(this, box, width, height));

        _this.name = 'Gauge' + Date.now();

        _this.roundRadiusPercent = .1;

        _this.lineColor = '#596ea7';

        _this.circleLinePercent = .31;
        _this.circlePercent = .34;

        _this.arcInPercent = .365 / 2;
        _this.arcOutPercent = .44 / 2;

        _this.arcAngle = 300;
        _this.arcOffset = 90 + (360 - _this.arcAngle) / 2;

        _this.part = 22;
        _this.partLabel = _this.part / 2;

        _this.init();
        return _this;
    }

    _createClass(Gauge, [{
        key: 'init',
        value: function init() {
            this.roundRadius = this.width * this.roundRadiusPercent;

            this.arcInRadius = this.width * this.arcInPercent;
            this.arcOutRadius = this.width * this.arcOutPercent;
        }
    }, {
        key: 'update',
        value: function update(data, allData) {
            this.stage.removeChildren();

            this.initDataLayout();
        }
    }, {
        key: 'drawArc',
        value: function drawArc() {
            var params = {
                x: this.cx,
                y: this.cy,
                innerRadius: this.arcInRadius,
                outerRadius: this.arcOutRadius,
                angle: this.arcAngle,
                fill: '#ffffff',
                stroke: '#ffffff00',
                strokeWidth: 0,
                rotation: this.arcOffset
            };
            console.log(params);
            this.arc = new _konva2.default.Arc(params);

            this.layoutLayer.add(this.arc);
        }
    }, {
        key: 'initDataLayout',
        value: function initDataLayout() {
            var _this2 = this;

            this.layer = new _konva2.default.Layer();
            this.layoutLayer = new _konva2.default.Layer();

            this.roundLine = new _konva2.default.Circle({
                x: this.cx,
                y: this.cy,
                radius: this.roundRadius,
                stroke: this.lineColor,
                strokeWidth: 3,
                fill: 'rgba( 0, 0, 0, .5 )'
            });

            this.percentText = new _konva2.default.Text({
                x: this.cx,
                y: this.cy,
                text: '65',
                fontSize: 33,
                fontFamily: 'Agency FB',
                fill: '#c7d6ff',
                fontStyle: 'italic'
            });
            this.percentText.x(this.cx - this.percentText.textWidth / 2 - 6);
            this.percentText.y(this.cy - this.percentText.textHeight / 2);

            this.percentSymbolText = new _konva2.default.Text({
                x: this.cx,
                y: this.cy,
                text: '%',
                fontSize: 18,
                fontFamily: 'Agency FB',
                fill: '#c7d6ff',
                fontStyle: 'italic'
            });
            this.percentSymbolText.x(this.percentText.attrs.x + this.percentText.textWidth);
            this.percentSymbolText.y(this.percentText.attrs.y + this.percentText.textHeight - this.percentSymbolText.textHeight - 2);

            console.log(this.percentText);

            var wedge = new _konva2.default.Wedge({
                x: 0,
                y: -6,
                radius: 12,
                angle: 20,
                fill: '#ff5a00',
                stroke: '#ff5a00',
                strokeWidth: 1,
                rotation: 90
            });

            var wedge1 = new _konva2.default.Wedge({
                x: 0,
                y: -6,
                radius: 12,
                angle: 20,
                fill: '#973500',
                stroke: '#973500',
                strokeWidth: 1,
                rotation: 65
            });

            var group = new _konva2.default.Group({
                x: this.cx,
                y: this.cy
            });

            group.add(wedge1);
            group.add(wedge);

            this.angle = -90;

            this.group = group;

            this.layer.add(group);
            this.layer.add(this.roundLine);
            this.layer.add(this.percentText);
            this.layer.add(this.percentSymbolText);

            this.drawCircle();
            this.drawCircleLine();
            this.drawArc();

            this.stage.add(this.layer);
            this.stage.add(this.layoutLayer);

            window.requestAnimationFrame(function () {
                _this2.animation();
            });
        }
    }, {
        key: 'animation',
        value: function animation() {
            this.angle++;

            var point = geometry.distanceAngleToPoint(this.roundRadius + 6, this.angle);
            this.group.x(this.cx + point.x);
            this.group.y(this.cy + point.y);
            this.group.rotation(this.angle + 90);
            this.group.rotation(this.angle + 90);

            this.stage.add(this.layer);

            //window.requestAnimationFrame( ()=>{ this.animation() } );
        }
    }, {
        key: 'calcDataPosition',
        value: function calcDataPosition() {}
    }, {
        key: 'animationLine',
        value: function animationLine() {}
    }, {
        key: 'addIcon',
        value: function addIcon(path, layer) {}
    }, {
        key: 'addText',
        value: function addText(path, layer) {}
    }, {
        key: 'calcLayoutPosition',
        value: function calcLayoutPosition() {}
    }, {
        key: 'drawCircle',
        value: function drawCircle() {
            this.circleRadius = Math.ceil(this.circlePercent * this.max / 2);

            this.circle = new _konva2.default.Circle({
                x: this.cx,
                y: this.cy,
                radius: this.circleRadius,
                stroke: this.lineColor,
                strokeWidth: 1,
                fill: '#ffffff00'
            });
            this.layoutLayer.add(this.circle);
        }
    }, {
        key: 'drawCircleLine',
        value: function drawCircleLine() {
            this.circleLineRadius = Math.ceil(this.circleLinePercent * this.max / 2);

            var points = [];
            points.push('M');
            for (var i = 90; i <= 180; i++) {
                var tmp = geometry.distanceAngleToPoint(this.circleLineRadius, i);
                points.push([tmp.x, tmp.y].join(',') + ',');
                if (i == 90) {
                    points.push('L');
                }
            }
            points.push('M');
            for (var _i = 270; _i <= 360; _i++) {
                var _tmp = geometry.distanceAngleToPoint(this.circleLineRadius, _i);
                points.push([_tmp.x, _tmp.y].join(',') + ',');
                if (_i == 270) {
                    points.push('L');
                }
            }

            this.circleLine = new _konva2.default.Path({
                data: points.join(''),
                x: this.cx,
                y: this.cy,
                stroke: this.lineColor,
                strokeWidth: 2,
                fill: '#ffffff00'
            });

            this.layoutLayer.add(this.circleLine);
        }
    }, {
        key: 'reset',
        value: function reset() {}
    }]);

    return Gauge;
}(_vischartbase2.default);

exports.default = Gauge;