const express = require('express');
const router = express.Router();
const {
  getConfig,
  updateConfig,
  addTestimonial,
  deleteTestimonial
} = require('../controllers/configController');
const { protect, authorize } = require('../middleware/auth');

router.route('/')
  .get(getConfig)
  .put(protect, authorize('admin'), updateConfig);

router.route('/testimonials')
  .post(protect, authorize('admin'), addTestimonial);

router.route('/testimonials/:id')
  .delete(protect, authorize('admin'), deleteTestimonial);

module.exports = router;

