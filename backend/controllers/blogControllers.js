const Blog = require("../models/blogModel");
const Comment = require("../models/commentModel");
const Patient = require("../models/patient");
const Doctor = require("../models/doctor");
const HttpError = require('../models/http-error');
const mongoose = require('mongoose');
const blogModel = require("../models/blogModel");


exports.getAllBlogs = async (req, res, next) => {
  const { category } = req.query;

  let blogs;
  let filteredBlogs;
  try {
    blogs = await Blog.find().populate();
    if (!category) {
      filteredBlogs = blogs;
    } else {

      filteredBlogs = blogs.filter(blog => {

        console.log(blog.blogCategory, category)
        return blog.blogCategory === category
      })
      // blogs = await Blog.find({ blogCategory: category }).populate(); // blog search by category not working
    }
  } catch (error) {
    console.log(error.message)
    return next(new HttpError("Something Went Wrong", 401));
  }


  res.status(200).json({
    message: "successful",
    No_of_blogs: blogs.length,
    data: {
      filteredBlogs,
    },
  });
};


exports.createBlog = async (req, res, next) => {
  console.log(req.body);
  const { blogTitle, blogBody, blogCategory } = req.body;

  const userId = req.userData.id;
  const user = await Doctor.findById(userId);

  console.log(user.id, req.userData.type, user.name);
  let imgPath;
  if (req.files.length > 0) {
    imgPath = req.files[0].path;
  }
  const newBlog = new Blog({
    blogTitle: blogTitle,
    blogBody: blogBody,
    blogCategory: blogCategory,
    authorName: user.name,
    doctorId: userId,
    photo: imgPath,
    upvotes: []
  });

  let doctor;
  try {
    doctor = await Doctor.findById(userId);
  } catch (err) {
    const error = new HttpError("Failed to publish Blog , please try again", 500);
    return next(error);
  }
  if (!doctor) {
    const error = new HttpError("User Not Found", 404);
    return next(error);
  }

  try {
    const session = await mongoose.startSession();
    session.startTransaction();
    await newBlog.save({ session: session });
    doctor.blogs.push(newBlog);
    await doctor.save({ session: session });
    await session.commitTransaction();
  } catch (err) {
    console.log(err.message);
    const error = new HttpError("Failed to publish Blog, please try again", 500);
    return next(error);
  }



  res.status(201).json({
    message: "successful",
    data: {
      newBlog,
    },
  });
};


exports.getBlogsOfUser = async (req, res, next) => {
  let user;
  let id = req.params.id;

  try {
    if (req.userData.type === "doctor") {
      user = await Doctor.findById(id).populate('blogs');
    }
  } catch (error) {
    console.log(error.message);
  }

  console.log(user)
  res.status(200).json({
    message: "successful",
    data: {
      blogs: user.blogs.map(id => id.toObject({ getters: true })),
    },
  });
};

exports.getBlog = async (req, res, next) => {
  const blog = await Blog.findById(req.params.id).populate({
    path: "comments",
    select: "comment commentedBy upvotes",
  });

  res.status(200).json({
    message: "successful",
    data: {
      blog,
      id: req.userData.id
    },
  });
};

exports.getComment = async (req, res, next) => {
  const comment = await Comment.findById(req.params.id);

  res.status(200).json({
    message: "successful",
    data: {
      comment,
    },
  });
};

exports.commentBlog = async (req, res, next) => {
  if (req.userData.type === "Patient") {
    return next(new AppError("Unauthorized", 400));
  }
  const doctor = await Doctor.findById(req.userData.id);

  const newComment = await Comment.create({
    _blogId: req.params.id,
    comment: req.body.comment,
    commentedBy: doctor.id,
    upvotes: []
  });

  res.status(201).json({
    message: "successful",
    data: {
      newComment,
    },
  });
};

exports.upvoteBlog = async (req, res, next) => {
  const ansId = req.params.id;
  const id = req.userData.id;
  const comment = await Comment.findById(ansId);
  const isUpvoted = comment.upvotes && comment.upvotes.includes(id);

  let option;
  if (!isUpvoted) {
    option = "$addToSet";
  } else option = "$pull";
  let ans = await Comment.findByIdAndUpdate(
    ansId,
    {
      [option]: { upvotes: id },
    },
    { new: true }
  );

  res.status(201).json({
    message: "success",
    data: {
      ans,
    },
  });
};
