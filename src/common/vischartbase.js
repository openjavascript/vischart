
import Konva from 'konva';

export default class VisChartBase {
    constructor( box, width, height ){
        this.box = box;

        this.customWidth = width;
        this.customHeight = height;

        this.width = width  || box.offsetWidth;
        this.height = height || box.offsetHeight;

        this.max = Math.max( this.width, this.height );
        this.min = Math.min( this.width, this.height );

        this.cx = this.width / 2;
        this.cy = this.height / 2;
        this.cpoint = { x: this.cx, y: this.cy };

        this.totalAngle = 360;
        this.angleOffset = 0;
        this.countAngle = 0;

        this.images = [];

        this.rateWidth = 330;
        this.rateHeight = 330;


        this.colors = [
            '#f12575'
            , '#da432e'
            , '#f3a42d'
            , '#19af89'
            , '#24a3ea'
            , '#b56be8'
        ];

    }

    update( data, allData ){
        this.data = data;
        this.allData = allData;

        this.loadImage();

        return this;
    }

    setLegend( legend ){
        this.legend = legend;
    }

    addImage( imgUrl, width, height, offsetX = 0, offsetY = 0 ){
        //console.log( this.rateWidth, this.width );
        let rateW = this.min / this.rateWidth
            , rateH = this.min / this.rateHeight
            ;
        this.images.push( {
            url: imgUrl
            , width: width * rateW
            , height: height * rateH
            , offsetX: offsetX
            , offsetY: offsetY
        });

        return this;
    }

/*
    "background": [
        { 
            "url": "./img/dount-in.png"
            , "width": 120
            , "height": 120
            , "offsetX": 0
            , "offsetY": 1
        }
        , { 
            "url": "./img/dount-big.png"
            , "width": 250
            , "height": 248
            , "offsetX": 0
            , "offsetY": 1
        }
    ],
*/
    loadImage(){

        if( this.iconLayer ) this.iconLayer.remove();
        this.iconLayer = new Konva.Layer();

        this.images = [];

        if( this.data && this.data.background && this.data.background.length ){
            this.data.background.map( ( val ) => {
                this.addImage( 
                    val.url
                    , val.width, val.height
                    , val.offsetX || 0, val.offsetY || 0 
                );
            });
        }

        this.images.map( ( item ) => {
            
            let img = new Image();
            img.onload = ()=>{
                let width = item.width || img.width
                    , height = item.height || img.height
                    ;

                let icon = new Konva.Image( {
                    image: img
                    , x: this.fixCx() - width / 2 + item.offsetX
                    , y: this.fixCy() - height / 2 + item.offsetY
                    , width: width
                    , height: height
                });

                this.iconLayer.add( icon );

                this.stage.add( this.iconLayer );

            }
            img.src = item.url; 
        });
          
        return this;
    }


    hasLegend(){
        let r;

        if( this.data 
            && this.data.legend 
            && this.data.legend.data
            && this.data.legend.data.length
        ){
            r = true;
        }

        return r;
    }

    fixCx(){
        let r = this.cx;
        return r;
    }

    fixCy(){
        let r = this.cy;

        if( this.legend ){
            r -= 15;
        }

        return r;
    }

    fixWidth(){
        let r = this.width;
        return r;
    }

    fixHeight(){
        let r = this.height;
        return r;
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

    reset(){
    }

    animation(){
    }

    layer(){
        return this.layer;
    }

    setLayer( layer ){
        this.layer = layer;
        return this;
    }

    setStage( stage ){
        this.stage = stage;
    }

}

