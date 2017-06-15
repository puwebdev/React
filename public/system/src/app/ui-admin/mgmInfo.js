var __s__ = require('../../utils/js-helpers.js');
var __d__ = require('../../utils/dom-utilities.js');
var configConsts = require('../../mgmt/config.const');

"use strict";

export class MgmInfo {
    constructor(layv, viewsNav, reactApp, app3d, winInfo) {
        let ren = app3d.renderer3d;

        this.isVisible = false;
        this.layv = layv;
        
        this._reactApp = reactApp; //Ref to React App
        this._viewsNav = viewsNav; //Ref to Views Navigator
        this._app3d = app3d //Ref to parent app3d
        this._winInfo = winInfo //Ref to Info Window

        if (layv) { ren._intersectGroup = ren.meshesHolder; }
    }

    //Shows and hides the Mgmt UI
    toggle() {
        let me = this;
        if (!me.layv) { return; } //Non admin mode.

        me.layv.style.display = !me.isVisible ? "block" : "none";
        me.isVisible = !me.isVisible;

        if (me.isVisible) {
            window.app3dMediaNav.pause();
            me.updateCameraCoords();
            me._app3d.renderer3d.controls.enabled = false;
        } else {
            me._app3d.renderer3d.controls.enabled = true;
            me._updateWorldData()
                .then(() => { console.info("window.config data updated.")} );
        }
    }

    //Gets the current ViewPosition and passes it to React App
    updateCameraCoords() {
        if (!window.app3dMgmtStore) { return; }
        let reactPath = window.app3dMgmtHistory.getCurrentLocation().pathname;

        switch (reactPath) {
            case "/":
                this._reactApp.WelcomeCallback((new Date()).toString());
                break;
        }
    }

    _updateWorldData() {
        let me = this,
            id = config.mainScene.worldId;

        return new Promise((resolve, reject) => {

            axios({
                method: 'get',
                url: `${configConsts.ROOT_URL}/worldData/${id}`
            })
            .then((response) => {
                let data = response.data.data;
                
                window.config.infowins = data.infowins;
                window.config.groupsMap = data.groupsMap;
                window.config.viewsSets = data.viewsSets;
                window.config.objectsMap = data.objectsMap;

                me._viewsNav._init();

                me._app3d._datalayer.infoGroupsProcess(data.groupsMap, me._app3d.renderer3d.objectsByName, me._app3d.prefix)
                    .then((infoMap) => {
                        window.config.infoMap = infoMap;
                    });

                resolve();
            })
            .catch((error) => {
                console.error(error);
                reject(error);
            });


        });
    }

}
