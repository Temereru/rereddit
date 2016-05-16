var express = require('express');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var passport = require('passport');
var expressJWT = require('express-jwt');
var expressSession = require('express-session');

var User = require('./UserModel');
var Post = require('./PostModel');
var Comment = require('./CommentModel');
var userRoutes = require('./routes/user');

mongoose.connect('mongodb://localhost/rereddit');

var auth = expressJWT({secret: 'SECRET'});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(express.static('node_modules'));
app.use(express.static('public'));

app.use(expressSession({ secret: 'mySecretKey' }));

app.use(passport.initialize());
app.use(passport.session());

app.use('/user', userRoutes);

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
    post.downvote();
    post.save(function(err, post){
      res.send(post);
    })
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

app.put('/comment/:id/downvote', auth, function(req, res){
  Comment.findById(req.params.id, function(err, comment){
    comment.downvote();
    comment.save(function(err, post){
      res.send(comment);
    })
  })
});

app.listen(8080);



