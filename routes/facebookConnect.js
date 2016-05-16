var express = require('express');
var router = express.Router();
var passport = require('passport');
var expressJWT = require('express-jwt');

var User = require('../UserModel');

var FacebookStrategy = require('passport-facebook').Strategy;

var auth = expressJWT({secret: 'SECRET'});

passport.use('connectFacebook', new FacebookStrategy({
  clientID: '1127373727323306',
  clientSecret: 'cefd4bab46437e5a05816a1c3f92c798',
  callbackURL: "http://localhost:8080/user/connectFacebook/callback",
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
      res.redirect('http://localhost:8080/#/dashboard/settings?facebookId=' + req.user.id);
    } else {
      res.redirect('http://localhost:8080/#/dashboard/settings?auth=success&&type=facebook');
    }
  });
  
});

router.get('/FacebookConnectionFailure', function(req, res){
  res.redirect('http://localhost:8080/#/dashboard/settings?auth=failed&&type=facebook');
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