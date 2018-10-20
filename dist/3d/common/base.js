'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _vischartbase = require('../../common/vischartbase.js');

var _vischartbase2 = _interopRequireDefault(_vischartbase);

var _three = require('../../utils/three.js');

var _three2 = _interopRequireDefault(_three);

var _jsonUtilsx = require('json-utilsx');

var _jsonUtilsx2 = _interopRequireDefault(_jsonUtilsx);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ThreeBase = function (_VisChartBase) {
    _inherits(ThreeBase, _VisChartBase);

    function ThreeBase(box, width, height) {
        _classCallCheck(this, ThreeBase);

        return _possibleConstructorReturn(this, (ThreeBase.__proto__ || Object.getPrototypeOf(ThreeBase)).call(this, box, width, height));
    }

    _createClass(ThreeBase, [{
        key: 'render',
        value: function render() {
            this.renderer && this.scene && this.camera && this.renderer.render(this.scene, this.camera);

            return this;
        }
    }, {
        key: 'loadImage',
        value: function loadImage() {
            var _this2 = this;

            if (this.images.length) return;

            if (this.iconLayer) this.iconLayer.remove();
            this.iconLayer = new Konva.Layer();
            this.addDestroy(this.iconLayer);

            this.images = [];
            this._images = [];
            this.rotationBg = [];

            if (this.data && this.data.background && this.data.background.length) {

                this.data.background.map(function (val) {
                    _this2.addImage(val.url, val.width, val.height, val.offsetX || 0, val.offsetY || 0, val.rotation || 0, val.isbase64, val);
                });
            }

            this.images.map(function (item, key) {
                item.opt = item.opt || {};
                if (item.opt.issvgstring) {
                    if (!_this2.svgLoader()) return;
                    _this2.initSVGBackground(_this2.svgLoader().parse(item.url), item, key);
                    return;
                }
            });

            return this;
        }
    }, {
        key: 'svgLoader',
        value: function svgLoader() {
            if (!this._svgloader && _three2.default.SVGLoader) {
                this._svgloader = new _three2.default.SVGLoader();
            }

            return this._svgloader;
        }
    }, {
        key: 'initSVGBackground',
        value: function initSVGBackground(paths, item, key) {
            if (!(paths && paths.length)) return;

            var group = new _three2.default.Group();
            group.scale.y *= -1;
            for (var i = 0; i < paths.length; i++) {
                var path = paths[i];
                var material = new _three2.default.MeshBasicMaterial({
                    color: path.color,
                    side: _three2.default.DoubleSide,
                    depthWrite: false
                });
                var shapes = path.toShapes(true);
                for (var j = 0; j < shapes.length; j++) {
                    var shape = shapes[j];
                    var geometry = new _three2.default.ShapeBufferGeometry(shape);
                    var mesh = new _three2.default.Mesh(geometry, material);
                    group.add(mesh);

                    /*
                    mesh.renderOrder = 10 + key;
                    mesh.material.depthTest=false;
                    */
                }
            }

            var box = new _three2.default.Box3().setFromObject(group);
            var size = box.getSize(new _three2.default.Vector3());

            var x = -box.max.x / 2 - box.min.x / 2,
                y = -box.max.y / 2 - box.min.y / 2;

            group.position.x = x;
            group.position.y = y;

            var pivot = new _three2.default.Object3D();
            pivot.add(group);

            pivot.scale.set(this.sizeRate, this.sizeRate, this.sizeRate);

            this.addDestroy(pivot);

            this.scene.add(pivot);

            var data = { ele: pivot, item: item };

            this._images.push(data);

            item.rotation && this.rotationBg.push(data);

            this.render();
            this.animationBg();
        }
    }, {
        key: 'animate',
        value: function animate() {
            var _this3 = this;

            if (this.isDestroy) return;
            if (!this.rotationBg.length) return;
            if (!this.isAnimation()) return;

            requestAnimationFrame(function () {
                _this3.animate();
            });
        }
    }, {
        key: 'animationBg',
        value: function animationBg() {
            var _this4 = this;

            if (this.isDestroy) return;
            if (!this.rotationBg.length) return;
            if (!this.isAnimation()) return;
            //return;
            if (this._images && this._images.length) {
                this._images.map(function (item) {
                    item.ele.rotation[_this4.getRotationAttr(item)] += _this4.getRotationStep(item);
                });

                this.render();
            };

            window.requestAnimationFrame(function () {
                _this4.animationBg();
            });
        }
    }, {
        key: 'getRotationAttr',
        value: function getRotationAttr(item) {
            var r = 'y';
            if (_jsonUtilsx2.default.jsonInData(item, 'item.opt.rotationAttr')) {
                r = item.item.opt.rotationAttr;
            }
            return r;
        }
    }, {
        key: 'getRotationStep',
        value: function getRotationStep(item) {
            var r = 0.03;
            if (_jsonUtilsx2.default.jsonInData(item, 'item.opt.rotationStep')) {
                r = item.item.opt.rotationStep;
            }
            return r;
        }
    }, {
        key: 'destroy',
        value: function destroy() {
            this.setDestroy();

            this.destroyList.map(function (item) {
                if (item) {
                    /*
                    item.remove();
                    item.destroy();
                    */
                }
            });
        }
    }]);

    return ThreeBase;
}(_vischartbase2.default);

exports.default = ThreeBase;