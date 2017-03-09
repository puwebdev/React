var __s__ = require('../../utils/js-helpers.js'),
    __d__ = require('../../utils/dom-utilities.js'),
    SpriteArrow2D = require('../../text2D/SpriteArrow.js'),
    configConsts = require('../../mgmt/config.const');

"use strict";

export const DOWN = 0;
export const UP = 1;
export const LEFT = 2;
export const RIGHT = 3;

export class MarkersNav {
    constructor(viewsNav, reactApp, app3d, winInfo, mgmInfo) {

        this.isVisible = false;
        
        this._reactApp = reactApp; //Ref to React App
        this._viewsNav = viewsNav; //Ref to Views Navigator
        this._app3d = app3d; //Ref to parent app3d
        this._winInfo = winInfo; //Ref to Info Window
        this._mgmInfo = mgmInfo; //Ref to Mgmt Helper

        this._isOpened = false;

        this.__currentMarkers = [];
        this.__currentMarkersByName = {};
        this.__currentMarkersDataById = {};

        this.__markerUINode = {};
        this.__markerUIMounted = false;
        this.__currentEditingMarker = null;
        this.__currentEditingMarkerIsNew = false;

        this.__toCurrentInfowin = null;
        this.__toCurrentInfowinId = null;

        this._markerOnLayover = null;

        this._createMarkerWorldUI();
        this._prepareFeedbackLayover();
        this._attachListenersFromInfowindow();

    }

    _create2dMarker(marker = {_id: "0", direction: 0, letter: "", position: { x: 0, y: 0, z: 0 }}) {
        let me = this,
            arrowRotation = {0: -Math.PI * 5 / 4, 1: -Math.PI * 1 / 4, 2: -Math.PI * 3 / 4, 3: Math.PI / 4};

        function createArrow(name, rotation, letter, x, y, z) {
            let arrowSprite = new SpriteArrow2D(256, rotation, letter, { fillStyle: "#e69b18"}),
                labelScale = 16;

            arrowSprite.name = name;
            arrowSprite.scale.set(labelScale, labelScale, 1);
            arrowSprite.position.x = x;
            arrowSprite.position.y = y;
            arrowSprite.position.z = z;
            arrowSprite.updateMatrix();
            arrowSprite.matrixAutoUpdate = false;

            return arrowSprite;
        }

        if (!marker._id) { return null; }

        return createArrow(
            "arrow_" + marker._id, 
            arrowRotation[marker.direction || 0] || arrowRotation[0], 
            marker.letter || "", 
            marker.position.x, 
            marker.position.y, 
            marker.position.z
        );
    }

    _attachListenersFromInfowindow() {
        let me = this;

        //When infowin is shown
        __d__.addEventLnr(this._app3d._baseNode, "wininfoShown", function(ev) {
            me.clearInfowinMarkers();
            me.addInfowinMarkers(ev.currentMLInfoWindow || ev.currentInfoWindow);
        });

        //When infowin is hidden
        __d__.addEventLnr(this._app3d._baseNode, "wininfoHidden", function() {
            me.clearInfowinMarkers();
        });

        //When marker is clicked
        __d__.addEventLnr(this._app3d._baseNode, "markerOnPreShowFeedback", function(ev) {
            me._processClickOnMarker(ev);
        });
        
    }

    addInfowinMarkers(iw) {
        let infowin = this._viewsNav.infoWinsTreeById[iw._id], 
            sprite, marker;
        
        if (!infowin || !infowin.markers || !infowin.markers.length) { return; }
        

        for(let j = 0, lenJ = infowin.markers.length; j < lenJ; j += 1) {
            marker = infowin.markers[j];
            sprite = this._create2dMarker(marker);
            if (!sprite) { continue; }

            this._app3d.renderer3d.markersGroup.add(sprite);
            this.__currentMarkers.push(sprite);
            this.__currentMarkersByName[sprite.name] = sprite;
            
            this.__currentMarkersDataById[marker._id] = marker;
        }
    }

    clearInfowinMarkers() {
        let me = this;

        if (me.__currentMarkers.length === 0) { return; }

        for(let j = 0, lenJ = me.__currentMarkers.length; j < lenJ; j += 1) {
            me._app3d.renderer3d.markersGroup.remove(me.__currentMarkers[j]);
        }

        me.__currentMarkers = [];
        me.__currentMarkersByName = {};
        me.__currentMarkersDataById = {};
    }

    _createMarkerWorldUI() {

        let me = this,
            d0 = document.getElementById("markerui-holder");

        if (this.__markerUIMounted || !d0) { return; }

        function fieldPos(axis) {
            return "<div class='markerui-row'><label for='markerui-inp-" + axis + "'>" + axis + "</label><input id='markerui-inp-" + axis + "' type='text' size='10' required value='0.0'/>" +
                "<span class='markerui-add' id='markerui-add-" + axis + "'>+</span><span class='markerui-sub' id='markerui-sub-" + axis + "'>-</span></div>";
        }

        function indDec(ev) {
            let id = ev.target.id, pos, inpt, isAdd, incdec, newVal, evFire;

            if (ev.target.tagName !== "SPAN") { return; }
                
            pos = id.replace("markerui-add-", "").replace("markerui-sub-", "");
            inpt = document.getElementById("markerui-inp-" + pos);
            isAdd = id.indexOf("markerui-add-") === 0;
            incdec = document.querySelector('input[name="incdec"]:checked').value;

            newVal = isNaN(inpt.value) ? 0 : Number(inpt.value) + (isAdd ? 1 : -1) * incdec;
            inpt.value = Math.round(newVal * 100) / 100;

            evFire = __d__.addEventDsptchr("change");
            me.__markerUINode["position" + pos.toUpperCase()].dispatchEvent(evFire);	
        }

        let d1 = document.createElement("div"),
            d2 = document.createElement("div"),
            d3 = document.createElement("div"),
            d4 = document.createElement("button"),
            d5 = document.createElement("button");

        d1.className = "markerui-form";
        d2.className = "markerui-help";
        d3.className = "markerui-buttons";
        d4.className = "markerui-button-ok";
        d5.className = "markerui-button-close";

        d1.innerHTML = "<h2>Marker for infowin</h2><h1 id='markerui-h1'></h1><h3 id='markerui-h3'></h3>" +
            "<div class='markerui-row'><label for='markerui-inp-title'>Title</label><input id='markerui-inp-title' type='text' size='25' required value='Marker'/></div>" +
            "<div class='markerui-row'><label for='markerui-inp-letter'>Letter</label><input id='markerui-inp-letter' type='text' size='1' /> &nbsp; " +
            "<label for='markerui-inp-dir'>Arrow</label><select id='markerui-inp-dir' type='text' size='1'>" +
            "<option value='0'>Down</option><option value='1'>Up</option><option value='2'>Left</option><option value='3'>Right</option>" +
            "</select><input type='hidden' id='markerui-inp-id'/></div>" +
            fieldPos("x") + fieldPos("y") + fieldPos("z");

        __d__.addEventLnr(d1, "click", indDec);

        d2.innerHTML = "<h4>Admin Helpers</h4>" +
            "<div class='markerui-row'><label for='markerui-inp-title'>Don't occlude (depth test = false)</label><input id='markerui-inp-depth' type='checkbox' /></div>" +
            "<div class='markerui-row'><label>Inc. / dec.</label> <label for='markerui-inc1'>0.1</label><input type='radio' name='incdec' value='0.1'/> &nbsp; " +
            "<label for='markerui-inc2'>1</label><input type='radio' name='incdec' value='1'/> &nbsp; " +
            "<label for='markerui-inc3'>10</label><input type='radio' checked name='incdec' value='10'/></div>" +
            "<div class='markerui-row'><button id='markerui-button-target'>Move camera-target to marker</button></div>";

        d4.innerHTML = "Create";
        d5.innerHTML = "Cancel";

        d0.appendChild(d1);
        d0.appendChild(d3);
        d0.appendChild(d2);
        d3.appendChild(d4);
        d3.appendChild(d5);

        this.__markerUINode.holder = d0;
        this.__markerUINode.infowinTitle = document.getElementById("markerui-h1");
        this.__markerUINode.infowinId = document.getElementById("markerui-h3");
        this.__markerUINode.markerTitle = document.getElementById("markerui-inp-title");
        this.__markerUINode.markerLetter = document.getElementById("markerui-inp-letter");
        this.__markerUINode.markerDirection = document.getElementById("markerui-inp-dir");
        this.__markerUINode.markerId = document.getElementById("markerui-inp-id");
        this.__markerUINode.positionX = document.getElementById("markerui-inp-x");
        this.__markerUINode.positionY = document.getElementById("markerui-inp-y");
        this.__markerUINode.positionZ = document.getElementById("markerui-inp-z");
        this.__markerUINode.buttonTarget = document.getElementById("markerui-button-target");
        this.__markerUINode.depthTest = document.getElementById("markerui-inp-depth");

        __d__.addEventLnr(this.__markerUINode.positionX, "change", this._changeMarkerPosition.bind(this));
        __d__.addEventLnr(this.__markerUINode.positionY, "change", this._changeMarkerPosition.bind(this));
        __d__.addEventLnr(this.__markerUINode.positionZ, "change", this._changeMarkerPosition.bind(this));
        
        __d__.addEventLnr(this.__markerUINode.markerLetter, "change", this._changeMarkerShape.bind(this));
        __d__.addEventLnr(this.__markerUINode.markerDirection, "change", this._changeMarkerShape.bind(this));

        __d__.addEventLnr(this.__markerUINode.buttonTarget, "click", this._moveCameraTarget.bind(this));
        __d__.addEventLnr(this.__markerUINode.depthTest, "click", this._changeDepthTest.bind(this));

        this.__markerUINode.saver = d4;
        this.__markerUINode.closer = d5;

        __d__.addEventLnr(d5, "click", this._close.bind(this));
        __d__.addEventLnr(d4, "click", this._saveCurrentMarker.bind(this));

        document.body.appendChild(d0);
        this.__markerUIMounted = true;
    }

    _open(selectedMarker) {

        if (!this.__markerUIMounted) { return; }

        let infowin = this._viewsNav.currentMLInfoWindow || this._viewsNav.currentInfoWindow,
            cT = this._app3d.renderer3d.controls.target;

        if (!infowin) { alert("Please navigate to an infowin"); return; }

        this.__markerUINode.infowinTitle.innerHTML = infowin.title;
        this.__markerUINode.infowinId.innerHTML = infowin._id;

        this.__toCurrentInfowin = infowin;
        this.__toCurrentInfowinId = infowin._id;


        if (selectedMarker) {
            this.__markerUINode.markerTitle.value = selectedMarker.title;
            this.__markerUINode.markerLetter.value = selectedMarker.letter;
            this.__markerUINode.markerDirection.selectedIndex = selectedMarker.direction;
            this.__markerUINode.markerId.value = selectedMarker._id;
            this.__markerUINode.positionX.value = selectedMarker.position.x;
            this.__markerUINode.positionY.value = selectedMarker.position.y;
            this.__markerUINode.positionZ.value = selectedMarker.position.z;
            this.__currentEditingMarker = me.__currentMarkersByName["arrow_" + selectedMarker._id];
            this.__currentEditingMarkerIsNew = false;
        } else {
            this.__markerUINode.markerTitle.value = "My marker " + (infowin.markers ? infowin.markers.length + 1 : 1);
            this.__markerUINode.markerLetter.value = "";
            this.__markerUINode.markerDirection.selectedIndex = 0;
            this.__markerUINode.markerId.value = "";
            this.__markerUINode.positionX.value = cT.x;
            this.__markerUINode.positionY.value = cT.y;
            this.__markerUINode.positionZ.value = cT.z;
            this.__currentEditingMarker = this._create2dMarker({_id: "temporarySprite", direction:0, letter:"", position: cT});
            this._app3d.renderer3d.meshesHolder.add(this.__currentEditingMarker);
            this.__currentEditingMarkerIsNew = true;
        }

        if (this.__currentEditingMarker) {
            this._isOpened = true;
            this.__markerUINode.holder.style.display = "block";
        }

    }

    _close() {
        this._isOpened = false;
        this.__markerUINode.holder.style.display = "none";

        if (this.__currentEditingMarkerIsNew) {
            this._app3d.renderer3d.meshesHolder.remove(this.__currentEditingMarker);
        }
    }

    _changeMarkerPosition(ev) {
        let t = ev.target, 
            tId = t.getAttribute("id"), 
            pos = tId.replace("markerui-inp-", ""),
            val = t.value;

        this.__currentEditingMarker.position[pos] = Number(val);
        this.__currentEditingMarker.updateMatrix();
    }

    _changeMarkerShape(ev) {
        if (ev.stopPropagation) { ev.stopPropagation(); }

        let nSprite = this._create2dMarker({
                _id: "temporaryMat", 
                direction: Number(this.__markerUINode.markerDirection.selectedIndex), 
                letter: this.__markerUINode.markerLetter.value, 
                position: { x: 0, y: 0, z: 0 } //position doesn't matter, we only need the material
            });

        this.__currentEditingMarker.material.map = nSprite.material.map;
    }

    _moveCameraTarget(ev) {
        let cT = this._app3d.renderer3d.controls.target;

        cT.x = Number(this.__markerUINode.positionX.value);
        cT.y = Number(this.__markerUINode.positionY.value);
        cT.z = Number(this.__markerUINode.positionZ.value);
    }

    _changeDepthTest(ev) {
        let t = ev.target, doDepthTest = !!!t.checked;
        this.__currentEditingMarker.material.depthTest = doDepthTest;
    }

    _saveCurrentMarker() {
        let me = this,
            marker = {
                title: me.__markerUINode.markerTitle.value,
                letter: me.__markerUINode.markerLetter.value,
                direction: me.__markerUINode.markerDirection.selectedIndex,
                position: {
                    x: me.__markerUINode.positionX.value,
                    y: me.__markerUINode.positionY.value,
                    z: me.__markerUINode.positionZ.value,
                }
            }, 
            parentId = me.__toCurrentInfowinId;

        axios({
            method: me.__currentEditingMarkerIsNew ? 'post' : 'put',
            url: `${configConsts.ROOT_URL}/markers`,
            data: { parentId, marker }
        })
        .then(function (response) {                
            console.info("marker saved");
            me._close();
            me._mgmInfo._updateWorldData().then(function(){
                me.addInfowinMarkers(me.__toCurrentInfowin);
            });
        })
        .catch(function (error) {
            alert(error);
        });
        
    }

    _processClickOnMarker(ev) {
        let me = this,
            id = ev.markerId,
            markerData = this.__currentMarkersDataById[id],
            evEm;

        if (!markerData) { return; }

        this._markerOnLayover = markerData;

        if (markerData.feedbackHtml) {
            evEm = __d__.addEventDsptchr("markerOnShowFeedback");
            evEm.infowin = me.__toCurrentInfowin;
            evEm.marker = markerData;
            this._showFeedbackHtml(markerData);
        } else {
            evEm = __d__.addEventDsptchr("markerOnDismissFeedback");
            evEm.infowin = me.__toCurrentInfowin;
            evEm.marker = markerData;
            evEm.feedbackShown = false;
        }

        this._app3d._baseNode.dispatchEvent(evEm);
    }

    _prepareFeedbackLayover() {
        this._feedbackMarkup = {
            layv: document.getElementById("marker-feedback-layv"),
            text: document.getElementById("marker-feedback-text"),
            btn: document.getElementById("marker-feedback-dismiss"),
        }
        __d__.addEventLnr(this._feedbackMarkup.btn, "click", this._dismissFeedback.bind(this));
    }

    _showFeedbackHtml(marker) {
        let icon = marker.faIcon ? "<span class='fa " + marker.faIcon + "'> </span><br /><br />" : "";
        this._feedbackMarkup.text.innerHTML = icon + marker.feedbackHtml;
        this._feedbackMarkup.btn.innerHTML = marker.dismissText || "Ok";
        this._feedbackMarkup.layv.style.display = "block";
    }

    _dismissFeedback() {
        let me = this,
            evEm = __d__.addEventDsptchr("markerOnDismissFeedback"),
            markerData = this._markerOnLayover;

        this._feedbackMarkup.layv.style.display = "none";

        evEm.infowin = me.__toCurrentInfowin;
        evEm.marker = markerData;
        evEm.feedbackShown = true;
        this._app3d._baseNode.dispatchEvent(evEm);
    }


}