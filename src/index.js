

import VisChartBase from './common/vischartbase.js';

import DiagramMeter from './diagrammeter/index.js';
import Dount from './dount/index.js';

import Konva from 'konva';
import ju from 'json-utilsx';

import * as constant from './common/constant.js';

export default class VisChart extends VisChartBase {
    constructor( box, width, height ){
        super( box, width, height );

        this.ins = [];

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

        if( !ju.jsonInData( this.data, 'series' ) ) return;

        this.stage.removeChildren();

        console.log( 'update data', data );

        this.data.series.map( ( val, key ) => {
            console.log( val, constant );
            switch( val.type ){
                case constant.CHART_TYPE.dount: {
                    console.log( 'dount find' );

                    let dount = new Dount( this.box, this.width, this.height );
                        dount.update( val );

                    this.ins.push( dount );

                    break;
                }
            }
        });

        return this;
    }

    setImage( imgUrl ){
        this.imgUrl = imgUrl;

        this.loadImage();

        return this;
    }

    loadImage(){
        if( !this.imgUrl ) return;

        if( this.iconLayer ) this.state.remove( this.iconLayer );

        this.iconLayer = new Konva.Layer();

        let img = new Image();
        img.onload = ()=>{
            this.icon = new Konva.Image( {
                x: this.cx - 107 / 2
                , y: this.cy - 107 / 2
                , image: img
                , width: 107
                , height: 107
            });

            this.iconLayer.add( this.icon );

            this.stage.add( this.iconLayer );

        }
        img.src = this.imgUrl; 

        return this;
    }



}
