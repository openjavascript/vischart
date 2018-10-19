
import VisChartBase from '../../common/vischartbase.js';

import THREE from '../../utils/three.js';

export default class ThreeBase extends VisChartBase {
    constructor( box, width, height ){
        super( box, width, height );
    }

    render() {
        this.renderer 
        && this.scene
        && this.camera
        && this.renderer.render( this.scene, this.camera );

        return this;
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

                    , val.width
                    , val.height

                    , val.offsetX || 0
                    , val.offsetY || 0 

                    , val.rotation || 0

                    , val.isbase64

                    , val
                );
            });
        }

        this.rotationBg = [];

        this.images.map( ( item, key ) => {
            item.opt = item.opt || {};
            //console.log( 'item', item );

            if( item.opt.issvgstring ){
                if( !this.svgLoader() ) return;
                this.initSVGBackground( 
                    this.svgLoader().parse( item.url )
                    , item
                    , key 
                );
                return;
            }
            
            /*
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
            */
        });
          
        return this;
    }

    svgLoader(){
        if( !this._svgloader && THREE.SVGLoader ){
            this._svgloader = new THREE.SVGLoader();
        }
        
        return this._svgloader;
    }


    initSVGBackground( paths, item, key ){
        console.log( key, item, paths );
    }


}
