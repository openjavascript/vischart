'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _konva = require('konva');

var _konva2 = _interopRequireDefault(_konva);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var VisChartBase = function () {
    function VisChartBase(box, width, height) {
        _classCallCheck(this, VisChartBase);

        this.box = box;

        this.customWidth = width;
        this.customHeight = height;

        this.width = width || box.offsetWidth;
        this.height = height || box.offsetHeight;

        this.max = Math.max(this.width, this.height);
        this.min = Math.min(this.width, this.height);

        this.cx = this.width / 2;
        this.cy = this.height / 2;
        this.cpoint = { x: this.cx, y: this.cy };

        this.totalAngle = 360;
        this.angleOffset = 0;
        this.countAngle = 0;

        this.images = [];

        this.rateWidth = 330;
        this.rateHeight = 330;

        this.rotationBg = [];

        this.rotationBgCount = 0;
        this.rotationBgStep = 1;

        this.colors = ['#f12575', '#da432e', '#f3a42d', '#19af89', '#24a3ea', '#b56be8'];
    }

    _createClass(VisChartBase, [{
        key: 'update',
        value: function update(data, allData) {
            this.data = data;
            this.allData = allData;

            this.loadImage();

            return this;
        }
    }, {
        key: 'setLegend',
        value: function setLegend(legend) {
            this.legend = legend;
        }
    }, {
        key: 'animation',
        value: function animation() {}
    }, {
        key: 'animationBg',
        value: function animationBg() {
            var _this = this;

            //console.log( 'animationBg', Date.now(), this.isDestroy, this.rotationBg.length, this.rotationBgCount );
            if (this.isDestroy) return;
            if (!this.rotationBg.length) return;

            this.rotationBg.map(function (item) {
                _this.rotationBgCount = (_this.rotationBgCount - _this.rotationBgStep) % 360;
                item.rotation(_this.rotationBgCount);
            });

            this.stage.add(this.iconLayer);

            window.requestAnimationFrame(function () {
                _this.animationBg();
            });
        }
    }, {
        key: 'addImage',
        value: function addImage(imgUrl, width, height) {
            var offsetX = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
            var offsetY = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;
            var rotation = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 0;
            var isbase64 = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : false;

            //console.log( this.rateWidth, this.width );
            var rateW = this.min / this.rateWidth,
                rateH = this.min / this.rateHeight;
            this.images.push({
                url: imgUrl,
                width: width * rateW,
                height: height * rateH,
                offsetX: offsetX,
                offsetY: offsetY,
                rotation: rotation,
                isbase64: isbase64
            });

            return this;
        }

        /*
            "background": [
                { 
                    "url": "./img/dount-in.png"
                    , "width": 120
                    , "height": 120
                    , "offsetX": 0
                    , "offsetY": 1
                }
                , { 
                    "url": "./img/dount-big.png"
                    , "width": 250
                    , "height": 248
                    , "offsetX": 0
                    , "offsetY": 1
                }
            ],
        */

    }, {
        key: 'loadImage',
        value: function loadImage() {
            var _this2 = this;

            if (this.iconLayer) this.iconLayer.remove();
            this.iconLayer = new _konva2.default.Layer();

            this.images = [];

            if (this.data && this.data.background && this.data.background.length) {
                this.data.background.map(function (val) {
                    _this2.addImage(val.url, val.width, val.height, val.offsetX || 0, val.offsetY || 0, val.rotation || 0, val.isbase64);
                });
            }

            this.rotationBg = [];

            this.images.map(function (item) {
                //console.log( 'item', item );

                var img = new Image();
                img.onload = function () {
                    var width = item.width || img.width,
                        height = item.height || img.height;

                    var icon = new _konva2.default.Image({
                        image: img,
                        x: _this2.fixCx() - width / 2 + item.offsetX,
                        y: _this2.fixCy() - height / 2 + item.offsetY,
                        width: width,
                        height: height
                    });

                    _this2.iconLayer.add(icon);

                    if (item.rotation) {
                        _this2.rotationBg.push(icon);
                        icon.x(_this2.fixCx() - width / 2 + item.offsetX + width / 2);
                        icon.y(_this2.fixCy() - height / 2 + item.offsetY + height / 2);
                        icon.offset({ x: width / 2, y: height / 2 });
                        if (_this2.rotationBg.length === 1) _this2.animationBg();
                    }
                    _this2.stage.add(_this2.iconLayer);
                };
                if (item.isbase64) {
                    img.src = (item.base64prefix || 'data:image/png;base64,') + item.url;
                } else {
                    img.src = item.url;
                }
            });

            return this;
        }
    }, {
        key: 'hasLegend',
        value: function hasLegend() {
            var r = void 0;

            if (this.data && this.data.legend && this.data.legend.data && this.data.legend.data.length) {
                r = true;
            }

            return r;
        }
    }, {
        key: 'fixCx',
        value: function fixCx() {
            var r = this.cx;
            return r;
        }
    }, {
        key: 'fixCy',
        value: function fixCy() {
            var r = this.cy;

            if (this.legend) {
                switch (this.legend.direction()) {
                    case 'bottom':
                        {
                            r = (this.height - this.legend.outerHeight() / 2) / 2 - 5;
                            break;
                        }
                }
            }

            return r;
        }
    }, {
        key: 'fixWidth',
        value: function fixWidth() {
            var r = this.width;
            return r;
        }
    }, {
        key: 'fixHeight',
        value: function fixHeight() {
            var r = this.height;
            return r;
        }
    }, {
        key: 'init',
        value: function init() {
            return this;
        }
    }, {
        key: 'setOptions',
        value: function setOptions(options) {

            for (var key in options) {
                this[key] = options[key];
            }

            this.options = options;
        }
    }, {
        key: 'calcLayoutPosition',
        value: function calcLayoutPosition() {
            return this;
        }
    }, {
        key: 'calcDataPosition',
        value: function calcDataPosition() {
            return this;
        }
    }, {
        key: 'initDataLayout',
        value: function initDataLayout() {
            return this;
        }
    }, {
        key: 'draw',
        value: function draw() {
            return this;
        }
    }, {
        key: 'reset',
        value: function reset() {}
    }, {
        key: 'getData',
        value: function getData() {
            return this.data || {};
        }
    }, {
        key: 'layer',
        value: function layer() {
            return this.layer;
        }
    }, {
        key: 'setLayer',
        value: function setLayer(layer) {
            this.layer = layer;
            return this;
        }
    }, {
        key: 'setStage',
        value: function setStage(stage) {
            this.stage = stage;
        }
    }, {
        key: 'setDestroy',
        value: function setDestroy() {
            this.isDestroy = 1;
        }
    }, {
        key: 'destroy',
        value: function destroy() {
            this.setDestroy();
            console.log('destroy', this.name);
            this.iconLayer.remove();
        }
    }]);

    return VisChartBase;
}();

exports.default = VisChartBase;