/**
 * 
 */

import { setFPSP } from './perlin_loop.js';
import { setFPSW } from './worley_loop.js';

let frames = [];

function runFpsMeter() {
    const now = performance.now();
    while (frames.length > 0 && frames[0] <= now - 1000) {
        frames.shift();
    }
    frames.push(now);
    setFPSP(frames.length); 
    setFPSW(frames.length);
    requestAnimationFrame(runFpsMeter);
}
// fpsMeter ref.: https://www.growingwiththeweb.com/2017/12/fast-simple-js-fps-counter.html

export { runFpsMeter }