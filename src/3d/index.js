
import VisChartBase from './common/threebase.js';

import ju from 'json-utilsx';

import THREE from '../utils/three.js';

export default class VisThree extends VisChartBase {
    constructor( box, width, height ){
        super( box, width, height );

        this.ins = [];
        this.legend = null;

        this._setSize( width, height );

    }
    
    update( data, ignoreLegend, redraw = true ){

        this.scene = new THREE.Scene();

        this.camera = new THREE.PerspectiveCamera( 50, this.width / this.height, 1, 10000 );
        this.camera.position.set( 0, 0, 100 )


        var loader = new THREE.SVGLoader();
        loader.load( './img/dount-in.svg', paths => {
            /*
            */
            var group = new THREE.Group();
            //group.scale.multiplyScalar( -1 );
            group.position.x = -58;
            group.position.y = 65;
            group.scale.y *= -1;

            console.log( 1111111111111 );
            for ( var i = 0; i < paths.length; i ++ ) {
                var path = paths[ i ];

                //console.log( i, path );
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
                    group.add( mesh );
                }
            }
            this.scene.add( group );

            this.group = group;

            /*
            this.group = new THREE.SVGObject( paths );
            this.scene.add( this.group );
            */
            
            console.log( 'group', this.group );

            this.render();
        } );


        let renderer = this.renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true } );
        //renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setSize( this.width - 2, this.height - 2 );

        this.render();

        this.box.appendChild( renderer.domElement );

        this.animate();
    }

    animate() {

        //this.group && ( this.group.rotation.y += 0.01 );

        this.render();

        requestAnimationFrame( ()=>{ this.animate() } );
    }

    render() {
        this.renderer.render( this.scene, this.camera );
    }
}

