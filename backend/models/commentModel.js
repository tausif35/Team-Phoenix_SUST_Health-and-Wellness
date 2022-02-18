const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  _blogId: {
    type: mongoose.Schema.ObjectId,
    ref: "Blog",
  },
  comment: {
    type: String,
    required: true,
  },
  commentedBy: {
    type: mongoose.Schema.ObjectId,
    ref: "Patient"
  }
});

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
