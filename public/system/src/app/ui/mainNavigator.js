var __s__ = require('../../utils/js-helpers.js');
var __d__ = require('../../utils/dom-utilities.js');
var configConsts = require('../../mgmt/config.const');

"use strict";

export const HASHBASE = "#/Content/";

export class mainNavigator {
	constructor(app3d) {
		this.state = {
			preview: true,
            activeInfowinIdByTab: {},
            activeTab: null
		};

        this.node = null;               // navigation section
        this.ulNode = null;             // navigation content section
        this.currentInfoWindow = null;
        this.currentInfoWindowViewSetIndex = -1;
        this.currentInfowinActiveId = null;

        this.tabPanel = null;

        this.treeContentElement = null;
        this.treeContentElementInitialHeight = 0;
        this.treeNodesById = {};
        this.treeNodesH3ById = {};
        this.tabNodesById = {};

        this.isOpened = false;
        this.imagesPath = configConsts.ROOT_IMG_URL;

        this.currentViewsSet = null;
        this.currentViewsSetId = null;
     
        this.infoWinsTreeArray = [];
        this.infoWinsTreeById = {};
        this.treePathOfInfowin = {};
        this.infowinNamesForId = {};
        this.defaultsForInfowinId = {};

        this._app3d = app3d;
        this._firstLoad = true;
        this.__intervEnlargeMenu = null;

        this._init();
    }

    _init() {
        this.node = document.getElementById("viewer-nav");
        if (!this.node) { return; }

        //Flatten infowins tree --------------------------------------------------------------------
        let { infoWinsTreeArray, infoWinsTreeById, treePathOfInfowin, defaultsForInfowinId, infowinNamesForId } = this._flattenNestedInfowins(window.config); //Pure data function
        Object.assign(this, { infoWinsTreeArray, infoWinsTreeById, treePathOfInfowin, defaultsForInfowinId, infowinNamesForId }); //Assign properties to this
        //------------------------------------------------------------------------------------------       

        this.toggleNode = document.getElementById("viewer-nav-toggler");
        this.viewThumbCheckbox = document.getElementById("view-nav-preview-checkbox");
        this.treeContentElement = document.getElementById("main-navigation");
        this.tabContentElement = document.getElementById("tab-holder");

        this._buildNavTree();

        if (this._firstLoad) {
            this.treeContentElementInitialHeight = document.getElementById("main-menu-holder").offsetHeight;
            this._attachEventListeners();
        }

        this._firstLoad = false;
    }

    _hashTagChanged(e) {
        let clickedInfowinId = window.location.hash.replace(HASHBASE, "");

        if (!this._app3d.__isReady || !this.infoWinsTreeById[clickedInfowinId]) { return; }

        this._changeToInfowin(clickedInfowinId);        
    }

    _attachEventListeners() {

        __d__.addEventLnr(this.node, 'mouseenter', this._viewNavHover.bind(this, true, true, 750));
        __d__.addEventLnr(this.node, 'mouseleave', this._viewNavHover.bind(this, false));

        __d__.addEventLnr(this.toggleNode, "click", this._toggle.bind(this));
        __d__.addEventLnr(this.viewThumbCheckbox, "change", this._checkboxClick.bind(this));

        __d__.addEventLnr(this.treeContentElement, "click", this._navigationClickHandler.bind(this));  
        __d__.addEventLnr(this.tabContentElement, "click", this._tabsClickHandler.bind(this));  

        __d__.addEventLnr(window, "hashchange", this._hashTagChanged.bind(this));  
    }

    // Pure data functions  -----------------------------------------------------------------

    _flattenNestedInfowins(inp) {
        let i,
            infoWinsTreeArray = [],
            infoWinsTreeById = {},
            treePathOfInfowin = {},
            defaultsForInfowinId = {},
            infowinNamesForId = {};

        //Define recursive
        function recursiveIter(w, index) {
            let j, lenJ;

            function recurseInfowins(parent, index) {
                var g;
                if (!parent || !parent.infowins) return;
                index++;

                if (w.scoInfowinID) {
                    for (var k = 0, lenK = parent.infowins.length; k < lenK; k += 1) {
                        if (parent.infowins[k]._id == w.scoInfowinID){
                            parent.infowins = [parent.infowins[k]];
                            break;
                        }
                    }
                }
                
                for (var k = 0, lenK = parent.infowins.length; k < lenK; k += 1) {
                    g = parent.infowins[k];

                    g.parentId = parent._id;
                    g.parentType = parent.type;

                    if (g.defaultForGroups && g.defaultForGroups.length) {
                        g.defaultForGroups.map((key) => {
                            if (!defaultsForInfowinId[key]) { defaultsForInfowinId[key] = g._id; }
                        });
                    }

                    infoWinsTreeById[g._id] = g;
                    infoWinsTreeArray.push(g);
                    infowinNamesForId[g.title] = g._id;
                    index++;
                    recurseInfowins(g, index);
                }
            }

            function getPath(theTree, infowin) {
                var i, lenI;
                if (theTree === infowin) {
                    return [];
                } else if (theTree.infowins) {
                    for (i = 0, lenI = theTree.infowins.length; i < lenI; i += 1) {
                        var path = getPath(theTree.infowins[i], infowin);
                        if (path !== null) {
                            path.unshift(theTree._id);
                            return path;
                        }        
                    }
                }
                return null;
            };

            //Recurse infowins and obtain infoWinsTreeArray (array) & infoWinsTreeById (dictionary _id:obj)
            recurseInfowins(w, index);
            //Map infoWinsTreeArray and obtain parents path (dictionary _id:array of indices)
            infoWinsTreeArray.map((ob) => {
                let pt = getPath(w, ob);
                pt.splice(0, 1);
                treePathOfInfowin[ob._id] = pt;
                infoWinsTreeById[ob._id].___level = pt.length;
            });
        }

        //Exec recursive
        recursiveIter(inp, 1);

        //Add prevId and nextId
        for (i = infoWinsTreeArray.length - 2; i > 0; i--) {
            infoWinsTreeArray[i].prevId = infoWinsTreeArray[i-1]._id;
            infoWinsTreeArray[i].nextId = infoWinsTreeArray[i+1]._id;
        };
        //Fix first
        infoWinsTreeArray[0].prevId = "";
        infoWinsTreeArray[0].nextId = infoWinsTreeArray[1]._id;
        //Fix last
        infoWinsTreeArray[infoWinsTreeArray.length-1].prevId = infoWinsTreeArray[infoWinsTreeArray.length-2]._id;
        infoWinsTreeArray[infoWinsTreeArray.length-1].nextId = "";

        //Return structured
        return { infoWinsTreeArray, infoWinsTreeById, treePathOfInfowin, defaultsForInfowinId, infowinNamesForId }
    }   

    _buildChildTree(parentElement, index, parentInfoWins) {
        let me = this;

        for (var i = 0; i < parentInfoWins.infowins.length; i++) {

            var infowin = parentInfoWins.infowins[i],
                li = document.createElement("li"),
                ul,
                h3 = document.createElement("h3"),
                span = document.createElement("span"),
                img,
                hasChildren = infowin.infowins && infowin.infowins.length;

            //H3
            h3.id = 'v' + infowin._id;
            h3.setAttribute("data-id", infowin._id);            

            //Title
            span.innerText = infowin.title;
            h3.appendChild(span);

            //Image if has view
            if (infowin.view) {
                img = document.createElement("img");
                img.src = this.imagesPath + (infowin.view.screenshot || "_missing.png");
                img.onerror = function() {
                    this.onerror = null;
                    this.src = me.imagesPath + "_missing.png";
                };

                h3.appendChild(img);
            } 

            //Li
            li.className = `li-level-${index} ${infowin.type} ` + (hasChildren ? "with-children" : "without-children");
            li.appendChild(h3);

            //Append to parent
            parentElement.appendChild(li);

            //Set reference
            this.treeNodesById[infowin._id] = li;
            this.treeNodesH3ById[infowin._id] = h3;

            //Check if has children or continue
            if (!hasChildren) { continue; }

            ul = document.createElement("ul");
            ul.className = `ul-level-${index}`;
            li.appendChild(ul);

            //Recurse
            this._buildChildTree(ul, index + 1, infowin);
        }
    }

    _buildNavTree() {       
        let me = this,
            tce = this.treeContentElement, delayer = 500;

        //Remove previous
        while (tce.firstChild) { tce.removeChild(tce.firstChild); }
        //Build
        this._buildChildTree(tce, 1, window.config);

        //Move first H3s to tabHolder, create new LIS
        let firstH3s = tce.querySelectorAll(":scope > li > h3");
        this.tabContentElement.innerHTML = "";
        for (let j = 0, lenJ = firstH3s.length; j < lenJ; j += 1) {
            let li = document.createElement("li"),
                fH3 = firstH3s[j],
                dataId = fH3.getAttribute("data-id");

            li.className = String(fH3.parentNode.className);
            li.appendChild(fH3);
            this.tabNodesById[dataId] = li;
            this.tabContentElement.appendChild(li);
            this.state.activeInfowinIdByTab[dataId] = "";
        }
        
        //Set current infowin
        if (!this._firstLoad) {
            //Re-load
            this.currentInfowinActiveId = null;
            this.currentInfoWindow = this.infoWinsTreeById[this.currentInfoWindow._id] || this.infoWinsTreeById[this.currentInfoWindow.parentId] || this.infoWinsTreeById[this._app3d.__initialInfowin] || this.infoWinsTreeArray[1]; //Get new data
            if (this.currentInfoWindow) {
                setTimeout(() => { me._changeToInfowin(me.currentInfoWindow._id, true) }, 250); 
            }
        } else {
            //Set currentInfoWindow and move camera only
            this.currentInfoWindow = this.infoWinsTreeById[window.config.scoInfowinID] || this.infoWinsTreeById[this._app3d.__initialInfowin] || this.infoWinsTreeArray[1];
            if (this.currentInfoWindow && this.currentInfoWindow.view) {
                this._app3d.renderer3d.camera.position.copy(this.currentInfoWindow.view.cameraPosition);
                this._app3d.renderer3d.controls.target.copy(this.currentInfoWindow.view.targetPosition);
            }
        }
        
    }

    _setHashWithID(id) {
        window.location.hash = HASHBASE + id;
    }

    _navigationClickHandler(e) {
        let t = e.target, 
            clickedInfowinId = t.getAttribute("data-id"),
            currentActiveId = this.currentInfowinActiveId;

        if (t.tagName !== "H3") { return; }

        currentActiveId !== clickedInfowinId ?
            this._setHashWithID(clickedInfowinId)
            : this._changeToInfowin(clickedInfowinId);
    }

    _tabsClickHandler(e) {
        let t = e.target,
            clickedTab,
            prevInfowinInTab;

        if (t.tagName !== "H3") { return; }

        clickedTab = t.getAttribute("data-id");

        // if clicked same tab return
        if (t.parentElement === this.state.activeTab) { return; }

        //Previous active infowin in this tab
        prevInfowinInTab = this.state.activeInfowinIdByTab[clickedTab];

        this._changeToInfowin(!prevInfowinInTab ? clickedTab : prevInfowinInTab);
        
    }

    _changeToInfowin(clickedInfowinId, force = false) {
        let me = this,
            currentActiveId,
            winInfo = window.app3dInfowWindow,
            mediaNav = window.app3dMediaNav,
            defaultsFor = [];

        //This is the state. We don't query the DOM to see what is active;
        currentActiveId = this.currentInfowinActiveId;

        //If the same ID, collapse
        if (!force && currentActiveId && currentActiveId === clickedInfowinId) {
            classie.toggle(this.treeNodesById[currentActiveId], "collapsed");
            return;
        }

        //Set/Unset current active classes
        this.__setActiveClass(currentActiveId, clickedInfowinId);

        //Set new currentInfoWindow
        this.currentInfoWindow = this.infoWinsTreeById[clickedInfowinId];

        //Highlight default objects
        defaultsFor = this.currentInfoWindow.defaultForGroups || [];
        defaultsFor.map((groupName) => {
            let gr = me._app3d.groupsFactory.get(groupName);
            if (gr) { gr.flash = true; }
        });        

        //winInfo.Show
        winInfo.show(this.currentInfoWindow, true);
        this.currentInfoWindow.view ?
            this.goToView(this.currentInfoWindow)
            : mediaNav._clearTimeline();

        //Set the state
        this.currentInfowinActiveId = clickedInfowinId;
    }

    __setActiveClass(currId, newId) {

        let parentsCurr = currId ? Object.assign([], this.treePathOfInfowin[currId]) : [],
            parentsNew  = Object.assign([], this.treePathOfInfowin[newId]),
            sameTab = false, prevTab = null, tabParent;

        //Set, by tab, the active child
        tabParent = parentsNew[0] || newId;
        prevTab = this.state.activeTab;

        this.state.activeTab = this.tabNodesById[tabParent];
        this.state.activeInfowinIdByTab[tabParent] = newId;

        //Eliminate common parents to avoid removing and adding the same
        while (parentsCurr[0] && parentsNew[0] && parentsCurr[0] === parentsNew[0]) {
            parentsCurr.splice(0, 1);
            parentsNew.splice(0, 1);
            if (!sameTab) { sameTab = true; }
        }

        //current option
        if (currId) {
            classie.remove(this.treeNodesById[currId], "active"); //The current option
            classie.remove(this.treeNodesById[currId], "active-end-node"); //The current option
            parentsCurr.map((id) => { classie.remove(this.treeNodesById[id], "active"); }); //Parents
            if (!sameTab && prevTab) { classie.remove(prevTab, "active"); } //Set class of Tabs
        }

        //new option
        classie.remove(this.treeNodesById[newId], "collapsed"); //The new option, take off collapsed
        classie.add(this.treeNodesById[newId], "active"); //The new option
        classie.add(this.treeNodesById[newId], "active-end-node"); //The new option
        parentsNew.map((id) =>  { classie.add(this.treeNodesById[id], "active"); }); //Parents
        if (!sameTab) { classie.add(this.state.activeTab, "active"); } //Set class of Tabs
    }

    ////-----------			Click event part 			-----/////
    _checkboxClick(e) {
    	let t = e.target;
    	this.state.preview = t.checked;
        classie[this.state.preview ? "remove" : "add"](this.treeContentElement, "without-preview")
    }

    _toggle(e) {
        this[this.isOpened ? "close" : "open"]();
    }

    open() {
        this.node.className = "viewer-nav opened";
        this.isOpened = true;
    }

    close() {
        this.node.className = "viewer-nav";
        this.isOpened = false;
    }

    goToView(infoWindow) {
        this._changeCursor(infoWindow);

        let view = infoWindow.view;
        if (!view || !view.cameraPosition || !view.targetPosition ||
            (Number(view.cameraPosition.x)===0 && Number(view.cameraPosition.y)===0 && Number(view.cameraPosition.z)===0) ||
            (Number(view.targetPosition.x)===0 && Number(view.targetPosition.y)===0 && Number(view.targetPosition.z)===0)) {  return; }
        
        this._app3d.renderer3d._moveCamera(infoWindow);
    }

    _goToDefaultInfowinFor(groupName) {
        if (!this.defaultsForInfowinId[groupName]) { return; }
        this._setHashWithID(this.defaultsForInfowinId[groupName]);        
    }

    _changeCursor(infoWindow) {
        if (!infoWindow || !this.treeNodesH3ById[infoWindow._id]) { return; }

        var top, h, uScrollTop, thumbHeight, thumbTop, targetOffsetTop,
            ele = null;

        function getElementOffsetTop(element, parentMax) {
            var actualOffset = element.offsetTop, current = element.parentNode;
            while (current && current !== parentMax) {
                actualOffset += current.offsetTop;
                current = current.parentNode;
            }
            return actualOffset;
        }            

        ele = this.treeNodesH3ById[infoWindow._id];        
        thumbHeight = ele.offsetHeight; //Height of the infowin thumb/text
        thumbTop = getElementOffsetTop(ele, this.treeContentElement);
        
        h = this.treeContentElementInitialHeight; //Initial height of the tree view
        targetOffsetTop = thumbTop - (h - thumbHeight)/2;

        if (targetOffsetTop < 0) { return; }
        TweenLite.to(this.treeContentElement.parentElement, 0.75, { scrollTo: targetOffsetTop, delay: 0.5, ease: Power2.easeOut});
    }


    _viewNavHover(hov, setContext = true, delay = 0) {
        let me = this;
        clearTimeout(this.__intervEnlargeMenu);

        if (hov) { //Enlarge
            if (this.node.className.indexOf("hovered-by-mouse") >= 0) { return; }
            if (delay) {
                this.__intervEnlargeMenu = setTimeout(() => {
                    me.node.className += " hovered-by-mouse";
                }, delay);
            } else {
                this.node.className += " hovered-by-mouse";
            } 
            window.app3dRightClickNav.setContext("mainNavigator");
            return;
        }

        // Back to normal size
        this.node.className = this.node.className.replace(/\bhovered\-by\-mouse\b/, "");           
        if (setContext) { window.app3dRightClickNav.setContext(""); }
    }

}


