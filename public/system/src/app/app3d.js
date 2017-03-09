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

var scope = this,
    node = document.getElementById("app-3d"),
    app3d = new scene.Scene(node),
    INTERSECTED = null,
    viewsNav,
    winInfo,
    mgmInfo,
    markersNav;

function onHover(ev) {
    
    let intersected = ev.intersected,
        infoMap = window.config.infoMap;

    if (winInfo._isPersistant) { return; }

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
    let intersected = ev.intersected,
        infoMap = window.config.infoMap;

    if (intersected && intersected.name.indexOf("arrow_") === 0) {
        let ev = __d__.addEventDsptchr("markerOnPreShowFeedback");
        ev.markerId = intersected.name.replace("arrow_", "");
        app3d._baseNode.dispatchEvent(ev);	        
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

function keyPressed (ev) {
    if (winInfo._layoverInfo.isVisible) { return; }

    if (mgmInfo.isVisible && ev.keyCode !== 77 && !ev.ctrlKey) { return; }

    switch(ev.keyCode) {
        case 27: // Esc key
            viewsNav.goToViewId(null);
            break;
        case 16: // Shift key (alone)
            app3d.glowSiblingShow();
            break;
        case 77: // Ctrl-M
            if (!ev.ctrlKey || !mgmInfo.layv) { return; }
            if (viewsNav.currentInfoWindowParentType && viewsNav.currentInfoWindowParentId && (viewsNav.currentMLInfoWindow || viewsNav.currentInfoWindow)) {
                document.location.hash = '#/infowins/' + viewsNav.currentInfoWindowParentType + '/' + viewsNav.currentInfoWindowParentId + '/' + (viewsNav.currentMLInfoWindow || viewsNav.currentInfoWindow)._id;
            }
            mgmInfo.toggle();
            break;
        case 84: // Ctrl-T
            if (!ev.ctrlKey || !markersNav.__markerUIMounted || markersNav._isOpened) { return; }
            markersNav._open(null);
            break;
        default: // Others
            if ((markersNav && markersNav._isOpened) || (mgmInfo && mgmInfo.isVisible)) { return; } //don't move camera when editing!
            let vw = viewsNav.viewsKeycodes[ev.keyCode];
            if (vw) {
                viewsNav.goToViewId(vw._id, true);
            }                              
    }
}

function keyUp (ev) {
    if (winInfo._layoverInfo.isVisible) { return; }
    
    switch(ev.keyCode) {
        case 16:
            app3d.glowSiblingHide();
            break;
    }
}

function onViewChanged (ev) {
    let vw = ev.view, 
        info,
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
        }
        else {
            if (viewsNav.currentMLInfoWindow) {
                winInfo.show({
                    title: viewsNav.currentMLInfoWindow.title,
                    html: viewsNav.currentMLInfoWindow.html,
                    id: vw._id
                }, true);    
            }
            else if (viewsNav.currentInfoWindow) {
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
    if (!info) { return; }

    INTERSECTED = info.obj;
    winInfo.show(info.info, true, vw.selected);
}

function onViewChanging (ev) {
    winInfo.hide(true);
    if (opxl && opxl.onViewChanging && typeof opxl.onViewChanging === 'function') {
        opxl.onViewChanging(ev);
    }
}

/* Initialize */
function initialized (ev) {
    console.info("opXL 3D-Viewer initialized!");

    //__d__.addEventLnr(node, "pointerchanged", onHover);
    //__d__.addEventLnr(node, "clicked", onClick);
    //__d__.addEventLnr(node, "viewchanging", onViewChanging);
    //__d__.addEventLnr(node, "viewchanged", onViewChanged);

    __d__.addEventLnr(window, "keydown", keyPressed.bind(scope));
    __d__.addEventLnr(window, "keyup", keyUp.bind(scope));


    //__d__.addEventLnr(node, "markerOnShowFeedback", function(ev){
    //    console.log("markerOnShowFeedback", ev);
    //});

    //__d__.addEventLnr(node, "markerOnDismissFeedback", function(ev){
    //    console.log("markerOnDismissFeedback", ev);
    //});

}

/* Main events */
window.location.hash = "";

// Start the modules

// 1. Views Navigator - can be used with window.app3dViewsNav
viewsNav = new viewsNavMod.ViewsNav(app3d);
// 2. Info Window - can be used with window.app3dInfowWindow
winInfo  = new winInfoMod.WinInfo(app3d, viewsNav, window.opxl);
// 3. Mgmt UI Window control - no need to expose it.
mgmInfo  = new mgmInfoMod.MgmInfo(document.getElementById("mgmt-layv"), 
                                    viewsNav, window.__reactApp, app3d, winInfo);
// 4. MarkersNav controls
markersNav = new markersNavMod.MarkersNav(viewsNav, window.__reactApp, app3d, winInfo, mgmInfo);                       

__d__.addEventLnr(node, "initialized", initialized.bind(scope));

/* Make available to Window */
window.app3dViewer = app3d;
window.app3dInfowWindow = winInfo;
window.app3dViewsNav = viewsNav;
window.app3dMarkersNav = markersNav;
window.app3dMgmInfo = mgmInfo;

