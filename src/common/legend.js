
import VisChartBase from '../common/vischartbase.js';
import * as geometry from '../geometry/geometry.js';

import Konva from 'konva';
import ju from 'json-utilsx';

import * as utils from '../common/utils.js';


export default class Legend extends VisChartBase  {
    constructor( box, width, height ){
        super( box, width, height );

        this.name = 'Legend ' + Date.now();

        this.textColor = '#24a3ea';

        this.iconSpace = 5;

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
                    x = this.space() + ( this.space() + this.columnWidth() ) * ( key % this.column() ) ;
                    y = this.height - ( this.row() - curRow ) * ( this.spaceY() + this.rowHeight() );
                    //console.log( x, y, key, this.direction(), curRow );
                    break;
                }
            }

            let label = item.name || key + '';

            let color = this.colors[ key % this.colors.length];

            if( ju.jsonInData( item, 'textStyle.color' ) ){
                //path.fill( val.itemStyle.color );
                color = item.textStyle.color;
            }

            let rect = new Konva.Rect( {
                x: x
                , y: y
                , width: this.itemWidth()
                , height: this.itemHeight()
                , fill: color
            });

            let bg = new Konva.Rect( {
                x: x
                , y: y
                , width: this.columnWidth()
                , height: this.rowHeight()
                , fill: '#ffffff00'
            });

            let text = new Konva.Text( {
                text: label
                , x: x + this.iconSpace + rect.width()
                , y: y
                , fill: this.textColor
                , fontFamily: 'MicrosoftYaHei'
                , fontSize: 12
            });

            let group  = new Konva.Group();
            group.add( bg );
            group.add( rect );
            group.add( text );

            let data = {
                ele: group
                , item: item
                , text: text
                , disabled: false
            };

            this.group.push( data );


            group.on( 'click', ()=>{
                //console.log( 'click', key, data, group, item );
                data.disabled = !data.disabled;

                if( data.disabled ){
                    group.opacity( .6 );
                }else{
                    group.opacity( 1 );
                }

                this.stage.add( this.layer );

                this.onChange && this.onChange( this.group );
            });


            this.layer.add( group );

        });
        this.stage.add( this.layer );
        
        return this;
    }

    update( data ){
        this.data = data || {};
        if( !( this.data && this.data.data && this.data.data.length ) ) return;

        /*
        console.log( 
            this.column()
            , this.row()
            , this.direction() 
            , this.outerHeight()
            , 'columnWidth:', this.columnWidth()
        );
        console.log( this.width, this.width - ( this.column() - 1  + 2 ) * this.space() );
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

    itemWidth(){
        return this.data.itemWidth || 5;
    }

    itemHeight(){
        return this.data.itemHeight || 5;
    }

    columnWidth(){
        return ( this.width - ( this.column() - 1 + 2 ) * this.space() ) / this.column();
    }

    column(){
        return this.data.column || 1;
    }

    space(){
        return this.data.space || 15;
    }

    spaceY(){
        return this.data.space || 0;
    }

    rowHeight(){
        return this.data.rowHeight || 22;
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
