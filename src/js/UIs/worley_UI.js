/**
 * 
 */

import { runFpsMeter } from '../loops/fps_loop.js';
import { elemId, create, getVal } from '../libs/utils.js';
import { wp, startWPLoop, initSpots } from '../loops/worley_loop.js';

let mainCan, mainCtx;
const INPUTS = [
    [0, 4],
    [0, 3],
    [0, 4],
    [0, 3],
    [0, 3],
    [-81, 2]
];

window.addEventListener('load', () => {
    let chkAnimation = elemId('chkAnimation');
    let cboType = elemId('cboType');
    let chkFlat = elemId('chkFlat');
    let chkInvert = elemId('chkInvert');
    let chkFade = elemId('chkFade');
    let chkDeb = elemId('chkDeb');
    let cboBG = elemId('cboBG');
    let inBase = elemId('base');
    let inMult = elemId('mult');
    let inSpot = elemId('spots');

    // Main canvas
    mainCan = create('canvas');
    mainCan.width = 256;
    mainCan.height = 256;
    mainCan.id = 'main_canvas';
    mainCtx = mainCan.getContext('2d');

    elemId('canvas_cont').appendChild(mainCan);

    function setUI() {
        const i = cboType.selectedIndex;
        inBase.value = INPUTS[i][0];
        inMult.value = INPUTS[i][1];
        initWP();
        startWPLoop();
    }
    function setBG() {
        if (cboBG.value === 'grid') {
            mainCan.style.background = 'url(images/bg.png)';
        } else {
            mainCan.style.background = cboBG.value;
        }
    }
    function initWP() {
        wp.type = cboType.value;
        wp.flat = chkFlat.checked;
        wp.fade = chkFade.checked;
        wp.base = getVal('#base');
        wp.mult = getVal('#mult');
        wp.width = mainCan.width;
        wp.height = mainCan.height;
        wp.animation = chkAnimation.checked;
        wp.debug = chkDeb.checked;
        wp.localCtx = mainCtx;
        wp.fps = 1;
    }

    // Worley Parameters input changes
    chkAnimation.onchange = () => {
        if (chkAnimation.checked) {
            wp.animation = true;
            chkDeb.removeAttribute('disabled');
        } else {
            wp.animation = false;
            chkDeb.setAttribute('disabled', true);
        }
    }
    chkDeb.onchange = () => { wp.debug = chkDeb.checked; }
    chkFlat.onchange = () => {
        wp.flat = chkFlat.checked;
        if (chkFlat.checked) {
            chkFade.setAttribute('disabled', true);
            chkInvert.setAttribute('disabled', true);
        } else {
            chkFade.removeAttribute('disabled');
            chkInvert.removeAttribute('disabled');
        }
    }
    chkInvert.onchange = () => {
        if (chkInvert.checked) {
            wp.invert = true;
        } else {
            wp.invert = false;
        }
    }
    chkFade.onchange = () => { wp.fade = chkFade.checked; }
    cboType.onchange = () => {
        wp.type = cboType.value;
        setUI();
    }
    inBase.onkeyup = inBase.onchange = () => {
        wp.base = getVal('#base');
    }
    inMult.onkeyup = inMult.onchange = () => {
        wp.mult = getVal('#mult');
    }
    inSpot.onchange = () => {
        initSpots(getVal('#spots'), 0.5);
    }
    cboBG.onchange = () => { setBG(); }

    // Other functions
    elemId('btn_reset').onclick = () => { setUI(); }

    // Go
    setBG();

    initWP();

    initSpots(inSpot.value, 0.5);
    startWPLoop();
    runFpsMeter();
    setUI();
});