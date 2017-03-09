var config = require('../../config/config');
var mongoose = require('mongoose');
var Infowin = mongoose.model('Infowin');
var World = mongoose.model('World');
var utils = require(config.root + '/helper/utils');
var screenshots = require('../../helper/screenshots');
var crypto = require('crypto');
var request = require('request');
var fs = require('fs');
var async = require('async');
var _ = require('lodash');

const orderByTitle = (a, b) => {
  return String(a.title || "").toLowerCase() >= String(b.title || "").toLowerCase() ? 1 : -1;
}

/**
 * Get a SINGLE QUESTION
 * GET : '/api/questions/:questionId'
 */
exports.read = function(req, res, next) {
  var questionId = req.params.id;
  console.log("qId:", questionId);
  Infowin
    .findById(questionId)
    .populate('questions')
    .exec(function(err, foundQuestion) {
      console.log("read:", foundQuestion);
      if (err) return utils.responses(res, 500, err);
      if (!foundQuestion) return utils.responses(res, 404, { message: "Question info window not found"});
      return utils.responses(res, 200, foundQuestion);
  });
};

function addInfowinToParent (parent, questionInfowin, res) {
  if (!parent.infowins) { parent.infowins = []; }
  parent.infowins.push(questionInfowin._id);

  return parent.save(function (err) {
    if (err) return utils.responses(res, 500, err);
    return utils.responses(res, 200, questionInfowin);
  });
}

/**
 * Create a New Question
 * POST : '/api/questions'
 */
exports.create = function (req, res, next) {
  var parentType = req.body.parentType;
  var parentId = req.body.parentId;
  var questionInfowin = new Infowin(req.body.question);

  questionInfowin.save(function (err, newQuestion) {    
    if (err) return utils.responses(res, 500, err);
    if (parentType === 'world') {
      World.load(parentId, function(err, w) {
        if (err) return utils.responses(res, 500, err);
        if (!w) return utils.responses(res, 404, { message: "World not found"});

        addInfowinToParent(w, newQuestion, res);
      });
    } else if (parentType === 'infowin') {
      console.log("parentId:", parentId);
      Infowin.findById(parentId, function(err, parentInfowin) {
        console.log("parentInfowin:", parentInfowin);
        console.log("err:", err);
        if (err) return utils.responses(res, 500, err);
        if (!parentInfowin) return utils.responses(res, 404, { message: "Parent infowin not found"});

        addInfowinToParent(parentInfowin, newQuestion, res);
      });
    }
  });
};

/**
 * Modify a Question
 * PUT : '/api/questions'
 */
exports.update = function (req, res, next) {
  var question = req.body.question;

  //if (question.name) { question.name = infowin.name.trim(); }

  //Fetch from Mongo
  Infowin.findById(question._id, function(err, existingQuestion) {
    if (err) return utils.responses(res, 500, err);
    if (!existingQuestion) return utils.responses(res, 404, { message: "Question info window not found. Not saving anything."});

    _.merge(existingQuestion, infowin);
    existingQuestion.save(function (err, newQuestion) {
      if (err) return utils.responses(res, 500, err);
      return utils.responses(res, 200, newQuestion);
    });
  });
};

function removeQuestion (parent, questionId, res) {
  Infowin.findById(questionId, function(err, existingQuestion) {
   
    if (err) return utils.responses(res, 500, err);
    if (!existingInfowin) return utils.responses(res, 404, { message: "Question info window not found"});

    screenshots.deleteScreenshotFile(existingInfowin.screenshot);
    existingInfowin.remove();

    _.remove(parent.infowins, function(infowinIterator) {
      return (infowinIterator === infowinId);
    });

    parent.save(function(err) {
      if (err) return utils.responses(res, 500, err);
      return utils.responses(res, 200, null );
    });
  });
}

/**
 * Delete Question
 * DELETE : '/api/questions'
 */
exports.delete = function (req, res, next) {
  var parentType = req.body.parentType;
  var parentId = req.body.parentId;
  var questionId = req.body.questionId;

  if (parentType === 'world') {
    World.load(parentId, function(err, w) {
      if (err) return utils.responses(res, 500, err);
      if (!w) return utils.responses(res, 404, { message: "World not found"});

      removeQuestion(w, questionId, res);
    });
  } else if (parentType === 'infowin') {
    Infowin.findById(parentId, function(err, parentInfowin) {
      if (err) return utils.responses(res, 500, err);
      if (!parentInfowin) return utils.responses(res, 404, { message: "Parent Infowin not found"});

      removeQuestion(parentInfowin, questionId, res);
    });
  }
}