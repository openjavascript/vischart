

import VisChartBase from './common/vischartbase.js';

import Dount from './dount/index.js';
import Gauge from './gauge/index.js';

import Konva from 'konva';
import ju from 'json-utilsx';

import * as constant from './common/constant.js';
import Legend from './common/legend.js';

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


        this.update( this.data, this.ignoreLegend, this.redraw );
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

        this.customWidth && ( this.box.style.width = this.customWidth + 'px' );
        this.customHeight && ( this.box.style.height = this.customHeight + 'px' );

        return this;
    }

    update( data, ignoreLegend, redraw = true ){
        this.data = data;
        this.ignoreLegend = ignoreLegend;
        this.redraw = redraw;

        if( !ju.jsonInData( this.data, 'series' ) ) return;

        this.clearUpdate();

        //console.log( ju );

        //this.stage.removeChildren();

        //console.log( 'update data', data );

        if( ju.jsonInData( this.data, 'legend.data' ) &&  this.data.legend.data.length ){
            if( this.legend && ignoreLegend ){
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
