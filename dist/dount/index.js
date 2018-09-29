'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

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

var _round = require('../icon/round.js');

var _round2 = _interopRequireDefault(_round);

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

        _this.animationStep = 8;
        _this.angleStep = 5;

        _this.textHeight = 26;
        _this.lineOffset = 30;

        _this.path = [];

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
            this.data = data;
            this.allData = allData;

            if (!_jsonUtilsx2.default.jsonInData(this.data, 'data')) return;

            this.calcDataPosition();
            this.initDataLayout();

            console.log('dount update', this.data, this, utils);

            this.animation();

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
        key: 'animation',
        value: function animation() {
            var _this2 = this;

            if (this.isDone) return;

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
                _this2.stage.add(val);
                val.setZIndex(_this2.layer.length - key);
            });

            window.requestAnimationFrame(function () {
                _this2.animation();
            });

            if (this.isDone) {
                window.requestAnimationFrame(function () {
                    _this2.animationLine();
                });
            }
        }
    }, {
        key: 'initDataLayout',
        value: function initDataLayout() {
            var _this3 = this;

            this.layer = [];
            this.path = [];
            this.line = [];

            this.data.data.map(function (val, key) {
                var path = new _konva2.default.Path({
                    x: _this3.cx,
                    y: _this3.cy,
                    strokeWidth: 0,
                    stroke: '#ff000000',
                    data: '',
                    fill: _this3.colors[key % _this3.colors.length]
                });

                /*
                console.log( 
                    key % this.colors.length
                    , this.colors[ key % this.colors.length] 
                );
                */

                if (_jsonUtilsx2.default.jsonInData(val, 'itemStyle.color')) {
                    path.fill(val.itemStyle.color);
                }

                var tmp = {
                    path: path,
                    pathData: [],
                    itemData: val
                };

                _this3.path.push(tmp);

                path.on('mouseenter', function (evt) {
                    //console.log( 'path mouseenter', Date.now() );
                });

                path.on('mouseleave', function () {
                    //console.log( 'path mouseleave', Date.now() );
                });

                var line = new _konva2.default.Line({
                    x: _this3.cx,
                    y: _this3.cy,
                    points: [0, 0, 0, 0],
                    stroke: '#ffffff',
                    strokeWidth: 2
                });
                _this3.line.push(line);

                var layer = new _konva2.default.Layer();
                layer.add(path);
                layer.add(line);

                _this3.layer.push(layer);
            });
            this.layer.map(function (val, key) {
                _this3.stage.add(val);
            });

            /*
            window.requestAnimationFrame( ()=>{ this.tmpfunc() } );
            */

            return this;
        }
    }, {
        key: 'calcDataPosition',
        value: function calcDataPosition() {
            var _this4 = this;

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

                val.endAngle = _this4.totalAngle * val._totalPercent;
            });

            //修正浮点数精确度
            if (this.data.data.length) {
                var item = this.data.data[this.data.data.length - 1];
                tmp = tmp - item._percent;

                item._percent = 1 - tmp;
                item._totalPercent = 1;
                item.endAngle = this.totalAngle;
            }
            //计算开始角度, 计算指示线的2端
            this.data.data.map(function (val, key) {
                if (!key) {
                    val.startAngle = 0;
                } else {
                    val.startAngle = _this4.data.data[key - 1].endAngle;
                }

                val.midAngle = val.startAngle + (val.endAngle - val.startAngle) / 2;

                val.lineStart = geometry.distanceAngleToPoint(_this4.outRadius, val.midAngle);
                val.lineEnd = geometry.distanceAngleToPoint(_this4.outRadius + _this4.lineLength, val.midAngle);
            });
        }
    }, {
        key: 'animationLine',
        value: function animationLine() {
            var _this5 = this;

            if (this.lineLengthCount >= this.lineLength) {
                return;
            }

            this.lineLengthCount += this.lineLengthStep;

            if (this.lineLengthCount >= this.lineLength) {
                this.lineLengthCount = this.lineLength;
            }

            for (var i = 0; i < this.path.length; i++) {
                var path = this.path[i];
                var layer = this.layer[i];

                var lineEnd = geometry.distanceAngleToPoint(this.outRadius + this.lineLengthCount, path.itemData.midAngle);

                var line = this.line[i];
                line.points([path.itemData.lineStart.x, path.itemData.lineStart.y, lineEnd.x, lineEnd.y]);

                if (this.lineLengthCount >= this.lineLength) {
                    var icon = new _round2.default(this.box, this.width, this.height);
                    icon.setOptions({
                        stage: this.stage,
                        layer: layer
                    });
                    icon.update(path.itemData.lineEnd);
                    console.log('ended', Date.now());
                } else {
                    window.requestAnimationFrame(function () {
                        _this5.animationLine();
                    });
                }

                this.stage.add(layer);
            }
        }
    }, {
        key: 'calcLayoutPosition',
        value: function calcLayoutPosition() {
            //console.log( 'calcLayoutPosition', Date.now() );

            this.outRadius = Math.ceil(this.outPercent * this.max / 2);
            this.inRadius = Math.ceil(this.inPercent * this.max / 2);

            this.lineLength = (Math.min(this.width, this.height) - this.outRadius * 2) / 2 - this.lineOffset;
            this.lineLengthCount = 1;
            this.lineLengthStep = .5;

            return this;
        }
    }]);

    return Dount;
}(_vischartbase2.default);

exports.default = Dount;