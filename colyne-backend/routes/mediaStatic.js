const express = require('express');
const router = express.Router();
const {
  getAllMediaStatic,
  getMediaStaticById,
  getMediaStaticByPageLocation,
  createMediaStatic,
  updateMediaStatic,
  deleteMediaStatic
} = require('../controllers/mediaStaticController');
const { protect, authorize } = require('../middleware/auth');

// Routes publiques
router.get('/', getAllMediaStatic);
router.get('/page/:page/:location', getMediaStaticByPageLocation);
router.get('/:id', getMediaStaticById);

// Routes protégées (admin uniquement)
router.post('/', protect, authorize('admin'), createMediaStatic);
router.put('/:id', protect, authorize('admin'), updateMediaStatic);
router.delete('/:id', protect, authorize('admin'), deleteMediaStatic);

module.exports = router;

