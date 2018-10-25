
import VisChartBase from '../common/konvabase.js';
import * as geometry from '../../geometry/geometry.js';

import PointAt from '../../common/pointat.js';

import Konva from 'konva';
import ju from 'json-utilsx';

import * as utils from '../../common/utils.js';

import IconCircle from '../icon/iconcircle.js';

export default class Dount extends VisChartBase  {
    constructor( box, width, height ){
        super( box, width, height );
        this.name = 'Dount_' + Date.now();

        this._setSize( width, height );
    }

    _setSize( width, height ){
        super._setSize( width, height );

        this.outPercent = .53;
        this.inPercent = .37;

        this.circleLinePercent = .34;
        this.circlePercent = .31;
        this.circleLineRotation = 0;
        this.circleLineRotationStep = 4;

        this.animationStep = 8;
        this.angleStep = 5;

        this.textHeight = 26;
        this.lineOffset = 50;

        this.path = [];
        this.line = [];

        this.textOffset = 4;

        this.lineColor = '#24a3ea';

        this.lineRange = {
            "1": []
            , "2": []
            , "4": []
            , "8": []
        };

        this.lineWidth = 40;
        this.lineSpace = 10;
        this.lineAngle = 35;
        this.lineHeight = 21;
        this.lineCurveLength = 30;

        this.loopSort = [ 4, 8, 1, 2 ];

        this.clearList = [];


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

        this.countAngle = 0;
        this.isDone = 0;
        this.lineLengthCount = 0;

        if( !ju.jsonInData( this.data, 'data' ) ) return;

        this.clearItems();
        this.calcVal();
        this.initText();
        this.calcDataPosition();
        this.initDataLayout();

        //console.log( 'dount update', this.data, this, utils );

        this.animation();
        !this.inited && this.animationCircleLine();

        this.inited = 1;

        return this;
    }

    reset(){
        this.path.map( ( val ) => {
            val.pathData = [];
        });
    }

    animationCircleLine(){
        if( this.isDestroy ) return;
        if( !this.circleLine ) return;

        if( !this.isAnimation() ){
            return;
        }
        
        this.circleLineRotation += this.circleLineRotationStep; 

        this.circleLine.rotation( this.circleLineRotation );
        this.stage.add( this.layoutLayer );
        this.layoutLayer.moveToBottom();

        window.requestAnimationFrame( ()=>{ this.animationCircleLine() } );
    }

    animation(){
        if( this.isDestroy ) return;
        if( this.isDone ) return;

        let tmp, tmppoint, step = this.angleStep;

        this.countAngle += this.animationStep;

        if( !this.isSeriesAnimation() ){
            this.countAngle = this.totalAngle;
        }

        if( this.countAngle >= this.totalAngle || !this.isAnimation() ){
            this.countAngle = this.totalAngle;
            this.isDone = 1;
        }

        this.reset();
       
        for( let i = this.path.length - 1; i >= 0; i-- ){
        //for( let i = 0; i < this.path.length; i++ ){
            //let i = 2;
            let item = this.path[ i ];

            //console.log( i, item, item.itemData.endAngle, item.itemData.value );

            let tmpAngle = this.countAngle;

            if( tmpAngle >= item.itemData.endAngle ){
                tmpAngle = item.itemData.endAngle;
            }

            if( tmpAngle < item.itemData.startAngle ) continue;

            item.arc.angle( tmpAngle );
        }
        this.stage.add( this.arcLayer );

        //this.animation();

        window.requestAnimationFrame( ()=>{ this.animation() } );

        if( this.isDone ){
            // window.requestAnimationFrame( ()=>{ this.animationLine() } );
            this.animationLine();
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
        this.addDestroy( this.circle );
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
        this.addDestroy( this.circleLine );

        this.layoutLayer.add( this.circleLine );
    }

    initDataLayout(){
        if( !this.inited ){
            this.layoutLayer = new Konva.Layer();
            this.addDestroy( this.layoutLayer );

            this.drawCircle();
            this.drawCircleLine();

            this.stage.add( this.layoutLayer );
            this.layoutLayer.moveToBottom();

            this.arcLayer = new Konva.Layer();
            this.addDestroy( this.arcLayer );

            this.tooltipLayer = new Konva.Layer();
            this.addDestroy( this.tooltipLayer );

            this.group = new Konva.Group({
                visible: false
            });
            this.addDestroy( this.group );

        }

        this.path = [];
        this.line = [];

        for( let ii = this.data.data.length - 1; ii >= 0; ii-- ){
            let val = this.data.data[ii], key = ii;

            let color = this.colors[ key % this.colors.length];

            if( ju.jsonInData( val, 'itemStyle.color' ) ){
                //path.fill( val.itemStyle.color );
                color = val.itemStyle.color;
            }

            let params = {
                x: this.fixCx()
                , y: this.fixCy()
                , innerRadius: this.inRadius
                , outerRadius: this.outRadius
                , angle: this.countAngle
                , fill: color
                , stroke: color
                , strokeWidth: 0,
                //, rotation: this.arcOffset
            };

            let arc = new Konva.Arc( params );

            this.clearList.push( arc );
            //this.drawTooltipMove( arc,val );

            let line = new Konva.Line({
              x: this.fixCx(),
              y: this.fixCy(),
              points: [ 0, 0, 0, 0 ],
              stroke: '#ffffff',
              strokeWidth: 2
            });

            this.line.push( line );
            this.clearList.push( line );

            let tmp = { 
                arc: arc
                , pathData: [] 
                , itemData: val
                , line: line
                , realIndex: ii
            };

            this.path.push( tmp );

            this.arcLayer.add( line );
            this.arcLayer.add( arc );
        };
        
        this.stage.add( this.arcLayer );

        return this;
    }
    //创建tooltip层
    drawTooltip(){
        let tooltip = new Konva.Text({
            fontFamily: "Calibri",
            fontSize: 12,
            textFill: "#fff",
            fill: "#fff",
            visible: false
        });
        let tooltipBg = new Konva.Tag({
            width: 200,     
            height: 45,
            fill: '#000',
            opacity: 0.5,
            lineJoin: 'round',
            cornerRadius: 5,
            visible: false
        });
        tooltip.lineHeight(1.5);

        this.tooltipLayer.add( tooltipBg, tooltip );

        // this.tooltipLayer.add(this.group);
        this.stage.add( this.tooltipLayer );

        let tooltipCon = {
            tooltip: tooltip,
            tooltipBg: tooltipBg
        }
        return tooltipCon
    }
    //创建tooltip移动层动画
    drawTooltipMove(arc,val){
        let tooltip = this.drawTooltip().tooltip;
        let tooltipBg = this.drawTooltip().tooltipBg;
        let self = this;
        //添加鼠标事件
        arc.on('mousemove', function() {
            let mousePos = self.stage.getPointerPosition();
            tooltip.setZIndex(9);
            tooltipBg.setZIndex(8);
            tooltipBg.position({
                x : mousePos.x,
                y : mousePos.y
            });
            tooltip.position({
                x : mousePos.x + 5,
                y : mousePos.y + 5
            });
            let textLabel = `访问来源\n ${val.name}: ${val.value}(${val.percent}%)`;
            tooltip.text(textLabel);
            // self.group.show();
            tooltipBg.show();
            tooltip.show();
            
            self.tooltipLayer.setZIndex(10);
            self.tooltipLayer.batchDraw();
        });
        arc.on('mouseout', function() {
            tooltip.setZIndex(9);
            tooltipBg.setZIndex(8);
            // self.group.hide();
            tooltipBg.hide();
            tooltip.hide();
            self.tooltipLayer.setZIndex(10);
            self.tooltipLayer.draw();
        });
    }

    animationLine(){

        if( this.lineLengthCount >= this.lineLength ){
            return;
        }
        this.lineLengthCount = this.lineLength;

        this.lineLengthCount += this.lineLengthStep;

        if( this.lineLengthCount >= this.lineLength || !this.isAnimation()  ){
            this.lineLengthCount = this.lineLength;
        }
        for( let i = 0; i < this.path.length; i++ ){
            let path = this.path[i];
            let layer = this.arcLayer;

            let lineEnd = path.itemData.lineEnd;
            let lineExpend = path.itemData.lineExpend;

            let line = this.line[ i ];
            line.points( [ 
                path.itemData.lineStart.x, path.itemData.lineStart.y
                , lineEnd.x, lineEnd.y 
                , lineExpend.x,lineExpend.y 
            ] );
            this.arcLayer.add( line );

            if( this.lineLengthCount >= this.lineLength ){
                this.addText( path, layer, path.realIndex );
                this.addIcon( path, layer, path.realIndex );

            }else{
                window.requestAnimationFrame( ()=>{ this.animationLine() } );
            }
            
            this.stage.add( layer );
        }
    }

    addIcon( path, layer, key ){
        if( !path.lineicon ){
            path.lineicon = new IconCircle( this.box, this.fixWidth(), this.fixHeight() );
            this.clearList.push( path.lineicon );
        }
        //console.log( path );
        let icon = path.lineicon;
        icon.setOptions( {
            stage: this.stage
            , layer: layer
            , cx: this.fixCx()
            , cy: this.fixCy()
        });
        icon.update( path.itemData.lineExpend );
    }

    addText( path, layer, key ){
        if( !path.text ){
            path.text = this.textar[key];
        }
        let text = path.text;

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
        this.clearItems();
        super.destroy();
    }

    clearItems(){
        this.clearList.map( item => {
            item.remove();
            item.destroy();
        });
        this.clearList = [];
    }

    initText(){
        this.textar = [];

        this.data.data.map( ( val, key ) => {
            let tmp = new Konva.Text( {
                x: 0
                , y: 0
                , text: `${val.percent}%`
                , fill: '#a3a7f3'
                , fontFamily: 'MicrosoftYaHei'
                , fontSize: 16
                , fontStyle: 'italic'
            });
            this.clearList.push( tmp );
            this.textar.push( tmp );
        });
    }

    calcVal(){
        if( !this.data ) return;

        let total = 0, tmp = 0;

        this.data.data.map( ( val ) => {
            //console.log( val );
            total += val.value;
        });
        this.total = total;

        this.data.data.map( ( val ) => {
            val._percent =  utils.parseFinance( val.value / total, 8 );
            tmp = utils.parseFinance( tmp + val._percent );
            val._totalPercent = tmp;

            val.percent = parseInt( val._percent * 100 * this.getPrecision( val ) ) / this.getPrecision( val );

            val.endAngle = this.totalAngle * val._totalPercent;
        });

        //修正浮点数精确度
        if( this.data.data.length ){
            let item = this.data.data[ this.data.data.length - 1];
            tmp = tmp - item._percent;

            item._percent = 1 - tmp;
            item.percent = parseInt( item._percent * 100 * this.getPrecision( item ) ) / this.getPrecision( item );
            item._totalPercent = 1;
            item.endAngle = this.totalAngle;
        }

    }


    calcDataPosition() {
        if( !this.data ) return;

        this.lineRange = {
            "1": []
            , "2": []
            , "4": []
            , "8": []
        }
        //console.log( '' );
        //计算开始角度, 计算指示线的2端
        this.data.data.map( ( val, key ) => {
            if( !key ) {
                val.startAngle = 0;
            }else{
                val.startAngle = this.data.data[ key - 1].endAngle;
            }

            let text = this.textar[ key ];
            let textWidth = this.lineWidth;

            if( text.width() >= textWidth ){
                textWidth = text.width() + 5;
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

                    let tmp = geometry.pointDistance( val.lineStart, val.lineEnd );
                    if( tmp > this.lineCurveLength ){
                        let tmpAngle = geometry.pointAngle( val.lineStart, val.lineEnd )
                            , tmpPoint = geometry.distanceAngleToPoint( this.lineCurveLength, tmpAngle )
                            ;
                            tmpPoint = geometry.pointPlus( tmpPoint, val.lineStart );

                        val.lineEnd.x = tmpPoint.x;
                    }

                    val.lineExpend.x = val.lineEnd.x - textWidth;

                    break;
                }
                default: {
                    val.lineEnd.x = this.outRadius + this.lineSpace;
                    let tmp = geometry.pointDistance( val.lineStart, val.lineEnd );
                    if( tmp > this.lineCurveLength ){
                        let tmpAngle = geometry.pointAngle( val.lineStart, val.lineEnd )
                            , tmpPoint = geometry.distanceAngleToPoint( this.lineCurveLength, tmpAngle )
                            ;
                            tmpPoint = geometry.pointPlus( tmpPoint, val.lineStart );

                        val.lineEnd.x = tmpPoint.x;
                    }

                    val.lineExpend.x = val.lineEnd.x + textWidth;
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
                if( Math.abs( cur.lineEnd.y - pre.lineEnd.y ) < this.lineHeight ){
                    needFix = 1;
                    break;
                }
            }
            switch( key ){
                case 1: {
                    let tmpY = item[ 0 ].lineEnd.y;
                    //console.log( item );
                    for( let i = item.length - 2; i >= 0; i-- ){
                        let pre = item[ i + 1], cur = item[ i ];
                        if( Math.abs( pre.lineEnd.y - cur.lineEnd.y ) < this.lineHeight || cur.lineEnd.y <= pre.lineEnd.y ){
                            tmpY = pre.lineEnd.y + this.lineHeight;
                            cur.lineEnd.y = tmpY;

                            /*
                            if( cur.lineEnd.y < cur.lineStart.y ){
                                //tmpY = cur.lineStart.y + this.lineHeight;
                                //cur.lineEnd.y = tmpY;
                            }
                            */
                            cur.lineExpend.y = tmpY;
                        }
                    }
                    break;
                }
                case 2: {
                    let tmpY = item[ 0 ].lineEnd.y;
                    for( let i = 1; i < item.length; i++ ){
                        let pre = item[ i - 1], cur = item[ i ], zero = item[0];

                        if( Math.abs( pre.lineEnd.y + this.fixCy() ) < this.lineHeight ){
                            pre.lineExpend.y = pre.lineEnd.y =  pre.lineExpend.y + this.lineHeight;
                        }
                        if( Math.abs( pre.lineEnd.y - cur.lineEnd.y ) < this.lineHeight   || cur.lineEnd.y <= pre.lineEnd.y  ){

                            tmpY = pre.lineEnd.y + this.lineHeight;
                            cur.lineEnd.y = tmpY;

                            /*
                            if( cur.lineEnd.y < cur.lineStart.y ){
                                //tmpY = cur.lineStart.y + this.lineHeight;
                                //cur.lineEnd.y = tmpY;
                            }
                            */
                            cur.lineExpend.y = tmpY;
                        }
                    }

                    break;
                }
                case 4: {
                    let tmpY = 0;
                    for( let i = item.length - 2; i >= 0 ; i-- ){
                        let pre = item[ i + 1], cur = item[ i ];
                        if( Math.abs( pre.lineEnd.y - cur.lineEnd.y ) < this.lineHeight || cur.lineEnd.y >= pre.lineEnd.y ){
                            //console.log( pre.lineEnd.y, cur.lineEnd.y );
                            tmpY = pre.lineEnd.y - this.lineHeight;
                            cur.lineEnd.y = tmpY;
                            cur.lineExpend.y = tmpY;
                        }
                    }
                    break;
                }
                case 8: {
                    let tmpY = 0;
                    for( let i = 1; i < item.length ; i++ ){
                        let pre = item[ i - 1], cur = item[ i ];
                        if( Math.abs( pre.lineEnd.y - cur.lineEnd.y ) < this.lineHeight  || cur.lineEnd.y >= pre.lineEnd.y ){
                            tmpY = pre.lineEnd.y - this.lineHeight;
                            cur.lineEnd.y = tmpY;

                            /*
                            if( cur.lineEnd.y < cur.lineStart.y ){
                                //cur.lineEnd.y = cur.lineStart.y + this.lineHeight;
                            }
                            */
                            cur.lineExpend.y = cur.lineEnd.y;
                        }
                    }

                    break;
                }
            }
        });
    }

}
