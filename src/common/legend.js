
import VisChartBase from '../common/vischartbase.js';
import * as geometry from '../geometry/geometry.js';

import Konva from 'konva';
import ju from 'json-utilsx';

import * as utils from '../common/utils.js';


export default class Legend extends VisChartBase  {
    constructor( box, width, height ){
        super( box, width, height );

        this.name = 'Legend ' + Date.now();

        this.text = [];
        this.icon = [];
        this.group = [];

    }

    setStage( stage ){
        super.setStage( stage );

        this.layer = new Konva.Layer({
        });

        stage.add( this.layer );
    }

    init(){

        this.data.data.map( ( item, key ) => {
            let 
                x = 0, y = 0
                , count = key + 1
                , curRow = Math.floor( key / this.column() )
                ;

            switch( this.direction() ){
                case 'bottom': {
                    y = this.height - ( this.row() - curRow ) * ( this.space() + this.rowHeight() );
                    x = this.space() + ( this.space() + this.columnWidth() ) * ( key % this.column() ) ;
                    console.log( x, y, key, this.direction(), curRow );
                    break;
                }
            }

            let text = new Konva.Rect( {
                text: key + ''
                , x: x
                , y: y
                , width: this.columnWidth
                , height: 20
                , fill: '#ffffff'
            });

            this.layer.add( text );

        });
        this.stage.add( this.layer );
        
        return this;
    }

    update( data ){
        this.data = data || {};
        if( !( this.data && this.data.data && this.data.data.length ) ) return;

        console.log( 
            this.column()
            , this.row()
            , this.direction() 
            , this.outerHeight()
            , this.columnWidth()
        );

        this.init();
    }

    outerHeight(){
        return this.rowHeight() * this.row() + this.space();
    }

    total(){
        let r = 0;

        return r;
    }

    columnWidth(){
        return ( this.width - ( this.column() + 2 + this.column() - 1 ) * this.space() ) / this.column();
    }

    column(){
        return this.data.column || 1;
    }

    space(){
        return this.data.space || 15;
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
