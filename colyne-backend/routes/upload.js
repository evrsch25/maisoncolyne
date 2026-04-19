const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const uploadController = require('../controllers/uploadController');
const { protect, authorize } = require('../middleware/auth');

// Routes protégées pour l'upload d'images (admin uniquement)
router.post('/single', protect, authorize('admin'), upload.single('image'), uploadController.uploadSingle);
router.post('/multiple', protect, authorize('admin'), upload.array('images', 10), uploadController.uploadMultiple);
router.delete('/:filename', protect, authorize('admin'), uploadController.deleteImage);

module.exports = router;

