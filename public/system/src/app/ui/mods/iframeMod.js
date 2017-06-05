var __s__ = require('../../../utils/js-helpers.js'),
    __d__ = require('../../../utils/dom-utilities.js'),
    configConsts = require('../../../mgmt/config.const');

"use strict";

export class IframeModule {
    constructor(winInfo) {

        this._winInfo = winInfo;
        this._app3d = winInfo._app3d;

        this._layoverInfo = { w: 0, h: 0, src: "", x: 0, y: 0};
        this._iframeHolder = {};
        this._mouseStart = { isDown: false, x: 0, y: 0};

        this._isVisible = false;
        this._createIframeHolder();
        
    }

    get visible() { return this._isVisible; }    

    /* Iframe section ------------------------------------------ */

    _createIframeHolder() {
        let d0 = document.createElement("div"),
            d1 = document.createElement("div"),
            d2 = document.createElement("div"),
            d3 = document.createElement("iframe"),
            d4 = document.createElement("span"),
            d5 = document.createElement("div");

        d0.className = "iframe-layover";
        d1.className = "iframe-holder";
        d2.className = "iframe-holder-handle noselect";
        d3.className = "iframe-holder-src";
        d4.className = "iframe-holder-closer noselect";

        d0.appendChild(d1);
        d1.appendChild(d2);
        d1.appendChild(d3);
        d2.appendChild(d4);
        d2.appendChild(d5);
        document.body.appendChild(d0);

        d3.style.width = "100%";

        this._iframeHolder.layover = d0;
        this._iframeHolder.main = d1;
        this._iframeHolder.handle = d2;
        this._iframeHolder.handleText = d5;
        this._iframeHolder.src = d3;
        this._iframeHolder.closer = d4;
    }    

    iframeShow(src, title, w, h) {

        let dw = dw ? Number(String(w).replace("px", "")) : 1024,
            dh = dh ? Number(String(h).replace("px", "")) : 680;

        this._layoverInfo.w = Math.min( dw || this._app3d.width, this._app3d.width - 40);
        this._layoverInfo.h = Math.min( dh || this._app3d.height, this._app3d.height - 60);
        this._layoverInfo.src = src;
        this._isVisible = true;

        this._iframeHolder.layover.style.display = "block";
        this._iframeHolder.handleText.innerHTML = title || "";
        this._iframeHolder.src.style.width = "100%";
        this._iframeHolder.src.setAttribute("src", src);
        this.iframeCenter();

        __d__.addEventLnr(this._iframeHolder.handle, "mousedown", this._onMouseDown.bind(this));        
        __d__.addEventLnr(this._iframeHolder.closer, "click", this.iframeHide.bind(this));

        this._app3d.pauseRendering();

    }

    iframeHide() {

        this._iframeHolder.layover.style.display = "none";
        this._iframeHolder.handleText.innerHTML = "";
        this._iframeHolder.src.src = "";
        this._isVisible = false;

        __d__.removeEventLnr(this._iframeHolder.handle, "mousedown", this._onMouseDown);
        __d__.removeEventLnr(this._iframeHolder.closer, "click", this.iframeHide);
        
        this._app3d.resumeRendering();   
    }

    iframeCenter() {
        let posX = Math.floor((this._app3d.width - this._layoverInfo.w) / 2),
            posY = Math.floor((this._app3d.height - this._layoverInfo.h) / 2);
        
        this._iframeHolder.main.style.width = (this._layoverInfo.w) + "px";
        this._iframeHolder.main.style.height = (this._layoverInfo.h) + "px";
        this._iframeHolder.main.style.left = posX + "px";
        this._iframeHolder.main.style.top = posY + "px";

        this._iframeHolder.src.style.height = (this._layoverInfo.h - 20) + "px";

        this._layoverInfo.x = posX;
        this._layoverInfo.y = posY;
    }

    _onMouseDown(ev) {
        this._mouseStart.x = ev.screenX;
        this._mouseStart.y = ev.screenY;
        this._mouseStart.isDown = true;

        __d__.addEventLnr(this._iframeHolder.layover, "mousemove", this._onMouseMove.bind(this));
        __d__.addEventLnr(this._iframeHolder.handle, "mouseup", this._onMouseUp.bind(this));        
    }

    _onMouseMove(ev) {

        if (!this._mouseStart.isDown) { return; }

        let deltaX = ev.screenX - this._mouseStart.x,
            deltaY = ev.screenY - this._mouseStart.y,
            newX = Math.min(Math.max(this._layoverInfo.x + deltaX, 0), this._app3d.width - 40),
            newY = Math.min(Math.max(this._layoverInfo.y + deltaY, 0), this._app3d.height - 40);

        this._iframeHolder.main.style.left = newX + "px";
        this._iframeHolder.main.style.top = newY + "px";
        this._layoverInfo.x = newX;
        this._layoverInfo.y = newY;

        this._mouseStart.x = ev.screenX;
        this._mouseStart.y = ev.screenY;

        if (!ev.which) { this._mouseStart.isDown = false; }
        
    }

    _onMouseUp() {
        this._mouseStart.isDown = false;
        __d__.removeEventLnr(this._iframeHolder.layover, "mousemove", this._onMouseMove);
        __d__.removeEventLnr(this._iframeHolder.handle, "mouseup", this._onMouseUp);        
    }
}