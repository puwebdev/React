"use strict";

var mongoose        = require('mongoose');
var Schema          = mongoose.Schema;
var CreateUpdatedAt = require('mongoose-timestamp');

var ViewsSet = new Schema({
    title: {
      type: String,
      required: true
    },
    description: String,
    name: String,
    views: [{ type: Schema.Types.ObjectId, ref: 'View' }]
});

ViewsSet.plugin(CreateUpdatedAt);

ViewsSet.statics = {
  load: function (id, cb) {
    this.findById(id)
      .populate('views')
      .exec(cb);
  }
};

module.exports = mongoose.model('ViewsSet', ViewsSet, 'viewsSets');
