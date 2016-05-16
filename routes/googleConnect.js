var express = require('express');
var router = express.Router();
var passport = require('passport');
var expressJWT = require('express-jwt');

var User = require('../UserModel');

var GoogleStrategy = require('passport-google-oauth20').Strategy;

var auth = expressJWT({secret: 'SECRET'});

passport.use('connectGooglePlus', new GoogleStrategy({
    clientID: '32469330108-8l4cgdbcoiasbbk93mu47mlvham2919h.apps.googleusercontent.com',
    clientSecret: 'h15c3eacLx3Lfg5PR4ouOgbK',
    callbackURL: "http://localhost:8080/user/connectGooglePlus/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
    
    return cb(null, profile);
  }
));

router.get('/', passport.authenticate('connectGooglePlus', { scope: ['profile'] }))

router.get('/callback', 
  passport.authenticate('connectGooglePlus', {
    successRedirect : 'googlePlusConnectSuccess',
    failureRedirect : 'googlePlusConnectFailure'
  }));

router.get('/googlePlusConnectSuccess', function(req, res){
  User.findOne({googlePlusId: req.user.id}, function(err, user){
    if (!user) {
      res.redirect('http://localhost:8080/#/dashboard/settings?googlePlusId=' + req.user.id);
    } else {
      res.redirect('http://localhost:8080/#/dashboard/settings?auth=success&&type=googlePlus');
    }
  });
});

router.get('/googlePlusConnectFailure', function(req, res){
  res.redirect('http://localhost:8080/#/dashboard/settings?auth=failed&&type=googlePlus');
});

router.put('/setGooglePlusId/:id', auth, function(req, res){
  User.findById(req.params.id, function(err, user){
    user.googlePlusId = req.body.googlePlusId;
    user.save(function(err, user){
      res.send(user);
    })
  })
});


module.exports = router;