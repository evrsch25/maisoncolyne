const express = require('express');
const router = express.Router();
const {
  getAllPortfolioItems,
  getPortfolioItemById,
  createPortfolioItem,
  updatePortfolioItem,
  deletePortfolioItem,
  getCategories
} = require('../controllers/portfolioController');
const { protect, authorize } = require('../middleware/auth');

// Routes publiques
router.get('/', getAllPortfolioItems);
router.get('/categories', getCategories);
router.get('/:id', getPortfolioItemById);

// Routes protégées (admin uniquement)
router.post('/', protect, authorize('admin'), createPortfolioItem);
router.put('/:id', protect, authorize('admin'), updatePortfolioItem);
router.delete('/:id', protect, authorize('admin'), deletePortfolioItem);

module.exports = router;

