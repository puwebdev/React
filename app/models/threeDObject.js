"use strict";

var mongoose        = require('mongoose');
var Schema          = mongoose.Schema;
var CreateUpdatedAt = require('mongoose-timestamp');

var ThreeDObject = new Schema({
  name: {
    type: String,
    required: true
  }
});

ThreeDObject.plugin(CreateUpdatedAt);

module.exports = mongoose.model('ThreeDObject', ThreeDObject, 'threeDObjects');
