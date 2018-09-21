
import Two from 'two.js';


export default class DiagramMeter {
    constructor( canvas, width = 400, height = 400 ){

        this.name = 'DiagramMeter ' + Date.now();

        this.canvas = canvas;
        this.width = width;
        this.height = height;

        this.initPosition();

        this.init();
    }

    initPosition(){
        this.cx = this.width / 2;
        this.cy = this.height / 2;
        this.radius = this.width / 2 / 2;
    }

    init(){
        if( !this.canvas ) return;
        this.two = new Two({
          type: Two.Types.canvas,
          width: this.width,
          height: this.height,
          domElement: this.canvas
        });

        this.drawDemo();
        this.draw();
    }

    draw(){
        console.log( 'this.draw', Date.now() );

        let center = this.two.makeCircle( this.cx, this.cy, 25 ); 
        center.fill = '#ff800000';
        center.stroke = '#596DA7';

        let textNum = this.two.makeText( '64', this.cx - 3, this.cy, {
            fill: '#ffffff'
            , size: 22
        } );
        let textPercent = this.two.makeText( '%', textNum._translation.x + textNum.size / 2 + 8, this.cy + 4, {
            fill: '#ffffff'
            , size: 12
        } );
        console.log( textNum );



        this.two.update();

    }

    drawDemo(){
        console.log( 'this.drawDemo', Date.now() );

    }


}
