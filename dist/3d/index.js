'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _threebase = require('./common/threebase.js');

var _threebase2 = _interopRequireDefault(_threebase);

var _jsonUtilsx = require('json-utilsx');

var _jsonUtilsx2 = _interopRequireDefault(_jsonUtilsx);

var _three = require('../utils/three.js');

var _three2 = _interopRequireDefault(_three);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var VisThree = function (_VisChartBase) {
    _inherits(VisThree, _VisChartBase);

    function VisThree(box, width, height) {
        _classCallCheck(this, VisThree);

        var _this = _possibleConstructorReturn(this, (VisThree.__proto__ || Object.getPrototypeOf(VisThree)).call(this, box, width, height));

        _this.ins = [];
        _this.legend = null;

        _this._setSize(width, height);

        return _this;
    }

    _createClass(VisThree, [{
        key: 'update',
        value: function update(data, ignoreLegend) {
            var _this2 = this;

            var redraw = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;


            this.scene = new _three2.default.Scene();

            this.camera = new _three2.default.PerspectiveCamera(50, this.width / this.height, 1, 10000);
            this.camera.position.set(0, 0, 100);

            var loader = new _three2.default.SVGLoader();
            loader.load('./img/dount-in.svg', function (paths) {
                /*
                */
                var group = new _three2.default.Group();
                //group.scale.multiplyScalar( -1 );
                group.position.x = -58;
                group.position.y = 65;
                group.scale.y *= -1;

                console.log(1111111111111);
                for (var i = 0; i < paths.length; i++) {
                    var path = paths[i];

                    //console.log( i, path );
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
                    }
                }
                _this2.scene.add(group);

                _this2.group = group;

                /*
                this.group = new THREE.SVGObject( paths );
                this.scene.add( this.group );
                */

                console.log('group', _this2.group);

                _this2.render();
            });

            var renderer = this.renderer = new _three2.default.WebGLRenderer({ antialias: true, alpha: true });
            //renderer.setPixelRatio( window.devicePixelRatio );
            renderer.setSize(this.width - 2, this.height - 2);

            this.render();

            this.box.appendChild(renderer.domElement);

            this.animate();
        }
    }, {
        key: 'animate',
        value: function animate() {
            var _this3 = this;

            //this.group && ( this.group.rotation.y += 0.01 );

            this.render();

            requestAnimationFrame(function () {
                _this3.animate();
            });
        }
    }, {
        key: 'render',
        value: function render() {
            this.renderer.render(this.scene, this.camera);
        }
    }]);

    return VisThree;
}(_threebase2.default);

exports.default = VisThree;