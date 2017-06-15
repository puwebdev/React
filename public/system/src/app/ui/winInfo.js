var __s__ = require('../../utils/js-helpers.js'),
    __d__ = require('../../utils/dom-utilities.js'),
    localNavigatorMod = require('./localNavigator.js'),
    iframeMod = require('./mods/iframeMod.js'),
    imageModalMod = require('./mods/imageModalMod.js'),
    css3dMod = require('./mods/css3dObjects.js'),
    questionsHlpr = require('./mods/questionsHelper.js'),
    configConsts = require('../../mgmt/config.const');

"use strict";

export class WinInfo {
    constructor(app3d, viewsNav, opxl) {

        this._app3d = app3d;
        this._opxl = opxl;
        this._viewsNav = viewsNav;
        this._localNavigator = null;
        this._css3dObjectsControl = null;

        this._node = null;
        this._nodeContent = null;
        this._nodeContentScrollable = null;
        this._nodeTitle = null;
        this._nodeDescription = null;
        this._nodeHtml = null;

        this._isPersistant = false;
        this._mouseOverSpanGloss = null;

        this._isTouchScreen = !!(window.Modernizr && window.Modernizr.touchevents);
        this.__lastClick = new Date();

        this.__previousInfowinId = null;

        this._init();
    }

    _init() {
        let me = this;

        this._buildUI();

        //Create local and css3d Controls
        this._localNavigator = new localNavigatorMod.localNavigator(this._viewsNav, this);
        this._css3dObjectsControl = new css3dMod.Css3dObjectsControl(this._app3d, this, this._viewsNav);

        //Create Iframe Holder & Image Modal
        this.iframeModule = new iframeMod.IframeModule(this);
        this.imageModal = new imageModalMod.ImageModalModule();

        // Put first infowin, delayed until data is processed
        __d__.addEventLnr(this._app3d._baseNode, "dataProcessed", function() {
            let infowin = me._viewsNav.currentInfoWindow;
            me._app3d.__isReady = true;
            me._viewsNav.open();

            if (!infowin) { return; }
            me._viewsNav._changeToInfowin(infowin._id);
        });       
        
    }

    _buildUI() {
        this._node = document.getElementById("win-info");
        this._nodeContent = document.getElementById("win-info-content");
        this._nodeContentScrollable = document.getElementById("win-info-content-scrollable");
        this._nodeTitle = document.getElementById("infowin-title");
        
        let domDesc = document.createElement("DIV");
        domDesc.id = "descriptionHtml";
        domDesc.className = "description";

        let domSection = document.createElement("SECTION");
        let domHtml = document.createElement("DIV");
        domHtml.id = "deviceHtml";
        domHtml.className = "deviceHtml";
        domSection.appendChild(domHtml);
        
        this._nodeContent.appendChild(domDesc);
        this._nodeContent.appendChild(domSection);

        this._nodeDescription = domDesc;
        this._nodeHtml = domHtml;

        __d__.addEventLnr(this._nodeContent, "mousedown", this._interceptLinks.bind(this));      
    }

    show(info, persist) {
        let me = this,
            appTracker = window.app3dTracker,
            prevIw = this.__previousInfowinId ? this._viewsNav.infoWinsTreeById[this.__previousInfowinId] : null;

        //Set persistance
        this._isPersistant = persist;

        //Update local navigation (next, prev)
        if (info === this._viewsNav.currentInfoWindow) {
            this._localNavigator.setNextPrev(info.prevId, info.nextId);
        }

        //Check & load css3dObjects
        this._css3dObjectsControl.updateCss3dObject(info, prevIw);
        this._css3dObjectsControl.syncCSS3dpage();
 
        //Track user behavior
        appTracker.save("Infowin", info._id, "load", info.world);
        this.__previousInfowinId = info._id;

        //Set HTML
        this._nodeTitle.innerHTML = info.title || "";
        this._nodeContent.innerHTML = "";

        if (info.questionsObj && info.questionsObj.qtype) {
            this._nodeContent.innerHTML = questionsHlpr.questionsHelper.generateHtml(info);
        } else {
            this._nodeDescription.innerHTML = info.description || "";
            this._nodeHtml.innerHTML = info.html || "";
            this._nodeContent.appendChild(this._nodeDescription);
            this._nodeContent.appendChild(this._nodeHtml);
        }

        //Make it visible
        this._node.style.display = "block"; 
        this._nodeContentScrollable.scrollTop = 0;   

        //Attach listeners, delayed
        setTimeout(() => { me._initSpanActions(); }, 1000); 
             
        //Emit event wininfoShown
        let ev = __d__.addEventDsptchr("wininfoShown");
        ev.currentInfoWindow = this._viewsNav.currentInfoWindow;
        ev.currentMLInfoWindow = this._viewsNav.currentMLInfoWindow;
        ev.isPersistant = this._isPersistant;
        this._app3d._baseNode.dispatchEvent(ev);
     
    }

    hide(force) {
        if (this._isPersistant && !force) { return; }

        this._node.style.display = "none"; 
        this._isPersistant = false;     

        let ev = __d__.addEventDsptchr("wininfoHidden");
        this._app3d._baseNode.dispatchEvent(ev);                     
    }    

    showNext() {
        this._localNavigator.btnNext.click();
    }

    showPrev() {
        this._localNavigator.btnPrevious.click();
    }

    _initSpanActions() {
        let me = this,
            spans = this._nodeContent.getElementsByTagName("SPAN"),
            j, lenJ, spn, 
            eventsDispatchers,
            isTouchScreen = this._isTouchScreen,
            waitTimeout;

        //No spans
        if (!spans) { return; }

        eventsDispatchers = isTouchScreen ? 
                { fst: "click", scd: "click"}
                : { fst: "mouseenter", scd: "click" };

        waitTimeout = isTouchScreen ? 450 : 0;

        function addHandlersGloss(sp) {
            let dataHighlight = sp.getAttribute("data-highlight"),
                obj;              

            if (!dataHighlight || !me._app3d.groupsFactory.get(dataHighlight)) { return; }

            __d__.addEventLnr(sp, eventsDispatchers.fst, function () {
                me._app3d.groupsFactory.get(dataHighlight).flash = true;
            });            

            __d__.addEventLnr(sp, eventsDispatchers.scd, function () {
                let diff = (new Date()) - me.__lastClick;
                me.__lastClick = new Date();
                if (waitTimeout && diff > waitTimeout) { return; }
                me._viewsNav._goToDefaultInfowinFor(dataHighlight);
            });           
        }

        function addHandlersInfowinink(sp) {
            let dataInfowin = sp.getAttribute("data-infowinid");              

            if (!dataInfowin) { return; }

            __d__.addEventLnr(sp, eventsDispatchers.scd, function () {
                let diff = (new Date()) - me.__lastClick;
                me.__lastClick = new Date();
                if (waitTimeout && diff > waitTimeout) { return; }
                me._viewsNav._setHashWithID(dataInfowin);
            });           
        }
        
        //Iterate spans
        for (j = 0, lenJ = spans.length; j < lenJ; j += 1) {
            spn = spans[j];
            if (spn.className.indexOf("gloss") >= 0) { addHandlersGloss(spn); }
            if (spn.className.indexOf("infowin-link") >= 0) { addHandlersInfowinink(spn); }
        }
    
    }

    _interceptLinks(ev) {
        let t = ev.target;

        if (t.nodeName === "IMG" && t.className.indexOf("questioncorrectnessicon") < 0) { //show popup window with full size image
            this.imageModal.openImageModal(t.getAttribute('src'));
            return;
        } 
        
        if (t.nodeName === "SPAN" && t.className === "infowin-link") {
            this._viewsNav._setHashWithID(t.getAttribute('data-infowinid'));
            return;
        }

        //Links on IframeModule
        if (t.nodeName !== "A") { return; }  
        if (ev.preventDefault) { ev.preventDefault(); }

        this.iframeModule.iframeShow(t.getAttribute("href"), 
            t.innerHTML, 
            t.getAttribute("data-framewidth"),
            t.getAttribute("data-frameheight"));
        
    }    
}