
import VisChartBase from '../common/vischartbase.js';
import * as geometry from '../geometry/geometry.js';

import Konva from 'konva';
import ju from 'json-utilsx';

import * as utils from '../common/utils.js';


export default class RoundStateText extends VisChartBase  {
    constructor( box, width, height ){
        super( width, height );

        this.name = 'RoundStateText ' + Date.now();

        this.radius = 30;

        this.textOffsetX = -2;
        this.textOffsetY = -1;

        this.curColor = '#deaf5c';
    }

    init(){
        console.log( 'RoundStateText init', this );
        this.circleRaidus = this.radius - 5;

        //this.lineColor = this.curColor;

        this.initDataLayout();

        return this;
    }

    update( rate ){
        this.rate = rate;

        let color = this.lineColor;

        if( rate >= this.min && rate < this.max ){
            color = this.curColor;
        }

        this.text.fill( color );
        this.circle.stroke( color );
        this.circleLine.stroke( color );


        return this;
    }

    initDataLayout(){
        this.drawText();
        this.drawCircle()
        this.drawCircleLine()
    }
    drawText(){
        this.text = new Konva.Text( {
            x: this.point.x
            , y: this.point.y
            , text: this.text
            , fontSize: 32
            , fontFamily: 'HuXiaoBoKuHei'
            , fill: this.lineColor
            , fontStyle: 'italic'
        });

        this.text.x( this.point.x - this.text.textWidth / 2 + this.textOffsetX );
        this.text.y( this.point.y - this.text.textHeight / 2 + this.textOffsetY );


        this.layer.add( this.text );
    }

    drawCircle(){
        this.circle = new Konva.Circle( {
            x: this.point.x
            , y: this.point.y
            , radius: this.circleRaidus
            , stroke: this.lineColor
            , strokeWidth: 2
            , fill: '#ffffff00'
        });

        this.layer.add( this.circle );
    }

    drawCircleLine(){
        this.circleLineRadius = this.radius - 1;

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
            , x: this.point.x
            , y: this.point.y
            , stroke: this.lineColor
            , strokeWidth: 2
            , fill: '#ffffff00'
        });

        this.layer.add( this.circleLine );
    }


    reset(){
    }

    animation(){
    }

    calcDataPosition() {
    }

    animationLine(){
    }

    calcLayoutPosition() {
    }
}
