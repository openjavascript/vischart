
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

        this.camera = new THREE.PerspectiveCamera( 50, this.width / this.height, 1, 1000 );
        this.camera.position.set( 0, 0, 20 )


        var loader = new THREE.SVGLoader();
        loader.load( './img/dount-in.svg', ( paths ) => {
        //loader.load( './img/tiger.svg', ( paths ) => {

            var group = new THREE.Group();
            group.scale.multiplyScalar( 0.1 );
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
                    mesh.position.x = -59.5;
                    mesh.position.y = -65;
                    group.add( mesh );
                }
            }
            this.group = group;
            this.scene.add( group );

            console.log( 'group', this.group  );

            this.render();
        } );


        /*
        var geometry = new THREE.SphereGeometry( 30, 32, 32 );
        var material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
        material.wireframe = true;
        this.sphere = new THREE.Mesh( geometry, material );
        console.log( this.sphere, material, geometry );
        this.scene.add( this.sphere );
        */


        let renderer = this.renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true } );
        //let renderer = this.renderer = new THREE.SVGRenderer( );
        //renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setSize( this.width - 2, this.height - 2 );

        this.render();

        this.box.appendChild( renderer.domElement );

        this.animate();
    }

    animate() {

        this.group && ( this.group.rotation.y -= 0.03 );
        this.sphere && ( this.sphere.rotation.y += 0.01 );

        this.render();

        requestAnimationFrame( ()=>{ this.animate() } );
    }

    render() {
        this.renderer.render( this.scene, this.camera );
    }
}

