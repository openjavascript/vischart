'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _two = require('two.js');

var _two2 = _interopRequireDefault(_two);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DiagramMeter = function () {
    function DiagramMeter(canvas) {
        var width = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 400;
        var height = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 400;

        _classCallCheck(this, DiagramMeter);

        this.name = 'DiagramMeter ' + Date.now();

        this.canvas = canvas;
        this.width = width;
        this.height = height;

        this.initPosition();

        this.init();
    }

    _createClass(DiagramMeter, [{
        key: 'initPosition',
        value: function initPosition() {
            this.cx = this.width / 2;
            this.cy = this.height / 2;
            this.radius = this.width / 2 / 2;
        }
    }, {
        key: 'init',
        value: function init() {
            if (!this.canvas) return;
            this.two = new _two2.default({
                type: _two2.default.Types.canvas,
                width: this.width,
                height: this.height,
                domElement: this.canvas
            });

            this.drawDemo();
            this.draw();
        }
    }, {
        key: 'draw',
        value: function draw() {
            console.log('this.draw', Date.now());

            var center = this.two.makeCircle(this.cx, this.cy, 25);
            center.fill = '#ff800000';
            center.stroke = '#596DA7';

            var textNum = this.two.makeText('64', this.cx - 3, this.cy, {
                fill: '#ffffff',
                size: 22
            });
            var textPercent = this.two.makeText('%', textNum._translation.x + textNum.size / 2 + 8, this.cy + 4, {
                fill: '#ffffff',
                size: 12
            });
            console.log(textNum);

            this.two.update();
        }
    }, {
        key: 'drawDemo',
        value: function drawDemo() {
            console.log('this.drawDemo', Date.now());
        }
    }]);

    return DiagramMeter;
}();

exports.default = DiagramMeter;