const express = require('express');
const router = express.Router();
const {
  sendContactMessage,
  getContactMessages,
  getContactMessage,
  updateMessageStatus,
  deleteContactMessage
} = require('../controllers/contactController');
const { protect, authorize } = require('../middleware/auth');

router.route('/')
  .post(sendContactMessage)
  .get(protect, authorize('admin'), getContactMessages);

router.route('/:id')
  .get(protect, authorize('admin'), getContactMessage)
  .delete(protect, authorize('admin'), deleteContactMessage);

router.put('/:id/status', protect, authorize('admin'), updateMessageStatus);

module.exports = router;

