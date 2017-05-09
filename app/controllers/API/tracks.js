var config = require('../../config/config');
var mongoose = require('mongoose');
var Track = mongoose.model('Track');
var Progress = mongoose.model('Progress');
var utils = require(config.root + '/helper/utils');
var request = require('request');
var fs = require('fs');
var _ = require('lodash');

exports.create = function (req, res, next) {
  if (req.user.sco_info)
    return utils.responses(res, 204, {});
  
  var user_id = req.user._id;
  var world_id = req.body.world;
  var track = new Track(_.merge(req.body.track, {user: user_id}));

  track.save(function (err, newTrack){
    if (err) return utils.responses(res, 500, err);
    let respBody = {track: newTrack};

    // if (newTrack.target_type == 'Infowin' && world_id) {
    //   Progress.findOne({user: user_id, world: world_id}, function(err, progress){
    //     if (!err && progress) _.merge(respBody, {statusMap: progress.statusMap});
    //     return utils.responses(res, 200, respBody);
    //   });
    // } else {
    //   return utils.responses(res, 200, respBody);
    // }
    return utils.responses(res, 200, respBody); // temporary
  });
}