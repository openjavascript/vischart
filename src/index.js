

import VisChartBase from './common/vischartbase.js';

import Dount from './2d/dount/index.js';
import Gauge from './2d/gauge/index.js';

import Konva from 'konva';
import ju from 'json-utilsx';

import * as constant from './common/constant.js';
import Legend from './2d/common/legend.js';

import VisThree from './3d/index.js';

export default class VisChart extends VisChartBase {
    constructor( box, width, height ){
        super( box, width, height );

        this.ins = [];
        this.legend = null;

        this._setSize( width, height );
    }

    _setSize( width, height ){

        super._setSize( width, height );

        this.init();

        if( 
            this.legend
            && this.data 
            && this.data.legend 
        ){
            this.legend.resize( this.width, this.height );
            this.legend.update( this.data.legend );
        }

        if( this.data ){
            let tmpredraw = this.redraw;
            this.update( this.data, this.ignoreLegend );
            this.redraw = tmpredraw;
        }
    }

    init(){
        //console.log( 'VisChartBase init', Date.now(), this.width, this.height, this.canvas );

        if( !this.box ) return;

        if( !this.stage ){
            this.stage = new Konva.Stage( {
                container: this.box
                , width: this.width
                , height: this.height
            });
        }else{
            this.stage.width( this.width );
            this.stage.height( this.height );
        }

        //console.log( this.width, this.height, this.box.offsetWidth, this.box.offsetHeight );
        //console.log( this );

        this.customWidth && ( this.box.style.width = this.customWidth + 'px' );
        this.customHeight && ( this.box.style.height = this.customHeight + 'px' );

        return this;
    }

    update( data, ignoreLegend, redraw = true ){
        this.data = data;
        this.ignoreLegend = ignoreLegend;
        this.redraw = redraw;

        if( !ju.jsonInData( this.data, 'series' ) ) return;

        this.data
        && this.data.legend
        && this.data.legend.data
        && this.data.legend.data.legend
        && this.data.legend.data.map( ( item, key )=> {
            item.realIndex = key;
        });


        this.data
        && this.data.series 
        && this.data.series.length 
        && this.data.series.map( sitem => {
            sitem.data && sitem.data.length 
            && sitem.data.map( ( item, key ) => {
                item.realIndex = key;
            });
        });

        this.clearUpdate();

        //console.log( ju );

        //this.stage.removeChildren();

        //console.log( 'update data', data );

        if( ju.jsonInData( this.data, 'legend.data' ) &&  this.data.legend.data.length ){
            if( this.legend && ignoreLegend ){
                this.emptyblock = 'kao';
            }else{
                this.legend = new Legend( this.box, this.width, this.height );
                this.legend.setStage( this.stage );
                this.legend.setOptions( {
                    onChange: ( group ) => {
                        //console.log( 'legend onchange', group );
                        this.initChart();
                    }
                });
                this.legend.update( this.data.legend );
            }
        }
        this.initChart();
        return this;
    }

    initChart(){

        if( this.ins && this.ins.length &&  !this.redraw  ){
                this.emptyblock = 'kao';
        }else{
            this.ins.map( item => {
                item.destroy();
            });
            this.ins = [];
        }

        this.data.series.map( ( val, key ) => {
            //console.log( val, constant );
            let ins;

            if( this.ins && this.ins.length && this.ins[key] &&  !this.redraw  ){
                ins = this.ins[key];
                ins.width = this.width;
                ins.height = this.height;
            }else{
                switch( val.type ){
                    case constant.CHART_TYPE.dount: {
                        ins = new Dount( this.box, this.width, this.height );
                        break;
                    }
                    case constant.CHART_TYPE.gauge: {
                        ins = new Gauge( this.box, this.width, this.height );
                        break;
                    }
                }
                if( ins ){
                    this.legend && ins.setLegend( this.legend );
                    ins.setStage( this.stage );
                }
            }

            if( ins ){
                this.options && ( ins.setOptions( this.options ) );
                ins.update( this.getLegendData( val ), ju.clone( this.data ) );

                if( !this.ins[key]  ){
                    this.ins[key] = ins;
                }
            }
        });
    }

    getLegendData( data ){
        data = ju.clone( data );

        let tmp = [];

        if( this.legend && this.legend.group && this.legend.group.length ){
            //console.log( 'getLegendData', this.legend.group, 111111111 );
            this.legend.group.map( ( item, key ) => {
                if( !item.disabled ){
                    tmp.push( data.data[key] );
                }
            });
            data.data = tmp;
        }

        return data;
    }

    destroy(){
        super.destroy();

        //this.clearUpdate();
        this.ins.map( ( item ) => {
            item.destroy();
        });
        this.legend && this.legend.destroy();

        this.stage && this.stage.destroy();
        this.stage = null;
    }

    clearUpdate(){
        this.legend && !this.ignoreLegend && this.legend.destroy();
    }
}

VisChart.three = VisThree;
