"use strict";

var mongoose        = require('mongoose');
var Schema          = mongoose.Schema;
var CreateUpdatedAt = require('mongoose-timestamp');

var Infowin = new Schema({
    name: String,
    title: {
      type: String,
      required: true
    },
    description: String,
    html: String,
    type: String,
    thumbnail_src: String,
    sortPos: Number,
    
    qtype: String,
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

    world: { type: Schema.Types.ObjectId, ref: 'World' },
    infowins: [{ type: Schema.Types.ObjectId, ref: 'Infowin' }],
    view: { type: Schema.Types.ObjectId, ref: 'View' },
    
    markers: [{ type: Schema.Types.ObjectId, ref: 'Marker' }]
});

Infowin.plugin(CreateUpdatedAt);

module.exports = mongoose.model('Infowin', Infowin);

