//TESTING
var scene = require('../core/scene.js'),
    __s__ = require('../utils/js-helpers.js'),
    __d__ = require('../utils/dom-utilities.js'),
    mgmInfoMod = require('./ui-admin/mgmInfo.js'),
    rightClickMod = require('./ui-admin/rightClick.js'),
    winInfoMod = require('./ui/winInfo.js'),
    mainNavigatorMod = require('./ui/mainNavigator.js'),
    markersNavMod = require('./ui/markersNav.js'),
    mediaNavMod = require('./ui/mediaNav.js'),
    appTracker = require('../mgmt/actions/tracker.js'),
    groupsCommandsMod = require('./ui/mods/groupsCmds.js'),
    appReactActionsWelcome = require('../mgmt/actions/welcome.js');

window.__reactApp = {};
window.opxl = window.opxl || {};

const prefixMarker = markersNavMod.prefixMarker;
const orderLowercase = (a, b) => { return String(a).toLowerCase() > String(b).toLowerCase() ? 1 : -1; }

var scope = this,
    node = document.getElementById("app-3d"),
    app3d = new scene.Scene(node),
    INTERSECTED = null,
    viewsNav,
    mainNavigator,
    localNavigator,
    winInfo,
    winPopup,
    mgmInfo,
    rightClickNav,
    markersNav,
    gpsCmds,
    mediaNav;

function onHover(ev) {
    
    let intersected = ev.intersected,
        obj;
    if (!intersected) { return; }

    //Check if it's a marker
    if (mgmInfo.layv) {
        let rcContext = rightClickNav._context;

        rightClickNav._hoveredObj = intersected.name || "";

        markersNavMod.isMeshAMarker(intersected) ?
            rightClickNav.setContext("markers", false) 
            : rightClickNav.setContext("", rcContext === "markers");
    }
}


function onClick(ev) {
    let intersected = ev.intersected;

    if (markersNavMod.isMeshAMarker(intersected)) {
        let ev = __d__.addEventDsptchr("markerOnPreShowFeedback");
        ev.markerId = intersected.name.replace(prefixMarker, "");
        app3d._baseNode.dispatchEvent(ev);          
        return;
    }
}

function onObjectDoubleClick(ev) {
    let intersected = ev.intersected,
        name, obj;

    if (!intersected) { return; }
    name = intersected.name;

    obj = app3d.groupsFactory.objs[name];

    if (!obj || !obj.onGroups || !obj.onGroups.length ) { return; }

    for(let j = 0, lenJ = obj.onGroups.length; j < lenJ; j += 1) {
        if (!viewsNav.defaultsForInfowinId[obj.onGroups[j]]) { continue; }
        viewsNav._goToDefaultInfowinFor(obj.onGroups[j]);
        break;
    }   
}

function keyPressed (ev) {
    if (winInfo.iframeModule.visible) { return; }

    if (mgmInfo.isVisible) {
        if ((ev.keyCode === 77 || ev.keyCode === 78) && (ev.ctrlKey || ev.altKey)) {
            mgmInfo.toggle();
        }
        return;
    } 

    switch (ev.keyCode) {
        case 16:
            // Shift key (alone)
            for (let key in app3d.groupsFactory.groups) {
                app3d.groupsFactory.groups[key].highlight = true;
            }
            break;
        case 27:
            // Esc key
            //viewsNav.goToViewId(null);
            break;
        case 32:
            if ((rightClickNav._isVisible || rightClickNav._dialogIsVisible || mgmInfo.isVisible || markersNav._isOpened) && !mediaNav.__isPlaying) { return; }
            ev.preventDefault();
            mediaNav._toggle();
        case 38: // Ctrl-Up
            if (!(ev.ctrlKey || ev.shiftKey)) { return; }
            winInfo.showPrev();            
            break;
        case 40: //Ctrl-Down
            if (!(ev.ctrlKey || ev.shiftKey)) { return; }
            winInfo.showNext();
            break;            
        case 77: // Ctrl-M
            if (!(ev.ctrlKey || ev.altKey) || !mgmInfo.layv) { return; }
            let cifw = viewsNav.currentInfoWindow;
            if (!mgmInfo.isVisible && cifw && cifw.parentType && cifw.parentId) {
                document.location.hash = '#/infowins/' + cifw.parentType + '/' + cifw.parentId + '/' + cifw._id;
            }
            mgmInfo.toggle();
            break;            
        case 78: // Ctrl-N
            if (!(ev.ctrlKey || ev.altKey) || !mgmInfo.layv) { return; }
            mgmInfo.toggle();
            break;
        case 84: // Ctrl-T
            if (!(ev.ctrlKey || ev.altKey) || !markersNav.__markerUIMounted || markersNav._isOpened) { return; }
            markersNav._open(null);
            break;               
    }
}

function keyUp (ev) {
    if (winInfo.iframeModule.visible) { return; }
    
    switch(ev.keyCode) {
        case 16:
            for (let key in app3d.groupsFactory.groups) {
                app3d.groupsFactory.groups[key].highlight = false;
            }
            break;
    }
}

function onViewChanged (ev) {
    let vw = ev.view, target;

    if (vw.highlighted) {
        target = app3d.groupsFactory.get(vw.highlighted);
        if (target) { target.flash = true; }
    }

    if (vw.selected) {
        let info = window.config.infoMap[vw.selected];
        if (!info) { return; }
        INTERSECTED = info.obj;
        if (!info.info) { return; }
        winInfo.show(info.info, true);
    }
}

/* Initialize */
function initialized (ev) {
    console.info("opXL 3D-Viewer initialized!");

    __d__.addEventLnr(node, "pointerchanged", onHover);
    __d__.addEventLnr(node, "clicked", onClick);
    __d__.addEventLnr(node, "doubleclicked", onObjectDoubleClick.bind(scope));

    __d__.addEventLnr(node, "viewchanged", onViewChanged);

    __d__.addEventLnr(window, "keydown", keyPressed.bind(scope));
    __d__.addEventLnr(window, "keyup", keyUp.bind(scope));    

    //__d__.addEventLnr(node, "markerOnShowFeedback", (ev) => { console.log(ev); });
    //__d__.addEventLnr(node, "markerOnDismissFeedback", (ev) => { console.log(ev); });

}

/* Main events */
if (window.location.hash.indexOf(mainNavigatorMod.HASHBASE) !== 0) { 
    window.location.hash = "";
} else {
    app3d.__initialInfowin = window.location.hash.replace(mainNavigatorMod.HASHBASE, "");
}

// Start the modules

// 1. Views Navigator - can be used with window.app3dViewsNav
viewsNav = new mainNavigatorMod.mainNavigator(app3d);
// 2. Info Window - can be used with window.app3dInfowWindow
winInfo  = new winInfoMod.WinInfo(app3d, viewsNav, window.opxl);
// 3. Mgmt UI Window control - no need to expose it.
mgmInfo  = new mgmInfoMod.MgmInfo(document.getElementById("mgmt-layv"), viewsNav, window.__reactApp, app3d, winInfo);
// 4. MarkersNav controls
markersNav = new markersNavMod.MarkersNav(viewsNav, window.__reactApp, app3d, winInfo, mgmInfo);                       
// 5. Media Navigator
mediaNav = new mediaNavMod.MediaNav(app3d, mgmInfo, viewsNav, winInfo);
// 6. Right-click helpers
rightClickNav = new rightClickMod.RightClick(app3d, viewsNav, winInfo, mgmInfo, window.__reactApp);
// 7. Groups Commands
gpsCmds  = new groupsCommandsMod.GroupsCmds(app3d, viewsNav, winInfo);

__d__.addEventLnr(node, "initialized", initialized.bind(scope));

/* Make available to Window */
window.app3dViewer = app3d;
window.app3dInfowWindow = winInfo;
window.app3dViewsNav = viewsNav;
window.app3dMarkersNav = markersNav;
window.app3dMgmInfo = mgmInfo;
window.app3dMediaNav = mediaNav;
window.app3dRightClickNav = rightClickNav;
window.app3dGroupsCommands = gpsCmds;
window.app3dTracker = appTracker;