"use strict";

var mongoose = require('mongoose');
var User = mongoose.model('User');
var Scorm = mongoose.model('Scorm');
var async = require('async');
var config = require('../config/config');
var request = require('request');
var xml2js = require('xml2js');
var utils = require(config.root + '/helper/utils');
var _ = require('lodash');

exports.launch = function (req, res) {
	var productCode = req.params.productCode;
	var iMISID = req.params.iMISID;

	if (!productCode || !iMISID) {
		return res.render('403', {error: 'Invalid parameters provided.'});
	}

	var asyncPool = [];
	asyncPool.push(getAccessToken);
	asyncPool.push(async.apply(getProductList, iMISID));
	asyncPool.push(function(productList, callback) {
		var productCodes = _.map(productList, 'ProductCode');
		if (productCodes.indexOf(productCode) == -1) {
			callback({message: 'Cannot find the product.'});
		} else {
			callback(null);
		}
	});
	asyncPool.push(function(callback) {
		Scorm.getSingleton(function(err, scorm) {
			if (err) return callback(err);

			if (scorm.productsMap[productCode]) {
				callback(null, scorm.productsMap[productCode]);
			} else {
				callback({message: 'Cannot find a matching infowin for the product.'});
			}
		});
	});

	async.waterfall(asyncPool, function(err, infowinID) {
		if (err) {
			return res.render('403', {error: err.message || 'Database Error.'});
		} else {
			var guest = new User({
				username: 'LMS member',
				agreed_to_terms: true,
				sco_info: {
					iMISID: iMISID,
					productCode: productCode,
					infowinID: infowinID
				}
			});

			req.logIn(guest, function(err) {
			  if (err) {
			  	res.render('403', {error: 'Session cannot be created. Please try reloading the page.'});
			  } else {
			  	return res.redirect('/worlds/demo');
			  }
			});
		}
	});
}

function getAccessToken(callback) {
	var scteAPI = config.scte.API;
	request.post({
		url: scteAPI.urlToken,
		form: scteAPI.credentials
	}, function(err, httpResponse, body) {
		if (err || httpResponse.statusCode != 200) callback(err || {message: 'Error from Data API.'});
		else {
			body = JSON.parse(body);

			if (body.access_token) {
				callback(null, body.access_token);
			} else {				
				callback({message: "Cannot get a token."});
			}
		}
	});
}

function getProductList(iMISID, token, callback) {
	var scteAPI = config.scte.API;
	request.get({
		url: scteAPI.urlData.replace('XXXX', iMISID),
		headers: {
			Authorization: 'Bearer ' + token
		}
	}, function(err, httpResponse, body) {
		if (err || httpResponse.statusCode != 200) callback(err || {message: 'Error from Data API.'});
		else {
			callback(null, JSON.parse(body));
		}
	});
}