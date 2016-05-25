var express = require('express');
var router = express.Router();
var passport = require('passport');

var User = require('../UserModel');
var facebookCred = require('../FacebookCredentials');

var FacebookStrategy = require('passport-facebook').Strategy;

if(process.env.PORT){
  var url = 'https://whispering-journey-30135.herokuapp.com';
}else {
  var url = 'http://localhost:8080';
}

passport.use('loginFacebook',new FacebookStrategy({
  clientID: facebookCred.clientID,
  clientSecret: facebookCred.clientSecret,
  callbackURL: url + "/user/loginFacebook/callback",
  profileFields: ['id']
},
function(accessToken, refreshToken, profile, done){

  return done(null, profile);
}
));

router.get('/', passport.authenticate('loginFacebook'))

router.get('/callback', 
  passport.authenticate('loginFacebook', {
    successRedirect : 'FacebookLoginSuccess',
    failureRedirect : 'FacebookLoginFailure'
  }));

router.get('/FacebookLoginSuccess', function(req, res){
  res.redirect(url + '/#/login?facebookId=' + req.user.id);
});

router.get('/FacebookLoginFailure', function(req, res){
  res.redirect(url + '/#/login?auth=failure&&type=facebook');
});

router.get('/loginFacebookId/:id', function(req, res){
  User.findOne({facebookId: req.params.id}, function(err, user){
    if (user) {
      res.json({token: user.generateJWT()});
    } else {
      res.status(351);
      res.end();
    }
  });
});

module.exports = router;