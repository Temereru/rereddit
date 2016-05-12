var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var postSchema = new Schema({
  title: String,
  link: String,
  upvotes: Number,
  poster: {type: Schema.ObjectId, ref: 'User'},
  comments: [{type: Schema.ObjectId, ref: 'Comment'}]
});

var Post = mongoose.model('Post', postSchema);

module.exports = Post;