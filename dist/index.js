'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _vischartbase = require('./common/vischartbase.js');

var _vischartbase2 = _interopRequireDefault(_vischartbase);

var _index = require('./diagrammeter/index.js');

var _index2 = _interopRequireDefault(_index);

var _index3 = require('./dount/index.js');

var _index4 = _interopRequireDefault(_index3);

var _konva = require('konva');

var _konva2 = _interopRequireDefault(_konva);

var _jsonUtilsx = require('json-utilsx');

var _jsonUtilsx2 = _interopRequireDefault(_jsonUtilsx);

var _constant = require('./common/constant.js');

var constant = _interopRequireWildcard(_constant);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var VisChart = function (_VisChartBase) {
    _inherits(VisChart, _VisChartBase);

    function VisChart(box, width, height) {
        _classCallCheck(this, VisChart);

        var _this = _possibleConstructorReturn(this, (VisChart.__proto__ || Object.getPrototypeOf(VisChart)).call(this, box, width, height));

        _this.ins = [];

        _this.init();
        return _this;
    }

    _createClass(VisChart, [{
        key: 'init',
        value: function init() {
            //console.log( 'VisChartBase init', Date.now(), this.width, this.height, this.canvas );

            if (!this.box) return;

            this.stage = new _konva2.default.Stage({
                container: this.box,
                width: this.width,
                height: this.height
            });

            this.customWidth && (this.box.style.width = this.customWidth + 'px');
            this.customHeight && (this.box.style.height = this.customHeight + 'px');

            return this;
        }
    }, {
        key: 'update',
        value: function update(data) {
            var _this2 = this;

            this.data = data;

            if (!_jsonUtilsx2.default.jsonInData(this.data, 'series')) return;

            //console.log( ju );

            this.stage.removeChildren();

            //console.log( 'update data', data );

            this.data.series.map(function (val, key) {
                //console.log( val, constant );
                var ins = void 0;

                switch (val.type) {
                    case constant.CHART_TYPE.dount:
                        {
                            ins = new _index4.default(_this2.box, _this2.width, _this2.height);
                            _this2.options && ins.setOptions(_this2.options);
                            ins.setStage(_this2.stage);
                            ins.update(_jsonUtilsx2.default.clone(val), _jsonUtilsx2.default.clone(_this2.data));
                            break;
                        }
                }

                if (ins) {
                    _this2.ins.push(ins);
                }
            });

            return this;
        }
    }, {
        key: 'setImage',
        value: function setImage(imgUrl) {
            this.imgUrl = imgUrl;

            this.loadImage();

            return this;
        }
    }, {
        key: 'loadImage',
        value: function loadImage() {
            var _this3 = this;

            if (!this.imgUrl) return;

            if (this.iconLayer) this.state.remove(this.iconLayer);

            this.iconLayer = new _konva2.default.Layer();

            var img = new Image();
            img.onload = function () {
                _this3.icon = new _konva2.default.Image({
                    x: _this3.cx - 107 / 2,
                    y: _this3.cy - 107 / 2,
                    image: img,
                    width: 107,
                    height: 107
                });

                _this3.iconLayer.add(_this3.icon);

                _this3.stage.add(_this3.iconLayer);
            };
            img.src = this.imgUrl;

            return this;
        }
    }]);

    return VisChart;
}(_vischartbase2.default);

exports.default = VisChart;