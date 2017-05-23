var groupObject = require('./groupObject');

"use strict";

export const GroupsFactory = {
    
    objs: {},
    groups: {},
    objGlows: {},

    addFromData(objs, groups) {
        let me = GroupsFactory,
            groupKey, groupObj;

        me.objs = objs;
        me.groups = {};
        me.objGlows = {};

        for (groupKey in groups) {
            //Create GroupObject
            groupObj = new groupObject.GroupObject(groupKey, groups[groupKey]);

            //Add glowing siblings to Factory objGlows
            _.each(groupObj.objsGlowsByKey, (obj, key) => { me.objGlows[key] = obj });
            
            //Add GroupObject to Factory groups
            me.groups[groupKey] = groupObj;
        }
    },

    get(groupKey) {
        let me = GroupsFactory;

        if (!groupKey) { console.error("Group key not provided. Use get(groupKey)"); return null; }

        return me.groups[groupKey];
    },

    setParent(parent) {
        GroupsFactory.parent = parent;
    }

}
