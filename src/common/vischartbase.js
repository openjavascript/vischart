
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
    }

    update( data ){
        this.data = data;

        return this;
    }

    init() {
        return this;
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

