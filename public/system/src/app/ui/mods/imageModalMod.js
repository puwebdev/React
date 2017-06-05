var __s__ = require('../../../utils/js-helpers.js'),
    __d__ = require('../../../utils/dom-utilities.js'),
    configConsts = require('../../../mgmt/config.const');

"use strict";

export class ImageModalModule {
    constructor() {
        this._isVisible = false;

        this._imageModalLayer = null;       
        this._imageModalFile = null; 

        this._init();
    }

    get visible() { return this._isVisible; }

    _init() {
        this._imageModalLayer = document.getElementById('image-modal-layer');       
        this._imageModalFile = document.getElementById('img-file'); 
        
        // close event for popup modal
        __d__.addEventLnr(this._imageModalLayer, "click", this.closeImageModal.bind(this));
        
    }

    openImageModal(src) {
        this._imageModalFile.setAttribute('src', src);
        this._imageModalLayer.style.display = 'block';
        this._isVisible = true;
    }

    // hide Image Modal
    closeImageModal() {
        this._imageModalLayer.style.display = "none";   
        this._isVisible = false;
    } 
}