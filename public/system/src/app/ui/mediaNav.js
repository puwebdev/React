var __s__ = require('../../utils/js-helpers.js'),
    __d__ = require('../../utils/dom-utilities.js'),
    groupsFactory = require('../../core/groups/groupsFactory'),
    configConsts = require('../../mgmt/config.const'),
    tmhlprs = require('./mods/timelineHelpers');

"use strict";

export class MediaNav {
    constructor(app3d, mgmInfo, viewsNav, winInfo) {
        
        this._app3d = app3d;
        this._mgmInfo = mgmInfo;
        this._viewsNav = viewsNav;
        this._winInfo = winInfo;


        this._isVisible = false;
        this.__uIMounted = false;

        this.__globalVolume = 0.8;
        this.__audios = [];

        this.__toReset = [];
        this.__toResetShowHide = {};

        this.__timeline = null;
        this.__timelineData = null;
        this.__isPlaying = false;
        this.__hasEnded = false;
        this.__autoPlayCanStartA = false;
        this.__autoPlayCanStartB = false;
        this.__autoPlayStarted = false;

        this._nodes = {};

        this.__savedCameraValues = null;
        this.__cameraIsTravelling = false;

        //Exec initializers
        this._buildUI();
        this._attachListenersFromInfowindow();

    }

    _buildUI() {

        let me = this,
            d0 = document.getElementById("media-nav-play-pause"),
            d1 = document.getElementById("media-nav-progress-bar"),
            d2 = document.getElementById("volume-down"),
            d3 = document.getElementById("volume-up"),
            d4 = document.getElementById("media-nav-progress-scrub");

        if (this.__uIMounted || !d0) { return; }

        function volumeControl(ev) {
            let id = ev.target.getAttribute("id");
            me.volume += id === "volume-up" ? 0.2 : -0.2;
        }

        __d__.addEventLnr(d0, "click", this._toggle.bind(this));
        __d__.addEventLnr(d4, "click", this._scrub.bind(this));
        __d__.addEventLnr(d2, "click", volumeControl);
        __d__.addEventLnr(d3, "click", volumeControl);

        this._nodes = { playButton: d0, progressBar: d1, scrubBar: d4 };

        this.__uIMounted = true;
    }

    // Public properties -------------------------------------------------------
    get volume() { return this.__globalVolume; }
    set volume(newVol) {
        if (newVol === null || isNaN(newVol)) { return; }

        newVol =  Math.min(1, Math.max(0, newVol));
        this.__globalVolume = newVol;

        let j, lenJ = this.__audios.length;
        for (j = 0; j < lenJ; j += 1) {
            this.__audios[j].volume = newVol;
        } 
    }

    get visible() { return this._isVisible; }
    set visible(v) {
        if (this._isVisible === !!v) { return; }

        !!v ? 
            document.body.className += " media-player-active" 
            : document.body.className = document.body.className.replace(/\bmedia\-player\-active\b/, "");

        this._isVisible = !!v;
    }

    // Private methods ---------------------------------------------------------
    _attachListenersFromInfowindow() {
        let me = this;

        //When camera is travelling to another view
        __d__.addEventLnr(this._app3d._baseNode, "viewchanging", function(ev) {
            me._clearTimeline();

            //Process the timeline
            me._processTimeline(ev.infowin);
        });

        //When camera stops traveling
        __d__.addEventLnr(this._app3d._baseNode, "viewchanged", function(ev) {
            let view = ev.view; //Get View

            me.__autoPlayCanStartB = true;

            if (view.mediaAnimatorAutoStart && !me._mgmInfo._isVisible &&  me.__autoPlayCanStartA && !me.__autoPlayStarted) {
                me.play(0);
                me.__autoPlayStarted = true;
            }
        });       
    }

    // Resets everything (stops audios too)
    _clearTimeline() {
        let j, lenJ = this.__audios.length;

        //Set initial state
        this.__autoPlayStarted = false;        
        this.__autoPlayCanStartA = false;
        this.__autoPlayCanStartB = false;

        //Stop audios
        tmhlprs.timelineHelpers.stopAudio(this);
        this.__audios = [];

        //Stop timeline
        if (this.__timeline) { this.__timeline.stop(); this.__timeline.clear(); }

        //Reset
        this.__toReset.map((ob) => { 
            switch(ob.action){
                case "n-blink": ob.target.blink = false; break;
                case "n-highlight": ob.target.highlight = false; break;
                case "n-position": ob.target.position = {x:0, y:0, z:0}; break;
                case "n-rotation": ob.target.rotation = {x:0, y:0, z:0}; break;
            }
        });
        this.__toReset = [];

        //Update UI
        classie.remove(this._nodes.progressBar, "transitioned");
        this._nodes.progressBar.style.width = "0";
        classie.add(this._nodes.progressBar, "transitioned");
        this.visible = false;

        //Enable controls back
        this._app3d.renderer3d.controls.enabled = true;
        this.__savedCameraValues = null;
        this.__cameraIsTravelling = false;

    }

    _processTimeline(infowin) {

        let me = this,
            data = tmhlprs.timelineHelpers.validateArrayAnims(infowin.view.mediaAnimatorData),
            autoStart = !!infowin.view.mediaAnimatorAutoStart,
            actions = infowin.view.onLoadActions,
            groupsFactory = this._app3d.groupsFactory,
            prevResetShowHide = Object.assign({}, me.__toResetShowHide),
            individualObjects = {};

        this.__toResetShowHide = {};

        const rstShowHide = (ob, doShow = true) => {
            let grp = groupsFactory.get(ob); 
            if (grp) { grp.visible = doShow; me.__toResetShowHide[ob] = grp;} 
        }

        if (data) {
            me._buildTimeline(data, autoStart);
        }

        //Reset visibility of Groups' commands left state
        window.app3dGroupsCommands._returnVisibilityToWorldState();

        //Return to World state
        for (let key in prevResetShowHide) {
            let target = prevResetShowHide[key];
            if (target) { target.visible = !target.groupData.hiddenByDefault; }
        }

        //Current show/hide onLoadActions
        if (actions) { 
            let toShow = actions.show || [],
                toHide = actions.hide || [];

            toShow.map((ob, i) => { rstShowHide(ob, true); });
            toHide.map((ob, i) => { rstShowHide(ob, false); });        
        }    
    }

    //Use data to create the timelineMax
    _buildTimeline(data = null, autoStart = true) {
        if (!data) { return; }

        let me = this, j, lenJ, animData, target;
        this.__timelineData = data;
        this.__timelinesLoaded = 0;
        

        function updateSlider(ev) {
            let per = Math.round(ev.progress() * 100);
            me._nodes.progressBar.style.width = per + "%";
        }

        function canStartPlaying() {
            me.__timelinesLoaded++;
            if (me.__timelinesLoaded !== me.__timelineData.length) { return; }

            me.__autoPlayCanStartA = true;

            if (autoStart && !me._mgmInfo._isVisible && me.__autoPlayCanStartB && !me.__autoPlayStarted) {
                me.play(0);
                me.__autoPlayStarted = true;
            }            
        }

        function stopPlaying() {
            me.pause();
            me.__hasEnded = true;
            me.__savedCameraValues = null;
        }

        function createAnim(dta, tm) {
            switch(dta.type) {
                case "audio":
                    tmhlprs.timelineHelpers.createAudioTween(dta, me).then(function({tween, animData}) { 
                        tm.add(tween, animData.timing || 0);
                        canStartPlaying();
                    });
                    break;
                case "camera":
                    tmhlprs.timelineHelpers.createCameraTween(dta, me).then(function({tween, animData}) { 
                        tm.add(tween, animData.timing || 0);
                        canStartPlaying();
                    });
                    break;
                case "3dObjectState":
                    tmhlprs.timelineHelpers.createStateSet(dta, me).then(function({trgt, tprop, animData}) {
                        tm.set(trgt, tprop, animData.timing || 0);
                        canStartPlaying();
                    });
                    break;
                case "3dObjectPosition":
                    target = groupsFactory.GroupsFactory.get(dta.src);
                    if (!target) { break; }

                    switch(dta.action) {
                        case "set":
                            tm.set(target, { positionX: dta.position.x, positionY: dta.position.y, positionZ: dta.position.z }, 
                                dta.timing || 0);
                            break;
                        case "animate":
                            tm.add(new TweenMax(target, dta.duration, 
                                { positionX: dta.position.x, positionY: dta.position.y, positionZ: dta.position.z , 
                                ease: Power2.easeInOut }), 
                                dta.timing || 0);
                            break;
                        case "animateRevert":
                            tm.add(new TweenMax(target, dta.duration / 2, 
                                { positionX: dta.position.x, positionY: dta.position.y, positionZ: dta.position.z, 
                                ease: Power2.easeInOut, yoyo: true, repeat:1 }), 
                                dta.timing || 0);
                            break;
                    }

                    me.__toReset.push({target: target, action:"n-position"});                    

                    canStartPlaying();
                    break;
                case "3dObjectRotation":
                    target = groupsFactory.GroupsFactory.get(dta.src);
                    if (!target) { break; }

                    switch(dta.action) {
                        case "set":
                            tm.set(target, { rotationX: dta.rotation.x, rotationY: dta.rotation.y, rotationZ: dta.rotation.z }, 
                                dta.timing || 0);
                            break;
                        case "animate":
                            tm.add(new TweenMax(target, dta.duration, 
                                { rotationX: dta.rotation.x, rotationY: dta.rotation.y, rotationZ: dta.rotation.z , 
                                ease: Power2.easeInOut }), 
                                dta.timing || 0);
                            break;
                        case "animateRevert":
                            tm.add(new TweenMax(target, dta.duration / 2, 
                                { rotationX: dta.rotation.x, rotationY: dta.rotation.y, rotationZ: dta.rotation.z, 
                                ease: Power2.easeInOut, yoyo: true, repeat:1 }), 
                                dta.timing || 0);
                            break;
                    }

                    me.__toReset.push({target: target, action:"n-rotation"});                    

                    canStartPlaying();
                    break;
            }
        }
        
        //Create the TimelineMax
        this.__timeline = new TimelineMax({
            onUpdate: updateSlider,
            onUpdateParams:["{self}"],
            onComplete: stopPlaying,
            delay: 1, 
            paused: true,
            align: "start"
        });

        //Iterate the data & add tweens
        for (j = 0, lenJ = data.length; j < lenJ; j += 1) {
            createAnim(data[j], this.__timeline);
        }

        this.visible = true;
    }

    _scrub(ev) {
        let scrubOffsetLeft = windowOffsetLeft(this._nodes.scrubBar),
            scrubWidth = this._nodes.scrubBar.offsetWidth,
            totalDuration = this.__timeline.totalDuration(),
            seek = (ev.clientX - scrubOffsetLeft) / scrubWidth * totalDuration;

        this.play(seek);
    }

    _toggle() {
        if (!this.__timeline) { return; }
        this[this.__isPlaying ? "pause" : "play"]();
    }

    // Public methods ---------------------------------------------------------

    play(seek = null) {
        let pos = seek ? seek : this.__timeline.time();
        if (this.__hasEnded) { pos = 0; this.__hasEnded = false; }

        if (this.__cameraIsTravelling && this.__savedCameraValues) {
            this._app3d.renderer3d.camera.position.copy(this.__savedCameraValues.camPos);
            this._app3d.renderer3d.controls.target.copy(this.__savedCameraValues.tarPos);
            this._app3d.renderer3d.controls.enabled = false;
        }

        this.__savedCameraValues = null;
        tmhlprs.timelineHelpers.restartAudio(this, pos);
        this.__timeline.time(pos);
        this.__timeline.play();
        if (this._nodes.playButton.className.indexOf("is-playing") < 0) { this._nodes.playButton.className += " is-playing"; }
        this.__isPlaying = true;
    }

    pause() {
        if (!this.__timeline) { return; }
        
        tmhlprs.timelineHelpers.stopAudio(this);
        this.__timeline.stop();
        this._nodes.playButton.className = this._nodes.playButton.className.replace(/\bis\-playing\b/, "");
        this.__isPlaying = false;

        //Save camera position if paused during a camera transition
        if (this.__cameraIsTravelling) {
            this.__savedCameraValues = { 
                camPos: this._app3d.renderer3d.camera.position, 
                tarPos: this._app3d.renderer3d.controls.target
            };
            this._app3d.renderer3d.controls.enabled = true;
        }
    }

}


// Helpers -----------------------------------------------------

const windowOffsetLeft = function(el) {
    let actualOffset = el.offsetLeft,
        current = el.offsetParent;

    while (current != null) {
        actualOffset += current.offsetLeft;
        current = current.offsetParent;
    }
    return actualOffset;
}

