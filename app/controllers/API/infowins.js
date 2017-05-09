var config = require('../../config/config');
var mongoose = require('mongoose');
var Infowin = mongoose.model('Infowin');
var World = mongoose.model('World');
var Scorm = mongoose.model('Scorm');
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

const orderBySortPos = (a, b) => {
  return String(a.sortPos || "").toLowerCase() >= String(b.sortPos || "").toLowerCase() ? 1 : -1;
};

/**
 * @apiDefine Infowin Infowin
 *    Our base model of information
 * 
 */

/**
 * @apiDefine ModelInfowin
 * @apiSuccess {String} _id Id of infowin
 * @apiSuccess {String} title Title of infowin
 * @apiSuccess {String} description Description of infowin
 * @apiSuccess {String} html Html of infowin
 * @apiSuccess {String} type Type of infowin
 * @apiSuccess {Number} sortPos Sorting position of infowin
 * @apiSuccess {Array} infowins Infowin's children infowins
 * @apiSuccess {View} view Infowin's view
 * @apiSuccess {Array} markers Infowin's children markers
 * @apiSuccessExample {json} Success-Response:
      {"_id":"585329bc9697ce43025a799a","createdAt":"2016-12-15T23:39:40.333Z","updatedAt":"2017-02-15T00:57:19.975Z","title":"Aerial Installations","description":"","html":"In an aerial or overhead installation...","type":"Module","world":"5833415018907e13bd8e96d7","view":{"onLoadActions":{"hide":[],"show":[]},"screenshot":"585329bc9697ce43025a799a-2017-02-15-00-5719.png","targetPosition":{"z":-21451.194,"y":81.557,"x":-2565.42},"cameraPosition":{"z":-21032.315,"y":430.8,"x":-3589.02},"mediaAnimatorAutoStart":true,"mediaAnimatorData":[{"type":"audio","src":"/opXLDemo/InfoWindowAssets/Intro_Aerial_Installations.mp3","timing":"1"},{"timing":"1","duration":"5","type":"camera","cameraPosition":{"x":-3260.028703873515,"y":346.9729293975041,"z":-21106.95545607375},"targetPosition":{"x":-2641.939972721324,"y":78.20110731014108,"z":-21556.11265792353}}]},"markers":[],"markerScale":16,"infowins":[]}
 */



/**
 * @api {get} /api/infowins/:id Get a single infowin
 * @apiName GetInfowin
 * @apiGroup Infowin
 *
 * @apiParam {String} id Infowin's unique id.
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


function addInfowinToParent (parent, protoInfowin, options, res) {
  if (!parent.infowins) { parent.infowins = []; }
  var addedPosition = parent.infowins.length;

  if (options.originalInfowinId) {
    var foundIndex = parent.infowins.indexOf(options.originalInfowinId);
    addedPosition = (options.relativePosition === 'before') ? foundIndex : foundIndex + 1;
  }  

  var asyncPool = [];
  asyncPool.push(function(callback) {
    if (options.worldId) protoInfowin.world = options.worldId;
    protoInfowin.save((err, newInfowin) => {
      if (err) callback(err);
      else callback(null, newInfowin);
    });
  });

  if (options.productCode) {
    asyncPool.push(function(infowin, callback) {
      Scorm.getSingleton(function(err, scorm) {
        if (err) callback(err);
        else {
          scorm.productsMap[options.productCode] = infowin._id;
          scorm.markModified('productsMap');
          scorm.save(function(err, scorm) {
            if (err) callback(err);
            else callback(null, infowin);
          });
        }
      });
    });
  }

  asyncPool.push(function(infowin, callback) {
    parent.infowins.splice(addedPosition, 0, infowin._id);
    parent.save((err) => {
      if (err) callback(err);
      else callback(null, infowin);
    });
  });

  return async.waterfall(asyncPool, function(err, newInfowin){
    if (err)
      return utils.responses(res, 500, err);

    return utils.responses(res, 200, newInfowin);
  });
}

function processScreenshot(oldView, newInfowin) {

    if (oldView && oldView.screenshot && oldView.screenshot.indexOf("data:image")!==0 && oldView.screenshot !== "_missing.png") { 
      screenshots.deleteScreenshotFile( oldView.screenshot );
    }

    if (!newInfowin) { return ""; }

    var newView = newInfowin.view;
    return screenshots.saveScreenshot(newInfowin._id, newView.screenshot);    
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
 * @apiUse ModelInfowin
 */
exports.create = function (req, res, next) {
  var parentType = req.body.parentType;
  var parentId = req.body.parentId;
  var productCode = req.body.infowin.productCode;

  var options = {};
  if (productCode) {    
    options.productCode = productCode;
    delete req.body.infowin['productCode'];
  }

  var infowin = new Infowin(req.body.infowin);
  
  infowin.view.screenshot = processScreenshot(null, infowin);

  if (parentType === 'world') {
    World.findById(parentId, function(err, w) {
      if (err) return utils.responses(res, 500, err);
      if (!w) return utils.responses(res, 404, { message: "World not found"});

      options.worldId = w._id;
      addInfowinToParent(w, infowin, options, res);
    });
  } else if (parentType === 'infowin') {
    Infowin.findById(parentId, function(err, parentInfowin) {
      if (err) return utils.responses(res, 500, err);
      if (!parentInfowin) return utils.responses(res, 404, { message: "Parent infowin not found"});

      options.worldId = parentInfowin.world;
      addInfowinToParent(parentInfowin, infowin, options, res);
    });
  }
};

/**
 * @api {put} /api/infowins Update an infowin
 * @apiName UpdateInfowin
 * @apiGroup Infowin
 *
 * @apiParam {Object} infowin New infowin data including _id
 *
 */
exports.update = function (req, res, next) {
  var infowin = req.body.infowin;
  var productCode = req.body.infowin.productCode;

  var asyncPool = [];

  asyncPool.push(function(callback) {
    Infowin.findById(infowin._id, function(err, existingInfowin) {
      if (err) callback(err);
      else if (!existingInfowin) callback({status: 404, message: 'Infowin not found. Not saving anything.'});
      else callback(null, existingInfowin);
    });
  });

  asyncPool.push(function(existingInfowin, callback) {
    if (infowin.view && infowin.view.screenshot) {
      infowin.view.screenshot = processScreenshot(existingInfowin.view, infowin);
    }

    if (productCode)
      delete infowin['productCode'];
    existingInfowin = Object.assign(existingInfowin, infowin);
    existingInfowin.markModified('view');

    existingInfowin.save(function (err, newInfowin) {
      if (err) callback(err);
      else callback(null, newInfowin);
    });
  });

  if (productCode) {
    asyncPool.push(function(newInfowin, callback) {
      Scorm.getSingleton(function(err, scorm) {
        if (err) callback(err);
        else {
          var productCodeOld = _.findKey(scorm.productsMap, (m) => m.toString()==newInfowin._id);
          if (productCodeOld) {
            scorm.productsMap[productCodeOld] = "";
          }
          scorm.productsMap[productCode] = newInfowin._id;

          scorm.markModified('productsMap');
          scorm.save(function(err, scorm) {
            if (err) callback(err);
            else callback(null, newInfowin);
          });
        }
      });
    });
  }

  async.waterfall(asyncPool, function(err, newInfowin){
    if (err)
      return utils.responses(res, err.status || 500, err.message || err);

    return utils.responses(res, 200, newInfowin);
  });
};

/* *******  */

function removeInfowin (parent, infowinId, res) {
  var asyncPool = [];

  asyncPool.push(function(callback) {
    Infowin.findById(infowinId, function(err, existingInfowin) {
      if (err) callback(err);
      else if (!existingInfowin) callback({status: 404, message: 'Infowin not found. Not removing anything.'});
      else callback(null, existingInfowin);
    });
  });

  asyncPool.push(function(existingInfowin, callback) {
    processScreenshot(existingInfowin.view, null);
    existingInfowin.remove().then(() => callback(), (err) => callback(err));
  });

  asyncPool.push(function(callback){
    _.remove(parent.infowins, function(infowinIterator) {
      return (infowinIterator === infowinId);
    });

    parent.save(function(err) {
      if (err) callback(err);
      else callback();
    });
  });

  asyncPool.push(function(callback){
    Scorm.getSingleton(function(err, scorm) {
      if (err) callback(err);
      else {
        var productCode = _.findKey(scorm.productsMap, (m) => m.toString()==infowinId);
        if (productCode) {
          scorm.productsMap[productCode] = "";
          scorm.markModified('productsMap');
          scorm.save(function(err, scorm) {
            if (err) callback(err);
            else callback();
          });
        } else {
          callback();
        }
      }
    });
  });

  return async.waterfall(asyncPool, function(err, result){
    if (err)
      return utils.responses(res, 500, err);

    return utils.responses(res, 204, { message: "Removed" });
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
  } else {
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
    return utils.responses(res, 200, vw );
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
        vw.sort(orderBySortPos);
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


exports.moveToParentId  = function (req, res, next) {

  var infowinId = String(req.body.infowinId); 
  var oldParentId = String(req.body.oldParentId); 
  var newParentId = String(req.body.newParentId); 
  var newParentType = String(req.body.newParentType); 

  var asyncPool = [];


  //Find the OLD parent and delete the children ref.
  asyncPool.push(function(callback) {
    var _id = infowinId.replace("'", "");
    Infowin.findById(oldParentId, function(err, existingOldParentInfowin) {
      if (err) callback(err);
      if (!existingOldParentInfowin) callback({status: 404, message: 'Old Infowin Parent not found. Not saving anything.'});

      finalInfowins = _.clone(existingOldParentInfowin.infowins);
      _.remove(finalInfowins, function(infowinIterator) {
        return (infowinIterator == _id);
      });

      existingOldParentInfowin.infowins = finalInfowins;
      existingOldParentInfowin.markModified('infowins');

      existingOldParentInfowin.save(function(err, infowinSaved){
        if (err) { callback(err); }
        else {
          callback(null, infowinSaved);
        }
      });

    });    
  });  

  //Find the NEW parent and add the children ref.
  asyncPool.push(function(oldPar, callback) {
    Infowin.findById(newParentId, function(err, existingInfowin) {
      if (err) callback(err);
      if (!existingInfowin) callback({status: 404, message: 'New Infowin Parent not found. Not saving anything.'});

      if (!existingInfowin.infowins) { existingInfowin.infowins = []; }
      existingInfowin.infowins.push(infowinId);

      existingInfowin.save(function(err, infowinSaved){
        if (err) { callback(err); }
        else {
          callback(null, infowinSaved);
        }
      });

    });    
  });


  //Update the parentId and Type of target Infowin
  asyncPool.push(function(newParInfowin, callback) {
    Infowin.findById(infowinId, function(err, existingInfowin) {
      if (err) callback(err);
      if (!existingInfowin) callback({status: 404, message: 'Target Infowin not found. Not saving anything.'});

      existingInfowin.parentId = newParInfowin._id;
      existingInfowin.newParentType = newParentType;

      existingInfowin.save(function(err, infowinSaved){
        if (err) { callback(err); }
        else {
          callback(null, infowinSaved);
        }
      });

    });
  });


  return async.waterfall(asyncPool, function(err, newInfowin){
    if (err)
      return utils.responses(res, 500, err);

    return utils.responses(res, 200, newInfowin);
  });


};
