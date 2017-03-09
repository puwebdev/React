"use strict";

var fs = require('fs');
var async = require('async');
var mongoose = require('mongoose');
var World = mongoose.model('World');
var async = require('async');
var config = require('../config/config');
var utility = require('utility');
var errorHelper = require(config.root + '/helper/errors');
/**
 * Show launch form
 */

exports.launch = function (req, res) {
	res.render('launch/viewer', {
	  title: 'SCO Launch',
	  message: req.flash('error')
	})
}