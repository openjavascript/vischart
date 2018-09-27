
import Konva from 'konva';

import VisChartBase from '../common/vischartbase.js';
import * as geometry from '../geometry/geometry.js';


export default class Dount extends VisChartBase  {
    constructor( canvas ){
        super( canvas );

        this.name = 'Dount ' + Date.now();

        this.outPercent = .50;
        this.inPercent = .37;

        this.iconPercent = .25;

        this.outline = [];

        this.startAngle = 0;
        this.endAngle = 360;
        this.countAngle = this.startAngle;


        this.init();


        console.log( this );
    }

    calcLayoutPosition() {
        console.log( 'calcLayoutPosition', Date.now() );


        this.outRadius = Math.ceil( this.outPercent * this.max / 2 );
        this.inRadius = Math.ceil( this.inPercent * this.max / 2 );

        this.layer = new Konva.Layer();

        this.path = new Konva.Path({
          x: this.cx,
          y: this.cy,
          strokeWidth: 0,
          stroke: '#ff000000',
          data: '',
          fill: 'green'
        });

        // add the shape to the layer
        this.layer.add( this.path);
        this.stage.add(this.layer);

        // add the layer to the stage


        let img = document.querySelector( '#dountInImg' );
        let icon = new Konva.Image( {
            x: this.cx - 107 / 2
            , y: this.cy - 107 / 2
            , image: img
            , width: 107
            , height: 107
        });

        this.iconLayer = new Konva.Layer();
        this.iconLayer.add( icon );

        this.stage.add( this.iconLayer );


        window.requestAnimationFrame( ()=>{ this.tmpfunc() } );
    }

    tmpfunc(){
        let tmp, tmppoint;

        if( this.isDone ) return;

        this.countAngle += 5;

        if( this.countAngle >= this.endAngle ){
            this.countAngle = 361;
            this.isDone = 1;
            console.log( this );
        }
        //this.countAngle = this.endAngle;

        this.outline = [];

        let step = 0.5;

        this.outline.push( 'M' );
        for( let i = 0; i <=  this.countAngle; i+= step  ){
            tmppoint = tmp = geometry.distanceAngleToPoint( this.outRadius, i );
            this.outline.push( [ Math.floor(tmppoint.x), Math.floor(tmppoint.y)].join(',') + ',' );
            if( i == 0 ) this.outline.push( 'L' );
        }
        for( let i = this.countAngle; i >= 0; i-= step ){
            tmppoint = tmp = geometry.distanceAngleToPoint( this.inRadius, i );
            this.outline.push( [ Math.floor(tmppoint.x), Math.floor(tmppoint.y)].join(',') +',' );
        }
        this.outline.push( 'z' );

        //this.path.data = this.outline.join('');
        this.path.setData( this.outline.join('') );
        this.path.draw();
        //this.layer.remove();
        //this.stage.add(this.layer);

        /*
        let img = document.querySelector( '#dountInImg' );
        let ctx = this.canvas.getContext( '2d' );
        ctx.drawImage( 
            img
            , this.width / 2 - img.width / 2
            , this.height / 2 - img.height / 2
        );
        */

        window.requestAnimationFrame( ()=>{ this.tmpfunc() } );
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



}
