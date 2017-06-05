var __s__ = require('../../../utils/js-helpers.js'),
    __d__ = require('../../../utils/dom-utilities.js'),
    groupsFactory = require('../../../core/groups/groupsFactory'),
    feedbackMod = require('./feedbackModal.js'),
    configConsts = require('../../../mgmt/config.const'),
    tmhlprs = require('./timelineHelpers');

"use strict";

export class GroupsCmds {
    constructor(app3d, viewsNav, winInfo) {

        this._app3d = app3d;
        this._viewsNav = viewsNav;
        this._winInfo = winInfo;

        this._currentCommandsByGroup = {};
        this._currentCommandsByObj= {};
        this.__audios = [];
        this.__toReset = [];
        this.__toResetShowHide = {};
        this.__isEnabled = false;

        this._attachListenersFromInfowindow();

    }

    // Private methods ---------------------------------------------------------
    _attachListenersFromInfowindow() {
        let me = this;

        //When camera is travelling to another view
        __d__.addEventLnr(this._app3d._baseNode, "viewchanging", function(ev) {
            me._clearCommands();
        });

        //When camera stops traveling
        __d__.addEventLnr(this._app3d._baseNode, "viewchanged", function(ev) {
            me._processCommands(ev.infowin);
        });       

        //On click
        __d__.addEventLnr(this._app3d._baseNode, "clicked", this._respondToClicks.bind(this));       

    }

    _clearCommands() {

        //Stop audios
        tmhlprs.timelineHelpers.stopAudio(this);

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

        this.__isEnabled = false;
    }

    _returnVisibilityToWorldState() {
        let prevResetShowHide = Object.assign({}, this.__toResetShowHide);
        //Return to World state
        for (let key in prevResetShowHide) {
            let target = prevResetShowHide[key];
            if (target) { target.visible = !target.groupData.hiddenByDefault; }
        }
    }

    _processCommands(infowin) {
        let me = this;
        this._currentCommandsByGroup = {};
        this._currentCommandsByObj = {};
        let gcmds = infowin.groupCommands || [];

        gcmds.map((g) => {
            if (!me._currentCommandsByGroup[g.target]) {
                me._currentCommandsByGroup[g.target] = [];
            }
            me._currentCommandsByGroup[g.target].push(g);

            let gf = groupsFactory.GroupsFactory.groups[g.target];
            //Iterate the objects to create and Obj -> Cmd relationship
            if (gf && gf.groupData && gf.groupData.keys && gf.groupData.keys.length) {
                gf.groupData.keys.map(key => {
                    if (!me._currentCommandsByObj[key]) {
                        me._currentCommandsByObj[key] = [];
                    }
                    me._currentCommandsByObj[key].push(g);
                });
            }
        });

        this.__isEnabled = true; 
    }    

    _respondToClicks(ev) {
        let intersected = ev.intersected;
        if (!this.__isEnabled || 
            !intersected || !intersected.name ||
            !this._currentCommandsByObj[intersected.name]) { return; }

        this._doCommands(intersected.name);
    }

    _doCommands(objName) {
        let cmds = this._currentCommandsByObj[objName];
        if (!cmds) { return; }
        cmds.map(c => { this._doByType(c, this); });
    }

    _doByType(dta, me) {
        let tm = new TimelineMax(), target;

        const gotoInfowin = () => {
            switch (dta.goto) {
                case "goNext": 
                    me._winInfo._localNavigator.goToNext();
                    break;
                case "goPrev": 
                    me._winInfo._localNavigator.goToPrevious();
                    break;
                default: 
                    me._viewsNav._setHashWithID(dta.goto);
            }
        };

        switch(dta.type) {
            case "alert":
                feedbackMod.feedbackModal.show(dta.html, dta.dismissText, dta.goto ? gotoInfowin : null);
                break;
            case "gotoInfowin":
                gotoInfowin();
                break;
            case "audio":
                tmhlprs.timelineHelpers.createAudioTween(dta, this).then(function({tween, animData}) { 
                    tm.add(tween, 0);
                    tm.play();
                });
                break;
            case "camera":
                tmhlprs.timelineHelpers.createCameraTween(dta, this).then(function({tween, animData}) { 
                    tm.add(tween, 0);
                    tm.play();
                });
                break;
            case "3dObjectState":
                tmhlprs.timelineHelpers.createStateSet(dta, this).then(function({trgt, tprop, animData}) {
                    tm.set(trgt, tprop, 0);
                    tm.play();
                });
                break;
            case "3dObjectPosition":
                target = groupsFactory.GroupsFactory.get(dta.src || dta.target);
                if (!target) { break; }

                switch(dta.action) {
                    case "set":
                        tm.set(target, { positionX: dta.position.x, positionY: dta.position.y, positionZ: dta.position.z }, 
                            0);
                        break;
                    case "animate":
                        tm.add(new TweenMax(target, dta.duration, 
                            { positionX: dta.position.x, positionY: dta.position.y, positionZ: dta.position.z , 
                            ease: Power2.easeInOut }), 
                            0);
                        break;
                    case "animateRevert":
                        tm.add(new TweenMax(target, dta.duration / 2, 
                            { positionX: dta.position.x, positionY: dta.position.y, positionZ: dta.position.z, 
                            ease: Power2.easeInOut, yoyo: true, repeat:1 }), 
                            0);
                        break;
                }

                this.__toReset.push({target: target, action:"n-position"});                    

                tm.play();
                break;
            case "3dObjectRotation":
                target = groupsFactory.GroupsFactory.get(dta.src || dta.target);
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

                this.__toReset.push({target: target, action:"n-rotation"});                    

                tm.play();
                break;
        }
    }



}