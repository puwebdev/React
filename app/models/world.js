"use strict";

var fs              = require('fs');
var path            = require('path');
var config          = require('../config/config');

var utils           = require(config.root + '/helper/utils');
var crypto          = require('crypto');
var request         = require('request');
var mkdirp          = require('mkdirp');

var mongoose        = require('mongoose');
var Schema          = mongoose.Schema;
var CreateUpdatedAt = require('mongoose-timestamp');
var slug            = require('mongoose-slug');

var deepPopulate    = require('mongoose-deep-populate')(mongoose);

var World = new Schema({
    title: {
      type: String,
      required: true,
      index : {
        unique: true
      }
    },
    tags: [
      {
        type: String
      }
    ],
    description: {
      type: String
    },
    is_active: {
      type: Boolean,
      default: true
    },
    modelInfo: Schema.Types.Mixed,
    gearMap: Schema.Types.Mixed,
    infowins: [{ type: Schema.Types.ObjectId, ref: 'Infowin' }],
    viewsSets: [{ type: Schema.Types.ObjectId, ref: 'ViewsSet' }]
});

World.plugin(slug('title'));
World.plugin(CreateUpdatedAt);
World.plugin(deepPopulate);

World.statics = {
  /**
   * Find article by id
   *
   * @param {ObjectId} id
   * @param {Function} cb
   * @api private
   */

  load: function (id, cb) {
    this.findById(id)
      .populate({
        path: 'infowins',
        populate: { path: 'view' }
      })
      .populate({
        path: 'viewsSets',
        populate: { path: 'views' }
      })
      .populate('markers')  
      .exec(cb);
  },

  /**
   * Find article by id
   *
   * @param {String} slug
   * @param {Function} cb
   * @api private
   */

  loadBySlug: function (slug, cb) {
    this.findOne({ "slug" : slug })
      .populate({
        path: 'viewsSets',
        populate: { path: 'views' }
      })
      .populate('markers')  
      .deepPopulate(
        'infowins ' +
        'infowins.infowins ' +
        'infowins.infowins.infowins ' +
        'infowins.infowins.infowins.infowins ' +
        'infowins.infowins.infowins.infowins.infowins ' +
        'infowins.infowins.infowins.infowins.infowins.infowins ' +
        'infowins.infowins.infowins.infowins.infowins.infowins.infowins ' +
        'infowins.infowins.infowins.infowins.infowins.infowins.infowins.infowins ' +
        'infowins.markers' +
        'infowins.infowins.markers ' +
        'infowins.infowins.infowins.markers ' +
        'infowins.infowins.infowins.infowins.markers ' +
        'infowins.infowins.infowins.infowins.infowins.markers ' +
        'infowins.infowins.infowins.infowins.infowins.infowins.markers ' +
        'infowins.infowins.infowins.infowins.infowins.infowins.infowins.markers ' +
        'infowins.infowins.infowins.infowins.infowins.infowins.infowins.infowins.markers ' +
        'infowins.view' +
        'infowins.infowins.view ' +
        'infowins.infowins.infowins.view ' +
        'infowins.infowins.infowins.infowins.view ' +
        'infowins.infowins.infowins.infowins.infowins.view ' +
        'infowins.infowins.infowins.infowins.infowins.infowins.view ' +
        'infowins.infowins.infowins.infowins.infowins.infowins.infowins.view ' +
        'infowins.infowins.infowins.infowins.infowins.infowins.infowins.infowins.view ')
      .exec(cb);
      //Hard-coded level: 8. This is a temporary solution, we need to have them as Objects, not as Refs.
  },
 

  /**
   * List articles
   *
   * @param {Object} options
   * @param {Function} cb
   * @api private
   */

  list: function (options, cb) {
    var criteria = options.criteria || {}

    this.find(criteria)
      .populate({
        path: 'infowins',
        populate: { path: 'view' }
      })
      .populate({
        path: 'viewsSets',
        populate: { path: 'views' }
      })
      .populate('markers')      
      .sort({'slug': 1}) 
      .exec(cb);
  }
};

module.exports = mongoose.model('World', World)
