const { DriverProfile, User } = require('../models');
const smsService = require('./smsService');
const path = require('path');
const fs = require('fs').promises;

class VerificationService {
  constructor() {
    this.uploadDir = process.env.UPLOAD_DIR || './uploads';
    this.requiredDocuments = [
      'drivers_license',
      'vehicle_registration',
      'vehicle_insurance',
      'national_id',
      'vehicle_photo_front',
      'vehicle_photo_side',
      'driver_selfie'
    ];
  }

  async initializeUploadDirectory() {
    try {
      await fs.mkdir(this.uploadDir, { recursive: true });
      await fs.mkdir(path.join(this.uploadDir, 'verifications'), { recursive: true });
    } catch (error) {
      console.error('Failed to create upload directory:', error);
    }
  }

  async uploadVerificationDocuments(driverId, files) {
    try {
      const driver = await DriverProfile.findOne({
        where: { user_id: driverId },
        include: [{ model: User, as: 'user' }]
      });

      if (!driver) {
        throw new Error('Driver profile not found');
      }

      // Create driver's upload directory
      const driverUploadDir = path.join(this.uploadDir, 'verifications', driverId);
      await fs.mkdir(driverUploadDir, { recursive: true });

      const uploadedDocs = driver.verification_documents || {};

      // Process each uploaded file
      for (const [docType, fileArray] of Object.entries(files)) {
        if (fileArray && fileArray.length > 0) {
          const file = fileArray[0];
          const fileName = `${docType}_${Date.now()}${path.extname(file.originalname)}`;
          const filePath = path.join(driverUploadDir, fileName);

          // Move file to permanent location
          await fs.writeFile(filePath, file.buffer);

          uploadedDocs[docType] = {
            fileName,
            originalName: file.originalname,
            path: filePath.replace(this.uploadDir, ''),
            uploadedAt: new Date().toISOString(),
            size: file.size,
            mimeType: file.mimetype
          };
        }
      }

      // Update driver profile
      await driver.update({
        verification_documents: uploadedDocs,
        verification_status: 'pending'
      });

      // Check if all required documents are uploaded
      const missingDocs = this.getMissingDocuments(uploadedDocs);

      return {
        success: true,
        uploadedDocuments: Object.keys(uploadedDocs),
        missingDocuments: missingDocs,
        allDocumentsUploaded: missingDocs.length === 0,
        verificationStatus: driver.verification_status
      };

    } catch (error) {
      console.error('Upload verification documents error:', error);
      throw error;
    }
  }

  getMissingDocuments(uploadedDocs) {
    return this.requiredDocuments.filter(doc => !uploadedDocs[doc]);
  }

  async getVerificationStatus(driverId) {
    try {
      const driver = await DriverProfile.findOne({
        where: { user_id: driverId }
      });

      if (!driver) {
        throw new Error('Driver profile not found');
      }

      const uploadedDocs = driver.verification_documents || {};
      const missingDocs = this.getMissingDocuments(uploadedDocs);

      return {
        status: driver.verification_status,
        verifiedAt: driver.verified_at,
        verifiedBy: driver.verified_by,
        notes: driver.verification_notes,
        uploadedDocuments: Object.keys(uploadedDocs),
        missingDocuments: missingDocs,
        allDocumentsUploaded: missingDocs.length === 0,
        documents: uploadedDocs
      };

    } catch (error) {
      console.error('Get verification status error:', error);
      throw error;
    }
  }

  async getPendingVerifications() {
    try {
      const pendingDrivers = await DriverProfile.findAll({
        where: { verification_status: 'pending' },
        include: [{
          model: User,
          as: 'user',
          attributes: ['id', 'full_name', 'email', 'phone', 'created_at']
        }],
        order: [['created_at', 'ASC']]
      });

      return pendingDrivers.map(driver => ({
        driverId: driver.user_id,
        driverName: driver.user.full_name,
        email: driver.user.email,
        phone: driver.user.phone,
        vehicleType: driver.vehicle_type,
        licensePlate: driver.license_plate,
        submittedAt: driver.created_at,
        uploadedDocuments: Object.keys(driver.verification_documents || {}),
        missingDocuments: this.getMissingDocuments(driver.verification_documents || {}),
        documents: driver.verification_documents
      }));

    } catch (error) {
      console.error('Get pending verifications error:', error);
      throw error;
    }
  }

  async approveDriver(driverId, adminId, notes = '') {
    try {
      const driver = await DriverProfile.findOne({
        where: { user_id: driverId },
        include: [{ model: User, as: 'user' }]
      });

      if (!driver) {
        throw new Error('Driver not found');
      }

      if (driver.verification_status === 'verified') {
        throw new Error('Driver already verified');
      }

      // Check if all documents are uploaded
      const missingDocs = this.getMissingDocuments(driver.verification_documents || {});
      if (missingDocs.length > 0) {
        throw new Error(`Missing documents: ${missingDocs.join(', ')}`);
      }

      // Approve driver
      await driver.update({
        verification_status: 'verified',
        verified_by: adminId,
        verified_at: new Date(),
        verification_notes: notes,
        availability: true
      });

      // Send SMS notification
      await smsService.notifyDriverVerified(driver.user);

      return {
        success: true,
        message: 'Driver verified successfully',
        driver: {
          id: driver.user_id,
          name: driver.user.full_name,
          verifiedAt: driver.verified_at
        }
      };

    } catch (error) {
      console.error('Approve driver error:', error);
      throw error;
    }
  }

  async rejectDriver(driverId, adminId, reason) {
    try {
      const driver = await DriverProfile.findOne({
        where: { user_id: driverId },
        include: [{ model: User, as: 'user' }]
      });

      if (!driver) {
        throw new Error('Driver not found');
      }

      if (!reason) {
        throw new Error('Rejection reason is required');
      }

      // Reject driver
      await driver.update({
        verification_status: 'rejected',
        verified_by: adminId,
        verified_at: new Date(),
        verification_notes: reason,
        availability: false
      });

      // Send SMS notification
      await smsService.notifyDriverRejected(driver.user, reason);

      return {
        success: true,
        message: 'Driver verification rejected',
        driver: {
          id: driver.user_id,
          name: driver.user.full_name,
          reason
        }
      };

    } catch (error) {
      console.error('Reject driver error:', error);
      throw error;
    }
  }

  async checkDocumentExpiry() {
    try {
      const drivers = await DriverProfile.findAll({
        where: { verification_status: 'verified' },
        include: [{ model: User, as: 'user' }]
      });

      const now = new Date();
      const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
      const expiringSoon = [];

      for (const driver of drivers) {
        // Check license expiry
        if (driver.license_expiry) {
          const expiryDate = new Date(driver.license_expiry);
          if (expiryDate <= thirtyDaysFromNow && expiryDate > now) {
            expiringSoon.push({
              driver: driver.user,
              docType: "Driver's License",
              expiryDate: driver.license_expiry
            });
          }
        }

        // Check insurance expiry
        if (driver.insurance_expiry) {
          const expiryDate = new Date(driver.insurance_expiry);
          if (expiryDate <= thirtyDaysFromNow && expiryDate > now) {
            expiringSoon.push({
              driver: driver.user,
              docType: 'Vehicle Insurance',
              expiryDate: driver.insurance_expiry
            });
          }
        }
      }

      // Send notifications for expiring documents
      for (const item of expiringSoon) {
        await smsService.notifyDocumentExpiryWarning(
          item.driver,
          item.docType,
          item.expiryDate
        );
      }

      return {
        total: expiringSoon.length,
        expiringSoon
      };

    } catch (error) {
      console.error('Check document expiry error:', error);
      throw error;
    }
  }
}

module.exports = new VerificationService();
