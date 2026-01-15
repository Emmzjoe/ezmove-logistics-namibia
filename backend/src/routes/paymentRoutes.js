const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { authenticate, requireRole } = require('../middleware/auth');

// All routes require authentication
router.use(authenticate);

// Payment operations
router.post('/initiate', paymentController.initiatePayment);
router.get('/status/:id', paymentController.checkPaymentStatus);
router.post('/complete/:id', paymentController.completePayment);
router.get('/history', paymentController.getTransactionHistory);

// Admin operations
router.post('/payout', requireRole('admin'), paymentController.processDriverPayout);
router.post('/refund/:id', requireRole('admin'), paymentController.refundPayment);

module.exports = router;
