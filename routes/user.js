var express = require('express');
var router = express.Router();
var passport = require('passport');
var expressJWT = require('express-jwt');

var LocalStrategy = require('passport-local').Strategy;

var User = require('../UserModel');
var Post = require('../PostModel');
var facebookConnectRoutes = require('./facebookConnect');
var facebookLoginRoutes = require('./facebookLogin');
var googlePlusConnectRoutes = require('./googleConnect');
var googlePlusLoginRoutes = require('./googleLogin');

var auth = expressJWT({secret: 'SECRET'});

router.use('/connectFacebook', facebookConnectRoutes);
router.use('/loginFacebook', facebookLoginRoutes);
router.use('/connectGooglePlus', googlePlusConnectRoutes);
router.use('/loginGooglePlus', googlePlusLoginRoutes);

router.get('/getPosts/:id', function(req, res){
  Post.find({poster: req.params.id}, function(err, posts){
    res.send(posts);
  })
});

router.put('/changeProfilePicture/:id', auth, function(req, res){
  User.findById(req.params.id, function(err, user){
    user.profileImg = req.body.url;
    user.save(function(err, user){
      return res.json({token: user.generateJWT()});
    });
  });
});

router.put('/changeEmail/:id', auth, function(req, res){
  User.findById(req.params.id, function(err, user){
    user.email = req.body.email;
    user.save(function(err, user){
      return res.json({token: user.generateJWT()});
    });
  });
});

router.put('/changePassword/:id', auth, function(req, res){
  User.findById(req.params.id, function(err, user){
    if (!(user.validPassword(req.body.oldPass))) {
      res.status(322)
      return res.send('Incorrect Old Password')
    }else{
      user.setPassword(req.body.newPass);
      user.save(function(err, user){
        return res.send('Password was succesfully changed');
      });
    }  
  });
});

router.post('/register', function(req,res){
  User.findOne({username: req.body.username}, function(err, user){
    if (err) { return done(err); }

      if (!user) {
        var user = new User();

        user.username = req.body.username;
        user.email = req.body.email;
        user.profileImg = 'http://cdn.patch.com/assets/contrib/images/placeholder-user-photo.png'
        user.setPassword(req.body.password);

        user.save(function (err){
          if(err){ return next(err); }

          return res.json({token: user.generateJWT()});
        })
      }else{
        res.status(321);
        return res.send('Username already in use.');
      }
  })
});

passport.use('login', new LocalStrategy(function(username, password, done) {
    User.findOne({ username: username }, function (err, user) {
      if (err) { return done(err); }

      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (!(user.validPassword(password))) {
        return done(null, false, { message: 'Incorrect password.' });
      }

      return done(null, user);
    });
  }
));

router.post('/login', function(req,res,next){
  passport.authenticate('login', function(err, user){
    if(err){ return next(err); }

    if (user) {
      return res.json({token: user.generateJWT()});
    } else {
      return res.status(401);
    }
  })(req, res, next);
});

module.exports = router;