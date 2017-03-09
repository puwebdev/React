var __s__ = require('../../utils/js-helpers.js');
var __d__ = require('../../utils/dom-utilities.js');
var configConsts = require('../../mgmt/config.const');

"use strict";

export class MgmInfo {
    constructor(layv, viewsNav, reactApp, app3d, winInfo) {

        this.isVisible = false;
        this.layv = layv;
        
        this._reactApp = reactApp; //Ref to React App
        this._viewsNav = viewsNav; //Ref to Views Navigator
        this._app3d = app3d //Ref to parent app3d
        this._winInfo = winInfo //Ref to Info Window

    }

    //Shows and hides the Mgmt UI
    toggle() {
        let me = this;
        me.layv.style.display = !me.isVisible ? "block" : "none";
        me.isVisible = !me.isVisible;

        if (me.isVisible) {
            me.updateCameraCoords();
        } else {
            me._updateWorldData()
                .then(function() {
                    me._updateInfoMap();
                    me._viewsNav._reRenderViews();
                });
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

    //Updatess the infoMap after editing in the Mgmt UI
    _updateInfoMap() {
        if (!window.app3dMgmtStore) { return; }

        //Update gearList (infowins) from React Store
        var infowins = window.app3dMgmtStore.getState().infowins.infowinsList.infowins;
        if (!infowins.length) { return; }
        
        //Create new gearList
        var newGearList = {}, j, lenJ, g;
        for (j = 0, lenJ = infowins.length; j < lenJ; j += 1) {
            g = infowins[j];
            newGearList[g.name] = g;
        }
        window.config.gearList = newGearList;

        this._app3d._populateInfomap(
            window.config.infoMap, 
            window.config.gearList, 
            window.config.gearMap);

        this._winInfo.hide(true);
    }

    _updateWorldData() {
        let me = this,
            id = config.mainScene.worldId;

        return new Promise((resolve, reject) => {

            axios({
                method: 'get',
                url: `${configConsts.ROOT_URL}/worldData/${id}`
            })
            .then(function (response) {
                let data = response.data.data;
                window.config.infowins = data.infowins;
                window.config.gearList = data.gearList;
                me._viewsNav._flattenNestedInfowins(window.config);
                resolve();
            })
            .catch(function (error) {
                console.error(error);
                reject(error);
            });


        });
    }

}
