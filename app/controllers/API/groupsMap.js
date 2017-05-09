var config = require('../../config/config');
var mongoose = require('mongoose');
var World = mongoose.model('World');
var utils = require(config.root + '/helper/utils');
var request = require('request');
var fs = require('fs');
var _ = require('lodash');

const orderByKey = (a, b) => {
  return String(a.dkey || "").toLowerCase() >= String(b.dkey || "").toLowerCase() ? 1 : -1;
}

const fromObjectToArray = (obj) => {
    var gmObj = obj || {};
    var groupsMapArray = [];
    
    for (var k in gmObj) {
      if (k) {
        groupsMapArray.push({ didd: 0, dkey: k, dval: gmObj[k]});
      }
    }

    var groupsMapSorted = groupsMapArray.sort(orderByKey);
    for (var j = 0, lenJ = groupsMapSorted.length; j < lenJ; j += 1) {
      groupsMapSorted[j].didd = j;
    }
    return groupsMapSorted;
}

/**
 * Modify groupsMap
 * PUT : '/api/groupmap'
 */
exports.update = function (req, res, next) {
  var worldId = req.body.worldId; 
  var groupsMapChanges = req.body.groupsMap;
  var objDelKeys = req.body.objDelKeys;

  World.load(worldId, function(err, w) {
    if (err) return utils.responses(res, 500, err);
    if (w === null) return utils.responses(res, 404, { message: "World not found"});

    for (var key in groupsMapChanges) {
      w.groupsMap[key] = Object.assign(w.groupsMap[key] || { hiddenByDefault: false, keys: [] }, groupsMapChanges[key]);
    }
    for (var key in objDelKeys) {
      delete w.groupsMap[key];
    }
    w.markModified('groupsMap');

    w.save(function (err, new_World) {
       return utils.responses(res, 204, { message: "Updated" } );
    });
  });
}


/**
 * List groupsMap
 * GET : '/api/groupmap'
 */
exports.getAll = function( req, res, next) {

  var worldId = req.query["worldId"]; 

  World.load(worldId, function(err, w) {
    if (err) return utils.responses(res, 500, err);
    if (w === null) return utils.responses(res, 404, { message: "World not found"});

    var groupsMapSorted = fromObjectToArray(w.groupsMap);

    return utils.responses(res, 200, groupsMapSorted );
  });
}

