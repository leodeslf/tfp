/**
 * 
 */


import { canA, ctxA } from '../UIs/perlin_UI.js';
import FFDot from '../libs/FlowField_Dot.js';
import PERLIN from '../libs/Perlin.js';
import { PI } from '../libs/utils.js';
import Vector from '../libs/Vector.js';

const M = 5; // margin
const DTA = .01;
const DOTS1 = 128;

let rafA;
let timeA = Math.random() * 256;
let gridA = 16;
let gridA05 = gridA * .5;
let vecRad = gridA05;
let vecArrayA = [];
let dotArrayA = [];

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

function loopFFA() {
    // Canvas A loop
    vecArrayA = createVecArray(
        timeA, gridA, canA.width,
        canA.height, gridA * 15, 3
    );
    ctxA.clearRect(0, 0, canA.width, canA.height);
    for (let y = 0; y < canA.height; y += gridA) {
        for (let x = 0; x < canA.width; x += gridA) {
            let data = vecArrayA[
                (y / gridA) * (canA.width / gridA) + (x / gridA)
            ];

            // Flags
            let a = new Vector(
                (x + gridA05 - data.x * .5) - data.y * .25,
                (y + gridA05 - data.y * .5) + data.x * .25
            ), b = new Vector(
                (x + gridA05 - data.x * .5) + data.y * .25,
                (y + gridA05 - data.y * .5) - data.x * .25
            ), c = new Vector(
                x + gridA05 + data.x * .75,
                y + gridA05 + data.y * .75
            );

            ctxA.beginPath();
            ctxA.strokeStyle = '#808080';
            ctxA.lineWidth = .5;
            ctxA.moveTo(a.x, a.y);
            ctxA.lineTo(b.x, b.y);
            ctxA.lineTo(c.x, c.y);
            ctxA.lineTo(a.x, a.y);
            ctxA.stroke();
            ctxA.closePath();
        }
    }
    for (let i = 0; i < dotArrayA.length; i++) {
        let pos = new Vector(0, 0), vel = new Vector(0, 0);
        dotArrayA[i].target = vecArrayA;
        dotArrayA[i].update();
        pos.copy(dotArrayA[i].pos);
        vel.copy(dotArrayA[i].vel);
        vel.normalize();

        // Birds
        let a = new Vector(
            (pos.x - vel.x * 4.5) - vel.y * 3,
            (pos.y - vel.y * 4.5) + vel.x * 3
        ), b = new Vector(
            (pos.x - vel.x * 4.5) + vel.y * 3,
            (pos.y - vel.y * 4.5) - vel.x * 3
        ), c = new Vector(
            pos.x + vel.x * 4.5,
            pos.y + vel.y * 4.5
        );

        ctxA.beginPath();
        ctxA.lineCap = 'butt';
        ctxA.lineWidth = 1;
        ctxA.strokeStyle = '#342418';
        // #f0f0f0
        ctxA.fillStyle = '#b57445';
        ctxA.moveTo(a.x, a.y);
        ctxA.lineTo(b.x, b.y);
        ctxA.lineTo(c.x, c.y);
        ctxA.lineTo(a.x, a.y);
        ctxA.closePath();
        ctxA.stroke();
        ctxA.fill();

        // middle line
        /* ctxA.beginPath();
        ctxA.strokeStyle = 'red'
        ctxA.moveTo(pos.x, pos.y);
        ctxA.lineTo(pos.x + vel.x*20, pos.y + vel.y*20);
        ctxA.stroke();
        ctxA.closePath(); */
    }
    timeA += DTA;
    rafA = requestAnimationFrame(loopFFA);
}
function resetFFA() {
    timeA = Math.random() * 256;
    vecArrayA = createVecArray(
        timeA, gridA, canA.width,
        canA.height, gridA * 15, 3
    );
    let b1 = new Vector(canA.width, canA.height);
    dotArrayA = createDotArray(
        DOTS1, 'infinite', b1, vecArrayA, dotArrayA, gridA,
        (Math.random() * .04) + .07, 1.5
    );
}

function initFFA() {
    cancelAnimationFrame(rafA);
    resetFFA();
    loopFFA();
}

export { initFFA, M };