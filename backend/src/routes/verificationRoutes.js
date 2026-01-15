const express = require('express');
const router = express.Router();
const multer = require('multer');
const verificationController = require('../controllers/verificationController');
const { authenticate } = require('../middleware/auth');

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit per file
  },
  fileFilter: (req, file, cb) => {
    // Accept images and PDFs
    const allowedMimes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'application/pdf'
    ];

    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, and PDF files are allowed.'));
    }
  }
});

// All routes require authentication
router.use(authenticate);

// Driver routes
router.post(
  '/upload',
  upload.fields([
    { name: 'drivers_license', maxCount: 1 },
    { name: 'vehicle_registration', maxCount: 1 },
    { name: 'vehicle_insurance', maxCount: 1 },
    { name: 'national_id', maxCount: 1 },
    { name: 'vehicle_photo_front', maxCount: 1 },
    { name: 'vehicle_photo_side', maxCount: 1 },
    { name: 'driver_selfie', maxCount: 1 }
  ]),
  verificationController.uploadDocuments
);

router.get('/status', verificationController.getVerificationStatus);

// Admin routes
router.get('/pending', verificationController.getPendingVerifications);
router.post('/approve/:id', verificationController.approveDriver);
router.post('/reject/:id', verificationController.rejectDriver);
router.get('/check-expiry', verificationController.checkDocumentExpiry);

module.exports = router;
