/**
 * 
 */

const PI = 3.14159265;

/**
 * @param {String} slt CSS Selector.
 */
function elem(slt) {
    return document.querySelector(slt);
}

/**
 * @param {CSS} slt CSS Selector (by id).
 */
function elemId(slt) {
    return document.getElementById(slt);
}

/**
 * @param {String} slt CSS Selector (by class name).
 */
function elemClass(slt) {
    return document.getElementsByClassName(slt);
}

/**
 * @param {String} tag The element tag name.
 */
function create(tag) {
    return document.createElement(tag);
}

/**
 * @param {String} slt CSS Selector.
 */
function getVal(slt) {
    let e = elem(slt);
    // "" is converted to 0 when we use Number of a value
    // Instead of that, we make use of 'default' attribute (hand made).
    if (e.value === "") {
        return e.value = Number(e.getAttribute('default'));
    }
    if (e.value < Number(e.getAttribute('min')) && e.hasAttribute('min')) {
        return e.value = Number(e.getAttribute('default'));
    }
    if (e.value > Number(e.getAttribute('max')) && e.hasAttribute('max')) {
        return e.value = Number(e.getAttribute('default'));
    }
    return Number(e.value);
}

function showModal(modal) {
    document.querySelectorAll('header, main, footer').forEach(element => {
        element.style.filter = 'blur(4px)';
    });
    modal.style.display = 'flex';
    modal.toggleAttribute('hidden');
}

function hideModal(modal, e) {
    if (e === null || e.target === modal) {
        document.querySelectorAll('header, main, footer').forEach(element => {
            element.style.filter = 'none';
        });
        modal.style.display = 'none';
    }
}

function toTop() {
    window.scrollTo(0, 0);
}

export {
    elem, elemId, elemClass, create, getVal, showModal, hideModal,
    toTop, PI
};