var express = require('express');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var passport = require('passport');

var LocalStrategy = require('passport-local').Strategy;

var User = require('./UserModel');
var Post = require('./PostModel');
var Comment = require('./CommentModel');

mongoose.connect('mongodb://localhost/rereddit');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(express.static('node_modules'));
app.use(express.static('public'));

app.get('/posts', function(req, res){
  var postsQuery = Post.find();
  postsQuery.populate({path: 'poster', select: '-password -salt'});
  postsQuery.populate({path: 'comments', select:'-post', populate: {path: 'commenter', select: '-password -salt -comments'}});
  postsQuery.exec(function(err, posts){
    res.send(posts);
  })
})

app.post('/post', function(req, res){
  post = new Post();
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

app.post('/comment/:postId/:userId', function(req, res){
  Post.findById(req.params.postId, function(err, post){
    comment = new Comment();
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

app.post('/register', function(req,res){
  User.findOne({username: req.body.username}, function(err, user){
    if (err) { return done(err); }

      if (!user) {
        var user = new User();

        user.username = req.body.username;
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

app.listen(8080);


