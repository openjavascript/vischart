'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _konva = require('konva');

var _konva2 = _interopRequireDefault(_konva);

var _konvabase = require('../../common/konvabase.js');

var _konvabase2 = _interopRequireDefault(_konvabase);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TooltipEvent = function (_VisChartBase) {
    _inherits(TooltipEvent, _VisChartBase);

    function TooltipEvent(arc, val) {
        _classCallCheck(this, TooltipEvent);

        var _this = _possibleConstructorReturn(this, (TooltipEvent.__proto__ || Object.getPrototypeOf(TooltipEvent)).call(this, arc, val));

        _this.arc = arc;
        _this.val = val;

        _this.stage = null;
        _this.tooltipLayer = null;

        _this.timer = null;
        _this.isAction = false;

        return _this;
    }

    //创建tooltipLayer层


    _createClass(TooltipEvent, [{
        key: 'setStage',
        value: function setStage(stage) {
            this.stage = stage;

            this.tooltipLayer = new _konva2.default.Layer({});
            this.addDestroy(this.tooltipLayer);
        }

        //创建tooltip和tooltipBg层

    }, {
        key: 'drawTooltip',
        value: function drawTooltip() {
            //背景色
            var tooltipBg = new _konva2.default.Tag({
                width: 200,
                height: 45,
                fill: '#000',
                opacity: 0.5,
                lineJoin: 'round',
                cornerRadius: 5,
                visible: false
            });
            //tooltip文字
            var tooltip = new _konva2.default.Text({
                fontFamily: "Calibri",
                fontSize: 12,
                textFill: "#fff",
                fill: "#fff",
                visible: false
            });
            tooltip.lineHeight(1.5);

            this.tooltipLayer.add(tooltipBg, tooltip);

            this.stage.add(this.tooltipLayer);

            var tooltipCon = {
                tooltip: tooltip,
                tooltipBg: tooltipBg
            };
            return tooltipCon;
        }
        //创建tooltip移动层动画

    }, {
        key: 'drawTooltipMove',
        value: function drawTooltipMove() {
            var tooltip = this.drawTooltip().tooltip;
            var tooltipBg = this.drawTooltip().tooltipBg;
            var self = this;

            //添加鼠标事件
            this.arc.on('mousemove', function () {
                if (this.isAction) {
                    clearTimeout(this.timer);
                }
                this.isAction = true;
                tooltip.setZIndex(10);
                var mousePos = self.stage.getPointerPosition();
                tooltipBg.position({
                    x: mousePos.x,
                    y: mousePos.y
                });
                tooltip.position({
                    x: mousePos.x + 5,
                    y: mousePos.y + 5
                });
                var textLabel = '\u8BBF\u95EE\u6765\u6E90\n ' + self.val.name + ': ' + self.val.value + '(' + self.val.percent + '%)';
                tooltip.text(textLabel);
                tooltipBg.show();
                tooltip.show();
                self.tooltipLayer.setZIndex(100);
                self.tooltipLayer.batchDraw();
            });
            this.arc.on('mouseout', function () {
                if (this.isAction) {
                    this.timer = setTimeout(function () {
                        this.isAction = false;
                        tooltipBg.hide();
                        tooltip.hide();
                        self.tooltipLayer.setZIndex(100);
                        self.tooltipLayer.draw();
                    }, 100);
                }
            });
        }
    }]);

    return TooltipEvent;
}(_konvabase2.default);

exports.default = TooltipEvent;