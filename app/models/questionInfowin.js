"use strict";

var mongoose        = require('mongoose');
var Schema          = mongoose.Schema;
var CreateUpdatedAt = require('mongoose-timestamp');

var QuestionInfowin = new Schema({
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    }, 
    type: String,
    answer1: String,
    fraction1: Number,
    feedback1: String,
    answer2: String,
    fraction2: Number,
    feedback2: String,
    answer3: String,
    fraction3: Number,
    feedback3: String,
    answer4: String,
    fraction4: Number,
    feedback4: String,
    answer5: String,
    fraction5: Number,
    feedback5: String,

    view: { type: Schema.Types.ObjectId, ref: 'View' }
});

QuestionInfowin.plugin(CreateUpdatedAt);

module.exports = mongoose.model('QuestionInfowin', QuestionInfowin);

