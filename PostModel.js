var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var postSchema = new Schema({
  title: String,
  link: String,
  poster: {type: Schema.ObjectId, ref: 'user'},
  Comments: [{type: Schema.ObjectId, ref: 'comment'}]
});

var Post = mongoose.model('Post', postSchema);

module.exports = Post;