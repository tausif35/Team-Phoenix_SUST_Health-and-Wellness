const mongoose = require('mongoose');
const Blog = require("../models/blogModel");
const Comment = require("../models/commentModel");
const Patient = require("../models/patient");
const Doctor = require("../models/doctor");
const HttpError = require('../models/http-error');



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
    console.log();
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

exports.getAllBlogs = async (req, res, next) => {
    let { category, sortBy } = req.query;

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
    if(!sortBy){
        // sortBy = "dateAsc";
        sortBy = "dateDesc";
    }
    // 1645251244065
    // 1645251220511
    let filteredBlogsSorted;
    if (sortBy === "upvotesAsc") {
        filteredBlogsSorted=filteredBlogs.sort((a, b) => {
            return a.upvotes.length - b.upvotes.length
        })
    } else if(sortBy === "upvotesDesc") {
        filteredBlogsSorted= filteredBlogs.sort((a, b) => {
            return b.upvotes.length - a.upvotes.length
        })
    }else if(sortBy ===`dateAsc`){ 
        filteredBlogsSorted = filteredBlogs.sort((a, b) => {
            return Number(a.createdAt) - Number(b.createdAt)
        })
    }else if(sortBy ===`dateDesc`){
        filteredBlogsSorted = filteredBlogs.sort((a, b) => {
            return  Number(b.createdAt) - Number(a.createdAt)
        })
    }
    filteredBlogs = filteredBlogsSorted;
    // filteredBlogs.sort(function (blog1, blog2) {
    //     return x.timestamp - y.timestamp;
    // })
    res.status(200).json({
        message: "successful",
        No_of_blogs: blogs.length,
        data: {
            filteredBlogs,
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
    const id = req.params.id;
    let blog;
    try {
        blog = await Blog.findById(id).populate();
    } catch (error) {
        return next(new HttpError("Something Went Wrong", 401));
    }
    if (!blog) {
        return next(new HttpError("Blog Not Found", 404));
    }

    res.status(200).json({
        message: "successful",
        data: {
            blog,
        },
    });
};

exports.commentBlog = async (req, res, next) => {
    const blogId = req.params.id;
    const { comment } = req.body;
    if (req.userData.type !== "patient") {
        return next(new AppError("Unauthorized", 400));
    }
    let blog
    try {
        blog = await Blog.findById(blogId);
    } catch (error) {
        return next(new HttpError("Something Went Wrong", 401));
    }
    if (!blog) {
        return next(new HttpError("Blog Not Found", 404));
    }
    const newComment = new Comment({
        blogId: blogId,
        comment: comment,
        commentedBy: req.userData.id,
        upvotes: []
    });
    try {
        const session = await mongoose.startSession();
        session.startTransaction();
        await newComment.save({ session: session });
        blog.commentId.push(newComment);
        await blog.save({ session: session });
        await session.commitTransaction();
    } catch (err) {
        console.log(err.message);
        const error = new HttpError("Failed to publish Comment, please try again", 500);
        return next(error);
    }
    res.status(201).json({
        message: "successful",
        data: {
            newComment,
        },
    });
};

exports.getComments = async (req, res, next) => {
    let blog;
    let id = req.params.id;
    try {
        blog = await Blog.findById(id).populate('commentId');
    } catch (error) {
        console.log(error.message);
        return next(new HttpError("Something Went Wrong", 401));
    }
    res.status(200).json({
        message: "successful",
        data: {
            comments: blog.commentId.map(id => id.toObject({ getters: true })),
        },
    });
};



exports.upvoteBlog = async (req, res, next) => {
    const blogId = req.params.id;
    const id = req.userData.id;
    const blog = await Blog.findById(blogId);
    const isUpvoted = blog.upvotes && blog.upvotes.includes(id);

    let option;
    if (!isUpvoted) {
        option = "$addToSet";
    } else option = "$pull";
    let updatedBlog = await Blog.findByIdAndUpdate(
        blogId,
        {
            [option]: { upvotes: id },
        },
        { new: true }
    );

    res.status(201).json({
        message: "success",
        data: {
            blog: updatedBlog,
        },
    });
};
