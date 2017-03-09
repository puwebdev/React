var __s__ = require('../../utils/js-helpers.js');
var __d__ = require('../../utils/dom-utilities.js');
"use strict";

export class WinInfo {
    constructor(app3d, viewsNav, opxl) {

        this._app3d = app3d;
        this._opxl = opxl;
        this._viewsNav = viewsNav;

        this._node = null;
        this._nodeContent = null;
        this._isPersistant = false;
        this._layoverInfo = { w: 0, h: 0, src: "", x: 0, y: 0, isVisible: false };
        this._iframeHolder = {};
        this._mouseStart = { isDown: false, x: 0, y: 0};
        this._mouseOverSpanGloss = null;
        this._currentInfowin = null;

        this._isTouchScreen = !!(window.Modernizr && window.Modernizr.touchevents);
        this.__lastClick = new Date();

        this.init();
    }

    init() {
        this._node = document.getElementById("win-info");
        this._nodeContent = document.getElementById("win-info-container");
        this._createIframeHolder();

        // __d__.removeEventLnr(this._nodeContent, "click", this._interceptLinks.bind(this)); //in case registered
        __d__.addEventLnr(this._nodeContent, "click", this._interceptLinks.bind(this));
        // close event for popup modal

        let imageModalLayer = document.querySelector('#image-modal-layer');
        __d__.addEventLnr(imageModalLayer, "click", this.closeImageModal);
    }

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

    // is any info window selected in Info Window under guide section
    isGuideInfoWindowSelected() {
        //check guide section is selected
        let tab = this._viewsNav.node.querySelector('.viewer-tabs>li.active>a');
        if (!tab) return false;
        if (tab.getAttribute("data-id") != 'guide') return false;

        if (this._viewsNav.currentInfoWindow && this._viewsNav.currentInfoWindow.id) {
            return true;
        } 
        else {
            return false;
        }    
    }

    show(info, persist, keyOfInfoMap = null) {
        //this.buildCurrentInfoWindow(info, persist, keyOfInfoMap); 
        let spanGlosses, j, lenJ, spn,
            opxl = this._opxl,
            correctanswers = '',
            content = '';

        //create navigation section: it will be updated in another function
        //if current view belongs to current info_window then show next & back button
        if (this._viewsNav.node.querySelector('#viewer-nav .nav-tabs .active') && 
            this._viewsNav.node.querySelector('#viewer-nav .nav-tabs .active').innerText && 
            this._viewsNav.node.querySelector('#viewer-nav .nav-tabs .active').innerText.includes('Guide')) {
            var navInfo = {show: false, prevId: null, nextId: null, prevViewId: null, nextViewId: null};

            var backIndex = -1, nextIndex = -1, uniqueIndex = -1;
            if (this._viewsNav.currentMLInfoWindow == null) {
                uniqueIndex = this._viewsNav.currentInfoWindow.uniqueIndex;
            }
            else {
                uniqueIndex = this._viewsNav.currentMLInfoWindow.uniqueIndex;
            }

            if (uniqueIndex >= this._viewsNav.dropdownInfoWindowCount) {
                if (uniqueIndex > this._viewsNav.dropdownInfoWindowCount) { //excluding  SCTE_BPI: top level dropdown
                    backIndex = uniqueIndex -1;
                }
                if ( uniqueIndex < this._viewsNav.grossInfoWindowIndex -1 ) {
                    nextIndex = uniqueIndex + 1;
                }
            } else {
                // If the current InfoWin is for top level dropdowns
                var rootInfoWin = this._viewsNav.currentInfoWindow;
                if (rootInfoWin.infowins && rootInfoWin.infowins.length > 0){
                    // If there are child InfoWins
                    var firstChild = rootInfoWin.infowins[0];
                    nextIndex = firstChild.uniqueIndex;
                }
            }
            
            if (backIndex != -1 || nextIndex !=-1) {
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
                    content += '<a id="pull-left" class="pull-left" data-index="' + backIndex + '" data-id="' + navInfo.prevId + '" data-view-id="' + navInfo.prevViewId + '" >Back</a>';
                }
                else {
                    content += '<a id="pull-left" class="pull-left disabled">Back</a>';
                }

                if (navInfo.nextId) {
                    content += '<a id="pull-right" class="pull-right" data-index="' + nextIndex + '" data-id="' + navInfo.nextId + '" data-view-id="' + navInfo.nextViewId + '" >Next</a>';
                }
                else {
                    content += '<a class="pull-right disabled">Next</a>';
                }

                content +='</div>';
            }
            else {
                content = '<div class="navigation">' +
                    '</div>';
            }    
        }
        
        this._currentInfowin = keyOfInfoMap;

        if (info.qtype && info.qtype != "") {
            
            content += "<div class='win-info-content'><div class='formulation'>";
            content += '<h1 class="deviceTitle">' + info.title + "</h1>";
            if (info.qtext) {content += '<h2 class="deviceDescription">' + info.qtext + "</h2>";}
            //if (info.html || info.thumbnail_src) { content += "<section><div class=\"deviceHtml\">" + info.html + "</div>" + (info.thumbnail_src ? "<img class=\"deviceThumbnail\" src=\"" + info.thumbnail_src  + "\" />" : "") + "</section>"; }            

            if (info.qtype == "single") {

                content += "<div class='qanswer'>";
                correctanswers = "";

                for (var field in info.answers) {
                    var pos = field.indexOf("_");
                    var rightIndex = field.substring(pos + 1);
                    var rightanswer = "rightanswers_" + rightIndex;

                    if (info.rightanswers["rightanswers_0"] == rightanswer) {
                        correctanswers += info.answers[field] + ",";
                    }

                    content += "<div class='r1'>";
                    content += "<input type=\"radio\" name='answer' value='" + info.answers[field].replace(/ /g, "") + "'><label>" + info.answers[field] + "</label>";
                    content += "<img src='' class='questioncorrectnessicon hidden'>";
                    content += "</div>";                    
                }
                
                content += "</div>";

            } else if (info.qtype == "multi") {
                content += "<div class='qanswer'>";

                correctanswers = "";

                for (var field in info.answers) {
                    var a_pos = field.indexOf("_");
                    var rightIndex = field.substring(a_pos + 1);
                    var rightanswer = "rightanswers_" + rightIndex;
                    var correctanswer = false;
                    
                    for (var key in info.rightanswers) {
                        if (info.rightanswers.hasOwnProperty(rightanswer)) {

                            correctanswers += info.answers[field] + ",";
                            status = true;
                            break;
                        }
                    }                    

                    content += "<div class='r1'>";
                    content += "<input type=\"checkbox\" name='answer' value='" + info.answers[field].replace(/ /g, "") + "'><label>" + info.answers[field] + "</label>";
                    content += "<img src='' class='questioncorrectnessicon hidden'>";
                    content += "</div>";                 
                }
               
                content += "</div>";
            }
            content += "</div>";
            content += "<div class='submitbtns' id='submitbtns'>";
            content += "<button type='button' class='btn btn-info' id='mysubmits' onclick=\"doSubmitAnswer('"+ info.qtype +"', '" + correctanswers + "')\"><span className='fa fa-save'></span> Submit</button></div>";            

            content += "<div class='outcome' id='outcome' style='display:none;'>";
            content += "<div class='feedback' id='feedback'>";

            content += "<div class=\"specificfeedback\" id='correctfeedback'>" + info.correctfb + "</div>";
            content += "<div class=\"specificfeedback\" id='incorrectfeedback'>" + info.incorrectfb + "</div>";
            content += "<div class=\"rightanswer\" id='rightanswer'></div>";

            content += "</div>";
            content += "</div>";            

            content += "</div>";           

        } else {
            content += '<div class="win-info-content"><h1 class="deviceTitle">' + info.title + "</h1>";

            if (info.description) {content += '<h2 class="deviceDescription">' + info.description + "</h2>";}
            if (info.html || info.thumbnail_src) { content += "<section><div class=\"deviceHtml\">" + info.html + "</div>" + (info.thumbnail_src ? "<img class=\"deviceThumbnail\" src=\"" + info.thumbnail_src  + "\" />" : "") + "</section></div>"; }            
        }

        this._nodeContent.innerHTML = content;
        
        this._node.style.display = "block"; 

        this._isPersistant = persist;
        
        this._initSpanGlosses();
        
        if (opxl && opxl.onShowInfoWindow && typeof opxl.onShowInfoWindow == 'function') {
            opxl.onShowInfoWindow(info,persist);
        }

        let ev = __d__.addEventDsptchr("wininfoShown");
        ev.currentInfoWindow = this._viewsNav.currentInfoWindow;
        ev.currentMLInfoWindow = this._viewsNav.currentMLInfoWindow;
        this._app3d._baseNode.dispatchEvent(ev);        
    }

    _initSpanGlosses() {
        let me = this,
            spanGlosses = this._nodeContent.getElementsByTagName("SPAN"),
            j, lenJ, spn, 
            eventsDispatchers,
            isTouchScreen = this._isTouchScreen,
            waitTimeout;

        //No spans
        if (!spanGlosses) { return; }

        eventsDispatchers = isTouchScreen ? 
                { fst: "click", scd: "click"}
                : { fst: "mouseenter", scd: "click" };

        waitTimeout = isTouchScreen ? 450 : 0;

        function addHandlers(sp) {
            let dataHighlight = sp.getAttribute("data-highlight"),
                dataViewId = sp.getAttribute("data-viewid");

            if (dataHighlight) {
                __d__.addEventLnr(sp, eventsDispatchers.fst, function () {
                    me._app3d.highlightGlowSibling(dataHighlight);
                });
            }

            if (dataViewId) {
                __d__.addEventLnr(sp, eventsDispatchers.scd, function () {
                    let diff = (new Date()) - me.__lastClick;
                    me.__lastClick = new Date();
                    if (waitTimeout && diff > waitTimeout) { return; }
                    me._viewsNav.goToViewId(dataViewId);
                });
            }
        }
        
        //Iterate spans
        for (j = 0, lenJ = spanGlosses.length; j < lenJ; j += 1) {
            spn = spanGlosses[j];
            if (spn.className.indexOf("gloss") < 0) { continue; }

            addHandlers(spn);
        }
    
    }

    hide(force) {
        let opxl = this._opxl;

        if (this._isPersistant && !force) { return; }

        this._node.className = "win-info";
        this._node.style.display = "none"; 
        this._isPersistant = false;

        // __d__.removeEventLnr(this._nodeContent, "click", this._interceptLinks.bind(this));
        //__d__.removeEventLnr(this._nodeClose, "click", this.hide);
 		if (opxl && opxl.onHideInfoWindow && typeof opxl.onHideInfoWindow === 'function') {
			opxl.onHideInfoWindow(force);
		}

        let ev = __d__.addEventDsptchr("wininfoHidden");
        this._app3d._baseNode.dispatchEvent(ev);		             
    }

    _interceptLinks(ev) {
        let t = ev.target,
            dw = t.getAttribute("data-framewidth"),
            dh = t.getAttribute("data-frameheight");

        if (t.nodeName == "IMG") {
            //show popup window with full size image
            let imageModalLayer = document.querySelector('#image-modal-layer');
            let popupWindowImg = imageModalLayer.querySelector('#img-file');
            popupWindowImg.setAttribute('src',t.getAttribute('src'));
            imageModalLayer.style.display='block';
            return;
        }
        else if (t.nodeName !== "A") {
            //this._interceptSpanGloss(ev);
            return;
        }

        let viewId='';
        let index = -1;
        if (t.parentElement.className.includes("navigation")) {
            //clear existing selection in Guide section thumbnail
            this._viewsNav.unselectInfoWindowThumbs();
            // move to specific view action

            viewId = t.getAttribute('data-view-id');
            index = t.getAttribute('data-index');

            let curInfoWindowId = t.getAttribute('data-id');

            if (this._viewsNav.infoWindowTree[index].type == "Module" || this._viewsNav.infoWindowTree[index].type == "MLparent") {
                this._viewsNav.currentInfoWindow = this._viewsNav.infoWindowTree[index];
                this._viewsNav.currentMLInfoWindow = null;
            }
            else {
                //put the code to update Current Info Window of the thumbnail
                for (let i=index-1; i >= this._viewsNav.dropdownInfoWindowCount; i--) {
                    if (this._viewsNav.infoWindowTree[i].type == "Module" || this._viewsNav.infoWindowTree[i].type == "MLparent") {
                        this._viewsNav.currentInfoWindow = this._viewsNav.infoWindowTree[i];
                        break;
                    }        
                }
                this._viewsNav.currentMLInfoWindow = this._viewsNav.infoWindowTree[index];    
            }
            
        }
        else {
            viewId=t.getAttribute('data-id');
        }

        if (viewId) {
            console.log('interceptLinks');
            
            //expand current infowindow if collapsed
            this._viewsNav.expandCurrentInfoWindow();
            
            if (this._viewsNav.currentMLInfoWindow) {
                this._viewsNav.goToViewId(viewId, false, this._viewsNav.currentMLInfoWindow);
            }
            else {
                this._viewsNav.goToViewId(viewId);
            }
        }
        else {
            if (ev.preventDefault) { ev.preventDefault(); }

            dw = dw ? Number(String(dw).replace("px", "")) : 0;
            dh = dh ? Number(String(dh).replace("px", "")) : 0;

            this._layoverInfo.w = Math.min( dw || this._app3d.width, this._app3d.width - 40);
            this._layoverInfo.h = Math.min( dh || this._app3d.height, this._app3d.height - 60);
            this.iframeShow(t.getAttribute("href"), t.innerHTML);    
        }
        
    }

    _interceptSpanGloss(ev) {

        let t = ev.target, opxl = this._opxl;

        if (t.nodeName !== "SPAN" || t.className.indexOf("gloss") < 0) { return; } 

        if (opxl && opxl.onClickGloss && typeof opxl.onClickGloss === 'function') {
            opxl.onClickGloss(t);
        }
    }

    _onHoverSpanGloss(ev) {

        let t = ev.target, highlightName, opxl = this._opxl;

        if (t.nodeName !== "SPAN" || t.className.indexOf("gloss") < 0) { return; }

        highlightName = t.getAttribute("data-highlight");
        if (!highlightName) { return; }

        this._app3d.glowSiblingShow(highlightName);

        if (opxl && opxl.onHoverGloss && typeof opxl.onHoverGloss === 'function') {
            opxl.onHoverGloss(t);
        }
    }

    _onOutSpanGloss(ev) {

        let t = ev.target, highlightName, opxl = this._opxl;

        if (t.nodeName !== "SPAN" || t.className.indexOf("gloss") < 0) { return; }

        highlightName = t.getAttribute("data-highlight");
        if (!highlightName) { return; }

        this._app3d.glowSiblingHide(highlightName);        

        if (opxl && opxl.onOutGloss && typeof opxl.onOutGloss === 'function') {
            opxl.onHoverGloss(t);
        }
    }

    iframeShow(src, title, w, h) {
        let  opxl = this._opxl;

        if (w) { this._layoverInfo.w = w; }
        if (h) { this._layoverInfo.h = h; }

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

    iframeHide() {
        let  opxl = this._opxl;

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

    // update device title, device description, html content
    updateDetail(info) {
        if (!this._nodeContent) {
            return ;
        }

        var deviceTitle = this._nodeContent.querySelector('.deviceTitle');
        var deviceDescription = this._nodeContent.querySelector('.deviceDescription');
        var section = this._nodeContent.querySelector('section');

        deviceTitle.innerHTML = info.title;
        deviceDescription.innerHTML = info.description;
        section.innerHTML = info.html;
    }

    //update navigation detail: like Prev, Next button
    updateNavDetail(info) {
        var navSection = this._nodeContent.querySelector('.navigation');

        if (!navSection) {
            return false;
        }
        var content = '';
        if (info.prevId) {
            //content = '<a class="pull-left" data-id="' + info.prevId + '" >Back &larr;</a>';
            content = '<a class="pull-left" data-id="' + info.prevId + '" data-view-id="' + info.prevViewId + '" >Back &larr;</a>';
        }
        else {
            content = '<a class="pull-left disabled">Back</a>';
        }

        if (info.nextId) {
            content += '<a class="pull-right" data-id="' + info.nextId + '" data-view-id="' + info.nextViewId + '" >&rarr; Next</a>';
        }
        else {
            content += '<a class="pull-right disabled">Next</a>';
        }
        navSection.innerHTML = content;
    }
    
    // hide Image Modal
    closeImageModal() {
        let imageModalLayer = document.querySelector('#image-modal-layer');
        imageModalLayer.style.display='none';   
    }
    
}

