'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _vischartbase = require('./common/vischartbase.js');

var _vischartbase2 = _interopRequireDefault(_vischartbase);

var _index = require('./dount/index.js');

var _index2 = _interopRequireDefault(_index);

var _index3 = require('./gauge/index.js');

var _index4 = _interopRequireDefault(_index3);

var _konva = require('konva');

var _konva2 = _interopRequireDefault(_konva);

var _jsonUtilsx = require('json-utilsx');

var _jsonUtilsx2 = _interopRequireDefault(_jsonUtilsx);

var _constant = require('./common/constant.js');

var constant = _interopRequireWildcard(_constant);

var _legend = require('./common/legend.js');

var _legend2 = _interopRequireDefault(_legend);

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
        _this.legend = null;

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
            this.ins.map(function (item) {
                item.destroy();
            });

            //console.log( ju );

            this.stage.removeChildren();

            //console.log( 'update data', data );

            if (_jsonUtilsx2.default.jsonInData(this.data, 'legend.data') && this.data.legend.data.length) {
                this.legend = new _legend2.default(this.box, this.width, this.height);
                this.legend.setStage(this.stage);
                this.legend.setOptions({
                    onChange: function onChange(group) {
                        //console.log( 'legend onchange', group );
                        _this2.initChart();
                    }
                });
                this.legend.update(this.data.legend);
            }
            this.initChart();
            return this;
        }
    }, {
        key: 'initChart',
        value: function initChart() {
            var _this3 = this;

            this.ins.map(function (item) {
                item.destroy();
            });

            this.ins = [];

            this.data.series.map(function (val, key) {
                //console.log( val, constant );
                var ins = void 0;

                switch (val.type) {
                    case constant.CHART_TYPE.dount:
                        {
                            ins = new _index2.default(_this3.box, _this3.width, _this3.height);
                            break;
                        }
                    case constant.CHART_TYPE.gauge:
                        {
                            ins = new _index4.default(_this3.box, _this3.width, _this3.height);
                            break;
                        }
                }

                if (ins) {
                    _this3.legend && ins.setLegend(_this3.legend);
                    _this3.options && ins.setOptions(_this3.options);
                    ins.setStage(_this3.stage);
                    ins.update(_this3.getLegendData(val), _jsonUtilsx2.default.clone(_this3.data));
                    _this3.ins.push(ins);
                }
            });
        }
    }, {
        key: 'getLegendData',
        value: function getLegendData(data) {
            data = _jsonUtilsx2.default.clone(data);

            var tmp = [];

            if (this.legend && this.legend.group && this.legend.group.length) {
                //console.log( 'getLegendData', this.legend.group, 111111111 );
                this.legend.group.map(function (item, key) {
                    if (!item.disabled) {
                        tmp.push(data.data[key]);
                    }
                });
                data.data = tmp;
            }

            return data;
        }
    }, {
        key: 'destroy',
        value: function destroy() {
            _get(VisChart.prototype.__proto__ || Object.getPrototypeOf(VisChart.prototype), 'destroy', this).call(this);
            this.stage && this.stage.destroy();
            this.stage = null;
        }
    }]);

    return VisChart;
}(_vischartbase2.default);

exports.default = VisChart;