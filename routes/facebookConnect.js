var express = require('express');
var router = express.Router();
var passport = require('passport');
var expressJWT = require('express-jwt');

var User = require('../UserModel');
var facebookCred = require('../FacebookCredentials');

var FacebookStrategy = require('passport-facebook').Strategy;

var auth = expressJWT({secret: 'SECRET'});

if(process.env.PORT){
  var url = 'https://whispering-journey-30135.herokuapp.com';
}else {
  var url = 'http://localhost:8080';
}

passport.use('connectFacebook', new FacebookStrategy({
  clientID: facebookCred.clientID,
  clientSecret: facebookCred.clientSecret,
  callbackURL: url + "/user/connectFacebook/callback",
  profileFields: ['id']
},
function(accessToken, refreshToken, profile, done){

  return done(null, profile);
}
));

router.get('/', passport.authenticate('connectFacebook'));

router.get('/callback',
  passport.authenticate('connectFacebook', {
    successRedirect : 'FacebookConnectionSuccess',
    failureRedirect : 'FacebookConnectionFailure'
  }));

router.get('/FacebookConnectionSuccess', function(req, res){
  User.findOne({facebookId: req.user.id}, function(err, user){
    if (!user) {
      res.redirect(url + '/#/dashboard/settings?facebookId=' + req.user.id);
    } else {
      res.redirect(url + '/#/dashboard/settings?auth=success&&type=facebook');
    }
  });
  
});

router.get('/FacebookConnectionFailure', function(req, res){
  res.redirect(url + '/#/dashboard/settings?auth=failed&&type=facebook');
});

router.put('/setFacebookId/:id', auth, function(req, res){
  User.findById(req.params.id, function(err, user){
    user.facebookId = req.body.facebookId;
    user.save(function(err, user){
      res.send(user);
    });
  });
});

module.exports = router;