const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    blogTitle: {
      type: String,
      required: [true, "Please provide a Title"],
    },
    blogBody: {
      type: String,
      required: [true, "Please provide a blog body"],
    },
    authorName: {
      type: String,
      default: "Anonymous",
    },
    photo: String,

    category: {
      type: String,
    },

    doctorId: {
      type: mongoose.Schema.ObjectId,
      ref: "Doctor",
      required: [true, "A blog must be posted from a doctor account"],
    },
    approved: {
      type: Boolean,
      default: 0,
    },
  },

  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

//virtual populate for comments
blogSchema.virtual("comments", {
  ref: "Comment",
  foreignField: "_blogId",
  localField: "_id",
});

//Model Creation
const BlogPost = mongoose.model("BlogPost", blogSchema);

module.exports = BlogPost;
