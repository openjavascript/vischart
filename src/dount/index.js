
import VisChartBase from '../common/vischartbase.js';
import * as geometry from '../geometry/geometry.js';

import Konva from 'konva';
import ju from 'json-utilsx';

import * as utils from '../common/utils.js';


export default class Dount extends VisChartBase  {
    constructor( box, width, height ){
        super( box, width, height );

        this.name = 'Dount ' + Date.now();

        this.outPercent = .50;
        this.inPercent = .37;

        this.path = [];

        this.colors = [
            '#f12575'
            , '#da432e'
            , '#f3a42d'
            , '#19af89'
            , '#24a3ea'
            , '#b56be8'
        ];

        this.init();
    }

    init(){
        this.calcLayoutPosition();

        return this;
    }

    update( data, allData ){
        this.data = data;
        this.allData = allData;

        if( !ju.jsonInData( this.data, 'data' ) ) return;

        this.calcDataPosition();
        this.initDataLayout();

        console.log( 'dount update', this.data, this, utils );

        this.animation();

        return this;
    }

    reset(){
        this.path.map( ( val ) => {
            val.pathData = [];
        });
    }

    animation(){
        if( this.isDone ) return;

        let tmp, tmppoint, step = 3;

        this.countAngle += 8;
        //this.countAngle += 350;

        if( this.countAngle >= this.totalAngle ){
            this.countAngle = 360;
            this.isDone = 1;
        }

        this.reset();

        for( let i = this.path.length - 1; i >= 0; i-- ){
        //for( let i = 0; i < this.path.length; i++ ){
            //let i = 2;
            let item = this.path[ i ];

            //console.log( i, item );

            let tmpAngle = this.countAngle;

            if( tmpAngle >= item.itemData.endAngle ){
                tmpAngle = item.itemData.endAngle;
            }

            if( tmpAngle < item.itemData.startAngle ) continue;

            item.pathData.push( 'M' );
            for( let i = item.itemData.startAngle; ; i+= step  ){
                if( i >= tmpAngle ) i = tmpAngle;

                tmppoint = tmp = geometry.distanceAngleToPoint( this.outRadius, i );
                item.pathData.push( [ (tmppoint.x), (tmppoint.y)].join(',') + ',' );
                if( i == item.itemData.startAngle ) item.pathData.push( 'L' );

                if( i >= tmpAngle ) break;
            }
            for( let i = tmpAngle; ; i-= step ){
                if( i <= item.itemData.startAngle ) i = item.itemData.startAngle;

                tmppoint = tmp = geometry.distanceAngleToPoint( this.inRadius, i );
                item.pathData.push( [ (tmppoint.x), (tmppoint.y)].join(',') +',' );
                if( i == item.itemData.startAngle ) break;
            }

            item.pathData.push( 'z' );

            item.path.setData( item.pathData.join('') );
        }
        this.layer.map( ( val, key )=>{
            this.stage.add( val );
            val.setZIndex(  this.layer.length - key );
        });

        window.requestAnimationFrame( ()=>{ this.animation() } );
    }

    initDataLayout(){
 
        this.layer = [];
        this.path = [];

        this.data.data.map( ( val, key ) => {
            let path = new Konva.Path({
              x: this.cx,
              y: this.cy,
              strokeWidth: 0,
              stroke: '#ff000000',
              data: '',
              fill: this.colors[ key % this.colors.length]
            });

            console.log( 
                key % this.colors.length
                , this.colors[ key % this.colors.length] 
            );
                
            let tmp = { 
                path: path
                , pathData: [] 
                , itemData: val
            };

            this.path.push( tmp );

            path.on( 'mouseenter', (evt)=>{
                //console.log( 'path mouseenter', Date.now() );
            });

            path.on( 'mouseleave', ()=>{
                //console.log( 'path mouseleave', Date.now() );
            });

            let layer = new Konva.Layer();
            layer.add( path );

            this.layer.push( layer );
        });
        this.layer.map( ( val, key ) => {
            this.stage.add( val );
        });

        /*
        window.requestAnimationFrame( ()=>{ this.tmpfunc() } );
        */
       

        return this;
    }

    calcDataPosition() {
        if( !this.data ) return;

        let total = 0, tmp = 0;

        this.data.data.map( ( val ) => {
            total += val.value;
        });
        this.total = total;

        this.data.data.map( ( val ) => {
            val._percent =  utils.parseFinance( val.value / total );
            tmp = utils.parseFinance( tmp + val._percent );
            val._totalPercent = tmp;

            val.endAngle = this.totalAngle * val._totalPercent;
        });

        //修正浮点数精确度
        if( this.data.data.length ){
            let item = this.data.data[ this.data.data.length - 1];
            tmp = tmp - item._percent;

            item._percent = 1 - tmp;
            item._totalPercent = 1;
            item.endAngle = this.totalAngle;
        }
        //计算开始角度
        this.data.data.map( ( val, key ) => {
            if( !key ) {
                val.startAngle = 0;
                return;
            }
            val.startAngle = this.data.data[ key - 1].endAngle;
        })
    }

    calcLayoutPosition() {
        //console.log( 'calcLayoutPosition', Date.now() );

        this.outRadius = Math.ceil( this.outPercent * this.max / 2 );
        this.inRadius = Math.ceil( this.inPercent * this.max / 2 );

        return this;
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
