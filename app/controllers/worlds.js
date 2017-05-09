"use strict";

var fs = require('fs');
var async = require('async');
var mongoose = require('mongoose');
var World = mongoose.model('World');
var Progress = mongoose.model('Progress');
var Scorm = mongoose.model('Scorm');
var async = require('async');
var config = require('../config/config');
var utility = require('utility');
var errorHelper = require(config.root + '/helper/errors');
var dataHelper = require('../helper/data-helper');
var _ = require('lodash');

exports.list  = function (req, res, next) {
  if (!req.user.agreed_to_terms) {
    res.redirect("/useofterms")
  }
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

function extractInfowinsTree(fromInfowin, toInfowin, world) {
  var infowinsTree = dataHelper.createInfowinTree(world);
  let startIndex = _.findIndex(infowinsTree, (obj) => obj._id == fromInfowin);
  let endIndex = _.findIndex(infowinsTree, (obj) => obj._id == toInfowin);

  if (fromInfowin == null && toInfowin == null)
    return infowinsTree;

  if (startIndex == -1 || endIndex == -1)
    return null;
  else
    return infowinsTree.slice(startIndex, endIndex+1);
}

exports.report = function (req, res, next) {
  var fromInfowin = req.query.from;
  var toInfowin = req.query.to;
  var worldSlug = req.params.world;

  World.loadBySlug(worldSlug, function(err, w){
    if (err || !w) {
      res.render('404', {url: req.url, error: 'World Not Found'});
    } else {
      var infowinsTree = extractInfowinsTree(fromInfowin, toInfowin, w);
      if (fromInfowin && toInfowin) {
        if (infowinsTree)
          res.render('report/result', {
            infowinsTree: infowinsTree
          });
        else
          res.render('404', {url: req.url, error: 'Infowins Not Found'});
      } else {
        res.render('report/range', {
          infowinsTree: _.map(infowinsTree, function(g) { return {title: "-".repeat(g.depth) + g.title, id: g._id} }),
          url: '/worlds/' + worldSlug + '/report'
        });
      }
    }
  });
}

exports.viewer = function (req, res, next) {
//Create a window.config variable for the app
  var worldSlug = req.params.world;
  var userId = req.user._id;
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

  function readProgress(worldId, callback) {
    Progress.findOne({world: worldId, user: userId}).then((progress) => {
      if (progress) {
        jsonConfig["progress"] = progress.statusMap;
        callback(null);
      } else {
        let newProgress = new Progress({
          world: worldId,
          user: userId,
          statusMap: {initiated: true}
        });

        newProgress.save().then((rs) => {
          jsonConfig["progress"] = rs.statusMap;
          callback(null);  
        }, (err) => {
          console.log(err); callback(err);
        });        
      }      
    }, (err) => {
      console.log(err); callback(err);
    })
  }

  function readScormData(callback) {
    Scorm.getSingleton(function(err, scorm) {
      if (!err)
        jsonConfig["scormData"] = scorm;
      callback(null);
    });
  }

  function readAllJsons(callback) {
    async.waterfall([
        function(cb) {
          World.loadBySlug(worldSlug, function(err, w) {
            if (err) { console.error(err); cb(); return; }
            jsonConfig["mainScene"] = w.modelInfo;
            jsonConfig["mainScene"].worldId = w._id;
            jsonConfig["groupsMap"] = w.groupsMap;
            jsonConfig["infowins"] = w.infowins;
            jsonConfig["objectsMap"] = w.objectsMap;

            if (req.user.sco_info) {
              jsonConfig["scoInfowinID"] = req.user.sco_info.infowinID;
            }
            //cb();
            cb(null, w._id);
          });
        },
        readProgress,
        readScormData,
        function(cb) {
          async.each(
            ['lights', 'materialsFix', 'deviceMakesAndModels', 'deviceScreens'],
            function(filename, cb) { readJson(filename, cb); },
            function(err) {
              if (err) { console.error('Error reading JSONs'); }
              cb()
            }
          );
        }
      ],
      function(err, result) {
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
