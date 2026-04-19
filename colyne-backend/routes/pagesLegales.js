const express = require('express');
const router = express.Router();
const { getPageLegale, updatePageLegale } = require('../controllers/pageLegaleController');
const { protect, authorize } = require('../middleware/auth');

router.get('/:slug', getPageLegale);
router.put('/:slug', protect, authorize('admin'), updatePageLegale);

module.exports = router;
