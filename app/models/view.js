"use strict";

var mongoose        = require('mongoose');
var Schema          = mongoose.Schema;
var CreateUpdatedAt = require('mongoose-timestamp');

var Vector3 = require('../models/vector3');

var View = new Schema({
    title: {
      type: String,
      required: true
    },
    description: String,
    html: String,
    selected: String,
    highlighted: String,
    doubleclick: String,
    screenshot: String,
    keyCode: Number,
    sortPos: Number,
    cameraPosition: Vector3,
    targetPosition: Vector3,
    name: String,
    world: { type: Schema.Types.ObjectId, ref: 'World' },
    threeDObjects: [{
        visible: Boolean,
        flashed: Boolean,
        highlighted: Boolean,
        source: String
    }]
});

View.plugin(CreateUpdatedAt);

module.exports = mongoose.model('View', View);
