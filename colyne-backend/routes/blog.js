const express = require('express');
const router = express.Router();
const {
  getBlogPosts,
  getBlogPostBySlug,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
  uploadBlogImage
} = require('../controllers/blogController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.route('/')
  .get(getBlogPosts)
  .post(protect, authorize('admin'), createBlogPost);

router.route('/:slug')
  .get(getBlogPostBySlug);

router.route('/id/:id')
  .put(protect, authorize('admin'), updateBlogPost)
  .delete(protect, authorize('admin'), deleteBlogPost);

router.post('/:id/image', protect, authorize('admin'), upload.single('image'), uploadBlogImage);

module.exports = router;

