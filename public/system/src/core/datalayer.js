var __s__ = require('../utils/js-helpers.js'),
    __d__ = require('../utils/dom-utilities.js'),
    RColor = require('../utils/random-color.js'),
    infoWcont = require('./infoWcont.js');

"use strict";

export const infoMapAndHtml = (infoMap, gearList, gearMap, objectsByName, prefix) => {
    return new Promise((resolve, reject) => {

        let key, mappedKey,
            gearColors = {},
            rColor = new RColor.RColor(),
            imgLoad;

        
        if (!gearList || !gearMap) { reject(); return; }

        for (key in gearMap) {
            if (!key) { continue; }

            mappedKey = gearMap[key];

            if (!gearList[mappedKey]) { continue; }     
            if (!objectsByName[prefix + key]) { continue; }

            if (!infoMap[key]) {
                
                if (!gearColors[mappedKey]) {
                    gearColors[mappedKey] = parseInt((rColor.get(true, 0.95, 0.1)).replace(/^#/, ''), 16);
                }
                //Create new
                infoMap[key] = new infoWcont.InfoWcont( key, mappedKey, gearList[mappedKey], gearColors[mappedKey]);

            } else {
                //Update info
                infoMap[key].info = gearList[mappedKey];
            }
            
        }
        resolve(infoMap);                               
        
    });
}