
import Konva from 'konva';

export default class VisChartBase {
    constructor( box, width, height ){
        this.box = box;

        this.customWidth = width;
        this.customHeight = height;

        this.width = width  || box.offsetWidth;
        this.height = height || box.offsetHeight;

        this.max = Math.max( this.width, this.height );

        this.cx = this.max / 2;
        this.cy = this.max / 2;
        this.cpoint = { x: this.cx, y: this.cy };

        this.totalAngle = 360;
        this.angleOffset = 0;
        this.countAngle = 0;

        this.colors = [
            '#f12575'
            , '#da432e'
            , '#f3a42d'
            , '#19af89'
            , '#24a3ea'
            , '#b56be8'
        ];

    }

    update( data ){
        this.data = data;

        return this;
    }

    init() {
        return this;
    }

    setOptions( options ){

        for( let key in options ){
            this[ key ] = options[key];
        }

        this.options = options;
    }

    calcLayoutPosition() {
        return this;
    }

    calcDataPosition() {
        return this;
    }

    initDataLayout(){
        return this;
    }

    draw() {
        return this;
    }

    setStage( stage ){
        this.stage = stage;
    }

    reset(){
    }

    animation(){
    }

}

