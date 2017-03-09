var express = require('express');
var Route = express.Router();
var config = require('../config/config');
var passport = require('passport');
var lodash = require('lodash')
var Auth = require(config.root + '/middleware/authorization');
var fs = require('fs');

var userController = require(config.root + '/controllers/users');
var worldsController = require(config.root + '/controllers/worlds');
var launchController = require(config.root + '/controllers/launch');

var API = {}
API.WorldData = require(config.root + '/controllers/API/worldData');
API.Views = require(config.root + '/controllers/API/views');
API.ViewsSets = require(config.root + '/controllers/API/viewsSets');
API.Infowins = require(config.root + '/controllers/API/infowins');
API.Markers = require(config.root + '/controllers/API/markers');
API.Questions = require(config.root + '/controllers/API/questions');
API.ThreeDObjects = require(config.root + '/controllers/API/threeDObjects');
API.Gearmap = require(config.root + '/controllers/API/gearmap');
API.Users = require(config.root + '/controllers/API/users');

// API Routes
Route
  .all('/api/*', Auth.APIrequiresUserLogin)

  .get('/api/worldData/:id', API.WorldData.read)

  .get('/api/views', API.Views.getAll)
  .get('/api/views/:id', API.Views.read)
  .post('/api/views', API.Views.create)
  .put('/api/views', API.Views.update)
  .delete('/api/views', API.Views.delete)  
  .post('/api/viewsOrder', API.Views.saveOrder)

  .get('/api/viewsSets', API.ViewsSets.getAll)
  .get('/api/viewsSets/:id', API.ViewsSets.read)
  .post('/api/viewsSets', API.ViewsSets.create)
  .put('/api/viewsSets', API.ViewsSets.update)
  .delete('/api/viewsSets', API.ViewsSets.delete)  
  .post('/api/viewsSetsOrder', API.ViewsSets.saveOrder)  
 
  .get('/api/infowins', API.Infowins.getAll)
  .get('/api/infowins/:id', API.Infowins.read)
  .get('/api/infowins/:id/populated', API.Infowins.readPopulated)
  .post('/api/infowins', API.Infowins.create)
  .post('/api/infowins/clone', API.Infowins.clone)
  .put('/api/infowins', API.Infowins.update)
  .delete('/api/infowins', API.Infowins.delete)
  .post('/api/infowinsOrder', API.Infowins.saveOrder)

  //.get('/api/markers', API.Markers.getAll)
  .get('/api/markers/:id', API.Markers.read)
  .post('/api/markers', API.Markers.create)
  .put('/api/markers', API.Markers.update)
  .delete('/api/markers', API.Markers.delete)

  .post('/api/questions', API.Questions.create)
  .get('/api/questions/:id', API.Questions.read)
  .put('/api/questions', API.Questions.update)
  .delete('/api/questions', API.Questions.delete)

  .get('/api/threeDObjects', API.ThreeDObjects.getAll)

  .get('/api/gearmap', API.Gearmap.getAll)
  .put('/api/gearmap', API.Gearmap.update)

  .get('/api/user/current', API.Users.get_profile)
  //.get('/api/saveScreenshots', API.Screenshots.respondGet)
  //.post('/api/saveScreenshots', API.Screenshots.saveScreenshots)

// Frontend routes
Route
  .get('/login', userController.login)
  .get('/signup', userController.signup)
  .get('/logout', userController.logout)
  .get('/forgot-password', userController.getForgotPassword)
  .post('/forgot-password',Auth.hasLogin, userController.postForgotPassword)
  .get('/reset/:token', Auth.hasLogin, userController.getResetPassword)
  .post('/reset/:token', Auth.hasLogin, userController.postResetPassword)
  .post('/users/create', userController.create)
  .get('/dashboard', Auth.requiresLogin, userController.show)
  .post('/users/session',
    passport.authenticate('local', {
    failureRedirect: '/login',
    failureFlash: true
  }), userController.session)
  .get('/user/:username', Auth.requiresLogin, userController.user_profile)
  .get('/', Auth.requiresLogin, worldsController.list)
  .get('/worlds/:world', Auth.requiresLogin, worldsController.viewer)
  .get('/launch/:product/:user/:sco/:mode', launchController.launch)

module.exports = Route
