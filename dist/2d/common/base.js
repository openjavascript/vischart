'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _konva = require('konva');

var _konva2 = _interopRequireDefault(_konva);

var _vischartbase = require('vischartbase');

var _vischartbase2 = _interopRequireDefault(_vischartbase);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

//import VisChartBase from '../../../../vischartbase/dist/index.js';


var KonvaBase = function (_VisChartBase) {
    _inherits(KonvaBase, _VisChartBase);

    function KonvaBase(box, width, height) {
        _classCallCheck(this, KonvaBase);

        return _possibleConstructorReturn(this, (KonvaBase.__proto__ || Object.getPrototypeOf(KonvaBase)).call(this, box, width, height));
    }

    _createClass(KonvaBase, [{
        key: 'loadImage',
        value: function loadImage() {
            var _this2 = this;

            if (this.images.length) return;

            if (this.iconLayer) this.iconLayer.remove();
            this.iconLayer = new _konva2.default.Layer();
            this.addDestroy(this.iconLayer);

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
                    _this2.addDestroy(icon);

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
    }]);

    return KonvaBase;
}(_vischartbase2.default);

exports.default = KonvaBase;