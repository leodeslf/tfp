/**
 * 
 */

import { initFFA } from '../loops/ff_a_loop.js';
import { initFFB } from '../loops/ff_b_loop.js';
import { runFpsMeter } from '../loops/fps_loop.js';
import { pp, startPPLoop } from '../loops/perlin_loop.js';
import {
    elem, elemId, create, getVal, showModal, hideModal
} from '../libs/utils.js';

let mainCan, textCan, dwldCan, canA, canB;
let mainCtx, textCtx, dwldCtx, ctxA, ctxB;
let dragX, dragY, zoom;
const INPUTS = [
    'resX', 'resY', 'traX', 'traY', 'dataSize',
    'freq', 'amp', 'oct', 'lac', 'per', 'deltaT'
];
const SET = {
    d1: [256, '', 0, '', '', 1, 255, 8, 2, 0.5, 0.01],
    d2: [256, 256, 0, 0, 1, 1, 255, 6, 2, 0.5, 0.01],
    d3: [256, 256, 0, 0, 2, 1, 255, 6, 2, 0.5, 0.01],
    d3F: [128, 128, 0, 0, 2, 1, 255, 6, 2, 0.5, 0.01]
};
let baseColor;
let defaultColor = new Image(256, 32);
const defaultColorSrc = 'images/textures/por_defecto.png';

window.addEventListener('load', () => {
    let chkAnimation = elemId('chkAnimation');
    let chkExactT = elemId('chkExactT');
    let cboType = elemId('cboType');
    let cboBG = elemId('cboBG');
    let cboColors = elemId('cboColors');
    let modalDownload = elemId('download_interface');

    // Main canvas
    mainCan = create('canvas');
    mainCan.width = 256;
    mainCan.height = 256;
    mainCan.id = 'main_canvas';
    mainCtx = mainCan.getContext('2d');
    // colors canvas
    textCan = create('canvas');
    textCan.width = 256;
    textCan.height = 16;
    textCan.id = 'texture_canvas';
    textCtx = textCan.getContext('2d');
    // Download canvas
    dwldCan = create('canvas');
    dwldCan.id = 'download_canvas';
    dwldCtx = dwldCan.getContext('2d');
    // Flow field demo A
    canA = create('canvas');
    canA.width = 256;
    canA.height = 256;
    canA.id = 'ff_can_a';
    ctxA = canA.getContext('2d');
    // Flow field demo B
    canB = create('canvas');
    canB.width = 256;
    canB.height = 256;
    canB.id = 'ff_can_b';
    ctxB = canB.getContext('2d');

    elemId('main_canvas_cont').appendChild(mainCan);
    elemId('canvas_cont').appendChild(textCan);
    elem('#ff_can_cont_a i').before(canA);
    elem('#ff_can_cont_b i').before(canB);
    canA.onclick = () => initFFA();
    canB.onclick = () => initFFB();

    // Params on UI
    function setUI() {
        const aux = cboType.value;
        let thisSet;
        // UI modification
        if (aux.match(/1D\.?/)) {
            elem('label[for=cboColors]').setAttribute('disabled', true);
            elem('label[for=resY]').setAttribute('disabled', true);
            elem('label[for=traY]').setAttribute('disabled', true);
            elem('label[for=dataSize]').setAttribute('disabled', true);
            elemId('cboColors').disabled = true;
            elemId('resY').disabled = true;
            elemId('traY').disabled = true;
            elemId('dataSize').disabled = true;
            textCtx.clearRect(0, 0, 256, 16);
            thisSet = SET.d1;
        } else {
            elem('label[for=cboColors]').setAttribute('disabled', false);
            elem('label[for=resY]').setAttribute('disabled', false);
            elem('label[for=traY]').setAttribute('disabled', false);
            elem('label[for=dataSize]').setAttribute('disabled', false);
            elemId('cboColors').disabled = false;
            elemId('resY').disabled = false;
            elemId('traY').disabled = false;
            elemId('dataSize').disabled = false;
        }
        if (aux.match(/2D\.?/)) { thisSet = SET.d2; }
        if (aux.match(/3D\.?/) && cboType.selectedIndex !== 4) { thisSet = SET.d3; }
        else if (cboType.selectedIndex === 4) { thisSet = SET.d3F }
        // Content modification
        for (let cont = 0; cont < INPUTS.length; cont++) {
            elemId(INPUTS[cont]).value = thisSet[cont];
        }
        pp.type = aux;
        initPP();
        startPPLoop();
    }
    // Output Background
    function setBG() {
        if (cboBG.value === 'grid') {
            textCan.style.background = mainCan.style.background
                = 'url(images/bg.png)';
        } else {
            mainCan.style.background = textCan.style.background
                = cboBG.value;
        }
    }
    // Output Colors
    function setColors() {
        if (cboType.value === '1D') {
            // 1D just clean
            pp.colorData = null;
            textCtx.clearRect(0, 0, 256, 16);
            return
        } else if (cboColors.value !== 'por_defecto') {
            // Not 1D and not default, loads color
            baseColor = new Image(256, 32);
            baseColor.src =
                'images/textures/' + cboColors.value + '.png';
            baseColor.onload = () => {
                textCtx.clearRect(0, 0, 256, 16);
                textCtx.drawImage(baseColor, 0, 0);
                pp.colorData = textCtx.getImageData(0, 0, 256, 1).data;
            }
            return
        } else if (cboColors.value === 'por_defecto') {
            // Not 1D and default, loads default
            pp.colorData = null;
            defaultColor.src = defaultColorSrc;
            defaultColor.onload = () => {
                textCtx.clearRect(0, 0, 256, 16);
                textCtx.drawImage(defaultColor, 0, 0);
            }
        }
    }
    // Perlin Parameters initialization
    function initPP() {
        pp.deltaT = getVal('#deltaT');
        pp.type = cboType.value;
        setColors();
        pp.resolution = {
            x: getVal('#resX'),
            y: getVal('#resY')
        };
        pp.traslation = {
            x: getVal('#traX'),
            y: getVal('#traY')
        };
        pp.dataSize = Math.round(getVal('#dataSize'));
        pp.frequency = getVal('#freq');
        pp.amplitude = getVal('#amp');
        pp.octaves = getVal('#oct');
        pp.lacunarity = getVal('#lac');
        pp.persistence = getVal('#per');
        pp.width = mainCan.width;
        pp.height = mainCan.height;
        pp.animation = chkAnimation.checked;
        pp.localCtx = mainCtx;
        pp.fps = 1;
    }

    // Perlin Parameters input changes
    chkAnimation.onchange = () => {
        if (chkAnimation.checked) {
            chkExactT.checked = false;
            pp.animation = true;
        } else {
            pp.animation = false;
        }
    }
    chkExactT.onchange = () => {
        if (chkExactT.checked) {
            chkAnimation.checked = false;
            pp.animation = false;
            pp.t = getVal('#exactT');
        }
    }
    elemId('exactT').onkeyup = elemId('exactT').onchange = () => {
        if (chkExactT.checked) { pp.t = getVal('#exactT'); }
    }
    elemId('deltaT').onkeyup = elemId('deltaT').onchange = () => {
        pp.deltaT = getVal('#deltaT');
    }
    cboType.onchange = () => { setUI(); }
    cboColors.onchange = () => { setColors(); }
    elemId('resX').onkeyup = elemId('resX').onchange = () => {
        pp.resolution.x = getVal('#resX');
    }
    elemId('resY').onkeyup = elemId('resY').onchange = () => {
        pp.resolution.y = getVal('#resY');
    }
    elemId('traX').onkeyup = elemId('traX').onchange = () => {
        pp.traslation.x = getVal('#traX');
    }
    elemId('traY').onkeyup = elemId('traY').onchange = () => {
        pp.traslation.y = getVal('#traY');
    }
    elemId('dataSize').onkeyup = elemId('dataSize').onchange = () => {
        pp.dataSize = getVal('#dataSize');
    }
    elemId('freq').onkeyup = elemId('freq').onchange = () => {
        pp.frequency = getVal('#freq');
    }
    elemId('amp').onkeyup = elemId('amp').onchange = () => {
        pp.amplitude = getVal('#amp');
    }
    elemId('oct').onkeyup = elemId('oct').onchange = () => {
        pp.octaves = getVal('#oct');
    }
    elemId('lac').onkeyup = elemId('lac').onchange = () => {
        pp.lacunarity = getVal('#lac');
    }
    elemId('per').onkeyup = elemId('per').onchange = () => {
        pp.persistence = getVal('#per');
    }
    elemId('zoom_plus').onclick = () => {
        pp.resolution.x = elemId('resX').value = getVal('#resX') + 16;
        if (cboType.value !== '1D') {
            pp.resolution.y = elemId('resY').value = getVal('#resY') + 16;
        }
    }
    elemId('zoom_minus').onclick = () => {
        if (getVal('#resX') > 16) {
            pp.resolution.x = elemId('resX').value = getVal('#resX') - 16
        }
        if (getVal('#resY') > 16) {
            if (cboType.value !== '1D') {
                pp.resolution.y = elemId('resY').value = getVal('#resY') - 16;
            }
        }
    }

    // Other functions
    elemId('btn_reset').onclick = () => { setUI(); }
    elemId('btn_open_download').onclick = () => {
        showModal(modalDownload);
        chkAnimation.checked = false;
        pp.animation = false;
    }
    elemId('btn_cancel').onclick = () => { hideModal(modalDownload, null); }
    window.addEventListener('click', e => { hideModal(modalDownload, e); });
    elemId('btn_download').onclick = () => {
        let link = create('a');
        let w = getVal('#dresX');
        let h = getVal('#dresY');
        let aux;
        // Relacion aspecto != 1:1 provoca un resultado distorcionado
        w > h ? aux = w : aux = h;
        dwldCan.width = aux;
        dwldCan.height = aux;
        dwldCtx = dwldCan.getContext('2d');
        // Swap pp context and size
        pp.localCtx = dwldCtx;
        pp.width = pp.height = aux;
        startPPLoop();
        // Redimencion
        let iDDes = dwldCtx.getImageData(0, 0, w, h);
        dwldCan.width = w;
        dwldCan.height = h;
        dwldCtx = dwldCan.getContext('2d');
        dwldCtx.putImageData(iDDes, 0, 0);
        // Link
        link.download = 'perlin-noise.png';
        if (cboColors.value !== 'por_defecto') {
            link.download = 'perlin-noise-' +
                cboColors.value + '.png';
        }
        // Convert data to URL
        dwldCan.toBlob(blob => {
            link.href = URL.createObjectURL(blob);
            link.click();
        }, 'image/png');
        hideModal(modalDownload, null);
        // Swap back
        initPP();
        startPPLoop();
    }
    cboBG.onchange = () => { setBG(); }
    mainCan.onmousedown = () => {
        window.onmousemove = m => {
            var aX = getVal('#traX');
            var aY = getVal('#traY');
            dragX = 0;
            dragY = 0;
            dragX -= m.movementX;
            dragY -= m.movementY;
            pp.traslation.x = elemId('traX').value = Number(aX + dragX);
            if (cboType.value !== '1D') {
                pp.traslation.y = elemId('traY').value = Number(aY + dragY);
            }
        }
    }
    window.onmouseup = () => { window.onmousemove = null; }

    // Go
    setUI();
    setBG();
    setColors();

    initPP();

    startPPLoop();
    runFpsMeter();

    // After main load delayed
    let imgs = document.getElementsByTagName('img');
    for (let img of imgs) {
        if (img.getAttribute('data-src')) {
            img.setAttribute('src', img.getAttribute('data-src'));
        }
    }
    initFFA();
    initFFB();
});

export { mainCtx, canA, canB, ctxA, ctxB };

/*
function preventDefault(e) {
	e = e || window.event;
	if (e.preventDefault)
		e.preventDefault();
	e.returnValue = false;
}

// Zoom
mainCan.onmouseover = () => {
	if (window.addEventListener) {
		window.addEventListener('DOMMouseScroll', preventDefault, { passive: false });
	}
	window.onmousewheel = document.onmousewheel = preventDefault;
	onwheel = s => {
		var aEX = getVal('#resX');
		var aEY = getVal('#resY');
		zoom = 0;
		zoom -= s.deltaY / 20; // 100 / 20
		elemId('resX').value = Number((aEX + zoom) < 1 ? 1 : aEX + zoom);
		elemId('resY').value = Number((aEY + zoom) < 1 ? 1 : aEY + zoom);
		apply(mainCtx);
	}
}
mainCan.onmouseleave = () => {
	if (window.removeEventListener) {
		window.removeEventListener('DOMMouseScroll',
			preventDefault, false);
	}
	window.onmousewheel = document.onmousewheel = null;
}
*/