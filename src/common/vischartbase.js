
import Konva from 'konva';

export default class VisChartBase {
    constructor( box, width, height ){
        this.box = box;

        this.name = 'VisChartBase_' + Date.now();

        this.colors = [
            '#f12575'
            , '#da432e'
            , '#f3a42d'
            , '#19af89'
            , '#24a3ea'
            , '#b56be8'
        ];

        this._setSize( width, height );
    }

    _setSize( width, height ){

        this.destroyList = [];

        this.customWidth = width;
        this.customHeight = height;

        this.width = width  || this.box.offsetWidth;
        this.height = height || this.box.offsetHeight;

        this.max = this.maxSize = Math.max( this.width, this.height );
        this.min = this.minSize =  Math.min( this.width, this.height );

        this.cx = this.width / 2;
        this.cy = this.height / 2;
        this.cpoint = { x: this.cx, y: this.cy };

        this.totalAngle = 360;
        this.angleOffset = 0;
        this.countAngle = 0;

        this.images = [];

        this.rateWidth = 330;
        this.rateHeight = 330;

        this.rotationBg = [];

        this.rotationBgCount = 0;
        this.rotationBgStep = 1;

        this.sizeRate = 1;

        this.standSize = 330;

        if( this.min < this.standSize ){
            this.sizeRate = this.min / this.standSize;
        }
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

    animation(){
    }

    animationBg(){
        //console.log( 'animationBg', Date.now(), this.isDestroy, this.rotationBg.length, this.rotationBgCount );
        if( this.isDestroy ) return;
        if( !this.rotationBg.length ) return;
        if( !this.isAnimation() ) return;

        this.rotationBg.map( item => {
            this.rotationBgCount =  ( this.rotationBgCount - this.rotationBgStep ) % 360;
            item.rotation( this.rotationBgCount );
        });

        this.stage.add( this.iconLayer );

        window.requestAnimationFrame( ()=>{ this.animationBg() } );
    }


    addImage( imgUrl, width, height, offsetX = 0, offsetY = 0, rotation = 0, isbase64 = false ){
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
            , rotation: rotation
            , isbase64: isbase64
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
        this.addDestroy( this.iconLayer );

        this.images = [];

        if( this.data && this.data.background && this.data.background.length ){
            this.data.background.map( ( val ) => {
                this.addImage( 
                    val.url
                    , val.width, val.height
                    , val.offsetX || 0, val.offsetY || 0 
                    , val.rotation || 0
                    , val.isbase64
                );
            });
        }

        this.rotationBg = [];

        this.images.map( ( item ) => {
            //console.log( 'item', item );
            
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
                this.addDestroy( icon );

                this.iconLayer.add( icon );

                if( item.rotation ) {
                    this.rotationBg.push( icon );
                    icon.x( this.fixCx() - width / 2 + item.offsetX + width / 2 );
                    icon.y( this.fixCy() - height / 2 + item.offsetY + height / 2 );
                    icon.offset( { x: width / 2, y: height / 2 } )
                    if( this.rotationBg.length === 1 ) this.animationBg();
                }
                this.stage.add( this.iconLayer );
            }
            if( item.isbase64 ){
                img.src = ( item.base64prefix || 'data:image/png;base64,' ) + item.url;
            }else{
                img.src = item.url; 
            }
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
            switch( this.legend.direction() ){
                case 'bottom': {
                    r = ( this.height - this.legend.outerHeight() / 2 ) / 2 - 5;
                    break;
                }
            }
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

    getData(){
        return this.data || {};
    }

    layer(){
        return this.layer;
    }

    isAnimation(){
        let r = true;

        if( this.allData && 'animation' in this.allData ){
            r = this.allData.animation;
        }

        if( this.data && 'animation' in this.data ){
            r = this.data.animation;
        }

        return r;
    }

    isSeriesAnimation(){
        let r = true;

        if( this.data && 'seriesAnimation' in this.data ){
            r = this.data.seriesAnimation;
        }

        return r;
    }



    setLayer( layer ){
        this.layer = layer;
        return this;
    }

    setStage( stage ){
        this.stage = stage;
    }

    resize( width, height, data = null, allData = null ){
        this.data = data || this.data;
        this.allData = allData || this.allData;

        this.width = width      || this.box.offsetWidth     || this.width;
        this.height = height    || this.box.offsetHeight    || this.height;

        this._setSize( this.width, this.height );
    }

    setDestroy(){
        this.isDestroy = 1;
    }

    destroy(){
        this.setDestroy();

        //console.log( 'base destroyList.length', this.destroyList.length );

        this.destroyList.map( item => {
            if( item ){
                item.remove();
                item.destroy();
            }
        });
    }

    addDestroy( ...item ){
        item && item.length && item.map( val => {
            this.destroyList.push( val );
        });
    }

}

