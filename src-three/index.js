



import VisChartBase from './common/threebase.js';


import ju from 'json-utilsx';

import three from './utils/three.js';

export default class VisThree extends VisChartBase {
    constructor( box, width, height ){
        super( box, width, height );

        this.ins = [];
        this.legend = null;

        this._setSize( width, height );

        console.log( 222 );

    }
}
