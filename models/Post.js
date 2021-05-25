let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let postScheme = new Schema({
  title: {
    type: String,
    required: [true, "post must have a title"],
    trim: true,
  },

  description: {
    type: String,
    required: [true, "description of the post is required"],
  },

  image: {
    type: String,
    required: [true, "post must have an image related to it"],
  },

  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: [true, "post must have an author"],
  },
});

let Post = mongoose.model("Post", postScheme);

module.exports = Post;
