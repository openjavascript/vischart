
import VisChartBase from '../common/vischartbase.js';
import * as geometry from '../geometry/geometry.js';

import PointAt from '../common/pointat.js';

import Konva from 'konva';
import ju from 'json-utilsx';

import * as utils from '../common/utils.js';

import IconRound from '../icon/round.js';


export default class Gauge extends VisChartBase  {
    constructor( box, width, height ){
        super( box, width, height );

        this.name = 'Gauge' + Date.now();

        this.roundRadiusPercent = .1;

        this.lineColor = '#596ea7';

        this.circleLinePercent = .31;
        this.circlePercent = .34;

        this.arcInPercent = .365 / 2;
        this.arcOutPercent = .44 / 2;

        this.arcAngle = 300;
        this.arcOffset = 90 + ( 360 - this.arcAngle ) / 2;

        this.part = 22;
        this.partLabel = this.part / 2;

        this.init();
    }

    init(){
        this.roundRadius = this.width * this.roundRadiusPercent;

        this.arcInRadius = this.width * this.arcInPercent;
        this.arcOutRadius = this.width * this.arcOutPercent;
    }

    update( data, allData ){
        this.stage.removeChildren();

        this.initDataLayout();
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
        console.log( params );
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
            , strokeWidth: 3
            , fill: 'rgba( 0, 0, 0, .5 )'
        });

        this.percentText = new Konva.Text( {
            x: this.cx
            , y: this.cy
            , text: '65'
            , fontSize: 33
            , fontFamily: 'Agency FB'
            , fill: '#c7d6ff'
            , fontStyle: 'italic'
        });
        this.percentText.x( this.cx - this.percentText.textWidth / 2 - 6 );
        this.percentText.y( this.cy - this.percentText.textHeight / 2 );

        this.percentSymbolText = new Konva.Text( {
            x: this.cx
            , y: this.cy
            , text: '%'
            , fontSize: 18
            , fontFamily: 'Agency FB'
            , fill: '#c7d6ff'
            , fontStyle: 'italic'
        });
        this.percentSymbolText.x( this.percentText.attrs.x  + this.percentText.textWidth );
        this.percentSymbolText.y( this.percentText.attrs.y  + this.percentText.textHeight -  this.percentSymbolText.textHeight - 2 );

        console.log( this.percentText );

       let wedge = new Konva.Wedge({
          x: 0,
          y: -6,
          radius: 12,
          angle: 20,
          fill: '#ff5a00',
          stroke: '#ff5a00',
          strokeWidth: 1,
          rotation: 90
        });

       let wedge1 = new Konva.Wedge({
          x: 0,
          y: -6,
          radius: 12,
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

        this.angle = -90;

        this.group = group;

        this.layer.add( group );
        this.layer.add( this.roundLine );
        this.layer.add( this.percentText );
        this.layer.add( this.percentSymbolText );


        this.drawCircle();
        this.drawCircleLine();
        this.drawArc();

        this.stage.add( this.layer );
        this.stage.add( this.layoutLayer );


        window.requestAnimationFrame( ()=>{ this.animation() } );
    }
    animation(){
        this.angle++;

        let point = geometry.distanceAngleToPoint(  this.roundRadius + 6, this.angle )
        this.group.x( this.cx + point.x );
        this.group.y( this.cy + point.y );
        this.group.rotation( this.angle + 90 );
        this.group.rotation( this.angle + 90 );

        this.stage.add( this.layer );


        //window.requestAnimationFrame( ()=>{ this.animation() } );
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
            , x: this.cx
            , y: this.cy
            , stroke: this.lineColor
            , strokeWidth: 2
            , fill: '#ffffff00'
        });

        this.layoutLayer.add( this.circleLine );
    }

    reset(){
    }
}
