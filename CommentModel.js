var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var commentSchema = new Schema({
  title: String,
  commenter: {type: Schema.ObjectId, ref: 'user'},
  post: {type: Schema.ObjectId, ref: 'post'}
});

var Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;