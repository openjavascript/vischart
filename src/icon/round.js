
import VisChartBase from '../common/vischartbase.js';
import * as geometry from '../geometry/geometry.js';

import Konva from 'konva';
import ju from 'json-utilsx';

import * as utils from '../common/utils.js';


export default class IconRound extends VisChartBase  {
    constructor( box, width, height ){
        super( box, width, height );

        this.name = 'IconRound ' + Date.now();

        this.outRadius = 6;
        this.inRadius = 2;

        this.color = '#ffffff';

        this.max = 1.1;
        this.min = 0.5;

        this.step = .01;
        this.cur = 1;

        this.isplus = 1;

        this.init();
    }

    init(){
        return this;
    }

    update( point ){
        this.point = point;

        this.group = new Konva.Group({
            x: this.point.x + this.cx
            , y: this.point.y + this.cy
            , width: this.outRadius * 2
            , height: this.outRadius * 2
        });

        this.circle = new Konva.Circle( {
            radius: this.inRadius
            , fill: this.color
            , stroke: this.color
            , x: 0
            , y: 0
        });

        this.outcircle = new Konva.Circle( {
            radius: this.outRadius
            , fill: '#ffffff00'
            , stroke: this.color
            , strokeWidth: 1
            , x: 0
            , y: 0
        });

        this.group.add( this.circle );
        this.group.add( this.outcircle );

        this.group.scale( { x: this.cur, y: this.cur } );

        this.layer.add( this.group );

        window.requestAnimationFrame( ()=>{ this.animation() } );

    }

    reset(){
    }

    animation(){

        if( this.plus ){
            this.cur = this.cur + this.step;

            if( this.cur > this.max ){
                this.cur = this.max;
                this.plus = 0;
            }
        }else{
            this.cur = this.cur - this.step;
            if( this.cur < this.min ){
                this.cur = this.min;
                this.plus = 1;
            }
        }


        this.group.scale( { x: this.cur, y: this.cur } );

        this.stage.add( this.layer );

        window.requestAnimationFrame( ()=>{ this.animation() } );
    }

    initDataLayout(){
    }

    calcDataPosition() {
    }

    animationLine(){
    }

    calcLayoutPosition() {
    }
}
