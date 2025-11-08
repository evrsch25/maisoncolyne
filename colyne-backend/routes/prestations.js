const express = require('express');
const router = express.Router();
const {
  getPrestations,
  getPrestationBySlug,
  createPrestation,
  updatePrestation,
  deletePrestation,
  uploadPrestationImage
} = require('../controllers/prestationController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.route('/')
  .get(getPrestations)
  .post(protect, authorize('admin'), createPrestation);

router.route('/:id')
  .get(getPrestationBySlug) // Peut gérer à la fois slug et ID
  .put(protect, authorize('admin'), updatePrestation)
  .delete(protect, authorize('admin'), deletePrestation);

router.post('/:id/image', protect, authorize('admin'), upload.single('image'), uploadPrestationImage);

module.exports = router;

