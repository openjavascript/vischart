'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _vischartbase = require('../../common/vischartbase.js');

var _vischartbase2 = _interopRequireDefault(_vischartbase);

var _three = require('../../utils/three.js');

var _three2 = _interopRequireDefault(_three);

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

            if (this.data && this.data.background && this.data.background.length) {

                this.data.background.map(function (val) {
                    _this2.addImage(val.url, val.width, val.height, val.offsetX || 0, val.offsetY || 0, val.rotation || 0, val.isbase64, val);
                });
            }

            this.rotationBg = [];

            this.images.map(function (item, key) {
                item.opt = item.opt || {};
                //console.log( 'item', item );

                if (item.opt.issvgstring) {
                    if (!_this2.svgLoader()) return;
                    _this2.initSVGBackground(_this2.svgLoader().parse(item.url), item, key);
                    return;
                }

                /*
                let img = new Image();
                img.onload = ()=>{
                    let width = item.width || img.width
                        , height = item.height || img.height
                        ;
                     let icon = new Konva.Image( {
                        image: img
                        , x: this.fixCx() - width / 2 + item.offsetX
                        , y: this.fixCy() - height / 2 + item.offsetY
                        , width: width
                        , height: height
                    });
                    this.addDestroy( icon );
                     this.iconLayer.add( icon );
                     if( item.rotation ) {
                        this.rotationBg.push( icon );
                        icon.x( this.fixCx() - width / 2 + item.offsetX + width / 2 );
                        icon.y( this.fixCy() - height / 2 + item.offsetY + height / 2 );
                        icon.offset( { x: width / 2, y: height / 2 } )
                        if( this.rotationBg.length === 1 ) this.animationBg();
                    }
                    this.stage.add( this.iconLayer );
                }
                if( item.isbase64 ){
                    img.src = ( item.base64prefix || 'data:image/png;base64,' ) + item.url;
                }else{
                    img.src = item.url; 
                }
                */
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

            console.log(item);

            var group = new _three2.default.Group();
            var meshlist = [];
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
                    meshlist.push(mesh);

                    group.add(mesh);
                }
            }

            var box = new _three2.default.Box3().setFromObject(group);
            var size = box.getSize(new _three2.default.Vector3());

            console.log(size, box.min, box.max);

            var x = -box.max.x / 2 - box.min.x / 2,
                y = -box.max.y / 2 - box.min.y / 2;

            group.position.x = x;
            group.position.y = y;

            console.log(x, y);

            meshlist.map(function (sitem) {
                //console.log( sitem.position );
                /*
                sitem.position.x = x;
                sitem.position.y = y;
                */
            });

            var pivot = new _three2.default.Object3D();
            pivot.add(group);

            this.scene.add(pivot);

            this._images.push({ ele: pivot, item: item, meshlist: meshlist });

            this.render();

            this.animate();
        }
    }, {
        key: 'animate',
        value: function animate() {
            var _this3 = this;

            if (this._images && this._images.length) {
                this._images.map(function (item) {
                    item.ele.rotation.y += 0.03;
                });

                this.render();
            };

            requestAnimationFrame(function () {
                _this3.animate();
            });
        }
    }]);

    return ThreeBase;
}(_vischartbase2.default);

exports.default = ThreeBase;