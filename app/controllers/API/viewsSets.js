var config = require('../../config/config');
var mongoose = require('mongoose');
var ViewsSet = mongoose.model('ViewsSet');
var World = mongoose.model('World');
var utils = require(config.root + '/helper/utils');
var helper = require(config.root + '/helper/helper');
var screenshots = require('../../helper/screenshots');
var crypto = require('crypto');
var request = require('request');
var fs = require('fs');
var _ = require('lodash');

const orderBySortPos = (a, b) => {
  return Number(a.sortPos) > Number(b.sortPos) ? 1 : -1;
};

/**
 * @api {get} /api/viewsSets/:id Get a single viewsSet
 * @apiName GetViewsSet
 * @apiGroup ViewsSet
 *
 * @apiParam {String} id ViewsSet's unique id.
 *
 * @apiSuccess {String} _id ViewsSet id
 * @apiSuccess {String} name Name of viewsSet
 * @apiSuccess {String} title Title of viewsSet
 * @apiSuccess {String} description Description of viewsSet
 * @apiSuccess {Array} views ViewsSet's children views
 *
 */
exports.read = function(req, res, next) {
  var viewsSetId = req.params.id;

  ViewsSet.load(viewsSetId, function(err, foundViewsSet) {
    if (err) return utils.responses(res, 500, err);
    if (!foundViewsSet) return utils.responses(res, 404, { message: "ViewsSet not found"});
    return utils.responses(res, 200, foundViewsSet);
  });
};

function addViewsSetToWorld (world, viewsSet, res) {
  if (!world.viewsSets) { world.viewsSets = []; }
  world.viewsSets.push(viewsSet._id);

  return world.save(function (err) {
    if (err) return utils.responses(res, 500, err);
    return utils.responses(res, 200, viewsSet);
  });
}

/**
 * @api {post} /api/viewsSets Create a viewsSet
 * @apiName CreateViewsSet
 * @apiGroup ViewsSet
 *
 * @apiParam {String} worldId Parent world id
 * @apiParam {Object} viewsSet Created viewsSet data
 *
 * @apiSuccess {String} _id ViewsSet id
 * @apiSuccess {String} name Name of viewsSet
 * @apiSuccess {String} title Title of viewsSet
 * @apiSuccess {String} description Description of viewsSet
 * @apiSuccess {Array} views ViewsSet's children view ids
 *
 */
exports.create = function (req, res, next) {
  var worldId = req.body.worldId; 
  var viewsSet = new ViewsSet(req.body.viewsSet);
  if (viewsSet.name) { viewsSet.name = viewsSet.name.trim(); }
  viewsSet.views = [];

  viewsSet.save(function (err, newViewsSet) {
    if (err) return utils.responses(res, 500, err);
    World.findById(worldId, function(err, w) {
      if (err) return utils.responses(res, 500, err);
      if (!w) return utils.responses(res, 404, { message: "World not found" });

      addViewsSetToWorld(w, newViewsSet, res);
    });
  });
};

/**
 * @api {put} /api/viewsSets Update a viewsSet
 * @apiName UpdateViewsSet
 * @apiGroup ViewsSet
 *
 * @apiParam {Object} viewsSet Updated viewsSet data including _id
 *
 * @apiSuccess {String} _id ViewsSet id
 * @apiSuccess {String} name Name of viewsSet
 * @apiSuccess {String} title Title of viewsSet
 * @apiSuccess {String} description Description of viewsSet
 * @apiSuccess {Array} views ViewsSet's children view ids
 *
 */
exports.update = function (req, res, next) {
  var viewsSet = req.body.viewsSet;

  if (viewsSet.name) { viewsSet.name = viewsSet.name.trim(); }

  ViewsSet.findById(viewsSet._id, function(err, existingViewsSet) {
    if (err) return utils.responses(res, 500, err);
    if (!existingViewsSet) return utils.responses(res, 404, { message: "ViewsSet not found. Not saving anything."});

    _.merge(existingViewsSet, viewsSet);
    existingViewsSet.save(function (err, newViewsSet) {
      if (err) return utils.responses(res, 500, err);
      return utils.responses(res, 200, newViewsSet);
    });
  });
};

function removeViewsSet (world, viewsSetId, res) {
  ViewsSet.findById(viewsSetId, function(err, existingViewsSet) {
    if (err) return utils.responses(res, 500, err);
    if (!existingViewsSet) return utils.responses(res, 404, { message: "ViewsSet not found" });

    if (existingViewsSet.views && existingViewsSet.views.length > 0) {
      for (var j = 0, lenJ = existingViewsSet.views.length; j < lenJ; j += 1) {
        screenshots.deleteScreenshotFile(existingViewsSet.views[j].screenshot);
      }
    }
    existingViewsSet.remove();

    _.remove(world.viewsSets, function(viewsSetIterator) {
      return (viewsSetIterator === viewsSetId);
    });

    world.save(function(err) {
      if (err) return utils.responses(res, 500, err);
      return utils.responses(res, 200, null);
    });
  });
}

/**
 * @api {delete} /api/viewsSets Delete a viewsSet
 * @apiName DeleteViewsSet
 * @apiGroup ViewsSet
 *
 * @apiParam {String} worldId Parent world id
 * @apiParam {String} viewsSetId Deleted viewsSet id
 *
 */
exports.delete = function (req, res, next) {
  var worldId = req.body.worldId; 
  var viewsSetId = req.body.viewsSetId;

  World.findById(worldId, function(err, w) {
    if (err) return utils.responses(res, 500, err);
    if (!w) return utils.responses(res, 404, { message: "World not found"});

    removeViewsSet(w, viewsSetId, res);
  });
};

/**
 * @api {get} /api/viewsSets?worldId=:worldId Get all viewsSets of specified world
 * @apiName GetAllViewsSets
 * @apiGroup ViewsSet
 *
 * @apiParam {String} worldId Parent world id
 *
 */
exports.getAll = function(req, res, next) {

  var worldId = req.query["worldId"]; 

  World.load(worldId, function(err, w) {
    if (err) return utils.responses(res, 500, err);
    if (!w) return utils.responses(res, 404, { message: "World not found"});

    var vw = w.viewsSets || [];
    return utils.responses(res, 200, vw.sort(orderBySortPos));
  });
};

/**
 * @api {post} /api/viewsSetsOrder Reorder viewsSets
 * @apiName ReorderViewsSets
 * @apiGroup ViewsSet
 *
 * @apiParam {String} worldId Parent world id
 * @apiParam {Object} nOrder ViewsSets ordering description
 *
 */
exports.saveOrder = function( req, res, next) {

  var worldId = req.body.worldId; 
  var viewsSetIdsOrdered = req.body.nOrder;

  World.load(worldId, function(err, w) {
    if (err) return utils.responses(res, 500, err);
    if (!w) return utils.responses(res, 404, { message: "World not found"});

    var vw = w.viewsSets || [], j, count = vw.length, reordered = false;
    if (viewsSetIdsOrdered !== null) {
      for (j = 0; j < count; j += 1) {
        if (viewsSetIdsOrdered[vw[j]._id] !== undefined) {
          reordered = true;
          vw[j].sortPos = viewsSetIdsOrdered[vw[j]._id];
        }
      }
      if (reordered) {
        vw.sort(orderBySortPos);
        w.viewsSets = vw;
        w.save(function (err) {
          if (err) return utils.responses(res, 500, err);
          return utils.responses(res, 200, vw);
        });
      }
    }

    if (!reordered) {
      return utils.responses(res, 200, vw);
    }
  });
};
