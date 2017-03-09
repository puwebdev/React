// DEPRECATED *******************
// DEPRECATED *******************
// DEPRECATED *******************
// DEPRECATED *******************
// DEPRECATED *******************
// DEPRECATED *******************


var fs = require("fs");
var slug = require("slug");
var async    = require('async');
var mongoose = require('mongoose');
var User     = mongoose.model('User');
var config = require('../../config/config');
var utils = require(config.root + '/helper/utils');
var imagePath = "./public/system/images/screenshots/";

exports.respondGet = function (req, res, next) {
  res.setHeader("Content-Type", "application/json");
  res.json({status: "get-disallowed" });
};

exports.saveScreenshots = function (req, res, next) {
var j, lenJ, jsonReq, obj,
    img, ext, data, buf,
    title, responseBody = [],
    viewsJson,
    jsonFilename = 'public/JSONs/views.json';

  res.setHeader("Content-Type", "application/json");
  
  //Receives a JSON array of objects { title, position, prevImage, newImage }
  jsonReq = req.body;
  if (!Array.isArray(jsonReq)) { res.json({status: "error, invalid input"}); }

  //read json file
  viewsJson = JSON.parse(fs.readFileSync(jsonFilename, 'utf8'));

  //Iterate the views
  for (j = 0, lenJ = jsonReq.length; j < lenJ; j += 1) {
    obj = jsonReq[j];
    if (!obj.title || !obj.newImage) { continue; }

    //New Image
    img = obj.newImage;
    data = img.split(",")[1];

    //Create a name
    title = slug(obj.title + "-" + obj.position + "-" +
      new Date().toISOString().replace(/T/, "-").replace(/:/, "-").replace(/\..+/, "")) + ".png";

    //Save the image to disk
    fs.writeFile(imagePath + title, data, 'base64');
    responseBody.push({title: obj.title, position: obj.position, newImage: title});

    //Delete the previous screenshot (house-keeping)
    if (obj.prevImage) { fs.unlink(imagePath + obj.prevImage); }

    viewsJson[obj.position].screenshot = title;
  }

  fs.writeFile(jsonFilename, JSON.stringify(viewsJson, null, 4), function(err) {
    if(err) {
      console.log(err);
      res.json({status: "error", error: err});
    } else {
      console.log("JSON saved to " + jsonFilename);
      res.json({status: "ok", screenshots: responseBody});
    }
  }); 
  
};

