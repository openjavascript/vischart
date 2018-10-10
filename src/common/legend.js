
import VisChartBase from '../common/vischartbase.js';
import * as geometry from '../geometry/geometry.js';

import Konva from 'konva';
import ju from 'json-utilsx';

import * as utils from '../common/utils.js';


export default class Legend extends VisChartBase  {
    constructor( box, width, height ){
        super( box, width, height );

        this.name = 'Legend ' + Date.now();


        this.init();
    }

    init(){
        return this;
    }

}
