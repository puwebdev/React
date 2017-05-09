var mongoose         = require('mongoose')
var LocalStrategy    = require('passport-local').Strategy
var User             = mongoose.model('User')

module.exports = function (app, passport) {

  // serialize sessions
  passport.serializeUser(function(user, done) {
    if (user.sco_info) {
      done(null, user);
    } else {
      done(null, user.id);
    }
  })

  passport.deserializeUser(function(key, done) {
    if (key.sco_info) {
      key.roleAdmin = function() {return 1;};
      key.gravatar = function(size) {
        if (!size) size = 200;
        return 'https://gravatar.com/avatar/?s=' + size + '&d=retro';
      };
      done(null, key);
    } else {
      User.findOne({ _id: key }, function (err, user) {
        done(err, user)
      });
    } 
  })

  // use local strategy
  passport.use(new LocalStrategy({
      usernameField: 'email',
      passwordField: 'password'
    },
    function(email, password, done) {

      User.findOne( { email: email } , function (err, user) {

        if (err) {
          return done(err)
        }

        if (!user) {
          return done(null, false, { message: 'Your email not register' })
        }

        if (!user.authenticate(password)) {
          return done(null, false, { message: 'invalid login or password' })
        }

        return done(null, user)
      })
    }
  ))

}
