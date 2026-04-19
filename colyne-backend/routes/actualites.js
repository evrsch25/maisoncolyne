const express = require('express');
const router = express.Router();
const {
  getActualites,
  getAllActualites,
  createActualite,
  updateActualite,
  deleteActualite
} = require('../controllers/actualiteController');
const { protect, authorize } = require('../middleware/auth');

// Routes publiques
router.get('/', getActualites);

// Routes protégées (admin)
router.get('/admin', protect, authorize('admin'), getAllActualites);
router.post('/', protect, authorize('admin'), createActualite);
router.put('/:id', protect, authorize('admin'), updateActualite);
router.delete('/:id', protect, authorize('admin'), deleteActualite);

module.exports = router;
