var mongoose = require('mongoose');
var User     = mongoose.model('User');
var config = require('../../config/config');
var utils = require(config.root + '/helper/utils');
var _ = require('lodash');
var async    = require('async');

exports.get_profile = function (req, res, next) {

  var user_id = req.user._id

  User
    .findOne({_id: user_id}, function (err, user) {
      if (err) return utils.responses(res, 500, err)

      return utils.responses(res, 200, user)
    })
}

exports.update_profile = function (req, res, next) {
  
  var user_id = req.user._id;
  var user = req.body.user;

  User.findById(user_id, function(err, existingUser) {
    if (err) return utils.responses(res, 500, err);
    if (!existingUser) return utils.responses(res, 404, { message: "User not found. Not saving anything."});

    _.merge(existingUser, user);
    existingUser.save(function (err, newUser) {
      if (err) return utils.responses(res, 500, err);
      return utils.responses(res, 200, newUser);
    });
  });
}