

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
        this.ins.map( item => {
            item.destroy();
        });


        //console.log( ju );

        this.stage.removeChildren();

        //console.log( 'update data', data );

        if( ju.jsonInData( this.data, 'legend.data' ) &&  this.data.legend.data.length  ){
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
        this.initChart();
        return this;
    }

    initChart(){

        this.ins.map( item => {
            item.destroy();
        });

        this.ins = [];

        this.data.series.map( ( val, key ) => {
            //console.log( val, constant );
            let ins;

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
                this.options && ( ins.setOptions( this.options ) );
                ins.setStage( this.stage );
                ins.update( this.getLegendData( val ), ju.clone( this.data ) );
                this.ins.push( ins );
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
        this.stage && this.stage.destroy();
        this.stage = null;
    }
}
