/**
 * Main:
 * Generic site functionality.
 */

import { showModal, hideModal, elem, elemId, toTop } from '../libs/utils.js';

// Media queries
let mediaQ_big = window.matchMedia('screen and (min-width: 1024px)');
let mediaQ_medium = window.matchMedia(
    'screen and (max-width: 1023px) and (min-width: 680px)'
);
let mediaQ_small = window.matchMedia('screen and (max-width: 679px)');

window.addEventListener('load', () => {
    let nav = elem('nav');
    let btnToTop = elemId('back_to_top');
    btnToTop.onclick = () => { toTop() }
    //Show/Hide 'To Top' btn
    window.onscroll = () => {
        if (document.documentElement.scrollTop > 32) {
            btnToTop.style.transform = 'scale(1)';
        } else {
            btnToTop.style.transform = 'scale(0)';
        }
    }
    // About window
    let modalAbout = elemId('about_interface');
    elemId('open_about').onmouseup = () => { showModal(modalAbout); }
    window.addEventListener('click', e => { hideModal(modalAbout, e); });
    // Listen media q. changes
    mediaQ_big.onchange = mediaQ_medium.onchange =
        mediaQ_small.onchange = () => mediaQ();
    function mediaQ() {
        // Set title based on those queries
        if (mediaQ_big.matches || mediaQ_medium.matches) {
            nav.removeAttribute('hidden');
            return
        } else if (mediaQ_small.matches) {
            nav.toggleAttribute('hidden', true);
        }
    }
    mediaQ();
    elemId('nav_switch').onclick = () => {
        nav.toggleAttribute('hidden');
    }
    // Block dragging over some items
    const dragBlocked = document.getElementsByClassName('icon');
    for (let element of dragBlocked) {
        element.setAttribute('draggable', false);
    }
});
