var __s__ = require('../../../utils/js-helpers.js'),
    __d__ = require('../../../utils/dom-utilities.js'),
    feedbackMod = require('./feedbackModal.js'),
    configConsts = require('../../../mgmt/config.const');

"use strict";

export class Css3dObjectsControl {
    constructor(app3d, winInfo, viewsNav) {

        this._app3d = app3d;
        this._winInfo = winInfo;
        this._viewsNav = viewsNav;

        this._currentCss3DObject = null;

        this._attachEventListeners();
        
    }

    _attachEventListeners() {
        let me = this;

        const receiveMessage = function(event) {
            //console.log("World receive-message: ", event);
            var message = event.data;
            if (event.origin !== location.origin || typeof message !== 'object') { return; }

            switch (message.command) {
                case "goNext": 
                    me._winInfo._localNavigator.goToNext();
                    break;
                case "goPrev": 
                    me._winInfo._localNavigator.goToPrevious();
                    break;
                case "loadInfowin": 
                    me._viewsNav._setHashWithID(message.infowinId);
                    break;
                case "showFeedback":
                    feedbackMod.feedbackModal.show(message.html, message.dismissText, null);
                    break;
            }
        }

    	window.addEventListener('message', receiveMessage, false);
    }

    updateCss3dObject(info, prevIw) {

        if (!info.css3ObjectPath || !info.css3ObjectPath.key) {
            this._currentCss3DObject = null;
            this._app3d.renderer3d.css3D.clear();
            return;
        }

        if (!(prevIw && prevIw.css3ObjectPath
                && info.css3ObjectPath.key === prevIw.css3ObjectPath.key 
                && info.css3ObjectPath.subkey === prevIw.css3ObjectPath.subkey 
                && info.css3ObjectPath.location === prevIw.css3ObjectPath.location)) {
            this._app3d.renderer3d.css3D.clear();
            this._currentCss3DObject = this._app3d.renderer3d.css3D.load(info.css3ObjectPath, info._id);
        }
    }

	syncCSS3dpage() {
		var css3DObject = this._currentCss3DObject;

		if (!css3DObject || !css3DObject.iframe || !css3DObject.iframe.contentWindow) { return; }

		css3DObject.iframe.contentWindow.postMessage({
			command: "updateScreen",
			currentInfowinId: this._viewsNav.currentInfoWindow._id
		}, location.origin);
	}

}