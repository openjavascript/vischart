
import Konva from 'konva';
import VisChartBase from '../../common/vischartbase.js';


export default class KonvaBase extends VisChartBase {
    constructor( box, width, height ){
        super( box, width, height );
    }

    loadImage(){

        if( this.images.length ) return;

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



}
