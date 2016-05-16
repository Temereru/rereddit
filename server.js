var express = require('express');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var passport = require('passport');
var expressJWT = require('express-jwt')
var expressSession = require('express-session');

var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;

var User = require('./UserModel');
var Post = require('./PostModel');
var Comment = require('./CommentModel');

mongoose.connect('mongodb://localhost/rereddit');

var auth = expressJWT({secret: 'SECRET'});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(express.static('node_modules'));
app.use(express.static('public'));

app.use(expressSession({ secret: 'mySecretKey' }));

app.use(passport.initialize());
app.use(passport.session());

// used to serialize the user for the session
passport.serializeUser(function(user, done) {
  done(null, user);
});

// used to deserialize the user
passport.deserializeUser(function(user, done) {
  done(null, user);
});

app.get('/posts', function(req, res){
  var postsQuery = Post.find();
  postsQuery.populate({path: 'poster', select: '-password -salt'});
  postsQuery.populate({path: 'comments', select:'-post', populate: {path: 'commenter', select: '-password -salt -comments'}});
  postsQuery.exec(function(err, posts){
    res.send(posts);
  })
})

app.post('/post', auth, function(req, res){
  var post = new Post();
  post.title = req.body.title;
  post.link = req.body.link;
  post.poster = req.body.user;
  post.upvotes = req.body.upvotes;
  post.comments = req.body.comments;

  post.save(function(err, post){
    var postQuery = Post.findById(post._id);
    postQuery.populate({path: 'poster', select: '-password -salt'});
    postQuery.populate({path: 'comments', select:'-post', populate: {path: 'commenter', select: '-password -salt -comments'}});
    postQuery.exec(function(err, post){
      res.json(post);
    });
  });
});

app.post('/comment/:postId/:userId', auth, function(req, res){
  Post.findById(req.params.postId, function(err, post){
    var comment = new Comment();
    comment.title = req.body.title;
    comment.commenter = req.params.userId;
    comment.post = post._id;
    comment.save(function(error, comment){
      post.comments.push(comment._id);
      post.save(function(err, post){
        var commentQuery = Comment.findById(comment._id);
        commentQuery.populate({path: 'commenter', select: '-password -salt -comments'});
        commentQuery.exec(function(err, comment){
          res.send(comment);
        });
      })   
    });
  });
});

app.put('/post/:id/upvote', auth, function(req, res){
  Post.findById(req.params.id, function(err, post){
    post.upvote();
    post.save(function(err, post){
      res.send(post);
    });
  });
});

app.put('/post/:id/downvote', auth, function(req, res){
  Post.findById(req.params.id, function(err, post){
    post.upvotes--;
    post.save(function(err, post){
      res.send(post);
    })
  })
});

app.get('/user/getPosts/:id', function(req, res){
  Post.find({poster: req.params.id}, function(err, posts){
    res.send(posts);
  })
});

app.put('/user/changeProfilePicture/:id', auth, function(req, res){
  User.findById(req.params.id, function(err, user){
    user.profileImg = req.body.url;
    user.save(function(err, user){
      return res.json({token: user.generateJWT()});
    });
  });
});

app.put('/user/changeEmail/:id', auth, function(req, res){
  User.findById(req.params.id, function(err, user){
    user.email = req.body.email;
    user.save(function(err, user){
      return res.json({token: user.generateJWT()});
    });
  });
});

app.put('/user/changePassword/:id', auth, function(req, res){
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

app.post('/register', function(req,res){
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

app.put('/comment/:id/upvote', auth, function(req, res){
  Comment.findById(req.params.id, function(err, comment){
    comment.upvote();
    comment.save(function(err, post){
      res.send(comment);
    })
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

app.post('/login', function(req,res,next){
  passport.authenticate('login', function(err, user){
    if(err){ return next(err); }

    if (user) {
      return res.json({token: user.generateJWT()});
    } else {
      return res.status(401);
    }
  })(req, res, next);
});

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

app.get('/user/connectFacebook', passport.authenticate('connectFacebook'));

app.get('/user/connectFacebook/callback',
  passport.authenticate('connectFacebook', {
    successRedirect : '/FacebookConnectionSuccess',
    failureRedirect : '/FacebookConnectionFailure'
  }));

app.get('/FacebookConnectionSuccess', function(req, res){
  User.findOne({facebookId: req.user.id}, function(err, user){
    if (!user) {
      res.redirect('http://localhost:8080/#/dashboard/settings?facebookId=' + req.user.id);
    } else {
      res.redirect('http://localhost:8080/#/dashboard/settings?auth=success');
    }
  })
  
})

app.get('/FacebookConnectionFailure', function(req, res){
  res.redirect('http://localhost:8080/#/dashboard/settings?auth=failed');
})

app.put('/user/setFacebookId/:id', auth, function(req, res){
  User.findById(req.params.id, function(err, user){
    user.facebookId = req.body.facebookId;
    user.save(function(err, user){
      res.send(user);
    })
  })
})

passport.use('loginFacebook',new FacebookStrategy({
  clientID: '1127373727323306',
  clientSecret: 'cefd4bab46437e5a05816a1c3f92c798',
  callbackURL: "http://localhost:8080/user/loginFacebook/callback",
  profileFields: ['id']
},
function(accessToken, refreshToken, profile, done){

  return done(null, profile);
}
));

app.get('/user/loginFacebook', passport.authenticate('loginFacebook'))

app.get('/user/loginFacebook/callback', 
  passport.authenticate('loginFacebook', {
    successRedirect : '/FacebookLoginSuccess',
    failureRedirect : '/FacebookLoginFailure'
  }));

app.get('/FacebookLoginSuccess', function(req, res){
  res.redirect('http://localhost:8080/#/login?facebookId=' + req.user.id);
})

app.get('/FacebookLoginFailure', function(req, res){
  res.redirect('http://localhost:8080/#/login?auth=failure');
})

app.get('/user/loginFacebookId/:id', function(req, res){
  User.findOne({facebookId: req.params.id}, function(err, user){
    if (user) {
      res.json({token: user.generateJWT()});
    } else {
      res.status(401);
    }
  })
})


app.listen(8080);



