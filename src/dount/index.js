
import VisChartBase from '../common/vischartbase.js';
import * as geometry from '../geometry/geometry.js';

import Konva from 'konva';
import ju from 'json-utilsx';

import * as utils from '../common/utils.js';

import IconRound from '../icon/round.js';


export default class Dount extends VisChartBase  {
    constructor( box, width, height ){
        super( box, width, height );

        this.name = 'Dount ' + Date.now();

        this.outPercent = .53;
        this.inPercent = .37;

        this.animationStep = 8;
        this.angleStep = 5;

        this.textHeight = 26;
        this.lineOffset = 30;

        this.path = [];

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

        let tmp, tmppoint, step = this.angleStep;

        this.countAngle += this.animationStep;
        //this.countAngle += 350;

        if( this.countAngle >= this.totalAngle ){
            this.countAngle = this.totalAngle;
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

        if( this.isDone ){
            this.animationLine();
        }
    }

    initDataLayout(){
 
        this.layer = [];
        this.path = [];
        this.line = [];

        this.data.data.map( ( val, key ) => {
            let path = new Konva.Path({
              x: this.cx,
              y: this.cy,
              strokeWidth: 0,
              stroke: '#ff000000',
              data: '',
              fill: this.colors[ key % this.colors.length]
            });

            /*
            console.log( 
                key % this.colors.length
                , this.colors[ key % this.colors.length] 
            );
            */

            if( ju.jsonInData( val, 'itemStyle.color' ) ){
                path.fill( val.itemStyle.color );
            }
                
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
        //计算开始角度, 计算指示线的2端
        this.data.data.map( ( val, key ) => {
            if( !key ) {
                val.startAngle = 0;
            }else{
                val.startAngle = this.data.data[ key - 1].endAngle;
            }

            val.midAngle = val.startAngle + ( val.endAngle - val.startAngle ) / 2;

            val.lineStart = geometry.distanceAngleToPoint( this.outRadius, val.midAngle );
            val.lineEnd = geometry.distanceAngleToPoint( this.outRadius + this.lineLength, val.midAngle );
        })
    }

    animationLine(){
        console.log( 'animationLine', Date.now() );

        for( let i = 0; i < this.path.length; i++ ){
            let path = this.path[i];
            let layer = this.layer[ i ];
            let line = new Konva.Line({
              x: this.cx,
              y: this.cy,
              points: [ path.itemData.lineStart.x, path.itemData.lineStart.y, path.itemData.lineEnd.x, path.itemData.lineEnd.y ],
              stroke: '#ffffff',
              strokeWidth: 2
            });


            layer.add( line );

            let icon = new IconRound( this.box, this.width, this.height );
            icon.setOptions( {
                stage: this.stage
                , layer: layer
            });
            icon.update( path.itemData.lineEnd );

            this.stage.add( layer );
        }
    }

    calcLayoutPosition() {
        //console.log( 'calcLayoutPosition', Date.now() );

        this.outRadius = Math.ceil( this.outPercent * this.max / 2 );
        this.inRadius = Math.ceil( this.inPercent * this.max / 2 );

        this.lineLength = ( Math.min( this.width, this.height ) - this.outRadius * 2 ) / 2 - this.lineOffset ;


        return this;
    }
}
