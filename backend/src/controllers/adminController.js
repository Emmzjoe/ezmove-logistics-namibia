const { User, DriverProfile, Job, Transaction, Notification } = require('../models');
const { Op } = require('sequelize');
const sequelize = require('../config/database');

class AdminController {
  // User Management
  async getAllUsers(req, res) {
    try {
      if (req.user.userType !== 'admin') {
        return res.status(403).json({ error: 'Unauthorized - Admin access required' });
      }

      const { userType, status, page = 1, limit = 50 } = req.query;
      const offset = (page - 1) * limit;

      const where = {};
      if (userType) where.user_type = userType;
      if (status) where.is_active = status === 'active';

      const { count, rows: users } = await User.findAndCountAll({
        where,
        attributes: ['id', 'full_name', 'email', 'phone', 'user_type', 'is_active', 'is_verified', 'created_at', 'last_login'],
        include: [{
          model: DriverProfile,
          as: 'driverProfile',
          attributes: ['vehicle_type', 'license_plate', 'verification_status', 'rating', 'total_jobs']
        }],
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['created_at', 'DESC']]
      });

      res.json({
        success: true,
        data: {
          users,
          pagination: {
            total: count,
            page: parseInt(page),
            limit: parseInt(limit),
            pages: Math.ceil(count / limit)
          }
        }
      });

    } catch (error) {
      console.error('Get all users error:', error);
      res.status(500).json({ error: 'Failed to get users', message: error.message });
    }
  }

  async getUserDetails(req, res) {
    try {
      if (req.user.userType !== 'admin') {
        return res.status(403).json({ error: 'Unauthorized - Admin access required' });
      }

      const { id } = req.params;

      const user = await User.findByPk(id, {
        include: [
          {
            model: DriverProfile,
            as: 'driverProfile'
          },
          {
            model: Job,
            as: 'clientJobs',
            limit: 10,
            order: [['created_at', 'DESC']]
          },
          {
            model: Job,
            as: 'driverJobs',
            limit: 10,
            order: [['created_at', 'DESC']]
          },
          {
            model: Transaction,
            as: 'transactions',
            limit: 10,
            order: [['created_at', 'DESC']]
          }
        ]
      });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json({
        success: true,
        data: user
      });

    } catch (error) {
      console.error('Get user details error:', error);
      res.status(500).json({ error: 'Failed to get user details', message: error.message });
    }
  }

  async suspendUser(req, res) {
    try {
      if (req.user.userType !== 'admin') {
        return res.status(403).json({ error: 'Unauthorized - Admin access required' });
      }

      const { id } = req.params;
      const { reason } = req.body;

      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      await user.update({ is_active: false });

      // Create notification
      const notificationService = require('../services/notificationService');
      await notificationService.notifyAndSend(
        id,
        'account_suspended',
        'Account Suspended',
        `Your account has been suspended. ${reason ? 'Reason: ' + reason : 'Please contact support.'}`,
        'sms',
        { reason }
      );

      res.json({
        success: true,
        message: 'User suspended successfully',
        data: { userId: id, suspended: true }
      });

    } catch (error) {
      console.error('Suspend user error:', error);
      res.status(500).json({ error: 'Failed to suspend user', message: error.message });
    }
  }

  async activateUser(req, res) {
    try {
      if (req.user.userType !== 'admin') {
        return res.status(403).json({ error: 'Unauthorized - Admin access required' });
      }

      const { id } = req.params;

      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      await user.update({ is_active: true });

      // Create notification
      const notificationService = require('../services/notificationService');
      await notificationService.notifyAndSend(
        id,
        'account_activated',
        'Account Activated',
        'Your account has been reactivated. You can now use the platform.',
        'sms'
      );

      res.json({
        success: true,
        message: 'User activated successfully',
        data: { userId: id, active: true }
      });

    } catch (error) {
      console.error('Activate user error:', error);
      res.status(500).json({ error: 'Failed to activate user', message: error.message });
    }
  }

  // Job Management
  async getAllJobs(req, res) {
    try {
      if (req.user.userType !== 'admin') {
        return res.status(403).json({ error: 'Unauthorized - Admin access required' });
      }

      const { status, page = 1, limit = 50 } = req.query;
      const offset = (page - 1) * limit;

      const where = {};
      if (status) where.status = status;

      const { count, rows: jobs } = await Job.findAndCountAll({
        where,
        include: [
          {
            model: User,
            as: 'client',
            attributes: ['id', 'full_name', 'email', 'phone']
          },
          {
            model: User,
            as: 'driver',
            attributes: ['id', 'full_name', 'email', 'phone']
          }
        ],
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['created_at', 'DESC']]
      });

      res.json({
        success: true,
        data: {
          jobs,
          pagination: {
            total: count,
            page: parseInt(page),
            limit: parseInt(limit),
            pages: Math.ceil(count / limit)
          }
        }
      });

    } catch (error) {
      console.error('Get all jobs error:', error);
      res.status(500).json({ error: 'Failed to get jobs', message: error.message });
    }
  }

  async cancelJob(req, res) {
    try {
      if (req.user.userType !== 'admin') {
        return res.status(403).json({ error: 'Unauthorized - Admin access required' });
      }

      const { id } = req.params;
      const { reason } = req.body;

      const job = await Job.findByPk(id);
      if (!job) {
        return res.status(404).json({ error: 'Job not found' });
      }

      if (['completed', 'cancelled'].includes(job.status)) {
        return res.status(400).json({ error: 'Cannot cancel this job' });
      }

      await job.update({
        status: 'cancelled',
        cancelled_at: new Date(),
        cancellation_reason: `Admin: ${reason}`
      });

      // Notify client and driver
      const notificationService = require('../services/notificationService');
      await notificationService.notifyJobCancelled(id, `Admin cancelled: ${reason}`);

      res.json({
        success: true,
        message: 'Job cancelled successfully',
        data: { jobId: id }
      });

    } catch (error) {
      console.error('Cancel job error:', error);
      res.status(500).json({ error: 'Failed to cancel job', message: error.message });
    }
  }

  // Analytics & Reports
  async getDashboardStats(req, res) {
    try {
      if (req.user.userType !== 'admin') {
        return res.status(403).json({ error: 'Unauthorized - Admin access required' });
      }

      const { period = '30d' } = req.query;

      // Calculate date range
      const now = new Date();
      const startDate = new Date();

      switch(period) {
        case '7d':
          startDate.setDate(now.getDate() - 7);
          break;
        case '30d':
          startDate.setDate(now.getDate() - 30);
          break;
        case '90d':
          startDate.setDate(now.getDate() - 90);
          break;
        default:
          startDate.setDate(now.getDate() - 30);
      }

      // User statistics
      const totalUsers = await User.count();
      const activeUsers = await User.count({ where: { is_active: true } });
      const totalDrivers = await User.count({ where: { user_type: 'driver' } });
      const verifiedDrivers = await DriverProfile.count({ where: { verification_status: 'verified' } });
      const pendingDrivers = await DriverProfile.count({ where: { verification_status: 'pending' } });

      // Job statistics
      const totalJobs = await Job.count();
      const completedJobs = await Job.count({ where: { status: 'completed' } });
      const activeJobs = await Job.count({ where: { status: { [Op.in]: ['pending', 'accepted', 'in_progress'] } } });
      const cancelledJobs = await Job.count({ where: { status: 'cancelled' } });

      // Revenue statistics
      const revenueData = await Transaction.findAll({
        where: {
          transaction_type: 'commission',
          status: 'completed',
          created_at: { [Op.gte]: startDate }
        },
        attributes: [
          [sequelize.fn('SUM', sequelize.col('amount')), 'total_revenue'],
          [sequelize.fn('COUNT', sequelize.col('id')), 'transaction_count']
        ]
      });

      const revenue = revenueData[0]?.dataValues || {};

      // Recent activity
      const recentJobs = await Job.findAll({
        where: { created_at: { [Op.gte]: startDate } },
        attributes: [
          [sequelize.fn('DATE', sequelize.col('created_at')), 'date'],
          [sequelize.fn('COUNT', sequelize.col('id')), 'count']
        ],
        group: [sequelize.fn('DATE', sequelize.col('created_at'))],
        order: [[sequelize.fn('DATE', sequelize.col('created_at')), 'ASC']]
      });

      res.json({
        success: true,
        data: {
          period,
          users: {
            total: totalUsers,
            active: activeUsers,
            drivers: totalDrivers,
            verifiedDrivers,
            pendingDrivers
          },
          jobs: {
            total: totalJobs,
            completed: completedJobs,
            active: activeJobs,
            cancelled: cancelledJobs,
            completionRate: totalJobs > 0 ? ((completedJobs / totalJobs) * 100).toFixed(2) : 0
          },
          revenue: {
            total: parseFloat(revenue.total_revenue || 0),
            transactions: parseInt(revenue.transaction_count || 0)
          },
          activity: recentJobs.map(r => ({
            date: r.dataValues.date,
            jobs: parseInt(r.dataValues.count)
          }))
        }
      });

    } catch (error) {
      console.error('Get dashboard stats error:', error);
      res.status(500).json({ error: 'Failed to get dashboard stats', message: error.message });
    }
  }

  async getTransactions(req, res) {
    try {
      if (req.user.userType !== 'admin') {
        return res.status(403).json({ error: 'Unauthorized - Admin access required' });
      }

      const { type, status, page = 1, limit = 50 } = req.query;
      const offset = (page - 1) * limit;

      const where = {};
      if (type) where.transaction_type = type;
      if (status) where.status = status;

      const { count, rows: transactions } = await Transaction.findAndCountAll({
        where,
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'full_name', 'email', 'phone']
          },
          {
            model: Job,
            as: 'job',
            attributes: ['id', 'job_number', 'pickup_address', 'delivery_address']
          }
        ],
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['created_at', 'DESC']]
      });

      res.json({
        success: true,
        data: {
          transactions,
          pagination: {
            total: count,
            page: parseInt(page),
            limit: parseInt(limit),
            pages: Math.ceil(count / limit)
          }
        }
      });

    } catch (error) {
      console.error('Get transactions error:', error);
      res.status(500).json({ error: 'Failed to get transactions', message: error.message });
    }
  }

  async getSystemHealth(req, res) {
    try {
      if (req.user.userType !== 'admin') {
        return res.status(403).json({ error: 'Unauthorized - Admin access required' });
      }

      // Database connection status
      let dbStatus = 'connected';
      try {
        await sequelize.authenticate();
      } catch (error) {
        dbStatus = 'disconnected';
      }

      // Get active drivers
      const activeDrivers = await DriverProfile.count({
        where: {
          availability: true,
          verification_status: 'verified'
        }
      });

      // Get pending notifications
      const pendingNotifications = await Notification.count({
        where: { status: 'pending' }
      });

      // Get failed transactions in last 24 hours
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      const failedTransactions = await Transaction.count({
        where: {
          status: 'failed',
          created_at: { [Op.gte]: yesterday }
        }
      });

      res.json({
        success: true,
        data: {
          database: dbStatus,
          uptime: process.uptime(),
          environment: process.env.NODE_ENV,
          activeDrivers,
          pendingNotifications,
          failedTransactions,
          timestamp: new Date().toISOString()
        }
      });

    } catch (error) {
      console.error('Get system health error:', error);
      res.status(500).json({ error: 'Failed to get system health', message: error.message });
    }
  }
}

module.exports = new AdminController();
