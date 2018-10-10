
import VisChartBase from '../common/vischartbase.js';
import * as geometry from '../geometry/geometry.js';

import PointAt from '../common/pointat.js';

import Konva from 'konva';
import ju from 'json-utilsx';

import * as utils from '../common/utils.js';

import IconCircle from '../icon/iconcircle.js';

export default class Dount extends VisChartBase  {
    constructor( box, width, height ){
        super( box, width, height );

        this.name = 'Dount ' + Date.now();

        this.outPercent = .53;
        this.inPercent = .37;

        this.circleLinePercent = .34;
        this.circlePercent = .31;

        this.animationStep = 8;
        this.angleStep = 5;

        this.textHeight = 26;
        this.lineOffset = 42;

        this.path = [];

        this.textOffset = 4;

        this.lineColor = '#24a3ea';

        this.lineRange = {
            "1": []
            , "2": []
            , "4": []
            , "8": []
        };

        this.lineWidth = 45;
        this.lineSpace = 10;
        this.lineAngle = 45;
        this.lineHeight = 20;

        this.loopSort = [ 4, 8, 1, 2 ];

        this.init();
    }

    init(){
        this.calcLayoutPosition();

        return this;
    }

    update( data, allData ){
        super.update( data, allData );

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
        if( this.isDestroy ) return;
        if( this.isDone ) return;
        //this.countAngle = this.totalAngle;

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

    drawCircle(){
        this.circleRadius = Math.ceil( this.circlePercent * this.min / 2 )

        this.circle = new Konva.Circle( {
            x: this.fixCx()
            , y: this.fixCy()
            , radius: this.circleRadius
            , stroke: this.lineColor
            , strokeWidth: 2.5
            , fill: '#ffffff00'
        });
        this.layoutLayer.add( this.circle );
    }

    drawCircleLine(){
        this.circleLineRadius = Math.ceil( this.circleLinePercent * this.min / 2 )

        let points = [];
            points.push( 'M' );
        for( let i = 90; i <= 180; i++ ){
            let tmp = geometry.distanceAngleToPoint( this.circleLineRadius, i );
            points.push( [ tmp.x, tmp.y ] .join(',') + ','  );
            if( i == 90 ){
                points.push( 'L' );
            }
        }
        points.push( 'M');
        for( let i = 270; i <= 360; i++ ){
            let tmp = geometry.distanceAngleToPoint( this.circleLineRadius, i );
            points.push( [ tmp.x, tmp.y ] .join(',') + ','  );
            if( i == 270 ){
                points.push( 'L' );
            }
        }

        this.circleLine = new Konva.Path( {
            data: points.join('')
            , x: this.fixCx()
            , y: this.fixCy()
            , stroke: this.lineColor
            , strokeWidth: 2.5
            , fill: '#ffffff00'
        });

        this.layoutLayer.add( this.circleLine );
    }

    initDataLayout(){
 
        this.layer = [];
        this.path = [];
        this.line = [];


        this.layoutLayer = new Konva.Layer();

        this.drawCircle();
        this.drawCircleLine();

        this.stage.add( this.layoutLayer );

        this.data.data.map( ( val, key ) => {
            let color = this.colors[ key % this.colors.length];

            if( ju.jsonInData( val, 'itemStyle.color' ) ){
                //path.fill( val.itemStyle.color );
                color = val.itemStyle.color;
            }

            let path = new Konva.Path({
              x: this.fixCx(),
              y: this.fixCy(),
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

            let line = new Konva.Line({
              x: this.fixCx(),
              y: this.fixCy(),
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

        this.lineRange = {
            "1": []
            , "2": []
            , "4": []
            , "8": []
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

            val.pointDirection = new PointAt( this.fixWidth(), this.fixHeight(), geometry.pointPlus( val.textPoint, this.cpoint) );
            let lineAngle = val.pointDirection.autoAngle();
            val.lineExpend = ju.clone( val.lineEnd )

            switch( lineAngle ){
                case 1:
                case 8: {
                    //val.lineEnd.x = this.lineLeft;
                    val.lineEnd.x = -( this.outRadius + this.lineSpace );
                    val.lineExpend.x = val.lineEnd.x - this.lineWidth
                    break;
                }
                default: {
                    val.lineEnd.x = this.outRadius + this.lineSpace;
                    val.lineExpend.x = val.lineEnd.x + this.lineWidth
                    break;
                }
            }

            this.lineRange[ lineAngle ].push( val );
        })

        this.loopSort.map( key => {
            let item = this.lineRange[ key ];
            if( !( item && item.length && item.length > 1 ) ) return;
            let needFix;
            for( let i = 1; i < item.length; i++ ){
                let pre = item[ i - 1], cur = item[ i ];
                //console.log( pre.lineEnd.y, cur.lineEnd.y );
                if( Math.abs( cur.lineEnd.y - pre.lineEnd.y ) < this.lineHeight ){
                    /*
                    cur.lineEnd.y = pre.lineEnd.y + this.lineHeight;
                    cur.lineExpend.y = cur.lineEnd.y;
                    */
                    needFix = 1;
                    break;
                }
            }
            switch( key ){
                case 1: {
                    let tmpY = item[ 0 ].lineEnd.y;
                    for( let i = 1; i < item.length; i++ ){
                        let pre = item[ i - 1], cur = item[ i ], zero = item[0];
                        tmpY -= this.lineHeight;
                        cur.lineEnd.y = tmpY;

                        if( cur.lineEnd.y < cur.lineStart.y ){
                            //tmpY = cur.lineStart.y + this.lineHeight;
                            //cur.lineEnd.y = tmpY;
                        }
                        cur.lineExpend.y = tmpY;
                    }
                    break;
                }
                case 2: {
                    let tmpY = item[ 0 ].lineEnd.y;
                    for( let i = 1; i < item.length; i++ ){
                        let pre = item[ i - 1], cur = item[ i ], zero = item[0];
                        tmpY += this.lineHeight;
                        cur.lineEnd.y = tmpY;

                        if( cur.lineEnd.y < cur.lineStart.y ){
                            //tmpY = cur.lineStart.y + this.lineHeight;
                            //cur.lineEnd.y = tmpY;
                        }
                        cur.lineExpend.y = tmpY;
                    }

                    break;
                }
                case 4: {
                    let tmpY = item[ 0 ].lineEnd.y;
                    for( let i = 1; i < item.length; i++ ){
                        let pre = item[ i - 1], cur = item[ i ], zero = item[0];
                        tmpY += this.lineHeight;
                        cur.lineEnd.y = tmpY;

                        if( cur.lineEnd.y < cur.lineStart.y ){
                            tmpY = cur.lineStart.y + this.lineHeight;
                            cur.lineEnd.y = tmpY;
                        }
                        cur.lineExpend.y = tmpY;
                    }
                    break;
                }
                case 8: {
                    let tmpY = item[ item.length - 1].lineEnd.y;
                    for( let i = item.length - 2; i > 0; i-- ){
                        let pre = item[ i + 1], cur = item[ i ];
                        tmpY += this.lineHeight;
                        cur.lineEnd.y = tmpY;

                        if( cur.lineEnd.y < cur.lineStart.y ){
                            cur.lineEnd.y = cur.lineStart.y + this.lineHeight;
                        }
                        cur.lineExpend.y = cur.lineEnd.y;
                    }

                    break;
                }
            }
        });
    }

    animationLine(){

        if( this.lineLengthCount >= this.lineLength ){
            return;
        }
        this.lineLengthCount = this.lineLength;
        
        this.lineLengthCount += this.lineLengthStep;

        if( this.lineLengthCount >= this.lineLength ){
            this.lineLengthCount = this.lineLength;
        }

        for( let i = 0; i < this.path.length; i++ ){
            let path = this.path[i];
            let layer = this.layer[ i ];

            //console.log( path, path.itemData.pointDirection.auto(), path.itemData.pointDirection.autoAngle()  );

            //let lineEnd = geometry.distanceAngleToPoint( this.outRadius + this.lineLengthCount, path.itemData.midAngle );
            let lineEnd = path.itemData.lineEnd;
            let lineExpend = path.itemData.lineExpend;

            let line = this.line[ i ];
            line.points( [ 
                path.itemData.lineStart.x, path.itemData.lineStart.y
                , lineEnd.x, lineEnd.y 
                , lineExpend.x,lineExpend.y 
            ] );

            if( this.lineLengthCount >= this.lineLength ){

                /*
                */
                this.addText( path, layer );
                this.addIcon( path, layer );

            }else{
                window.requestAnimationFrame( ()=>{ this.animationLine() } );
            }

            this.stage.add( layer );
        }
    }

    addIcon( path, layer ){
        let icon = new IconCircle( this.box, this.fixWidth(), this.fixHeight() );
        icon.setOptions( {
            stage: this.stage
            , layer: layer
            , cx: this.fixCx()
            , cy: this.fixCy()
        });
        icon.update( path.itemData.lineExpend );
    }

    addText( path, layer ){
        let text = new Konva.Text( {
            x: 0
            , y: 0
            , text: `${path.itemData.percent}%`
            , fill: '#a3a7f3'
            , fontFamily: 'MicrosoftYaHei'
            , fontSize: 16
            , fontStyle: 'italic'
        });

        let textPoint = path.itemData.textPoint
            , angleDirect = path.itemData.pointDirection.autoAngle()
            ;

        textPoint = ju.clone( path.itemData.lineEnd );
        textPoint.y -= text.textHeight + 2;

        switch( angleDirect ){
            case 1: {
                textPoint.x -= text.textWidth
                break;
            }
            case 2: {
                break;
            }
            case 4: {
                break;
            }
            case 8: {
                textPoint.x -= text.textWidth
                break;
            }
        }

        let textX =  this.fixCx() + textPoint.x
            , textY =  this.fixCy() + textPoint.y
            , direct = path.itemData.pointDirection.auto()
            ;

        text.x( textX );
        text.y( textY );
        layer.add( text );
    }

    calcLayoutPosition() {
        //console.log( 'calcLayoutPosition', Date.now() );

        this.outRadius = Math.ceil( this.outPercent * this.min / 2 );
        this.inRadius = Math.ceil( this.inPercent * this.min / 2 );

        this.lineLength = ( Math.min( this.fixWidth(), this.fixHeight() ) - this.outRadius * 2 ) / 2 - this.lineOffset ;
        this.lineLengthCount = 1;
        this.lineLengthStep = .5;

        this.lineLeft = this.fixCx() - this.outRadius - this.lineSpace;
        this.lineRight = this.fixCx() + this.outRadius + this.lineSpace;

        return this;
    }

    destroy(){
        super.destroy();
        this.layoutLayer.remove();
        this.layer.map( item => {
            item.remove();
        });
        console.log( 'destroy', Date.now() );
    }
}
