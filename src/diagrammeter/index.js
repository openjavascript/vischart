
import Two from 'two.js';

import * as geometry from '../geometry/geometry.js';


export default class DiagramMeter {
    constructor( canvas, width = 400, height = 400 ){

        this.name = 'DiagramMeter ' + Date.now();

        this.canvas = canvas;
        this.width = width;
        this.height = height;

        this.initPosition();

        this.init();
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

        console.log( this );

    }

    init(){
        if( !this.canvas ) return;
        this.two = new Two({
          type: Two.Types.canvas,
          width: this.width,
          height: this.height,
          domElement: this.canvas
        });

        this.drawDemo();
        this.draw();
    }

    draw(){

        console.log( this );
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


}
