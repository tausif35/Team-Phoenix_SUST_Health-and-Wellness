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
    photo: {
      type: String,
      default: "public/uploads/defaultBlogImg.jpg"
    },

    blogCategory: {
      type: String
    },

    doctorId: {
      type: mongoose.Schema.ObjectId,
      ref: "Doctor",
      required: [true, "A blog must be posted from a doctor account"],
    },
    upvotes: [{ type: mongoose.Schema.ObjectId, ref: "Patient", required: true }],
  },

  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// //virtual populate for comments
// blogSchema.virtual("comments", {
//   ref: "Comment",
//   foreignField: "_blogId",
//   localField: "_id",
// });

//Model Creation
module.exports = mongoose.model('Blog', blogSchema);

