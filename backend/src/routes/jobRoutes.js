const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');
const { authenticate, requireRole } = require('../middleware/auth');

// All routes require authentication
router.use(authenticate);

// Job management
router.post('/', requireRole('client'), jobController.createJob);
router.get('/', jobController.getJobs);
router.get('/:id', jobController.getJobById);

// Driver actions
router.post('/:id/accept', requireRole('driver'), jobController.acceptJob);
router.post('/:id/start', requireRole('driver'), jobController.startJob);
router.post('/:id/complete', requireRole('driver'), jobController.completeJob);

// Both client and driver can cancel
router.post('/:id/cancel', jobController.cancelJob);

// Rating
router.post('/:id/rate', jobController.rateJob);

module.exports = router;
