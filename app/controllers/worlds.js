"use strict";

var fs = require('fs');
var async = require('async');
var mongoose = require('mongoose');
var World = mongoose.model('World');
var async = require('async');
var config = require('../config/config');
var utility = require('utility');
var errorHelper = require(config.root + '/helper/errors');
var dataHelper = require('../helper/data-helper');

exports.list  = function (req, res, next) {
  World.list({},
    function(err, worlds) {
      if (err) { console.error(err); }
      res.render('home/index', {
        title: 'Select world',
        worldsList: worlds
      });
    }
  );
};

exports.viewer = function (req, res, next) {
  //Create a window.config variable for the app
  var worldSlug = req.params.world;
  var jsonConfig = {};

  function readJson(filename, cb) {
    var fn = filename,
      vrnm = filename;

    if (Array.isArray(filename) && filename.length === 2) {
      fn = filename[0];
      vrnm = filename[1];
    }

    fs.readFile('public/JSONs/' + fn + '.json', 'utf8', function(err, content) {
      if (!err) {
        jsonConfig[vrnm] = JSON.parse(content);
      }
      cb(err);
    });
  }

  function readAllJsons(callback) {
    async.parallel([
        function(cb) {
          World.loadBySlug(worldSlug, function(err, w) {
            jsonConfig["mainScene"] = w.modelInfo;
            jsonConfig["mainScene"].worldId = w._id;
            jsonConfig["gearMap"] = w.gearMap;
            jsonConfig["viewsSets"] = w.viewsSets;
            jsonConfig["infowins"] = w.infowins;
            jsonConfig["gearList"] = dataHelper.createGearList(w);
            cb();
          });
        },
        function(cb) {
          async.each(
            ['lights', 'materialsFix', 'deviceMakesAndModels'],
            function(filename, cb) { readJson(filename, cb); },
            function(err) {
              if (err) { console.error('Error reading JSONs'); }
              cb()
            }
          );
        }
      ],
      function(err, results) {
        callback(jsonConfig);
      });
  }

  readAllJsons(function(jsonConfig) {
    //Render
    res.render('worlds/view', {
      title: 'opXL 3D World Viewer',
      jsonConfig: JSON.stringify(jsonConfig)
    });
  });

}