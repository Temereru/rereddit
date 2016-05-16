var express = require('express');
var router = express.Router();
var passport = require('passport');

var User = require('../UserModel');

var GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use('loginGooglePlus',new GoogleStrategy({
    clientID: '32469330108-8l4cgdbcoiasbbk93mu47mlvham2919h.apps.googleusercontent.com',
    clientSecret: 'h15c3eacLx3Lfg5PR4ouOgbK',
    callbackURL: "http://localhost:8080/user/loginGooglePlus/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
    
    return cb(null, profile);
  }
));

router.get('/', passport.authenticate('loginGooglePlus', { scope: ['profile'] }))

router.get('/callback', 
  passport.authenticate('loginGooglePlus', {
    successRedirect : 'googlePlusLoginSuccess',
    failureRedirect : 'googlePlusLoginFailure'
  }));

router.get('/googlePlusLoginSuccess', function(req, res){
  res.redirect('http://localhost:8080/#/login?googlePlusId=' + req.user.id);
});

router.get('/googlePlusLoginFailure', function(req, res){
  res.redirect('http://localhost:8080/#/login?auth=failure&&type=googlePlus');
});

router.get('/loginGooglePlusId/:id', function(req, res){
  User.findOne({googlePlusId: req.params.id}, function(err, user){
    if (user) {
      res.json({token: user.generateJWT()});
    } else {
      res.status(351);
      res.end();
    }
  })
});

module.exports = router;