
import VisChartBase from '../common/vischartbase.js';
import * as geometry from '../geometry/geometry.js';

import PointAt from '../common/pointat.js';

import Konva from 'konva';
import ju from 'json-utilsx';

import * as utils from '../common/utils.js';

import IconRound from '../icon/iconround.js';
import RoundStateText from '../icon/roundstatetext.js';


export default class Gauge extends VisChartBase  {
    constructor( box, width, height ){
        super( box, width, height );

        this.name = 'Gauge' + Date.now();

        this.curRate = 0;
        this.totalNum = 0;
        this.totalNumStep = 5;

        this.roundRadiusPercent = .085;

        this.lineColor = '#596ea7';

        this.circleLinePercent = .26;
        this.circlePercent = .28;

        this.arcLinePercent = .39 / 2;

        this.arcOutPercent = .38 / 2;
        this.arcInPercent = .305 / 2;

        this.arcLabelLength = 6;
        this.arcTextLength = 20;

        this.arcAngle = 280;
        this.part = 22;
        this.arcTotal = 1100;

        this.textOffset = 0;

        this.arcOffset = 90 + ( 360 - this.arcAngle ) / 2;
        this.arcOffsetPad = -5;
        this.partLabel = this.part / 2;
        this.partAngle = ( this.arcAngle ) / this.part;
        this.partNum = this.arcTotal / this.part;

        this.textOffsetX = -1;
        this.textOffsetY = -8;
        this.textLineLength = 6;

        this.textRectWidthPercent = .5;
        this.textRectHeightPercent = .11;

        this.textRoundPercent = .39;
        this.textRoundOffsetAngle = 160;
        this.textRoundPlusAngle = 110;
        this.textRoundMaxAngle = this.textRoundOffsetAngle + this.textRoundPlusAngle * 2;
        this.roundStatusRaidus = 30;
        this.textRoundAngle = [ 
            {
                angle: this.textRoundOffsetAngle
                , text: '低'
                , point: {}
                , min: 0
                , max: 100
                , radius: this.roundStatusRaidus
                , lineColor: this.lineColor
            } 
            ,{ 
                angle: this.textRoundOffsetAngle + this.textRoundPlusAngle
                , text: '中'
                , point: {}
                , min: 101
                , max: 500
                , radius: this.roundStatusRaidus
                , lineColor: this.lineColor
            }
            , {
                angle: this.textRoundOffsetAngle + this.textRoundPlusAngle * 2
                , text: '高'
                , point: {}
                , min: 501
                , max: Math.pow( 10, 10 )
                , radius: this.roundStatusRaidus
                , lineColor: this.lineColor
            }
        ];

        this.init();
    }

    getAttackRateAngle(){
        let r = 0;

        r = this.arcOffset + ( this.arcAngle ) * this.getAttackRatePercent();

        return r;
    }

    getAttackRatePercent(){
        let r = 0, tmp;
        if( this.curRate ){
            tmp = this.curRate;
            if( tmp > this.arcTotal ){
                tmp = this.arcTotal;
            }
            
            r = tmp / this.arcTotal;
        }
        return r;
    }

    getAttackText(){
        let text = '低';

        if( this.curRate ){
            this.textRoundAngle.map( ( val ) => {
                if( this.curRate >= val.min && this.curRate <= val.max ){
                    text = val.text;
                }
            });
        }

        return `${text}频\n攻击`;
    }

    init(){
        this.textRoundRadius = this.width * this.textRoundPercent;

        this.roundRadius = this.width * this.roundRadiusPercent;

        this.arcInRadius = this.width * this.arcInPercent;
        this.arcOutRadius = this.width * this.arcOutPercent;

        this.arcLineRaidus = Math.ceil( this.arcLinePercent * this.max )

        this.textWidth = this.textRectWidthPercent * this.width;
        this.textHeight = this.textRectHeightPercent * this.width;
        this.textX = this.cx - this.textWidth / 2; 
        this.textY = this.cy + this.arcLineRaidus + this.arcTextLength / 2 + 2;


        this.textRoundAngle.map( ( val, key ) => {
            let point = geometry.distanceAngleToPoint( this.textRoundRadius, val.angle )
            val.point = geometry.pointPlus( point, this.cpoint );
        });

        this.arcPartLineAr = [];
        this.arcOutlinePartAr = [];
        this.textAr = [];
        for( let i = 0; i <= this.part; i++ ){
            let start, end, angle;
            angle = i * this.partAngle + this.arcOffset;

            if( i && i < this.part ){
                start = geometry.distanceAngleToPoint( this.arcInRadius, angle );
                end = geometry.distanceAngleToPoint( this.arcOutRadius, angle );

                this.arcPartLineAr.push( 'M' );
                this.arcPartLineAr.push( [ start.x, start.y ].join(',') );
                this.arcPartLineAr.push( 'L' );
                this.arcPartLineAr.push( [ end.x, end.y ].join(',') );
            }

            start = geometry.distanceAngleToPoint( this.arcLineRaidus, angle );
            end = geometry.distanceAngleToPoint( this.arcLineRaidus + this.arcLabelLength, angle );

            this.arcOutlinePartAr.push( 'M' );
            this.arcOutlinePartAr.push( [ start.x, start.y ].join(',') );
            this.arcOutlinePartAr.push( 'L' );
            this.arcOutlinePartAr.push( [ end.x, end.y ].join(',') );
            
            if( !(i * this.partNum % 100) || i === 0 ){
                let angleOffset = 8, lengthOffset = 0;

                if( i === 0 ){
                    angleOffset = 1;
                }

                if( i >= 19 ){
                    angleOffset = 14;
                }
                if( i >= 21 ){
                    angleOffset = 18;
                }
                let text = {
                    text: i * this.partNum
                    , angle: angle - angleOffset
                    , point: geometry.distanceAngleToPoint( this.arcLineRaidus + this.arcTextLength + lengthOffset, angle - angleOffset )
                };
                text.textPoint = new PointAt( this.width, this.height, geometry.pointPlus( text.point, this.cpoint) );

                this.textAr.push( text );
            }

        }
    }

    initRoundText(){
        this.textRoundAngle.map( ( val ) => {

            val.ins = new RoundStateText( this.box, this.width, this.height );
            val.ins.setOptions( Object.assign( val, {
                stage: this.stage
                , layer: this.layoutLayer
            }) );
            val.ins.init( );
            val.ins.update( this.curRate );

        });
    }

    update( data, allData ){
        this.stage.removeChildren();

        this.curRate = 600;
        this.totalNum = 234567;

        this.initDataLayout();

        //console.log( 'gauge update', this.getAttackRateAngle() )
        this.angle = this.arcOffset + this.arcOffsetPad;
        this.animationAngle =  this.getAttackRateAngle() + this.arcOffsetPad;
        console.log( this.angle, this.animationAngle );

        this.curRate && this.animation();
        if( this.totalNum ){
            this.totalNumStep = Math.floor( this.totalNum / ( 40 * 1 ) );
            this.totalNumCount = 0;
            this.animationText();
        }
    }

    drawText(){

        let params = {
            text: 0 + ''
            , x: this.cx
            , y: this.textY
            , fontSize: 26
            , fontFamily: 'HuXiaoBoKuHei'
            , fill: '#ffffff'
            , fontStyle: 'italic'
        }, tmp = ju.clone( params );
        tmp.text = this.totalNum; 

        this.totalText = new Konva.Text( params );
        this.totalText.x( this.cx - this.totalText.textWidth / 2 );
        this.totalText.y( this.textY + 5 );

        this.tmpTotalText = new Konva.Text( tmp );
        

    }

    drawTextRect(){

        let textWidth =  this.tmpTotalText.textWidth + 30
            , textX = 0
            ;
            if( textWidth < 170 ){
                textWidth = 170;
            }
            textX = this.cx - textWidth / 2 + 2

        this.textRect = new Konva.Rect( {
            fill: '#596ea7'
            , stroke: '#ffffff00'
            , strokeWidth: 0
            , opacity: .3
            , width: textWidth
            , height: this.textHeight
            , x: textX
            , y: this.textY
        });

        let points = [];
        points.push( 'M', [ textX, this.textY + this.textLineLength ].join(',') );
        points.push( 'L', [ textX, this.textY ].join(',') );
        points.push( 'L', [ textX + this.textLineLength, this.textY ].join(',') );

        points.push( 'M', [ textX + textWidth - this.textLineLength, this.textY ].join(',') );
        points.push( 'L', [ textX + textWidth, this.textY ].join(',') );
        points.push( 'L', [ textX + textWidth, this.textY + this.textLineLength ].join(',') );

        points.push( 'M', [ textX + textWidth, this.textY + this.textHeight - this.textLineLength ].join(',') );
        points.push( 'L', [ textX + textWidth, this.textY + this.textHeight ].join(',') );
        points.push( 'L', [ textX + textWidth - this.textLineLength, this.textY + this.textHeight ].join(',') );

        points.push( 'M', [ textX + this.textLineLength, this.textY + this.textHeight ].join(',') );
        points.push( 'L', [ textX, this.textY + this.textHeight ].join(',') );
        points.push( 'L', [ textX, this.textY + this.textHeight - this.textLineLength ].join(',') );

        this.textLinePath = new Konva.Path( {
            data: points.join('')
            , stroke: this.lineColor
            , strokeWidth: 1
        });

        this.layoutLayer.add( this.textLinePath );
        this.layoutLayer.add( this.textRect );
        this.layoutLayer.add( this.totalText );
    }

    drawArcText() {
        if( !( this.textAr && this.textAr.length ) ) return;

        this.textAr.map( ( val ) => {
            let text = new Konva.Text( {
                x: val.point.x + this.cx
                , y: val.point.y + this.cy
                , text: val.text + ''
                , fontSize: 11
                //, rotation: val.angle
                , fontFamily: 'MicrosoftYaHei'
                , fill: this.lineColor
            });
            text.rotation( val.angle + 90  );

            this.layoutLayer.add( text );
        });
    }

    drawArcLine(){

        let points = [];
            points.push( 'M' );
        for( let i = this.arcOffset; i <= ( this.arcOffset + this.arcAngle ); i+=0.5 ){
            let tmp = geometry.distanceAngleToPoint( this.arcLineRaidus, i );
            points.push( [ tmp.x, tmp.y ] .join(',') + ','  );
            if( i == 90 ){
                points.push( 'L' );
            }
        }

        this.arcLine = new Konva.Path( {
            data: points.join('')
            , x: this.cx
            , y: this.cy
            , stroke: this.lineColor
            , strokeWidth: 1
            , fill: '#ffffff00'
        });

        this.arcPartLine = new Konva.Path( {
            data: this.arcPartLineAr.join('')
            , x: this.cx
            , y: this.cy
            , stroke: '#00000088'
            , strokeWidth: 1
            , fill: '#ffffff00'
        });

        this.arcOutlinePart = new Konva.Path( {
            data: this.arcOutlinePartAr.join('')
            , x: this.cx
            , y: this.cy
            , stroke: this.lineColor
            , strokeWidth: 1
            , fill: '#ffffff00'
        });


        this.layoutLayer.add( this.arcLine );
        this.layoutLayer.add( this.arcPartLine );
        this.layoutLayer.add( this.arcOutlinePart );
    }

    drawArc(){

        let params = {
            x: this.cx
            , y: this.cy
            , innerRadius: this.arcInRadius
            , outerRadius: this.arcOutRadius
            , angle: this.arcAngle
            //, fill: 'red'
            , stroke: '#ffffff00'
            , strokeWidth: 0
            , rotation: this.arcOffset
            , fillLinearGradientStartPoint: { x : -50, y : -50}
            , fillLinearGradientEndPoint: { x : 50, y : 50}
            , fillLinearGradientColorStops: 
            [ 
                0, '#ff9000'
                , .5, '#64b185'
                , 1, '#5a78ca'
            ]
        };
        this.arc = new Konva.Arc( params );

        this.layoutLayer.add( this.arc );
    }

    initDataLayout(){
        this.layer = new Konva.Layer();
        this.layoutLayer = new Konva.Layer();

        this.roundLine = new Konva.Circle( {
            x: this.cx
            , y: this.cy
            , radius: this.roundRadius
            , stroke: this.lineColor
            , strokeWidth: 2.5
            , fill: 'rgba( 0, 0, 0, .5 )'
        });

        this.percentText = new Konva.Text( {
            x: this.cx
            , y: this.cy
            , text: this.getAttackText()
            , fontSize: 18
            , fontFamily: 'HuXiaoBoKuHei'
            , fill: '#ffffff'
            , fontStyle: 'italic'
        });
        this.percentText.x( this.cx - this.percentText.textWidth / 2 + this.textOffsetX );
        this.percentText.y( this.cy - this.percentText.textHeight / 2 + this.textOffsetY );

        /*
        this.percentSymbolText = new Konva.Text( {
            x: this.cx
            , y: this.cy
            , text: '%'
            , fontSize: 17
            , fontFamily: 'Agency FB'
            , fill: '#c7d6ff'
            , fontStyle: 'italic'
        });
        this.percentSymbolText.x( this.percentText.attrs.x  + this.percentText.textWidth );
        this.percentSymbolText.y( this.percentText.attrs.y  + this.percentText.textHeight -  this.percentSymbolText.textHeight - 2 );
        */

        console.log( this.percentText );

       let wedge = new Konva.Wedge({
          x: 0,
          y: -3,
          radius: 10,
          angle: 20,
          fill: '#ff5a00',
          stroke: '#ff5a00',
          strokeWidth: 1,
          rotation: 90
        });

       let wedge1 = new Konva.Wedge({
          x: 0,
          y: -3,
          radius: 10,
          angle: 20,
          fill: '#973500',
          stroke: '#973500',
          strokeWidth: 1,
          rotation: 65
        });


        let group = new Konva.Group({
            x: this.cx
            , y: this.cy
        });

        group.add( wedge1 );
        group.add( wedge );

        this.angle = this.arcOffset - 2;

        this.group = group;

        this.layer.add( group );
        this.layer.add( this.roundLine );
        this.layer.add( this.percentText );
        //this.layer.add( this.percentSymbolText );


        this.drawCircle();
        this.drawCircleLine();
        this.drawArc();
        this.drawArcLine();
        this.drawArcText();
        this.drawText();
        this.drawTextRect();

        this.initRoundText();

        this.stage.add( this.layer );
        this.stage.add( this.layoutLayer );

    }
    animation(){
        if( this.angle > this.animationAngle ) return;
        this.angle += 5;
        if( this.angle >= this.animationAngle ) {
            this.angle = this.animationAngle;
        };

        let point = geometry.distanceAngleToPoint(  this.roundRadius + 6, this.angle )
        this.group.x( this.cx + point.x );
        this.group.y( this.cy + point.y );
        this.group.rotation( this.angle + 90 );
        this.group.rotation( this.angle + 90 );

        this.stage.add( this.layer );

        window.requestAnimationFrame( ()=>{ this.animation() } );
    }

    animationText(){
        if( this.totalNumCount >= this.totalNum ) return;
        this.totalNumCount += this.totalNumStep;
        if( this.totalNumCount >= this.totalNum ) {
            this.totalNumCount = this.totalNum;
        };

        this.totalText.text( this.totalNumCount );
        this.totalText.x( this.cx - this.totalText.textWidth / 2 );
        this.stage.add( this.layoutLayer );

        window.requestAnimationFrame( ()=>{ this.animationText() } );
    }

    calcDataPosition() {
    }

    animationLine(){
    }

    addIcon( path, layer ){
    }

    addText( path, layer ){

    }

    calcLayoutPosition() {
    }
    drawCircle(){
        this.circleRadius = Math.ceil( this.circlePercent * this.max / 2 )

        this.circle = new Konva.Circle( {
            x: this.cx
            , y: this.cy
            , radius: this.circleRadius
            , stroke: this.lineColor
            , strokeWidth: 1
            , fill: '#ffffff00'
        });
        this.layoutLayer.add( this.circle );
    }

    drawCircleLine(){
        this.circleLineRadius = Math.ceil( this.circleLinePercent * this.max / 2 )

        let points = [];
            points.push( 'M' );
        for( let i = 90; i <= 180; i++ ){
            let tmp = geometry.distanceAngleToPoint( this.circleLineRadius, i + 90 );
            points.push( [ tmp.x, tmp.y ] .join(',') + ','  );
            if( i == 90 ){
                points.push( 'L' );
            }
        }
        points.push( 'M');
        for( let i = 270; i <= 360; i++ ){
            let tmp = geometry.distanceAngleToPoint( this.circleLineRadius, i + 90 );
            points.push( [ tmp.x, tmp.y ] .join(',') + ','  );
            if( i == 270 ){
                points.push( 'L' );
            }
        }

        this.circleLine = new Konva.Path( {
            data: points.join('')
            , x: this.cx
            , y: this.cy
            , stroke: this.lineColor
            , strokeWidth: 1.5
            , fill: '#ffffff00'
        });

        this.layoutLayer.add( this.circleLine );
    }

    reset(){
    }
}
