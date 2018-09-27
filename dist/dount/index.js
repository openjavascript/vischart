'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _konva = require('konva');

var _konva2 = _interopRequireDefault(_konva);

var _vischartbase = require('../common/vischartbase.js');

var _vischartbase2 = _interopRequireDefault(_vischartbase);

var _geometry = require('../geometry/geometry.js');

var geometry = _interopRequireWildcard(_geometry);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Dount = function (_VisChartBase) {
    _inherits(Dount, _VisChartBase);

    function Dount(canvas) {
        _classCallCheck(this, Dount);

        var _this = _possibleConstructorReturn(this, (Dount.__proto__ || Object.getPrototypeOf(Dount)).call(this, canvas));

        _this.name = 'Dount ' + Date.now();

        _this.outPercent = .50;
        _this.inPercent = .37;

        _this.iconPercent = .25;

        _this.outline = [];

        _this.startAngle = 0;
        _this.endAngle = 360;
        _this.countAngle = _this.startAngle;

        _this.init();

        console.log(_this);
        return _this;
    }

    _createClass(Dount, [{
        key: 'calcLayoutPosition',
        value: function calcLayoutPosition() {
            var _this2 = this;

            console.log('calcLayoutPosition', Date.now());

            this.outRadius = Math.ceil(this.outPercent * this.max / 2);
            this.inRadius = Math.ceil(this.inPercent * this.max / 2);

            this.layer = new _konva2.default.Layer();

            this.path = new _konva2.default.Path({
                x: this.cx,
                y: this.cy,
                strokeWidth: 0,
                stroke: '#ff000000',
                data: '',
                fill: 'green'
            });

            // add the shape to the layer
            this.layer.add(this.path);
            this.stage.add(this.layer);

            // add the layer to the stage


            var img = document.querySelector('#dountInImg');
            var icon = new _konva2.default.Image({
                x: this.cx - 107 / 2,
                y: this.cy - 107 / 2,
                image: img,
                width: 107,
                height: 107
            });

            this.iconLayer = new _konva2.default.Layer();
            this.iconLayer.add(icon);

            this.stage.add(this.iconLayer);

            window.requestAnimationFrame(function () {
                _this2.tmpfunc();
            });
        }
    }, {
        key: 'tmpfunc',
        value: function tmpfunc() {
            var _this3 = this;

            var tmp = void 0,
                tmppoint = void 0;

            if (this.isDone) return;

            this.countAngle += 8;

            if (this.countAngle >= this.endAngle) {
                this.countAngle = 360;
                this.isDone = 1;
            }
            //this.countAngle = this.endAngle;

            this.outline = [];

            var step = 3;

            this.outline.push('M');
            for (var i = 0;; i += step) {
                if (i >= this.countAngle) i = this.countAngle;

                tmppoint = tmp = geometry.distanceAngleToPoint(this.outRadius, i);
                this.outline.push([tmppoint.x, tmppoint.y].join(',') + ',');
                if (i == 0) this.outline.push('L');

                if (i >= this.countAngle) break;
            }
            for (var _i = this.countAngle;; _i -= step) {
                if (_i <= 0) _i = 0;

                tmppoint = tmp = geometry.distanceAngleToPoint(this.inRadius, _i);
                this.outline.push([tmppoint.x, tmppoint.y].join(',') + ',');
                if (_i == 0) break;
            }
            this.outline.push('z');

            //this.path.data = this.outline.join('');
            this.path.setData(this.outline.join(''));
            this.path.draw();
            this.layer.remove();
            this.stage.add(this.layer);

            /*
            let img = document.querySelector( '#dountInImg' );
            let ctx = this.canvas.getContext( '2d' );
            ctx.drawImage( 
                img
                , this.width / 2 - img.width / 2
                , this.height / 2 - img.height / 2
            );
            */

            window.requestAnimationFrame(function () {
                _this3.tmpfunc();
            });
        }

        /*
          calcDataPosition() {
        }
          draw(){
             //console.log( this );
            this.debugPoint( this.startPoint.x, this.startPoint.y );
            this.debugPoint( this.endPoint.x, this.endPoint.y );
            this.debugPoint( this.topPoint.x, this.topPoint.y );
             let center = this.two.makeCircle( this.cx, this.cy, 25 ); 
            center.fill = '#ff800000';
            center.stroke = '#596DA7';
             let textNum = this.two.makeText( '64', this.cx - 3, this.cy, {
                fill: '#ffffff'
                , size: 22
            } );
            let textPercent = this.two.makeText( '%', textNum._translation.x + textNum.size / 2 + 8, this.cy + 4, {
                fill: '#ffffff'
                , size: 12
            } );
              this.drawOut();
             this.two.update();
         }
         //画渐变
        drawOut(){
             var linearGradient = this.two.makeLinearGradient(
              -this.width, this.height/2
              , this.width, this.height/2
              , new Two.Stop(0, 'rgb(89,150,189)')
              , new Two.Stop(.3, 'rgb(90,149,189)')
              , new Two.Stop(.5, 'rgb(221,180,96)')
              , new Two.Stop(.6, 'rgb(170,82,35)')
              , new Two.Stop(.8, 'rgb(189,108,49)')
              , new Two.Stop(1, 'rgb(216,154,76)')
            );
             let path = this.two.makePath.apply( this.two, this.outpos );  
            path.stroke = '#00000000';
            path.fill = linearGradient;
        }
         drawDemo(){
            console.log( 'this.drawDemo', Date.now() );
        }
         debugPoint( x, y ){
            let point = this.two.makeCircle( x, y, 5 ); 
            point.fill = '#ffff00';
            point.stroke = '#ff0000';
        }
        initPosition(){
            let tmp, tmppoint;
             this.cx = this.width / 2;
            this.cy = this.height / 2;
            this.cpoint = { x: this.cx, y: this.cy }
            this.radius = this.width / 2 / 2;
            this.sradius = this.radius - 14;
             this.startAngle = 135;
            this.endAngle = 45;
            this.endAngle = geometry.fixEndAngle( this.startAngle, this.endAngle );
             this.availableAngle = this.endAngle - this.startAngle;
            this.totalpart = 30;
             this.partAngle = this.availableAngle / this.totalpart;
             tmp = geometry.distanceAngleToPoint( this.radius, this.startAngle );
            this.startPoint = geometry.pointPlus( this.cpoint, tmp );
             tmp = geometry.distanceAngleToPoint( this.radius, this.endAngle );
            this.endPoint = geometry.pointPlus( this.cpoint, tmp );
             tmp = geometry.distanceAngleToPoint( this.radius, this.endAngle - this.startAngle );
            this.topPoint = geometry.pointPlus( this.cpoint, tmp );
            //this.endPoint = { x: this.cx + tmp.x, y: this.cy + tmp.y };
            //this.endPoint = { x: this.cx + tmp.x, y: this.cy + tmp.y };
             //计算圆环坐标
            this.outpos = [ this.startPoint.x, this.startPoint.y ];
            for( let i = this.startAngle; i <= this.endAngle; i++ ){
                tmp = geometry.distanceAngleToPoint( this.radius, i );
                tmppoint = geometry.pointPlus( this.cpoint, tmp );
                this.outpos.push( tmppoint.x, tmppoint.y );
            }
            for( let i = this.endAngle; i >= this.startAngle; i-- ){
                tmp = geometry.distanceAngleToPoint( this.sradius, i );
                tmppoint = geometry.pointPlus( this.cpoint, tmp );
                this.outpos.push( tmppoint.x, tmppoint.y );
            }
            this.outpos.push( false );
             //计算圆环分隔线
            this.outline = [];
            for( let i = 0; i < this.totalpart; i++ ){
                this.outline.push( [
                    i * this.partAngle
                ]);
            }
             //console.log( this );
         }
        */

    }]);

    return Dount;
}(_vischartbase2.default);

exports.default = Dount;