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

        this.width = width || box.offsetWidth;
        this.height = height || box.offsetHeight;

        this.max = Math.max(this.width, this.height);

        this.cx = this.max / 2;
        this.cy = this.max / 2;
        this.cpoint = { x: this.cx, y: this.cy };

        console.dir(this.box);
        console.log(this.box, this.width, this.height, this.max);
    }

    _createClass(VisChartBase, [{
        key: 'update',
        value: function update(data) {
            console.log('VisChartBase update', data);
        }
    }, {
        key: 'init',
        value: function init() {
            console.log('VisChartBase init', Date.now(), this.width, this.height, this.canvas);

            if (!this.box) return;

            this.stage = new _konva2.default.Stage({
                container: this.box,
                width: this.width,
                height: this.height
            });

            this.calcLayoutPosition();
        }
    }, {
        key: 'calcLayoutPosition',
        value: function calcLayoutPosition() {}
    }, {
        key: 'calcDataPosition',
        value: function calcDataPosition() {}
    }, {
        key: 'draw',
        value: function draw() {}
    }]);

    return VisChartBase;
}();

exports.default = VisChartBase;