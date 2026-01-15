const twilio = require('twilio');

class SMSService {
  constructor() {
    this.accountSid = process.env.TWILIO_ACCOUNT_SID;
    this.authToken = process.env.TWILIO_AUTH_TOKEN;
    this.fromNumber = process.env.TWILIO_PHONE_NUMBER;

    if (this.accountSid && this.authToken) {
      this.client = twilio(this.accountSid, this.authToken);
    } else {
      console.log('⚠️  SMS Service running in SANDBOX mode (no Twilio credentials)');
      this.client = null;
    }
  }

  async sendSMS(to, message) {
    try {
      // Sandbox mode - just log the message
      if (!this.client) {
        console.log(`📱 [SMS SANDBOX] To: ${to}`);
        console.log(`📱 [SMS SANDBOX] Message: ${message}`);
        return {
          success: true,
          sandbox: true,
          sid: 'SANDBOX_' + Date.now()
        };
      }

      // Production mode - send actual SMS
      const result = await this.client.messages.create({
        body: message,
        from: this.fromNumber,
        to: to
      });

      console.log(`✅ SMS sent to ${to}: ${result.sid}`);

      return {
        success: true,
        sid: result.sid,
        status: result.status
      };

    } catch (error) {
      console.error('SMS send error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Job-related notifications
  async notifyJobCreated(driver, job) {
    const message = `New job available! ${job.vehicleType} needed from ${job.pickupAddress} to ${job.deliveryAddress}. Distance: ${job.distanceKm}km. Pay: NAD ${job.driverEarnings}. Accept in the app!`;
    return this.sendSMS(driver.phone, message);
  }

  async notifyJobAccepted(client, job, driver) {
    const message = `Your delivery has been accepted by ${driver.fullName}. Vehicle: ${job.vehicleType} (${driver.licensePlate}). Track your order in the app.`;
    return this.sendSMS(client.phone, message);
  }

  async notifyJobStarted(client, job, driver) {
    const message = `${driver.fullName} is on the way to pick up your items from ${job.pickupAddress}. ETA: ${job.estimatedDuration} minutes.`;
    return this.sendSMS(client.phone, message);
  }

  async notifyPickupComplete(client, job) {
    const message = `Your items have been picked up and are on the way to ${job.deliveryAddress}. Track live in the app!`;
    return this.sendSMS(client.phone, message);
  }

  async notifyDeliveryComplete(client, job, driver) {
    const message = `Delivery completed! Your items have been delivered to ${job.deliveryAddress}. Please rate ${driver.fullName} in the app. Thank you for using EZMove!`;
    return this.sendSMS(client.phone, message);
  }

  async notifyDriverDeliveryComplete(driver, job) {
    const message = `Job ${job.jobNumber} completed! You earned NAD ${job.driverEarnings}. Payout will be processed within 24 hours. Great work!`;
    return this.sendSMS(driver.phone, message);
  }

  async notifyJobCancelled(user, job, reason) {
    const message = `Job ${job.jobNumber} has been cancelled. Reason: ${reason || 'Not specified'}. Any payment will be refunded within 48 hours.`;
    return this.sendSMS(user.phone, message);
  }

  async notifyPaymentReceived(client, job, amount) {
    const message = `Payment of NAD ${amount} received for job ${job.jobNumber}. Thank you! Your delivery will begin soon.`;
    return this.sendSMS(client.phone, message);
  }

  async notifyPayoutProcessed(driver, amount, transactionId) {
    const message = `Payout of NAD ${amount} has been processed to your account. Transaction ID: ${transactionId}. Check your mobile money account.`;
    return this.sendSMS(driver.phone, message);
  }

  async notifyDriverVerified(driver) {
    const message = `Congratulations ${driver.fullName}! Your driver account has been verified. You can now start accepting jobs on EZMove. Happy driving! 🚚`;
    return this.sendSMS(driver.phone, message);
  }

  async notifyDriverRejected(driver, reason) {
    const message = `Your driver verification was not approved. Reason: ${reason}. Please update your documents and resubmit. Contact support if you need help.`;
    return this.sendSMS(driver.phone, message);
  }

  async notifyDocumentExpiryWarning(driver, docType, expiryDate) {
    const message = `Reminder: Your ${docType} expires on ${expiryDate}. Please update it in the app to continue accepting jobs.`;
    return this.sendSMS(driver.phone, message);
  }

  async sendVerificationCode(phone, code) {
    const message = `Your EZMove verification code is: ${code}. Valid for 10 minutes. Do not share this code with anyone.`;
    return this.sendSMS(phone, message);
  }

  async sendPasswordResetCode(phone, code) {
    const message = `Your EZMove password reset code is: ${code}. Valid for 15 minutes. If you didn't request this, please ignore.`;
    return this.sendSMS(phone, message);
  }

  async sendWelcomeMessage(user) {
    const message = user.userType === 'driver'
      ? `Welcome to EZMove ${user.fullName}! Complete your verification to start earning. Need help? Contact support.`
      : `Welcome to EZMove ${user.fullName}! Book your first delivery now and enjoy reliable logistics service across Namibia. 🚚`;
    return this.sendSMS(user.phone, message);
  }

  async sendPromotion(user, promoText) {
    return this.sendSMS(user.phone, promoText);
  }

  // Batch SMS (for admin notifications)
  async sendBulkSMS(phoneNumbers, message) {
    const results = [];

    for (const phone of phoneNumbers) {
      const result = await this.sendSMS(phone, message);
      results.push({ phone, ...result });

      // Rate limiting - wait 100ms between sends
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    return {
      total: phoneNumbers.length,
      success: results.filter(r => r.success).length,
      failed: results.filter(r => !r.success).length,
      results
    };
  }
}

module.exports = new SMSService();
