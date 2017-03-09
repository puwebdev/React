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

const orderBySortPos = (a, b) => {
  return Number(a.sortPos) > Number(b.sortPos) ? 1 : -1;
};

/**
 * @api {get} /api/views/:id Get a single view
 * @apiName GetView
 * @apiGroup View
 *
 * @apiParam {String} id View's unique id.
 *
 * @apiSuccess {String} _id View id
 * @apiSuccess {String} name Name of view
 * @apiSuccess {String} title Title of view
 * @apiSuccess {String} description Description of view
 * @apiSuccess {String} html Html of view
 * @apiSuccess {String} selected
 * @apiSuccess {String} highlighted
 * @apiSuccess {String} doubleclick
 * @apiSuccess {String} screenshot View's screenshot image file name
 * @apiSuccess {Number} keyCode
 * @apiSuccess {Number} sortPos Sort position of view
 * @apiSuccess {Object} cameraPosition 3D camera position
 * @apiSuccess {Object} targetPosition 3D target position
 *
 */
exports.read = function(req, res, next) {
  var viewId = req.params.id;

  View.findById(viewId, function(err, foundView) {
    if (err) return utils.responses(res, 500, err);
    if (!foundView) return utils.responses(res, 404, { message: "View not found"});
    return utils.responses(res, 200, foundView);
  });
};

function addViewToViewsSet (viewsSet, view, res) {
  if (!viewsSet.views) { viewsSet.views = []; }
  viewsSet.views.push(view._id);

  return viewsSet.save(function(err) {
    if (err) return utils.responses(res, 500, err);
    return utils.responses(res, 200, view);
  });
}

/**
 * @api {post} /api/views Create a view
 * @apiName CreateView
 * @apiGroup View
 *
 * @apiParam {String} viewsSetId Parent viewsSet id
 * @apiParam {Object} view Created view data
 *
 * @apiSuccess {String} _id View id
 * @apiSuccess {String} name Name of view
 * @apiSuccess {String} title Title of view
 * @apiSuccess {String} description Description of view
 * @apiSuccess {String} html Html of view
 * @apiSuccess {String} selected
 * @apiSuccess {String} highlighted
 * @apiSuccess {String} doubleclick
 * @apiSuccess {String} screenshot View's screenshot image file name
 * @apiSuccess {Number} keyCode
 * @apiSuccess {Number} sortPos Sort position of view
 * @apiSuccess {Object} cameraPosition 3D camera position
 * @apiSuccess {Object} targetPosition 3D target position
 *
 */
exports.create = function (req, res, next) {
  var viewsSetId = req.body.viewsSetId;
  var viewParams = _.cloneDeep(req.body.view);
  viewParams._id = mongoose.Types.ObjectId();
  var view = new View(viewParams);
  if (view.name) { view.name = view.name.trim(); }
  view.screenshot = screenshots.saveScreenshot(view._id, view.screenshot);

  view.save(function(err, newView) {
    if (err) return utils.responses(res, 500, err);
    ViewsSet.findById(viewsSetId, function(err, viewsSet) {
      if (err) return utils.responses(res, 500, err);
      if (!viewsSet) return utils.responses(res, 404, { message: "Viewsset not found" });

      addViewToViewsSet(viewsSet, newView, res);
    });
  });
};

/**
 * @api {put} /api/views Update a view
 * @apiName UpdateView
 * @apiGroup View
 *
 * @apiParam {Object} view Updated view data including _id
 *
 * @apiSuccess {String} _id View id
 * @apiSuccess {String} name Name of view
 * @apiSuccess {String} title Title of view
 * @apiSuccess {String} description Description of view
 * @apiSuccess {String} html Html of view
 * @apiSuccess {String} selected
 * @apiSuccess {String} highlighted
 * @apiSuccess {String} doubleclick
 * @apiSuccess {String} screenshot View's screenshot image file name
 * @apiSuccess {Number} keyCode
 * @apiSuccess {Number} sortPos Sort position of view
 * @apiSuccess {Object} cameraPosition 3D camera position
 * @apiSuccess {Object} targetPosition 3D target position
 *
 */
exports.update = function (req, res, next) {
  var view = req.body.view;

  if (view.name) { view.name = view.name.trim(); }

  View.findById(view._id, function(err, existingView) {
    if (err) return utils.responses(res, 500, err);
    if (!existingView) return utils.responses(res, 404, { message: "View not found. Nothing saved" });

    screenshots.deleteScreenshotFile(existingView.screenshot);
    view.screenshot = screenshots.saveScreenshot(existingView._id, view.screenshot);
    _.merge(existingView, view);
    existingView.markModified('cameraPosition');
    existingView.markModified('targetPosition');

    existingView.save(function (err, newView) {
      if (err) return utils.responses(res, 500, err);
      return utils.responses(res, 200, newView);
    });
  });
};

function removeView (viewsSet, viewId, res) {
  View.findById(viewId, function(err, existingView) {
    if (err) return utils.responses(res, 500, err);
    if (!existingView) return utils.responses(res, 404, { message: "View not found" });

    screenshots.deleteScreenshotFile(existingView.screenshot);
    existingView.remove();

    _.remove(viewsSet.views, function(viewIterator) {
      return (viewIterator === viewId);
    });

    viewsSet.save(function(err) {
      if (err) return utils.responses(res, 500, err);
      return utils.responses(res, 200, null);
    });
  });
}

/**
 * @api {delete} /api/views Delete a view
 * @apiName DeleteView
 * @apiGroup View
 *
 * @apiParam {String} viewsSetId Parent viewsSet id
 * @apiParam {String} viewId Deleted view id
 *
 */
exports.delete = function (req, res, next) {
  var viewsSetId = req.body.viewsSetId;
  var viewId = req.body.viewId;

  ViewsSet.findById(viewsSetId, function(err, viewsSet) {
    if (err) return utils.responses(res, 500, err);
    if (!viewsSet) return utils.responses(res, 404, { message: "ViewsSet not found"});

    removeView(viewsSet, viewId, res);
  });
};

/**
 * @api {get} /api/views?parentType=:parentType&parentId=:parentId Get all views of world or viewsSet
 * @apiName GetAllViews
 * @apiGroup View
 *
 * @apiParam {String} parentType world | viewsSet
 * @apiParam {String} parentId Parent element id
 *
 */
exports.getAll = function(req, res, next) {

  var parentType = req.query["parentType"];
  var parentId = req.query["parentId"];

  if (parentType === 'world') {
    return View.find({ world: parentId }, function(err, views) {
      if (err) return utils.responses(res, 500, err);
      if (!views) return utils.responses(res, 404, { message: "Views not found"});

      return utils.responses(res, 200, views);
    });
  }

  return ViewsSet.load(parentId, function(err, viewsSet) {
    if (err) return utils.responses(res, 500, err);
    if (!viewsSet) return utils.responses(res, 404, { message: "ViewsSet not found"});

    var vw = viewsSet.views || [];
    return utils.responses(res, 200, vw);
  });
};

/**
 * @api {post} /api/viewsOrder Reorder views
 * @apiName ReorderViews
 * @apiGroup View
 *
 * @apiParam {String} viewsSetId Parent viewsSet id
 * @apiParam {Object} nOrder Views ordering description
 *
 */
exports.saveOrder = function(req, res, next) {

  var viewsSetId = req.body.viewsSetId;
  var viewIdsOrdered = req.body.nOrder;

  ViewsSet.load(viewsSetId, function(err, viewsSet) {
    if (err) return utils.responses(res, 500, err);
    if (!viewsSet) return utils.responses(res, 404, { message: "ViewsSet not found"});

    var vw = viewsSet.views || [], j, count = vw.length, reordered = false;
    if (viewIdsOrdered !== null) {
      for (j = 0; j < count; j += 1) {
        if (viewIdsOrdered[vw[j]._id] !== undefined) {
          reordered = true;
          vw[j].sortPos = viewIdsOrdered[vw[j]._id];
        }
      }
      if (reordered) {
        vw.sort(orderBySortPos);
        viewsSet.views = vw;
        viewsSet.save(function (err) {
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
