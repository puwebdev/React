var __s__ = require('../../utils/js-helpers.js');
var __d__ = require('../../utils/dom-utilities.js');
var configConsts = require('../../mgmt/config.const');

"use strict";

export class ViewsNav {

    constructor(app3d) {

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
        this.highestLevelInfoWindows ={
            guide: null,
            explore: null
        };

        // XMLHttpRequest
        this.xhttp = null;

        this._app3d = app3d;
        this._firstLoad = true;
        this._init();

    }

    _init() {
        this.node = document.getElementById("viewer-nav");
        if (!this.node) { return; }

        this.toggleNode = document.getElementById("viewer-nav-toggler");
        this.ulNode = document.getElementById("viewer-nav-thumbs");
        this.guideSection = document.getElementById("guide");
        // this.badgesSection = document.getElementById("badges");

        this.exploreViewSetsSelection=document.querySelector("#explore .dropdown-menu");

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

    _mapViewsSets() {
        let j, lenJ, viewSet;

        //Initialize
        this.viewsSetsById = {};
        this.viewsSetsByName = {};

        //Create maps
        for (j = 0, lenJ = window.config.viewsSets.length; j < lenJ; j += 1) {
            viewSet = window.config.viewsSets[j];
            this.viewsSetsById[viewSet._id] = viewSet;
            if (viewSet.name) { this.viewsSetsByName[viewSet.name] = viewSet; }
        }
    }

    _populateNavigator() {
        let app3d = this._app3d,
            views = this.currentViewsSet.views,
            viewsClone = _.each(views, (v, j) => { v.arrPos = j; }),
            j, lenJ, arr = [],
            classN, imgHtml, viewidHtml, v;

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

        if (lenJ > 0) { this.firstView = viewsClone[0]; }
        this.ulNode.innerHTML = arr.join("");
        this.liNodes = this.ulNode.getElementsByTagName("LI");
    }

    _toggle(ev) {
        this[this.isOpened ? "close" : "open"]();
    }

    // Click event on Guide section
    _onGuideSectionClick(ev) {

        let t = ev.target;
        
        if (t.nodeName == 'A') {
            if (t.className == 'info-window-selection') {
                //view set selection
                let categoryName = document.querySelector("#guide .info-window-name");
                categoryName.setAttribute('value', t.getAttribute('data-title'));

                let id = t.getAttribute('data-id');
                let index = t.getAttribute('data-index');
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
            }
            else if (t.className.includes('info-window-name')) {
                let childrenSection = t.parentElement.querySelectorAll(':scope > .info-windows');
                let children = t.parentElement.querySelectorAll(':scope > .info-windows > li');
                let id = t.getAttribute('data-id');
                let index = t.getAttribute('data-index');

                //set the current info window

                this.currentInfoWindow = this.infoWindowTree[index];
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
                }
                else {
                    childrenSection[0].className = childrenSection[0].className.replace(/\bcollapsed\b/, "");
                    t.className = t.className.replace(/\bcollapsed\b/, "");
                    //t.innerText="-"+t.getAttribute('data-title');
                }

                //update the dropdownbox text at the top
                var categoryName = document.querySelector("#guide .info-window-name");
                categoryName.setAttribute('value', t.getAttribute('data-title'));
            }
        }
        else if (t.nodeName == 'IMG') {
            if (t.parentElement.className == 'view-thumbnail') {
                //clear thumb selection
                this.unselectInfoWindowThumbs();
                let infowindowId= t.parentElement.getAttribute("data-infowindow-id"); // set current selected ML infowindow id
                let index= t.parentElement.getAttribute("data-index");
                // set Views
                let n = t.parentElement.getAttribute("data-viewid");
                                
                this.currentMLInfoWindow = this.infoWindowTree[index];
                this.goToViewId(n, false, this.currentMLInfoWindow);
            }
        }
    }

    _changeViewClick(ev) {
        var me = this,
            t = ev.target, 
            n;
        if (t.nodeName !== "LI") { return; }
        n = t.getAttribute("data-viewid");
        this.goToViewId(n);
    }

    _changeCursor(id, forceClean = false, infoWindow) {
        var me = this, top, h, uScrollTop, 
            n = this.viewsById[id].arrPos, nPrev;

        //Prev
        if (forceClean) {
            _.each(me.liNodes, function(li){ li.className = ""; });
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
                    TweenLite.to(this.ulNode, 0.5, { scrollTo: top - 180, delay: 0.5, ease: Power2.easeInOut});
                }
            }
        }
        else {
            var ele = null;

            if (infoWindow) {
                // mark selected the infowindow
                ele = this.node.querySelector('#v' + infoWindow.uniqueIndex);
                if(ele) {
                    if (!ele.className.includes("selected")) {
                        ele.className += " selected";
                    }

                    //Scroll?
                    var ul = this.node.querySelector('#top-level-infowindows-collection');
                    h = ul.offsetHeight;

                    //only if explore window has associated view
                    top = ele.offsetTop ;
                    uScrollTop = ul.scrollTop;
                    // if (uScrollTop > top || uScrollTop < top - h) {
                    TweenLite.to(ul, 0.5, { scrollTo: top - h/ 4, delay: 0.5, ease: Power2.easeInOut});
                    // }
                }
            }
        }

    }

    _reRenderViews() {
        var me = this, viewsSets;

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
        if (me.currentViewId && (this.viewsById[me.currentViewId] || this.viewsByGearId[me.currentViewId ])) { 
            me.goToViewId(me.currentViewId, true); //Select previous
        } else if (me.currentViewsSet.views && me.currentViewsSet.views.length > 0) {
            me.goToViewId(me.currentViewsSet.views[0], true); //Select first
        }

    }

    //sometimes one view is associated to several infowindows and infoWindow is required
    goToViewId(id, forceCursorClean = false, infoWindow) {
        let v = id === null && this.firstView !== null ? this.firstView : this.viewsById[id] || this.viewsByGearId[id];
        if (!v) { return; }
        this._app3d.renderer3d._moveCamera(v);
        this._changeCursor(v._id, forceCursorClean, infoWindow);
    }

    open() {
        this.node.className = "viewer-nav opened";
        this.isOpened = true;
    }

    close() {
        this.node.className = "viewer-nav";
        this.isOpened = false;
    }

    //Change the ViewStrip with a different Views-Set
    setViewsSet(vsid) {
        var viewsSet; 
        
        if (!isNaN(vsid)) { //If a position is sent
            let vsidN = Number(vsid);
            if (vsidN >= 0 && vsidN < window.config.viewsSets.length) {
                viewsSet = window.config.viewsSets[vsidN];
            }
        } else { //If an Id is sent
            viewsSet = this.viewsSetsById[vsid] || this.viewsSetsByName[vsid];
        }

        //If no ViewsSet was found
        if (!viewsSet && window.config.viewsSets.length > 0) {
            console.warn("ViewsSet " +  vsid + " not found. Using default.");
            viewsSet = window.config.viewsSets[0]
        }

        this.currentViewsSet = viewsSet;
        this.currentViewsSetId = viewsSet._id;
        this._populateNavigator();

        if (this._firstLoad && this.currentViewsSet.views && this.currentViewsSet.views.length > 0) {
            let firstView = this.currentViewsSet.views[0];
            this._app3d.renderer3d._moveCamera(firstView, 0.1);
            this._changeCursor(firstView._id, true);
            this._firstLoad = false;
        }
        
    }
   
    _flattenNestedInfowins(inp) {
        let me = this;

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

    updateGuideTree(infowins, nodeName, topClassName, parentType, parentId) {

        if (!infowins || infowins.length==0) {
            return [];
        }
        var arr =[];

        if (nodeName == 'UL') {
            //add li tag with text

            for (var i=0; i< infowins.length; i++) {

                var ele = infowins[i];
                ele['uniqueIndex'] = this.grossInfoWindowIndex;
                this.infoWindowTree[this.grossInfoWindowIndex] = ele;

                if (ele.view) {
                    if (!this.viewsById[ele.view._id]) {
                        this.viewsById[ele.view._id] = ele.view;
                    }
                }
                
                arr.push("<li class='" + topClassName + "'>");
                arr.push("<a class='info-window-name collapsed " + (ele.infowins.length ? "with-children " : "") + "' data-index='" + this.grossInfoWindowIndex + 
                    "' data-id='" + ele._id + "' data-type='" + (ele.type ? ele.type: "") + 
                    "' data-parenttype='" + parentType + "' data-parentid='" + parentId + 
                    "' data-title='" + ele.title + "'>");
                arr.push(ele.title);
                arr.push("</a>");
                this.grossInfoWindowIndex++;

                if (ele.type == "MLparent") {
                    //shows thumbnails
                    arr.push("<div class='thumbnails info-windows collapsed' id= 'v" + ele.uniqueIndex + "' data-info-window-id='" + ele._id + "'>");
                    arr = arr.concat(this.updateGuideTree(ele.infowins, 'DIV', '', 'infowin', ele._id));
                    arr.push("</div>");
                }
                else {
                    //add tree item
                    arr.push("<ul class='child-level info-windows collapsed' id= 'v" + ele.uniqueIndex + "' data-info-window-id='" + ele._id + "'>");
                    arr = arr.concat(this.updateGuideTree(ele.infowins, 'UL', '', 'infowin', ele._id));
                    arr.push("</ul>");
                }

                arr.push("</li>");
            }

        }
        else if (nodeName == 'DIV' ) {
            // add thumbnails

            for (var i=0; i< infowins.length; i++) {

                let ele = infowins[i];
                let viewId = '';
                let screenshot = '';

                ele['uniqueIndex'] = this.grossInfoWindowIndex;
                this.infoWindowTree[this.grossInfoWindowIndex] = ele;
                
                if (ele.view) {
                    viewId = ele.view._id;
                    screenshot = ele.view.screenshot;

                    //add view to viewById variable
                    if (!this.viewsById[ele.view._id]) {
                        this.viewsById[ele.view._id] = ele.view;
                    }
                }

                arr.push("<div class='view-thumbnail' data-index ='" + this.grossInfoWindowIndex + 
                    "' data-viewid='" + viewId + "' id='v" + ele.uniqueIndex + 
                    "' data-parenttype='" + parentType + "' data-parentid='" + parentId + 
                    "' data-infowindow-id='" + ele._id+ "'>");
                this.grossInfoWindowIndex++;
                arr.push("<h3>" + ele.title + "</h3>");
                arr.push("<img src='/system/images/screenshots/" + screenshot + "' title='" + ele.title.replace("'", "''") + "'/>");
                arr.push("</div>");

            }
        }
        
        return arr;

    }

    loadGuideItems() {

        // update dropdown items of guide section
        let infoWindowHighLevels = document.querySelector("#guide .infowindow-highlevels");
        let arr =[];
        this.highestLevelInfoWindows.guide = window.config.infowins[0].infowins;
        this.grossInfoWindowIndex = 0;

        for (let i=0; i< this.highestLevelInfoWindows.guide.length; i++) {
            var ele = this.highestLevelInfoWindows.guide[i];
            ele['uniqueIndex'] = this.grossInfoWindowIndex;
            this.infoWindowTree[this.grossInfoWindowIndex] = ele;

            //update infoWindowTree
            // this.infoWindowTree[ele._id] = ele;
            arr.push("<li><a class='info-window-selection' data-index ='" + this.grossInfoWindowIndex 
                + "' data-id='" + ele._id + "' data-title='" + ele.name + "'>" + ele.name + "</a></li>");
            this.grossInfoWindowIndex++;
            this.dropdownInfoWindowCount++
        }

        infoWindowHighLevels.innerHTML = arr.join("");

        if (this.highestLevelInfoWindows.guide.length == 0) {
            return;
        }
        
        //select first dropdown item by default
        var categoryName = document.querySelector("#guide .info-window-name");

        categoryName.setAttribute('value', this.highestLevelInfoWindows.guide[0].name);

        this.currentInfoWindow = this.highestLevelInfoWindows.guide[0];

        let _this = this;
        //show infowindow
        setTimeout(
            function(){
                window.app3dInfowWindow.show({
                    title: _this.highestLevelInfoWindows.guide[0].title,
                    description: _this.highestLevelInfoWindows.guide[0].description,
                    html: _this.highestLevelInfoWindows.guide[0].html
                }, true);        
            }, 
            500
        );


        arr = this.updateGuideTree(this.highestLevelInfoWindows.guide[0].infowins, 'UL', 'top-level', 'world', window.config.mainScene.worldId);
        
        var section = document.querySelector('#guide #top-level-infowindows-collection');
        section.innerHTML = arr.join("");
    }

    //unselect current infowindow with thumbnail by viewId
    unselectInfoWindowThumbs() {
        var eles = this.node.querySelectorAll('.view-thumbnail.selected');
        for (var i=0; i< eles.length; i++) {
            if (eles[i].className.includes("selected")) {
                eles[i].className = eles[i].className.replace(/\b selected\b/, "")
            }
        }
    }

    expandCurrentInfoWindow() {
        let ele = document.querySelector("#guide #v" + this.currentInfoWindow.uniqueIndex);
        if (!ele) {return;}
        let aTag = ele.previousSibling;
        
        if (ele.className.includes("collapsed")) {
            ele.className = ele.className.replace(/\bcollapsed\b/, "");
            aTag.className = aTag.className.replace(/\bcollapsed\b/, "");    
        }
    }
}


