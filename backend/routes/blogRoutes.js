const express = require('express');

const router = express.Router();

const blogControllers = require('../controllers/blogControllers');
const checkAuth = require('../middleware/check-auth');
const fileUpload = require('../middleware/file-upload');

router.use(checkAuth);

router.get('/', blogControllers.getAllBlogs);
// router.get('/category', blogControllers.getBlogsByCategory);
router.get('/doctor/:id', blogControllers.getBlogsOfUser);
router.get('/blogs/:id', blogControllers.getBlog);
router.get('/comment/:id', blogControllers.getComment);

router.post('/comment/:id', blogControllers.commentBlog);
router.post('/write', fileUpload.array('image'), blogControllers.createBlog);
router.post('/upvote/:id', blogControllers.upvoteBlog);

module.exports = router;