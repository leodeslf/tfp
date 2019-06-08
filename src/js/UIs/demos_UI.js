/**
 * 
 */

import { pp, startPPLoop } from '../loops/perlin_loop.js';
import { wp, startWPLoop, initSpots } from '../loops/worley_loop.js';
import { elemId } from '../libs/utils.js';

let demoPerlin = document.createElement('canvas');
let demoWorley = document.createElement('canvas');
demoPerlin.id = 'demo_perlin_canvas';
demoWorley.id = 'demo_worley_canvas';
demoPerlin.width = demoWorley.width = 270;
demoPerlin.height = demoWorley.height = 120;
let demoPC = demoPerlin.getContext('2d');
let demoWC = demoWorley.getContext('2d');

let tempCanvas = document.createElement('canvas');
let tempC = tempCanvas.getContext('2d');
let colorImg = new Image(256, 32);
colorImg.src =
    'images/textures/blanco_negro.png';
colorImg.onload = () => {
    tempC.drawImage(colorImg, 0, 0);
    pp.colorData = tempC.getImageData(0, 0, 256, 1).data;
}

// perlin
pp.amplitude = 420;
pp.octaves = 6;
pp.dataSize = 1;
pp.deltaT = 0.012;
pp.height = demoPerlin.height;
pp.localCtx = demoPC;
pp.resolution = { x: 126, y: 126 };
pp.type = '3D';
pp.width = demoPerlin.width;

// worley
wp.base = 0;
wp.fade = true;
wp.invert = true;
wp.height = demoWorley.height;
wp.localCtx = demoWC;
wp.mult = 6;
wp.width = demoWorley.width;

window.addEventListener('load', () => {
    elemId('perlin_focus').appendChild(demoPerlin);
    elemId('worley_focus').appendChild(demoWorley);

    // init perlin demo
    startPPLoop();

    // init worley demo
    initSpots(15, .35);
    startWPLoop();

    tempCanvas = tempC = null;
});