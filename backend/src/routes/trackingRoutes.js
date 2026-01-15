const express = require('express');
const router = express.Router();
const trackingController = require('../controllers/trackingController');
const { authenticate } = require('../middleware/auth');

// All routes require authentication
router.use(authenticate);

router.get('/job/:id/history', trackingController.getJobTrackingHistory);
router.get('/driver/:id/location', trackingController.getDriverLocation);
router.get('/calculate-eta', trackingController.calculateETA);

module.exports = router;
