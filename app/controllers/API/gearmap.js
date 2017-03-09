var config = require('../../config/config');
var mongoose = require('mongoose');
var World = mongoose.model('World');
var utils = require(config.root + '/helper/utils');
var screenshots = require('../../helper/screenshots');
var crypto = require('crypto');
var request = require('request');
var fs = require('fs');
var _ = require('lodash');

const orderByKey = (a, b) => {
  return String(a.dkey || "").toLowerCase() >= String(b.dkey || "").toLowerCase() ? 1 : -1;
}

const fromObjectToArray = (obj) => {
    var gmObj = obj || {};
    var gearMapArray = [];
    for (var k in gmObj) {
      if (k) {
        gearMapArray.push({ didd: 0, dkey: k, dval: gmObj[k]});
      }
    }
    var gearMapSorted = gearMapArray.sort(orderByKey);
    for (var j = 0, lenJ = gearMapSorted.length; j < lenJ; j += 1) {
      gearMapSorted[j].didd = j;
    }
    return gearMapSorted;
}

/**
 * Modify a Infowin
 * PUT : '/api/gearmap'
 */
exports.update = function (req, res, next) {
  var worldId = req.body.worldId; 
  var gearMap = req.body.gearmap;

  World.load(worldId, function(err, w) {
    if (err) return utils.responses(res, 500, err);
    if (w === null) return utils.responses(res, 404, { message: "World not found"});

    w.gearMap = gearMap;
    w.markModified('gearMap');

    var gearMapSorted = fromObjectToArray(gearMap);

    w.save(function (err, new_World) {
       return utils.responses(res, 200, gearMapSorted );
    });
  });
}


/**
 * List gearmap
 * GET : '/api/gearmap'
 */
exports.getAll = function( req, res, next) {

  var worldId = req.query["worldId"]; 

  World.load(worldId, function(err, w) {
    if (err) return utils.responses(res, 500, err);
    if (w === null) return utils.responses(res, 404, { message: "World not found"});

    var gearMapSorted = fromObjectToArray(w.gearMap);

    return utils.responses(res, 200, gearMapSorted );
  });
}

