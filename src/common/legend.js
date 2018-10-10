
import VisChartBase from '../common/vischartbase.js';
import * as geometry from '../geometry/geometry.js';

import Konva from 'konva';
import ju from 'json-utilsx';

import * as utils from '../common/utils.js';


export default class Legend extends VisChartBase  {
    constructor( box, width, height ){
        super( box, width, height );

        this.name = 'Legend ' + Date.now();

    }

    setStage( stage ){
        super.setStage( stage );

        this.layer = new Konva.Layer({
        });

        stage.add( this.layer );
    }

    init(){
        return this;
    }

    update( data ){
        this.data = data || {};

        /*
        console.log( 
            this.column()
            , this.row()
            , this.direction() 
            , this.outerHeight()
        );
        */

        this.init();
    }

    outerHeight(){
        return this.rowHeight() * this.row() + this.space();
    }

    total(){
        let r = 0;

        return r;
    }

    column(){
        return this.data.column || 1;
    }

    space(){
        return this.data.space || 5;
    }

    rowHeight(){
        return this.data.rowHeight || 24;
    }

    row(){
        return Math.ceil( this.data.data.length /  this.column() );
    }

    direction(){
        let r = 'top';

        if( this.data.bottom ){
            r = 'bottom'
        }else if( this.data.left ){
            r = 'left';
        }else if( this.data.right ) {
            r  = 'right';
        }

        return r;
    }

}
