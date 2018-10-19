
import VisChartBase from './common/base.js';

import Dount from './dount/index.js';

import ju from 'json-utilsx';
import * as constant from '../common/constant.js';

import THREE from '../utils/three.js';

export default class VisThree extends VisChartBase {
    constructor( box, width, height ){
        super( box, width, height );

        this.ins = [];
        this.legend = null;

        this._setSize( width, height );

    }


    _setSize( width, height ){

        super._setSize( width, height );

        this.init();

        if( 
            this.legend
            && this.data 
            && this.data.legend 
        ){
            this.legend.resize( this.width, this.height );
            this.legend.update( this.data.legend );
        }

        if( this.data ){
            let tmpredraw = this.redraw;
            this.update( this.data, this.ignoreLegend );
            this.redraw = tmpredraw;
        }
    }

    init(){
        //console.log( 'VisChartBase init', Date.now(), this.width, this.height, this.canvas );

        if( !this.box ) return;

        /*
        if( !this.stage ){
            this.stage = new Konva.Stage( {
                container: this.box
                , width: this.width
                , height: this.height
            });
        }else{
            this.stage.width( this.width );
            this.stage.height( this.height );
        }
        */

        //console.log( this.width, this.height, this.box.offsetWidth, this.box.offsetHeight );
        //console.log( this );

        this.customWidth && ( this.box.style.width = this.customWidth + 'px' );
        this.customHeight && ( this.box.style.height = this.customHeight + 'px' );

        return this;
    }

    update( data, ignoreLegend, redraw = true ){
        this.data = data;
        this.ignoreLegend = ignoreLegend;
        this.redraw = redraw;

        if( !ju.jsonInData( this.data, 'series' ) ) return;

        this.data
        && this.data.legend
        && this.data.legend.data
        && this.data.legend.data.legend
        && this.data.legend.data.map( ( item, key )=> {
            item.realIndex = key;
        });


        this.data
        && this.data.series 
        && this.data.series.length 
        && this.data.series.map( sitem => {
            sitem.data && sitem.data.length 
            && sitem.data.map( ( item, key ) => {
                item.realIndex = key;
            });
        });

        this.clearUpdate();

        //console.log( ju );

        //this.stage.removeChildren();

        //console.log( 'update data', data );

        /*if( ju.jsonInData( this.data, 'legend.data' ) &&  this.data.legend.data.length ){
            if( this.legend && ignoreLegend ){
                this.emptyblock = 'kao';
            }else{
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
        }*/
        this.initChart();
        return this;
    }

    initChart(){

        if( this.ins && this.ins.length &&  !this.redraw  ){
                this.emptyblock = 'kao';
        }else{
            this.ins.map( item => {
                item.destroy();
            });
            this.ins = [];
        }

        this.data.series.map( ( val, key ) => {
            //console.log( val, constant );
            let ins;

            if( this.ins && this.ins.length && this.ins[key] &&  !this.redraw  ){
                ins = this.ins[key];
                ins.width = this.width;
                ins.height = this.height;
            }else{
                switch( val.type ){
                    case constant.CHART_TYPE.dount: {
                        ins = new Dount( this.box, this.width, this.height );
                        break;
                    }
                    /*case constant.CHART_TYPE.gauge: {
                        ins = new Gauge( this.box, this.width, this.height );
                        break;
                    }*/
                }
                if( ins ){
                    this.legend && ins.setLegend( this.legend );
                    ins.setStage( this.stage );
                }
            }

            if( ins ){
                this.options && ( ins.setOptions( this.options ) );
                ins.update( this.getLegendData( val ), ju.clone( this.data ) );

                if( !this.ins[key]  ){
                    this.ins[key] = ins;
                }
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

        //this.clearUpdate();
        this.ins.map( ( item ) => {
            item.destroy();
        });
        this.legend && this.legend.destroy();

        this.stage && this.stage.destroy();
        this.stage = null;
    }

    clearUpdate(){
        this.legend && !this.ignoreLegend && this.legend.destroy();
    }


    
    //update( data, ignoreLegend, redraw = true ){

        //this.scene = new THREE.Scene();

        //this.camera = new THREE.PerspectiveCamera( 40, this.width / this.height, 1, 1000 );
        //this.camera.position.set( 0, 0, 20 )


        //let renderer = this.renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true } );
        ////let renderer = this.renderer = new THREE.SVGRenderer( );
        ////renderer.setPixelRatio( window.devicePixelRatio );
        //renderer.setSize( this.width - 2, this.height - 2 );


        //var loader = new THREE.SVGLoader();

        //var options = {
            //depth: 1
            //, bevelThickness: 1
            //, bevelSize: .5
            //, bevelSegments: 1
            //, bevelEnabled: true
            //, curveSegments: 12
            //, steps: 1
        //};

        ////loader.load( './img/dount-in.svg', ( paths ) => {
        ////loader.load( './img/dount-big-all.svg', ( paths ) => {
        ////loader.load( './img/dount-mid.svg', ( paths ) => {
        ////loader.load( './img/tiger.svg', ( paths ) => {
            //var paths = loader.parse( data.background[0].url );
            //console.log( 'paths', paths );

            //var group = new THREE.Group();
            //group.scale.multiplyScalar( 0.1 );
            //group.scale.y *= -1;
            //for ( var i = 0; i < paths.length; i ++ ) {
                //var path = paths[ i ];
                //var material = new THREE.MeshBasicMaterial( {
                    //color: path.color,
                    //side: THREE.DoubleSide,
                    //depthWrite: false
                //} );
                //var shapes = path.toShapes( true );
                //for ( var j = 0; j < shapes.length; j ++ ) {
                    //var shape = shapes[ j ];
                    //var geometry = new THREE.ShapeBufferGeometry( shape );
                    ////var geometry = new THREE.ExtrudeGeometry( shape, options);
                    //var mesh = new THREE.Mesh( geometry, material );

                    ////viewbox 118, 117 - dount-in.svg
                    //mesh.position.x = -118/2;
                    //mesh.position.y = -117/2;

                    //[>
                    ////viewbox 250 248 - dount-big-all.svg
                    //mesh.position.x = -250/2;
                    //mesh.position.y = -248/2;
                    //*/

                    //[>
                    ////viewbox 107, 106 - dount-mid.svg
                    //mesh.position.x = -107/2;
                    //mesh.position.y = -106/2;
                    //*/

                    //[>
                    ////viewbox tiger.svg
                    //mesh.position.x = -46.5;
                    //mesh.position.y = -( 54.5 + 55 / 2 );
                    //*/

                    //group.add( mesh );
                //}
            //}
            //this.group = group;
            //this.scene.add( group );

            //console.log( 'group', this.group  );

            //this.render();
        ////} );


        //[>
        //var geometry = new THREE.SphereGeometry( 30, 32, 32 );
        //var material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
        //material.wireframe = true;
        //this.sphere = new THREE.Mesh( geometry, material );
        //console.log( this.sphere, material, geometry );
        //this.scene.add( this.sphere );
        //*/

        //this.render();

        //this.box.appendChild( renderer.domElement );

        //this.animate();
    //}

    //animate() {

        //this.group && ( this.group.rotation.y += 0.03 );
        //this.sphere && ( this.sphere.rotation.y += 0.01 );

        //this.render();

        //requestAnimationFrame( ()=>{ this.animate() } );
    //}

    //render() {
        //this.renderer.render( this.scene, this.camera );
    /*}*/
}

