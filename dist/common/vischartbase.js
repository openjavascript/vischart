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

        this.cx = this.max / 2;
        this.cy = this.max / 2;
        this.cpoint = { x: this.cx, y: this.cy };

        this.totalAngle = 360;
        this.angleOffset = 0;
    }

    _createClass(VisChartBase, [{
        key: 'update',
        value: function update(data) {
            this.data = data;

            return this;
        }
    }, {
        key: 'init',
        value: function init() {
            return this;
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
        key: 'setStage',
        value: function setStage(stage) {
            this.stage = stage;
        }
    }]);

    return VisChartBase;
}();

exports.default = VisChartBase;