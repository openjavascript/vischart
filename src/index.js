

import VisChartBase from './common/vischartbase.js';

import Dount from './dount/index.js';
import Gauge from './gauge/index.js';

import Konva from 'konva';
import ju from 'json-utilsx';

import * as constant from './common/constant.js';

export default class VisChart extends VisChartBase {
    constructor( box, width, height ){
        super( box, width, height );

        this.ins = [];
        this.images = [];

        this.init();
    }

    init(){
        //console.log( 'VisChartBase init', Date.now(), this.width, this.height, this.canvas );

        if( !this.box ) return;

        this.stage = new Konva.Stage( {
            container: this.box
            , width: this.width
            , height: this.height
        });

        this.customWidth && ( this.box.style.width = this.customWidth + 'px' );
        this.customHeight && ( this.box.style.height = this.customHeight + 'px' );

        return this;
    }

    update( data ){
        this.data = data;

        this.loadImage();

        if( !ju.jsonInData( this.data, 'series' ) ) return;

        //console.log( ju );

        this.stage.removeChildren();

        //console.log( 'update data', data );

        this.data.series.map( ( val, key ) => {
            //console.log( val, constant );
            let ins;

            switch( val.type ){
                case constant.CHART_TYPE.dount: {
                    ins = new Dount( this.box, this.width, this.height );
                    this.options && ( ins.setOptions( this.options ) );
                    ins.setStage( this.stage );
                    ins.update( ju.clone( val ), ju.clone( this.data ) );
                    break;
                }
                case constant.CHART_TYPE.gauge: {
                    ins = new Gauge( this.box, this.width, this.height );
                    this.options && ( ins.setOptions( this.options ) );
                    ins.setStage( this.stage );
                    ins.update( ju.clone( val ), ju.clone( this.data ) );
                    break;
                }
            }

            if( ins ){
                this.ins.push( ins );
            }
        });

        return this;
    }

    addImage( imgUrl, width, height, offsetX = 0, offsetY = 0 ){
        this.images.push( {
            url: imgUrl
            , width: width
            , height: height
            , offsetX: offsetX
            , offsetY: offsetY
        });

        return this;
    }

    loadImage(){

        if( this.iconLayer ) this.iconLayer.remove();
        this.iconLayer = new Konva.Layer();

        this.images.map( ( item ) => {
            
            let img = new Image();
            img.onload = ()=>{
                let width = item.width || img.width
                    , height = item.height || img.height
                    ;

                let icon = new Konva.Image( {
                    image: img
                    , x: this.cx - width / 2 + item.offsetX
                    , y: this.cy - height / 2 + item.offsetY
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



}
