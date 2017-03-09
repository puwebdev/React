var config = require('../../config/config');
var mongoose = require('mongoose');
var Marker = mongoose.model('Marker');
var Infowin = mongoose.model('Infowin');
var World = mongoose.model('World');
var utils = require(config.root + '/helper/utils');
var crypto = require('crypto');
var request = require('request');
var fs = require('fs');
var async = require('async');
var _ = require('lodash');

const orderByTitle = (a, b) => {
  return String(a.slug || "") >= String(b.slug || "") ? 1 : -1;
};

const addMarkerToParent = (parent, marker, options, res) => {
  if (!parent.markers) { parent.markers = []; }
  var addedPosition = parent.markers.length;
  if (options) {
    var foundIndex = parent.markers.indexOf(options.originalMarkerId);
    addedPosition = (options.relativePosition === 'before') ? foundIndex : foundIndex + 1;
  }
  parent.markers.splice(addedPosition, 0, marker._id);

  return parent.save(function (err) {
    if (err) return utils.responses(res, 500, err);
    return utils.responses(res, 200, marker);
  });
}

/**
 * @apiDefine Marker Marker
 *    A sprite located in the World (3D) to spot a place. 
 * 
 *    Optional behaviour on "click": property *feedbackHtml* controls behaviour.
 * 
 *    If *feedbackHtml* is non-null a layover will be shown to display it and the event *markerOnShowFeedback* will be emmited.
 *    When dismissed (button) the event *markerOnDismissFeedback* will be emmited.
 * 
 *    If *feedbackHtml*  is null/empty then the event *markerOnDismissFeedback* will be emmited directly.
 */

/**
 * @apiDefine Model
 * @apiSuccess {String} _id Id of marker
 * @apiSuccess {String} slug Slug of marker (title)
 * @apiSuccess {String} title Title of marker (not shown)
 * @apiSuccess {String} letter Letter on marker (shown on marker. If empty a circle is used)
 * @apiSuccess {Number} direction Arrow direction [0:down, 1:up, 2:left, 3:right]
 * @apiSuccess {String} feedbackHtml Feedback html of marker to be displayed in layover
 * @apiSuccess {String} faIcon FontAwesome fa-class, adds an Icon to layover
 * @apiSuccess {String} dismissText Text of dismiss button (for instance "close")
 * @apiSuccess {String} optionsOnShowFeedback Stringified object with options (event emitter)
 * @apiSuccess {String} optionsOnDismissFeedback Stringified object with options (event emitter)
 * @apiSuccess {Boolean} toNext Boolean passed in markerOnShowFeedback & markerOnDismissFeedback
 * @apiSuccess {Vector3} position 3D position of marker
 */

/**
 * @api {get} /api/markers/:id Get a single marker
 * @apiName GetMarker
 * @apiGroup Marker
 *
 * @apiParam {String} id Marker's unique id.
 *
 * @apiUse Model
 *
 */
exports.read = function(req, res, next) {
  var markerId = req.params.id;

  Marker
    .findById(markerId)
    .exec(function(err, foundMarker) {
      if (err) return utils.responses(res, 500, err);
      if (!foundMarker) return utils.responses(res, 404, { message: "Marker not found"});
      return utils.responses(res, 200, foundMarker);
  });
};

/**
 * @api {post} /api/markers Create a marker
 * @apiName CreateMarker
 * @apiGroup Marker
 *
 * @apiParam {String} parentId Id of parent element
 * @apiParam {Object} marker Created marker object data
 *
 * @apiUse Model
 *
 */
exports.create = function (req, res, next) {
  var parentId = req.body.parentId;
  var marker = new Marker(req.body.marker);

  marker.save(function (err, newMarker) {
    if (err) return utils.responses(res, 500, err);

    Infowin.findById(parentId, function(err, parentInfowin) {
      if (err) return utils.responses(res, 500, err);
      if (!parentInfowin) return utils.responses(res, 404, { message: "Parent Infowin not found"});

      addMarkerToParent(parentInfowin, newMarker, null, res);
    });
    
  });
};

/**
 * @api {put} /api/markers Update a marker
 * @apiName UpdateMarker
 * @apiGroup Marker
 *
 * @apiParam {Object} marker New marker data including _id
 *
 * @apiUse Model
 *
 */
exports.update = function (req, res, next) {
  var marker = req.body.marker;

  //Fetch from Mongo
  Marker.findById(marker._id, function(err, existingMarker) {
    if (err) return utils.responses(res, 500, err);
    if (!existingMarker) return utils.responses(res, 404, { message: "Marker not found. Not saving anything."});

    _.merge(existingMarker, marker);
    existingMarker.save(function (err, newMarker) {
      if (err) return utils.responses(res, 500, err);
      return utils.responses(res, 200, newMarker);
    });
  });
};

function removeMarker (parent, markerId, res) {
  Marker.findById(markerId, function(err, existingMarker) {
    if (err) return utils.responses(res, 500, err);
    if (!existingMarker) return utils.responses(res, 404, { message: "Marker not found"});

    existingMarker.remove();

    _.remove(parent.markers, function(markerIterator) {
      return (markerIterator === markerId);
    });

    parent.save(function(err) {
      if (err) return utils.responses(res, 500, err);
      return utils.responses(res, 200, null );
    });
  });
}

/**
 * @api {delete} /api/markers Delete a marker
 * @apiName DeleteMarker
 * @apiGroup Marker
 *
 * @apiParam {String} parentId Id of parent element
 * @apiParam {String} markerId Id of deleted marker
 *
 *
 */
exports.delete = function (req, res, next) {
  var parentId = req.body.parentId;
  var markerId = req.body.markerId;

  Infowin.findById(parentId, function(err, parentInfowin) {
    if (err) return utils.responses(res, 500, err);
    if (!parentInfowin) return utils.responses(res, 404, { message: "Parent Infowin not found"});

    removeMarker(parentInfowin, markerId, res);
  });

};

