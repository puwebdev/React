var config = require('../../config/config');
var mongoose = require('mongoose');
var World = mongoose.model('World');
var utils = require(config.root + '/helper/utils');
var request = require('request');
var fs = require('fs');
var _ = require('lodash');

function updateGroupsMapIncremental(groupsMap, key, groups_diff) {
  for (var i in groups_diff) {
    var group = groups_diff[i];

    if (!groupsMap[group])
      groupsMap[group] = { hiddenByDefault: false, keys: [] };

    groupsMap[group].keys = _.union(groupsMap[group].keys, [key]);
  }
}

function updateGroupsMapDecremental(groupsMap, key, groups_diff) {
  for (var i in groups_diff) {
    var group = groups_diff[i];

    groupsMap[group].keys = _.without(groupsMap[group].keys, key);
  }
}

/**
 * Modify objectsMap
 * PUT : '/api/objectsMap'
 */

 /* objectsMap: {        
  "Cable_Wire_001": {
    tags: ["Cable Wire", "My cat 1"],
    deviceCategory: "5683838483838hh11",
    groups: ["All Cables", "Some cables"]
  }
} */
exports.update = function(req, res, next) {
  var worldId = req.body.worldId;
  var objectsMapChanges = req.body.objectsMap;
  var objDelKeys = req.body.objDelKeys;

  World.load(worldId, function(err, w) {
    if (err) return utils.responses(res, 500, err);
    if (!w) return utils.responses(res, 404, {messages: "World not found"});

    if (!w.objectsMap) w.objectsMap = {};

    for (var key in objectsMapChanges) {
      var newObj = objectsMapChanges[key];
      var oldObj = w.objectsMap[key] || {groups: []};

      updateGroupsMapIncremental(w.groupsMap, key, _.difference(newObj.groups, oldObj.groups));
      updateGroupsMapDecremental(w.groupsMap, key, _.difference(oldObj.groups, newObj.groups));

      w.objectsMap[key] = newObj;
    }

    for (var i in objDelKeys) {
      var key = objDelKeys[i];

      if (w.objectsMap[key]) {
        updateGroupsMapDecremental(w.groupsMap, key, w.objectsMap[key].groups);
        delete w.objectsMap[key];
      }
    }

    w.markModified('groupsMap');
    w.markModified('objectsMap');

    w.save(function(err, new_world) {
      return utils.responses(res, 204, { message: "Updated" } );
    });
  });
}