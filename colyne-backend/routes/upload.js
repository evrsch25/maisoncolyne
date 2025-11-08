const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { optimizeUploadedImages } = require('../middleware/imageOptimizer');
const uploadController = require('../controllers/uploadController');
const { protect, authorize } = require('../middleware/auth');

// Routes protégées pour l'upload d'images (admin uniquement)
// L'ordre est important : upload → optimisation → contrôleur
router.post('/single', protect, authorize('admin'), upload.single('image'), optimizeUploadedImages, uploadController.uploadSingle);
router.post('/multiple', protect, authorize('admin'), upload.array('images', 10), optimizeUploadedImages, uploadController.uploadMultiple);
router.delete('/:filename', protect, authorize('admin'), uploadController.deleteImage);

module.exports = router;

