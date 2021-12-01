const express = require('express');

const router = express.Router();

const authorController = require('../controllers/authorController');
const blogController = require('../controllers/blogController')
const authorAuth = require('../middlewares/authorAuth')
// Author routes
router.post('/authors', authorController.registerAuthor);
router.post('/login', authorController.loginAuthor);

// Blog routes
router.post('/blogs', authorAuth, blogController.createBlog);
router.get('/blogs', authorAuth, blogController.listBlog);
router.put('/blogs/:blogId', authorAuth, blogController.updateBlog);
router.delete('/blogs/:blogId', authorAuth, blogController.deleteBlogByID);
router.delete('/blogs', authorAuth, blogController.deleteBlogByParams);

module.exports = router;