var config = require('../../config/config');
var mongoose = require('mongoose');
var Infowin = mongoose.model('Infowin');
var World = mongoose.model('World');
var utils = require(config.root + '/helper/utils');
var screenshots = require('../../helper/screenshots');
var crypto = require('crypto');
var request = require('request');
var fs = require('fs');
var async = require('async');
var _ = require('lodash');

const orderByTitle = (a, b) => {
  return String(a.title || "").toLowerCase() >= String(b.title || "").toLowerCase() ? 1 : -1;
};

/**
 * @api {get} /api/infowins/:id Get a single infowin
 * @apiName GetInfowin
 * @apiGroup Infowin
 *
 * @apiParam {String} id Infowin's unique id.
 *
 * @apiSuccess {String} _id Id of infowin
 * @apiSuccess {String} name Name of infowin
 * @apiSuccess {String} title Title of infowin
 * @apiSuccess {String} description Description of infowin
 * @apiSuccess {String} html Html of infowin
 * @apiSuccess {String} type Type of infowin
 * @apiSuccess {String} thumbnail_src Infowin thumbnail url
 * @apiSuccess {Number} sortPos Sorting position of infowin
 * @apiSuccess {Array} infowins Infowin's children infowins
 * @apiSuccess {String} view Id of infowin's associated view
 * @apiSuccess {Array} markers Infowin's children markers
 *
 */
exports.read = function(req, res, next) {
  var infowinId = req.params.id;

  Infowin
    .findById(infowinId)
    .populate('infowins')
    .populate('markers')
    .exec(function(err, foundInfowin) {
      if (err) return utils.responses(res, 500, err);
      if (!foundInfowin) return utils.responses(res, 404, { message: "Infowin not found"});
      return utils.responses(res, 200, foundInfowin);
  });
};

/**
 * @api {get} /api/infowins/:id/populated Get a single infowin with populated views
 * @apiName GetInfowinPopulated
 * @apiGroup Infowin
 *
 * @apiParam {String} id Infowin's unique id.
 *
 * @apiSuccess {String} _id Id of infowin
 * @apiSuccess {String} name Name of infowin
 * @apiSuccess {String} title Title of infowin
 * @apiSuccess {String} description Description of infowin
 * @apiSuccess {String} html Html of infowin
 * @apiSuccess {String} type Type of infowin
 * @apiSuccess {String} thumbnail_src Infowin thumbnail url
 * @apiSuccess {Number} sortPos Sorting position of infowin
 * @apiSuccess {Array} infowins Infowin's children infowins
 * @apiSuccess {Object} view Infowin's associated view
 * @apiSuccess {Array} markers Infowin's children markers
 *
 */
exports.readPopulated = function(req, res, next) {
  var infowinId = req.params.id;

  Infowin
    .findById(infowinId)
    .populate({
      path: 'infowins',
      populate: { path: 'view' }
    })
    .populate('view')
    .populate('markers')
    .exec(function(err, foundInfowin) {
      if (err) return utils.responses(res, 500, err);
      if (!foundInfowin) return utils.responses(res, 404, { message: "Infowin not found"});
      return utils.responses(res, 200, foundInfowin);
    });
};

function addInfowinToParent (parent, infowin, options, res) {
  if (!parent.infowins) { parent.infowins = []; }
  var addedPosition = parent.infowins.length;
  if (options) {
    var foundIndex = parent.infowins.indexOf(options.originalInfowinId);
    addedPosition = (options.relativePosition === 'before') ? foundIndex : foundIndex + 1;
  }
  parent.infowins.splice(addedPosition, 0, infowin._id);

  return parent.save(function (err) {
    if (err) return utils.responses(res, 500, err);
    return utils.responses(res, 200, infowin);
  });
}

/**
 * @api {post} /api/infowins Create an infowin
 * @apiName CreateInfowin
 * @apiGroup Infowin
 *
 * @apiParam {String} parentType world | infowin
 * @apiParam {String} parentId Id of parent element
 * @apiParam {Object} infowin Created infowin object data
 *
 * @apiSuccess {String} _id Id of infowin
 * @apiSuccess {String} name Name of infowin
 * @apiSuccess {String} title Title of infowin
 * @apiSuccess {String} description Description of infowin
 * @apiSuccess {String} html Html of infowin
 * @apiSuccess {String} type Type of infowin
 * @apiSuccess {String} thumbnail_src Infowin thumbnail url
 * @apiSuccess {Number} sortPos Sorting position of infowin
 * @apiSuccess {Array} infowins Infowin's children infowin ids
 * @apiSuccess {String} view Id of infowin's associated view
 * @apiSuccess {Array} markers Infowin's children markers
 *
 */
exports.create = function (req, res, next) {
  var parentType = req.body.parentType;
  var parentId = req.body.parentId;
  var infowin = new Infowin(req.body.infowin);
  if (infowin.name) { infowin.name = infowin.name.trim(); }

  infowin.save(function (err, newInfowin) {
    if (err) return utils.responses(res, 500, err);
    if (parentType === 'world') {
      World.findById(parentId, function(err, w) {
        if (err) return utils.responses(res, 500, err);
        if (!w) return utils.responses(res, 404, { message: "World not found"});

        addInfowinToParent(w, newInfowin, null, res);
      });
    } else if (parentType === 'infowin') {
      Infowin.findById(parentId, function(err, parentInfowin) {
        if (err) return utils.responses(res, 500, err);
        if (!parentInfowin) return utils.responses(res, 404, { message: "Parent infowin not found"});

        addInfowinToParent(parentInfowin, newInfowin, null, res);
      });
    }
  });
};

/**
 * @api {post} /api/infowins/clone Clone an infowin
 * @apiName CloneInfowin
 * @apiGroup Infowin
 *
 * @apiParam {String} parentType world | infowin
 * @apiParam {String} parentId Id of parent element
 * @apiParam {String} relativePosition before | after
 * @apiParam {String} originalInfowinId Id of original infowin
 *
 * @apiSuccess {String} _id Id of infowin
 * @apiSuccess {String} name Name of infowin
 * @apiSuccess {String} title Title of infowin
 * @apiSuccess {String} description Description of infowin
 * @apiSuccess {String} html Html of infowin
 * @apiSuccess {String} type Type of infowin
 * @apiSuccess {String} thumbnail_src Infowin thumbnail url
 * @apiSuccess {Number} sortPos Sorting position of infowin
 * @apiSuccess {Array} infowins Infowin's children infowin ids
 * @apiSuccess {String} view Id of infowin's associated view
 * @apiSuccess {Array} markers Infowin's children markers
 *
 */
exports.clone = function (req, res, next) {
  var parentType = req.body.parentType;
  var parentId = req.body.parentId;
  var relativePosition = req.body.relativePosition;
  var originalInfowinId = req.body.originalInfowinId;
  var options = {
    originalInfowinId: originalInfowinId,
    relativePosition: relativePosition
  };

  Infowin.findById(originalInfowinId, function(err, foundInfowin) {
    if (err) return utils.responses(res, 500, err);

    var foundInfowinObject = foundInfowin.toObject();
    delete foundInfowinObject._id;
    var newInfowin = new Infowin(foundInfowinObject);
    newInfowin.save(function(err, clonedInfowin) {
      if (err) return utils.responses(res, 500, err);

      if (parentType === 'world') {
        World.findById(parentId, function(err, w) {
          if (err) return utils.responses(res, 500, err);
          if (!w) return utils.responses(res, 404, { message: "World not found"});

          addInfowinToParent(w, clonedInfowin, options, res);
        });
      } else if (parentType === 'infowin') {
        Infowin.findById(parentId, function(err, parentInfowin) {
          if (err) return utils.responses(res, 500, err);
          if (!parentInfowin) return utils.responses(res, 404, { message: "Parent infowin not found"});

          addInfowinToParent(parentInfowin, clonedInfowin, options, res);
        });
      }
    });
  });
};

/**
 * @api {put} /api/infowins Update an infowin
 * @apiName UpdateInfowin
 * @apiGroup Infowin
 *
 * @apiParam {Object} infowin New infowin data including _id
 *
 * @apiSuccess {String} _id Id of infowin
 * @apiSuccess {String} name Name of infowin
 * @apiSuccess {String} title Title of infowin
 * @apiSuccess {String} description Description of infowin
 * @apiSuccess {String} html Html of infowin
 * @apiSuccess {String} type Type of infowin
 * @apiSuccess {String} thumbnail_src Infowin thumbnail url
 * @apiSuccess {Number} sortPos Sorting position of infowin
 * @apiSuccess {Array} infowins Infowin's children infowin ids
 * @apiSuccess {String} view Id of infowin's associated view
 *
 */
exports.update = function (req, res, next) {
  var infowin = req.body.infowin;

  if (infowin.name) { infowin.name = infowin.name.trim(); }

  //Fetch from Mongo
  Infowin.findById(infowin._id, function(err, existingInfowin) {
    if (err) return utils.responses(res, 500, err);
    if (!existingInfowin) return utils.responses(res, 404, { message: "Infowin not found. Not saving anything."});

    _.merge(existingInfowin, infowin);
    existingInfowin.save(function (err, newInfowin) {
      if (err) return utils.responses(res, 500, err);
      return utils.responses(res, 200, newInfowin);
    });
  });
};

function removeInfowin (parent, infowinId, res) {
  Infowin.findById(infowinId, function(err, existingInfowin) {
    if (err) return utils.responses(res, 500, err);
    if (!existingInfowin) return utils.responses(res, 404, { message: "Infowin not found"});

    screenshots.deleteScreenshotFile(existingInfowin.screenshot);
    existingInfowin.remove();

    _.remove(parent.infowins, function(infowinIterator) {
      return (infowinIterator === infowinId);
    });

    parent.save(function(err) {
      if (err) return utils.responses(res, 500, err);
      return utils.responses(res, 200, null );
    });
  });
}

/**
 * @api {delete} /api/infowins Delete an infowin
 * @apiName DeleteInfowin
 * @apiGroup Infowin
 *
 * @apiParam {String} parentType world | infowin
 * @apiParam {String} parentId Id of parent element
 * @apiParam {String} infowinId Id of deleted infowin
 *
 *
 */
exports.delete = function (req, res, next) {
  var parentType = req.body.parentType;
  var parentId = req.body.parentId;
  var infowinId = req.body.infowinId;

  if (parentType === 'world') {
    World.findById(parentId, function(err, w) {
      if (err) return utils.responses(res, 500, err);
      if (!w) return utils.responses(res, 404, { message: "World not found"});

      removeInfowin(w, infowinId, res);
    });
  } else if (parentType === 'infowin') {
    Infowin.findById(parentId, function(err, parentInfowin) {
      if (err) return utils.responses(res, 500, err);
      if (!parentInfowin) return utils.responses(res, 404, { message: "Parent Infowin not found"});

      removeInfowin(parentInfowin, infowinId, res);
    });
  }
};

/**
 * @api {get} /api/infowins?worldId=:worldId Get all infowins of specified world
 * @apiName GetAllInfowins
 * @apiGroup Infowin
 *
 * @apiParam {String} worldId World id
 *
 */
exports.getAll = function( req, res, next) {

  var worldId = req.query["worldId"]; 

  World.load(worldId, function(err, w) {
    if (err) return utils.responses(res, 500, err);
    if (!w) return utils.responses(res, 404, { message: "World not found"});

    var vw = w.infowins || [];
    return utils.responses(res, 200, vw.sort(orderByTitle) );
  });
};

/**
 * @api {post} /api/infowinsOrder Reorder infowins
 * @apiName ReorderInfowins
 * @apiGroup Infowin
 *
 * @apiParam {String} worldId World id
 * @apiParam {Object} nOrder Infowins ordering description
 *
 */
exports.saveOrder = function (req, res, next) {

  var worldId = req.body.worldId; 
  var infowinIdsOrdered = req.body.nOrder;

  World.load(worldId, function(err, w) {
    if (err) return utils.responses(res, 500, err);
    if (!w) return utils.responses(res, 404, { message: "World not found"});

    var vw = w.infowins || [], j, count = vw.length, reordered = false;

    if (infowinIdsOrdered !== null) {
      for (j = 0; j < count; j += 1) {
        if (infowinIdsOrdered[vw[j]._id] !== undefined) {
          reordered = true;
          vw[j].sortPos = infowinIdsOrdered[vw[j]._id];
        }
      }
      if (reordered) {
        vw.sort(orderByTitle);
        w.infowins = vw;
        w.save(function (err) {
          if (err) return utils.responses(res, 500, err);
          return utils.responses(res, 200, vw);
        });
      }
    }

    if (!reordered) {
      return utils.responses(res, 200, vw );
    }
  });
};
