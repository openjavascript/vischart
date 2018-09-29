
import VisChartBase from '../common/vischartbase.js';
import * as geometry from '../geometry/geometry.js';

import PointAt from '../common/pointat.js';

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
        this.lineOffset = 40;

        this.path = [];

        this.textOffset = 4;

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
            window.requestAnimationFrame( ()=>{ this.animationLine() } );
        }
    }

    initDataLayout(){
 
        this.layer = [];
        this.path = [];
        this.line = [];

        this.data.data.map( ( val, key ) => {
            let color = this.colors[ key % this.colors.length];

            if( ju.jsonInData( val, 'itemStyle.color' ) ){
                //path.fill( val.itemStyle.color );
                color = val.itemStyle.color;
            }

            let path = new Konva.Path({
              x: this.cx,
              y: this.cy,
              strokeWidth: 1,
              stroke: color,
              data: '',
              fill: color
            });

            /*
            console.log( 
                key % this.colors.length
                , this.colors[ key % this.colors.length] 
            );
            */
                
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

            let line = new Konva.Line({
              x: this.cx,
              y: this.cy,
              points: [ 0, 0, 0, 0 ],
              stroke: '#ffffff',
              strokeWidth: 2
            });
            this.line.push( line );


            let layer = new Konva.Layer();
            layer.add( path );
            layer.add( line );

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

            val.percent = parseInt( val._percent * 100 );

            val.endAngle = this.totalAngle * val._totalPercent;
        });

        //修正浮点数精确度
        if( this.data.data.length ){
            let item = this.data.data[ this.data.data.length - 1];
            tmp = tmp - item._percent;

            item._percent = 1 - tmp;
            item.percent = parseInt( item._percent * 100 );
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

            val.textPoint = geometry.distanceAngleToPoint( this.outRadius + this.lineLength, val.midAngle );

            val.pointDirection = new PointAt( this.width, this.height, geometry.pointPlus( val.textPoint, this.cpoint) );

        })
    }

    animationLine(){

        if( this.lineLengthCount >= this.lineLength ){
            return;
        }
        
        this.lineLengthCount += this.lineLengthStep;

        if( this.lineLengthCount >= this.lineLength ){
            this.lineLengthCount = this.lineLength;
        }

        for( let i = 0; i < this.path.length; i++ ){
            let path = this.path[i];
            let layer = this.layer[ i ];

            let lineEnd = geometry.distanceAngleToPoint( this.outRadius + this.lineLengthCount, path.itemData.midAngle );

            let line = this.line[ i ];
            line.points( [ path.itemData.lineStart.x, path.itemData.lineStart.y, lineEnd.x, lineEnd.y ] );

            if( this.lineLengthCount >= this.lineLength ){

                this.addIcon( path, layer );
                this.addText( path, layer );

            }else{
                window.requestAnimationFrame( ()=>{ this.animationLine() } );
            }

            this.stage.add( layer );
        }
    }

    addIcon( path, layer ){
        let icon = new IconRound( this.box, this.width, this.height );
        icon.setOptions( {
            stage: this.stage
            , layer: layer
        });
        icon.update( path.itemData.lineEnd );
    }

    addText( path, layer ){
        let text = new Konva.Text( {
            x: 0
            , y: 0
            , text: `${path.itemData.percent}%`
            , fill: '#a3a7f3'
            , fontFamily: 'HuXiaoBoKuHei'
            , fontSize: 31
        });
        let textX =  this.cx + path.itemData.textPoint.x
            , textY =  this.cy + path.itemData.textPoint.y
            , direct = path.itemData.pointDirection.auto()
            ;

        //console.log( 'direct', direct );
        switch( direct ){
            case PointAt.DIRE_NAME.leftTop: {
                textY -= text.textHeight + this.textOffset;
                textX -= text.textWidth / 2;
                break;
            }
            case PointAt.DIRE_NAME.rightTop: {
                textY -= text.textHeight + this.textOffset;
                break;
            }
            case PointAt.DIRE_NAME.topCenter: {
                textY -= text.textHeight + this.textOffset;
                textX -= text.textWidth / 2;
                break;
            }
            case PointAt.DIRE_NAME.bottomCenter: {
                textX -= text.textWidth / 2;
                break;
            }
            case PointAt.DIRE_NAME.rightMid: {
                if( ( textX + text.textWidth ) >= this.width ){
                    textX = this.width - text.textWidth - 5;
                }
                break;
            }
            case PointAt.DIRE_NAME.rightBottom: {
                break;
            }
            case PointAt.DIRE_NAME.leftBottom: {
                textX -= text.textWidth / 2;
                break;
            }
            case PointAt.DIRE_NAME.leftMid: {
                textX -= text.textWidth; 
                if( textX < 1 ) textX = 1;
                textY += this.textOffset;
                break;
            }

        }

        text.x( textX );
        text.y( textY );
        layer.add( text );
    }

    calcLayoutPosition() {
        //console.log( 'calcLayoutPosition', Date.now() );

        this.outRadius = Math.ceil( this.outPercent * this.max / 2 );
        this.inRadius = Math.ceil( this.inPercent * this.max / 2 );

        this.lineLength = ( Math.min( this.width, this.height ) - this.outRadius * 2 ) / 2 - this.lineOffset ;
        this.lineLengthCount = 1;
        this.lineLengthStep = .5;


        return this;
    }
}
