var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var commentSchema = new Schema({
  title: String,
  upvotes: {type: Number, default: 0},
  commenter: {type: Schema.ObjectId, ref: 'User'},
  post: {type: Schema.ObjectId, ref: 'Post'}
});

commentSchema.methods.upvote = function(){
  this.upvotes++;
};

commentSchema.methods.downvote = function(){
  this.upvotes--;
};

var Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;