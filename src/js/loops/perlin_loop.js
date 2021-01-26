/**
 * 
 */

import PERLIN from '../libs/Perlin.js';
import { PI } from '../libs/utils.js';
import Vector from '../libs/Vector.js';

let raf = 0;
let noiseArray = [];

let count = 0;
let fps19 = 0;

// Perlin Params
let pp = {
    deltaT: 0.01,
    type: "3D",
    colorData: null,
    resolution: { x: 256, y: 256 },
    traslation: { x: 0, y: 0 },
    dataSize: 2,
    frequency: 1,
    amplitude: 255,
    octaves: 6,
    lacunarity: 2,
    persistence: 0.5,
    width: 256,
    height: 256,
    animation: true,
    t: 0,
    localCtx: undefined,
    fps: 0
}

// Process
function startPPLoop() {
    cancelAnimationFrame(raf);
    switch (pp.type) {
        case '1D': data_print1D(); break;
        case '2D': data2D(); break;
        case '3D': data3D(); break;
        case '3D_Ridge': data3DRidge(); break;
        case '3D_Flow': data3DFlow(); break;
        case '3D_SinX': data3DSinX(); break;
        case '3D_SinXRidge': data3DSinXRidge(); break;
        case '3D_Flame': data3DFlame(); break;
        case '3D_C': data3DC(); break;
        case '3D_CRidge': data3DCRidge(); break;
    }
}
function printData() {
    // The actual noiseArray's data creation
    let noiseImageData = new ImageData(pp.width, pp.height);
    for (let y = 0; y < pp.height; y += pp.dataSize) {
        for (let x = 0; x < pp.width; x += pp.dataSize) {
            for (let subY = 0; subY < pp.dataSize; subY++) {
                for (let subX = 0; subX < pp.dataSize; subX++) {
                    // Edge Ctrl
                    if (x + subX >= pp.width) break;
                    // Actual pixel pp.to work on
                    let pxXY = ((y + subY) * pp.width + (x + subX)) * 4;
                    if (pp.colorData !== null) {
                        // noiseArray data (to use as index)
                        let dataZ = Math.round(noiseArray[
                            (y / pp.dataSize) *
                            (pp.width / pp.dataSize) +
                            (x / pp.dataSize)
                        ]);
                        // RGBA limits [0...255]
                        if (dataZ < 0) dataZ = 0;
                        if (dataZ > 255) dataZ = 255;
                        // ch = channel (RGBA)
                        for (let ch = 0; ch < 4; ch++) {
                            // Value based color substitution
                            noiseImageData.data[pxXY + ch] =
                                pp.colorData[dataZ * 4 + ch];
                        }
                    } else {
                        // noiseArray data
                        let dataZ = noiseArray[
                            (y / pp.dataSize) *
                            (pp.width / pp.dataSize) +
                            (x / pp.dataSize)
                        ];
                        // ch = channel (RGBA)
                        for (let ch = 0; ch < 4; ch++) {
                            noiseImageData.data[pxXY + ch] = dataZ;
                        }
                    }
                }
            }
        }
    }
    pp.localCtx.clearRect(0, 0, pp.width, pp.height);
    pp.localCtx.putImageData(noiseImageData, 0, 0);
}
function runTime() {
    if (pp.animation) {
        pp.t += pp.deltaT;
        if (pp.fps !== 0) printFPS();
    }
}
function printFPS() {
    if (count <= 0) {
        fps19 = (pp.fps > 60) ? 60 : pp.fps;
    } else if (count >= 19) count = -1;
    const COL =
        fps19 >= 50 ? '#3F3' :
            fps19 >= 30 ? '#FF3' :
                fps19 >= 10 ? '#FFF' : '#F33';
    pp.localCtx.fillStyle = 'rgba(0, 0, 0, .6)';
    pp.localCtx.fillRect(pp.localCtx.canvas.width - 47, 0, 47, 18);
    pp.localCtx.fillStyle = '#000';
    pp.localCtx.fillRect(pp.localCtx.canvas.width - 48, 0, 1, 18);
    pp.localCtx.fillRect(pp.localCtx.canvas.width - 48, 18, 49, 1);
    pp.localCtx.font = '12px Roboto';
    pp.localCtx.textAlign = 'right';
    pp.localCtx.fillStyle = COL;
    pp.localCtx.fillText(fps19 + ' FPS', pp.localCtx.canvas.width - 5, 14);
    count++;
}
function fade(t) {
    return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);
}
const setFPSP = x => pp.fps = x;

// Loops
function data_print1D() {
    let u, n, f2, a05, maxA;
    for (let x = 0; x < pp.width; x++) {
        u = (pp.traslation.x + x) / pp.resolution.x;
        n = 0.0;
        f2 = pp.frequency;
        a05 = 1.0;
        maxA = 0.0;
        for (let k = 0; k < pp.octaves; k++, maxA += a05,
            f2 *= pp.lacunarity, a05 *= pp.persistence) {
            // value plus K to avoid the 'center artifact'
            n = n + PERLIN.noise1D((u + k) * f2 + pp.t) * a05;
        }
        n = n / maxA;
        n = n * pp.amplitude;
        n = n + pp.height / 2;
        noiseArray[x] = n;
    }
    // Print
    pp.localCtx.clearRect(0, 0, pp.width, pp.height);
    for (let x = 0; x < pp.width; x++) {
        pp.localCtx.beginPath();
        pp.localCtx.strokeStyle = 'white';
        pp.localCtx.lineWidth = .75;
        pp.localCtx.moveTo(x, noiseArray[x]);
        pp.localCtx.lineTo(x + 1, (noiseArray[x + 1] !== undefined ?
            noiseArray[x + 1] : noiseArray[x]));
        pp.localCtx.stroke();
        pp.localCtx.closePath();
    }
    runTime();
    raf = requestAnimationFrame(data_print1D);
}
function data2D() {
    let u, v, n, f2, a05, maxA;
    for (let y = 0; y < pp.height; y += pp.dataSize) {
        for (let x = 0; x < pp.width; x += pp.dataSize) {
            u = (pp.traslation.x + x) / pp.resolution.x;
            v = (pp.traslation.y + y) / pp.resolution.y;
            n = 0.0;
            f2 = pp.frequency;
            a05 = 1.0;
            maxA = 0.0;
            for (let k = 0; k < pp.octaves; k++, maxA += a05,
                f2 *= pp.lacunarity, a05 *= pp.persistence) {
                // value plus K pp.to avoid pp.the 'center artifact'
                n = n + PERLIN.noise2D(
                    (u + k) * f2 + pp.t,
                    (v + k) * f2 + pp.t
                ) * a05;
            }
            n = n / maxA;
            n = (n + 1) * .5;
            n = n * pp.amplitude;
            n = n + (255 - pp.amplitude) * .5;
            noiseArray[
                (y / pp.dataSize) *
                (pp.width / pp.dataSize) +
                (x / pp.dataSize)
            ] = n;
        }
    }
    printData();
    runTime();
    raf = requestAnimationFrame(data2D);
}
function data3D() {
    let u, v, n, f2, a05, maxA;
    for (let y = 0; y < pp.height; y += pp.dataSize) {
        for (let x = 0; x < pp.width; x += pp.dataSize) {
            u = (pp.traslation.x + x) / pp.resolution.x;
            v = (pp.traslation.y + y) / pp.resolution.y;
            n = 0.0;
            f2 = pp.frequency;
            a05 = 1.0;
            maxA = 0.0;
            for (let k = 0; k < pp.octaves; k++, maxA += a05,
                f2 *= pp.lacunarity, a05 *= pp.persistence) {
                // value plus K pp.to avoid pp.the 'center artifact'
                n = n + PERLIN.noise3D(
                    (u + k) * f2,
                    (v + k) * f2,
                    pp.t
                ) * a05;
            }
            n = n / maxA;
            n = (n + 1) * .5;
            n = n * pp.amplitude;
            n = n + (255 - pp.amplitude) * .5;
            noiseArray[
                (y / pp.dataSize) *
                (pp.width / pp.dataSize) +
                (x / pp.dataSize)
            ] = n;
        }
    }
    printData();
    runTime();
    raf = requestAnimationFrame(data3D);
}
function data3DFlow() {
    let u, v, n, f2, a05, maxA, rot, len, dis;
    for (let y = 0; y < pp.height; y += pp.dataSize) {
        for (let x = 0; x < pp.width; x += pp.dataSize) {
            rot = 0;
            len = 0;
            f2 = pp.frequency;
            a05 = 1.0;
            maxA = 0.0;
            for (let k = 0; k < 5; k++, maxA += a05, f2 *= pp.lacunarity,
                a05 *= pp.persistence) {
                // value plus K to avoid the 'center artifact'
                rot = rot + PERLIN.noise3D(
                    ((pp.traslation.x + x) / pp.resolution.x + k) * f2,
                    ((pp.traslation.y + y) / pp.resolution.y + k) * f2,
                    pp.t
                ) * a05;
            }
            rot = rot / maxA;
            // Same value, different application
            len = rot;
            rot = rot * (PI * 2.5);
            len = len * 32;
            dis = Vector.byPolarCoords(len, rot);
            u = (pp.traslation.x + x + dis.x) / pp.resolution.x;
            v = (pp.traslation.y + y + dis.y) / pp.resolution.y;
            n = 0.0;
            f2 = pp.frequency;
            a05 = 1.0;
            maxA = 0.0;
            for (let k = 0; k < pp.octaves; k++, maxA += a05,
                f2 *= pp.lacunarity, a05 *= pp.persistence) {
                // value plus K to avoid the 'center artifact'
                n = n + PERLIN.noise3D(
                    (u + k) * f2,
                    (v + k) * f2,
                    pp.t
                ) * a05;
            }
            n = n / maxA;
            n = (n + 1) * .5;
            n = n * pp.amplitude;
            n = n + (255 - pp.amplitude) * .5;
            noiseArray[
                (y / pp.dataSize) *
                (pp.width / pp.dataSize) +
                (x / pp.dataSize)
            ] = n;
        }
    }
    printData();
    runTime();
    raf = requestAnimationFrame(data3DFlow);
}
function data3DRidge() {
    let u, v, n, nAux, f2, a05, maxA;
    for (let y = 0; y < pp.height; y += pp.dataSize) {
        for (let x = 0; x < pp.width; x += pp.dataSize) {
            nAux = 0;
            u = (pp.traslation.x + x) / pp.resolution.x;
            v = (pp.traslation.y + y) / pp.resolution.y;
            n = 0.0;
            f2 = pp.frequency * .5;
            a05 = 1.0;
            maxA = 0.0;
            for (let k = 0; k < pp.octaves; k++, maxA += a05,
                f2 *= pp.lacunarity, a05 *= pp.persistence) {
                // value plus K to avoid the 'center artifact'
                nAux = PERLIN.noise3D((u + k) * f2, (v + k) * f2, pp.t);
                n = n + (nAux > 0 ? nAux : -nAux) * a05;
            }
            n = n / maxA;
            n = n * 1.65;
            //n = (n + 1) * .5;
            n = 1 - n;
            n = n * pp.amplitude;
            n = n + (255 - pp.amplitude) * .5;
            noiseArray[
                (y / pp.dataSize) *
                (pp.width / pp.dataSize) +
                (x / pp.dataSize)
            ] = n;
        }
    }
    printData();
    runTime();
    raf = requestAnimationFrame(data3DRidge);
}
function data3DSinX() {
    let u, v, n, f2, a05, maxA;
    for (let y = 0; y < pp.height; y += pp.dataSize) {
        for (let x = 0; x < pp.width; x += pp.dataSize) {
            u = (pp.traslation.x + x) / pp.resolution.x;
            v = (pp.traslation.y + y) / pp.resolution.y;
            n = 0.0;
            f2 = pp.frequency;
            a05 = 1.0;
            maxA = 0.0;
            for (let k = 0; k < pp.octaves; k++, maxA += a05,
                f2 *= pp.lacunarity, a05 *= pp.persistence) {
                // value plus K pp.to avoid pp.the 'center artifact'
                n = n + PERLIN.noise3D(
                    (u + k) * f2,
                    (v + k) * f2,
                    pp.t
                ) * a05;
            }
            n = n / maxA; // range -1 - 1
            n = Math.sin((x + n) * 25);
            n = (n + 1) * .5; // range 0 - 1
            n = n * pp.amplitude; // range 0 - a
            n = n + (255 - pp.amplitude) * .5; // centering
            noiseArray[
                (y / pp.dataSize) *
                (pp.width / pp.dataSize) +
                (x / pp.dataSize)
            ] = n;
        }
    }
    printData();
    runTime();
    raf = requestAnimationFrame(data3DSinX);
}
function data3DSinXRidge() {
    let u, v, n, nAux, f2, a05, maxA;
    for (let y = 0; y < pp.height; y += pp.dataSize) {
        for (let x = 0; x < pp.width; x += pp.dataSize) {
            nAux = 0;
            u = (pp.traslation.x + x) / pp.resolution.x;
            v = (pp.traslation.y + y) / pp.resolution.y;
            n = 0.0;
            f2 = pp.frequency;
            a05 = 1.0;
            maxA = 0.0;
            for (let k = 0; k < pp.octaves; k++, maxA += a05,
                f2 *= pp.lacunarity, a05 *= pp.persistence) {
                // value plus K pp.to avoid pp.the 'center artifact'
                nAux = PERLIN.noise3D((u + k) * f2, (v + k) * f2, pp.t);
                n = n + (nAux > 0 ? nAux : -nAux) * a05;
            }
            n = n / maxA;
            n = Math.sin((x + n) * 25);
            n = (n + 1) * .5;
            n = n * pp.amplitude;
            n = n + (255 - pp.amplitude) * .5;
            noiseArray[
                (y / pp.dataSize) *
                (pp.width / pp.dataSize) +
                (x / pp.dataSize)
            ] = n;
        }
    }
    printData();
    runTime();
    raf = requestAnimationFrame(data3DSinXRidge);
}
function data3DFlame() {
    let u, v, n, f2, a05, maxA;
    for (let y = 0; y < pp.height; y += pp.dataSize) {
        for (let x = 0; x < pp.width; x += pp.dataSize) {
            u = (pp.traslation.x + x) / pp.resolution.x;
            v = (pp.traslation.y + y) / pp.resolution.y;
            n = 0.0;
            f2 = pp.frequency;
            a05 = 1.0;
            maxA = 0.0;
            for (let k = 0; k < pp.octaves; k++, maxA += a05,
                f2 *= pp.lacunarity, a05 *= pp.persistence) {
                // value plus K pp.to avoid pp.the 'center artifact'
                n = n + PERLIN.noise3D(
                    (u + k) * f2,
                    (v + k) * f2 + pp.t * 4,
                    pp.t
                ) * a05;
            }
            n = n / maxA;
            n = Math.sin(
                ((x / pp.width + n) / 1) * PI) -
                ((pp.height - y) / pp.height * 2);
            n = (n + 1) * .5;
            n = n * pp.amplitude;
            n = n + (255 - pp.amplitude) * .5;
            noiseArray[
                (y / pp.dataSize) *
                (pp.width / pp.dataSize) +
                (x / pp.dataSize)
            ] = n;
        }
    }
    printData();
    runTime();
    raf = requestAnimationFrame(data3DFlame);
}
function data3DC() {
    let u, v, n, f2, a05, maxA;
    let pos, c, dist, maxDist
    pos = new Vector(0, 0);
    c = new Vector(pp.width * .5, pp.height * .5);
    dist = 0;
    maxDist = Math.sqrt(pp.width * pp.width * .5 +
        pp.height * pp.height * .5);
    for (let y = 0; y < pp.height; y += pp.dataSize) {
        pos.y = y;
        for (let x = 0; x < pp.width; x += pp.dataSize) {
            pos.x = x;
            dist = Vector.distanceEuclidian(pos, c);
            dist = fade(dist / maxDist) * maxDist;
            u = (pp.traslation.x + x) / pp.resolution.x;
            v = (pp.traslation.y + y) / pp.resolution.y;
            n = 0.0;
            f2 = pp.frequency;
            a05 = 1.0;
            maxA = 0.0;
            for (let k = 0; k < pp.octaves; k++, maxA += a05,
                f2 *= pp.lacunarity, a05 *= pp.persistence) {
                // value plus K pp.to avoid pp.the 'center artifact'
                n = n + PERLIN.noise3D(
                    (u + k) * f2,
                    (v + k) * f2,
                    pp.t * 4 + Math.cos(dist / 64)
                ) * a05;
            }
            n = n / maxA;
            n = (n + 1) * .5;
            n = (n - (dist / maxDist));
            n = n * pp.amplitude;
            n = n + (255 - pp.amplitude) * .5;
            noiseArray[
                (y / pp.dataSize) *
                (pp.width / pp.dataSize) +
                (x / pp.dataSize)
            ] = n;
        }
    }
    printData();
    runTime();
    raf = requestAnimationFrame(data3DC);
}
function data3DCRidge() {
    let u, v, n, nAux, f2, a05, maxA;
    let pos, c, dist, maxDist
    pos = new Vector(0, 0);
    c = new Vector(pp.width * .5, pp.height * .5);
    dist = 0;
    maxDist = Math.sqrt(pp.width * pp.width * .5 +
        pp.height * pp.height * .5);
    for (let y = 0; y < pp.height; y += pp.dataSize) {
        pos.y = y;
        for (let x = 0; x < pp.width; x += pp.dataSize) {
            nAux = 0;
            pos.x = x;
            dist = Vector.distanceEuclidian(pos, c);
            dist = fade(dist / maxDist) * maxDist;
            u = (pp.traslation.x + x) / pp.resolution.x;
            v = (pp.traslation.y + y) / pp.resolution.y;
            n = 0.0;
            f2 = pp.frequency;
            a05 = 1.0;
            maxA = 0.0;
            for (let k = 0; k < pp.octaves; k++, maxA += a05,
                f2 *= pp.lacunarity, a05 *= pp.persistence) {
                // value plus K pp.to avoid pp.the 'center artifact'
                nAux = PERLIN.noise3D(
                    (u + k) * f2,
                    (v + k) * f2,
                    pp.t * 4 + Math.cos(dist / 64)
                );
                n = n + (nAux > 0 ? nAux : -nAux) * a05;
            }
            n = n / maxA;
            n = (n + 1) * .5;
            n = (n - (dist / maxDist));
            n = n * pp.amplitude;
            n = n + (255 - pp.amplitude) * .5;
            noiseArray[
                (y / pp.dataSize) *
                (pp.width / pp.dataSize) +
                (x / pp.dataSize)
            ] = n;
        }
    }
    printData();
    runTime();
    raf = requestAnimationFrame(data3DCRidge);
}

export { pp, startPPLoop, setFPSP };