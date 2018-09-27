
import Konva from 'konva';

export default class VisChartBase {
    constructor( box, width, height ){
        this.box = box;


        this.width = width  || box.offsetWidth;
        this.height = height || box.offsetHeight;

        this.max = Math.max( this.width, this.height );

        this.cx = this.max / 2;
        this.cy = this.max / 2;
        this.cpoint = { x: this.cx, y: this.cy };

        console.dir( this.box );
        console.log( this.box, this.width, this.height, this.max );
    }

    update( data ){
        console.log( 'VisChartBase update', data );
    }


    init(){
        console.log( 'VisChartBase init', Date.now(), this.width, this.height, this.canvas );

        if( !this.box ) return;

        this.stage = new Konva.Stage( {
            container: this.box
            , width: this.width
            , height: this.height
        });

        this.calcLayoutPosition();
    }

    calcLayoutPosition() {
    }

    calcDataPosition() {
    }

    draw() {
    }
}

