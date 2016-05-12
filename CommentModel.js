var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var commentSchema = new Schema({
  title: String,
  commenter: {type: Schema.ObjectId, ref: 'User'},
  post: {type: Schema.ObjectId, ref: 'Post'}
});

var Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;