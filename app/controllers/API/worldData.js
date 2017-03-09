var config = require('../../config/config');
var mongoose = require('mongoose');
var View = mongoose.model('View');
var World = mongoose.model('World');
var ViewsSet = mongoose.model('ViewsSet');
var utils = require(config.root + '/helper/utils');
var helper = require(config.root + '/helper/helper');
var screenshots = require('../../helper/screenshots');
var crypto = require('crypto');
var request = require('request');
var fs = require('fs');
var _ = require('lodash');
var dataHelper = require('../../helper/data-helper');

/**
 * @api {get} /api/worldData/:id Get a single world
 * @apiName GetWorldData
 * @apiGroup World
 *
 * @apiParam {String} id World's unique id.
 *
 */
exports.read = function(req, res, next) {
  var worldId = req.params.id,
      jsonConfig = {};

  World.findById(worldId, function(err, foundWorld) {
    if (err) return utils.responses(res, 500, err);
    if (!foundWorld) return utils.responses(res, 404, { message: "World not found"});

    World.loadBySlug(foundWorld.slug, function(err, w) {
        jsonConfig["mainScene"] = w.modelInfo;
        jsonConfig["mainScene"].worldId = w._id;
        //jsonConfig["gearMap"] = w.gearMap;
        //jsonConfig["viewsSets"] = w.viewsSets;
        jsonConfig["infowins"] = w.infowins;
        jsonConfig["gearList"] = dataHelper.createGearList(w);

        return utils.responses(res, 200, jsonConfig);
    });

  });
};

