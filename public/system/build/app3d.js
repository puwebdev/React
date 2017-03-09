(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

//TESTING
var scene = require('../core/scene.js'),
    __s__ = require('../utils/js-helpers.js'),
    __d__ = require('../utils/dom-utilities.js'),
    mgmInfoMod = require('./ui/mgmInfo.js'),
    winInfoMod = require('./ui/winInfo.js'),
    viewsNavMod = require('./ui/viewsNav.js'),
    markersNavMod = require('./ui/markersNav.js'),
    appReactActionsWelcome = require('../mgmt/actions/welcome.js');

window.__reactApp = {};
window.opxl = window.opxl || {};

var scope = undefined,
    node = document.getElementById("app-3d"),
    app3d = new scene.Scene(node),
    INTERSECTED = null,
    viewsNav,
    winInfo,
    mgmInfo,
    markersNav;

function onHover(ev) {

    var intersected = ev.intersected,
        infoMap = window.config.infoMap;

    if (winInfo._isPersistant) {
        return;
    }

    if (!app3d.renderer3d._viewTravelling && intersected && infoMap[intersected.name]) {
        INTERSECTED = infoMap[intersected.name];
        winInfo.show(INTERSECTED.info, false);
    } else {
        if (INTERSECTED) {
            winInfo.hide();
            INTERSECTED = null;
        }
    }
}

function onClick(ev) {
    var intersected = ev.intersected,
        infoMap = window.config.infoMap;

    if (intersected && intersected.name.indexOf("arrow_") === 0) {
        var _ev = __d__.addEventDsptchr("markerOnPreShowFeedback");
        _ev.markerId = intersected.name.replace("arrow_", "");
        app3d._baseNode.dispatchEvent(_ev);
        return;
    }

    if (intersected && infoMap[intersected.name]) {
        INTERSECTED = infoMap[intersected.name];
        winInfo.show(INTERSECTED.info, true, intersected.name);
    } else {
        if (INTERSECTED) {
            winInfo.hide(true);
            INTERSECTED = null;
        }
    }
}

function keyPressed(ev) {
    if (winInfo._layoverInfo.isVisible) {
        return;
    }

    if (mgmInfo.isVisible && ev.keyCode !== 77 && !ev.ctrlKey) {
        return;
    }

    switch (ev.keyCode) {
        case 27:
            // Esc key
            viewsNav.goToViewId(null);
            break;
        case 16:
            // Shift key (alone)
            app3d.glowSiblingShow();
            break;
        case 77:
            // Ctrl-M
            if (!ev.ctrlKey || !mgmInfo.layv) {
                return;
            }
            if (viewsNav.currentInfoWindowParentType && viewsNav.currentInfoWindowParentId && (viewsNav.currentMLInfoWindow || viewsNav.currentInfoWindow)) {
                document.location.hash = '#/infowins/' + viewsNav.currentInfoWindowParentType + '/' + viewsNav.currentInfoWindowParentId + '/' + (viewsNav.currentMLInfoWindow || viewsNav.currentInfoWindow)._id;
            }
            mgmInfo.toggle();
            break;
        case 84:
            // Ctrl-T
            if (!ev.ctrlKey || !markersNav.__markerUIMounted || markersNav._isOpened) {
                return;
            }
            markersNav._open(null);
            break;
        default:
            // Others
            if (markersNav && markersNav._isOpened || mgmInfo && mgmInfo.isVisible) {
                return;
            } //don't move camera when editing!
            var vw = viewsNav.viewsKeycodes[ev.keyCode];
            if (vw) {
                viewsNav.goToViewId(vw._id, true);
            }
    }
}

function keyUp(ev) {
    if (winInfo._layoverInfo.isVisible) {
        return;
    }

    switch (ev.keyCode) {
        case 16:
            app3d.glowSiblingHide();
            break;
    }
}

function onViewChanged(ev) {
    var vw = ev.view,
        info = void 0,
        infoMap = window.config.infoMap;

    if (opxl && opxl.onViewChanged && typeof opxl.onViewChanged === 'function') {
        opxl.onViewChanged(ev);
    }

    viewsNav._changeCursor(vw._id, false, viewsNav.currentMLInfoWindow);

    if (vw.highlighted) {
        app3d.highlightGlowSibling(vw.highlighted);
    }

    if (!vw.selected) {

        //if Explore section is selected
        if (viewsNav.node.querySelector('#viewer-nav .nav-tabs .active').innerText.includes('Explore')) {
            winInfo.show({
                title: vw.title,
                html: vw.html,
                id: vw._id
            }, true);
        } else {
            if (viewsNav.currentMLInfoWindow) {
                winInfo.show({
                    title: viewsNav.currentMLInfoWindow.title,
                    html: viewsNav.currentMLInfoWindow.html,
                    id: vw._id
                }, true);
            } else if (viewsNav.currentInfoWindow) {
                winInfo.show({
                    title: viewsNav.currentInfoWindow.title,
                    html: viewsNav.currentInfoWindow.html,
                    id: vw._id
                }, true);
            }
        }

        return;
    }

    info = infoMap[vw.selected];
    if (!info) {
        return;
    }

    INTERSECTED = info.obj;
    winInfo.show(info.info, true, vw.selected);
}

function onViewChanging(ev) {
    winInfo.hide(true);
    if (opxl && opxl.onViewChanging && typeof opxl.onViewChanging === 'function') {
        opxl.onViewChanging(ev);
    }
}

/* Initialize */
function initialized(ev) {
    console.info("opXL 3D-Viewer initialized!");

    __d__.addEventLnr(node, "pointerchanged", onHover);
    __d__.addEventLnr(node, "clicked", onClick);
    __d__.addEventLnr(node, "viewchanging", onViewChanging);
    __d__.addEventLnr(node, "viewchanged", onViewChanged);

    __d__.addEventLnr(window, "keydown", keyPressed.bind(scope));
    __d__.addEventLnr(window, "keyup", keyUp.bind(scope));

    __d__.addEventLnr(node, "markerOnShowFeedback", function (ev) {
        console.log("markerOnShowFeedback", ev);
    });

    __d__.addEventLnr(node, "markerOnDismissFeedback", function (ev) {
        console.log("markerOnDismissFeedback", ev);
    });
}

/* Main events */
window.location.hash = "";

// Start the modules

// 1. Views Navigator - can be used with window.app3dViewsNav
viewsNav = new viewsNavMod.ViewsNav(app3d);
// 2. Info Window - can be used with window.app3dInfowWindow
winInfo = new winInfoMod.WinInfo(app3d, viewsNav, window.opxl);
// 3. Mgmt UI Window control - no need to expose it.
mgmInfo = new mgmInfoMod.MgmInfo(document.getElementById("mgmt-layv"), viewsNav, window.__reactApp, app3d, winInfo);
// 4. MarkersNav controls
markersNav = new markersNavMod.MarkersNav(viewsNav, window.__reactApp, app3d, winInfo, mgmInfo);

__d__.addEventLnr(node, "initialized", initialized.bind(scope));

/* Make available to Window */
window.app3dViewer = app3d;
window.app3dInfowWindow = winInfo;
window.app3dViewsNav = viewsNav;
window.app3dMarkersNav = markersNav;
window.app3dMgmInfo = mgmInfo;

},{"../core/scene.js":9,"../mgmt/actions/welcome.js":10,"../utils/dom-utilities.js":14,"../utils/js-helpers.js":15,"./ui/markersNav.js":2,"./ui/mgmInfo.js":3,"./ui/viewsNav.js":4,"./ui/winInfo.js":5}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var __s__ = require('../../utils/js-helpers.js'),
    __d__ = require('../../utils/dom-utilities.js'),
    SpriteArrow2D = require('../../text2D/SpriteArrow.js'),
    configConsts = require('../../mgmt/config.const');

"use strict";

var DOWN = exports.DOWN = 0;
var UP = exports.UP = 1;
var LEFT = exports.LEFT = 2;
var RIGHT = exports.RIGHT = 3;

var MarkersNav = exports.MarkersNav = function () {
    function MarkersNav(viewsNav, reactApp, app3d, winInfo, mgmInfo) {
        _classCallCheck(this, MarkersNav);

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

    _createClass(MarkersNav, [{
        key: '_create2dMarker',
        value: function _create2dMarker() {
            var marker = arguments.length <= 0 || arguments[0] === undefined ? { _id: "0", direction: 0, letter: "", position: { x: 0, y: 0, z: 0 } } : arguments[0];

            var me = this,
                arrowRotation = { 0: -Math.PI * 5 / 4, 1: -Math.PI * 1 / 4, 2: -Math.PI * 3 / 4, 3: Math.PI / 4 };

            function createArrow(name, rotation, letter, x, y, z) {
                var arrowSprite = new SpriteArrow2D(256, rotation, letter, { fillStyle: "#e69b18" }),
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

            if (!marker._id) {
                return null;
            }

            return createArrow("arrow_" + marker._id, arrowRotation[marker.direction || 0] || arrowRotation[0], marker.letter || "", marker.position.x, marker.position.y, marker.position.z);
        }
    }, {
        key: '_attachListenersFromInfowindow',
        value: function _attachListenersFromInfowindow() {
            var me = this;

            //When infowin is shown
            __d__.addEventLnr(this._app3d._baseNode, "wininfoShown", function (ev) {
                me.clearInfowinMarkers();
                me.addInfowinMarkers(ev.currentMLInfoWindow || ev.currentInfoWindow);
            });

            //When infowin is hidden
            __d__.addEventLnr(this._app3d._baseNode, "wininfoHidden", function () {
                me.clearInfowinMarkers();
            });

            //When marker is clicked
            __d__.addEventLnr(this._app3d._baseNode, "markerOnPreShowFeedback", function (ev) {
                me._processClickOnMarker(ev);
            });
        }
    }, {
        key: 'addInfowinMarkers',
        value: function addInfowinMarkers(iw) {
            var infowin = this._viewsNav.infoWinsTreeById[iw._id],
                sprite = void 0,
                marker = void 0;

            if (!infowin || !infowin.markers || !infowin.markers.length) {
                return;
            }

            for (var j = 0, lenJ = infowin.markers.length; j < lenJ; j += 1) {
                marker = infowin.markers[j];
                sprite = this._create2dMarker(marker);
                if (!sprite) {
                    continue;
                }

                this._app3d.renderer3d.markersGroup.add(sprite);
                this.__currentMarkers.push(sprite);
                this.__currentMarkersByName[sprite.name] = sprite;

                this.__currentMarkersDataById[marker._id] = marker;
            }
        }
    }, {
        key: 'clearInfowinMarkers',
        value: function clearInfowinMarkers() {
            var me = this;

            if (me.__currentMarkers.length === 0) {
                return;
            }

            for (var j = 0, lenJ = me.__currentMarkers.length; j < lenJ; j += 1) {
                me._app3d.renderer3d.markersGroup.remove(me.__currentMarkers[j]);
            }

            me.__currentMarkers = [];
            me.__currentMarkersByName = {};
            me.__currentMarkersDataById = {};
        }
    }, {
        key: '_createMarkerWorldUI',
        value: function _createMarkerWorldUI() {

            var me = this,
                d0 = document.getElementById("markerui-holder");

            if (this.__markerUIMounted || !d0) {
                return;
            }

            function fieldPos(axis) {
                return "<div class='markerui-row'><label for='markerui-inp-" + axis + "'>" + axis + "</label><input id='markerui-inp-" + axis + "' type='text' size='10' required value='0.0'/>" + "<span class='markerui-add' id='markerui-add-" + axis + "'>+</span><span class='markerui-sub' id='markerui-sub-" + axis + "'>-</span></div>";
            }

            function indDec(ev) {
                var id = ev.target.id,
                    pos = void 0,
                    inpt = void 0,
                    isAdd = void 0,
                    incdec = void 0,
                    newVal = void 0,
                    evFire = void 0;

                if (ev.target.tagName !== "SPAN") {
                    return;
                }

                pos = id.replace("markerui-add-", "").replace("markerui-sub-", "");
                inpt = document.getElementById("markerui-inp-" + pos);
                isAdd = id.indexOf("markerui-add-") === 0;
                incdec = document.querySelector('input[name="incdec"]:checked').value;

                newVal = isNaN(inpt.value) ? 0 : Number(inpt.value) + (isAdd ? 1 : -1) * incdec;
                inpt.value = Math.round(newVal * 100) / 100;

                evFire = __d__.addEventDsptchr("change");
                me.__markerUINode["position" + pos.toUpperCase()].dispatchEvent(evFire);
            }

            var d1 = document.createElement("div"),
                d2 = document.createElement("div"),
                d3 = document.createElement("div"),
                d4 = document.createElement("button"),
                d5 = document.createElement("button");

            d1.className = "markerui-form";
            d2.className = "markerui-help";
            d3.className = "markerui-buttons";
            d4.className = "markerui-button-ok";
            d5.className = "markerui-button-close";

            d1.innerHTML = "<h2>Marker for infowin</h2><h1 id='markerui-h1'></h1><h3 id='markerui-h3'></h3>" + "<div class='markerui-row'><label for='markerui-inp-title'>Title</label><input id='markerui-inp-title' type='text' size='25' required value='Marker'/></div>" + "<div class='markerui-row'><label for='markerui-inp-letter'>Letter</label><input id='markerui-inp-letter' type='text' size='1' /> &nbsp; " + "<label for='markerui-inp-dir'>Arrow</label><select id='markerui-inp-dir' type='text' size='1'>" + "<option value='0'>Down</option><option value='1'>Up</option><option value='2'>Left</option><option value='3'>Right</option>" + "</select><input type='hidden' id='markerui-inp-id'/></div>" + fieldPos("x") + fieldPos("y") + fieldPos("z");

            __d__.addEventLnr(d1, "click", indDec);

            d2.innerHTML = "<h4>Admin Helpers</h4>" + "<div class='markerui-row'><label for='markerui-inp-title'>Don't occlude (depth test = false)</label><input id='markerui-inp-depth' type='checkbox' /></div>" + "<div class='markerui-row'><label>Inc. / dec.</label> <label for='markerui-inc1'>0.1</label><input type='radio' name='incdec' value='0.1'/> &nbsp; " + "<label for='markerui-inc2'>1</label><input type='radio' name='incdec' value='1'/> &nbsp; " + "<label for='markerui-inc3'>10</label><input type='radio' checked name='incdec' value='10'/></div>" + "<div class='markerui-row'><button id='markerui-button-target'>Move camera-target to marker</button></div>";

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
    }, {
        key: '_open',
        value: function _open(selectedMarker) {

            if (!this.__markerUIMounted) {
                return;
            }

            var infowin = this._viewsNav.currentMLInfoWindow || this._viewsNav.currentInfoWindow,
                cT = this._app3d.renderer3d.controls.target;

            if (!infowin) {
                alert("Please navigate to an infowin");return;
            }

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
                this.__currentEditingMarker = this._create2dMarker({ _id: "temporarySprite", direction: 0, letter: "", position: cT });
                this._app3d.renderer3d.meshesHolder.add(this.__currentEditingMarker);
                this.__currentEditingMarkerIsNew = true;
            }

            if (this.__currentEditingMarker) {
                this._isOpened = true;
                this.__markerUINode.holder.style.display = "block";
            }
        }
    }, {
        key: '_close',
        value: function _close() {
            this._isOpened = false;
            this.__markerUINode.holder.style.display = "none";

            if (this.__currentEditingMarkerIsNew) {
                this._app3d.renderer3d.meshesHolder.remove(this.__currentEditingMarker);
            }
        }
    }, {
        key: '_changeMarkerPosition',
        value: function _changeMarkerPosition(ev) {
            var t = ev.target,
                tId = t.getAttribute("id"),
                pos = tId.replace("markerui-inp-", ""),
                val = t.value;

            this.__currentEditingMarker.position[pos] = Number(val);
            this.__currentEditingMarker.updateMatrix();
        }
    }, {
        key: '_changeMarkerShape',
        value: function _changeMarkerShape(ev) {
            if (ev.stopPropagation) {
                ev.stopPropagation();
            }

            var nSprite = this._create2dMarker({
                _id: "temporaryMat",
                direction: Number(this.__markerUINode.markerDirection.selectedIndex),
                letter: this.__markerUINode.markerLetter.value,
                position: { x: 0, y: 0, z: 0 } //position doesn't matter, we only need the material
            });

            this.__currentEditingMarker.material.map = nSprite.material.map;
        }
    }, {
        key: '_moveCameraTarget',
        value: function _moveCameraTarget(ev) {
            var cT = this._app3d.renderer3d.controls.target;

            cT.x = Number(this.__markerUINode.positionX.value);
            cT.y = Number(this.__markerUINode.positionY.value);
            cT.z = Number(this.__markerUINode.positionZ.value);
        }
    }, {
        key: '_changeDepthTest',
        value: function _changeDepthTest(ev) {
            var t = ev.target,
                doDepthTest = !!!t.checked;
            this.__currentEditingMarker.material.depthTest = doDepthTest;
        }
    }, {
        key: '_saveCurrentMarker',
        value: function _saveCurrentMarker() {
            var me = this,
                marker = {
                title: me.__markerUINode.markerTitle.value,
                letter: me.__markerUINode.markerLetter.value,
                direction: me.__markerUINode.markerDirection.selectedIndex,
                position: {
                    x: me.__markerUINode.positionX.value,
                    y: me.__markerUINode.positionY.value,
                    z: me.__markerUINode.positionZ.value
                }
            },
                parentId = me.__toCurrentInfowinId;

            axios({
                method: me.__currentEditingMarkerIsNew ? 'post' : 'put',
                url: configConsts.ROOT_URL + '/markers',
                data: { parentId: parentId, marker: marker }
            }).then(function (response) {
                console.info("marker saved");
                me._close();
                me._mgmInfo._updateWorldData().then(function () {
                    me.addInfowinMarkers(me.__toCurrentInfowin);
                });
            }).catch(function (error) {
                alert(error);
            });
        }
    }, {
        key: '_processClickOnMarker',
        value: function _processClickOnMarker(ev) {
            var me = this,
                id = ev.markerId,
                markerData = this.__currentMarkersDataById[id],
                evEm = void 0;

            if (!markerData) {
                return;
            }

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
    }, {
        key: '_prepareFeedbackLayover',
        value: function _prepareFeedbackLayover() {
            this._feedbackMarkup = {
                layv: document.getElementById("marker-feedback-layv"),
                text: document.getElementById("marker-feedback-text"),
                btn: document.getElementById("marker-feedback-dismiss")
            };
            __d__.addEventLnr(this._feedbackMarkup.btn, "click", this._dismissFeedback.bind(this));
        }
    }, {
        key: '_showFeedbackHtml',
        value: function _showFeedbackHtml(marker) {
            var icon = marker.faIcon ? "<span class='fa " + marker.faIcon + "'> </span><br /><br />" : "";
            this._feedbackMarkup.text.innerHTML = icon + marker.feedbackHtml;
            this._feedbackMarkup.btn.innerHTML = marker.dismissText || "Ok";
            this._feedbackMarkup.layv.style.display = "block";
        }
    }, {
        key: '_dismissFeedback',
        value: function _dismissFeedback() {
            var me = this,
                evEm = __d__.addEventDsptchr("markerOnDismissFeedback"),
                markerData = this._markerOnLayover;

            this._feedbackMarkup.layv.style.display = "none";

            evEm.infowin = me.__toCurrentInfowin;
            evEm.marker = markerData;
            evEm.feedbackShown = true;
            this._app3d._baseNode.dispatchEvent(evEm);
        }
    }]);

    return MarkersNav;
}();

},{"../../mgmt/config.const":11,"../../text2D/SpriteArrow.js":13,"../../utils/dom-utilities.js":14,"../../utils/js-helpers.js":15}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var __s__ = require('../../utils/js-helpers.js');
var __d__ = require('../../utils/dom-utilities.js');
var configConsts = require('../../mgmt/config.const');

"use strict";

var MgmInfo = exports.MgmInfo = function () {
    function MgmInfo(layv, viewsNav, reactApp, app3d, winInfo) {
        _classCallCheck(this, MgmInfo);

        this.isVisible = false;
        this.layv = layv;

        this._reactApp = reactApp; //Ref to React App
        this._viewsNav = viewsNav; //Ref to Views Navigator
        this._app3d = app3d; //Ref to parent app3d
        this._winInfo = winInfo; //Ref to Info Window
    }

    //Shows and hides the Mgmt UI


    _createClass(MgmInfo, [{
        key: 'toggle',
        value: function toggle() {
            var me = this;
            me.layv.style.display = !me.isVisible ? "block" : "none";
            me.isVisible = !me.isVisible;

            if (me.isVisible) {
                me.updateCameraCoords();
            } else {
                me._updateWorldData().then(function () {
                    me._updateInfoMap();
                    me._viewsNav._reRenderViews();
                });
            }
        }

        //Gets the current ViewPosition and passes it to React App

    }, {
        key: 'updateCameraCoords',
        value: function updateCameraCoords() {
            if (!window.app3dMgmtStore) {
                return;
            }
            var reactPath = window.app3dMgmtHistory.getCurrentLocation().pathname;

            switch (reactPath) {
                case "/":
                    this._reactApp.WelcomeCallback(new Date().toString());
                    break;
            }
        }

        //Updatess the infoMap after editing in the Mgmt UI

    }, {
        key: '_updateInfoMap',
        value: function _updateInfoMap() {
            if (!window.app3dMgmtStore) {
                return;
            }

            //Update gearList (infowins) from React Store
            var infowins = window.app3dMgmtStore.getState().infowins.infowinsList.infowins;
            if (!infowins.length) {
                return;
            }

            //Create new gearList
            var newGearList = {},
                j,
                lenJ,
                g;
            for (j = 0, lenJ = infowins.length; j < lenJ; j += 1) {
                g = infowins[j];
                newGearList[g.name] = g;
            }
            window.config.gearList = newGearList;

            this._app3d._populateInfomap(window.config.infoMap, window.config.gearList, window.config.gearMap);

            this._winInfo.hide(true);
        }
    }, {
        key: '_updateWorldData',
        value: function _updateWorldData() {
            var me = this,
                id = config.mainScene.worldId;

            return new Promise(function (resolve, reject) {

                axios({
                    method: 'get',
                    url: configConsts.ROOT_URL + '/worldData/' + id
                }).then(function (response) {
                    var data = response.data.data;
                    window.config.infowins = data.infowins;
                    window.config.gearList = data.gearList;
                    me._viewsNav._flattenNestedInfowins(window.config);
                    resolve();
                }).catch(function (error) {
                    console.error(error);
                    reject(error);
                });
            });
        }
    }]);

    return MgmInfo;
}();

},{"../../mgmt/config.const":11,"../../utils/dom-utilities.js":14,"../../utils/js-helpers.js":15}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var __s__ = require('../../utils/js-helpers.js');
var __d__ = require('../../utils/dom-utilities.js');
var configConsts = require('../../mgmt/config.const');

"use strict";

var ViewsNav = exports.ViewsNav = function () {
    function ViewsNav(app3d) {
        _classCallCheck(this, ViewsNav);

        this.node = null;
        this.toggleNode = null;
        this.ulNode = null;
        this.liNodes = null;
        this.exploreViewSetsSelection = null; // select button of dropdown in explore tab

        this.isOpened = false;
        this.imagesPath = configConsts.ROOT_IMG_URL;

        this.currentView = 0;
        this.currentViewId = null;
        this.currentViewsSet = null;
        this.currentViewsSetId = null;
        this.guideSection = null; //this is the section under 'guide' tab
        // this.badgesSection = null; //this is the section under 'badges' tab

        this.currentInfoWindow = null; //represents current selected infowindow including drodpown box
        // in guide section in the Navigation Panel
        this.infoWindowTree = []; // it contains info_window_id: data key value
        this.currentMLInfoWindow = null; //current micro learning info window : selected thumbnail
        this.grossInfoWindowIndex = 0; //it starts from 0 and increased for all infowindow
        this.dropdownInfoWindowCount = 0; //represents dropdown infowindow count: so it can be excluded from navigation

        this.currentInfoWindowParentId = null;
        this.currentInfoWindowParentType = "";

        this.infoWinsTreeById = {}; //Infowins dictionary by _id: infowin
        this.infoWinsTreeArray = []; //Array generated recursively based on infoWinsTreeById

        this.viewsById = {};
        this.viewsByGearId = {};
        this.viewsBySelected = {};
        this.viewsSetsById = {};
        this.viewsSetsByName = {};
        this.viewsKeycodes = {};
        this.firstView = null;

        // static values of guide & explore section
        this.highestLevelInfoWindows = {
            guide: null,
            explore: null
        };

        // XMLHttpRequest
        this.xhttp = null;

        this._app3d = app3d;
        this._firstLoad = true;
        this._init();
    }

    _createClass(ViewsNav, [{
        key: '_init',
        value: function _init() {
            this.node = document.getElementById("viewer-nav");
            if (!this.node) {
                return;
            }

            this.toggleNode = document.getElementById("viewer-nav-toggler");
            this.ulNode = document.getElementById("viewer-nav-thumbs");
            this.guideSection = document.getElementById("guide");
            // this.badgesSection = document.getElementById("badges");

            this.exploreViewSetsSelection = document.querySelector("#explore .dropdown-menu");

            __d__.addEventLnr(this.toggleNode, "click", this._toggle.bind(this));
            __d__.addEventLnr(this.ulNode, "click", this._changeViewClick.bind(this));
            // __d__.addEventLnr(this.exploreViewSetsSelection, "click", this._onExploreViewSetSelectionClick.bind(this));

            // tree structure under Guide Tab
            __d__.addEventLnr(this.guideSection, "click", this._onGuideSectionClick.bind(this));
            // __d__.addEventLnr(this.badgesSection, "click", this._onBadgesSectionClick.bind(this));

            this._mapViewsSets();

            this.setViewsSet(0);

            // Flatten infowins
            this._flattenNestedInfowins(window.config);

            // Prepare the XMLHTTPRequest for Ajax
            this.xhttp = new XMLHttpRequest();

            // get high level infowindows of guide section
            this.loadGuideItems();
        }
    }, {
        key: '_mapViewsSets',
        value: function _mapViewsSets() {
            var j = void 0,
                lenJ = void 0,
                viewSet = void 0;

            //Initialize
            this.viewsSetsById = {};
            this.viewsSetsByName = {};

            //Create maps
            for (j = 0, lenJ = window.config.viewsSets.length; j < lenJ; j += 1) {
                viewSet = window.config.viewsSets[j];
                this.viewsSetsById[viewSet._id] = viewSet;
                if (viewSet.name) {
                    this.viewsSetsByName[viewSet.name] = viewSet;
                }
            }
        }
    }, {
        key: '_populateNavigator',
        value: function _populateNavigator() {
            var app3d = this._app3d,
                views = this.currentViewsSet.views,
                viewsClone = _.each(views, function (v, j) {
                v.arrPos = j;
            }),
                j = void 0,
                lenJ = void 0,
                arr = [],
                classN = void 0,
                imgHtml = void 0,
                viewidHtml = void 0,
                v = void 0;

            this.viewsById = {};
            this.viewsByGearId = {};
            this.viewsBySelected = {};
            this.viewsKeycodes = {};
            this.firstView = null;

            for (j = 0, lenJ = viewsClone.length; j < lenJ; j += 1) {
                v = viewsClone[j];
                classN = (v.screenshot ? "" : "no-image") + (j === 0 ? " selected" : "");
                imgHtml = v.screenshot ? "<img src='" + this.imagesPath + v.screenshot + "' alt='" + v.title + "' />" : "";
                viewidHtml = v._id ? " data-viewid='" + v._id + "'" : "";
                arr.push("<li data-n='" + j + "' " + viewidHtml + "  class='" + classN + "'><h3>" + v.title + "</h3>" + imgHtml + "</li>");
                this.viewsById[v._id] = v;
                if (v.name) {
                    this.viewsByGearId[v.name] = v;
                }
                if (v.keyCode) {
                    this.viewsKeycodes[v.keyCode] = v;
                }
                if (v.selected && !this.viewsBySelected[v.selected]) {
                    this.viewsBySelected[v.selected] = v;
                }
            }

            if (lenJ > 0) {
                this.firstView = viewsClone[0];
            }
            this.ulNode.innerHTML = arr.join("");
            this.liNodes = this.ulNode.getElementsByTagName("LI");
        }
    }, {
        key: '_toggle',
        value: function _toggle(ev) {
            this[this.isOpened ? "close" : "open"]();
        }

        // Click event on Guide section

    }, {
        key: '_onGuideSectionClick',
        value: function _onGuideSectionClick(ev) {

            var t = ev.target;

            if (t.nodeName == 'A') {
                if (t.className == 'info-window-selection') {
                    //view set selection
                    var _categoryName = document.querySelector("#guide .info-window-name");
                    _categoryName.setAttribute('value', t.getAttribute('data-title'));

                    var id = t.getAttribute('data-id');
                    var index = t.getAttribute('data-index');
                    this.currentInfoWindow = this.infoWindowTree[index];
                    this.currentInfoWindowParentId = t.getAttribute('data-parentid');
                    this.currentInfoWindowParentType = t.getAttribute('data-parenttype');

                    this.currentMLInfoWindow = null; // clear thumbnail selection info window id

                    var section = document.querySelector('#guide #top-level-infowindows-collection');
                    section.innerHTML = "";

                    if (this.currentInfoWindow) {

                        //this.grossInfoWindowIndex = this.dropdownInfoWindowCount; //keep the array
                        //this.infoWindowTree = this.infoWindowTree.slice(0, this.dropdownInfoWindowCount);
                        var arr = this.updateGuideTree(this.currentInfoWindow.infowins, 'UL', 'top-level', 'world', window.config.mainScene.worldId);
                        section.innerHTML = arr.join("");

                        window.app3dInfowWindow.show({
                            title: this.currentInfoWindow.title,
                            description: this.currentInfoWindow.description,
                            html: this.currentInfoWindow.html
                        }, true);
                    }
                } else if (t.className.includes('info-window-name')) {
                    var childrenSection = t.parentElement.querySelectorAll(':scope > .info-windows');
                    var children = t.parentElement.querySelectorAll(':scope > .info-windows > li');
                    var _id = t.getAttribute('data-id');
                    var _index = t.getAttribute('data-index');

                    //set the current info window

                    this.currentInfoWindow = this.infoWindowTree[_index];
                    this.currentMLInfoWindow = null; // clear thumbnail selection info window id
                    this.unselectInfoWindowThumbs();
                    this.currentInfoWindowParentId = t.getAttribute('data-parentid');
                    this.currentInfoWindowParentType = t.getAttribute('data-parenttype');

                    if (!this.currentInfoWindow) {
                        return;
                    }

                    //update Info Window with infowindow data
                    window.app3dInfowWindow.show({
                        title: this.currentInfoWindow.title,
                        html: this.currentInfoWindow.html
                    }, true);

                    if (!this.currentInfoWindow.infowins || this.currentInfoWindow.infowins.length == 0) {
                        return;
                    }

                    if (!t.className.includes("collapsed")) {
                        t.className += " collapsed";
                        childrenSection[0].className += " collapsed";
                        //t.innerText="+"+t.getAttribute('data-title');
                    } else {
                        childrenSection[0].className = childrenSection[0].className.replace(/\bcollapsed\b/, "");
                        t.className = t.className.replace(/\bcollapsed\b/, "");
                        //t.innerText="-"+t.getAttribute('data-title');
                    }

                    //update the dropdownbox text at the top
                    var categoryName = document.querySelector("#guide .info-window-name");
                    categoryName.setAttribute('value', t.getAttribute('data-title'));
                }
            } else if (t.nodeName == 'IMG') {
                if (t.parentElement.className == 'view-thumbnail') {
                    //clear thumb selection
                    this.unselectInfoWindowThumbs();
                    var infowindowId = t.parentElement.getAttribute("data-infowindow-id"); // set current selected ML infowindow id
                    var _index2 = t.parentElement.getAttribute("data-index");
                    // set Views
                    var n = t.parentElement.getAttribute("data-viewid");

                    this.currentMLInfoWindow = this.infoWindowTree[_index2];
                    this.goToViewId(n, false, this.currentMLInfoWindow);
                }
            }
        }
    }, {
        key: '_changeViewClick',
        value: function _changeViewClick(ev) {
            var me = this,
                t = ev.target,
                n;
            if (t.nodeName !== "LI") {
                return;
            }
            n = t.getAttribute("data-viewid");
            this.goToViewId(n);
        }
    }, {
        key: '_changeCursor',
        value: function _changeCursor(id) {
            var forceClean = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];
            var infoWindow = arguments[2];

            var me = this,
                top,
                h,
                uScrollTop,
                n = this.viewsById[id].arrPos,
                nPrev;

            //Prev
            if (forceClean) {
                _.each(me.liNodes, function (li) {
                    li.className = "";
                });
            } else {
                if (me.currentViewId && this.viewsById[me.currentViewId]) {
                    nPrev = this.viewsById[me.currentViewId].arrPos;
                    if (nPrev < me.liNodes.length) {
                        me.liNodes[nPrev].className = "";
                    }
                }
            }

            //New: update if explore window has associated view
            if (this.node.querySelector('#viewer-nav .nav-tabs .active').innerText.includes('Explore')) {
                // Explore Section is selected

                if (me.liNodes[n]) {
                    me.liNodes[n].className = "selected";
                    this.currentViewId = id;
                    //Scroll?
                    h = this.ulNode.offsetHeight;

                    top = me.liNodes[n].offsetTop - 20;
                    uScrollTop = this.ulNode.scrollTop;
                    if (uScrollTop > top || uScrollTop < top - h) {
                        TweenLite.to(this.ulNode, 0.5, { scrollTo: top - 180, delay: 0.5, ease: Power2.easeInOut });
                    }
                }
            } else {
                var ele = null;

                if (infoWindow) {
                    // mark selected the infowindow
                    ele = this.node.querySelector('#v' + infoWindow.uniqueIndex);
                    if (ele) {
                        if (!ele.className.includes("selected")) {
                            ele.className += " selected";
                        }

                        //Scroll?
                        var ul = this.node.querySelector('#top-level-infowindows-collection');
                        h = ul.offsetHeight;

                        //only if explore window has associated view
                        top = ele.offsetTop;
                        uScrollTop = ul.scrollTop;
                        // if (uScrollTop > top || uScrollTop < top - h) {
                        TweenLite.to(ul, 0.5, { scrollTo: top - h / 4, delay: 0.5, ease: Power2.easeInOut });
                        // }
                    }
                }
            }
        }
    }, {
        key: '_reRenderViews',
        value: function _reRenderViews() {
            var me = this,
                viewsSets;

            //Update viewsSets from React Store
            viewsSets = window.app3dMgmtStore.getState().viewsSets.viewsSetsList.viewsSets;
            if (viewsSets.length > 0) {
                window.config.viewsSets = viewsSets;
                this._mapViewsSets();
                this.setViewsSet(this.currentViewsSetId);
            }

            //Hide current info-window
            //if (window.app3dInfowWindow) { window.app3dInfowWindow.hide(true); }

            //Re-paint views
            me._populateNavigator();

            //Select one
            if (me.currentViewId && (this.viewsById[me.currentViewId] || this.viewsByGearId[me.currentViewId])) {
                me.goToViewId(me.currentViewId, true); //Select previous
            } else if (me.currentViewsSet.views && me.currentViewsSet.views.length > 0) {
                me.goToViewId(me.currentViewsSet.views[0], true); //Select first
            }
        }

        //sometimes one view is associated to several infowindows and infoWindow is required

    }, {
        key: 'goToViewId',
        value: function goToViewId(id) {
            var forceCursorClean = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];
            var infoWindow = arguments[2];

            var v = id === null && this.firstView !== null ? this.firstView : this.viewsById[id] || this.viewsByGearId[id];
            if (!v) {
                return;
            }
            this._app3d.renderer3d._moveCamera(v);
            this._changeCursor(v._id, forceCursorClean, infoWindow);
        }
    }, {
        key: 'open',
        value: function open() {
            this.node.className = "viewer-nav opened";
            this.isOpened = true;
        }
    }, {
        key: 'close',
        value: function close() {
            this.node.className = "viewer-nav";
            this.isOpened = false;
        }

        //Change the ViewStrip with a different Views-Set

    }, {
        key: 'setViewsSet',
        value: function setViewsSet(vsid) {
            var viewsSet;

            if (!isNaN(vsid)) {
                //If a position is sent
                var vsidN = Number(vsid);
                if (vsidN >= 0 && vsidN < window.config.viewsSets.length) {
                    viewsSet = window.config.viewsSets[vsidN];
                }
            } else {
                //If an Id is sent
                viewsSet = this.viewsSetsById[vsid] || this.viewsSetsByName[vsid];
            }

            //If no ViewsSet was found
            if (!viewsSet && window.config.viewsSets.length > 0) {
                console.warn("ViewsSet " + vsid + " not found. Using default.");
                viewsSet = window.config.viewsSets[0];
            }

            this.currentViewsSet = viewsSet;
            this.currentViewsSetId = viewsSet._id;
            this._populateNavigator();

            if (this._firstLoad && this.currentViewsSet.views && this.currentViewsSet.views.length > 0) {
                var firstView = this.currentViewsSet.views[0];
                this._app3d.renderer3d._moveCamera(firstView, 0.1);
                this._changeCursor(firstView._id, true);
                this._firstLoad = false;
            }
        }
    }, {
        key: '_flattenNestedInfowins',
        value: function _flattenNestedInfowins(inp) {
            var me = this;

            function recursiveIter(w) {
                function recurseInfowins(parent) {
                    var g;
                    if (!parent || !parent.infowins) return;

                    for (var k = 0, lenK = parent.infowins.length; k < lenK; k += 1) {
                        g = parent.infowins[k];
                        me.infoWinsTreeById[g._id] = g;
                        me.infoWinsTreeArray.push(g);
                        recurseInfowins(g);
                    }
                }
                recurseInfowins(w);
            }

            this.infoWinsTreeArray = [];
            this.infoWinsTreeById = {};

            recursiveIter(inp);
        }
    }, {
        key: 'updateGuideTree',
        value: function updateGuideTree(infowins, nodeName, topClassName, parentType, parentId) {

            if (!infowins || infowins.length == 0) {
                return [];
            }
            var arr = [];

            if (nodeName == 'UL') {
                //add li tag with text

                for (var i = 0; i < infowins.length; i++) {

                    var ele = infowins[i];
                    ele['uniqueIndex'] = this.grossInfoWindowIndex;
                    this.infoWindowTree[this.grossInfoWindowIndex] = ele;

                    if (ele.view) {
                        if (!this.viewsById[ele.view._id]) {
                            this.viewsById[ele.view._id] = ele.view;
                        }
                    }

                    arr.push("<li class='" + topClassName + "'>");
                    arr.push("<a class='info-window-name collapsed " + (ele.infowins.length ? "with-children " : "") + "' data-index='" + this.grossInfoWindowIndex + "' data-id='" + ele._id + "' data-type='" + (ele.type ? ele.type : "") + "' data-parenttype='" + parentType + "' data-parentid='" + parentId + "' data-title='" + ele.title + "'>");
                    arr.push(ele.title);
                    arr.push("</a>");
                    this.grossInfoWindowIndex++;

                    if (ele.type == "MLparent") {
                        //shows thumbnails
                        arr.push("<div class='thumbnails info-windows collapsed' id= 'v" + ele.uniqueIndex + "' data-info-window-id='" + ele._id + "'>");
                        arr = arr.concat(this.updateGuideTree(ele.infowins, 'DIV', '', 'infowin', ele._id));
                        arr.push("</div>");
                    } else {
                        //add tree item
                        arr.push("<ul class='child-level info-windows collapsed' id= 'v" + ele.uniqueIndex + "' data-info-window-id='" + ele._id + "'>");
                        arr = arr.concat(this.updateGuideTree(ele.infowins, 'UL', '', 'infowin', ele._id));
                        arr.push("</ul>");
                    }

                    arr.push("</li>");
                }
            } else if (nodeName == 'DIV') {
                // add thumbnails

                for (var i = 0; i < infowins.length; i++) {

                    var _ele = infowins[i];
                    var viewId = '';
                    var screenshot = '';

                    _ele['uniqueIndex'] = this.grossInfoWindowIndex;
                    this.infoWindowTree[this.grossInfoWindowIndex] = _ele;

                    if (_ele.view) {
                        viewId = _ele.view._id;
                        screenshot = _ele.view.screenshot;

                        //add view to viewById variable
                        if (!this.viewsById[_ele.view._id]) {
                            this.viewsById[_ele.view._id] = _ele.view;
                        }
                    }

                    arr.push("<div class='view-thumbnail' data-index ='" + this.grossInfoWindowIndex + "' data-viewid='" + viewId + "' id='v" + _ele.uniqueIndex + "' data-parenttype='" + parentType + "' data-parentid='" + parentId + "' data-infowindow-id='" + _ele._id + "'>");
                    this.grossInfoWindowIndex++;
                    arr.push("<h3>" + _ele.title + "</h3>");
                    arr.push("<img src='/system/images/screenshots/" + screenshot + "' title='" + _ele.title.replace("'", "''") + "'/>");
                    arr.push("</div>");
                }
            }

            return arr;
        }
    }, {
        key: 'loadGuideItems',
        value: function loadGuideItems() {

            // update dropdown items of guide section
            var infoWindowHighLevels = document.querySelector("#guide .infowindow-highlevels");
            var arr = [];
            this.highestLevelInfoWindows.guide = window.config.infowins[0].infowins;
            this.grossInfoWindowIndex = 0;

            for (var i = 0; i < this.highestLevelInfoWindows.guide.length; i++) {
                var ele = this.highestLevelInfoWindows.guide[i];
                ele['uniqueIndex'] = this.grossInfoWindowIndex;
                this.infoWindowTree[this.grossInfoWindowIndex] = ele;

                //update infoWindowTree
                // this.infoWindowTree[ele._id] = ele;
                arr.push("<li><a class='info-window-selection' data-index ='" + this.grossInfoWindowIndex + "' data-id='" + ele._id + "' data-title='" + ele.name + "'>" + ele.name + "</a></li>");
                this.grossInfoWindowIndex++;
                this.dropdownInfoWindowCount++;
            }

            infoWindowHighLevels.innerHTML = arr.join("");

            if (this.highestLevelInfoWindows.guide.length == 0) {
                return;
            }

            //select first dropdown item by default
            var categoryName = document.querySelector("#guide .info-window-name");

            categoryName.setAttribute('value', this.highestLevelInfoWindows.guide[0].name);

            this.currentInfoWindow = this.highestLevelInfoWindows.guide[0];

            var _this = this;
            //show infowindow
            setTimeout(function () {
                window.app3dInfowWindow.show({
                    title: _this.highestLevelInfoWindows.guide[0].title,
                    description: _this.highestLevelInfoWindows.guide[0].description,
                    html: _this.highestLevelInfoWindows.guide[0].html
                }, true);
            }, 500);

            arr = this.updateGuideTree(this.highestLevelInfoWindows.guide[0].infowins, 'UL', 'top-level', 'world', window.config.mainScene.worldId);

            var section = document.querySelector('#guide #top-level-infowindows-collection');
            section.innerHTML = arr.join("");
        }

        //unselect current infowindow with thumbnail by viewId

    }, {
        key: 'unselectInfoWindowThumbs',
        value: function unselectInfoWindowThumbs() {
            var eles = this.node.querySelectorAll('.view-thumbnail.selected');
            for (var i = 0; i < eles.length; i++) {
                if (eles[i].className.includes("selected")) {
                    eles[i].className = eles[i].className.replace(/\b selected\b/, "");
                }
            }
        }
    }, {
        key: 'expandCurrentInfoWindow',
        value: function expandCurrentInfoWindow() {
            var ele = document.querySelector("#guide #v" + this.currentInfoWindow.uniqueIndex);
            if (!ele) {
                return;
            }
            var aTag = ele.previousSibling;

            if (ele.className.includes("collapsed")) {
                ele.className = ele.className.replace(/\bcollapsed\b/, "");
                aTag.className = aTag.className.replace(/\bcollapsed\b/, "");
            }
        }
    }]);

    return ViewsNav;
}();

},{"../../mgmt/config.const":11,"../../utils/dom-utilities.js":14,"../../utils/js-helpers.js":15}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var __s__ = require('../../utils/js-helpers.js');
var __d__ = require('../../utils/dom-utilities.js');
"use strict";

var WinInfo = exports.WinInfo = function () {
    function WinInfo(app3d, viewsNav, opxl) {
        _classCallCheck(this, WinInfo);

        this._app3d = app3d;
        this._opxl = opxl;
        this._viewsNav = viewsNav;

        this._node = null;
        this._nodeContent = null;
        this._isPersistant = false;
        this._layoverInfo = { w: 0, h: 0, src: "", x: 0, y: 0, isVisible: false };
        this._iframeHolder = {};
        this._mouseStart = { isDown: false, x: 0, y: 0 };
        this._mouseOverSpanGloss = null;
        this._currentInfowin = null;

        this._isTouchScreen = !!(window.Modernizr && window.Modernizr.touchevents);
        this.__lastClick = new Date();

        this.init();
    }

    _createClass(WinInfo, [{
        key: 'init',
        value: function init() {
            this._node = document.getElementById("win-info");
            this._nodeContent = document.getElementById("win-info-container");
            this._createIframeHolder();

            // __d__.removeEventLnr(this._nodeContent, "click", this._interceptLinks.bind(this)); //in case registered
            __d__.addEventLnr(this._nodeContent, "click", this._interceptLinks.bind(this));
            // close event for popup modal

            var imageModalLayer = document.querySelector('#image-modal-layer');
            __d__.addEventLnr(imageModalLayer, "click", this.closeImageModal);
        }
    }, {
        key: '_createIframeHolder',
        value: function _createIframeHolder() {
            var d0 = document.createElement("div"),
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

        // is any info window selected in Info Window under guide section

    }, {
        key: 'isGuideInfoWindowSelected',
        value: function isGuideInfoWindowSelected() {
            //check guide section is selected
            var tab = this._viewsNav.node.querySelector('.viewer-tabs>li.active>a');
            if (!tab) return false;
            if (tab.getAttribute("data-id") != 'guide') return false;

            if (this._viewsNav.currentInfoWindow && this._viewsNav.currentInfoWindow.id) {
                return true;
            } else {
                return false;
            }
        }
    }, {
        key: 'show',
        value: function show(info, persist) {
            var keyOfInfoMap = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];

            var spanGlosses = void 0,
                j = void 0,
                lenJ = void 0,
                spn = void 0,
                opxl = this._opxl,
                content = '';

            //create navigation section: it will be updated in another function
            //if current view belongs to current info_window then show next & back button
            if (this._viewsNav.node.querySelector('#viewer-nav .nav-tabs .active').innerText.includes('Guide')) {
                var navInfo = { show: false, prevId: null, nextId: null, prevViewId: null, nextViewId: null };

                var backIndex = -1,
                    nextIndex = -1,
                    uniqueIndex = -1;
                if (this._viewsNav.currentMLInfoWindow == null) {
                    uniqueIndex = this._viewsNav.currentInfoWindow.uniqueIndex;
                } else {
                    uniqueIndex = this._viewsNav.currentMLInfoWindow.uniqueIndex;
                }

                if (uniqueIndex >= this._viewsNav.dropdownInfoWindowCount) {
                    if (uniqueIndex > this._viewsNav.dropdownInfoWindowCount) {
                        //excluding  SCTE_BPI: top level dropdown
                        backIndex = uniqueIndex - 1;
                    }
                    if (uniqueIndex < this._viewsNav.grossInfoWindowIndex - 1) {
                        nextIndex = uniqueIndex + 1;
                    }
                }

                if (backIndex != -1 || nextIndex != -1) {
                    navInfo.show = true;
                    if (backIndex > -1 && this._viewsNav.infoWindowTree[backIndex].view) {
                        navInfo.prevViewId = this._viewsNav.infoWindowTree[backIndex].view._id;
                        navInfo.prevId = this._viewsNav.infoWindowTree[backIndex]._id;
                    }
                    if (nextIndex > -1 && this._viewsNav.infoWindowTree[nextIndex].view) {
                        navInfo.nextId = this._viewsNav.infoWindowTree[nextIndex]._id;
                        navInfo.nextViewId = this._viewsNav.infoWindowTree[nextIndex].view._id;
                    }
                }

                if (navInfo.show == true) {
                    content = '<div class="navigation">';
                    if (navInfo.prevId) {
                        content += '<a class="pull-left" data-index="' + backIndex + '" data-id="' + navInfo.prevId + '" data-view-id="' + navInfo.prevViewId + '" >Back</a>';
                    } else {
                        content += '<a class="pull-left disabled">Back</a>';
                    }

                    if (navInfo.nextId) {
                        content += '<a class="pull-right" data-index="' + nextIndex + '" data-id="' + navInfo.nextId + '" data-view-id="' + navInfo.nextViewId + '" >Next</a>';
                    } else {
                        content += '<a class="pull-right disabled">Next</a>';
                    }

                    content += '</div>';
                } else {
                    content = '<div class="navigation">' + '</div>';
                }
            }

            content += '<div class="win-info-content"><h1 class="deviceTitle">' + info.title + "</h1>";
            this._currentInfowin = keyOfInfoMap;

            if (info.description) {
                content += '<h2 class="deviceDescription">' + info.description + "</h2>";
            }
            if (info.html || info.thumbnail_src) {
                content += "<section><div class=\"deviceHtml\">" + info.html + "</div>" + (info.thumbnail_src ? "<img class=\"deviceThumbnail\" src=\"" + info.thumbnail_src + "\" />" : "") + "</section></div>";
            }
            this._nodeContent.innerHTML = content;

            this._node.style.display = "block";
            if (persist) {
                this._node.className = "win-info persisted";
            }
            this._isPersistant = persist;

            this._initSpanGlosses();

            if (opxl && opxl.onShowInfoWindow && typeof opxl.onShowInfoWindow == 'function') {
                opxl.onShowInfoWindow(info, persist);
            }

            var ev = __d__.addEventDsptchr("wininfoShown");
            ev.currentInfoWindow = this._viewsNav.currentInfoWindow;
            ev.currentMLInfoWindow = this._viewsNav.currentMLInfoWindow;
            this._app3d._baseNode.dispatchEvent(ev);
        }
    }, {
        key: '_initSpanGlosses',
        value: function _initSpanGlosses() {
            var me = this,
                spanGlosses = this._nodeContent.getElementsByTagName("SPAN"),
                j = void 0,
                lenJ = void 0,
                spn = void 0,
                eventsDispatchers = void 0,
                isTouchScreen = this._isTouchScreen,
                waitTimeout = void 0;

            //No spans
            if (!spanGlosses) {
                return;
            }

            eventsDispatchers = isTouchScreen ? { fst: "click", scd: "click" } : { fst: "mouseenter", scd: "click" };

            waitTimeout = isTouchScreen ? 450 : 0;

            function addHandlers(sp) {
                var dataHighlight = sp.getAttribute("data-highlight"),
                    dataViewId = sp.getAttribute("data-viewid");

                if (dataHighlight) {
                    __d__.addEventLnr(sp, eventsDispatchers.fst, function () {
                        me._app3d.highlightGlowSibling(dataHighlight);
                    });
                }

                if (dataViewId) {
                    __d__.addEventLnr(sp, eventsDispatchers.scd, function () {
                        var diff = new Date() - me.__lastClick;
                        me.__lastClick = new Date();
                        if (waitTimeout && diff > waitTimeout) {
                            return;
                        }
                        me._viewsNav.goToViewId(dataViewId);
                    });
                }
            }

            //Iterate spans
            for (j = 0, lenJ = spanGlosses.length; j < lenJ; j += 1) {
                spn = spanGlosses[j];
                if (spn.className.indexOf("gloss") < 0) {
                    continue;
                }

                addHandlers(spn);
            }
        }
    }, {
        key: 'hide',
        value: function hide(force) {
            var opxl = this._opxl;

            if (this._isPersistant && !force) {
                return;
            }

            this._node.className = "win-info";
            this._node.style.display = "none";
            this._isPersistant = false;

            // __d__.removeEventLnr(this._nodeContent, "click", this._interceptLinks.bind(this));
            //__d__.removeEventLnr(this._nodeClose, "click", this.hide);
            if (opxl && opxl.onHideInfoWindow && typeof opxl.onHideInfoWindow === 'function') {
                opxl.onHideInfoWindow(force);
            }

            var ev = __d__.addEventDsptchr("wininfoHidden");
            this._app3d._baseNode.dispatchEvent(ev);
        }
    }, {
        key: '_interceptLinks',
        value: function _interceptLinks(ev) {
            var t = ev.target,
                dw = t.getAttribute("data-framewidth"),
                dh = t.getAttribute("data-frameheight");

            if (t.nodeName == "IMG") {
                //show popup window with full size image
                var imageModalLayer = document.querySelector('#image-modal-layer');
                var popupWindowImg = imageModalLayer.querySelector('#img-file');
                popupWindowImg.setAttribute('src', t.getAttribute('src'));
                imageModalLayer.style.display = 'block';
                return;
            } else if (t.nodeName !== "A") {
                //this._interceptSpanGloss(ev);
                return;
            }

            var viewId = '';
            var index = -1;
            if (t.parentElement.className.includes("navigation")) {
                //clear existing selection in Guide section thumbnail
                this._viewsNav.unselectInfoWindowThumbs();
                // move to specific view action

                viewId = t.getAttribute('data-view-id');
                index = t.getAttribute('data-index');

                var curInfoWindowId = t.getAttribute('data-id');

                if (this._viewsNav.infoWindowTree[index].type == "Module" || this._viewsNav.infoWindowTree[index].type == "MLparent") {
                    this._viewsNav.currentInfoWindow = this._viewsNav.infoWindowTree[index];
                    this._viewsNav.currentMLInfoWindow = null;
                } else {
                    //put the code to update Current Info Window of the thumbnail
                    for (var i = index - 1; i >= this._viewsNav.dropdownInfoWindowCount; i--) {
                        if (this._viewsNav.infoWindowTree[i].type == "Module" || this._viewsNav.infoWindowTree[i].type == "MLparent") {
                            this._viewsNav.currentInfoWindow = this._viewsNav.infoWindowTree[i];
                            break;
                        }
                    }
                    this._viewsNav.currentMLInfoWindow = this._viewsNav.infoWindowTree[index];
                }
            } else {
                viewId = t.getAttribute('data-id');
            }

            if (viewId) {
                console.log('interceptLinks');

                //expand current infowindow if collapsed
                this._viewsNav.expandCurrentInfoWindow();

                if (this._viewsNav.currentMLInfoWindow) {
                    this._viewsNav.goToViewId(viewId, false, this._viewsNav.currentMLInfoWindow);
                } else {
                    this._viewsNav.goToViewId(viewId);
                }
            } else {
                if (ev.preventDefault) {
                    ev.preventDefault();
                }

                dw = dw ? Number(String(dw).replace("px", "")) : 0;
                dh = dh ? Number(String(dh).replace("px", "")) : 0;

                this._layoverInfo.w = Math.min(dw || this._app3d.width, this._app3d.width - 40);
                this._layoverInfo.h = Math.min(dh || this._app3d.height, this._app3d.height - 60);
                this.iframeShow(t.getAttribute("href"), t.innerHTML);
            }
        }
    }, {
        key: '_interceptSpanGloss',
        value: function _interceptSpanGloss(ev) {

            var t = ev.target,
                opxl = this._opxl;

            if (t.nodeName !== "SPAN" || t.className.indexOf("gloss") < 0) {
                return;
            }

            if (opxl && opxl.onClickGloss && typeof opxl.onClickGloss === 'function') {
                opxl.onClickGloss(t);
            }
        }
    }, {
        key: '_onHoverSpanGloss',
        value: function _onHoverSpanGloss(ev) {

            var t = ev.target,
                highlightName = void 0,
                opxl = this._opxl;

            if (t.nodeName !== "SPAN" || t.className.indexOf("gloss") < 0) {
                return;
            }

            highlightName = t.getAttribute("data-highlight");
            if (!highlightName) {
                return;
            }

            this._app3d.glowSiblingShow(highlightName);

            if (opxl && opxl.onHoverGloss && typeof opxl.onHoverGloss === 'function') {
                opxl.onHoverGloss(t);
            }
        }
    }, {
        key: '_onOutSpanGloss',
        value: function _onOutSpanGloss(ev) {

            var t = ev.target,
                highlightName = void 0,
                opxl = this._opxl;

            if (t.nodeName !== "SPAN" || t.className.indexOf("gloss") < 0) {
                return;
            }

            highlightName = t.getAttribute("data-highlight");
            if (!highlightName) {
                return;
            }

            this._app3d.glowSiblingHide(highlightName);

            if (opxl && opxl.onOutGloss && typeof opxl.onOutGloss === 'function') {
                opxl.onHoverGloss(t);
            }
        }
    }, {
        key: 'iframeShow',
        value: function iframeShow(src, title, w, h) {
            var opxl = this._opxl;

            if (w) {
                this._layoverInfo.w = w;
            }
            if (h) {
                this._layoverInfo.h = h;
            }

            this._layoverInfo.src = src;
            this._layoverInfo.isVisible = true;

            this._iframeHolder.layover.style.display = "block";
            this._iframeHolder.handleText.innerHTML = title || "";
            this._iframeHolder.src.style.width = "100%";
            this._iframeHolder.src.setAttribute("src", src);
            this.iframeCenter();

            __d__.addEventLnr(this._iframeHolder.handle, "mousedown", this._onMouseDown.bind(this));
            __d__.addEventLnr(this._iframeHolder.closer, "click", this.iframeHide.bind(this));

            this._app3d.pauseRendering();
            if (opxl && opxl.onShowIframe && typeof opxl.onShowIframe === 'function') {
                opxl.onShowIframe(src, title, w, h);
            }
        }
    }, {
        key: 'iframeHide',
        value: function iframeHide() {
            var opxl = this._opxl;

            this._iframeHolder.layover.style.display = "none";
            this._iframeHolder.handleText.innerHTML = "";
            this._iframeHolder.src.src = "";
            this._layoverInfo.isVisible = false;

            __d__.removeEventLnr(this._iframeHolder.handle, "mousedown", this._onMouseDown);
            __d__.removeEventLnr(this._iframeHolder.closer, "click", this.iframeHide);

            this._app3d.resumeRendering();
            if (opxl && opxl.onHideIframe && typeof opxl.onHideIframe === 'function') {
                opxl.onHideIframe();
            }
        }
    }, {
        key: 'iframeCenter',
        value: function iframeCenter() {
            var posX = Math.floor((this._app3d.width - this._layoverInfo.w) / 2),
                posY = Math.floor((this._app3d.height - this._layoverInfo.h) / 2);

            this._iframeHolder.main.style.width = this._layoverInfo.w + "px";
            this._iframeHolder.main.style.height = this._layoverInfo.h + "px";
            this._iframeHolder.main.style.left = posX + "px";
            this._iframeHolder.main.style.top = posY + "px";

            this._iframeHolder.src.style.height = this._layoverInfo.h - 20 + "px";

            this._layoverInfo.x = posX;
            this._layoverInfo.y = posY;
        }
    }, {
        key: '_onMouseDown',
        value: function _onMouseDown(ev) {
            this._mouseStart.x = ev.screenX;
            this._mouseStart.y = ev.screenY;
            this._mouseStart.isDown = true;

            __d__.addEventLnr(this._iframeHolder.layover, "mousemove", this._onMouseMove.bind(this));
            __d__.addEventLnr(this._iframeHolder.handle, "mouseup", this._onMouseUp.bind(this));
        }
    }, {
        key: '_onMouseMove',
        value: function _onMouseMove(ev) {

            if (!this._mouseStart.isDown) {
                return;
            }

            var deltaX = ev.screenX - this._mouseStart.x,
                deltaY = ev.screenY - this._mouseStart.y,
                newX = Math.min(Math.max(this._layoverInfo.x + deltaX, 0), this._app3d.width - 40),
                newY = Math.min(Math.max(this._layoverInfo.y + deltaY, 0), this._app3d.height - 40);

            this._iframeHolder.main.style.left = newX + "px";
            this._iframeHolder.main.style.top = newY + "px";
            this._layoverInfo.x = newX;
            this._layoverInfo.y = newY;

            this._mouseStart.x = ev.screenX;
            this._mouseStart.y = ev.screenY;

            if (!ev.which) {
                this._mouseStart.isDown = false;
            }
        }
    }, {
        key: '_onMouseUp',
        value: function _onMouseUp() {
            this._mouseStart.isDown = false;
            __d__.removeEventLnr(this._iframeHolder.layover, "mousemove", this._onMouseMove);
            __d__.removeEventLnr(this._iframeHolder.handle, "mouseup", this._onMouseUp);
        }

        // update device title, device description, html content

    }, {
        key: 'updateDetail',
        value: function updateDetail(info) {
            if (!this._nodeContent) {
                return;
            }

            var deviceTitle = this._nodeContent.querySelector('.deviceTitle');
            var deviceDescription = this._nodeContent.querySelector('.deviceDescription');
            var section = this._nodeContent.querySelector('section');

            deviceTitle.innerHTML = info.title;
            deviceDescription.innerHTML = info.description;
            section.innerHTML = info.html;
        }

        //update navigation detail: like Prev, Next button

    }, {
        key: 'updateNavDetail',
        value: function updateNavDetail(info) {
            var navSection = this._nodeContent.querySelector('.navigation');

            if (!navSection) {
                return false;
            }
            var content = '';
            if (info.prevId) {
                //content = '<a class="pull-left" data-id="' + info.prevId + '" >Back &larr;</a>';
                content = '<a class="pull-left" data-id="' + info.prevId + '" data-view-id="' + info.prevViewId + '" >Back &larr;</a>';
            } else {
                content = '<a class="pull-left disabled">Back</a>';
            }

            if (info.nextId) {
                content += '<a class="pull-right" data-id="' + info.nextId + '" data-view-id="' + info.nextViewId + '" >&rarr; Next</a>';
            } else {
                content += '<a class="pull-right disabled">Next</a>';
            }
            navSection.innerHTML = content;
        }

        // hide Image Modal

    }, {
        key: 'closeImageModal',
        value: function closeImageModal() {
            var imageModalLayer = document.querySelector('#image-modal-layer');
            imageModalLayer.style.display = 'none';
        }
    }]);

    return WinInfo;
}();

},{"../../utils/dom-utilities.js":14,"../../utils/js-helpers.js":15}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var __s__ = require('../utils/js-helpers.js'),
    __d__ = require('../utils/dom-utilities.js'),
    RColor = require('../utils/random-color.js'),
    infoWcont = require('./infoWcont.js');

"use strict";

var infoMapAndHtml = exports.infoMapAndHtml = function infoMapAndHtml(infoMap, gearList, gearMap, objectsByName, prefix) {
    return new Promise(function (resolve, reject) {

        var key = void 0,
            mappedKey = void 0,
            gearColors = {},
            rColor = new RColor.RColor(),
            imgLoad = void 0;

        if (!gearList || !gearMap) {
            reject();return;
        }

        for (key in gearMap) {
            if (!key) {
                continue;
            }

            mappedKey = gearMap[key];

            if (!gearList[mappedKey]) {
                continue;
            }
            if (!objectsByName[prefix + key]) {
                continue;
            }

            if (!infoMap[key]) {

                if (!gearColors[mappedKey]) {
                    gearColors[mappedKey] = parseInt(rColor.get(true, 0.95, 0.1).replace(/^#/, ''), 16);
                }
                //Create new
                infoMap[key] = new infoWcont.InfoWcont(key, mappedKey, gearList[mappedKey], gearColors[mappedKey]);
            } else {
                //Update info
                infoMap[key].info = gearList[mappedKey];
            }
        }
        resolve(infoMap);
    });
};

},{"../utils/dom-utilities.js":14,"../utils/js-helpers.js":15,"../utils/random-color.js":17,"./infoWcont.js":7}],7:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

//Class View
var InfoWcont = exports.InfoWcont = function InfoWcont(key, mappedKey, info, gearColor) {
    _classCallCheck(this, InfoWcont);

    this.key = key;
    this.mappedKey = mappedKey;
    this.info = info;
    this.gearColor = gearColor;

    this.obj = null;
    this.glowSibling = null;
};

},{}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var __s__ = require('../utils/js-helpers.js');
var __d__ = require('../utils/dom-utilities.js');
"use strict";
//Class Renderer3D

var Renderer3D = exports.Renderer3D = function () {
    function Renderer3D(parent, w, h) {
        _classCallCheck(this, Renderer3D);

        this.scene = null;
        this.renderer = null;
        this.camera = null;
        this.raycaster = new THREE.Raycaster();
        this.mouseVector = new THREE.Vector2();
        this.controls = null;

        this.parent = parent;
        this.container = parent._node;
        this.containerEvents = parent._baseNode;
        this.width = w;
        this.height = h;
        this.frames = 0;

        this.followMouseEvents = false;

        this._INTERSECTED = null;
        this.objsGlow = new THREE.Group();
        this.objsGlow.name = "objsGlow";
        this.objsGlow.visible = false;
        this.objsGlowArray = [];
        this.objsGlowMapped = {};

        this.mouseStart = new THREE.Vector2();
        this.mouseLastClick = new Date();

        this._isTakingScreenshot = false;
        this._floatingCamera = false;
        this._modelsLoaded = {};
        this._modelsMap = [];
        this._modelsMapNames = [];

        this.meshesHolder = new THREE.Group();
        this.meshesHolder.name = "meshesHolder";
        this.meshesRelevant = new THREE.Group();
        this.meshesHolder.add(this.meshesRelevant);
        this._intersectGroup = this.meshesRelevant;
        this._intersectBehind = false;

        this.markersGroup = new THREE.Group();
        this.markersGroup.name = "markersGroup";
        this.meshesRelevant.add(this.markersGroup);

        this.objectsByName = {};
        this.materialsByName = {};

        this._viewTravelling = false;

        this._isRendering = true;
    }

    _createClass(Renderer3D, [{
        key: 'init',
        value: function init() {
            var me = this,
                material = void 0,
                light = void 0,
                lightsGroup = void 0,
                mesh = void 0,
                lightPosAn = 4000,
                addLightHelpers = true,
                callbackMouseover = void 0,
                options = this.parent.options;

            function prepareDirectionalLight(x, y, z) {
                var ll = new THREE.DirectionalLight(0xffffff, 0.30);
                ll.position.set(x, y, z);
                ll.castShadow = true;
                ll.shadow.camera.left = -lightPosAn;
                ll.shadow.camera.right = lightPosAn;
                ll.shadow.camera.top = lightPosAn;
                ll.shadow.camera.bottom = -lightPosAn;
                ll.shadow.camera.far = 50000;
                ll.shadow.camera.near = 1;

                var directionalLightHelper = new THREE.DirectionalLightHelper(ll, 5000);
                me.scene.add(directionalLightHelper);

                return ll;
            }

            if (this.container === null || this.container === undefined) {
                console.error("Container is null. Halting.");return;
            }
            if (!this.width) {
                console.error("Width is null or zero. Halting.");return;
            }
            if (!this.height) {
                console.error("Height is null or zero. Halting.");return;
            }

            this.scene = new THREE.Scene();

            this.renderer = new THREE.WebGLRenderer({
                antialias: true,
                alpha: true
            });
            this.renderer.shadowMap.enabled = true;
            this.renderer.shadowMapSoft = true;

            this.renderer.setClearColor(options.colors.background, 1);

            this.renderer.setPixelRatio(window.devicePixelRatio);
            this.renderer.setSize(this.width, this.height);
            this.renderer.physicallyCorrectLights = true;
            this.renderer.gammaInput = true;
            this.renderer.gammaOutput = true;
            this.renderer.toneMapping = THREE.ReinhardToneMapping;
            this.renderer.toneMappingExposure = Math.pow(0.7, 5.0);

            this.container.divRenderC.appendChild(this.renderer.domElement);

            this.camera = new THREE.PerspectiveCamera(35, this.width / this.height, 1, 100000);
            this.camera.position.z = options.initialCameraPosition.z;
            this.camera.position.x = options.initialCameraPosition.x;
            this.camera.position.y = options.initialCameraPosition.y;

            this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
            this.controls.enableDamping = true;
            this.controls.dampingFactor = options.dampingFactor || 0.3;
            this.controls.minPolarAngle = 0;
            this.controls.maxPolarAngle = Math.PI;
            this.controls.maxDistance = 10000;
            this.controls.minDistance = 0;
            this.controls.mouseButtons = { PAN: THREE.MOUSE.LEFT, ZOOM: THREE.MOUSE.MIDDLE, ORBIT: THREE.MOUSE.RIGHT };
            this.controls.rotateSpeed = 0.1;
            this.controls.panBottomLimit = 40;
            this.controls.panTopLimit = 1000;
            //this.controls.enableKeys = false;
            //this.controls.enablePan = false;
            //this.controls.enabled = this.parent._freeMove;

            this.raycaster = new THREE.Raycaster();
            this.mouseVector = new THREE.Vector2();

            lightsGroup = new THREE.Group();

            lightsGroup.name = "lightsGroup";
            this.lightsGroup = lightsGroup;
            this.scene.add(lightsGroup);

            this.scene.add(this.meshesHolder);
            var bbox = new THREE.BoundingBoxHelper(this.meshesHolder, 0x000000);
            bbox.visible = false;
            bbox.name = "main-bounding-box";
            this.scene.add(bbox);
            this.bbox = bbox;

            this.scene.add(this.objsGlow);

            callbackMouseover = me.parent._callbackMouseover;
            __d__.addEventLnr(this.parent._node.divRenderC, "mousemove", function (e) {
                me.mouseVector.x = e.clientX / me.width * 2 - 1;
                me.mouseVector.y = -(e.clientY / me.height) * 2 + 1;
                if (callbackMouseover) {
                    callbackMouseover(me._INTERSECTED);
                }
            });

            __d__.addEventLnr(me.parent._node.divRenderC, "mousedown", function (e) {
                me.mouseStart = new THREE.Vector2(e.clientX, e.clientY);
            });

            __d__.addEventLnr(me.parent._node.divRenderC, "mouseup", function (e) {

                var mouseEnd = new THREE.Vector2(e.clientX, e.clientY),
                    delta = me.mouseStart.distanceTo(mouseEnd),
                    insConnection = void 0,
                    ev = void 0;

                //If the distance isn't small the user is rotating the object, not clicking it.
                if (delta > 15) {
                    return;
                }

                //Fire click event
                ev = __d__.addEventDsptchr("clicked");
                ev.intersected = me._INTERSECTED;
                me.containerEvents.dispatchEvent(ev);

                //doubleclick event
                if (new Date() - me.mouseLastClick < 350) {
                    ev = __d__.addEventDsptchr("doubleclicked");
                    ev.intersected = me._INTERSECTED;
                    me.containerEvents.dispatchEvent(ev);
                }
                me.mouseLastClick = new Date();
            });
        }
    }, {
        key: 'resize3DViewer',
        value: function resize3DViewer(w, h) {
            if (!this.camera) {
                return;
            }
            this.width = w;
            this.height = h;
            this.camera.aspect = w / h;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(w, h);
        }
    }, {
        key: 'addLight',
        value: function addLight(lightData) {
            var name = arguments.length <= 1 || arguments[1] === undefined ? "" : arguments[1];

            var light = void 0,
                bulbGeometry = void 0,
                bulbMat = void 0,
                lightColor = void 0,
                groundColor = void 0;

            if (lightData.color) {
                lightColor = parseInt(lightData.color.replace(/^#/, ''), 16);
            }
            if (lightData.skyColor) {
                lightColor = parseInt(lightData.skyColor.replace(/^#/, ''), 16);
            }
            if (lightData.groundColor) {
                groundColor = parseInt(lightData.groundColor.replace(/^#/, ''), 16);
            }

            switch (lightData.type) {
                case "pointLight":
                    light = new THREE.PointLight(lightColor, lightData.intensity, lightData.distance, lightData.decay);
                    light.castShadow = true;
                    light.position.set(lightData.position.x, lightData.position.y, lightData.position.z);
                    if (lightData.showPoint) {
                        bulbGeometry = new THREE.SphereGeometry(20, 16, 8);
                        bulbMat = new THREE.MeshStandardMaterial({
                            emissive: 0xff0000,
                            emissiveIntensity: 1,
                            color: 0xff0000
                        });
                        light.add(new THREE.Mesh(bulbGeometry, bulbMat));
                    }
                    break;

                case "hemisphereLight":
                    light = new THREE.HemisphereLight(lightColor, groundColor || lightColor, lightData.intensity);
                    break;

                case "spotLight":
                    light = new THREE.SpotLight(lightColor, lightData.intensity, lightData.distance, lightData.angle, lightData.penumbra, lightData.decay);
                    light.position.set(lightData.position.x, lightData.position.y, lightData.position.z);
                    //light.castShadow = true;
                    if (lightData.showPoint) {
                        bulbGeometry = new THREE.SphereGeometry(20, 16, 8);
                        bulbMat = new THREE.MeshStandardMaterial({
                            emissive: 0xffff00,
                            emissiveIntensity: 1,
                            color: 0xffff00
                        });
                        light.add(new THREE.Mesh(bulbGeometry, bulbMat));
                    }
                    break;

                case "directionalLight":
                    light = new THREE.DirectionalLight(lightColor, lightData.intensity);
                    light.position.set(lightData.position.x, lightData.position.y, lightData.position.z);
                    light.castShadow = true;
                    if (lightData.cameraLeft) {
                        light.shadow.camera.left = lightData.cameraLeft;
                    }
                    if (lightData.cameraRight) {
                        light.shadow.camera.right = lightData.cameraRight;
                    }
                    if (lightData.cameraTop) {
                        light.shadow.camera.top = lightData.cameraTop;
                    }
                    if (lightData.cameraBottom) {
                        light.shadow.camera.bottom = lightData.cameraBottom;
                    }
                    if (lightData.cameraFar) {
                        light.shadow.camera.far = lightData.cameraFar;
                    }
                    if (lightData.cameraNear) {
                        light.shadow.camera.near = lightData.cameraNear;
                    }
                    break;

                case "ambienLight":
                    light = new THREE.AmbientLight(lightColor, lightData.intensity);
                    break;

                default:
                    break;
            }

            if (light) {
                light.name = lightData.type + "-" + name;
                if (lightData.disabled) {
                    light.visible = false;
                }
                this.lightsGroup.add(light);
            }
        }
    }, {
        key: 'loadModel',
        value: function loadModel(modelFilesDir, modelFilesMtl, modelFilesObj) {
            var putDoubleSide = arguments.length <= 3 || arguments[3] === undefined ? false : arguments[3];
            var useLoadingDiv = arguments.length <= 4 || arguments[4] === undefined ? true : arguments[4];


            var that = this,
                node = this.containerEvents,
                loadDiv = node.loadingDiv,
                options = this.parent.options,
                mats = void 0,
                mesh = void 0,
                rt = void 0,
                cm = void 0,
                loader = void 0,
                mtlLoader = void 0,
                objLoader = void 0,
                onProgress = function onProgress(xhr) {
                var percentComplete = xhr.loaded / (xhr.total || 3000000);
                loadDiv.updateLoader(percentComplete, 0.3);
            },
                onLoaded = function onLoaded(fileObj) {
                var ev = __d__.addEventDsptchr("modelLoaded");

                //Dispatch event
                ev.data = { model: fileObj };
                node.dispatchEvent(ev);

                if (useLoadingDiv) {
                    //Finish the loading div
                    loadDiv.updateLoader(1, 0.5);

                    //Hide the loading div
                    setTimeout(function () {
                        loadDiv.hide();
                    }, 500);
                }
            };

            return new Promise(function (resolve, reject) {
                var modelName = modelFilesObj.replace(".", "");

                if (that._modelsLoaded[modelName]) {
                    resolve(modelName);return;
                }

                if (useLoadingDiv) {
                    loadDiv = that.container.loadingDiv;
                    loadDiv.setPercentage(0);
                    loadDiv.setMessage("Loading model...");
                    loadDiv.show();
                }

                mtlLoader = new THREE.MTLLoader();
                mtlLoader.setTexturePath(modelFilesDir);
                mtlLoader.load(modelFilesMtl, function (materials) {
                    var cm = void 0,
                        loader = void 0,
                        key = void 0,
                        myName = void 0;

                    materials.preload();

                    if (modelFilesObj.indexOf("/") >= 0) {
                        var arr = modelFilesObj.split("/");
                        myName = arr[arr.length - 1];
                    } else {
                        myName = modelFilesObj;
                    }

                    for (key in materials.materials) {
                        that.materialsByName[myName.replace(/\./, "") + "--" + materials.materials[key].name] = materials.materials[key];
                    }

                    objLoader = new THREE.OBJLoader();
                    objLoader.setMaterials(materials);
                    objLoader.load(modelFilesObj, function (object) {
                        var m = void 0,
                            mesh = new THREE.Object3D();

                        //Set name
                        if (modelFilesObj.indexOf("/") > 0) {
                            var _arr = modelFilesObj.split("/");
                            myName = _arr[_arr.length - 1];
                        } else {
                            myName = modelFilesObj;
                        }
                        mesh.name = myName;

                        //Iterate the 3D Model
                        object.traverse(function (child) {

                            if (putDoubleSide && child.material) {
                                child.material.side = THREE.DoubleSide;
                            }

                            m = new THREE.Mesh(child.geometry, child.material);
                            m.name = child.name;
                            m.receiveShadow = true;
                            m.castShadow = true;
                            that.globalToLocal(m);
                            mesh.add(m);

                            if (child.name) {
                                that._modelsMap.push({ file: myName, name: child.name });
                                that._modelsMapNames.push(child.name);
                            }
                        });

                        //Add it to a Map of models
                        that._modelsLoaded[modelName] = mesh;
                        onLoaded();
                        resolve(modelFilesObj);
                        return;
                    }, useLoadingDiv ? onProgress : null, function (xhr) {
                        window.alert('An error happened loading assets');
                        console.error(xhr);
                        reject();
                    });
                });
            });
        }
    }, {
        key: 'createMeshesOfModel',
        value: function createMeshesOfModel(fileObj) {
            var models = arguments.length <= 1 || arguments[1] === undefined ? [] : arguments[1];

            var me = this,
                nameModel = fileObj.replace(".", ""),
                j = void 0,
                lenJ = void 0,
                mod = void 0;

            //Create Meshes
            for (j = 0, lenJ = models.length; j < lenJ; j += 1) {
                mod = models[j];
                if (mod.obj !== fileObj) {
                    continue;
                }
                var mesh = this.insertModel(mod.obj, mod.position, mod.rotation, mod.scale, "", lenJ > 1);
                if (mesh) {
                    this.meshesHolder.add(mesh);
                }
            }
        }
    }, {
        key: 'insertModel',
        value: function insertModel(modelFileObj) {
            var p = arguments.length <= 1 || arguments[1] === undefined ? { x: 0, y: 0, z: 0 } : arguments[1];
            var r = arguments.length <= 2 || arguments[2] === undefined ? { x: 0, y: 0, z: 0 } : arguments[2];
            var s = arguments.length <= 3 || arguments[3] === undefined ? { x: 1, y: 1, z: 1 } : arguments[3];
            var baseName = arguments.length <= 4 || arguments[4] === undefined ? "" : arguments[4];
            var doClone = arguments.length <= 5 || arguments[5] === undefined ? false : arguments[5];


            var me = this,
                position = new THREE.Vector3(p.x, p.y, p.z),
                rotation = new THREE.Vector3(r.x, r.y, r.z),
                scale = new THREE.Vector3(s.x, s.y, s.z),
                nameModel = modelFileObj.replace(".", ""),
                obj = this._modelsLoaded[nameModel];

            if (obj) {
                var mesh = doClone ? obj.clone() : obj;

                mesh.position.x = position.x;
                mesh.position.y = position.y;
                mesh.position.z = position.z;
                mesh.rotation.x = rotation.x / 180 * Math.PI;
                mesh.rotation.y = rotation.y / 180 * Math.PI;
                mesh.rotation.z = rotation.z / 180 * Math.PI;
                mesh.scale.x = scale.x;
                mesh.scale.y = scale.y;
                mesh.scale.z = scale.z;

                mesh.updateMatrix();
                mesh.matrixAutoUpdate = false;

                if (!baseName) {
                    if (modelFileObj.indexOf("/") >= 0) {
                        var arr = modelFileObj.split("/");
                        baseName = arr[arr.length - 1];
                    } else {
                        baseName = modelFileObj;
                    }
                    baseName = baseName.replace(/\./, "") + "--";
                }

                mesh.traverse(function (child) {
                    if (child.name) {
                        me.objectsByName[baseName + child.name] = child;
                    }
                });

                return mesh;
            } else {
                console.error(nameModel + " not found");
                return null;
            }
        }
    }, {
        key: 'globalToLocal',
        value: function globalToLocal(mesh) {
            var leaveInZeros = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

            var bbox = new THREE.BoundingBoxHelper(mesh, 0x000000),
                xx = void 0,
                yy = void 0,
                zz = void 0;

            bbox.update();

            xx = bbox.position.x;
            yy = bbox.position.y;
            zz = bbox.position.z;

            mesh.geometry.applyMatrix(new THREE.Matrix4().makeTranslation(-xx, -yy, -zz));

            if (leaveInZeros) {
                return;
            } //Don't put it again to its position
            mesh.position.x = xx;
            mesh.position.y = yy;
            mesh.position.z = zz;
        }
    }, {
        key: 'goToView',
        value: function goToView(v) {
            var timing = arguments.length <= 1 || arguments[1] === undefined ? 1.0 : arguments[1];

            console.error("Obsolete, please use app3dViewsNav.goToViewId(id)");
        }
    }, {
        key: '_moveCamera',
        value: function _moveCamera(vw) {
            var timing = arguments.length <= 1 || arguments[1] === undefined ? 1.0 : arguments[1];

            var me = this;
            var referenceDistance = 150;

            var camPos = this.camera.position,
                tarPos = this.controls.target,
                newCamPos = new THREE.Vector3(vw.cameraPosition.x, vw.cameraPosition.y, vw.cameraPosition.z),
                easeFn = Power2.easeInOut;

            timing = timing + Math.log(Math.max(camPos.distanceTo(newCamPos) / referenceDistance, 1)) * timing * 0.3;
            timing = Math.min(5, Math.max(0.01, timing));

            this._viewTravelling = true;
            if (timing > 2) {
                easeFn = Power3.easeInOut;
            }

            TweenLite.to(camPos, timing, {
                x: vw.cameraPosition.x,
                y: vw.cameraPosition.y,
                z: vw.cameraPosition.z,
                ease: easeFn });
            TweenLite.to(tarPos, timing, {
                x: vw.targetPosition.x,
                y: vw.targetPosition.y,
                z: vw.targetPosition.z,
                ease: easeFn });

            var ev = __d__.addEventDsptchr("viewchanging");
            ev.view = vw;
            me.containerEvents.dispatchEvent(ev);

            setTimeout(function () {
                me._viewTravelling = false;
                var ev = __d__.addEventDsptchr("viewchanged");
                ev.view = vw;
                me.containerEvents.dispatchEvent(ev);
            }, timing * 1000);
        }
    }, {
        key: 'animate',
        value: function animate() {
            var me = this;

            function anim() {
                requestAnimationFrame(anim);
                me.controls.update();
                me.render();
            }
            anim();
        }
    }, {
        key: 'render',
        value: function render() {
            if (this._isTakingScreenshot || !this._isRendering) {
                return;
            }
            this.frames += 1;

            if (!(this.frames & 3)) {
                //this.frames & 3 - every 4 frames
                this.raycaster.setFromCamera(this.mouseVector.clone(), this.camera);

                var intersects = this.raycaster.intersectObjects(this._intersectGroup.children, true),
                    lenI = intersects.length;

                if (lenI > 0) {
                    var intersect0 = intersects[0].object;

                    if (intersect0 !== this._INTERSECTED) {
                        var ev = __d__.addEventDsptchr("pointerchanged");
                        ev.intersected = intersect0;
                        this.containerEvents.dispatchEvent(ev);
                        this._INTERSECTED = intersect0;
                    }
                } else {
                    if (this._INTERSECTED) {
                        var _ev = __d__.addEventDsptchr("pointerchanged");
                        _ev.intersected = null;
                        this.containerEvents.dispatchEvent(_ev);
                        this._INTERSECTED = null;
                    }
                }
            }

            /*
            this.lightsGroup.rotation.x = this.camera.rotation.x;
            this.lightsGroup.rotation.y = this.camera.rotation.y;
            this.lightsGroup.rotation.z = this.camera.rotation.z;
            */
            this.renderer.render(this.scene, this.camera);
        }
    }]);

    return Renderer3D;
}();

},{"../utils/dom-utilities.js":14,"../utils/js-helpers.js":15}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var __s__ = require('../utils/js-helpers.js'),
    __d__ = require('../utils/dom-utilities.js'),
    Preloader = require('../utils/preloader.js'),
    RColor = require('../utils/random-color.js'),
    Renderer = require('./renderer.js'),
    datalayer = require('./datalayer.js');

//Class Scene

var Scene = exports.Scene = function () {
    function Scene(node, opts) {
        var callbackMouseover = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];

        _classCallCheck(this, Scene);

        var me = this;
        var version = 0.1;

        this.options = __s__.extend({
            loaderColor: "#dddddd",
            loaderColorSucess: "#bbbbbb",
            colors: { background: 0xa0cadb, sunlight: 0xe2e2ee },
            dampingFactor: 0.2,
            models: [],
            baseDir: "/3DObjects/",
            initialCameraPosition: { x: 0, y: 30, z: 100 },
            screenshots: { width: 600, height: 400, format: "png", transparent: true }
        }, opts);

        var ic = this.options.initialCameraPosition;
        this._cameraPosition = new THREE.Vector3(ic.x, ic.y, ic.z);

        this.width = 0;
        this.height = 0;
        this._callbackMouseover = callbackMouseover;

        this._baseNode = node;
        this._node = function createDomElements() {
            var divMainC = void 0,
                divRenderC = void 0,
                divLloadingC = void 0,
                divLoadingText = void 0,
                baseId = "app3d-container-" + Math.round(Math.random() * 100000);

            //Main DOM element
            divMainC = document.createElement("div");
            divMainC.className = "app3d-container";
            divMainC.id = baseId;

            //Renderer container
            divRenderC = document.createElement("div");
            divRenderC.className = "app3d-render-container";
            divRenderC.id = baseId + "-render";
            divMainC.appendChild(divRenderC);
            divMainC.divRenderC = divRenderC;

            //Loading div
            divLloadingC = document.getElementById("app-3d-loading-div");
            if (!divLloadingC) {
                divLloadingC = document.createElement("div");
                divLloadingC.className = "app3d-loading-div";
                divLloadingC.id = baseId + "-loading-div";
                divMainC.appendChild(divLloadingC);
            }

            //Loading text inside loading div
            divLoadingText = document.getElementById("app-3d-loading-div-text");
            if (!divLoadingText) {
                divLoadingText = document.createElement("div");
                divLoadingText.className = "app3d-loading-div-text";
                divLoadingText.id = baseId + "-loading-text";
                divLloadingC.appendChild(divLoadingText);
            }

            //initialize loader functions
            divMainC.loadingDiv = new Preloader.Preloader(divLloadingC, divLoadingText, 100, me.options, "img-loader-logo");

            //Append to DOM element
            node.appendChild(divMainC);

            return divMainC;
        }();

        this.renderer3d = null;
        this._datalayer = datalayer;

        this.__currentHighlights = { ___num___: 0 };
        this.__hiddenMappedObjects = {};

        this.init();
    } //constructor

    //  .intersectOthers
    // Set to true to use the objects that aren't in the JSON maps. For normal behaviour, se to false.


    _createClass(Scene, [{
        key: 'init',
        value: function init() {
            var me = this,
                node = this._node,
                ev = void 0,
                hasWebGL = Detector.canvas && Detector.webgl;

            if (!hasWebGL) {
                node.loadingDiv.show();
                node.loadingDiv.setMessage(node.parentNode.getAttribute(!window.WebGLRenderingContext ? "data-gpu" : "data-webgl"));
                return;
            }

            this.updateSize();
            this.renderer3d = new Renderer.Renderer3D(this, this.width, this.height);

            __d__.addEventLnr(window, "resize", function () {
                me.updateSize();
            });

            this.renderer3d.init();
            this.renderer3d.animate();
            this.loadInitialModels();

            setTimeout(function () {
                ev = __d__.addEventDsptchr("initialized");
                me._baseNode.dispatchEvent(ev);
            }, 500);
        }
    }, {
        key: 'loadInitialModels',
        value: function loadInitialModels() {
            var me = this,
                j = void 0,
                lenJ = void 0,
                mod = void 0,
                mesh = void 0,
                models = [],
                toLoad = {},
                baseScene = void 0,
                extraModels = void 0,
                clones = void 0,
                lights = void 0,
                light = void 0,
                lightData = void 0,
                dir = this.options.baseDir;

            if (!window.config || !window.config.mainScene || !window.config.mainScene.baseScene) {
                return;
            }

            //Add main scene model
            baseScene = window.config.mainScene.baseScene;
            this.prefix = baseScene.prefix || "baseSceneobj--";

            this.renderer3d.loadModel(dir + baseScene.texturesPath, dir + baseScene.mtl, dir + baseScene.obj, true, true).then(function (fileObj) {
                var objectsByName = me.renderer3d.objectsByName,
                    materialsByName = me.renderer3d.materialsByName,
                    mat = void 0,
                    matFix = void 0,
                    materialsFix = void 0,
                    matClone = void 0,
                    matCloneObj = void 0,
                    matCloneData = void 0,
                    key = void 0,
                    mappedKey = void 0;
                var prefix = me.prefix;

                me.renderer3d.createMeshesOfModel(fileObj, [{
                    obj: fileObj,
                    position: { x: 0, y: 0, z: 0 },
                    rotation: { x: 0, y: 0, z: 0 },
                    scale: { x: 1, y: 1, z: 1 }
                }]);

                //Clone objects
                clones = window.config.mainScene.clones;
                if (clones && clones.length > 0) {
                    for (j = 0, lenJ = clones.length; j < lenJ; j += 1) {
                        mod = clones[j];
                        if (mod.disabled) {
                            continue;
                        }
                        if (!me.renderer3d.objectsByName[mod.cloneOf]) {
                            console.warn("404: " + mod.cloneOf);continue;
                        }

                        mesh = me.renderer3d.objectsByName[mod.cloneOf].clone();
                        mesh.position.x = mod.position.x;
                        mesh.position.y = mod.position.y;
                        mesh.position.z = mod.position.z;
                        mesh.rotation.x = mod.rotation.x / 180 * Math.PI;
                        mesh.rotation.y = mod.rotation.y / 180 * Math.PI;
                        mesh.rotation.z = mod.rotation.z / 180 * Math.PI;
                        mesh.scale.x = mod.scale.x;
                        mesh.scale.y = mod.scale.y;
                        mesh.scale.z = mod.scale.z;
                        mesh.name = mod.name;

                        me.renderer3d.objectsByName[mod.name] = mesh;
                        me.renderer3d.meshesHolder.add(mesh);
                    }
                }

                //Create infoMap
                window.config.infoMap = {};
                me._populateInfomap(window.config.infoMap, window.config.gearList, window.config.gearMap);

                //Fix materials
                materialsFix = window.config.materialsFix;

                if (materialsFix && materialsFix.clones) {
                    for (j = 0, lenJ = materialsFix.clones.length; j < lenJ; j += 1) {
                        matCloneData = materialsFix.clones[j];
                        matCloneObj = objectsByName[prefix + matCloneData.objectName];
                        if (!matCloneObj || !matCloneObj.material) {
                            continue;
                        }

                        if (!matCloneData.overwriteIfExists && materialsByName[matCloneData.newMaterialName]) {
                            matClone = materialsByName[matCloneData.newMaterialName];
                        } else {
                            matClone = matCloneObj.material.clone();
                            matClone.name = matCloneData.newMaterialName;
                            materialsByName[matCloneData.newMaterialName] = matClone;
                        }
                        matCloneObj.material = matClone;
                    }
                }

                if (materialsFix && materialsFix.fixes) {
                    for (j = 0, lenJ = materialsFix.fixes.length; j < lenJ; j += 1) {
                        matFix = materialsFix.fixes[j];
                        mat = materialsByName[matFix.materialName];
                        if (!mat) {
                            continue;
                        }
                        if (matFix.color) {
                            mat.color.r = matFix.color.r;
                            mat.color.g = matFix.color.g;
                            mat.color.b = matFix.color.b;
                        }
                        if (matFix.specular) {
                            mat.specular.r = matFix.specular.r;
                            mat.specular.g = matFix.specular.g;
                            mat.specular.b = matFix.specular.b;
                        }
                        if (matFix.aoMapIntensity) {
                            mat.aoMapIntensity = matFix.aoMapIntensity;
                        }
                        if (matFix.bumpScale) {
                            mat.bumpScale = matFix.bumpScale;
                        }
                        if (matFix.displacementScale) {
                            mat.displacementScale = matFix.displacementScale;
                        }
                        if (matFix.emissiveIntensity) {
                            mat.emissiveIntensity = matFix.emissiveIntensity;
                        }
                        if (matFix.lightMapIntensity) {
                            mat.lightMapIntensity = matFix.lightMapIntensity;
                        }
                        if (matFix.shininess) {
                            mat.shininess = matFix.shininess;
                        }
                        if (matFix.transparent) {
                            mat.transparent = matFix.transparent;
                        }
                        if (matFix.opacity) {
                            mat.opacity = matFix.opacity;
                        }
                        if (matFix.wireframe) {
                            mat.wireframe = matFix.wireframe;
                        }
                        if (matFix.alphaTest) {
                            mat.alphaTest = matFix.alphaTest;
                        }
                    }
                }
            });

            //Add extra models (load)
            extraModels = window.config.mainScene.load;

            if (extraModels && extraModels.length > 0) {
                for (j = 0, lenJ = extraModels.length; j < lenJ; j += 1) {
                    mod = extraModels[j];
                    if (toLoad[mod.obj]) {
                        continue;
                    }

                    toLoad[mod.obj] = true;

                    this.renderer3d.loadModel(dir + mod.texturesPath, dir + mod.mtl, dir + mod.obj, true, false).then(function (fileObj) {
                        me.renderer3d.createMeshesOfModel(fileObj);
                    });
                }
            }

            //Add views
            //Views are handled in app/ui/viewsNav.js

            //Add lights
            lights = window.config.lights;
            if (lights && lights.length > 0) {
                for (j = 0, lenJ = lights.length; j < lenJ; j += 1) {
                    lightData = lights[j];
                    this.renderer3d.addLight(lightData, j);
                }
            }
        }
    }, {
        key: '_populateInfomap',
        value: function _populateInfomap(infoMap, gearList, gearMap, callback) {
            var me = this,
                prefix = me.prefix,
                objectsByName = me.renderer3d.objectsByName,
                renderer3d = me.renderer3d,
                gearMapReversed = void 0,
                gm = void 0;

            me._datalayer.infoMapAndHtml(infoMap, gearList, gearMap, objectsByName, prefix).then(function (infoMap) {
                var key = void 0,
                    imgLoad = void 0,
                    msh = void 0,
                    mappedKey = void 0;

                for (key in infoMap) {
                    //SKIP !!!! for-loop if exists
                    if (infoMap[key].obj !== null) {
                        continue;
                    }

                    //Move mesh to meshesRelevant & create glowSibling
                    mappedKey = infoMap[key].mappedKey;
                    msh = objectsByName[prefix + key];
                    renderer3d.meshesRelevant.add(msh);
                    renderer3d.meshesHolder.remove(msh);

                    infoMap[key].obj = msh;
                    infoMap[key].glowSibling = me.createGlowSibling(msh, infoMap[key].gearColor, mappedKey);

                    //Pre-load its image
                    if (gearList[mappedKey].thumbnail_src) {
                        imgLoad = new Image();
                        imgLoad.src = gearList[mappedKey].thumbnail_src;
                    }

                    //Improve the 3D Model
                    if (infoMap[key].obj.material) {
                        infoMap[key].obj.material.shininess = 100;
                        infoMap[key].obj.material.needsUpdate = true;
                    }
                    infoMap[key].obj.traverse(function (child) {
                        child.material.shininess = 100;
                        child.material.needsUpdate = true;
                    });
                }
                if (callback) {
                    callback();
                }
            });

            //Reverse gearMap => gearMapReversed
            gearMapReversed = {};
            for (gm in gearMap) {
                if (!gearMapReversed[gearMap[gm]]) {
                    gearMapReversed[gearMap[gm]] = [];
                }
                gearMapReversed[gearMap[gm]].push(gm);
            }
            window.config.gearMapReversed = gearMapReversed;
        }
    }, {
        key: 'createGlowSibling',
        value: function createGlowSibling(mesh) {
            var color = arguments.length <= 1 || arguments[1] === undefined ? 0xff0000 : arguments[1];
            var mappedKey = arguments.length <= 2 || arguments[2] === undefined ? "" : arguments[2];

            var glowMaterial = void 0,
                objGlow = void 0,
                pos = void 0;

            if (!mesh || !mesh.geometry) {
                return null;
            }

            glowMaterial = new THREE.MeshLambertMaterial({ color: color, side: THREE.FrontSide });

            pos = mesh.position;
            objGlow = new THREE.Mesh(mesh.geometry.clone(), glowMaterial);
            objGlow.visible = false;
            objGlow.position.copy(pos);

            this.renderer3d.objsGlow.add(objGlow);
            this.renderer3d.objsGlowArray.push(objGlow);

            //Add a reference to mappedKey group
            if (mappedKey) {
                if (!this.renderer3d.objsGlowMapped[mappedKey]) {
                    this.renderer3d.objsGlowMapped[mappedKey] = [];
                }
                this.renderer3d.objsGlowMapped[mappedKey].push(objGlow);
            }

            return objGlow;
        }
    }, {
        key: 'glowSiblingShow',
        value: function glowSiblingShow(mappedKey) {
            var j = void 0,
                lenJ = void 0,
                mappedGroup = mappedKey ? this.renderer3d.objsGlowMapped[mappedKey] : this.renderer3d.objsGlowArray,
                isHidden = this.__hiddenMappedObjects[mappedKey];

            if (!mappedGroup || isHidden) {
                return;
            }

            for (j = 0, lenJ = mappedGroup.length; j < lenJ; j += 1) {
                mappedGroup[j].visible = true;
            }

            this.renderer3d.objsGlow.visible = true;
        }
    }, {
        key: 'glowSiblingHide',
        value: function glowSiblingHide(mappedKey) {
            var j = void 0,
                lenJ = void 0,
                mappedGroup = mappedKey ? this.renderer3d.objsGlowMapped[mappedKey] : this.renderer3d.objsGlowArray;

            if (!mappedGroup) {
                return;
            }

            if (!mappedKey) {
                this.renderer3d.objsGlow.visible = false;
            }

            for (j = 0, lenJ = mappedGroup.length; j < lenJ; j += 1) {
                mappedGroup[j].visible = false;
            }
        }
    }, {
        key: 'highlightGlowSibling',
        value: function highlightGlowSibling(mappedKey) {
            console.warn("highlightGlowSibling is obsolete, please use flashGlowSibling");
            this.flashGlowSibling(mappedKey);
        }
    }, {
        key: 'flashGlowSibling',
        value: function flashGlowSibling(mappedKey) {
            var onOffInts = [400, 800, 1200],
                tOff = 200;
            var me = this,
                isHidden = this.__hiddenMappedObjects[mappedKey];

            //Function that iterates group of glowSiblings to make them (in)visible
            function turnThemOn(mg, doOn) {
                for (var j = 0, lenJ = mg.length; j < lenJ; j += 1) {
                    mg[j].visible = doOn;
                }
            }

            if (!mappedKey || isHidden || !this.renderer3d.objsGlowMapped[mappedKey]) {
                return;
            }

            //Do not start a highlight if the object is highlighting
            if (this.__currentHighlights[mappedKey]) {
                return;
            }
            //Add it to a temporary store
            this.__currentHighlights[mappedKey] = true;
            this.__currentHighlights.___num___++;

            //Get group
            var mappedGroup = this.renderer3d.objsGlowMapped[mappedKey];

            me.renderer3d.objsGlow.visible = true;
            setTimeout(function () {
                turnThemOn(mappedGroup, true);
            }, onOffInts[0]); //1 On
            setTimeout(function () {
                turnThemOn(mappedGroup, false);
            }, onOffInts[0] + tOff); //1 Off
            setTimeout(function () {
                turnThemOn(mappedGroup, true);
            }, onOffInts[1]); //2 On
            setTimeout(function () {
                turnThemOn(mappedGroup, false);
            }, onOffInts[1] + tOff); //2 Off
            setTimeout(function () {
                turnThemOn(mappedGroup, true);
            }, onOffInts[2]); //3 On
            setTimeout(function () {
                //3 Off.
                turnThemOn(mappedGroup, false);
                //Clean-up
                me.__currentHighlights[mappedKey] = false;
                me.__currentHighlights.___num___--;
                if (me.__currentHighlights.___num___ === 0) {
                    me.renderer3d.objsGlow.visible = false;
                }
            }, onOffInts[2] + tOff);
        }
    }, {
        key: 'setObjectVisibility',
        value: function setObjectVisibility(mappedKey, visibility) {
            var lookIn3dObjectsIfNotFound = arguments.length <= 2 || arguments[2] === undefined ? true : arguments[2];

            var target = void 0,
                arrayOfMapped = void 0,
                isMapped = true,
                isRelevant = true,
                j = void 0,
                lenJ = void 0,
                objj = void 0;

            //Get correspondent array of Objects' names
            arrayOfMapped = window.config.gearMapReversed[mappedKey];

            //Check it is mapped & belongs to relevant meshes
            target = this.renderer3d.objsGlowMapped[mappedKey];

            if (!arrayOfMapped) {
                isMapped = false;
            }
            if (!target) {
                isRelevant = false;
            }

            if (isMapped) {
                this.__hiddenMappedObjects[mappedKey] = !visibility;
            } else if (lookIn3dObjectsIfNotFound) {
                //Not mapped, look in all the 3d objects
                target = this.renderer3d.objectsByName[this.prefix + mappedKey];
                if (target) {
                    arrayOfMapped = [mappedKey];
                }
            }

            if (!arrayOfMapped || arrayOfMapped.length === 0) {
                console.warn(mappedKey + " not found");return;
            }

            //Iterate to show/hide
            for (j = 0, lenJ = arrayOfMapped.length; j < lenJ; j += 1) {
                target = this.renderer3d.objectsByName[this.prefix + arrayOfMapped[j]];
                if (target) {
                    target.visible = !!visibility;
                }
            }
        }
    }, {
        key: 'getDimensions',
        value: function getDimensions() {
            return { width: this.width, height: this.height };
        }
    }, {
        key: 'setDimensions',
        value: function setDimensions(w, h) {
            this.width = w;
            this.height = h;
        }
    }, {
        key: 'updateSize',
        value: function updateSize() {
            var divMainC = void 0,
                par = void 0,
                ev = void 0,
                dim = void 0,
                w = void 0,
                h = void 0;

            divMainC = this._node;
            par = divMainC.parentNode;

            if (par === null || par === undefined) {
                return;
            }

            dim = this.getDimensions();
            w = par.offsetWidth;
            h = par.offsetHeight;

            if (dim.width !== w || dim.height !== h) {
                divMainC.style.width = w + "px";
                divMainC.style.height = h + "px";
                if (this.renderer3d) {
                    this.renderer3d.resize3DViewer(w, h);
                }
                this.setDimensions(w, h);

                ev = __d__.addEventDsptchr("resize");
                this._baseNode.dispatchEvent(ev);
            }
        }
    }, {
        key: 'moveObj',
        value: function moveObj(name) {
            var x = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];
            var y = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];
            var z = arguments.length <= 3 || arguments[3] === undefined ? null : arguments[3];

            var mesh = this.renderer3d.objectsByName[name];
            if (!mesh) {
                console.error(name + " doesn't exist!");return false;
            }
            if (x !== null) {
                mesh.position.x = x;
            }
            if (y !== null) {
                mesh.position.y = y;
            }
            if (z !== null) {
                mesh.position.z = z;
            }
            console.info(name);
            return mesh.position;
        }
    }, {
        key: 'viewPosition',
        value: function viewPosition() {
            var position = arguments.length <= 0 || arguments[0] === undefined ? [null, null, null] : arguments[0];
            var target = arguments.length <= 1 || arguments[1] === undefined ? [null, null, null] : arguments[1];

            var msgError = "",
                camPos = this.renderer3d.camera.position,
                tarPos = this.renderer3d.controls.target,
                toString = function toString(v, t) {
                return (t ? "\"" + t + "\" : " : "") + "{ \"x\": " + v.x + ", \"y\": " + v.y + ", \"z\": " + v.z + " }";
            };

            if (!Array.isArray(position) || position.length !== 3) {
                msgError = "1st parameter 'position' must be an array of length 3 [x,y,z].\n";
            }
            if (!Array.isArray(target) || target.length !== 3) {
                msgError += "2nd parameter 'target' must be an array of length 3 [x,y,z].\n";
            }
            if (msgError) {
                console.error(msgError);return;
            }

            if (position[0]) {
                camPos.x = position[0];
            }
            if (position[1]) {
                camPos.y = position[1];
            }
            if (position[2]) {
                camPos.z = position[2];
            }

            if (target[0]) {
                tarPos.x = target[0];
            }
            if (target[1]) {
                tarPos.y = target[1];
            }
            if (target[2]) {
                tarPos.z = target[2];
            }

            //console.info(toString(camPos, "cameraPosition"));
            //console.info(toString(tarPos, "targetPosition"));
            return [camPos, tarPos];
        }
    }, {
        key: 'pauseRendering',
        value: function pauseRendering() {
            if (this.renderer3d) {
                this.renderer3d._isRendering = false;
            }
        }
    }, {
        key: 'resumeRendering',
        value: function resumeRendering() {
            if (this.renderer3d) {
                this.renderer3d._isRendering = true;
            }
        }
    }, {
        key: 'toggleRendering',
        value: function toggleRendering() {
            var doRender = arguments.length <= 0 || arguments[0] === undefined ? true : arguments[0];

            if (!this.renderer3d) {
                return;
            }
            this.renderer3d._isRendering = !!doRender;
        }

        //Generate screenshots
        //Returns an image/data format

    }, {
        key: 'generateScreenshot',
        value: function generateScreenshot() {
            var width = arguments.length <= 0 || arguments[0] === undefined ? this.options.screenshots.width : arguments[0];
            var height = arguments.length <= 1 || arguments[1] === undefined ? this.options.screenshots.height : arguments[1];
            var format = arguments.length <= 2 || arguments[2] === undefined ? this.options.screenshots.format : arguments[2];
            var transparent = arguments.length <= 3 || arguments[3] === undefined ? this.options.screenshots.transparent : arguments[3];
            var message = arguments.length <= 4 || arguments[4] === undefined ? "Generating screenshot" : arguments[4];
            var autoLoadingDiv = arguments.length <= 5 || arguments[5] === undefined ? true : arguments[5];


            var me = this,
                data = void 0,
                renderer = void 0,
                prevSize = void 0,
                delay = 500,
                imageFormat = "image/png",
                loadDiv = this._node.loadingDiv;

            return new Promise(function (resolve, reject) {

                //Too early
                if (!me.renderer3d) {
                    console.warn("Not ready to take screenshots.");reject("Not ready to take screenshots.");
                }

                me.renderer3d._isTakingScreenshot = true;
                renderer = me.renderer3d.renderer;

                //Default format is PNG
                format = format.toLowerCase();
                if (format === "jpg" || format === "jpeg") {
                    imageFormat = "image/jpeg";
                }

                //Put the loading Div
                if (autoLoadingDiv) {
                    loadDiv.setMessage(message);
                    loadDiv.setPercentage(0);
                    loadDiv.show();
                    loadDiv.updateLoader(1, delay / 1000);
                }

                //Adjust size & background
                renderer.setSize(width, height);
                me.renderer3d.camera.aspect = width / height;
                me.renderer3d.camera.updateProjectionMatrix();

                if (transparent) {
                    renderer.setClearColor(me.options.colors.background, 0);
                }

                setTimeout(function () {
                    //We set a timeout of 250ms to allow the camera & rendererer to get the expected position

                    //Take it
                    renderer.render(me.renderer3d.scene, me.renderer3d.camera);
                    data = renderer.domElement.toDataURL(imageFormat);

                    //Revert size & background
                    renderer.setSize(me.width, me.height);
                    if (transparent) {
                        renderer.setClearColor(me.options.colors.background, 1);
                    }
                    me.renderer3d.camera.aspect = me.width / me.height;
                    me.renderer3d.camera.updateProjectionMatrix();

                    //Hide loading Div (if any)
                    if (autoLoadingDiv) {
                        setTimeout(function () {
                            loadDiv.hide();
                        }, delay);
                    }

                    me.renderer3d._isTakingScreenshot = false;
                    resolve(data);
                }, 250);
            });
        }
    }, {
        key: 'intersectOthers',
        get: function get() {
            return this.renderer3d._intersectGroup === this.renderer3d.meshesHolder.children[1];
        },
        set: function set(v) {
            this.renderer3d._intersectGroup = !!v ? this.renderer3d.meshesHolder.children[1] : this.renderer3d.meshesRelevant;
            this.renderer3d._intersectBehind = !v;
        }
    }]);

    return Scene;
}();

},{"../utils/dom-utilities.js":14,"../utils/js-helpers.js":15,"../utils/preloader.js":16,"../utils/random-color.js":17,"./datalayer.js":6,"./renderer.js":8}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetchCamPos = fetchCamPos;
exports.fetchCamPosSuccess = fetchCamPosSuccess;
exports.fetchCamPosFailure = fetchCamPosFailure;
//Camera coords
var FETCH_CAMPOS = exports.FETCH_CAMPOS = 'FETCH_CAMPOS';
var FETCH_CAMPOS_SUCCESS = exports.FETCH_CAMPOS_SUCCESS = 'FETCH_CAMPOS_SUCCESS';
var FETCH_CAMPOS_FAILURE = exports.FETCH_CAMPOS_FAILURE = 'FETCH_CAMPOS_FAILURE';

function fetchCamPos() {
  var request = new Promise(function (resolve, reject) {
    setTimeout(function () {
      resolve(window.app3dViewer.viewPosition());
    }, 200);
  });

  return {
    type: FETCH_CAMPOS,
    payload: request
  };
}

function fetchCamPosSuccess(data) {
  return {
    type: FETCH_CAMPOS_SUCCESS,
    payload: data
  };
}

function fetchCamPosFailure(error) {
  return {
    type: FETCH_CAMPOS_FAILURE,
    payload: error
  };
}

},{}],11:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var ROOT_URL = exports.ROOT_URL = location.href.indexOf('localhost') > 0 ? 'http://localhost:3000/api' : '/api';
var ROOT_IMG_URL = exports.ROOT_IMG_URL = '/system/images/screenshots/';
var ERROR_RESOURCE = exports.ERROR_RESOURCE = "Couldn't load resource.";

},{}],12:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CanvasArrow = function () {
    function CanvasArrow() {
        var dim = arguments.length <= 0 || arguments[0] === undefined ? 64 : arguments[0];
        var rotation = arguments.length <= 1 || arguments[1] === undefined ? Math.PI / 4 : arguments[1];

        _classCallCheck(this, CanvasArrow);

        this.dim = dim;
        this.rotation = rotation;

        this.canvas = document.createElement('canvas');
        this.canvas.width = dim;
        this.canvas.height = dim;
        this.ctx = this.canvas.getContext('2d');
    }

    _createClass(CanvasArrow, [{
        key: 'drawArrow',
        value: function drawArrow(fillStyle, letter) {

            var ctx = this.ctx,
                size = Math.floor(this.dim * 0.66),
                pad = Math.ceil(this.dim * 0.17),
                mid = this.dim * 0.5,
                lw = Math.ceil(this.dim / 16),
                mEx = size * 0.1;

            ctx.save();
            ctx.translate(mid, mid);
            ctx.rotate(this.rotation);
            ctx.translate(-mid, -mid);

            ctx.strokeStyle = fillStyle;

            ctx.lineCap = "square";

            ctx.beginPath();
            ctx.lineWidth = lw;
            ctx.rect(pad, pad, size, size);
            ctx.fillStyle = "rgba(230,155,24,0.7)";
            ctx.fill();
            ctx.stroke();

            ctx.translate(mEx, -mEx);
            ctx.fillStyle = "#000000";
            ctx.beginPath();
            ctx.moveTo(pad + size * 0.5, pad + 2 * lw);
            ctx.lineTo(pad + size - 2 * lw, pad + 2 * lw);
            ctx.lineTo(pad + size - 2 * lw, pad + size * 0.5);
            ctx.lineTo(pad + size * 0.5, pad + 2 * lw);
            ctx.fill();
            ctx.restore();

            this.ctx.fillStyle = "#000000";

            if (letter) {
                this.ctx.font = "bold 80px Arial";
                this.ctx.textAlign = 'center';
                this.ctx.textBaseline = 'middle';
                this.ctx.fillText(letter, this.canvas.width / 2, this.canvas.height / 2);
            } else {
                this.ctx.beginPath();
                this.ctx.arc(pad + size / 2, pad + size / 2, this.dim / 10, 0, 2 * Math.PI, false);
                this.ctx.fill();
            }

            return this.canvas;
        }
    }, {
        key: 'width',
        get: function get() {
            return this.canvas.width;
        }
    }, {
        key: 'height',
        get: function get() {
            return this.canvas.height;
        }
    }]);

    return CanvasArrow;
}();

module.exports = CanvasArrow;

},{}],13:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CanvasArrow = require('./CanvasArrow.js');

var SpriteArrow2D = function (_THREE$Object3D) {
  _inherits(SpriteArrow2D, _THREE$Object3D);

  function SpriteArrow2D(size) {
    var rotation = arguments.length <= 1 || arguments[1] === undefined ? Math.PI / 4 : arguments[1];
    var letter = arguments[2];
    var options = arguments.length <= 3 || arguments[3] === undefined ? {} : arguments[3];

    _classCallCheck(this, SpriteArrow2D);

    var _this = _possibleConstructorReturn(this, (SpriteArrow2D.__proto__ || Object.getPrototypeOf(SpriteArrow2D)).call(this));

    _this._fillStyle = options.fillStyle || "#e69b18";
    _this._size = size;
    _this._letter = letter;

    _this.canvas = new CanvasArrow(size, rotation);
    _this.createArrow();
    return _this;
  }

  _createClass(SpriteArrow2D, [{
    key: "createArrow",
    value: function createArrow() {
      this.canvas.drawArrow(this._fillStyle, this._letter);

      // cleanup previous texture
      this.cleanUp();

      this.texture = new THREE.Texture(this.canvas.canvas);
      this.texture.needsUpdate = true;
      this.applyAntiAlias();

      if (!this.material) {
        this.material = new THREE.SpriteMaterial({ map: this.texture });
      } else {
        this.material.map = this.texture;
      }

      if (!this.sprite) {
        this.sprite = new THREE.Sprite(this.material);
        this.geometry = this.sprite.geometry;
        this.add(this.sprite);
      }
    }
  }, {
    key: "cleanUp",
    value: function cleanUp() {
      if (this.texture) {
        this.texture.dispose();
      }
    }
  }, {
    key: "applyAntiAlias",
    value: function applyAntiAlias() {
      if (this.antialias === false) {
        this.texture.magFilter = THREE.NearestFilter;
        this.texture.minFilter = THREE.LinearMipMapLinearFilter;
      }
    }
  }, {
    key: "raycast",
    value: function raycast(raycaster, intersects) {

      var matrixPosition = new THREE.Vector3();
      matrixPosition.setFromMatrixPosition(this.matrixWorld);

      var distanceSq = raycaster.ray.distanceSqToPoint(matrixPosition);
      var guessSizeSq = this.scale.x * this.scale.y / 2;

      if (distanceSq > guessSizeSq) {

        return;
      }

      intersects.push({

        distance: Math.sqrt(distanceSq),
        point: this.position,
        face: null,
        object: this

      });
    }
  }, {
    key: "width",
    get: function get() {
      return this.canvas.textWidth;
    }
  }, {
    key: "height",
    get: function get() {
      return this.canvas.textHeight;
    }
  }, {
    key: "fillStyle",
    get: function get() {
      return this._fillStyle;
    },
    set: function set(value) {
      if (this._fillStyle !== value) {
        this._fillStyle = value;
        this.createArrow();
      }
    }
  }]);

  return SpriteArrow2D;
}(THREE.Object3D);

module.exports = SpriteArrow2D;

},{"./CanvasArrow.js":12}],14:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var isInputOrTextarea = exports.isInputOrTextarea = function isInputOrTextarea(input) {
    return input && input.tagName && (input.tagName.toLowerCase() === "textarea" || input.tagName.toLowerCase() === "input" && input.type.toLowerCase() === "text");
};

var isHtmlNode = exports.isHtmlNode = function isHtmlNode(input) {
    return (typeof HTMLElement === "undefined" ? "undefined" : _typeof(HTMLElement)) === "object" ? id instanceof HTMLElement : (typeof id === "undefined" ? "undefined" : _typeof(id)) === "object" && id.nodeType === 1 && typeof id.nodeName === "string";
};

var addEventLnr = exports.addEventLnr = function addEventLnr(obj, type, fn) {
    if (window.attachEvent) {
        obj["e" + type + fn] = fn;
        obj[type + fn] = function () {
            obj["e" + type + fn](window.event);
        };
        obj.attachEvent("on" + type, obj[type + fn]);
    } else {
        obj.addEventListener(type, fn, false);
    }
};

var removeEventLnr = exports.removeEventLnr = function removeEventLnr(obj, type, fn) {
    if (window.detachEvent) {
        obj.detachEvent("on" + type, obj[type + fn]);
    } else {
        obj.removeEventListener(type, fn, false);
    }
};

var addEventDsptchr = exports.addEventDsptchr = function addEventDsptchr(eName) {
    if (window.Event && typeof window.Event === "function") {
        return new Event(eName);
    } else {
        var event = document.createEvent('Event');
        event.initEvent(eName, true, true);
        return event;
    }
};

},{}],15:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var isArray = exports.isArray = function isArray(c) {
    return Array.isArray ? Array.isArray(c) : c instanceof Array;
};

var extend = exports.extend = function extend(base, newObj) {
    var key = void 0,
        obj = JSON.parse(JSON.stringify(base));

    if (newObj) {
        for (key in newObj) {
            if (Object.prototype.hasOwnProperty.call(newObj, key) && Object.prototype.hasOwnProperty.call(obj, key)) {
                obj[key] = newObj[key];
            }
        }
    }
    return obj;
};

var sortNumber = exports.sortNumber = function sortNumber(a, b) {
    return a - b;
};

var trimString = exports.trimString = function trimString(s) {
    var start = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];
    var end = arguments.length <= 2 || arguments[2] === undefined ? true : arguments[2];

    var sTrimmed = s;
    if (start) {
        sTrimmed = sTrimmed.replace(/^\s\s*/, '');
    }
    if (end) {
        sTrimmed = sTrimmed.replace(/\s\s*$/, '');
    }
    return sTrimmed;
};

var arrayToSet = exports.arrayToSet = function arrayToSet(arr) {
    var j = void 0,
        lenJ = void 0,
        outputSet = new Set();
    for (j = 0, lenJ = arr.length; j < lenJ; j += 1) {
        var clazzName = trimString(arr[j]);
        if (!outputSet.has(clazzName)) {
            outputSet.add(clazzName);
        }
    }
    return ouputSet;
};

},{}],16:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Preloader = exports.Preloader = function () {
    function Preloader() {
        var node = arguments.length <= 0 || arguments[0] === undefined ? mandatory() : arguments[0];
        var textNode = arguments[1];
        var radius = arguments[2];
        var opts = arguments[3];
        var imgName = arguments[4];
        var initialMessage = arguments[5];

        _classCallCheck(this, Preloader);

        var canv = void 0;

        if (node === null || node === undefined) {
            return;
        }

        this.node = node;
        canv = document.createElement("canvas");

        this.messages = textNode;
        this.canv = canv;
        this.ctx = canv.getContext("2d");
        this.loadCurrent = 0;
        this.radius = radius;

        this.canv.width = Math.round(radius * 2);
        this.canv.height = Math.round(radius * 2);
        this.setPixelRatio();

        this.opts = opts;
        this.node.appendChild(canv);

        this.image = imgName ? document.getElementById(imgName) : null;
        if (initialMessage) {
            this.setMessage(initialMessage);
        }
    }

    _createClass(Preloader, [{
        key: "rectLoader",
        value: function rectLoader() {
            var per = this.loadCurrent,
                ctx = this.ctx,
                cen = this.radius,
                cenDouble = cen * 2,
                cenHalf = Math.round(cen / 2),
                angle = per * 2 * Math.PI,
                options = this.opts;

            ctx.clearRect(0, 0, cenDouble, cenDouble);

            ctx.beginPath();
            ctx.arc(cen, cen, cenHalf, 0, 2 * Math.PI, false);
            ctx.fillStyle = options.loaderColor;
            ctx.fill();
            ctx.lineWidth = 1;
            ctx.strokeStyle = options.loaderColor;
            ctx.stroke();

            ctx.beginPath();
            ctx.arc(cen, cen, Math.round(cenHalf / 2), 0, angle, false);
            ctx.lineWidth = cenHalf;
            ctx.strokeStyle = options.loaderColorSucess;
            ctx.stroke();

            if (this.image) {
                ctx.drawImage(this.image, cenHalf, cenHalf, cen, cen);
            }
        }
    }, {
        key: "setPixelRatio",
        value: function setPixelRatio() {

            var oldWidth = void 0,
                oldHeight = void 0,
                ctx = this.ctx,
                devicePixelRatio = window.devicePixelRatio || 1,
                backingStoreRatio = ctx.webkitBackingStorePixelRatio || ctx.mozBackingStorePixelRatio || ctx.msBackingStorePixelRatio || ctx.oBackingStorePixelRatio || ctx.backingStorePixelRatio || 1,
                ratio = devicePixelRatio / backingStoreRatio;

            if (devicePixelRatio !== backingStoreRatio) {

                oldWidth = this.canv.width;
                oldHeight = this.canv.height;

                this.canv.width = oldWidth * ratio;
                this.canv.height = oldHeight * ratio;

                this.canv.style.width = oldWidth + "px";
                this.canv.style.height = oldHeight + "px";

                this.ctx.scale(ratio, ratio);
            }
        }
    }, {
        key: "setMessage",
        value: function setMessage(message) {
            var isError = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

            if (this.messages) {
                this.messages.innerHTML = message;
                this.messages.style.color = isError ? "red" : "";
            }
        }
    }, {
        key: "updateLoader",
        value: function updateLoader(per, speed) {
            var me = this;
            if (!me.node) {
                return;
            }
            TweenLite.to(me, speed, {
                loadCurrent: per,
                ease: Power1.easeInOut,
                onUpdate: me.rectLoader,
                onUpdateScope: me
            });
        }
    }, {
        key: "startAnimation",
        value: function startAnimation() {
            if (!this.node) {
                return;
            }
            this.rectLoader();
            this.updateLoader(0.4, 2);
        }
    }, {
        key: "stopAnimation",
        value: function stopAnimation() {
            if (!this.node) {
                return;
            }
            this.updateLoader(1, 0.25);
        }
    }, {
        key: "setPercentage",
        value: function setPercentage(per) {
            if (!this.node) {
                return;
            }
            this.loadCurrent = per;
            this.rectLoader();
        }
    }, {
        key: "show",
        value: function show() {
            if (!this.node) {
                return;
            }
            this.node.style.display = "block";
        }
    }, {
        key: "hide",
        value: function hide() {
            if (!this.node) {
                return;
            }
            this.node.style.display = "none";
        }
    }], [{
        key: "mandatory",
        value: function mandatory() {
            throw new Error('Missing parameter');
        }
    }]);

    return Preloader;
}();

},{}],17:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var RColor = exports.RColor = function () {
    function RColor() {
        _classCallCheck(this, RColor);

        this.hue = Math.random(), this.goldenRatio = 0.618033988749895;
        this.hexwidth = 2;
    }

    _createClass(RColor, [{
        key: "hsvToRgb",
        value: function hsvToRgb(h, s, v) {
            var h_i = Math.floor(h * 6),
                f = h * 6 - h_i,
                p = v * (1 - s),
                q = v * (1 - f * s),
                t = v * (1 - (1 - f) * s),
                r = 255,
                g = 255,
                b = 255;
            switch (h_i) {
                case 0:
                    r = v, g = t, b = p;break;
                case 1:
                    r = q, g = v, b = p;break;
                case 2:
                    r = p, g = v, b = t;break;
                case 3:
                    r = p, g = q, b = v;break;
                case 4:
                    r = t, g = p, b = v;break;
                case 5:
                    r = v, g = p, b = q;break;
            }
            return [Math.floor(r * 256), Math.floor(g * 256), Math.floor(b * 256)];
        }
    }, {
        key: "padHex",
        value: function padHex(str) {
            if (str.length > this.hexwidth) return str;
            return new Array(this.hexwidth - str.length + 1).join('0') + str;
        }
    }, {
        key: "get",
        value: function get(hex, saturation, value) {
            this.hue += this.goldenRatio;
            this.hue %= 1;
            if (typeof saturation !== "number") {
                saturation = 0.5;
            }
            if (typeof value !== "number") {
                value = 0.95;
            }
            var rgb = this.hsvToRgb(this.hue, saturation, value);
            if (hex) {
                return "#" + this.padHex(rgb[0].toString(16)) + this.padHex(rgb[1].toString(16)) + this.padHex(rgb[2].toString(16));
            } else {
                return rgb;
            }
        }
    }]);

    return RColor;
}();

},{}]},{},[1]);
