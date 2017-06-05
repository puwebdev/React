"use strict";

var __s__ = require('../utils/js-helpers.js'),
    __d__ = require('../utils/dom-utilities.js'),
    RColor = require('../utils/random-color.js');

// <summary>
// Connects 3dObjects in the scene with groups. 
// Discards non-existing ones.
// Reverses the structure. Selects those highlightables.
// </summary>
// <param name="groupsMap">The map of groups of 3d objects. From Mongo</param>
// <param name="objectsByName">The names of 3d objects in the scene. From Three</param>
// <param name="prefix">The prefix of the 3d model</param>

export const infoGroupsProcess = (groupsMap, objectsByName, prefix) => {

    return new Promise((resolve, reject) => {

        let objs = {}, groups = {}, logErrors = [],
            key, cleanKey, groupKey, existingObjsNames;

        const getObjectFromScene = (name) => { return !!objectsByName[prefix + name] }
        
        if (!groupsMap) { reject(); return; }

        //Clean key
        for (key in objectsByName) {
            cleanKey = key.slice(prefix.length);
            if (!cleanKey || key.indexOf("/") === 0) { continue; }
            objs[cleanKey] = { object3d: objectsByName[key] };
        }

        //Only groups with objects that exist
        for (groupKey in groupsMap) {
            if (!groupsMap[groupKey].keys || groupsMap[groupKey].keys.length === 0) { continue; } 
                        
            existingObjsNames = _.filter(_.uniq(groupsMap[groupKey].keys), (n) => getObjectFromScene(n));

            if (existingObjsNames.length !== groupsMap[groupKey].keys.length) {
                logErrors.push("** Group '" + groupKey + "' has " + groupsMap[groupKey].keys.length + " keys that match " + existingObjsNames.length + " objects.");
            }

            //if (existingObjsNames.length === 0) { continue; } 

            groups[groupKey] = Object.assign(
                groupsMap[groupKey], 
                { keys: existingObjsNames });

            //Add a reverse reference object.onGroups => groupKey
            existingObjsNames.map((key, idx) => {
                if (objs[key]) { 
                    if (!objs[key].onGroups) { objs[key].onGroups = []; }
                    objs[key].onGroups.push(groupKey);
                    objs[key].isHighlightable = true;
                    if (!objs[key].object3d.___originalPosition) { 
                        objs[key].object3d.___originalPosition = new THREE.Vector3().copy(objs[key].object3d.position);
                    }
                }
            });
        }

        resolve({ objs, groups, logErrors });                               
        
    });
}