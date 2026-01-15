const verificationService = require('../services/verificationService');

class VerificationController {
  async uploadDocuments(req, res) {
    try {
      const driverId = req.user.id;
      const files = req.files;

      if (!files || Object.keys(files).length === 0) {
        return res.status(400).json({
          success: false,
          error: 'No files uploaded'
        });
      }

      const result = await verificationService.uploadVerificationDocuments(driverId, files);

      res.json({
        success: true,
        message: 'Documents uploaded successfully',
        data: result
      });

    } catch (error) {
      console.error('Upload documents error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to upload documents',
        message: error.message
      });
    }
  }

  async getVerificationStatus(req, res) {
    try {
      const driverId = req.user.id;
      const status = await verificationService.getVerificationStatus(driverId);

      res.json({
        success: true,
        data: status
      });

    } catch (error) {
      console.error('Get verification status error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get verification status',
        message: error.message
      });
    }
  }

  async getPendingVerifications(req, res) {
    try {
      // Only admins can access this
      if (req.user.userType !== 'admin') {
        return res.status(403).json({
          success: false,
          error: 'Unauthorized - Admin access required'
        });
      }

      const pendingDrivers = await verificationService.getPendingVerifications();

      res.json({
        success: true,
        count: pendingDrivers.length,
        data: pendingDrivers
      });

    } catch (error) {
      console.error('Get pending verifications error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get pending verifications',
        message: error.message
      });
    }
  }

  async approveDriver(req, res) {
    try {
      // Only admins can approve
      if (req.user.userType !== 'admin') {
        return res.status(403).json({
          success: false,
          error: 'Unauthorized - Admin access required'
        });
      }

      const { id } = req.params;
      const { notes } = req.body;
      const adminId = req.user.id;

      const result = await verificationService.approveDriver(id, adminId, notes);

      res.json({
        success: true,
        message: 'Driver approved successfully',
        data: result
      });

    } catch (error) {
      console.error('Approve driver error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to approve driver',
        message: error.message
      });
    }
  }

  async rejectDriver(req, res) {
    try {
      // Only admins can reject
      if (req.user.userType !== 'admin') {
        return res.status(403).json({
          success: false,
          error: 'Unauthorized - Admin access required'
        });
      }

      const { id } = req.params;
      const { reason } = req.body;
      const adminId = req.user.id;

      if (!reason) {
        return res.status(400).json({
          success: false,
          error: 'Rejection reason is required'
        });
      }

      const result = await verificationService.rejectDriver(id, adminId, reason);

      res.json({
        success: true,
        message: 'Driver verification rejected',
        data: result
      });

    } catch (error) {
      console.error('Reject driver error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to reject driver',
        message: error.message
      });
    }
  }

  async checkDocumentExpiry(req, res) {
    try {
      // Only admins can access this
      if (req.user.userType !== 'admin') {
        return res.status(403).json({
          success: false,
          error: 'Unauthorized - Admin access required'
        });
      }

      const result = await verificationService.checkDocumentExpiry();

      res.json({
        success: true,
        message: `Found ${result.total} documents expiring soon`,
        data: result
      });

    } catch (error) {
      console.error('Check document expiry error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to check document expiry',
        message: error.message
      });
    }
  }
}

module.exports = new VerificationController();
