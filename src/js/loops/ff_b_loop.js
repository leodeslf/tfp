/**
 * 
 */

import { canB, ctxB } from '../UIs/perlin_UI.js';
import FFDot from '../libs/FlowField_Dot.js';
import PERLIN from '../libs/Perlin.js';
import { PI } from '../libs/utils.js';
import Vector from '../libs/Vector.js';

const M = 5; // margin
const MAX_COUNT = 400;
const DTB = .00015;
const DOTS2 = 4096;

let count = 0;
let rafB;
let timeB = Math.random() * 256;
let gridB = 8;
let vecRad = gridB * .5;
let vecArrayB = [];
let dotArrayB = [];
/* let dotAlpha = .03; */

function createVecArray(time, grid, wid, hei, res, revs) {
    let array = new Array;
    let u, v, n, f2, a05, maxA;
    for (let y = 0; y < hei; y += grid) {
        for (let x = 0; x < wid; x += grid) {
            u = x / res, v = y / res;
            n = 0.0, f2 = 1.0, a05 = 1.0, maxA = 0.0;
            for (let k = 0; k < 4; k++ , maxA += a05, f2 *= 2, a05 *= .5) {
                n = n + PERLIN.noise3D(u * f2, v * f2, time) * a05;

            }
            n = n / maxA;
            n = n * (PI * revs); // from [-1, 1] to [-PI, PI]
            array[(y / grid) * (wid / grid) + (x / grid)] =
                Vector.byPolarCoords(vecRad, n);
        }
    }
    return array;
}

function createDotArray(dots, edge, boundary, target, origin, gridSize,
    mass, maxSpeed) {
    let array = new Array;
    for (let i = 0; i < dots; i++) {
        array[i] = new FFDot(
            new Vector(
                Math.floor(M + Math.random() * (boundary.x - (M * 2))),
                Math.floor(M + Math.random() * (boundary.y - (M * 2)))
            ), edge, boundary, target, origin, gridSize,
            mass + (Math.random() * (mass * .25)),
            maxSpeed + Math.random() * (maxSpeed * .1)
        );
        array[i].prevPos.copy(array[i].pos);
    }
    return array;
}

function loopFFB() {
    vecArrayB = createVecArray(
        timeB, gridB, canB.width,
        canB.height, gridB * 20, 2
    );
    // Canvas B loop 255, 245, 204
    for (let i = 0; i < dotArrayB.length; i++) {
        dotArrayB[i].target = vecArrayB;
        dotArrayB[i].update();
        ctxB.beginPath();
        ctxB.strokeStyle = 'rgba(239, 226, 220, 0.06)';
        ctxB.lineCap = 'butt';
        ctxB.lineWidth = .5;
        ctxB.moveTo(dotArrayB[i].prevPos.x, dotArrayB[i].prevPos.y);
        ctxB.lineTo(dotArrayB[i].pos.x, dotArrayB[i].pos.y);
        ctxB.stroke();
        ctxB.closePath();
    }
    // Draw a "progress bar"
    ctxB.fillStyle = 'black';
    ctxB.fillRect(1, ctxB.canvas.height - 5,
        (count / MAX_COUNT) * (canB.width - 2), 1);
    ctxB.fillStyle = 'white';
    ctxB.fillRect(1, ctxB.canvas.height - 4,
        (count / MAX_COUNT) * (canB.width - 2), 3);
    // Auto reset
    if (count > MAX_COUNT) {
        resetFFB();
    }
    // Animation
    timeB += DTB;
    count++;
    rafB = requestAnimationFrame(loopFFB);
}

function resetFFB() {
    count = 0;
    timeB = Math.random() * 256;
    ctxB.clearRect(0, 0, canB.width, canB.height);
    vecArrayB = [];
    vecArrayB = createVecArray(
        timeB, gridB, canB.width,
        canB.height, gridB * 20, 2
    );
    let b2 = new Vector(canB.width, canB.height);
    dotArrayB = [];
    dotArrayB = createDotArray(
        DOTS2, 'replace', b2, vecArrayB, dotArrayB, gridB,
        (Math.random() * .012) + .02, .475
    );
}

function initFFB() {
    cancelAnimationFrame(rafB);
    resetFFB();
    loopFFB();
}

export { initFFB };