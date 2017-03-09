"use strict";

var mongoose        = require('mongoose');
var Schema          = mongoose.Schema;
var CreateUpdatedAt = require('mongoose-timestamp');
var slug            = require('mongoose-slug');

var Vector3 = require('../models/vector3');

var Marker = new Schema({
    title: {
      type: String,
      required: true
    },
    letter: String, // Letter on marker. 
    direction: Number, // Arrow direction. 
    feedbackHtml: String, // Html of marker. 
    faIcon: String, // FontAwesome fa-class, adds an Icon to layover.
    dismissText: String, //  Text of dismiss button (for instance "Close" or "Got it!")
    optionsOnShowFeedback: String, // Stringified object with options (event emitter markerOnShowFeedback)
    optionsOnDismissFeedback: String, // Stringified object with options (event emitter markerOnDismissFeedback)
    toNext: Boolean, // Boolean passed in markerOnShowFeedback & markerOnDismissFeedback
    position: Vector3 //3D position of marker
});

Marker.plugin(CreateUpdatedAt);
Marker.plugin(slug('title'));

module.exports = mongoose.model('Marker', Marker);
