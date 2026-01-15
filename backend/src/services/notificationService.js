const { Notification, User, Job } = require('../models');
const smsService = require('./smsService');

class NotificationService {
  async createNotification(userId, type, title, message, deliveryMethod = 'in_app', data = {}) {
    try {
      const notification = await Notification.create({
        user_id: userId,
        type,
        title,
        message,
        delivery_method: deliveryMethod,
        data,
        status: 'pending'
      });

      return notification;
    } catch (error) {
      console.error('Create notification error:', error);
      throw error;
    }
  }

  async sendNotification(notification) {
    try {
      const user = await User.findByPk(notification.user_id);

      if (!user) {
        throw new Error('User not found');
      }

      let result = { success: false };

      // Send via appropriate channel
      switch (notification.delivery_method) {
        case 'sms':
          result = await smsService.sendSMS(user.phone, notification.message);
          break;

        case 'email':
          // TODO: Implement email service
          console.log('📧 Email delivery not yet implemented');
          result = { success: true, sandbox: true };
          break;

        case 'push':
          // TODO: Implement push notifications
          console.log('🔔 Push notifications not yet implemented');
          result = { success: true, sandbox: true };
          break;

        case 'in_app':
          // In-app notifications are just stored in DB
          result = { success: true };
          break;

        default:
          throw new Error('Unknown delivery method');
      }

      // Update notification status
      if (result.success) {
        await notification.update({
          status: 'sent',
          sent_at: new Date()
        });
      } else {
        await notification.update({
          status: 'failed',
          error_message: result.error || 'Unknown error'
        });
      }

      return result;

    } catch (error) {
      console.error('Send notification error:', error);

      await notification.update({
        status: 'failed',
        error_message: error.message
      });

      throw error;
    }
  }

  async notifyAndSend(userId, type, title, message, deliveryMethod = 'sms', data = {}) {
    const notification = await this.createNotification(
      userId,
      type,
      title,
      message,
      deliveryMethod,
      data
    );

    await this.sendNotification(notification);

    return notification;
  }

  // Job lifecycle notifications
  async notifyJobCreated(jobId) {
    try {
      const job = await Job.findByPk(jobId, {
        include: [{ model: User, as: 'client' }]
      });

      if (!job) return;

      // Notify client
      await this.notifyAndSend(
        job.client_id,
        'job_created',
        'Job Created Successfully',
        `Your delivery job #${job.job_number} has been created. Waiting for a driver to accept.`,
        'sms',
        { jobId: job.id, jobNumber: job.job_number }
      );

    } catch (error) {
      console.error('Notify job created error:', error);
    }
  }

  async notifyJobAccepted(jobId) {
    try {
      const job = await Job.findByPk(jobId, {
        include: [
          { model: User, as: 'client' },
          { model: User, as: 'driver' }
        ]
      });

      if (!job || !job.driver) return;

      // Notify client
      const clientMessage = `Your delivery has been accepted by ${job.driver.full_name}. Vehicle: ${job.vehicle_type}. Track in the app!`;
      await this.notifyAndSend(
        job.client_id,
        'job_accepted',
        'Driver Accepted Your Job',
        clientMessage,
        'sms',
        { jobId: job.id, driverId: job.driver_id }
      );

      // Notify driver
      const driverMessage = `Job #${job.job_number} confirmed! Pickup: ${job.pickup_address}. Earnings: NAD ${job.driver_earnings}.`;
      await this.notifyAndSend(
        job.driver_id,
        'job_confirmed',
        'Job Confirmed',
        driverMessage,
        'sms',
        { jobId: job.id }
      );

    } catch (error) {
      console.error('Notify job accepted error:', error);
    }
  }

  async notifyJobStarted(jobId) {
    try {
      const job = await Job.findByPk(jobId, {
        include: [
          { model: User, as: 'client' },
          { model: User, as: 'driver' }
        ]
      });

      if (!job) return;

      const message = `${job.driver.full_name} is on the way to pick up your items. Track live in the app!`;

      await this.notifyAndSend(
        job.client_id,
        'job_started',
        'Driver On The Way',
        message,
        'sms',
        { jobId: job.id }
      );

    } catch (error) {
      console.error('Notify job started error:', error);
    }
  }

  async notifyJobCompleted(jobId) {
    try {
      const job = await Job.findByPk(jobId, {
        include: [
          { model: User, as: 'client' },
          { model: User, as: 'driver' }
        ]
      });

      if (!job) return;

      // Notify client
      const clientMessage = `Delivery completed! Your items have been delivered. Please rate your experience.`;
      await this.notifyAndSend(
        job.client_id,
        'job_completed',
        'Delivery Completed',
        clientMessage,
        'sms',
        { jobId: job.id }
      );

      // Notify driver
      const driverMessage = `Job #${job.job_number} completed! You earned NAD ${job.driver_earnings}. Great work!`;
      await this.notifyAndSend(
        job.driver_id,
        'job_completed_driver',
        'Job Completed',
        driverMessage,
        'sms',
        { jobId: job.id, earnings: job.driver_earnings }
      );

    } catch (error) {
      console.error('Notify job completed error:', error);
    }
  }

  async notifyJobCancelled(jobId, reason) {
    try {
      const job = await Job.findByPk(jobId, {
        include: [
          { model: User, as: 'client' },
          { model: User, as: 'driver' }
        ]
      });

      if (!job) return;

      // Notify client
      await this.notifyAndSend(
        job.client_id,
        'job_cancelled',
        'Job Cancelled',
        `Job #${job.job_number} has been cancelled. ${reason ? 'Reason: ' + reason : ''}`,
        'sms',
        { jobId: job.id, reason }
      );

      // Notify driver if assigned
      if (job.driver_id) {
        await this.notifyAndSend(
          job.driver_id,
          'job_cancelled',
          'Job Cancelled',
          `Job #${job.job_number} has been cancelled by the client.`,
          'sms',
          { jobId: job.id }
        );
      }

    } catch (error) {
      console.error('Notify job cancelled error:', error);
    }
  }

  async notifyPaymentReceived(jobId, transactionId) {
    try {
      const job = await Job.findByPk(jobId, {
        include: [{ model: User, as: 'client' }]
      });

      if (!job) return;

      const message = `Payment of NAD ${job.total_price} received for job #${job.job_number}. Thank you!`;

      await this.notifyAndSend(
        job.client_id,
        'payment_received',
        'Payment Received',
        message,
        'sms',
        { jobId: job.id, transactionId, amount: job.total_price }
      );

    } catch (error) {
      console.error('Notify payment received error:', error);
    }
  }

  async getUserNotifications(userId, unreadOnly = false) {
    try {
      const where = { user_id: userId };

      if (unreadOnly) {
        where.read_at = null;
      }

      const notifications = await Notification.findAll({
        where,
        order: [['created_at', 'DESC']],
        limit: 50
      });

      return notifications;

    } catch (error) {
      console.error('Get user notifications error:', error);
      throw error;
    }
  }

  async markAsRead(notificationId, userId) {
    try {
      const notification = await Notification.findOne({
        where: { id: notificationId, user_id: userId }
      });

      if (!notification) {
        throw new Error('Notification not found');
      }

      await notification.update({ read_at: new Date() });

      return notification;

    } catch (error) {
      console.error('Mark as read error:', error);
      throw error;
    }
  }

  async markAllAsRead(userId) {
    try {
      await Notification.update(
        { read_at: new Date() },
        {
          where: {
            user_id: userId,
            read_at: null
          }
        }
      );

      return { success: true };

    } catch (error) {
      console.error('Mark all as read error:', error);
      throw error;
    }
  }

  async getUnreadCount(userId) {
    try {
      const count = await Notification.count({
        where: {
          user_id: userId,
          read_at: null
        }
      });

      return count;

    } catch (error) {
      console.error('Get unread count error:', error);
      throw error;
    }
  }
}

module.exports = new NotificationService();
