var config = require('../../config/config');
var mongoose = require('mongoose');
var Scorm = mongoose.model('Scorm');
var utils = require(config.root + '/helper/utils');
var request = require('request');
var fs = require('fs');
var async = require('async');
var _ = require('lodash');

/**
 * Modify Scorm
 * PUT : '/api/scorm'
 */

 /*
  productsMap: {
    "BP0000XX": "",
    "BP1000XX": infowinId
  },
  productsMapDelKeys: ["BP0000XX", "BP0000XY"]
 */

exports.update = function(req, res, next) {
  var productsMapChanges = req.body.productsMap;
  var productsMapDelKeys = req.body.productsMapDelKeys;

  Scorm.getSingleton(function(err, scorm) {
    if (err) return utils.responses(res, 500, err);

    scorm.productsMap = _.merge(scorm.productsMap, productsMapChanges);
    for (var i in productsMapDelKeys) {
      var key = productsMapDelKeys[i];

      if (scorm.productsMap[key]) {
        delete scorm.productsMap[key];
      }
    }

    scorm.markModified('productsMap');
    scorm.save(function(err, new_scorm) {
      if (err) return utils.responses(res, 500, err);
      return utils.responses(res, 200, new_scorm);
    });
  });
}

exports.get = function(req, res, next) {
  Scorm.getSingleton(function(err, scorm) {
    if (err) return utils.responses(res, 500, err);

    return utils.responses(res, 200, scorm);
  })
}