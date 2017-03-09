var config = require('../../config/config');
var mongoose = require('mongoose');
var ThreeDObject = mongoose.model('ThreeDObject');
var utils = require(config.root + '/helper/utils');

/**
 * @api {get} /api/threeDObjects Get all 3d objects
 * @apiName GetAllThreeDObjects
 * @apiGroup ThreeDObject
 *
 */
exports.getAll = function(req, res, next) {
  return ThreeDObject.find({}, function(err, threeDObjects) {
    if (err) return utils.responses(res, 500, err);
    if (!threeDObjects) return utils.responses(res, 404, { message: "ThreeDObjects not found"});

    return utils.responses(res, 200, threeDObjects);
  });
};
