
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
        if( !( paths && paths.length ) ) return;

        var geometry = new THREE.CircleGeometry( 20, 32 );
        var material = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
        var circle = new THREE.Mesh( geometry, material );
        material.wireframe = true;
        this.scene.add( circle );

        console.log( 'circle', circle.position );

        console.log( item );

        var group = new THREE.Group();
        //group.scale.multiplyScalar( 0.1 );
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

                //mesh.position.y = -this.height/2 + item.height + item.offsetY;
                /*
                */
                group.add( mesh );
            }
        }
        this.group = group;
        this.scene.add( group );

        var box = new THREE.Box3().setFromObject( group );
        console.log( box, box.size() );
        this.group.position.x = -box.size().x + item.width / 2  / 2; 
        this.group.position.y = box.size().y;

        this.render();

        this.animate();
    }

    animate() {
        return;

        this.group && ( this.group.rotation.y += 0.03 );
        this.render();
        requestAnimationFrame( ()=>{ this.animate() } );
    }



}
