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

var _pointat = require('../common/pointat.js');

var _pointat2 = _interopRequireDefault(_pointat);

var _konva = require('konva');

var _konva2 = _interopRequireDefault(_konva);

var _jsonUtilsx = require('json-utilsx');

var _jsonUtilsx2 = _interopRequireDefault(_jsonUtilsx);

var _utils = require('../common/utils.js');

var utils = _interopRequireWildcard(_utils);

var _iconcircle = require('../icon/iconcircle.js');

var _iconcircle2 = _interopRequireDefault(_iconcircle);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Dount = function (_VisChartBase) {
    _inherits(Dount, _VisChartBase);

    function Dount(box, width, height) {
        _classCallCheck(this, Dount);

        var _this = _possibleConstructorReturn(this, (Dount.__proto__ || Object.getPrototypeOf(Dount)).call(this, box, width, height));

        _this.name = 'Dount ' + Date.now();

        _this.outPercent = .53;
        _this.inPercent = .37;

        _this.circleLinePercent = .34;
        _this.circlePercent = .31;
        _this.circleLineRotation = 0;
        _this.circleLineRotationStep = 4;

        _this.animationStep = 8;
        _this.angleStep = 5;

        _this.textHeight = 26;
        _this.lineOffset = 50;

        _this.path = [];

        _this.textOffset = 4;

        _this.lineColor = '#24a3ea';

        _this.lineRange = {
            "1": [],
            "2": [],
            "4": [],
            "8": []
        };

        _this.lineWidth = 40;
        _this.lineSpace = 10;
        _this.lineAngle = 35;
        _this.lineHeight = 21;
        _this.lineCurveLength = 30;

        _this.loopSort = [4, 8, 1, 2];

        _this.init();
        return _this;
    }

    _createClass(Dount, [{
        key: 'init',
        value: function init() {
            this.calcLayoutPosition();

            return this;
        }
    }, {
        key: 'update',
        value: function update(data, allData) {
            _get(Dount.prototype.__proto__ || Object.getPrototypeOf(Dount.prototype), 'update', this).call(this, data, allData);

            this.data = data;
            this.allData = allData;

            if (!_jsonUtilsx2.default.jsonInData(this.data, 'data')) return;

            this.calcDataPosition();
            this.initDataLayout();

            //console.log( 'dount update', this.data, this, utils );

            this.animation();
            this.animationCircleLine();

            return this;
        }
    }, {
        key: 'reset',
        value: function reset() {
            this.path.map(function (val) {
                val.pathData = [];
            });
        }
    }, {
        key: 'animationCircleLine',
        value: function animationCircleLine() {
            var _this2 = this;

            if (this.isDestroy) return;
            if (!this.circleLine) return;

            this.circleLineRotation += this.circleLineRotationStep;

            this.circleLine.rotation(this.circleLineRotation);
            this.stage.add(this.layoutLayer);

            window.requestAnimationFrame(function () {
                _this2.animationCircleLine();
            });
        }
    }, {
        key: 'animation',
        value: function animation() {
            var _this3 = this;

            if (this.isDestroy) return;

            if (this.isDone) return;
            //this.countAngle = this.totalAngle;

            var tmp = void 0,
                tmppoint = void 0,
                step = this.angleStep;

            this.countAngle += this.animationStep;
            //this.countAngle += 350;

            if (this.countAngle >= this.totalAngle) {
                this.countAngle = this.totalAngle;
                this.isDone = 1;
            }

            this.reset();

            for (var i = this.path.length - 1; i >= 0; i--) {
                //for( let i = 0; i < this.path.length; i++ ){
                //let i = 2;
                var item = this.path[i];

                //console.log( i, item );

                var tmpAngle = this.countAngle;

                if (tmpAngle >= item.itemData.endAngle) {
                    tmpAngle = item.itemData.endAngle;
                }

                if (tmpAngle < item.itemData.startAngle) continue;

                item.pathData.push('M');
                for (var _i = item.itemData.startAngle;; _i += step) {
                    if (_i >= tmpAngle) _i = tmpAngle;

                    tmppoint = tmp = geometry.distanceAngleToPoint(this.outRadius, _i);
                    item.pathData.push([tmppoint.x, tmppoint.y].join(',') + ',');
                    if (_i == item.itemData.startAngle) item.pathData.push('L');

                    if (_i >= tmpAngle) break;
                }
                for (var _i2 = tmpAngle;; _i2 -= step) {
                    if (_i2 <= item.itemData.startAngle) _i2 = item.itemData.startAngle;

                    tmppoint = tmp = geometry.distanceAngleToPoint(this.inRadius, _i2);
                    item.pathData.push([tmppoint.x, tmppoint.y].join(',') + ',');
                    if (_i2 == item.itemData.startAngle) break;
                }

                item.pathData.push('z');

                item.path.setData(item.pathData.join(''));
            }
            this.layer.map(function (val, key) {
                _this3.stage.add(val);
                val.setZIndex(_this3.layer.length - key);
            });

            window.requestAnimationFrame(function () {
                _this3.animation();
            });

            if (this.isDone) {
                window.requestAnimationFrame(function () {
                    _this3.animationLine();
                });
            }
        }
    }, {
        key: 'drawCircle',
        value: function drawCircle() {
            this.circleRadius = Math.ceil(this.circlePercent * this.min / 2);

            this.circle = new _konva2.default.Circle({
                x: this.fixCx(),
                y: this.fixCy(),
                radius: this.circleRadius,
                stroke: this.lineColor,
                strokeWidth: 2.5,
                fill: '#ffffff00'
            });
            this.layoutLayer.add(this.circle);
        }
    }, {
        key: 'drawCircleLine',
        value: function drawCircleLine() {
            this.circleLineRadius = Math.ceil(this.circleLinePercent * this.min / 2);

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
            for (var _i3 = 270; _i3 <= 360; _i3++) {
                var _tmp = geometry.distanceAngleToPoint(this.circleLineRadius, _i3);
                points.push([_tmp.x, _tmp.y].join(',') + ',');
                if (_i3 == 270) {
                    points.push('L');
                }
            }

            this.circleLine = new _konva2.default.Path({
                data: points.join(''),
                x: this.fixCx(),
                y: this.fixCy(),
                stroke: this.lineColor,
                strokeWidth: 2.5,
                fill: '#ffffff00'
            });

            this.layoutLayer.add(this.circleLine);
        }
    }, {
        key: 'initDataLayout',
        value: function initDataLayout() {
            var _this4 = this;

            this.layer = [];
            this.path = [];
            this.line = [];

            this.layoutLayer = new _konva2.default.Layer();

            this.drawCircle();
            this.drawCircleLine();

            this.stage.add(this.layoutLayer);

            this.data.data.map(function (val, key) {
                var color = _this4.colors[key % _this4.colors.length];

                if (_jsonUtilsx2.default.jsonInData(val, 'itemStyle.color')) {
                    //path.fill( val.itemStyle.color );
                    color = val.itemStyle.color;
                }

                var path = new _konva2.default.Path({
                    x: _this4.fixCx(),
                    y: _this4.fixCy(),
                    strokeWidth: 1,
                    stroke: color,
                    data: '',
                    fill: color
                });

                /*
                console.log( 
                    key % this.colors.length
                    , this.colors[ key % this.colors.length] 
                );
                */

                var tmp = {
                    path: path,
                    pathData: [],
                    itemData: val
                };

                _this4.path.push(tmp);

                var line = new _konva2.default.Line({
                    x: _this4.fixCx(),
                    y: _this4.fixCy(),
                    points: [0, 0, 0, 0],
                    stroke: '#ffffff',
                    strokeWidth: 2
                });
                _this4.line.push(line);

                var layer = new _konva2.default.Layer();
                layer.add(path);
                layer.add(line);

                _this4.layer.push(layer);
            });
            this.layer.map(function (val, key) {
                _this4.stage.add(val);
            });

            /*
            window.requestAnimationFrame( ()=>{ this.tmpfunc() } );
            */

            return this;
        }
    }, {
        key: 'calcDataPosition',
        value: function calcDataPosition() {
            var _this5 = this;

            if (!this.data) return;

            var total = 0,
                tmp = 0;

            this.data.data.map(function (val) {
                total += val.value;
            });
            this.total = total;

            this.data.data.map(function (val) {
                val._percent = utils.parseFinance(val.value / total);
                tmp = utils.parseFinance(tmp + val._percent);
                val._totalPercent = tmp;

                val.percent = parseInt(val._percent * 100);

                val.endAngle = _this5.totalAngle * val._totalPercent;
            });

            //修正浮点数精确度
            if (this.data.data.length) {
                var item = this.data.data[this.data.data.length - 1];
                tmp = tmp - item._percent;

                item._percent = 1 - tmp;
                item.percent = parseInt(item._percent * 100);
                item._totalPercent = 1;
                item.endAngle = this.totalAngle;
            }

            this.lineRange = {
                "1": [],
                "2": [],
                "4": [],
                "8": []
                //计算开始角度, 计算指示线的2端
            };this.data.data.map(function (val, key) {
                if (!key) {
                    val.startAngle = 0;
                } else {
                    val.startAngle = _this5.data.data[key - 1].endAngle;
                }

                val.midAngle = val.startAngle + (val.endAngle - val.startAngle) / 2;

                val.lineStart = geometry.distanceAngleToPoint(_this5.outRadius, val.midAngle);
                val.lineEnd = geometry.distanceAngleToPoint(_this5.outRadius + _this5.lineLength, val.midAngle);

                val.textPoint = geometry.distanceAngleToPoint(_this5.outRadius + _this5.lineLength, val.midAngle);

                val.pointDirection = new _pointat2.default(_this5.fixWidth(), _this5.fixHeight(), geometry.pointPlus(val.textPoint, _this5.cpoint));
                var lineAngle = val.pointDirection.autoAngle();
                val.lineExpend = _jsonUtilsx2.default.clone(val.lineEnd);

                switch (lineAngle) {
                    case 1:
                    case 8:
                        {
                            //val.lineEnd.x = this.lineLeft;
                            val.lineEnd.x = -(_this5.outRadius + _this5.lineSpace);

                            var _tmp2 = geometry.pointDistance(val.lineStart, val.lineEnd);
                            if (_tmp2 > _this5.lineCurveLength) {
                                var tmpAngle = geometry.pointAngle(val.lineStart, val.lineEnd),
                                    tmpPoint = geometry.distanceAngleToPoint(_this5.lineCurveLength, tmpAngle);
                                tmpPoint = geometry.pointPlus(tmpPoint, val.lineStart);

                                val.lineEnd.x = tmpPoint.x;
                            }

                            val.lineExpend.x = val.lineEnd.x - _this5.lineWidth;

                            break;
                        }
                    default:
                        {
                            val.lineEnd.x = _this5.outRadius + _this5.lineSpace;
                            var _tmp3 = geometry.pointDistance(val.lineStart, val.lineEnd);
                            if (_tmp3 > _this5.lineCurveLength) {
                                var _tmpAngle = geometry.pointAngle(val.lineStart, val.lineEnd),
                                    _tmpPoint = geometry.distanceAngleToPoint(_this5.lineCurveLength, _tmpAngle);
                                _tmpPoint = geometry.pointPlus(_tmpPoint, val.lineStart);

                                val.lineEnd.x = _tmpPoint.x;
                            }

                            val.lineExpend.x = val.lineEnd.x + _this5.lineWidth;
                            break;
                        }
                }

                _this5.lineRange[lineAngle].push(val);
            });

            this.loopSort.map(function (key) {
                var item = _this5.lineRange[key];
                if (!(item && item.length && item.length > 1)) return;
                var needFix = void 0;
                for (var i = 1; i < item.length; i++) {
                    var pre = item[i - 1],
                        cur = item[i];
                    if (Math.abs(cur.lineEnd.y - pre.lineEnd.y) < _this5.lineHeight) {
                        needFix = 1;
                        break;
                    }
                }
                switch (key) {
                    case 1:
                        {
                            var tmpY = item[0].lineEnd.y;
                            //console.log( item );
                            for (var _i4 = item.length - 2; _i4 >= 0; _i4--) {
                                var _pre = item[_i4 + 1],
                                    _cur = item[_i4];
                                if (Math.abs(_pre.lineEnd.y - _cur.lineEnd.y) < _this5.lineHeight || _cur.lineEnd.y <= _pre.lineEnd.y) {
                                    tmpY = _pre.lineEnd.y + _this5.lineHeight;
                                    _cur.lineEnd.y = tmpY;

                                    /*
                                    if( cur.lineEnd.y < cur.lineStart.y ){
                                        //tmpY = cur.lineStart.y + this.lineHeight;
                                        //cur.lineEnd.y = tmpY;
                                    }
                                    */
                                    _cur.lineExpend.y = tmpY;
                                }
                            }
                            break;
                        }
                    case 2:
                        {
                            var _tmpY = item[0].lineEnd.y;
                            for (var _i5 = 1; _i5 < item.length; _i5++) {
                                var _pre2 = item[_i5 - 1],
                                    _cur2 = item[_i5],
                                    zero = item[0];

                                if (Math.abs(_pre2.lineEnd.y + _this5.fixCy()) < _this5.lineHeight) {
                                    _pre2.lineExpend.y = _pre2.lineEnd.y = _pre2.lineExpend.y + _this5.lineHeight;
                                }
                                if (Math.abs(_pre2.lineEnd.y - _cur2.lineEnd.y) < _this5.lineHeight || _cur2.lineEnd.y <= _pre2.lineEnd.y) {

                                    _tmpY = _pre2.lineEnd.y + _this5.lineHeight;
                                    _cur2.lineEnd.y = _tmpY;

                                    /*
                                    if( cur.lineEnd.y < cur.lineStart.y ){
                                        //tmpY = cur.lineStart.y + this.lineHeight;
                                        //cur.lineEnd.y = tmpY;
                                    }
                                    */
                                    _cur2.lineExpend.y = _tmpY;
                                }
                            }

                            break;
                        }
                    case 4:
                        {
                            var _tmpY2 = 0;
                            for (var _i6 = item.length - 2; _i6 >= 0; _i6--) {
                                var _pre3 = item[_i6 + 1],
                                    _cur3 = item[_i6];
                                if (Math.abs(_pre3.lineEnd.y - _cur3.lineEnd.y) < _this5.lineHeight || _cur3.lineEnd.y <= _pre3.lineEnd.y) {
                                    //console.log( pre.lineEnd.y, cur.lineEnd.y );
                                    _tmpY2 = _pre3.lineEnd.y - _this5.lineHeight;
                                    _cur3.lineEnd.y = _tmpY2;

                                    /*
                                    if( cur.lineEnd.y < cur.lineStart.y ){
                                    }
                                    */
                                    _cur3.lineExpend.y = _tmpY2;
                                }
                            }
                            break;
                        }
                    case 8:
                        {
                            var _tmpY3 = 0;
                            for (var _i7 = 1; _i7 < item.length; _i7++) {
                                var _pre4 = item[_i7 - 1],
                                    _cur4 = item[_i7];
                                if (Math.abs(_pre4.lineEnd.y - _cur4.lineEnd.y) < _this5.lineHeight || _cur4.lineEnd.y <= _pre4.lineEnd.y) {
                                    _tmpY3 = _pre4.lineEnd.y - _this5.lineHeight;
                                    _cur4.lineEnd.y = _tmpY3;

                                    /*
                                    if( cur.lineEnd.y < cur.lineStart.y ){
                                        //cur.lineEnd.y = cur.lineStart.y + this.lineHeight;
                                    }
                                    */
                                    _cur4.lineExpend.y = _cur4.lineEnd.y;
                                }
                            }

                            break;
                        }
                }
            });
        }
    }, {
        key: 'animationLine',
        value: function animationLine() {
            var _this6 = this;

            if (this.lineLengthCount >= this.lineLength) {
                return;
            }
            this.lineLengthCount = this.lineLength;

            this.lineLengthCount += this.lineLengthStep;

            if (this.lineLengthCount >= this.lineLength) {
                this.lineLengthCount = this.lineLength;
            }

            for (var i = 0; i < this.path.length; i++) {
                var path = this.path[i];
                var layer = this.layer[i];

                //console.log( path, path.itemData.pointDirection.auto(), path.itemData.pointDirection.autoAngle()  );

                //let lineEnd = geometry.distanceAngleToPoint( this.outRadius + this.lineLengthCount, path.itemData.midAngle );
                var lineEnd = path.itemData.lineEnd;
                var lineExpend = path.itemData.lineExpend;

                var line = this.line[i];
                line.points([path.itemData.lineStart.x, path.itemData.lineStart.y, lineEnd.x, lineEnd.y, lineExpend.x, lineExpend.y]);

                if (this.lineLengthCount >= this.lineLength) {

                    /*
                    */
                    this.addText(path, layer);
                    this.addIcon(path, layer);
                } else {
                    window.requestAnimationFrame(function () {
                        _this6.animationLine();
                    });
                }

                this.stage.add(layer);
            }
        }
    }, {
        key: 'addIcon',
        value: function addIcon(path, layer) {
            var icon = new _iconcircle2.default(this.box, this.fixWidth(), this.fixHeight());
            icon.setOptions({
                stage: this.stage,
                layer: layer,
                cx: this.fixCx(),
                cy: this.fixCy()
            });
            icon.update(path.itemData.lineExpend);
        }
    }, {
        key: 'addText',
        value: function addText(path, layer) {
            var text = new _konva2.default.Text({
                x: 0,
                y: 0,
                text: path.itemData.percent + '%',
                fill: '#a3a7f3',
                fontFamily: 'MicrosoftYaHei',
                fontSize: 16,
                fontStyle: 'italic'
            });

            var textPoint = path.itemData.textPoint,
                angleDirect = path.itemData.pointDirection.autoAngle();

            textPoint = _jsonUtilsx2.default.clone(path.itemData.lineEnd);
            textPoint.y -= text.textHeight + 1;

            switch (angleDirect) {
                case 1:
                    {
                        textPoint.x -= text.textWidth;
                        break;
                    }
                case 2:
                    {
                        break;
                    }
                case 4:
                    {
                        break;
                    }
                case 8:
                    {
                        textPoint.x -= text.textWidth;
                        break;
                    }
            }

            var textX = this.fixCx() + textPoint.x,
                textY = this.fixCy() + textPoint.y,
                direct = path.itemData.pointDirection.auto();

            text.x(textX);
            text.y(textY);
            layer.add(text);
        }
    }, {
        key: 'calcLayoutPosition',
        value: function calcLayoutPosition() {
            //console.log( 'calcLayoutPosition', Date.now() );

            this.outRadius = Math.ceil(this.outPercent * this.min / 2);
            this.inRadius = Math.ceil(this.inPercent * this.min / 2);

            this.lineLength = (Math.min(this.fixWidth(), this.fixHeight()) - this.outRadius * 2) / 2 - this.lineOffset;
            this.lineLengthCount = 1;
            this.lineLengthStep = .5;

            this.lineLeft = this.fixCx() - this.outRadius - this.lineSpace;
            this.lineRight = this.fixCx() + this.outRadius + this.lineSpace;

            return this;
        }
    }, {
        key: 'destroy',
        value: function destroy() {
            _get(Dount.prototype.__proto__ || Object.getPrototypeOf(Dount.prototype), 'destroy', this).call(this);
            this.layoutLayer.remove();
            this.layer.map(function (item) {
                item.remove();
            });
            //console.log( 'destroy', Date.now() );
        }
    }]);

    return Dount;
}(_vischartbase2.default);

exports.default = Dount;