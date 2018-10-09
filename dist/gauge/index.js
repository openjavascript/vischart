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

var _iconround = require('../icon/iconround.js');

var _iconround2 = _interopRequireDefault(_iconround);

var _roundstatetext = require('../icon/roundstatetext.js');

var _roundstatetext2 = _interopRequireDefault(_roundstatetext);

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

        _this.curRate = 0;
        _this.totalNum = 0;
        _this.totalNumStep = 5;

        _this.animationStep = 40 * 1;

        _this.roundRadiusPercent = .085;

        _this.lineColor = '#596ea7';

        _this.circleLinePercent = .26;
        _this.circlePercent = .28;

        _this.arcLinePercent = .39 / 2;

        _this.arcOutPercent = .38 / 2;
        _this.arcInPercent = .305 / 2;

        _this.arcLabelLength = 6;
        _this.arcTextLength = 20;

        _this.arcAngle = 280;
        _this.part = 22;
        _this.arcTotal = 1100;

        _this.textOffset = 0;

        _this.arcOffset = 90 + (360 - _this.arcAngle) / 2;
        _this.arcOffsetPad = -5;
        _this.partLabel = _this.part / 2;
        _this.partAngle = _this.arcAngle / _this.part;
        _this.partNum = _this.arcTotal / _this.part;

        _this.textOffsetX = -1;
        _this.textOffsetY = -8;
        _this.textLineLength = 6;

        _this.textRectWidthPercent = .5;
        _this.textRectHeightPercent = .11;

        _this.textRoundPercent = .39;
        _this.textRoundOffsetAngle = 160;
        _this.textRoundPlusAngle = 110;
        _this.textRoundMaxAngle = _this.textRoundOffsetAngle + _this.textRoundPlusAngle * 2;
        _this.roundStatusRaidus = 30;
        _this.textRoundAngle = [{
            angle: _this.textRoundOffsetAngle,
            text: '低',
            point: {},
            min: 0,
            max: 100,
            radius: _this.roundStatusRaidus,
            lineColor: _this.lineColor
        }, {
            angle: _this.textRoundOffsetAngle + _this.textRoundPlusAngle,
            text: '中',
            point: {},
            min: 101,
            max: 500,
            radius: _this.roundStatusRaidus,
            lineColor: _this.lineColor
        }, {
            angle: _this.textRoundOffsetAngle + _this.textRoundPlusAngle * 2,
            text: '高',
            point: {},
            min: 501,
            max: Math.pow(10, 10),
            radius: _this.roundStatusRaidus,
            lineColor: _this.lineColor
        }];

        _this.init();
        return _this;
    }

    _createClass(Gauge, [{
        key: 'getAttackRateAngle',
        value: function getAttackRateAngle() {
            var r = 0;

            r = this.arcOffset + this.arcAngle * this.getAttackRatePercent();

            return r;
        }
    }, {
        key: 'getAttackRatePercent',
        value: function getAttackRatePercent() {
            var r = 0,
                tmp = void 0;
            if (this.curRate) {
                tmp = this.curRate;
                if (tmp > this.arcTotal) {
                    tmp = this.arcTotal;
                }

                r = tmp / this.arcTotal;
            }
            return r;
        }
    }, {
        key: 'getAttackText',
        value: function getAttackText() {
            var _this2 = this;

            var text = '低';

            if (this.curRate) {
                this.textRoundAngle.map(function (val) {
                    if (_this2.curRate >= val.min && _this2.curRate <= val.max) {
                        text = val.text;
                    }
                });
            }

            return text + '\u9891\n\u653B\u51FB';
        }
    }, {
        key: 'init',
        value: function init() {
            var _this3 = this;

            this.textRoundRadius = this.width * this.textRoundPercent;

            this.roundRadius = this.width * this.roundRadiusPercent;

            this.arcInRadius = this.width * this.arcInPercent;
            this.arcOutRadius = this.width * this.arcOutPercent;

            this.arcLineRaidus = Math.ceil(this.arcLinePercent * this.max);

            this.textWidth = this.textRectWidthPercent * this.width;
            this.textHeight = this.textRectHeightPercent * this.width;
            this.textX = this.cx - this.textWidth / 2;
            this.textY = this.cy + this.arcLineRaidus + this.arcTextLength / 2 + 2;

            this.textRoundAngle.map(function (val, key) {
                var point = geometry.distanceAngleToPoint(_this3.textRoundRadius, val.angle);
                val.point = geometry.pointPlus(point, _this3.cpoint);
            });

            this.arcPartLineAr = [];
            this.arcOutlinePartAr = [];
            this.textAr = [];
            for (var i = 0; i <= this.part; i++) {
                var start = void 0,
                    end = void 0,
                    angle = void 0;
                angle = i * this.partAngle + this.arcOffset;

                if (i && i < this.part) {
                    start = geometry.distanceAngleToPoint(this.arcInRadius, angle);
                    end = geometry.distanceAngleToPoint(this.arcOutRadius, angle);

                    this.arcPartLineAr.push('M');
                    this.arcPartLineAr.push([start.x, start.y].join(','));
                    this.arcPartLineAr.push('L');
                    this.arcPartLineAr.push([end.x, end.y].join(','));
                }

                start = geometry.distanceAngleToPoint(this.arcLineRaidus, angle);
                end = geometry.distanceAngleToPoint(this.arcLineRaidus + this.arcLabelLength, angle);

                this.arcOutlinePartAr.push('M');
                this.arcOutlinePartAr.push([start.x, start.y].join(','));
                this.arcOutlinePartAr.push('L');
                this.arcOutlinePartAr.push([end.x, end.y].join(','));

                if (!(i * this.partNum % 100) || i === 0) {
                    var angleOffset = 8,
                        lengthOffset = 0;

                    if (i === 0) {
                        angleOffset = 1;
                    }

                    if (i >= 19) {
                        angleOffset = 14;
                    }
                    if (i >= 21) {
                        angleOffset = 18;
                    }
                    var text = {
                        text: i * this.partNum,
                        angle: angle - angleOffset,
                        point: geometry.distanceAngleToPoint(this.arcLineRaidus + this.arcTextLength + lengthOffset, angle - angleOffset)
                    };
                    text.textPoint = new _pointat2.default(this.width, this.height, geometry.pointPlus(text.point, this.cpoint));

                    this.textAr.push(text);
                }
            }
        }
    }, {
        key: 'initRoundText',
        value: function initRoundText() {
            var _this4 = this;

            this.textRoundAngle.map(function (val) {

                val.ins = new _roundstatetext2.default(_this4.box, _this4.width, _this4.height);
                val.ins.setOptions(Object.assign(val, {
                    stage: _this4.stage,
                    layer: _this4.layoutLayer
                }));
                val.ins.init();
                val.ins.update(_this4.curRate);
            });
        }
        /*
        {
        "series": [
            {
                "type": "gauge",
                "data": [
                    {
                        "value": 200,
                        "total": 134567,
                        "name": "完成率"
                    }
                ]
            }
        ]
        }
        */

    }, {
        key: 'update',
        value: function update(data, allData) {
            var _this5 = this;

            this.stage.removeChildren();

            //console.log( 123, data );

            if (data && data.data && data.data.length) {
                data.data.map(function (val) {
                    _this5.curRate = val.value;
                    _this5.totalNum = val.total;
                });
            }

            /*
            this.curRate = 600;
            this.totalNum = 234567;
            */

            this.initDataLayout();

            //console.log( 'gauge update', this.getAttackRateAngle() )
            this.angle = this.arcOffset + this.arcOffsetPad;
            this.animationAngle = this.getAttackRateAngle() + this.arcOffsetPad;
            //console.log( this.angle, this.animationAngle );

            if (this.curRate) {
                this.rateStep = Math.floor(this.curRate / this.animationStep);
                this.animation();
            }
            if (this.totalNum) {
                this.totalNumStep = Math.floor(this.totalNum / this.animationStep);
                this.totalNumCount = 0;
                this.animationText();
            }
        }
    }, {
        key: 'drawText',
        value: function drawText() {

            var params = {
                text: 0 + '',
                x: this.cx,
                y: this.textY,
                fontSize: 26,
                fontFamily: 'HuXiaoBoKuHei',
                fill: '#ffffff',
                fontStyle: 'italic'
            },
                tmp = _jsonUtilsx2.default.clone(params);
            tmp.text = this.totalNum;

            this.totalText = new _konva2.default.Text(params);
            this.totalText.x(this.cx - this.totalText.textWidth / 2);
            this.totalText.y(this.textY + 5);

            this.tmpTotalText = new _konva2.default.Text(tmp);
        }
    }, {
        key: 'drawTextRect',
        value: function drawTextRect() {

            var textWidth = this.tmpTotalText.textWidth + 30,
                textX = 0;
            if (textWidth < 170) {
                textWidth = 170;
            }
            textX = this.cx - textWidth / 2 + 2;

            this.textRect = new _konva2.default.Rect({
                fill: '#596ea7',
                stroke: '#ffffff00',
                strokeWidth: 0,
                opacity: .3,
                width: textWidth,
                height: this.textHeight,
                x: textX,
                y: this.textY
            });

            var points = [];
            points.push('M', [textX, this.textY + this.textLineLength].join(','));
            points.push('L', [textX, this.textY].join(','));
            points.push('L', [textX + this.textLineLength, this.textY].join(','));

            points.push('M', [textX + textWidth - this.textLineLength, this.textY].join(','));
            points.push('L', [textX + textWidth, this.textY].join(','));
            points.push('L', [textX + textWidth, this.textY + this.textLineLength].join(','));

            points.push('M', [textX + textWidth, this.textY + this.textHeight - this.textLineLength].join(','));
            points.push('L', [textX + textWidth, this.textY + this.textHeight].join(','));
            points.push('L', [textX + textWidth - this.textLineLength, this.textY + this.textHeight].join(','));

            points.push('M', [textX + this.textLineLength, this.textY + this.textHeight].join(','));
            points.push('L', [textX, this.textY + this.textHeight].join(','));
            points.push('L', [textX, this.textY + this.textHeight - this.textLineLength].join(','));

            this.textLinePath = new _konva2.default.Path({
                data: points.join(''),
                stroke: this.lineColor,
                strokeWidth: 1
            });

            this.layoutLayer.add(this.textLinePath);
            this.layoutLayer.add(this.textRect);
            this.layoutLayer.add(this.totalText);
        }
    }, {
        key: 'drawArcText',
        value: function drawArcText() {
            var _this6 = this;

            if (!(this.textAr && this.textAr.length)) return;

            this.textAr.map(function (val) {
                var text = new _konva2.default.Text({
                    x: val.point.x + _this6.cx,
                    y: val.point.y + _this6.cy,
                    text: val.text + '',
                    fontSize: 11
                    //, rotation: val.angle
                    , fontFamily: 'MicrosoftYaHei',
                    fill: _this6.lineColor
                });
                text.rotation(val.angle + 90);

                _this6.layoutLayer.add(text);
            });
        }
    }, {
        key: 'drawArcLine',
        value: function drawArcLine() {

            var points = [];
            points.push('M');
            for (var i = this.arcOffset; i <= this.arcOffset + this.arcAngle; i += 0.5) {
                var tmp = geometry.distanceAngleToPoint(this.arcLineRaidus, i);
                points.push([tmp.x, tmp.y].join(',') + ',');
                if (i == 90) {
                    points.push('L');
                }
            }

            this.arcLine = new _konva2.default.Path({
                data: points.join(''),
                x: this.cx,
                y: this.cy,
                stroke: this.lineColor,
                strokeWidth: 1,
                fill: '#ffffff00'
            });

            this.arcPartLine = new _konva2.default.Path({
                data: this.arcPartLineAr.join(''),
                x: this.cx,
                y: this.cy,
                stroke: '#00000088',
                strokeWidth: 1,
                fill: '#ffffff00'
            });

            this.arcOutlinePart = new _konva2.default.Path({
                data: this.arcOutlinePartAr.join(''),
                x: this.cx,
                y: this.cy,
                stroke: this.lineColor,
                strokeWidth: 1,
                fill: '#ffffff00'
            });

            this.layoutLayer.add(this.arcLine);
            this.layoutLayer.add(this.arcPartLine);
            this.layoutLayer.add(this.arcOutlinePart);
        }
    }, {
        key: 'drawArc',
        value: function drawArc() {

            var params = {
                x: this.cx,
                y: this.cy,
                innerRadius: this.arcInRadius,
                outerRadius: this.arcOutRadius,
                angle: this.arcAngle
                //, fill: 'red'
                , stroke: '#ffffff00',
                strokeWidth: 0,
                rotation: this.arcOffset,
                fillLinearGradientStartPoint: { x: -50, y: -50 },
                fillLinearGradientEndPoint: { x: 50, y: 50 },
                fillLinearGradientColorStops: [0, '#ff9000', .5, '#64b185', 1, '#5a78ca']
            };
            this.arc = new _konva2.default.Arc(params);

            this.layoutLayer.add(this.arc);
        }
    }, {
        key: 'initDataLayout',
        value: function initDataLayout() {
            this.layer = new _konva2.default.Layer();
            this.layoutLayer = new _konva2.default.Layer();

            this.roundLine = new _konva2.default.Circle({
                x: this.cx,
                y: this.cy,
                radius: this.roundRadius,
                stroke: this.lineColor,
                strokeWidth: 2.5,
                fill: 'rgba( 0, 0, 0, .5 )'
            });

            this.percentText = new _konva2.default.Text({
                x: this.cx,
                y: this.cy,
                text: this.getAttackText(),
                fontSize: 18,
                fontFamily: 'HuXiaoBoKuHei',
                fill: '#ffffff',
                fontStyle: 'italic'
            });
            this.percentText.x(this.cx - this.percentText.textWidth / 2 + this.textOffsetX);
            this.percentText.y(this.cy - this.percentText.textHeight / 2 + this.textOffsetY);

            /*
            this.percentSymbolText = new Konva.Text( {
                x: this.cx
                , y: this.cy
                , text: '%'
                , fontSize: 17
                , fontFamily: 'Agency FB'
                , fill: '#c7d6ff'
                , fontStyle: 'italic'
            });
            this.percentSymbolText.x( this.percentText.attrs.x  + this.percentText.textWidth );
            this.percentSymbolText.y( this.percentText.attrs.y  + this.percentText.textHeight -  this.percentSymbolText.textHeight - 2 );
            */

            //console.log( this.percentText );

            var wedge = new _konva2.default.Wedge({
                x: 0,
                y: -3,
                radius: 10,
                angle: 20,
                fill: '#ff5a00',
                stroke: '#ff5a00',
                strokeWidth: 1,
                rotation: 90
            });

            var wedge1 = new _konva2.default.Wedge({
                x: 0,
                y: -3,
                radius: 10,
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

            this.angle = this.arcOffset - 2;

            this.group = group;

            this.layer.add(group);
            this.layer.add(this.roundLine);
            this.layer.add(this.percentText);
            //this.layer.add( this.percentSymbolText );


            this.drawCircle();
            this.drawCircleLine();
            this.drawArc();
            this.drawArcLine();
            this.drawArcText();
            this.drawText();
            this.drawTextRect();

            this.initRoundText();

            this.stage.add(this.layer);
            this.stage.add(this.layoutLayer);
        }
    }, {
        key: 'animation',
        value: function animation() {
            var _this7 = this;

            if (this.angle > this.animationAngle) return;
            this.angle += this.rateStep;
            if (this.angle >= this.animationAngle) {
                this.angle = this.animationAngle;
            };

            var point = geometry.distanceAngleToPoint(this.roundRadius + 6, this.angle);
            this.group.x(this.cx + point.x);
            this.group.y(this.cy + point.y);
            this.group.rotation(this.angle + 90);
            this.group.rotation(this.angle + 90);

            this.stage.add(this.layer);

            window.requestAnimationFrame(function () {
                _this7.animation();
            });
        }
    }, {
        key: 'animationText',
        value: function animationText() {
            var _this8 = this;

            if (this.totalNumCount >= this.totalNum) return;
            this.totalNumCount += this.totalNumStep;
            if (this.totalNumCount >= this.totalNum) {
                this.totalNumCount = this.totalNum;
            };

            this.totalText.text(this.totalNumCount);
            this.totalText.x(this.cx - this.totalText.textWidth / 2);
            this.stage.add(this.layoutLayer);

            window.requestAnimationFrame(function () {
                _this8.animationText();
            });
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
                var tmp = geometry.distanceAngleToPoint(this.circleLineRadius, i + 90);
                points.push([tmp.x, tmp.y].join(',') + ',');
                if (i == 90) {
                    points.push('L');
                }
            }
            points.push('M');
            for (var _i = 270; _i <= 360; _i++) {
                var _tmp = geometry.distanceAngleToPoint(this.circleLineRadius, _i + 90);
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
                strokeWidth: 1.5,
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