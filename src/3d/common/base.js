
import VisChartBase from '../../common/vischartbase.js';

import THREE from '../../utils/three.js';

import ju from 'json-utilsx';

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
        this._images = [];

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
            if( item.opt.issvgstring ){
                if( !this.svgLoader() ) return;
                this.initSVGBackground( 
                    this.svgLoader().parse( item.url )
                    , item
                    , key 
                );
                return;
            }
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
        if( !( paths && paths.length ) ) return;

        var group = new THREE.Group();
        let meshlist = [];
        group.scale.y *= -1;
        for ( var i = 0; i < paths.length; i ++ ) {
            var path = paths[ i ];
            var material = new THREE.MeshBasicMaterial( {
                color: path.color,
                side: THREE.DoubleSide,
                depthWrite: false
            } );
            var shapes = path.toShapes( true );
            for ( var j = 0; j < shapes.length; j ++ ) {
                var shape = shapes[ j ];
                var geometry = new THREE.ShapeBufferGeometry( shape );
                var mesh = new THREE.Mesh( geometry, material );
                meshlist.push( mesh );

                group.add( mesh );
            }
        }


        var box = new THREE.Box3().setFromObject( group );
        let size = box.getSize( new THREE.Vector3 );

        //console.log( size, box.min, box.max );

        var x = -box.max.x / 2 - box.min.x / 2
            , y = -box.max.y / 2 - box.min.y / 2
            ;

        group.position.x = x;
        group.position.y = y;

        //console.log( x, y );

        meshlist.map( sitem => {
            //console.log( sitem.position );
            /*
            sitem.position.x = x;
            sitem.position.y = y;
            */
        });
        
        var pivot = new THREE.Object3D();
        pivot.add( group );

        this.scene.add( pivot );

        let data = { ele: pivot, item: item, meshlist: meshlist  };

        this._images.push( data );

         item.rotation && this.rotationBg.push( data );

        this.render();

        this.animationBg();
    }

    animate() {
        if( this.isDestroy ) return;
        if( !this.rotationBg.length ) return;
        if( !this.isAnimation() ) return;

        requestAnimationFrame( ()=>{ this.animate() } );
    }

    animationBg(){
        if( this.isDestroy ) return;
        if( !this.rotationBg.length ) return;
        if( !this.isAnimation() ) return;
        //return;
    
        //logic

        if( this._images && this._images.length ){
            this._images.map( ( item ) => {
                item.ele.rotation[ 
                    this.getRotationAttr( item ) 
                ] += this.getRotationStep( item );
            });

            this.render();
        };

        window.requestAnimationFrame( ()=>{ this.animationBg() } );
    }

    getRotationAttr( item ){
        let r = 'y';

        if( ju.jsonInData( item, 'item.opt.rotationAttr' ) ){
            r = item.item.opt.rotationAttr;
        }

        return r;
    }

    getRotationStep( item ){
        let r = 0.03;

        if( ju.jsonInData( item, 'item.opt.rotationStep' ) ){
            r = item.item.opt.rotationStep;
        }

        return r;
    }


}
