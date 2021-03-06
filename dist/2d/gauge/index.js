'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _base = require('../common/base.js');

var _base2 = _interopRequireDefault(_base);

var _geometry = require('../../geometry/geometry.js');

var geometry = _interopRequireWildcard(_geometry);

var _pointat = require('../../common/pointat.js');

var _pointat2 = _interopRequireDefault(_pointat);

var _konva = require('konva');

var _konva2 = _interopRequireDefault(_konva);

var _jsonUtilsx = require('json-utilsx');

var _jsonUtilsx2 = _interopRequireDefault(_jsonUtilsx);

var _utils = require('../../common/utils.js');

var utils = _interopRequireWildcard(_utils);

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

        _this._setSize(width, height);
        return _this;
    }

    _createClass(Gauge, [{
        key: '_setSize',
        value: function _setSize(width, height) {
            _get(Gauge.prototype.__proto__ || Object.getPrototypeOf(Gauge.prototype), '_setSize', this).call(this, width, height);

            this.totalPostfix = '次/时';

            this.offsetCy = 15;

            this.cy += this.offsetCy;

            this.curRate = 0;
            this.totalNum = 0;
            this.totalNumStep = 5;

            this.animationStep = 40 * 1;

            this.roundRadiusPercent = .085;

            this.lineColor = '#596ea7';

            this.circleLinePercent = .26;
            this.circlePercent = .28;

            this.circleLineRotation = 0;
            this.circleLineRotationStep = 4;

            this.arcLinePercent = .39 / 2;

            this.arcOutPercent = .38 / 2;
            this.arcInPercent = .305 / 2;

            this.arcLabelLength = 6;
            this.arcTextLength = 20;

            this.arcAngle = 280;
            this.part = 22;
            this.arcTotal = 1100;

            this.textOffset = 0;

            this.arcOffset = 90 + (360 - this.arcAngle) / 2;
            this.arcOffsetPad = -5;
            this.partLabel = this.part / 2;
            this.partAngle = this.arcAngle / this.part;
            this.partNum = this.arcTotal / this.part;

            this.textOffsetX = -1;
            this.textOffsetY = -8;
            this.textLineLength = 6;

            this.textRectWidthPercent = .5;
            this.textRectHeightPercent = .11;

            this.textRoundPercent = .38;
            this.textRoundOffsetAngle = 160;
            this.textRoundPlusAngle = 110;
            this.textRoundMaxAngle = this.textRoundOffsetAngle + this.textRoundPlusAngle * 2;
            this.roundStatusRaidus = 30;
            this.textRoundAngle = [{
                angle: this.textRoundOffsetAngle,
                text: '低',
                point: {},
                min: 0,
                max: 100,
                radius: this.roundStatusRaidus,
                lineColor: this.lineColor
            }, {
                angle: this.textRoundOffsetAngle + this.textRoundPlusAngle,
                text: '中',
                point: {},
                min: 101,
                max: 500,
                radius: this.roundStatusRaidus,
                lineColor: this.lineColor
            }, {
                angle: this.textRoundOffsetAngle + this.textRoundPlusAngle * 2,
                text: '高',
                point: {},
                min: 501,
                max: Math.pow(10, 10),
                radius: this.roundStatusRaidus,
                lineColor: this.lineColor
            }];

            this.init();
        }
    }, {
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

            this.textRoundRadius = this.width * this.textRoundPercent * this.sizeRate;

            this.roundRadius = this.width * this.roundRadiusPercent * this.sizeRate;

            this.arcInRadius = this.width * this.arcInPercent * this.sizeRate;
            this.arcOutRadius = this.width * this.arcOutPercent * this.sizeRate;

            this.arcLineRaidus = Math.ceil(this.arcLinePercent * this.max) * this.sizeRate;

            this.textWidth = this.textRectWidthPercent * this.width;
            this.textHeight = 38 * this.sizeRate;
            this.textX = this.cx - this.textWidth / 2;
            this.textY = this.cy + this.arcLineRaidus + this.arcTextLength / 2 + 2;

            this.textRoundAngle.map(function (val, key) {
                var point = geometry.distanceAngleToPoint(_this3.textRoundRadius, val.angle);
                val.point = geometry.pointPlus(point, _this3.cpoint);
                val.point.y += _this3.offsetCy;
            });

            this.arcPartLineAr = [];
            this.arcOutlinePartAr = [];
            this.textAr = [];
            for (var i = 0; i <= this.part; i++) {
                var start = void 0,
                    end = void 0,
                    angle = void 0;
                angle = i * this.partAngle + this.arcOffset;

                //if( i && i < this.part ){
                if (true) {
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
                        lengthOffset = 0,
                        rotationOffset = 0;

                    if (i === 0) {
                        angleOffset = 1;
                    }

                    if (i >= 19) {
                        angleOffset = 14;
                        rotationOffset = 9;
                    }
                    if (i >= 21) {
                        angleOffset = 18;
                    }
                    var text = {
                        text: i * this.partNum,
                        angle: angle - angleOffset,
                        point: geometry.distanceAngleToPoint(this.arcLineRaidus + this.arcTextLength + lengthOffset, angle - angleOffset),
                        rotationOffset: rotationOffset
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

                if (!val.ins) {
                    val.ins = new _roundstatetext2.default(_this4.box, _this4.width, _this4.height);
                    val.ins.setOptions(Object.assign(val, {
                        stage: _this4.stage,
                        layer: _this4.layoutLayer,
                        data: _this4.data,
                        allData: _this4.allData
                    }));
                    val.ins.init();
                }
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
            _get(Gauge.prototype.__proto__ || Object.getPrototypeOf(Gauge.prototype), 'update', this).call(this, data, allData);

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

            this.updateWedge();

            if (this.curRate) {
                this.rateStep = Math.floor(this.curRate / (this.animationStep * 2));
                !this.inited && this.animation();
            }
            if (parseInt(this.totalNum)) {
                this.totalNumStep = Math.floor(this.totalNum / this.animationStep);
                this.totalNumStep < 1 && (this.totalNumStep = 1);
                this.totalNumCount = 0;
                this.animationText();
            } else {
                this.totalText.text(this.totalNum + '');
                this.totalTextPostfix.x(this.totalText.textWidth + 5);
                this.totalTextGroup.x((this.width - this.totalTextPostfix.textWidth - this.totalText.textWidth - 5) / 2);
            }

            !this.inited && this.animationCircleLine();

            this.inited = 1;
        }
    }, {
        key: 'animationCircleLine',
        value: function animationCircleLine() {
            var _this6 = this;

            //console.log( 'animationCircleLine' );
            if (this.isDestroy) return;
            if (!this.circleLine) return;

            if (!this.isAnimation()) {
                return;
            }

            this.circleLineRotation += this.circleLineRotationStep;

            this.circleLine.rotation(this.circleLineRotation);
            this.stage.add(this.layoutLayer);

            window.requestAnimationFrame(function () {
                _this6.animationCircleLine();
            });
        }
    }, {
        key: 'animationText',
        value: function animationText() {
            var _this7 = this;

            if (this.isDestroy) return;

            if (this.totalNumCount >= this.totalNum) {
                return;
            }
            this.totalNumCount += this.totalNumStep;

            if (this.totalNumCount >= this.totalNum || !this.isAnimation()) {
                this.totalNumCount = this.totalNum;
            };

            this.totalText.text(this.totalNumCount);
            this.totalTextPostfix.x(this.totalText.textWidth + 5);

            this.totalTextGroup.x((this.width - this.totalTextPostfix.textWidth - this.totalText.textWidth - 5) / 2);

            this.layoutLayer.add(this.totalTextGroup);

            window.requestAnimationFrame(function () {
                _this7.animationText();
            });
        }
    }, {
        key: 'drawText',
        value: function drawText() {

            this.totalTextGroup = new _konva2.default.Group();
            this.addDestroy(this.totalTextGroup);

            var params = {
                text: 0 + ''
                /*
                , x: this.cx
                , y: this.textY
                */
                , fontSize: 30 * this.sizeRate,
                fontFamily: 'Agency FB',
                fill: '#ffffff',
                fontStyle: 'italic',
                letterSpacing: 1.5
            },
                tmp = _jsonUtilsx2.default.clone(params);
            tmp.text = this.totalNum;

            this.totalText = new _konva2.default.Text(params);
            this.addDestroy(this.totalText);

            var params1 = {
                text: this.totalPostfix,
                x: this.totalText.textWidth + 5,
                fontSize: 12 * this.sizeRate,
                fontFamily: 'MicrosoftYaHei',
                fill: '#ffffff',
                fontStyle: 'italic',
                letterSpacing: 1.5
            };

            this.totalTextPostfix = new _konva2.default.Text(params1);
            this.totalTextPostfix.y(this.totalText.textHeight - this.totalTextPostfix.textHeight - 4);
            this.addDestroy(this.totalTextPostfix);

            this.totalTextGroup.add(this.totalText);
            this.totalTextGroup.add(this.totalTextPostfix);

            //console.log( this.totalTextGroup, this.totalTextGroup.getClipWidth(), this.totalTextGroup.width(), this.totalTextGroup.size()  );

            //this.totalTextGroup.x( this.cx - this.totalTextGroup.width / 2 );
            this.totalTextGroup.y(this.textY);
            this.totalTextGroup.x((this.width - this.totalTextPostfix.textWidth - this.totalText.textWidth - 5) / 2);

            this.tmpTotalText = new _konva2.default.Text(tmp);
            this.addDestroy(this.tmpTotalText);
        }
    }, {
        key: 'drawTextRect',
        value: function drawTextRect() {

            var textWidth = this.tmpTotalText.textWidth + 30 + this.totalTextPostfix.textWidth + 5,
                textX = 0,
                textY = 0;

            if (textWidth < 170) {
                textWidth = 170;
            }
            textX = this.cx - textWidth / 2 + 2;;

            textY = this.textY - (this.textHeight - this.totalText.textHeight) / 2;

            this.textRect = new _konva2.default.Rect({
                fill: '#596ea7',
                stroke: '#ffffff00',
                strokeWidth: 0,
                opacity: .3,
                width: textWidth,
                height: this.textHeight,
                x: textX,
                y: textY
            });
            this.addDestroy(this.textRect);

            var points = [];
            points.push('M', [textX, textY + this.textLineLength].join(','));
            points.push('L', [textX, textY].join(','));
            points.push('L', [textX + this.textLineLength, textY].join(','));

            points.push('M', [textX + textWidth - this.textLineLength, textY].join(','));
            points.push('L', [textX + textWidth, textY].join(','));
            points.push('L', [textX + textWidth, textY + this.textLineLength].join(','));

            points.push('M', [textX + textWidth, textY + this.textHeight - this.textLineLength].join(','));
            points.push('L', [textX + textWidth, textY + this.textHeight].join(','));
            points.push('L', [textX + textWidth - this.textLineLength, textY + this.textHeight].join(','));

            points.push('M', [textX + this.textLineLength, textY + this.textHeight].join(','));
            points.push('L', [textX, textY + this.textHeight].join(','));
            points.push('L', [textX, textY + this.textHeight - this.textLineLength].join(','));

            this.textLinePath = new _konva2.default.Path({
                data: points.join(''),
                stroke: this.lineColor,
                strokeWidth: 1
            });
            this.addDestroy(this.textLinePath);

            this.layoutLayer.add(this.textLinePath);
            this.layoutLayer.add(this.textRect);
            //this.layoutLayer.add( this.totalText );
            this.layoutLayer.add(this.totalTextGroup);
        }
    }, {
        key: 'drawArcText',
        value: function drawArcText() {
            var _this8 = this;

            if (!(this.textAr && this.textAr.length)) return;

            this.textAr.map(function (val) {
                var text = new _konva2.default.Text({
                    x: val.point.x + _this8.cx,
                    y: val.point.y + _this8.cy,
                    text: val.text + '',
                    fontSize: 11 * _this8.sizeRate
                    //, rotation: val.angle
                    , fontFamily: 'MicrosoftYaHei',
                    fill: _this8.lineColor
                });
                _this8.addDestroy(text);

                text.rotation(val.angle + 90 + (val.rotationOffset || 0));

                _this8.layoutLayer.add(text);
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
            this.addDestroy(this.arcLine);

            this.arcPartLine = new _konva2.default.Path({
                data: this.arcPartLineAr.join(''),
                x: this.cx,
                y: this.cy,
                stroke: '#00000088'
                //, stroke: this.lineColor
                , strokeWidth: 1,
                fill: '#ffffff00'
            });
            this.addDestroy(this.arcPartLine);

            this.arcOutlinePart = new _konva2.default.Path({
                data: this.arcOutlinePartAr.join(''),
                x: this.cx,
                y: this.cy,
                stroke: this.lineColor,
                strokeWidth: 1,
                fill: '#ffffff00'
            });
            this.addDestroy(this.arcOutlinePart);

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
            this.addDestroy(this.arc);

            this.layoutLayer.add(this.arc);
        }
    }, {
        key: 'initDataLayout',
        value: function initDataLayout() {

            if (!this.inited) {
                this.layer = new _konva2.default.Layer();
                this.addDestroy(this.layer);

                this.layoutLayer = new _konva2.default.Layer();
                this.addDestroy(this.layoutLayer);

                this.roundLine = new _konva2.default.Circle({
                    x: this.cx,
                    y: this.cy,
                    radius: this.roundRadius,
                    stroke: this.lineColor,
                    strokeWidth: 2.5,
                    fill: 'rgba( 0, 0, 0, .5 )'
                });
                this.addDestroy(this.roundLine);
            }

            if (!this.inited) {
                this.percentText = new _konva2.default.Text({
                    x: this.cx,
                    y: this.cy,
                    text: this.getAttackText(),
                    fontSize: 18 * this.sizeRate,
                    fontFamily: 'HuXiaoBoKuHei',
                    fill: '#ffffff',
                    fontStyle: 'italic'
                });
                this.addDestroy(this.percentText);
            }
            this.percentText.text(this.getAttackText());
            this.percentText.x(this.cx - this.percentText.textWidth / 2 + this.textOffsetX);
            this.percentText.y(this.cy - this.percentText.textHeight / 2 + this.textOffsetY);

            if (!this.inited) {
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
                this.addDestroy(wedge);

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
                this.addDestroy(wedge1);

                var group = new _konva2.default.Group({
                    x: this.cx,
                    y: this.cy
                });
                this.addDestroy(group);

                group.add(wedge1);
                group.add(wedge);

                this.group = group;
            }

            this.initRoundText();

            if (!this.inited) {
                this.angle = this.arcOffset - 2;

                this.layer.add(this.group);
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
            }

            this.stage.add(this.layer);
            this.stage.add(this.layoutLayer);
        }
    }, {
        key: 'animation',
        value: function animation() {
            var _this9 = this;

            //console.log( this.angle, this.animationAngle );
            if (this.isDestroy) return;
            if (this.angle > this.animationAngle) return;

            this.angle += this.rateStep;

            if (this.angle >= this.animationAngle || !this.isAnimation()) {
                this.angle = this.animationAngle;
            };

            this.updateWedge();

            this.stage.add(this.layer);

            window.requestAnimationFrame(function () {
                _this9.animation();
            });
        }
    }, {
        key: 'updateWedge',
        value: function updateWedge() {
            var point = geometry.distanceAngleToPoint(this.roundRadius + 6, this.angle);
            this.group.x(this.cx + point.x);
            this.group.y(this.cy + point.y);
            this.group.rotation(this.angle + 90);
            this.group.rotation(this.angle + 90);
            this.stage.add(this.layer);
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
            this.circleRadius = Math.ceil(this.circlePercent * this.max / 2) * this.sizeRate;

            this.circle = new _konva2.default.Circle({
                x: this.cx,
                y: this.cy,
                radius: this.circleRadius,
                stroke: this.lineColor,
                strokeWidth: 1,
                fill: '#ffffff00'
            });
            this.addDestroy(this.circle);
            this.layoutLayer.add(this.circle);
        }
    }, {
        key: 'drawCircleLine',
        value: function drawCircleLine() {
            this.circleLineRadius = Math.ceil(this.circleLinePercent * this.max / 2) * this.sizeRate;

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
            this.addDestroy(this.circleLine);

            this.layoutLayer.add(this.circleLine);
        }
    }, {
        key: 'reset',
        value: function reset() {}
    }, {
        key: 'destroy',
        value: function destroy() {
            _get(Gauge.prototype.__proto__ || Object.getPrototypeOf(Gauge.prototype), 'destroy', this).call(this);
            this.textRoundAngle.map(function (val) {
                if (val.ins) val.ins.destroy();
            });
        }
    }]);

    return Gauge;
}(_base2.default);

exports.default = Gauge;