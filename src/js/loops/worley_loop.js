/**
 * 
 */

import WORLEY from '../libs/Worley.js';
import Spot from '../libs/Worley_Spot.js'
//import Vector from '../libs/Vector.js';

// Worley Params
let wp = {
    type: 'st',
    flat: false,
    fade: false,
    animation: true,
    base: 0,
    mult: 2,
    spots: [],
    width: 256,
    height: 256,
    localCtx: undefined,
    fps: 0,
    debug: false,
    invert: false
}

let count = 0;
let fps19 = 0;

let raf = 0;
let dataArray = [];
let imageData = new ImageData(wp.width, wp.height);

// Process
function startWPLoop() {
    cancelAnimationFrame(raf);
    switch (wp.type) {
        case 'st': dataSt(); break;
        case 'nd': dataNd(); break;
        case 'ndMinusSt': dataNdMinusSt(); break;
        case 'manhattan': dataManhattan(); break;
        case 'chebyshev': dataChebyshev(); break;
        case 'minkowski': dataMinkowski(); break;
    }
}
function initSpots(spots, maxVel) {
    wp.spots = [];
    for (let i = 0; i < spots; i++) {
        wp.spots[i] = new Spot(
            Math.random() * wp.width,
            Math.random() * wp.height,
            maxVel
        );
    }
}
function dataToImage() {
    // Set value for RGBA
    imageData = new ImageData(wp.width, wp.height);
    for (let y = 0; y < wp.height; y++) {
        for (let x = 0; x < wp.width; x++) {
            let pxXY = (y * wp.width + x) * 4;
            let data = dataArray[pxXY / 4];
            if (!wp.flat) {
                if (wp.fade) { 
                    // Faded color
                    data.minDist = fade(data.minDist / 100) * 100; 
                }
                if (!wp.invert) {
                    // Normal color
                    for (let rgba = 0; rgba < 4; rgba++) {
                        imageData.data[pxXY + rgba] =
                            ((data.minDist * wp.mult) - wp.base);
                    }
                } else {
                    // Inverted color
                    for (let rgba = 0; rgba < 4; rgba++) {
                        imageData.data[pxXY + rgba] =
                            255 - ((data.minDist * wp.mult) - wp.base);
                    }
                }
            } else {
                // Colored color
                imageData.data[pxXY + 0] = data.minPoint.col.r;
                imageData.data[pxXY + 1] = data.minPoint.col.g;
                imageData.data[pxXY + 2] = data.minPoint.col.b;
                imageData.data[pxXY + 3] = 255;
            }
        }
    }
}
function printImage() {
    wp.localCtx.clearRect(0, 0, wp.width, wp.height);
    wp.localCtx.putImageData(imageData, 0, 0);
}
function runAnimation() {
    printImage();
    if (wp.animation) {
        wp.spots.forEach(spot => {
            spot.update();
            if (wp.debug) {
                wp.localCtx.beginPath();
                wp.localCtx.strokeStyle = 'lime';
                wp.localCtx.lineWidth = 1;
                wp.localCtx.moveTo(spot.pos.x, spot.pos.y);
                wp.localCtx.lineTo(
                    spot.pos.x + spot.vel.x * 50,
                    spot.pos.y + spot.vel.y * 50);
                wp.localCtx.stroke();
                wp.localCtx.fillStyle = 'blue';
                wp.localCtx.fillRect(spot.pos.x - 2, spot.pos.y - 2, 4, 4);
                wp.localCtx.closePath();
            }
        });
        if (wp.fps !== 0) printFPS();
    }
}
function fade(t) {
    return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);
}
function printFPS() {
    if (count <= 0) {
        fps19 = (wp.fps > 60) ? 60 : wp.fps;
    } else if (count >= 19) count = -1;
    const COL =
        fps19 >= 50 ? '#3F3' :
            fps19 >= 30 ? '#FF3' :
                fps19 >= 10 ? '#FFF' : '#F33';
    wp.localCtx.fillStyle = 'rgba(0, 0, 0, .6)';
    wp.localCtx.fillRect(wp.localCtx.canvas.width - 47, 0, 47, 18);
    wp.localCtx.fillStyle = '#000';
    wp.localCtx.fillRect(wp.localCtx.canvas.width - 48, 0, 1, 18);
    wp.localCtx.fillRect(wp.localCtx.canvas.width - 48, 18, 49, 1);
    wp.localCtx.font = '12px Roboto';
    wp.localCtx.textAlign = 'right';
    wp.localCtx.fillStyle = COL;
    wp.localCtx.fillText(fps19 + ' FPS', wp.localCtx.canvas.width - 5, 14);
    count++;
}
const setFPSW = x => wp.fps = x;

// Loops
function dataSt() {
    for (let y = 0; y < wp.height; y++) {
        for (let x = 0; x < wp.width; x++) {
            dataArray[(y * wp.width + x)] =
                WORLEY.st(wp.spots, { x, y });
        }
    }
    dataToImage();
    runAnimation();
    raf = requestAnimationFrame(dataSt);
}
function dataNd() {
    for (let y = 0; y < wp.height; y++) {
        for (let x = 0; x < wp.width; x++) {
            dataArray[(y * wp.width + x)] =
                WORLEY.nd(wp.spots, { x, y });
        }
    }
    dataToImage();
    runAnimation();
    raf = requestAnimationFrame(dataNd);
}
function dataNdMinusSt() {
    for (let y = 0; y < wp.height; y++) {
        for (let x = 0; x < wp.width; x++) {
            dataArray[(y * wp.width + x)] =
                WORLEY.ndMinusSt(wp.spots, { x, y });
        }
    }
    dataToImage();
    runAnimation();
    raf = requestAnimationFrame(dataNdMinusSt);
}
function dataManhattan() {
    for (let y = 0; y < wp.height; y++) {
        for (let x = 0; x < wp.width; x++) {
            dataArray[(y * wp.width + x)] =
                WORLEY.manhattan(wp.spots, { x, y });
        }
    }
    dataToImage();
    runAnimation();
    raf = requestAnimationFrame(dataManhattan);
}
function dataChebyshev() {
    for (let y = 0; y < wp.height; y++) {
        for (let x = 0; x < wp.width; x++) {
            dataArray[(y * wp.width + x)] =
                WORLEY.chebyshev(wp.spots, { x, y });
        }
    }
    dataToImage();
    runAnimation();
    raf = requestAnimationFrame(dataChebyshev);
}
function dataMinkowski() {
    for (let y = 0; y < wp.height; y++) {
        for (let x = 0; x < wp.width; x++) {
            dataArray[(y * wp.width + x)] =
                WORLEY.minkowski(wp.spots, { x, y });
        }
    }
    dataToImage();
    runAnimation();
    raf = requestAnimationFrame(dataMinkowski);
}

export { wp, startWPLoop, initSpots, setFPSW };