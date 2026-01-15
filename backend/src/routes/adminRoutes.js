const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticate } = require('../middleware/auth');

// All routes require authentication
router.use(authenticate);

// User Management
router.get('/users', adminController.getAllUsers);
router.get('/users/:id', adminController.getUserDetails);
router.post('/users/:id/suspend', adminController.suspendUser);
router.post('/users/:id/activate', adminController.activateUser);

// Job Management
router.get('/jobs', adminController.getAllJobs);
router.post('/jobs/:id/cancel', adminController.cancelJob);

// Analytics & Reports
router.get('/dashboard/stats', adminController.getDashboardStats);
router.get('/transactions', adminController.getTransactions);
router.get('/system/health', adminController.getSystemHealth);

module.exports = router;
